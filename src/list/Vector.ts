import type { Iterator } from "../interfaces/Iterator";
import type { List } from "../interfaces/List";
import { AbstractList, type TypeValidationOptions } from "../abstracts/AbstractList";

/**
 * A thread-safe-inspired vector implementation adapted for TypeScript.
 * Based on Java's Vector class with added async operation support.
 * 
 * Unlike Java's synchronized Vector, this TypeScript version ensures atomic operations
 * within the JavaScript event loop and provides async methods for I/O-bound tasks.
 * 
 * Features:
 * - Dynamic array with automatic capacity management
 * - Capacity increment strategy (similar to Java's capacityIncrement)
 * - All standard List operations
 * - Unique async operation methods for TypeScript
 * - Runtime type validation by default
 *
 * @template T The type of elements in this vector
 *
 * @example
 * ```typescript
 * import { Vector } from 'ts-collections';
 * 
 * // Create with default capacity (10) and doubling strategy
 * const vector = new Vector<number>();
 * vector.add(1);
 * vector.add(2);
 * console.log(vector.size()); // 2
 * console.log(vector.capacity()); // 10
 * 
 * // Create with initial capacity and capacity increment
 * const customVector = new Vector<string>({ initialCapacity: 5, capacityIncrement: 3 });
 * customVector.addElement("hello");
 * console.log(customVector.capacity()); // 5
 * 
 * // Async operations for I/O-bound tasks
 * await vector.forEachAsync(async (item) => {
 *   await someAsyncOperation(item);
 * });
 * 
 * const doubled = await vector.mapAsync(async (item) => item * 2);
 * ```
 */
export class Vector<T> extends AbstractList<T> implements List<T> {
  private elements: T[];
  private elementCount: number = 0;
  private capacityIncrement: number;

  /**
   * Creates a new Vector with optional initial capacity and capacity increment.
   * 
   * @param options Configuration object containing:
   *   - initialCapacity: The initial capacity of the vector (default: 10)
   *   - capacityIncrement: Amount to increase capacity when needed (default: 0, which means doubling)
   *   - Type validation options (strict, schema, validator)
   * 
   * @example
   * ```typescript
   * // Default: capacity 10, doubling strategy
   * const v1 = new Vector<number>();
   * 
   * // Custom initial capacity
   * const v2 = new Vector<string>({ initialCapacity: 20 });
   * 
   * // With capacity increment
   * const v3 = new Vector<number>({ initialCapacity: 10, capacityIncrement: 5 });
   * 
   * // With type validation
   * import { z } from 'zod';
   * const v4 = new Vector<number>({ schema: z.number().positive() });
   * ```
   */
  constructor(
    options?: TypeValidationOptions<T> & {
      initialCapacity?: number;
      capacityIncrement?: number;
    }
  ) {
    super(options);
    const initialCapacity = options?.initialCapacity ?? 10;
    if (initialCapacity < 0) {
      throw new Error("Illegal Capacity: " + initialCapacity);
    }
    this.elements = new Array(initialCapacity);
    this.capacityIncrement = options?.capacityIncrement ?? 0;
  }

  /**
   * Returns the current capacity of this vector.
   * The capacity is the size of the internal array used to store elements.
   * 
   * @returns The current capacity
   */
  public capacity(): number {
    return this.elements.length;
  }

  /**
   * Returns the number of elements in this vector.
   * 
   * @returns The number of elements
   */
  override size(): number {
    return this.elementCount;
  }

  /**
   * Tests if this vector has no elements.
   * 
   * @returns true if this vector has no elements
   */
  override isEmpty(): boolean {
    return this.elementCount === 0;
  }

  /**
   * Returns true if this vector contains the specified element.
   * 
   * @param element Element whose presence in this vector is to be tested
   * @returns true if this vector contains the specified element
   */
  override contains(element: T): boolean {
    return this.indexOf(element) >= 0;
  }

  /**
   * Returns the index of the first occurrence of the specified element in this vector,
   * or -1 if this vector does not contain the element.
   * 
   * @param element Element to search for
   * @returns The index of the first occurrence of the element, or -1 if not found
   */
  override indexOf(element: T): number {
    for (let i = 0; i < this.elementCount; i++) {
      if (this.elements[i] === element) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Returns the index of the last occurrence of the specified element in this vector,
   * or -1 if this vector does not contain the element.
   * 
   * @param element Element to search for
   * @returns The index of the last occurrence of the element, or -1 if not found
   */
  override lastIndexOf(element: T): number {
    for (let i = this.elementCount - 1; i >= 0; i--) {
      if (this.elements[i] === element) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Returns the element at the specified position in this vector.
   * 
   * @param index Index of the element to return
   * @returns The element at the specified position
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
   * Returns the element at the specified index (Java Vector compatibility method).
   * This is an alias for get(index).
   * 
   * @param index Index of the element to return
   * @returns The element at the specified position
   * @throws Error if the index is out of bounds
   */
  public elementAt(index: number): T {
    return this.get(index);
  }

  /**
   * Returns the first element of this vector.
   * 
   * @returns The first element
   * @throws Error if this vector is empty
   */
  public firstElement(): T {
    if (this.elementCount === 0) {
      throw new Error("Vector is empty");
    }
    const element = this.elements[0];
    if (element === undefined) {
      throw new Error("First element is undefined");
    }
    return element;
  }

  /**
   * Returns the last element of this vector.
   * 
   * @returns The last element
   * @throws Error if this vector is empty
   */
  public lastElement(): T {
    if (this.elementCount === 0) {
      throw new Error("Vector is empty");
    }
    const element = this.elements[this.elementCount - 1];
    if (element === undefined) {
      throw new Error("Last element is undefined");
    }
    return element;
  }

  /**
   * Replaces the element at the specified position in this vector with the specified element.
   * 
   * @param index Index of the element to replace
   * @param element Element to be stored at the specified position
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
   * Sets the element at the specified index (Java Vector compatibility method).
   * This is an alias for set(index, element).
   * 
   * @param element Element to be stored
   * @param index Index of the element to replace
   */
  public setElementAt(element: T, index: number): void {
    this.set(index, element);
  }

  /**
   * Appends the specified element to the end of this vector.
   * Increases the capacity if needed.
   * 
   * @param element Element to be appended
   * @returns true (as specified by Collection.add)
   */
  override add(element: T): boolean {
    this.validateElementType(element);
    this.ensureCapacityHelper(this.elementCount + 1);
    this.elements[this.elementCount++] = element;
    return true;
  }

  /**
   * Adds the specified element to the end of this vector (Java Vector compatibility method).
   * This is similar to add(element).
   * 
   * @param element Element to be added
   */
  public addElement(element: T): void {
    this.add(element);
  }

  /**
   * Inserts the specified element at the specified position in this vector.
   * Shifts elements to the right as necessary.
   * 
   * @param index Index at which the element is to be inserted
   * @param element Element to be inserted
   * @throws Error if the index is out of bounds
   */
  override addAt(index: number, element: T): void {
    if (index < 0 || index > this.elementCount) {
      throw new Error(`Index out of bounds: ${index}`);
    }
    this.validateElementType(element);
    this.ensureCapacityHelper(this.elementCount + 1);
    
    // Shift elements to the right
    for (let i = this.elementCount; i > index; i--) {
      this.elements[i] = this.elements[i - 1] as T;
    }
    
    this.elements[index] = element;
    this.elementCount++;
  }

  /**
   * Inserts the specified element at the specified index (Java Vector compatibility method).
   * This is an alias for addAt(index, element).
   * 
   * @param element Element to be inserted
   * @param index Index at which the element is to be inserted
   */
  public insertElementAt(element: T, index: number): void {
    this.addAt(index, element);
  }

  /**
   * Removes the element at the specified position in this vector.
   * Shifts any subsequent elements to the left.
   * 
   * @param index Index of the element to be removed
   * @returns The element that was removed
   * @throws Error if the index is out of bounds
   */
  override removeAt(index: number): T {
    this.checkIndex(index);
    const oldElement = this.elements[index];
    if (oldElement === undefined) {
      throw new Error(`Element at index ${index} is undefined`);
    }
    
    // Shift elements to the left
    for (let i = index; i < this.elementCount - 1; i++) {
      this.elements[i] = this.elements[i + 1] as T;
    }
    
    this.elementCount--;
    this.elements[this.elementCount] = undefined as unknown as T;
    return oldElement;
  }

  /**
   * Removes the element at the specified index (Java Vector compatibility method).
   * This is an alias for removeAt(index).
   * 
   * @param index Index of the element to be removed
   */
  public removeElementAt(index: number): void {
    this.removeAt(index);
  }

  /**
   * Removes the first occurrence of the specified element from this vector.
   * 
   * @param element Element to be removed
   * @returns true if the element was removed
   */
  public removeElement(element: T): boolean {
    const index = this.indexOf(element);
    if (index >= 0) {
      this.removeAt(index);
      return true;
    }
    return false;
  }

  /**
   * Removes all elements from this vector.
   * The vector will be empty after this call returns.
   */
  override clear(): void {
    // Clear references to help GC
    for (let i = 0; i < this.elementCount; i++) {
      this.elements[i] = undefined as unknown as T;
    }
    this.elementCount = 0;
    this.resetTypeInference();
  }

  /**
   * Removes all elements from this vector (Java Vector compatibility method).
   * This is an alias for clear().
   */
  public removeAllElements(): void {
    this.clear();
  }

  /**
   * Returns a view of the portion of this vector between the specified fromIndex,
   * inclusive, and toIndex, exclusive.
   * 
   * @param fromIndex Low endpoint (inclusive) of the subList
   * @param toIndex High endpoint (exclusive) of the subList
   * @returns A new Vector containing the specified range
   * @throws Error if indices are invalid
   */
  override subList(fromIndex: number, toIndex: number): List<T> {
    if (fromIndex < 0 || toIndex > this.elementCount || fromIndex > toIndex) {
      throw new Error("Invalid index range");
    }
    const subVector = new Vector<T>();
    for (let i = fromIndex; i < toIndex; i++) {
      subVector.add(this.elements[i] as T);
    }
    return subVector;
  }

  /**
   * Returns an array containing all of the elements in this vector in proper sequence.
   * 
   * @returns An array containing all elements
   */
  override toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.elementCount; i++) {
      result.push(this.elements[i] as T);
    }
    return result;
  }

  /**
   * Returns an iterator over the elements in this vector in proper sequence.
   * 
   * @returns An iterator over the elements
   */
  override iterator(): Iterator<T> {
    let index = 0;
    const elements = this.elements;
    const elementCount = this.elementCount;
    return {
      hasNext: () => index < elementCount,
      next: () => {
        if (index >= elementCount) {
          throw new Error("No more elements");
        }
        const element = elements[index] as T;
        index++;
        return element;
      },
    };
  }

  /**
   * Increases the capacity of this vector, if necessary, to ensure that it can hold
   * at least the number of elements specified by the minimum capacity argument.
   * 
   * @param minCapacity The desired minimum capacity
   */
  public ensureCapacity(minCapacity: number): void {
    if (minCapacity > this.elements.length) {
      this.ensureCapacityHelper(minCapacity);
    }
  }

  /**
   * Trims the capacity of this vector to be the vector's current size.
   * This can be used to minimize the storage of a vector.
   */
  public trimToSize(): void {
    const newElements = new Array(this.elementCount);
    for (let i = 0; i < this.elementCount; i++) {
      newElements[i] = this.elements[i];
    }
    this.elements = newElements;
  }

  /**
   * Sets the size of this vector. If the new size is greater than the current size,
   * undefined values are added. If the new size is less than the current size,
   * elements are removed.
   * 
   * @param newSize The new size of this vector
   * @throws Error if newSize is negative
   */
  public setSize(newSize: number): void {
    if (newSize < 0) {
      throw new Error("Illegal size: " + newSize);
    }
    
    if (newSize > this.elementCount) {
      this.ensureCapacityHelper(newSize);
    } else {
      // Clear removed elements
      for (let i = newSize; i < this.elementCount; i++) {
        this.elements[i] = undefined as unknown as T;
      }
    }
    this.elementCount = newSize;
  }

  // ========== Async Operations (TypeScript-specific) ==========

  /**
   * Asynchronously adds an element to this vector.
   * Useful when the element needs to be computed or fetched asynchronously.
   * 
   * @param elementPromise A promise that resolves to the element to add
   * @returns A promise that resolves to true when the element is added
   * 
   * @example
   * ```typescript
   * const vector = new Vector<string>();
   * await vector.addAsync(fetchDataFromAPI());
   * ```
   */
  public async addAsync(elementPromise: Promise<T>): Promise<boolean> {
    const element = await elementPromise;
    return this.add(element);
  }

  /**
   * Asynchronously removes the first occurrence of the specified element.
   * 
   * @param elementPromise A promise that resolves to the element to remove
   * @returns A promise that resolves to true if the element was removed
   * 
   * @example
   * ```typescript
   * await vector.removeAsync(Promise.resolve(someValue));
   * ```
   */
  public async removeAsync(elementPromise: Promise<T>): Promise<boolean> {
    const element = await elementPromise;
    return this.removeElement(element);
  }

  /**
   * Performs the given action for each element asynchronously.
   * Operations are performed sequentially to maintain order.
   * 
   * @param callback Async function to execute for each element
   * 
   * @example
   * ```typescript
   * await vector.forEachAsync(async (item) => {
   *   await saveToDatabase(item);
   * });
   * ```
   */
  public async forEachAsync(callback: (element: T, index: number) => Promise<void>): Promise<void> {
    for (let i = 0; i < this.elementCount; i++) {
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
   * const doubled = await vector.mapAsync(async (item) => item * 2);
   * ```
   */
  public async mapAsync<U>(callback: (element: T, index: number) => Promise<U>): Promise<U[]> {
    const results: U[] = [];
    for (let i = 0; i < this.elementCount; i++) {
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
   * const filtered = await vector.filterAsync(async (item) => {
   *   return await isValid(item);
   * });
   * ```
   */
  public async filterAsync(predicate: (element: T, index: number) => Promise<boolean>): Promise<Vector<T>> {
    const result = new Vector<T>();
    for (let i = 0; i < this.elementCount; i++) {
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
   * const hasMatch = await vector.someAsync(async (item) => {
   *   return await checkCondition(item);
   * });
   * ```
   */
  public async someAsync(predicate: (element: T, index: number) => Promise<boolean>): Promise<boolean> {
    for (let i = 0; i < this.elementCount; i++) {
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
   * const allValid = await vector.everyAsync(async (item) => {
   *   return await validate(item);
   * });
   * ```
   */
  public async everyAsync(predicate: (element: T, index: number) => Promise<boolean>): Promise<boolean> {
    for (let i = 0; i < this.elementCount; i++) {
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
   * const found = await vector.findAsync(async (item) => {
   *   return await matches(item);
   * });
   * ```
   */
  public async findAsync(predicate: (element: T, index: number) => Promise<boolean>): Promise<T | undefined> {
    for (let i = 0; i < this.elementCount; i++) {
      const element = this.elements[i] as T;
      if (await predicate(element, i)) {
        return element;
      }
    }
    return undefined;
  }

  // Private helper methods

  private ensureCapacityHelper(minCapacity: number): void {
    if (minCapacity > this.elements.length) {
      this.grow(minCapacity);
    }
  }

  private grow(minCapacity: number): void {
    const oldCapacity = this.elements.length;
    let newCapacity: number;
    
    if (this.capacityIncrement > 0) {
      // Use capacity increment
      newCapacity = oldCapacity + this.capacityIncrement;
    } else {
      // Double the capacity
      newCapacity = oldCapacity * 2;
    }
    
    // Ensure we meet minimum capacity
    if (newCapacity < minCapacity) {
      newCapacity = minCapacity;
    }
    
    const newElements = new Array(newCapacity);
    for (let i = 0; i < this.elementCount; i++) {
      newElements[i] = this.elements[i];
    }
    this.elements = newElements;
  }

  private checkIndex(index: number): void {
    if (index < 0 || index >= this.elementCount) {
      throw new Error(`Index out of bounds: ${index}`);
    }
  }
}
