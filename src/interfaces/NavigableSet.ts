import type { Iterator } from "./Iterator";
import type { SortedSet } from "./SortedSet";

/**
 * A sorted set with navigation methods returning closest matches for search targets.
 * Extends SortedSet with methods to find nearest elements relative to a given value.
 *
 * @template E element type
 *
 * @example
 * const set = new TreeSet<number>();
 * set.add(1); set.add(3); set.add(5);
 * set.lower(3);   // 1
 * set.ceiling(4); // 5
 */
export interface NavigableSet<E> extends SortedSet<E> {
  /**
   * Returns the greatest element strictly less than the given element, or undefined if no such element exists.
   *
   * @param element - The reference element
   * @returns The greatest element strictly less than the given element, or undefined
   * @example
   * set.add(1); set.add(3);
   * set.lower(3); // 1
   */
  lower(element: E): E | undefined;

  /**
   * Returns the greatest element less than or equal to the given element, or undefined if no such element exists.
   *
   * @param element - The reference element
   * @returns The greatest element less than or equal to the given element, or undefined
   * @example
   * set.add(1); set.add(3);
   * set.floor(2); // 1
   */
  floor(element: E): E | undefined;

  /**
   * Returns the least element greater than or equal to the given element, or undefined if no such element exists.
   *
   * @param element - The reference element
   * @returns The least element greater than or equal to the given element, or undefined
   * @example
   * set.add(1); set.add(3);
   * set.ceiling(2); // 3
   */
  ceiling(element: E): E | undefined;

  /**
   * Returns the least element strictly greater than the given element, or undefined if no such element exists.
   *
   * @param element - The reference element
   * @returns The least element strictly greater than the given element, or undefined
   * @example
   * set.add(1); set.add(3);
   * set.higher(1); // 3
   */
  higher(element: E): E | undefined;

  /**
   * Retrieves and removes the first (lowest) element, or returns undefined if this set is empty.
   *
   * @returns The first element, or undefined if this set is empty
   * @example
   * set.add(1); set.add(2);
   * set.pollFirst(); // 1 — set now contains only 2
   */
  pollFirst(): E | undefined;

  /**
   * Retrieves and removes the last (highest) element, or returns undefined if this set is empty.
   *
   * @returns The last element, or undefined if this set is empty
   * @example
   * set.add(1); set.add(2);
   * set.pollLast(); // 2 — set now contains only 1
   */
  pollLast(): E | undefined;

  /**
   * Returns an iterator over elements in this set in descending order.
   *
   * @returns An iterator traversing elements from highest to lowest
   * @example
   * set.add(1); set.add(2); set.add(3);
   * const it = set.descendingIterator();
   * it.next(); // 3
   */
  descendingIterator(): Iterator<E>;
}
