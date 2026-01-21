import type { Queue } from "../interfaces";
import { AbstractCollection } from "./AbstractCollection";

/**
 * Abstract base class for Queue implementations.
 * Provides default implementations for Collection interface methods.
 * Concrete subclasses must implement: size(), isEmpty(), contains(), iterator(), clear(), toArray(),
 * and Queue-specific methods: offer(), dequeue(), poll(), element(), peek()
 *
 * @template E The type of elements in this queue
 */
export abstract class AbstractQueue<E> extends AbstractCollection<E> implements Queue<E> {
  /**
   * Inserts the specified element into the queue if it is possible to do so.
   * Must be implemented by subclasses.
   */
  abstract offer(element: E): boolean;

  /**
   * Retrieves and removes the head of this queue, or returns undefined.
   * Must be implemented by subclasses.
   */
  abstract dequeue(): E | undefined;

  /**
   * Retrieves and removes the head of this queue, or returns undefined.
   * Must be implemented by subclasses.
   */
  abstract poll(): E | undefined;

  /**
   * Retrieves, but does not remove, the head of this queue.
   * Must be implemented by subclasses.
   */
  abstract element(): E;

  /**
   * Retrieves, but does not remove, the head of this queue, or returns undefined.
   * Must be implemented by subclasses.
   */
  abstract peek(): E | undefined;

  /**
   * Removes the first occurrence of the specified element from this queue.
   * Default implementation: iterates and removes matching element.
   *
   * @returns true if an element was removed
   */
  override remove(element: E): boolean {
    const iterator = this.iterator();
    while (iterator.hasNext()) {
      if (iterator.next() === element) {
        if (iterator.remove) {
          iterator.remove();
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Adds the specified element to the queue (Collection interface).
   * Default implementation: delegates to offer()
   */
  add(element: E): boolean {
    return this.offer(element);
  }
}
