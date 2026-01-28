import type { Iterator } from "../interfaces/Iterator";
import type { Queue } from "../interfaces/Queue";
import { AbstractQueue, type TypeValidationOptions } from "../abstracts/AbstractQueue";

/**
 * A FIFO queue backed by a singly linked list.
 *
 * This queue behaves like Java's `LinkedList` when used as a `Queue`: it maintains
 * insertion order, provides constant-time enqueue and dequeue operations, and supports
 * null-safe element operations.
 *
 * ### Performance characteristics
 * - `offer`, `dequeue`, `poll`: $O(1)$
 * - `peek`, `element`: $O(1)$
 * - `contains`, `remove`: $O(n)$ due to traversal
 * - `size`: $O(1)$
 *
 * ### Internal behavior
 * - Maintains `head` and `tail` pointers to the first and last nodes.
 * - Each `Node<T>` holds a value and a pointer to the next node.
 * - Elements are added at the tail and removed from the head (FIFO).
 * - When runtime type validation is enabled, each enqueued element is validated.
 *
 * ### Error behavior
 * - `element()` throws when the queue is empty.
 * - `peek()`, `poll()`, and `dequeue()` return `undefined` for an empty queue.
 * - Iterator `next()` throws when no elements remain.
 *
 * @typeParam T - The element type stored in the queue.
 *
 * @example
 * const queue = new LinkedQueue<number>();
 * queue.offer(1);
 * queue.offer(2);
 * console.log(queue.dequeue()); // 1
 * console.log(queue.size()); // 1
 */
export class LinkedQueue<T> extends AbstractQueue<T> implements Queue<T> {
  /**
   * Reference to the first node in the queue.
   * `null` when the queue is empty.
   */
  private head: Node<T> | null = null;

  /**
   * Reference to the last node in the queue.
   * `null` when the queue is empty.
   */
  private tail: Node<T> | null = null;

  /**
   * The number of elements currently stored in the queue.
   */
  private elementCount = 0;

  /**
   * Creates a new empty queue.
   *
   * @param options - Optional type-validation configuration inherited from `AbstractQueue`.
   *
   * @example
   * const queue = new LinkedQueue<string>();
   * const strictQueue = new LinkedQueue<number>({ strictTypeChecking: true });
   */
  constructor(options?: TypeValidationOptions<T>) {
    super(options);
  }

  /**
   * Inserts the specified element into the queue.
   *
   * @param element - The element to add to the queue.
   * @returns `true` when the element is added successfully.
   * @throws Error If the element type is invalid under the current validation rules.
   *
   * @example
   * const queue = new LinkedQueue<number>();
   * queue.offer(42); // true
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
   * Retrieves and removes the head of the queue.
   *
   * @returns The head of the queue, or `undefined` if the queue is empty.
   *
   * @example
   * const queue = new LinkedQueue<number>();
   * queue.offer(1);
   * queue.dequeue(); // 1
   * queue.dequeue(); // undefined
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
   * Retrieves and removes the head of the queue.
   *
   * @returns The head of the queue, or `undefined` if the queue is empty.
   *
   * @example
   * const queue = new LinkedQueue<number>();
   * queue.offer(1);
   * queue.poll(); // 1
   * queue.poll(); // undefined
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
   * Retrieves, but does not remove, the head of the queue.
   *
   * @returns The head of the queue.
   * @throws Error If the queue is empty.
   *
   * @example
   * const queue = new LinkedQueue<number>();
   * queue.offer(1);
   * queue.element(); // 1
   * queue.element(); // 1 (still there)
   */
  override element(): T {
    if (this.head === null) {
      throw new Error("Queue is empty");
    }

    return this.head.value;
  }

  /**
   * Retrieves, but does not remove, the head of the queue.
   *
   * @returns The head of the queue, or `undefined` if the queue is empty.
   *
   * @example
   * const queue = new LinkedQueue<number>();
   * queue.peek(); // undefined
   * queue.offer(1);
   * queue.peek(); // 1
   */
  override peek(): T | undefined {
    if (this.head === null) {
      return undefined;
    }

    return this.head.value;
  }

  /**
   * Returns the number of elements in the queue.
   *
   * @returns Current size of the queue.
   *
   * @example
   * const queue = new LinkedQueue<number>();
   * queue.size(); // 0
   * queue.offer(1);
   * queue.size(); // 1
   */
  override size(): number {
    return this.elementCount;
  }

  /**
   * Removes all elements from the queue.
   *
   * @example
   * const queue = new LinkedQueue<string>();
   * queue.offer("a");
   * queue.clear();
   * queue.size(); // 0
   */
  override clear(): void {
    this.head = null;
    this.tail = null;
    this.elementCount = 0;
  }

  /**
   * Checks whether the queue contains a given element.
   *
   * @param element - Element to check.
   * @returns `true` if the element is present; otherwise `false`.
   *
   * @example
   * const queue = new LinkedQueue<number>();
   * queue.offer(3);
   * queue.contains(3); // true
   * queue.contains(5); // false
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
   * Removes the first occurrence of the specified element from the queue.
   *
   * @param element - The element to be removed from the queue.
   * @returns `true` if the queue contained the specified element; otherwise `false`.
   *
   * @example
   * const queue = new LinkedQueue<number>();
   * queue.offer(1);
   * queue.offer(2);
   * queue.remove(1); // true
   * queue.remove(1); // false
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
   * Returns an iterator over the elements in insertion order.
   *
   * @returns An iterator with `hasNext()` and `next()` methods.
   * @throws Error When `next()` is called with no remaining elements.
   *
   * @example
   * const queue = new LinkedQueue<string>();
   * queue.offer("a");
   * const it = queue.iterator();
   * while (it.hasNext()) {
   *   console.log(it.next());
   * }
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
   * Returns a shallow copy of the queue as a native array.
   *
   * @returns A new array containing the queue elements in proper sequence.
   *
   * @example
   * const queue = new LinkedQueue<number>();
   * queue.offer(1);
   * queue.offer(2);
   * const arr = queue.toArray(); // [1, 2]
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
 * Node in a singly linked queue.
 *
 * Each node holds a value and maintains a pointer to the next node in the queue.
 *
 * @typeParam T - Type of value stored in the node.
 */
interface Node<T> {
  /** The value stored in this node. */
  value: T;
  /** Reference to the next node in the queue, or `null` if this is the tail. */
  next: Node<T> | null;
}
