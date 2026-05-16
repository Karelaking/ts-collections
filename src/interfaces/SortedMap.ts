import type { Map as MapInterface } from "./Map";

/**
 * A map that further provides a total ordering on its keys.
 * Keys are ordered using their natural ordering or a comparator provided at creation time.
 *
 * @template K key type
 * @template V value type
 *
 * @example
 * const map = new TreeMap<number, string>();
 * map.put(3, 'c'); map.put(1, 'a'); map.put(2, 'b');
 * map.firstKey(); // 1
 * map.lastKey();  // 3
 */
export interface SortedMap<K, V> extends MapInterface<K, V> {
  /**
   * Returns the first (lowest) key currently in this map.
   *
   * @returns The first key in this map
   * @throws Error if this map is empty
   * @example
   * map.put(2, 'b'); map.put(1, 'a');
   * map.firstKey(); // 1
   */
  firstKey(): K;

  /**
   * Returns the last (highest) key currently in this map.
   *
   * @returns The last key in this map
   * @throws Error if this map is empty
   * @example
   * map.put(1, 'a'); map.put(3, 'c');
   * map.lastKey(); // 3
   */
  lastKey(): K;

  /**
   * Returns a view of the portion of this map whose keys are less than (or equal to, if inclusive) toKey.
   *
   * @param toKey - High endpoint of the keys in the returned map
   * @param inclusive - Whether toKey is included in the returned map (default false)
   * @returns A view of the portion of this map whose keys are less than toKey
   * @example
   * map.put(1, 'a'); map.put(2, 'b'); map.put(3, 'c');
   * map.headMap(3).keys(); // [1, 2]
   */
  headMap(toKey: K, inclusive?: boolean): SortedMap<K, V>;

  /**
   * Returns a view of the portion of this map whose keys are greater than (or equal to, if inclusive) fromKey.
   *
   * @param fromKey - Low endpoint of the keys in the returned map
   * @param inclusive - Whether fromKey is included in the returned map (default true)
   * @returns A view of the portion of this map whose keys are greater than fromKey
   * @example
   * map.put(1, 'a'); map.put(2, 'b'); map.put(3, 'c');
   * map.tailMap(2).keys(); // [2, 3]
   */
  tailMap(fromKey: K, inclusive?: boolean): SortedMap<K, V>;

  /**
   * Returns a view of the portion of this map whose keys range from fromKey to toKey.
   *
   * @param fromKey - Low endpoint of the keys in the returned map
   * @param toKey - High endpoint of the keys in the returned map
   * @param fromInclusive - Whether fromKey is included (default true)
   * @param toInclusive - Whether toKey is included (default false)
   * @returns A view of the specified key range
   * @throws Error if fromKey is greater than toKey
   * @example
   * map.put(1, 'a'); map.put(2, 'b'); map.put(3, 'c'); map.put(4, 'd');
   * map.subMap(2, 4).keys(); // [2, 3]
   */
  subMap(
    fromKey: K,
    toKey: K,
    fromInclusive?: boolean,
    toInclusive?: boolean,
  ): SortedMap<K, V>;
}
