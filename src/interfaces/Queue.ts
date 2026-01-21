import type { Collection } from "./Collection";

/**
 * A collection designed for holding elements prior to processing.
 * Queues provide additional insertion, extraction, and inspection operations.
 *
 * Typically, a queue orders elements in FIFO (First-In-First-Out) manner,
 * but other orderings are possible (e.g., Priority Queue, Deque).
 *
 * @template E The type of elements in this queue
 */
export interface Queue<E> extends Collection<E> {
  /**
   * Inserts the specified element into the queue if it is possible to do so
   * immediately without violating capacity restrictions.
   *
   * @param element Element to be added to the queue
   * @returns true if the element was added, false if capacity restrictions prevent it
   */
  offer(element: E): boolean;

  /**
   * Retrieves and removes the head of this queue, or returns undefined if this queue is empty.
   * Note: This method does not throw an exception when the queue is empty.
   */
  dequeue(): E | undefined;

  /**
   * Retrieves and removes the head of this queue, or returns undefined if this queue is empty.
   */
  poll(): E | undefined;

  /**
   * Retrieves, but does not remove, the head of this queue.
   *
   * @returns The element at the head of the queue
   * @throws Error if this queue is empty
   */
  element(): E;

  /**
   * Retrieves, but does not remove, the head of this queue,
   * or returns undefined if this queue is empty.
   */
  peek(): E | undefined;
}
