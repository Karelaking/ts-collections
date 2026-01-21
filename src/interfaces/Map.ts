import type { Collection } from "./Collection";
import type { Iterator } from "./Iterator";

/**
 * An object that maps keys to values. A map cannot contain duplicate keys;
 * each key can map to at most one value.
 *
 * @template K The type of keys maintained by this map
 * @template V The type of mapped values
 */
export interface Map<K, V> {
  /**
   * Returns the number of key-value mappings in this map.
   */
  size(): number;

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
