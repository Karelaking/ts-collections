import {
  AbstractDeque,
  type TypeValidationOptions,
} from "../abstracts/AbstractDeque";
import type { Deque } from "../interfaces/Deque";
import type { Iterator } from "../interfaces/Iterator";
import { CollectionEmptyError } from "../errors";

/**
 * A resizable-array implementation of the Deque interface.
 *
 * Array deques have no capacity restrictions; they grow as necessary to support usage.
 * They are not thread-safe; in the absence of external synchronization, they do not support
 * concurrent access by multiple threads. Null elements are prohibited.
 *
 * This class is likely to be faster than `LinkedDeque` when used as a queue or a stack.
 *
 * @template T The type of elements in this deque
 */
const DEFAULT_CAPACITY = 16;

export class ArrayDeque<T> extends AbstractDeque<T> implements Deque<T> {
  private elements: (T | undefined)[];
  private headIndex: number;
  private tailIndex: number;
  private count: number;

  constructor(options?: TypeValidationOptions<T>) {
    super(options);
    this.elements = new Array(DEFAULT_CAPACITY).fill(undefined);
    this.headIndex = 0;
    this.tailIndex = 0;
    this.count = 0;
  }

  private resize(): void {
    const newCapacity = this.elements.length * 2;
    const newElements = new Array(newCapacity).fill(undefined);

    for (let i = 0; i < this.count; i++) {
      newElements[i] =
        this.elements[(this.headIndex + i) % this.elements.length];
    }

    this.elements = newElements;
    this.headIndex = 0;
    this.tailIndex = this.count;
  }

  /**
   * Inserts the specified element at the front of this deque.
   *
   * @param element - The element to add
   * @returns void
   * @throws {ValidationError} If the element does not match the deque's type schema
   * @example
   * deque.addFirst(1);
   */
  override addFirst(element: T): void {
    this.validateElementType(
      element,
      this.createValidationContext(
        "addFirst",
        "deque element at the front",
        element,
        this.size(),
      ),
    );

    if (this.count === this.elements.length) {
      this.resize();
    }

    this.headIndex =
      (this.headIndex - 1 + this.elements.length) % this.elements.length;
    this.elements[this.headIndex] = element;
    this.count++;
  }

  /**
   * Inserts the specified element at the end of this deque.
   *
   * @param element - The element to add
   * @returns void
   * @throws {ValidationError} If the element does not match the deque's type schema
   * @example
   * deque.addLast(1);
   */
  override addLast(element: T): void {
    this.validateElementType(
      element,
      this.createValidationContext(
        "addLast",
        "deque element at the back",
        element,
        this.size(),
      ),
    );

    if (this.count === this.elements.length) {
      this.resize();
    }

    this.elements[this.tailIndex] = element;
    this.tailIndex = (this.tailIndex + 1) % this.elements.length;
    this.count++;
  }

  /**
   * Inserts the specified element at the front of this deque.
   *
   * @param element - The element to add
   * @returns true if the element was added to this deque, else false
   * @throws {ValidationError} If the element does not match the deque's type schema
   * @example
   * deque.offerFirst(1); // returns true
   */
  override offerFirst(element: T): boolean {
    this.addFirst(element);
    return true;
  }

  /**
   * Inserts the specified element at the end of this deque.
   *
   * @param element - The element to add
   * @returns true if the element was added to this deque, else false
   * @throws {ValidationError} If the element does not match the deque's type schema
   * @example
   * deque.offerLast(1); // returns true
   */
  override offerLast(element: T): boolean {
    this.addLast(element);
    return true;
  }

  /**
   * Retrieves and removes the first element of this deque.
   *
   * @returns The head of this deque
   * @throws {CollectionEmptyError} If this deque is empty
   * @example
   * const first = deque.removeFirst();
   */
  override removeFirst(): T {
    if (this.count === 0) {
      throw new CollectionEmptyError("removeFirst", {
        collectionType: "ArrayDeque",
        operation: "removeFirst",
      });
    }

    const value = this.elements[this.headIndex];
    if (value === undefined) {
      throw new Error("Unexpected undefined value");
    }

    this.elements[this.headIndex] = undefined;
    this.headIndex = (this.headIndex + 1) % this.elements.length;
    this.count--;

    if (this.count === 0) {
      this.resetTypeInference();
    }

    return value;
  }

  /**
   * Retrieves and removes the last element of this deque.
   *
   * @returns The tail of this deque
   * @throws {CollectionEmptyError} If this deque is empty
   * @example
   * const last = deque.removeLast();
   */
  override removeLast(): T {
    if (this.count === 0) {
      throw new CollectionEmptyError("removeLast", {
        collectionType: "ArrayDeque",
        operation: "removeLast",
      });
    }

    this.tailIndex =
      (this.tailIndex - 1 + this.elements.length) % this.elements.length;
    const value = this.elements[this.tailIndex];
    if (value === undefined) {
      throw new Error("Unexpected undefined value");
    }

    this.elements[this.tailIndex] = undefined;
    this.count--;

    if (this.count === 0) {
      this.resetTypeInference();
    }

    return value;
  }

  /**
   * Retrieves and removes the first element of this deque, or returns undefined if this deque is empty.
   *
   * @returns The head of this deque, or undefined if this deque is empty
   * @example
   * const first = deque.pollFirst();
   */
  override pollFirst(): T | undefined {
    if (this.count === 0) {
      return undefined;
    }
    return this.removeFirst();
  }

  /**
   * Retrieves and removes the last element of this deque, or returns undefined if this deque is empty.
   *
   * @returns The tail of this deque, or undefined if this deque is empty
   * @example
   * const last = deque.pollLast();
   */
  override pollLast(): T | undefined {
    if (this.count === 0) {
      return undefined;
    }
    return this.removeLast();
  }

  /**
   * Retrieves, but does not remove, the first element of this deque.
   *
   * @returns The head of this deque
   * @throws {CollectionEmptyError} If this deque is empty
   * @example
   * const first = deque.getFirst();
   */
  override getFirst(): T {
    if (this.count === 0) {
      throw new CollectionEmptyError("getFirst", {
        collectionType: "ArrayDeque",
        operation: "getFirst",
      });
    }
    const value = this.elements[this.headIndex];
    if (value === undefined) {
      throw new Error("Unexpected undefined value");
    }
    return value;
  }

  /**
   * Retrieves, but does not remove, the last element of this deque.
   *
   * @returns The tail of this deque
   * @throws {CollectionEmptyError} If this deque is empty
   * @example
   * const last = deque.getLast();
   */
  override getLast(): T {
    if (this.count === 0) {
      throw new CollectionEmptyError("getLast", {
        collectionType: "ArrayDeque",
        operation: "getLast",
      });
    }
    const index =
      (this.tailIndex - 1 + this.elements.length) % this.elements.length;
    const value = this.elements[index];
    if (value === undefined) {
      throw new Error("Unexpected undefined value");
    }
    return value;
  }

  /**
   * Retrieves, but does not remove, the first element of this deque, or returns undefined if this deque is empty.
   *
   * @returns The head of this deque, or undefined if this deque is empty
   * @example
   * const first = deque.peekFirst();
   */
  override peekFirst(): T | undefined {
    if (this.count === 0) {
      return undefined;
    }
    return this.elements[this.headIndex];
  }

  /**
   * Retrieves, but does not remove, the last element of this deque, or returns undefined if this deque is empty.
   *
   * @returns The tail of this deque, or undefined if this deque is empty
   * @example
   * const last = deque.peekLast();
   */
  override peekLast(): T | undefined {
    if (this.count === 0) {
      return undefined;
    }
    const index =
      (this.tailIndex - 1 + this.elements.length) % this.elements.length;
    return this.elements[index];
  }

  /**
   * Returns the number of elements in this deque.
   *
   * @returns The number of elements in this deque
   * @example
   * const count = deque.size();
   */
  override size(): number {
    return this.count;
  }

  /**
   * Removes all of the elements from this deque.
   *
   * @returns void
   * @example
   * deque.clear();
   */
  override clear(): void {
    this.elements.fill(undefined);
    this.headIndex = 0;
    this.tailIndex = 0;
    this.count = 0;
    this.resetTypeInference();
  }

  /**
   * Returns true if this deque contains the specified element.
   *
   * @param element - The element to search for
   * @returns true if this deque contains the specified element
   * @example
   * const hasElement = deque.contains(1);
   */
  override contains(element: T): boolean {
    for (let i = 0; i < this.count; i++) {
      const index = (this.headIndex + i) % this.elements.length;
      if (this.elements[index] === element) {
        return true;
      }
    }
    return false;
  }

  /**
   * Removes the first occurrence of the specified element from this deque.
   *
   * @param element - The element to be removed from this deque, if present
   * @returns true if an element was removed as a result of this call
   * @example
   * const removed = deque.remove(1);
   */
  override remove(element: T): boolean {
    return this.removeFirstOccurrence(element);
  }

  /**
   * Removes the first occurrence of the specified element from this deque.
   *
   * @param element - The element to be removed from this deque, if present
   * @returns true if an element was removed as a result of this call
   * @example
   * const removed = deque.removeFirstOccurrence(1);
   */
  override removeFirstOccurrence(element: T): boolean {
    for (let i = 0; i < this.count; i++) {
      const index = (this.headIndex + i) % this.elements.length;
      if (this.elements[index] === element) {
        this.deleteIndex(index);
        return true;
      }
    }
    return false;
  }

  /**
   * Removes the last occurrence of the specified element from this deque.
   *
   * @param element - The element to be removed from this deque, if present
   * @returns true if an element was removed as a result of this call
   * @example
   * const removed = deque.removeLastOccurrence(1);
   */
  override removeLastOccurrence(element: T): boolean {
    for (let i = this.count - 1; i >= 0; i--) {
      const index = (this.headIndex + i) % this.elements.length;
      if (this.elements[index] === element) {
        this.deleteIndex(index);
        return true;
      }
    }
    return false;
  }

  private deleteIndex(index: number): void {
    // Calculate the logical position of the index to delete (0 to count - 1)
    let logicalIndex = index - this.headIndex;
    if (logicalIndex < 0) {
      logicalIndex += this.elements.length;
    }

    if (logicalIndex < this.count / 2) {
      // Shift elements after head up to index towards the right
      for (let i = logicalIndex; i > 0; i--) {
        const current = (this.headIndex + i) % this.elements.length;
        const prev =
          (this.headIndex + i - 1 + this.elements.length) %
          this.elements.length;
        this.elements[current] = this.elements[prev];
      }
      this.elements[this.headIndex] = undefined;
      this.headIndex = (this.headIndex + 1) % this.elements.length;
    } else {
      // Shift elements after index up to tail towards the left
      for (let i = logicalIndex; i < this.count - 1; i++) {
        const current = (this.headIndex + i) % this.elements.length;
        const next = (this.headIndex + i + 1) % this.elements.length;
        this.elements[current] = this.elements[next];
      }
      this.tailIndex =
        (this.tailIndex - 1 + this.elements.length) % this.elements.length;
      this.elements[this.tailIndex] = undefined;
    }
    this.count--;

    if (this.count === 0) {
      this.resetTypeInference();
    }
  }

  /**
   * Returns an iterator over the elements in this deque in proper sequence.
   *
   * @returns An iterator over the elements in this deque in proper sequence
   * @example
   * const iter = deque.iterator();
   * while (iter.hasNext()) {
   *   console.log(iter.next());
   * }
   */
  override iterator(): Iterator<T> {
    let i = 0;
    return {
      hasNext: () => i < this.count,
      next: () => {
        if (i >= this.count) {
          throw new Error("No more elements");
        }
        const value =
          this.elements[(this.headIndex + i) % this.elements.length];
        if (value === undefined) {
          throw new Error("No more elements");
        }
        i++;
        return value;
      },
    };
  }

  /**
   * Returns an iterator over the elements in this deque in reverse sequential order.
   *
   * @returns An iterator over the elements in this deque in reverse sequence
   * @example
   * const iter = deque.descendingIterator();
   * while (iter.hasNext()) {
   *   console.log(iter.next());
   * }
   */
  override descendingIterator(): Iterator<T> {
    let i = this.count - 1;
    return {
      hasNext: () => i >= 0,
      next: () => {
        if (i < 0) {
          throw new Error("No more elements");
        }
        const value =
          this.elements[(this.headIndex + i) % this.elements.length];
        if (value === undefined) {
          throw new Error("No more elements");
        }
        i--;
        return value;
      },
    };
  }

  /**
   * Returns an array containing all of the elements in this deque in proper sequence (from first to last element).
   *
   * @returns An array containing all of the elements in this deque
   * @example
   * const array = deque.toArray();
   */
  override toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.count; i++) {
      const value = this.elements[(this.headIndex + i) % this.elements.length];
      if (value !== undefined) {
        result.push(value);
      }
    }
    return result;
  }
}
