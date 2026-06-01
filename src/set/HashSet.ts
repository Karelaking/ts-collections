import { AbstractSet } from "../abstracts/AbstractSet";
import type { Collection } from "../interfaces/Collection";
import type { Iterator } from "../interfaces/Iterator";
import type { Set as SetInterface } from "../interfaces/Set";

/**
 * A hash-based set that stores unique elements with fast lookups.
 *
 * This set behaves like Java's `HashSet`: it uses hashing for element storage,
 * prevents duplicates, and provides constant-time performance for basic operations
 * under typical conditions.
 *
 * ### Performance characteristics
 * - `add`, `remove`, `contains`: $O(1)$ average case
 * - `size`: $O(1)$
 * - `removeAll`, `retainAll`: $O(n + m)$ where $n$ is this set's size and $m$ is the other collection's size
 *
 * ### Internal behavior
 * - Backed by the native JavaScript `Set` for efficient element storage.
 * - When runtime type validation is enabled (via `AbstractSet` options),
 *   each added element is validated before insertion.
 * - Element equality uses JavaScript's `===` operator (strict equality).
 * - Duplicate elements are automatically rejected.
 *
 * ### Error behavior
 * - `add` throws if the element type is invalid under validation rules.
 * - Iterator `next()` throws when no elements remain.
 *
 * @typeParam T - The type of elements maintained by this set.
 *
 * @example
 * const set = new HashSet<number>();
 * set.add(1);
 * set.add(2);
 * console.log(set.size()); // 2
 * console.log(set.contains(1)); // true
 * set.add("text" as any); // ❌ Throws TypeError (automatic!)
 *
 * // Disable type checking if needed
 * const unvalidatedSet = new HashSet<number>({ strict: false });
 * unvalidatedSet.add(1);
 * unvalidatedSet.add("text"); // OK (no validation)
 * ```
 */
export class HashSet<T> extends AbstractSet<T> implements SetInterface<T> {
	private readonly elements: globalThis.Set<T> = new globalThis.Set<T>();

	/**
	 * Adds the specified element to this set if it is not already present.
	 * @param element The element to be added to this set
	 * @returns true if this set did not already contain the specified element
	 */
	override add(element: T): boolean {
		this.validateElementType(
			element,
			this.createValidationContext(
				"add",
				"set element",
				element,
				this.elements.size
			)
		);
		const sizeBefore = this.elements.size;
		this.elements.add(element);
		return this.elements.size > sizeBefore;
	}

	/**
	 * Removes the specified element from this set if it is present.
	 * @param element The element to be removed from this set
	 * @returns true if this set contained the specified element
	 */
	override remove(element: T): boolean {
		return this.elements.delete(element);
	}

	/**
	 * Returns true if this set contains the specified element.
	 * @param element The element whose presence in this set is to be tested
	 * @returns true if this set contains the specified element
	 */
	override contains(element: T): boolean {
		return this.elements.has(element);
	}

	/**
	 * Returns the number of elements in this set.
	 * @returns The number of elements in this set
	 */
	override size(): number {
		return this.elements.size;
	}

	/**
	 * Removes all elements from this set.
	 */
	override clear(): void {
		this.elements.clear();
		this.resetTypeInference();
	}

	/**
	 * Returns an iterator over the elements in this set.
	 * @returns An iterator over the elements in this set
	 */
	override iterator(): Iterator<T> {
		const values = Array.from(this.elements);
		let index = 0;

		return {
			hasNext: () => index < values.length,
			next: () => {
				if (index >= values.length) {
					throw new Error("No more elements");
				}
				const value = values[index++];
				if (value === undefined) {
					throw new Error("Element is undefined");
				}
				return value;
			},
		};
	}

	/**
	 * Returns an array containing all elements in this set.
	 * @returns An array containing all elements in this set
	 */
	override toArray(): T[] {
		return Array.from(this.elements);
	}

	/**
	 * Removes from this set all of its elements that are contained in the specified collection.
	 * @param elements The collection containing elements to be removed from this set
	 * @returns true if this set changed as a result of the call
	 */
	override removeAll(elements: Collection<T>): boolean {
		const otherArray = elements.toArray();
		let modified = false;

		for (const element of otherArray) {
			if (this.elements.delete(element)) {
				modified = true;
			}
		}

		return modified;
	}

	/**
	 * Retains only the elements in this set that are contained in the specified collection.
	 * @param elements The collection containing elements to be retained in this set
	 * @returns true if this set changed as a result of the call
	 */
	override retainAll(elements: Collection<T>): boolean {
		const otherSet = new globalThis.Set(elements.toArray());
		const toRemove: T[] = [];

		for (const element of this.elements) {
			if (!otherSet.has(element)) {
				toRemove.push(element);
			}
		}

		if (toRemove.length === 0) {
			return false;
		}

		for (const element of toRemove) {
			this.elements.delete(element);
		}

		return true;
	}
}
