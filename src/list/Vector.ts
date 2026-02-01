import type { Iterator } from "../interfaces/Iterator";
import type { List } from "../interfaces/List";
import { AbstractList, type TypeValidationOptions } from "../abstracts/AbstractList";

/**
 * A Vector implementation with async operation support for TypeScript.
 * 
 * Vector extends ArrayList functionality with async methods for I/O-bound operations.
 * It provides the same core List operations as ArrayList, plus additional async methods
 * for working with promises and async callbacks.
 * 
 * Features:
 * - All standard List operations (inherited from AbstractList)
 * - Async iteration methods for I/O-bound tasks
 * - Runtime type validation by default
 * - Dynamic array with automatic memory management by JavaScript
 *
 * @template T The type of elements in this vector
 *
 * @example
 * ```typescript
 * import { Vector } from 'ts-collections';
 * 
 * // Create a vector
 * const vector = new Vector<number>();
 * vector.add(1);
 * vector.add(2);
 * console.log(vector.size()); // 2
 * 
 * // Async operations for I/O-bound tasks
 * await vector.forEach(async (item) => {
 *   await saveToDatabase(item);
 * });
 * 
 * const doubled = await vector.map(async (item) => item * 2);
 * const filtered = await vector.filter(async (item) => item > 1);
 * ```
 */
export class Vector<T> extends AbstractList<T> implements List<T> {
  private elements: T[] = [];

  /**
   * Creates a new Vector with optional type validation.
   * 
   * @param options Type validation options (strict, schema, validator)
   * 
   * @example
   * ```typescript
   * // Basic vector
   * const v1 = new Vector<number>();
   * 
   * // With type validation
   * import { z } from 'zod';
   * const v2 = new Vector<number>({ schema: z.number().positive() });
   * ```
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

  // ========== Async Basic Operations ==========

  /**
   * Asynchronously adds an element from a promise or async function.
   * 
   * @param elementProvider Promise or async function that provides the element
   * @returns A promise that resolves to true if the element was added
   * 
   * @example
   * ```typescript
   * await vector.push(fetchDataFromAPI());
   * await vector.push(async () => await computeValue());
   * ```
   */
  public async push(elementProvider: Promise<T> | (() => Promise<T>)): Promise<boolean> {
    const element = typeof elementProvider === 'function' 
      ? await elementProvider() 
      : await elementProvider;
    return this.add(element);
  }

  /**
   * Asynchronously retrieves an element, useful for chaining async operations.
   * 
   * @param index The index of the element to retrieve
   * @returns A promise that resolves to the element
   * 
   * @example
   * ```typescript
   * const element = await vector.pull(0);
   * ```
   */
  public async pull(index: number): Promise<T> {
    this.checkIndex(index);
    const element = this.elements[index];
    if (element === undefined) {
      throw new Error(`Element at index ${index} is undefined`);
    }
    return element;
  }

  /**
   * Asynchronously updates an element from a promise or async function.
   * 
   * @param index The index of the element to update
   * @param elementProvider Promise or async function that provides the new element
   * @returns A promise that resolves to the previous element
   * 
   * @example
   * ```typescript
   * await vector.update(0, fetchNewValue());
   * ```
   */
  public async update(index: number, elementProvider: Promise<T> | (() => Promise<T>)): Promise<T> {
    const element = typeof elementProvider === 'function'
      ? await elementProvider()
      : await elementProvider;
    return this.set(index, element);
  }

  /**
   * Asynchronously inserts an element from a promise or async function.
   * 
   * @param index The index at which to insert
   * @param elementProvider Promise or async function that provides the element
   * 
   * @example
   * ```typescript
   * await vector.insert(0, fetchNewValue());
   * ```
   */
  public async insert(index: number, elementProvider: Promise<T> | (() => Promise<T>)): Promise<void> {
    const element = typeof elementProvider === 'function'
      ? await elementProvider()
      : await elementProvider;
    this.addAt(index, element);
  }

  /**
   * Asynchronously removes the element at the specified index.
   * 
   * @param index The index of the element to remove
   * @returns A promise that resolves to the removed element
   * 
   * @example
   * ```typescript
   * const removed = await vector.remove(0);
   * ```
   */
  public async remove(index: number): Promise<T> {
    this.checkIndex(index);
    const removed = this.elements.splice(index, 1);
    const element = removed[0];
    if (element === undefined) {
      throw new Error(`Failed to remove element at index ${index}`);
    }
    return element;
  }

  /**
   * Asynchronously removes the first element matching the async predicate.
   * 
   * @param predicate Async function to test each element
   * @returns A promise that resolves to true if an element was removed
   * 
   * @example
   * ```typescript
   * const removed = await vector.removeIf(async (item) => await shouldRemove(item));
   * ```
   */
  public async removeIf(predicate: (element: T) => Promise<boolean>): Promise<boolean> {
    for (let i = 0; i < this.elements.length; i++) {
      if (await predicate(this.elements[i] as T)) {
        this.elements.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Asynchronously checks if the vector contains the specified element.
   * 
   * @param element The element to check for
   * @returns A promise that resolves to true if found
   * 
   * @example
   * ```typescript
   * const exists = await vector.has(5);
   * ```
   */
  public async has(element: T): Promise<boolean> {
    return this.elements.includes(element);
  }

  /**
   * Asynchronously checks if any element matches the async predicate.
   * 
   * @param predicate Async function to test each element
   * @returns A promise that resolves to true if a match is found
   * 
   * @example
   * ```typescript
   * const hasMatch = await vector.hasMatching(async (item) => await matches(item));
   * ```
   */
  public async hasMatching(predicate: (element: T) => Promise<boolean>): Promise<boolean> {
    for (const element of this.elements) {
      if (await predicate(element as T)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Asynchronously removes all elements, optionally executing cleanup for each.
   * 
   * @param cleanup Optional async cleanup function for each element
   * 
   * @example
   * ```typescript
   * await vector.empty(async (item) => await cleanup(item));
   * ```
   */
  public async empty(cleanup?: (element: T) => Promise<void>): Promise<void> {
    if (cleanup) {
      for (const element of this.elements) {
        await cleanup(element as T);
      }
    }
    this.clear();
  }

  // ========== Async Collection Operations ==========

  /**
   * Performs the given action for each element asynchronously.
   * Operations are performed sequentially to maintain order.
   * 
   * @param callback Async function to execute for each element
   * 
   * @example
   * ```typescript
   * await vector.forEach(async (item, index) => {
   *   await saveToDatabase(item);
   * });
   * ```
   */
  public async forEach(callback: (element: T, index: number) => Promise<void>): Promise<void> {
    for (let i = 0; i < this.elements.length; i++) {
      await callback(this.elements[i] as T, i);
    }
  }

  /**
   * Creates a new array with the results of calling an async function on every element.
   * 
   * @param callback Async function that produces an element of the new array
   * @returns A promise that resolves to a new array
   * 
   * @example
   * ```typescript
   * const doubled = await vector.map(async (item) => item * 2);
   * ```
   */
  public async map<U>(callback: (element: T, index: number) => Promise<U>): Promise<U[]> {
    const results: U[] = [];
    for (let i = 0; i < this.elements.length; i++) {
      results.push(await callback(this.elements[i] as T, i));
    }
    return results;
  }

  /**
   * Creates a new Vector with all elements that pass the async test.
   * 
   * @param predicate Async function to test each element
   * @returns A promise that resolves to a new Vector containing filtered elements
   * 
   * @example
   * ```typescript
   * const filtered = await vector.filter(async (item) => {
   *   return await isValid(item);
   * });
   * ```
   */
  public async filter(predicate: (element: T, index: number) => Promise<boolean>): Promise<Vector<T>> {
    const result = new Vector<T>();
    for (let i = 0; i < this.elements.length; i++) {
      const element = this.elements[i] as T;
      if (await predicate(element, i)) {
        result.add(element);
      }
    }
    return result;
  }

  /**
   * Tests whether at least one element passes the async test.
   * 
   * @param predicate Async function to test each element
   * @returns A promise that resolves to true if at least one element passes the test
   * 
   * @example
   * ```typescript
   * const hasMatch = await vector.some(async (item) => {
   *   return await checkCondition(item);
   * });
   * ```
   */
  public async some(predicate: (element: T, index: number) => Promise<boolean>): Promise<boolean> {
    for (let i = 0; i < this.elements.length; i++) {
      if (await predicate(this.elements[i] as T, i)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Tests whether all elements pass the async test.
   * 
   * @param predicate Async function to test each element
   * @returns A promise that resolves to true if all elements pass the test
   * 
   * @example
   * ```typescript
   * const allValid = await vector.every(async (item) => {
   *   return await validate(item);
   * });
   * ```
   */
  public async every(predicate: (element: T, index: number) => Promise<boolean>): Promise<boolean> {
    for (let i = 0; i < this.elements.length; i++) {
      if (!(await predicate(this.elements[i] as T, i))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Finds the first element that satisfies the async predicate.
   * 
   * @param predicate Async function to test each element
   * @returns A promise that resolves to the found element, or undefined if none found
   * 
   * @example
   * ```typescript
   * const found = await vector.find(async (item) => {
   *   return await matches(item);
   * });
   * ```
   */
  public async find(predicate: (element: T, index: number) => Promise<boolean>): Promise<T | undefined> {
    for (let i = 0; i < this.elements.length; i++) {
      const element = this.elements[i] as T;
      if (await predicate(element, i)) {
        return element;
      }
    }
    return undefined;
  }

  /**
   * Finds the index of the first element that satisfies the async predicate.
   * 
   * @param predicate Async function to test each element
   * @returns A promise that resolves to the index of the found element, or -1 if none found
   * 
   * @example
   * ```typescript
   * const index = await vector.findIndex(async (item) => {
   *   return await matches(item);
   * });
   * ```
   */
  public async findIndex(predicate: (element: T, index: number) => Promise<boolean>): Promise<number> {
    for (let i = 0; i < this.elements.length; i++) {
      if (await predicate(this.elements[i] as T, i)) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Executes a reducer function on each element asynchronously, resulting in a single output value.
   * 
   * @param callback Async function to execute on each element
   * @param initialValue Initial value for the accumulator
   * @returns A promise that resolves to the accumulated result
   * 
   * @example
   * ```typescript
   * const sum = await vector.reduce(async (acc, item) => {
   *   return acc + await processItem(item);
   * }, 0);
   * ```
   */
  public async reduce<U>(
    callback: (accumulator: U, element: T, index: number) => Promise<U>,
    initialValue: U
  ): Promise<U> {
    let accumulator = initialValue;
    for (let i = 0; i < this.elements.length; i++) {
      accumulator = await callback(accumulator, this.elements[i] as T, i);
    }
    return accumulator;
  }

  private checkIndex(index: number): void {
    if (index < 0 || index >= this.elements.length) {
      throw new Error(`Index out of bounds: ${index}`);
    }
  }
}
