import type { Set as SetInterface } from "./Set";

/**
 * A set that provides a total ordering on its elements.
 * Elements are ordered using their natural ordering or a comparator provided at creation time.
 *
 * @template E element type
 *
 * @example
 * const set = new TreeSet<number>();
 * set.add(3); set.add(1); set.add(2);
 * set.first(); // 1
 * set.last();  // 3
 */
export interface SortedSet<E> extends SetInterface<E> {
  /**
   * Returns the first (lowest) element currently in this set.
   *
   * @returns The first element in this set
   * @throws Error if this set is empty
   * @example
   * set.add(3); set.add(1); set.add(2);
   * set.first(); // 1
   */
  first(): E;

  /**
   * Returns the last (highest) element currently in this set.
   *
   * @returns The last element in this set
   * @throws Error if this set is empty
   * @example
   * set.add(1); set.add(3);
   * set.last(); // 3
   */
  last(): E;

  /**
   * Returns a view of the portion of this set whose elements are less than (or equal to, if inclusive) toElement.
   *
   * @param toElement - High endpoint of the elements in the returned set
   * @param inclusive - Whether toElement is included in the returned set (default false)
   * @returns A view of the portion of this set whose elements are less than toElement
   * @example
   * set.add(1); set.add(2); set.add(3);
   * set.headSet(3).toArray(); // [1, 2]
   */
  headSet(toElement: E, inclusive?: boolean): SortedSet<E>;

  /**
   * Returns a view of the portion of this set whose elements are greater than (or equal to, if inclusive) fromElement.
   *
   * @param fromElement - Low endpoint of the elements in the returned set
   * @param inclusive - Whether fromElement is included in the returned set (default true)
   * @returns A view of the portion of this set whose elements are greater than fromElement
   * @example
   * set.add(1); set.add(2); set.add(3);
   * set.tailSet(2).toArray(); // [2, 3]
   */
  tailSet(fromElement: E, inclusive?: boolean): SortedSet<E>;

  /**
   * Returns a view of the portion of this set whose elements range from fromElement to toElement.
   *
   * @param fromElement - Low endpoint of the elements in the returned set
   * @param toElement - High endpoint of the elements in the returned set
   * @param fromInclusive - Whether fromElement is included (default true)
   * @param toInclusive - Whether toElement is included (default false)
   * @returns A view of the specified element range
   * @throws Error if fromElement is greater than toElement
   * @example
   * set.add(1); set.add(2); set.add(3); set.add(4);
   * set.subSet(2, 4).toArray(); // [2, 3]
   */
  subSet(
    fromElement: E,
    toElement: E,
    fromInclusive?: boolean,
    toInclusive?: boolean,
  ): SortedSet<E>;
}
