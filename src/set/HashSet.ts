import type { Iterator } from "../interfaces/Iterator";
import type { Collection } from "../interfaces/Collection";
import type { Set } from "../interfaces/Set";
import { AbstractSet, type TypeValidationOptions } from "../abstracts/AbstractSet";

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
 */
export class HashSet<T> extends AbstractSet<T> implements Set<T> {
  /**
   * Internal storage for set elements.
   * Backed by JavaScript's native `Set`.
   */
  private elements: globalThis.Set<T>;

  /**
   * Creates a new empty set.
   *
   * @param options - Optional type-validation configuration inherited from `AbstractSet`.
   *
   * @example
   * const set = new HashSet<string>();
   * const strictSet = new HashSet<number>({ strictTypeChecking: true });
   */
  constructor(options?: TypeValidationOptions<T>) {
    super(options);
    this.elements = new globalThis.Set<T>();
  }

  /**
   * Adds the specified element to this set if it is not already present.
   *
   * @param element - The element to be added to this set.
   * @returns `true` if the set did not already contain the specified element.
   * @throws Error If the element type is invalid under the current validation rules.
   *
   * @example
   * const set = new HashSet<number>();
   * set.add(1); // true
   * set.add(1); // false (already present)
   */
  override add(element: T): boolean {
    this.validateElementType(element);
    const sizeBefore = this.elements.size;
    this.elements.add(element);
    return this.elements.size > sizeBefore;
  }

  /**
   * Removes the specified element from this set if it is present.
   *
   * @param element - The element to be removed from this set.
   * @returns `true` if the set contained the specified element.
   *
   * @example
   * const set = new HashSet<number>();
   * set.add(1);
   * set.remove(1); // true
   * set.remove(1); // false (not present)
   */
  override remove(element: T): boolean {
    return this.elements.delete(element);
  }

  /**
   * Returns `true` if this set contains the specified element.
   *
   * @param element - The element whose presence in this set is to be tested.
   * @returns `true` if this set contains the specified element.
   *
   * @example
   * const set = new HashSet<string>();
   * set.add("a");
   * set.contains("a"); // true
   * set.contains("b"); // false
   */
  override contains(element: T): boolean {
    return this.elements.has(element);
  }

  /**
   * Returns the number of elements in this set.
   *
   * @returns The number of elements in this set.
   *
   * @example
   * const set = new HashSet<number>();
   * set.size(); // 0
   * set.add(1);
   * set.size(); // 1
   */
  override size(): number {
    return this.elements.size;
  }

  /**
   * Removes all elements from this set.
   *
   * @example
   * const set = new HashSet<string>();
   * set.add("a");
   * set.clear();
   * set.size(); // 0
   */
  override clear(): void {
    this.elements.clear();
    this.resetTypeInference();
  }

  /**
   * Returns an iterator over the elements in this set.
   *
   * @returns An iterator with `hasNext()` and `next()` methods.
   * @throws Error When `next()` is called with no remaining elements.
   *
   * @example
   * const set = new HashSet<string>();
   * set.add("a");
   * const it = set.iterator();
   * while (it.hasNext()) {
   *   console.log(it.next());
   * }
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
   * Returns a shallow copy of this set as a native array.
   *
   * @returns A new array containing all elements in this set.
   *
   * @example
   * const set = new HashSet<number>();
   * set.add(1);
   * set.add(2);
   * const arr = set.toArray(); // [1, 2]
   */
  override toArray(): T[] {
    return Array.from(this.elements);
  }

  /**
   * Removes from this set all of its elements that are contained in the specified collection.
   *
   * @param elements - The collection containing elements to be removed from this set.
   * @returns `true` if this set changed as a result of the call.
   *
   * @example
   * const set1 = new HashSet<number>();
   * set1.add(1);
   * set1.add(2);
   * const set2 = new HashSet<number>();
   * set2.add(1);
   * set1.removeAll(set2); // true
   * set1.contains(1); // false
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
   *
   * @param elements - The collection containing elements to be retained in this set.
   * @returns `true` if this set changed as a result of the call.
   *
   * @example
   * const set1 = new HashSet<number>();
   * set1.add(1);
   * set1.add(2);
   * const set2 = new HashSet<number>();
   * set2.add(1);
   * set1.retainAll(set2); // true
   * set1.toArray(); // [1]
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
