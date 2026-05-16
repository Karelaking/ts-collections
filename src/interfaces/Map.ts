import type { Collection } from "./Collection";
import type { Iterator } from "./Iterator";

/**
 * An object that maps keys to values. A map cannot contain duplicate keys;
 * each key can map to at most one value.
 *
 * @template K The type of keys maintained by this map
 * @template V The type of mapped values
 *
 * @example
 * const map = new HashMap<string, number>();
 * map.put('a', 1); map.put('b', 2);
 * map.get('a');          // 1
 * map.containsKey('b');  // true
 * map.size();            // 2
 */
export interface Map<K, V> {
  /**
   * Returns the number of key-value mappings in this map.
   */
  size(): number;

  /**
   * Returns the number of key-value mappings in this map (alias for size()).
   * Provided for consistency with JavaScript arrays.
   */
  get length(): number;

  /**
   * Returns true if this map contains no key-value mappings.
   */
  isEmpty(): boolean;

  /**
   * Returns true if this map contains a mapping for the specified key.
   *
   * @param key The key whose presence in this map is to be tested
   */
  containsKey(key: K): boolean;

  /**
   * Returns true if this map maps one or more keys to the specified value.
   *
   * @param value The value whose presence in this map is to be tested
   */
  containsValue(value: V): boolean;

  /**
   * Returns the value to which the specified key is mapped,
   * or undefined if this map contains no mapping for the key.
   *
   * @param key The key whose associated value is to be returned
   */
  get(key: K): V | undefined;

  /**
   * Associates the specified value with the specified key in this map.
   * If the map previously contained a mapping for the key, the old value is replaced.
   *
   * @param key Key with which the specified value is to be associated
   * @param value Value to be associated with the specified key
   * @returns The previous value associated with key, or undefined if there was no mapping
   */
  put(key: K, value: V): V | undefined;

  /**
   * Removes the mapping for the specified key from this map if present.
   *
   * @param key Key whose mapping is to be removed from the map
   * @returns The value previously associated with key, or undefined if there was no mapping
   */
  remove(key: K): V | undefined;

  /**
   * Removes the entry for the specified key only if it is currently mapped to the specified value.
   *
   * This is a TypeScript-friendly parity method for Java's overloaded remove(key, value).
   *
   * @param key Key whose mapping is to be removed
   * @param value Value expected to be currently associated with the key
   * @returns true if the entry was removed
   */
  removeEntry(key: K, value: V): boolean;

  /**
   * Returns the value to which the specified key is mapped,
   * or defaultValue if this map contains no mapping for the key.
   *
   * @param key The key whose associated value is to be returned
   * @param defaultValue The default mapping of the key
   */
  getOrDefault(key: K, defaultValue: V): V;

  /**
   * Associates the specified value with the specified key if it is not already mapped.
   *
   * @param key Key with which the specified value is to be associated
   * @param value Value to be associated with the specified key
   * @returns The current value associated with key, or undefined if there was no mapping
   */
  putIfAbsent(key: K, value: V): V | undefined;

  /**
   * Replaces the entry for the specified key only if it is currently mapped.
   *
   * @param key Key with which the specified value is associated
   * @param value Value to be associated with the specified key
   * @returns The previous value associated with key, or undefined if there was no mapping
   */
  replace(key: K, value: V): V | undefined;

  /**
   * Replaces the entry for the specified key only if currently mapped to the specified old value.
   *
   * This is a TypeScript-friendly parity method for Java's overloaded replace(key, oldValue, newValue).
   *
   * @param key Key with which the specified value is associated
   * @param oldValue Value expected to be currently associated with the specified key
   * @param newValue Value to be associated with the specified key
   * @returns true if the value was replaced
   */
  replaceEntry(key: K, oldValue: V, newValue: V): boolean;

  /**
   * If the specified key is not already associated with a value, attempts to compute its value
   * using the given mapping function and enters it into this map unless undefined.
   *
   * @param key Key with which the specified value is to be associated
   * @param mappingFunction Function to compute a value
   * @returns Current (existing or computed) value associated with key, or undefined
   */
  computeIfAbsent(key: K, mappingFunction: (key: K) => V | undefined): V | undefined;

  /**
   * If the value for the specified key is present, attempts to compute a new mapping
   * given the key and its current mapped value.
   *
   * If the remapping function returns undefined, the mapping is removed.
   *
   * @param key Key with which the specified value is associated
   * @param remappingFunction Function to compute a new value
   * @returns New value associated with the specified key, or undefined if none
   */
  computeIfPresent(
    key: K,
    remappingFunction: (key: K, value: V) => V | undefined,
  ): V | undefined;

  /**
   * Attempts to compute a mapping for the specified key and its current mapped value
   * (or undefined if there is no current mapping).
   *
   * If the remapping function returns undefined, the mapping is removed.
   *
   * @param key Key with which the specified value is associated
   * @param remappingFunction Function to compute a new value
   * @returns New value associated with the specified key, or undefined if none
   */
  compute(
    key: K,
    remappingFunction: (key: K, value: V | undefined) => V | undefined,
  ): V | undefined;

  /**
   * If the specified key is not already associated with a value or is associated with undefined,
   * associates it with the given non-null value. Otherwise, replaces the associated value with
   * the results of the given remapping function.
   *
   * If the remapping function returns undefined, the mapping is removed.
   *
   * @param key Key with which the resulting value is to be associated
   * @param value The non-null value to merge with the existing value
   * @param remappingFunction Function to recompute a value if key is already present
   * @returns New value associated with the specified key, or undefined if none
   */
  merge(
    key: K,
    value: V,
    remappingFunction: (oldValue: V, newValue: V) => V | undefined,
  ): V | undefined;

  /**
   * Copies all of the mappings from the specified map to this map.
   *
   * @param other Map containing mappings to be copied to this map
   */
  putAll(other: Map<K, V>): void;

  /**
   * Removes all of the mappings from this map.
   */
  clear(): void;

  /**
   * Returns an iterator over the keys contained in this map.
   */
  keyIterator(): Iterator<K>;

  /**
   * Returns an iterator over the values contained in this map.
   */
  valueIterator(): Iterator<V>;

  /**
   * Returns a Collection view of the values contained in this map.
   */
  values(): Collection<V>;

  /**
   * Returns all keys in this map as an array.
   */
  keys(): K[];

  /**
   * Returns all key-value pairs as an array of tuples.
   */
  entries(): Array<[K, V]>;
}
