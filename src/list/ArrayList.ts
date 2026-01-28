import type { Iterator } from "../interfaces/Iterator";
import type { List } from "../interfaces/List";
import { AbstractList, type TypeValidationOptions } from "../abstracts/AbstractList";


/**
 * A resizable, ordered list backed by a native array.
 *
 * This list behaves like Java’s `ArrayList`: it stores elements in insertion
 * order, supports random access by index, and grows as needed when elements
 * are appended or inserted.
 *
 * ### Performance characteristics
 * - Random access (`get`, `set`): $O(1)$
 * - Append (`add`): amortized $O(1)$
 * - Insert/remove at index (`addAt`, `removeAt`): $O(n)$ due to shifting
 * - Search (`contains`, `indexOf`, `lastIndexOf`): $O(n)$
 *
 * ### Internal behavior
 * - Elements are stored in a private `T[]` named `elements`.
 * - When runtime type validation is enabled (via `AbstractList` options),
 *   each added or replaced element is validated before storage.
 * - Index bounds checks are centralized in a private helper to keep logic
 *   consistent across methods.
 * - `subList` produces a snapshot copy, so changes to the original list do
 *   not affect the returned list.
 *
 * ### Error behavior
 * - Methods that access by index throw when the index is out of range.
 * - `get`, `set`, and `removeAt` also throw if the stored element is `undefined`.
 * - Iterator `next()` throws when no elements remain.
 *
 * @typeParam T - The element type stored in the list.
 *
 * @example
 * const list = new ArrayList<number>();
 * list.add(10);
 * list.addAt(0, 5);
 * console.log(list.get(1)); // 10
 */
export class ArrayList<T> extends AbstractList<T> implements List<T> {
  /**
   * Internal storage for list elements.
   *
   * @remarks
   * Mutations operate on this array via `push`, `splice`, and direct indexing.
   */
  private elements: T[] = [];

  /**
   * Creates a new empty list.
   *
   * @param options - Optional type-validation configuration inherited from `AbstractList`.
   * @remarks
   * When type validation is enabled, each added element is validated at runtime.
   *
   * @example
   * const list = new ArrayList<string>({ strictTypeChecking: true });
   */
  constructor(options?: TypeValidationOptions<T>) {
    super(options);
  }


  /**
   * Appends an element to the end of the list.
   *
   * @param element - The element to add.
   * @returns `true` when the element is added successfully.
   * @throws Error If the element type is invalid under the current validation rules.
   * @remarks
   * Internally uses `Array.prototype.push`.
   *
   * @example
   * const list = new ArrayList<number>();
   * list.add(42); // true
   */
  override add(element: T): boolean {
    this.validateElementType(element);
    this.elements.push(element);
    return true;
  }


  /**
   * Returns the element at the specified index.
   *
   * @param index - Zero-based position of the element.
   * @returns The element at the given index.
   * @throws Error If the index is out of bounds or the stored element is `undefined`.
   * @remarks
   * Performs index validation and then reads from the backing array.
   *
   * @example
   * const list = new ArrayList<string>();
   * list.add("a");
   * list.get(0); // "a"
   */
  override get(index: number): T {
    this.checkIndex(index);
    const element = this.elements[index];
    return element!;
  }

  /**
   * Replaces the element at the specified index.
   *
   * @param index - Zero-based position of the element to replace.
   * @param element - New element to store at the index.
   * @returns The element previously stored at the index.
   * @throws Error If the index is out of bounds or the new element fails validation.
   * @throws Error If the current element at the index is `undefined`.
   * @remarks
   * Validates the index and element type before assignment.
   *
   * @example
   * const list = new ArrayList<number>();
   * list.add(1);
   * list.set(0, 2); // returns 1
   */
  override set(index: number, element: T): T {
    this.checkIndex(index);
    this.validateElementType(element);
    const oldElement = this.elements[index];
    this.elements[index] = element;
    return oldElement!;
  }


  /**
   * Inserts an element at the specified index, shifting later elements to the right.
   *
   * @param index - Zero-based insertion position. Can be equal to `size()` to append.
   * @param element - The element to insert.
   * @throws Error If the index is out of bounds or the element fails validation.
   * @remarks
   * Uses `Array.prototype.splice` for insertion.
   *
   * @example
   * const list = new ArrayList<string>();
   * list.add("b");
   * list.addAt(0, "a");
   */
  override addAt(index: number, element: T): void {
    if (index < 0 || index > this.elements.length) {
      throw new Error(`Index out of bounds: ${index}`);
    }
    this.validateElementType(element);
    this.elements.splice(index, 0, element);
  }


  /**
   * Removes and returns the element at the specified index.
   *
   * @param index - Zero-based position of the element to remove.
   * @returns The removed element.
   * @throws Error If the index is out of bounds or removal fails.
   * @remarks
   * Uses `Array.prototype.splice`, which shifts subsequent elements left.
   *
   * @example
   * const list = new ArrayList<number>();
   * list.add(7);
   * list.removeAt(0); // 7
   */
  override removeAt(index: number): T {
    this.checkIndex(index);
    const removed = this.elements.splice(index, 1);
    const element = removed[0];
    return element!;
  }

  /**
   * Returns the index of the first occurrence of an element.
   *
   * @param element - Element to locate.
   * @returns Zero-based index of the first match, or `-1` if not found.
   * @remarks
   * Delegates to `Array.prototype.indexOf` with strict equality (`===`).
   *
   * @example
   * const list = new ArrayList<string>();
   * list.add("x");
   * list.indexOf("x"); // 0
   */
  override indexOf(element: T): number {
    return this.elements.indexOf(element);
  }


  /**
   * Returns the index of the last occurrence of an element.
   *
   * @param element - Element to locate.
   * @returns Zero-based index of the last match, or `-1` if not found.
   * @remarks
   * Delegates to `Array.prototype.lastIndexOf` with strict equality (`===`).
   *
   * @example
   * const list = new ArrayList<number>();
   * list.add(1);
   * list.add(1);
   * list.lastIndexOf(1); // 1
   */
  override lastIndexOf(element: T): number {
    return this.elements.lastIndexOf(element);
  }

  /**
   * Returns a new list containing elements in the specified range.
   *
   * @param fromIndex - Start index (inclusive).
   * @param toIndex - End index (exclusive).
   * @returns A new `ArrayList` with the selected elements.
   * @throws Error If the index range is invalid.
   * @remarks
   * Creates a snapshot using `slice` and then copies elements into a new list.
   * The returned list is independent of the original.
   *
   * @example
   * const list = new ArrayList<number>();
   * list.add(1);
   * list.add(2);
   * list.add(3);
   * const sub = list.subList(1, 3); // [2, 3]
   */
  override subList(fromIndex: number, toIndex: number): List<T> {
    if (fromIndex < 0 || toIndex > this.elements.length || fromIndex > toIndex) {
      throw new Error("Invalid index range");
    }
    const subArray = this.elements.slice(fromIndex, toIndex);
    const subList = new ArrayList<T>();
    for (const element of subArray) {
      subList.add(element);
    }
    return subList;
  }


  /**
   * Returns the number of elements in the list.
   *
   * @returns Current size of the list.
   * @remarks
   * Runs in $O(1)$ time by reading the backing array length.
   *
   * @example
   * const list = new ArrayList<number>();
   * list.size(); // 0
   */
  override size(): number {
    return this.elements.length;
  }

  /**
   * Removes all elements from the list.
   *
   * @remarks
   * Replaces the backing array with a new empty array and resets type inference.
   *
   * @example
   * const list = new ArrayList<string>();
   * list.add("a");
   * list.clear();
   */
  override clear(): void {
    this.elements = [];
    this.resetTypeInference();
  }

  /**
   * Checks whether the list contains a given element.
   *
   * @param element - Element to check.
   * @returns `true` if the element is present; otherwise `false`.
   * @remarks
   * Uses strict equality (`===`) via `Array.prototype.includes`.
   *
   * @example
   * const list = new ArrayList<number>();
   * list.add(3);
   * list.contains(3); // true
   */
  override contains(element: T): boolean {
    return this.elements.includes(element);
  }

  /**
   * Returns an iterator over the elements in insertion order.
   *
   * @returns An iterator with `hasNext()` and `next()` methods.
   * @throws Error When `next()` is called with no remaining elements.
   * @remarks
   * The iterator captures the current array reference and uses an internal index.
   * Subsequent structural modifications to the list may or may not be reflected
   * depending on how JavaScript arrays behave with direct indexing.
   *
   * @example
   * const list = new ArrayList<string>();
   * list.add("a");
   * const it = list.iterator();
   * while (it.hasNext()) {
   *   console.log(it.next());
   * }
   */
  override iterator(): Iterator<T> {
    let index = 0;
    const elements = this.elements;
    return {
      hasNext: () => index < elements.length,
      next: () => {
        if (index >= elements.length) {
          throw new Error("No more elements");
        }
        const element = elements[index];
        if (element === undefined) {
          throw new Error("Element at index is undefined");
        }
        index += 1;
        return element!;
      },
    };
  }


  /**
   * Returns a shallow copy of the list as a native array.
   *
   * @returns A new array containing the list elements.
   * @remarks
   * Uses the spread operator to copy the backing array.
   *
   * @example
   * const list = new ArrayList<number>();
   * list.add(1);
   * const arr = list.toArray(); // [1]
   */
  override toArray(): T[] {
    return [...this.elements];
  }

  /**
   * Validates that an index is within the bounds of the list.
   *
   * @param index - Zero-based index to validate.
   * @throws Error If the index is out of range.
   * @remarks
   * This method is used by read/modify operations to centralize bounds checks.
   *
   * @example
   * // Not part of the public API. Used internally before index access.
   */
  private checkIndex(index: number): void {
    if (index < 0 || index >= this.elements.length) {
      throw new Error(`Index out of bounds: ${index}`);
    }
  }
}
