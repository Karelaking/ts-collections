import type { Iterator } from "../interfaces/Iterator";
import type { List } from "../interfaces/List";
import { AbstractList, type TypeValidationOptions } from "../abstracts/AbstractList";

/**
 * A simple array-based List implementation using dynamic resizing.
 * Vector provides the same functionality as ArrayList with O(1) random access
 * and O(n) insertion/deletion at arbitrary positions.
 * Leverages JavaScript's native array resizing for optimal performance.
 * Includes automatic runtime type validation by default.
 *
 * @template T The type of elements in this vector
 *
 * @example
 * ```typescript
 * import { Vector } from 'ts-collections';
 * import { z } from 'zod';
 * 
 * // Basic usage
 * const vector = new Vector<number>();
 * vector.add(1);
 * vector.add(2);
 * console.log(vector.size()); // 2
 * console.log(vector.get(0)); // 1
 * 
 * // With type validation
 * const strictVector = new Vector<number>({
 *   schema: z.number().positive()
 * });
 * strictVector.add(5); // OK
 * strictVector.add(-1 as any); // Throws validation error
 * ```
 */
export class Vector<T> extends AbstractList<T> implements List<T> {
  private elements: T[] = [];

  /**
   * Creates a new Vector with optional runtime type validation.
   * @param options Configuration for runtime type checking
   */
  constructor(options?: TypeValidationOptions<T>) {
    super(options);
  }

  /**
   * Appends the specified element to the end of this vector.
   * @param element The element to be appended to this vector
   * @returns true if the element was added successfully
   */
  override add(element: T): boolean {
    this.validateElementType(element);
    this.elements.push(element);
    return true;
  }

  /**
   * Returns the element at the specified position in this vector.
   * @param index The index of the element to return
   * @returns The element at the specified position in this vector
   * @throws Error if the index is out of bounds
   */
  override get(index: number): T {
    this.checkIndex(index);
    const element = this.elements[index];
    if (element === undefined) {
      throw new Error(`Element at index ${index} is undefined`);
    }
    return element;
  }

  /**
   * Replaces the element at the specified position in this vector with the specified element.
   * @param index The index of the element to replace
   * @param element The element to be stored at the specified position
   * @returns The element previously at the specified position
   * @throws Error if the index is out of bounds
   */
  override set(index: number, element: T): T {
    this.checkIndex(index);
    this.validateElementType(element);
    const oldElement = this.elements[index];
    if (oldElement === undefined) {
      throw new Error(`Element at index ${index} is undefined`);
    }
    this.elements[index] = element;
    return oldElement;
  }

  /**
   * Inserts the specified element at the specified position in this vector.
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
   * Removes the element at the specified position in this vector.
   * Shifts any subsequent elements to the left.
   * @param index The index of the element to be removed
   * @returns The element that was removed from the vector
   * @throws Error if the index is out of bounds
   */
  override removeAt(index: number): T {
    this.checkIndex(index);
    const removed = this.elements.splice(index, 1);
    const element = removed[0];
    if (element === undefined) {
      throw new Error(`Failed to remove element at index ${index}`);
    }
    return element;
  }

  /**
   * Returns the index of the first occurrence of the specified element in this vector, or -1 if this vector does not contain the element.
   * @param element The element to search for
   * @returns The index of the first occurrence of the specified element, or -1 if not found
   */
  override indexOf(element: T): number {
    return this.elements.indexOf(element);
  }

  /**
   * Returns the index of the last occurrence of the specified element in this vector, or -1 if this vector does not contain the element.
   * @param element The element to search for
   * @returns The index of the last occurrence of the specified element, or -1 if not found
   */
  override lastIndexOf(element: T): number {
    return this.elements.lastIndexOf(element);
  }

  /**
   * Returns a view of the portion of this vector between the specified fromIndex, inclusive, and toIndex, exclusive.
   * @param fromIndex The low endpoint (inclusive) of the subList
   * @param toIndex The high endpoint (exclusive) of the subList
   * @returns A new vector containing the specified range of elements
   * @throws Error if the indices are out of bounds or fromIndex > toIndex
   */
  override subList(fromIndex: number, toIndex: number): List<T> {
    if (fromIndex < 0 || toIndex > this.elements.length || fromIndex > toIndex) {
      throw new Error("Invalid index range");
    }
    const subArray = this.elements.slice(fromIndex, toIndex);
    const subList = new Vector<T>();
    for (const element of subArray) {
      subList.add(element);
    }
    return subList;
  }

  /**
   * Returns the number of elements in this vector.
   * @returns The number of elements in this vector
   */
  override size(): number {
    return this.elements.length;
  }

  /**
   * Removes all elements from this vector.
   */
  override clear(): void {
    this.elements = [];
    this.resetTypeInference();
  }

  /**
   * Returns true if this vector contains the specified element.
   * @param element The element whose presence in this vector is to be tested
   * @returns true if this vector contains the specified element
   */
  override contains(element: T): boolean {
    return this.elements.includes(element);
  }

  /**
   * Returns an iterator over the elements in this vector in proper sequence.
   * @returns An iterator over the elements in this vector
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
        index++;
        return element;
      },
    };
  }

  /**
   * Returns an array containing all elements in this vector in proper sequence.
   * @returns An array containing all elements in this vector
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
