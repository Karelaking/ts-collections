import type { Collection } from "./Collection";

/**
 * A Collection that contains no duplicate elements.
 * This interface models the mathematical set abstraction.
 *
 * @template E The type of elements in this set
 */
export interface Set<E> extends Collection<E> {
  /**
   * Returns true if this set contains the specified element.
   *
   * @param element Element whose presence in this set is to be tested
   */
  contains(element: E): boolean;

  /**
   * Adds the specified element to this set if it is not already present.
   *
   * @param element Element to be added to this set
   * @returns true if the element was added (was not already present)
   */
  add(element: E): boolean;

  /**
   * Removes the specified element from this set if it is present.
   *
   * @param element Element to be removed from this set, if present
   * @returns true if the set contained the element and it was removed
   */
  remove(element: E): boolean;
}
