import type { Iterator } from "../interfaces/Iterator";
import type { List } from "../interfaces/List";
import { AbstractList, type TypeValidationOptions } from "../abstracts/AbstractList";

/**
 * A simple array-based List implementation using dynamic resizing.
 * Provides O(1) random access and O(n) insertion/deletion at arbitrary positions.
 * Leverages JavaScript's native array resizing for optimal performance.
 * Includes automatic runtime type validation by default (like Java's type-safe collections).
 *
 * @template T The type of elements in this list
 *
 * @example
 * ```typescript
 * import { ArrayList } from 'ts-collections';
 * import { z } from 'zod';
 * 
 * // Automatic type safety (enabled by default, like Java)
 * const list = new ArrayList<number>();
 * list.add(1);
 * list.add(2);
 * console.log(list.size()); // 2
 * console.log(list.get(0)); // 1
 * list.add("text" as any); // ✗ Throws TypeError: type mismatch (automatic!)
 * 
 * // Disable type checking if needed
 * const unvalidatedList = new ArrayList<number>({ strict: false });
 * unvalidatedList.add(1);
 * unvalidatedList.add("text"); // OK (no validation)
 * 
 * // Advanced: With Zod schema for complex validation (power users)
 * const strictList = new ArrayList<number>({
 *   schema: z.number().positive()
 * });
 * strictList.add(5); // OK
 * strictList.add(-1 as any); // ✗ Throws: "Validation failed: Number must be greater than 0"
 * 
 * // Advanced: With custom validator (power users)
 * const validatedList = new ArrayList<number>({
 *   validator: (val) => typeof val === 'number' && val > 0
 * });
 * ```
 */
export class ArrayList<T> extends AbstractList<T> implements List<T> {
  private elements: T[] = [];

  /**
   * Creates a new ArrayList with optional runtime type validation.
   * @param options Configuration for runtime type checking
   */
  constructor(options?: TypeValidationOptions<T>) {
    super(options);
  }

  /**
   * Appends the specified element to the end of this list.
   * @param element The element to be appended to this list
   * @returns true if the element was added successfully
   */
  override add(element: T): boolean {
    this.validateElementType(element);
    this.elements.push(element);
    return true;
  }

  /**
   * Returns the element at the specified position in this list.
   * @param index The index of the element to return
   * @returns The element at the specified position in this list
   * @throws Error if the index is out of bounds
   */
  override get(index: number): T {
    this.checkIndex(index);
    const element = this.elements[index];
    return element!;
  }

  /**
   * Replaces the element at the specified position in this list with the specified element.
   * @param index The index of the element to replace
   * @param element The element to be stored at the specified position
   * @returns The element previously at the specified position
   * @throws Error if the index is out of bounds
   */
  override set(index: number, element: T): T {
    this.checkIndex(index);
    this.validateElementType(element);
    const oldElement = this.elements[index];
    this.elements[index] = element;
    return oldElement!;
  }

  /**
   * Inserts the specified element at the specified position in this list.
   * Shifts the element currently at that position (if any) and any subsequent elements to the right.
   * @param index The index at which the specified element is to be inserted
   * @param element The element to be inserted
   * @throws Error if the index is out of bounds
   */
  override addAt(index: number, element: T): void {
    if (index < 0 || index > this.elements.length) {
      throw new Error(`Index out of bounds: ${index}`);
    }
    this.validateElementType(element);
    this.elements.splice(index, 0, element);
  }

  /**
   * Removes the element at the specified position in this list.
   * Shifts any subsequent elements to the left.
   * @param index The index of the element to be removed
   * @returns The element that was removed from the list
   * @throws Error if the index is out of bounds
   */
  override removeAt(index: number): T {
    this.checkIndex(index);
    const removed = this.elements.splice(index, 1);
    const element = removed[0];
    return element!;
  }

  /**
   * Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element.
   * @param element The element to search for
   * @returns The index of the first occurrence of the specified element, or -1 if not found
   */
  override indexOf(element: T): number {
    return this.elements.indexOf(element);
  }

  /**
   * Returns the index of the last occurrence of the specified element in this list, or -1 if this list does not contain the element.
   * @param element The element to search for
   * @returns The index of the last occurrence of the specified element, or -1 if not found
   */
  override lastIndexOf(element: T): number {
    return this.elements.lastIndexOf(element);
  }

  /**
   * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
   * @param fromIndex The low endpoint (inclusive) of the subList
   * @param toIndex The high endpoint (exclusive) of the subList
   * @returns A new list containing the specified range of elements
   * @throws Error if the indices are out of bounds or fromIndex > toIndex
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
   * Returns the number of elements in this list.
   * @returns The number of elements in this list
   */
  override size(): number {
    return this.elements.length;
  }

  /**
   * Removes all elements from this list.
   */
  override clear(): void {
    this.elements = [];
    this.resetTypeInference();
  }

  /**
   * Returns true if this list contains the specified element.
   * @param element The element whose presence in this list is to be tested
   * @returns true if this list contains the specified element
   */
  override contains(element: T): boolean {
    return this.elements.includes(element);
  }

  /**
   * Returns an iterator over the elements in this list in proper sequence.
   * @returns An iterator over the elements in this list
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
        index += 1;
        return element!;
      },
    };
  }

  /**
   * Returns an array containing all elements in this list in proper sequence.
   * @returns An array containing all elements in this list
   */
  override toArray(): T[] {
    return [...this.elements];
  }

  private checkIndex(index: number): void {
    if (index < 0 || index >= this.elements.length) {
      throw new Error(`Index out of bounds: ${index}`);
    }
  }
}
