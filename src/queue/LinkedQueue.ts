import type { Iterator } from "../interfaces/Iterator";
import type { Queue } from "../interfaces/Queue";
import { AbstractQueue, type TypeValidationOptions } from "../abstracts/AbstractQueue";

/**
 * A linked list-based Queue implementation.
 * Provides O(1) enqueue and dequeue operations.
 * Uses a doubly-linked list internally.
 * Includes automatic runtime type validation by default (like Java's type-safe queues).
 *
 * @template T The type of elements in this queue
 *
 * @example
 * ```typescript
 * // Automatic type safety (enabled by default, like Java)
 * const queue = new LinkedQueue<number>();
 * queue.offer(1);
 * queue.offer(2);
 * console.log(queue.dequeue()); // 1
 * console.log(queue.size()); // 1
 * queue.offer("text" as any); // ❌ Throws TypeError (automatic!)
 * 
 * // Disable type checking if needed
 * const unvalidatedQueue = new LinkedQueue<number>({ strict: false });
 * unvalidatedQueue.offer(1);
 * unvalidatedQueue.offer("text"); // OK (no validation)
 * ```
 */
export class LinkedQueue<T> extends AbstractQueue<T> implements Queue<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  private elementCount = 0;

  constructor(options?: TypeValidationOptions<T>) {
    super(options);
  }

  /**
   * Inserts the specified element into this queue if it is possible to do so immediately without violating capacity restrictions.
   * @param element The element to add
   * @returns true if the element was added to this queue, else false
   */
  override offer(element: T): boolean {
    this.validateElementType(element);
    const newNode: Node<T> = { value: element, next: null };

    if (this.tail === null) {
      this.head = newNode;
    } else {
      this.tail.next = newNode;
    }

    this.tail = newNode;
    this.elementCount += 1;
    return true;
  }

  /**
   * Retrieves and removes the head of this queue.
   * @returns The head of this queue, or undefined if this queue is empty
   */
  override dequeue(): T | undefined {
    if (this.head === null) {
      return undefined;
    }

    const value = this.head.value;
    this.head = this.head.next;
    this.elementCount -= 1;

    if (this.head === null) {
      this.tail = null;
    }

    return value;
  }

  /**
   * Retrieves and removes the head of this queue, or returns undefined if this queue is empty.
   * @returns The head of this queue, or undefined if this queue is empty
   */
  override poll(): T | undefined {
    if (this.head === null) {
      return undefined;
    }

    const value = this.head.value;
    this.head = this.head.next;
    this.elementCount -= 1;

    if (this.head === null) {
      this.tail = null;
    }

    return value;
  }

  /**
   * Retrieves, but does not remove, the head of this queue.
   * @returns The head of this queue
   * @throws Error if this queue is empty
   */
  override element(): T {
    if (this.head === null) {
      throw new Error("Queue is empty");
    }

    return this.head.value;
  }

  /**
   * Retrieves, but does not remove, the head of this queue, or returns undefined if this queue is empty.
   * @returns The head of this queue, or undefined if this queue is empty
   */
  override peek(): T | undefined {
    if (this.head === null) {
      return undefined;
    }

    return this.head.value;
  }

  /**
   * Returns the number of elements in this queue.
   * @returns The number of elements in this queue
   */
  override size(): number {
    return this.elementCount;
  }

  /**
   * Removes all elements from this queue.
   */
  override clear(): void {
    this.head = null;
    this.tail = null;
    this.elementCount = 0;
  }

  /**
   * Returns true if this queue contains the specified element.
   * @param element The element whose presence in this queue is to be tested
   * @returns true if this queue contains the specified element
   */
  override contains(element: T): boolean {
    let current = this.head;
    while (current !== null) {
      if (current.value === element) {
        return true;
      }
      current = current.next;
    }
    return false;
  }

  /**
   * Removes the first occurrence of the specified element from this queue, if it is present.
   * @param element The element to be removed from this queue
   * @returns true if this queue contained the specified element
   */
  override remove(element: T): boolean {
    if (this.head === null) {
      return false;
    }

    // Check if head matches
    if (this.head.value === element) {
      this.head = this.head.next;
      if (this.head === null) {
        this.tail = null;
      }
      this.elementCount -= 1;
      return true;
    }

    // Search for element in the rest of the list
    let current = this.head;
    while (current !== null && current.next !== null) {
      if (current.next.value === element) {
        current.next = current.next.next;
        if (current.next === null) {
          this.tail = current;
        }
        this.elementCount -= 1;
        return true;
      }
      current = current.next;
    }

    return false;
  }

  /**
   * Returns an iterator over the elements in this queue in proper sequence.
   * @returns An iterator over the elements in this queue
   */
  override iterator(): Iterator<T> {
    let current = this.head;

    return {
      hasNext: () => current !== null,
      next: () => {
        if (current === null) {
          throw new Error("No more elements");
        }
        const value = current.value;
        current = current.next;
        return value;
      },
    };
  }

  /**
   * Returns an array containing all elements in this queue in proper sequence.
   * @returns An array containing all elements in this queue
   */
  override toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current !== null) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
}

/**
 * Internal node structure for the linked queue.
 * @template T The type of value stored in the node
 */
interface Node<T> {
  value: T;
  next: Node<T> | null;
}
