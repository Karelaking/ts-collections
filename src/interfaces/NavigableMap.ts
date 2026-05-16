import type { SortedMap } from "./SortedMap";

/**
 * A sorted map with navigation methods returning closest matches for search targets.
 * Extends SortedMap with methods to find nearest keys relative to a given key.
 *
 * @template K key type
 * @template V value type
 *
 * @example
 * const map = new TreeMap<number, string>();
 * map.put(1, 'a'); map.put(3, 'c'); map.put(5, 'e');
 * map.lowerKey(3);   // 1
 * map.ceilingKey(4); // 5
 */
export interface NavigableMap<K, V> extends SortedMap<K, V> {
  /**
   * Returns the greatest key strictly less than the given key, or undefined if no such key exists.
   *
   * @param key - The reference key
   * @returns The greatest key strictly less than the given key, or undefined
   * @example
   * map.put(1, 'a'); map.put(3, 'c');
   * map.lowerKey(3); // 1
   */
  lowerKey(key: K): K | undefined;

  /**
   * Returns the greatest key less than or equal to the given key, or undefined if no such key exists.
   *
   * @param key - The reference key
   * @returns The greatest key less than or equal to the given key, or undefined
   * @example
   * map.put(1, 'a'); map.put(3, 'c');
   * map.floorKey(2); // 1
   */
  floorKey(key: K): K | undefined;

  /**
   * Returns the least key greater than or equal to the given key, or undefined if no such key exists.
   *
   * @param key - The reference key
   * @returns The least key greater than or equal to the given key, or undefined
   * @example
   * map.put(1, 'a'); map.put(3, 'c');
   * map.ceilingKey(2); // 3
   */
  ceilingKey(key: K): K | undefined;

  /**
   * Returns the least key strictly greater than the given key, or undefined if no such key exists.
   *
   * @param key - The reference key
   * @returns The least key strictly greater than the given key, or undefined
   * @example
   * map.put(1, 'a'); map.put(3, 'c');
   * map.higherKey(1); // 3
   */
  higherKey(key: K): K | undefined;

  /**
   * Returns a key-value pair for the least key in this map.
   *
   * @returns A tuple [key, value] for the smallest key
   * @throws Error if this map is empty
   * @example
   * map.put(2, 'b'); map.put(1, 'a');
   * map.firstEntry(); // [1, 'a']
   */
  firstEntry(): [K, V];

  /**
   * Returns a key-value pair for the greatest key in this map.
   *
   * @returns A tuple [key, value] for the largest key
   * @throws Error if this map is empty
   * @example
   * map.put(1, 'a'); map.put(3, 'c');
   * map.lastEntry(); // [3, 'c']
   */
  lastEntry(): [K, V];

  /**
   * Removes and returns a key-value pair for the least key, or undefined if this map is empty.
   *
   * @returns A tuple [key, value] for the smallest key, or undefined if empty
   * @example
   * map.put(1, 'a'); map.put(2, 'b');
   * map.pollFirstEntry(); // [1, 'a'] — map now has only key 2
   */
  pollFirstEntry(): [K, V] | undefined;

  /**
   * Removes and returns a key-value pair for the greatest key, or undefined if this map is empty.
   *
   * @returns A tuple [key, value] for the largest key, or undefined if empty
   * @example
   * map.put(1, 'a'); map.put(2, 'b');
   * map.pollLastEntry(); // [2, 'b'] — map now has only key 1
   */
  pollLastEntry(): [K, V] | undefined;
}
