import type { Iterator } from "./Iterator";

/**
 * The root interface in the Collection hierarchy.
 * A Collection represents a group of objects, known as its elements.
 *
 * Some collections allow duplicate elements and others do not.
 * Some are ordered and others unordered.
 *
 * @template E The type of elements in this collection
 */
export interface Collection<E> {
  /**
   * Returns the number of elements in this collection.
   */
  size(): number;

  /**
   * Returns the number of elements in this collection (alias for size()).
   * Provided for consistency with JavaScript arrays.
   */
  get length(): number;

  /**
   * Returns true if this collection contains no elements.
   */
  isEmpty(): boolean;

  /**
   * Returns true if this collection contains the specified element.
   *
   * @param element Element whose presence in this collection is to be tested
   */
  contains(element: E): boolean;

  /**
   * Returns an iterator over the elements in this collection.
   */
  iterator(): Iterator<E>;

  /**
   * Returns an array containing all of the elements in this collection.
   */
  toArray(): E[];

  /**
   * Adds the specified element to this collection (optional operation).
   *
   * @param element Element to be added to this collection
   * @returns true if the element was added successfully, false otherwise
   */
  add(element: E): boolean;

  /**
   * Removes a single instance of the specified element from this
   * collection, if it is present (optional operation).
   *
   * @param element Element to be removed from this collection, if present
   * @returns true if an element was removed as a result of this call
   */
  remove(element: E): boolean;

  /**
   * Returns true if this collection contains all of the elements
   * in the specified collection.
   *
   * @param elements Collection to be checked for containment in this collection
   */
  containsAll(elements: Collection<E>): boolean;

  /**
   * Adds all of the elements in the specified collection to this collection
   * (optional operation).
   *
   * @param elements Collection containing elements to be added to this collection
   * @returns true if this collection changed as a result of the call
   */
  addAll(elements: Collection<E>): boolean;

  /**
   * Removes all of this collection's elements that are also contained in the
   * specified collection (optional operation).
   *
   * @param elements Collection containing elements to be removed from this collection
   * @returns true if this collection changed as a result of the call
   */
  removeAll(elements: Collection<E>): boolean;

  /**
   * Retains only the elements in this collection that are contained in the
   * specified collection (optional operation).
   *
   * @param elements Collection containing elements to be retained in this collection
   * @returns true if this collection changed as a result of the call
   */
  retainAll(elements: Collection<E>): boolean;

  /**
   * Removes all of the elements from this collection (optional operation).
   */
  clear(): void;
}
