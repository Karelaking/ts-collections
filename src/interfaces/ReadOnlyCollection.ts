import type { Iterator } from "./Iterator";

/**
 * A read-only view over a collection of elements.
 *
 * This interface exposes inspection and traversal operations only.
 * It is used for collection views that should not support mutation.
 *
 * @template E The type of elements in this collection view
 */
export interface ReadOnlyCollection<E> {
  /**
   * Returns the number of elements in this collection view.
   */
  size(): number;

  /**
   * Returns the number of elements in this collection view (alias for size()).
   */
  get length(): number;

  /**
   * Returns true if this collection view contains no elements.
   */
  isEmpty(): boolean;

  /**
   * Returns true if this collection view contains the specified element.
   *
   * @param element Element whose presence in this collection view is to be tested
   */
  contains(element: E): boolean;

  /**
   * Returns an iterator over the elements in this collection view.
   */
  iterator(): Iterator<E>;

  /**
   * Returns an array containing all of the elements in this collection view.
   */
  toArray(): E[];

  /**
   * Returns true if this collection view contains all of the elements
   * in the specified collection view.
   *
   * @param elements Collection view to be checked for containment
   */
  containsAll(elements: ReadOnlyCollection<E>): boolean;
}