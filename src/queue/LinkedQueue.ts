import type { Iterator } from "../interfaces/Iterator";
import type { Queue } from "../interfaces/Queue";
import { AbstractQueue } from "../abstracts/AbstractQueue";

/**
 * A linked list-based Queue implementation.
 * Provides O(1) enqueue and dequeue operations.
 * Uses a doubly-linked list internally.
 *
 * @template T The type of elements in this queue
 *
 * @example
 * ```typescript
 * const queue = new LinkedQueue<number>();
 * queue.offer(1);
 * queue.offer(2);
 * console.log(queue.dequeue()); // 1
 * console.log(queue.size()); // 1
 * ```
 */
export class LinkedQueue<T> extends AbstractQueue<T> implements Queue<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  private elementCount = 0;

  override offer(element: T): boolean {
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

  override element(): T {
    if (this.head === null) {
      throw new Error("Queue is empty");
    }

    return this.head.value;
  }

  override peek(): T | undefined {
    if (this.head === null) {
      return undefined;
    }

    return this.head.value;
  }

  override size(): number {
    return this.elementCount;
  }

  override clear(): void {
    this.head = null;
    this.tail = null;
    this.elementCount = 0;
  }

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
