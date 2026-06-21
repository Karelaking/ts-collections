import type { ZodSchema } from "zod";
import { ZodError } from "zod";
import { TypeMismatchError, ValidationError } from "../errors";
import type { AsyncIterator } from "../interfaces/AsyncIterator";
import type { Collection, Iterator } from "../interfaces";
import {
	describeValidationValue,
	toValidationIssues,
	type ValidationContext,
} from "../utils/validation";

/**
 * Options for runtime type validation in collections.
 *
 * By default, collections automatically enforce type consistency based on the first element added
 * (similar to Java's generics), requiring NO additional configuration from the user.
 *
 * For advanced use cases, power users can provide Zod schemas or custom validators.
 */
export interface TypeValidationOptions<T> {
	/**
	 * Optional Zod schema for advanced validation beyond basic type checking.
	 * Only used if strict mode is enabled.
	 * Power users can provide schemas for comprehensive validation:
	 * - Value constraints (positive numbers, email formats, etc.)
	 * - Complex object structure validation
	 * - Custom validation rules
	 *
	 * @example
	 * ```typescript
	 * import { z } from 'zod';
	 *
	 * // Advanced: validate that numbers are positive
	 * const list = new ArrayList<number>({
	 *   schema: z.number().positive()
	 * });
	 * ```
	 *
	 * @default undefined (only basic type checking is performed)
	 */
	schema?: ZodSchema<T>;
	/**
	 * If false, disables automatic runtime type checking.
	 * Default: true (type safety is ON by default, like Java generics).
	 *
	 * **⚠️ Warning:** Setting `strict: false` removes the runtime safety net that prevents
	 * mixed-type collections. TypeScript's compile-time types will still appear correct,
	 * but the collection will silently accept values of any type at runtime. This can lead
	 * to subtle bugs that are hard to trace — for example, a `number[]` collection that
	 * quietly contains strings, causing unexpected NaN results in arithmetic operations.
	 *
	 * **When `strict: false` is appropriate:**
	 * - Migrating legacy JavaScript code that stores mixed types temporarily
	 * - Interoperating with untyped external data sources (e.g., raw JSON) where you own
	 *   the validation externally
	 * - Performance-critical hot paths where you have already validated types upstream
	 *   and the per-element overhead of runtime checking is measurable
	 *
	 * **What breaks when you disable strict mode:**
	 * - Runtime type mismatch errors are silenced — mixed-type collections are allowed
	 * - IDE autocompletion and type inference remain correct at the TypeScript level,
	 *   but runtime values may not match the declared generic type `<T>`
	 * - Downstream code that assumes type homogeneity (e.g., `list.get(0) * 2`) can
	 *   produce `NaN`, `undefined`, or thrown exceptions unexpectedly
	 * - Debugging mixed-type bugs is significantly harder since errors surface far from
	 *   the point of insertion
	 *
	 * **Performance note:** Strict mode adds a small per-`add` overhead for type inference
	 * on the first element and type comparison on subsequent elements. In most applications
	 * this is negligible. Only disable strict mode for performance if you have profiling
	 * data confirming it is a bottleneck.
	 *
	 * @default true
	 *
	 * @example
	 * ```typescript
	 * // Default — type safety on (recommended for all new code)
	 * const list = new ArrayList<number>();
	 * list.add(1);          // ✓ OK
	 * list.add("text");     // ✗ TypeError: type mismatch (caught at runtime)
	 *
	 * // strict: false — use only when you own the type guarantee externally
	 * const list = new ArrayList<number>({ strict: false });
	 * list.add(1);          // ✓ OK
	 * list.add("text");     // ✓ Silently accepted — runtime type is now mixed
	 * list.get(1) * 2;      // NaN — "text" * 2 fails silently at runtime
	 * ```
	 */
	strict?: boolean;

	/**
	 * Optional custom validation function for advanced use cases.
	 * Only used if strict mode is enabled and no Zod schema is provided.
	 *
	 * @example
	 * ```typescript
	 * const list = new ArrayList<number>({
	 *   validator: (val) => typeof val === 'number' && val > 0 && val < 100
	 * });
	 * ```
	 *
	 * @default undefined (only basic type checking is performed)
	 */
	validator?: (value: unknown) => boolean;
}

/**
 * Abstract base class for Collection implementations.
 * Provides default implementations of aggregate operations (containsAll, addAll, removeAll, retainAll).
 *
 * **Type Safety by Default:** Collections automatically enforce type consistency based on the first element added,
 * just like Java's Collections Framework. No additional configuration needed!
 *
 * For advanced use cases, you can optionally provide Zod schemas or custom validators for more comprehensive validation.
 *
 * Concrete subclasses must implement: size(), isEmpty(), contains(), iterator(), add(), remove(), toArray(), clear()
 *
 * @template E The type of elements in this collection
 *
 * @example
 * ```typescript
 * import { ArrayList } from 'ts-collections';
 *
 * // Type-safe by default - just like Java!
 * const list = new ArrayList<number>();
 * list.add(1);
 * list.add(2);
 * console.log(list.size()); // 2
 *
 * // This throws TypeError automatically:
 * list.add("text"); // ✗ Type mismatch: expected number, but got string
 *
 * // For advanced validation beyond basic type checking:
 * import { z } from 'zod';
 *
 * const strictNumbers = new ArrayList<number>({
 *   schema: z.number().int().positive() // Numbers must be positive integers
 * });
 *
 * strictNumbers.add(5);   // ✓ OK
 * strictNumbers.add(-1);  // ✗ Number must be greater than 0
 * strictNumbers.add(3.14); // ✗ Expected integer
 * ```
 */
export abstract class AbstractCollection<E> implements Collection<E> {
	protected typeValidator?: (value: unknown) => boolean;
	protected schema?: ZodSchema<E>;
	protected strict = true; // ✓ DEFAULT: Type safety is ON (like Java)
	protected inferredType?: string | undefined;

	protected createValidationContext(
		operation: string,
		targetDescription: string,
		targetValue: unknown,
		sizeBefore?: number
	): ValidationContext {
		return {
			collectionType: this.constructor.name,
			operation,
			targetDescription,
			targetValue,
			...(sizeBefore === undefined ? {} : { sizeBefore }),
		};
	}

	/**
	 * Initializes the collection with optional type validation settings.
	 *
	 * By default, collections are type-safe (strict mode on).
	 * This means the first element determines the type, and all subsequent
	 * elements must match that type - just like Java!
	 *
	 * @param options Configuration for type validation
	 */
	constructor(options?: TypeValidationOptions<E>) {
		if (options) {
			this.strict = options.strict ?? true; // Default to true (type-safe)

			if (options.schema) {
				this.schema = options.schema;
			}
			if (options.validator) {
				this.typeValidator = options.validator;
			}
		}
	}

	/**
	 * Returns the number of elements in this collection.
	 * Must be implemented by subclasses.
	 */
	abstract size(): number;

	/**
	 * Returns the number of elements in this collection (alias for size()).
	 * Provided for consistency with JavaScript arrays.
	 */
	get length(): number {
		return this.size();
	}

	/**
	 * Returns true if this collection contains no elements.
	 * Default implementation checks if size is 0.
	 */
	isEmpty(): boolean {
		return this.size() === 0;
	}

	/**
	 * Returns true if this collection contains the specified element.
	 * Must be implemented by subclasses.
	 */
	abstract contains(element: E): boolean;

	/**
	 * Returns an iterator over the elements in this collection.
	 * Must be implemented by subclasses.
	 */
	abstract iterator(): Iterator<E>;

	/**
	 * Returns an array containing all of the elements in this collection.
	 * Must be implemented by subclasses.
	 */
	abstract toArray(): E[];

	/**
	 * Adds the specified element to this collection.
	 * Must be implemented by subclasses.
	 */
	abstract add(element: E): boolean;

	/**
	 * Removes a single instance of the specified element from this collection.
	 * Must be implemented by subclasses.
	 */
	abstract remove(element: E): boolean;

	/**
	 * Removes all of the elements from this collection.
	 * Must be implemented by subclasses.
	 */
	abstract clear(): void;

	/**
	 * Returns an async iterator over the elements in this collection.
	 *
	 * Each call to `hasNext()` and `next()` returns a Promise, making it
	 * suitable for use in async pipelines and `for await...of` loops.
	 *
	 * The default implementation wraps the synchronous iterator, so
	 * subclasses do not need to override this unless they have a genuinely
	 * asynchronous data source.
	 *
	 * @example
	 * ```typescript
	 * const list = new ArrayList<number>();
	 * list.add(1); list.add(2);
	 *
	 * // Explicit async iterator
	 * const it = list.asyncIterator();
	 * while (await it.hasNext()) {
	 *   console.log(await it.next());
	 * }
	 *
	 * // for-await-of loop (uses Symbol.asyncIterator)
	 * for await (const item of list) {
	 *   console.log(item);
	 * }
	 * ```
	 */
	asyncIterator(): AsyncIterator<E> {
		const syncIt = this.iterator();
		return {
			hasNext: () => Promise.resolve(syncIt.hasNext()),
			next: () => {
				try {
					return Promise.resolve(syncIt.next());
				} catch (error) {
					return Promise.reject(error);
				}
			},
		};
	}

	/**
	 * Implements the TC39 AsyncIterable protocol so that collections can be
	 * used directly in `for await...of` loops.
	 *
	 * @example
	 * ```typescript
	 * for await (const item of list) {
	 *   await processAsync(item);
	 * }
	 * ```
	 */
	[Symbol.asyncIterator](): globalThis.AsyncIterator<E> {
		const asyncIt = this.asyncIterator();
		return {
			next: async () => {
				const hasMore = await asyncIt.hasNext();
				if (!hasMore) {
					return { done: true as const, value: undefined as unknown as E };
				}
				const value = await asyncIt.next();
				return { done: false as const, value };
			},
		};
	}

	/**
	 * Returns true if this collection contains all of the elements
	 * in the specified collection.
	 *
	 * Default implementation: iterates through elements of the specified collection
	 * and checks if each element is contained in this collection.
	 *
	 * Time Complexity: O(n * m) where n is size of this collection and m is size of specified collection
	 * (assuming contains() is O(n) and iterator() is O(m))
	 */
	containsAll(elements: Collection<E>): boolean {
		const iterator = elements.iterator();
		while (iterator.hasNext()) {
			if (!this.contains(iterator.next())) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Adds all of the elements in the specified collection to this collection.
	 *
	 * Default implementation: iterates through elements of the specified collection
	 * or iterable and adds each element.
	 *
	 * @returns true if this collection changed as a result of the call
	 */
	addAll(elements: Collection<E> | Iterable<E>): boolean {
		let modified = false;
		for (const element of this.iterateElements(elements)) {
			if (this.add(element)) {
				modified = true;
			}
		}
		return modified;
	}

	/**
	 * Determines whether the provided value is a Collection implementation.
	 */
	private isCollection(
		elements: Collection<E> | Iterable<E>
	): elements is Collection<E> {
		return typeof (elements as Collection<E>).iterator === "function";
	}

	/**
	 * Iterates over collection or iterable elements with a unified code path.
	 */
	private *iterateElements(
		elements: Collection<E> | Iterable<E>
	): Generator<E, void, undefined> {
		if (this.isCollection(elements)) {
			const iterator = elements.iterator();
			while (iterator.hasNext()) {
				yield iterator.next();
			}
			return;
		}

		yield* elements;
	}

	/**
	 * Removes all of this collection's elements that are also contained in the
	 * specified collection or iterable.
	 *
	 * Default implementation: snapshots the current elements and removes those
	 * that are present in the provided collection/iterable.
	 *
	 * @returns true if this collection changed as a result of the call
	 */
	removeAll(elements: Collection<E> | Iterable<E>): boolean {
		let modified = false;
		const elementsToRemove = new globalThis.Set(this.iterateElements(elements));
		for (const element of this.toArray()) {
			if (elementsToRemove.has(element) && this.remove(element)) {
				modified = true;
			}
		}
		return modified;
	}

	/**
	 * Retains only the elements in this collection that are contained in the
	 * specified collection or iterable.
	 *
	 * Default implementation: snapshots the current elements and removes those
	 * that are not present in the provided collection/iterable.
	 *
	 * @returns true if this collection changed as a result of the call
	 */
	retainAll(elements: Collection<E> | Iterable<E>): boolean {
		let modified = false;
		const elementsToKeep = new globalThis.Set(this.iterateElements(elements));
		for (const element of this.toArray()) {
			if (!elementsToKeep.has(element) && this.remove(element)) {
				modified = true;
			}
		}
		return modified;
	}

	/**
	 * Validates the type of an element before adding it to the collection.
	 * Uses a cascading validation strategy: Zod schema > Custom validator > Strict type checking.
	 *
	 * By default (strict=true), enforces type consistency:
	 * - First element added determines the type
	 * - All subsequent elements must match that type
	 * - No configuration needed! (Just like Java)
	 *
	 * @param element The element to validate
	 * @throws {ValidationError} If Zod schema validation fails
	 * @throws {TypeError} If custom validator fails
	 * @throws {TypeMismatchError} If type inference fails
	 */
	protected validateElementType(
		element: unknown,
		context?: ValidationContext
	): void {
		// Only validate if strict mode is enabled
		if (!this.strict) {
			return;
		}

		const validationContext =
			context ??
			this.createValidationContext("validate", "element", element, this.size());

		// Zod schema takes highest precedence (for power users)
		if (this.schema) {
			try {
				this.schema.parse(element);
			} catch (error) {
				if (error instanceof ZodError) {
					const issues = toValidationIssues(error);
					const message = `${validationContext.collectionType}.${validationContext.operation}() validation failed`;
					throw new ValidationError(
						message,
						issues,
						{
							collectionType: validationContext.collectionType,
							operation: validationContext.operation,
						},
						element,
						error
					);
				}
				throw error;
			}
			return;
		}

		// Custom validator takes second precedence
		if (this.typeValidator) {
			if (!this.typeValidator(element)) {
				throw new TypeError(
					`${validationContext.collectionType}.${validationContext.operation}() validation failed: Expected value matching custom validator for ${validationContext.targetDescription}, but got ${describeValidationValue(element)}`
				);
			}
			return;
		}

		// Default: Strict type inference (like Java's generics)
		// Type is inferred from first element and enforced on all subsequent elements
		const currentSize = this.size();
		if (currentSize === 0) {
			// First element: infer type
			this.inferredType = this.getTypeString(element);
		} else {
			// Subsequent elements: must match inferred type
			const elementType = this.getTypeString(element);
			if (elementType !== this.inferredType) {
				throw new TypeMismatchError(
					this.inferredType || "unknown",
					elementType,
					{
						collectionType: validationContext.collectionType,
						operation: validationContext.operation,
					}
				);
			}
		}
	}

	/**
	 * Resets the inferred type. Should be called when the collection is cleared.
	 */
	protected resetTypeInference(): void {
		this.inferredType = undefined;
	}

	/**
	 * Gets a string representation of the type of a value.
	 * @param value The value to get the type of
	 * @returns String representing the type
	 */
	private getTypeString(value: unknown): string {
		if (value === null) {
			return "null";
		}
		if (value === undefined) {
			return "undefined";
		}
		if (Array.isArray(value)) {
			return "array";
		}
		return typeof value;
	}

	/**
	 * Checks if this collection has schema validation enabled (power users).
	 * @returns true if a Zod schema is configured
	 */
	protected hasSchemaValidation(): boolean {
		return this.schema !== undefined;
	}

	/**
	 * Gets the validation mode as a string for debugging.
	 * @returns Description of the current validation mode
	 */
	protected getValidationMode(): string {
		if (!this.strict) {
			return "No validation (strict: false)";
		}
		if (this.schema) {
			return "Zod schema (power user mode)";
		}
		if (this.typeValidator) {
			return "Custom validator (power user mode)";
		}
		return "Strict type inference (default - like Java)";
	}
}
