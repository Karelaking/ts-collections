/**
 * Iterator interface for traversing collection elements.
 * Follows the Iterator pattern similar to Java's Iterator.
 *
 * @template E The type of elements in the iteration
 */
export interface Iterator<E> {
  /**
   * Returns true if the iteration has more elements.
   */
  hasNext(): boolean;

  /**
   * Returns the next element in the iteration.
   *
   * @throws Error if the iteration has no more elements
   */
  next(): E;

  /**
   * Removes the last element returned by the iterator.
   * Optional operation; implementations may throw UnsupportedOperationError.
   *
   * @throws Error if the underlying collection was modified during iteration
   */
  remove?(): void;
}
