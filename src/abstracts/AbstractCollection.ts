import type { Iterator, Collection } from "../interfaces";
import { z, type ZodSchema } from "zod";

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
   * If false, disables automatic type checking.
   * Default: true (type safety is ON by default, like Java)
   * 
   * @example
   * ```typescript
   * // Type safety enabled by default
   * const list = new ArrayList<number>();
   * list.add(1);        // ✓ OK
   * list.add("text");   // ✗ TypeError: Type mismatch
   * 
   * // Disable if needed (not recommended)
   * const list = new ArrayList<number>({ strict: false });
   * list.add("text");   // ✓ Now allowed (not type-safe)
   * ```
   */
  strict?: boolean;
  
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
  protected strict: boolean = true; // ✓ DEFAULT: Type safety is ON (like Java)
  protected inferredType?: string;

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
   * and adds each element.
   *
   * @returns true if this collection changed as a result of the call
   */
  addAll(elements: Collection<E>): boolean {
    let modified = false;
    const iterator = elements.iterator();
    while (iterator.hasNext()) {
      if (this.add(iterator.next())) {
        modified = true;
      }
    }
    return modified;
  }

  /**
   * Removes all of this collection's elements that are also contained in the
   * specified collection.
   *
   * Default implementation: iterates through elements of this collection
   * and removes those that are in the specified collection.
   *
   * @returns true if this collection changed as a result of the call
   */
  removeAll(elements: Collection<E>): boolean {
    let modified = false;
    const iterator = this.iterator();
    while (iterator.hasNext()) {
      if (elements.contains(iterator.next())) {
        if (iterator.remove) {
          iterator.remove();
          modified = true;
        }
      }
    }
    return modified;
  }

  /**
   * Retains only the elements in this collection that are contained in the
   * specified collection.
   *
   * Default implementation: iterates through elements of this collection
   * and removes those that are NOT in the specified collection.
   *
   * @returns true if this collection changed as a result of the call
   */
  retainAll(elements: Collection<E>): boolean {
    let modified = false;
    const iterator = this.iterator();
    while (iterator.hasNext()) {
      if (!elements.contains(iterator.next())) {
        if (iterator.remove) {
          iterator.remove();
          modified = true;
        }
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
   * @throws {TypeError} If type validation fails
   */
  protected validateElementType(element: unknown): void {
    // Only validate if strict mode is enabled
    if (!this.strict) {
      return;
    }

    // Zod schema takes highest precedence (for power users)
    if (this.schema) {
      try {
        this.schema.parse(element);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const issues = error.issues
            .map(issue => {
              const path = issue.path.length > 0 ? `${issue.path.join('.')}` : 'root';
              return `${path}: ${issue.message}`;
            })
            .join('; ');
          throw new TypeError(`Validation failed: ${issues}`);
        }
        throw error;
      }
      return;
    }

    // Custom validator takes second precedence
    if (this.typeValidator) {
      if (!this.typeValidator(element)) {
        throw new TypeError(
          'Type validation failed: element does not match the expected type'
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
        throw new TypeError(
          `Type mismatch: expected ${this.inferredType}, but got ${elementType}`
        );
      }
    }
  }

  /**
   * Resets the inferred type. Should be called when the collection is cleared.
   */
  protected resetTypeInference(): void {
    delete this.inferredType;
  }

  /**
   * Gets a string representation of the type of a value.
   * @param value The value to get the type of
   * @returns String representing the type
   */
  private getTypeString(value: unknown): string {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (Array.isArray(value)) return "array";
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
      return 'No validation (strict: false)';
    }
    if (this.schema) {
      return 'Zod schema (power user mode)';
    }
    if (this.typeValidator) {
      return 'Custom validator (power user mode)';
    }
    return 'Strict type inference (default - like Java)';
  }
}
