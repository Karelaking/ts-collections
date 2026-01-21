import type { Map, Iterator, Collection } from "../interfaces";

/**
 * Abstract base class for Map implementations.
 * Provides default implementations of putAll, clear, and iterator methods.
 * Concrete subclasses must implement: size(), isEmpty(), containsKey(), containsValue(),
 * get(), put(), remove(), keyIterator(), valueIterator(), keys(), values(), entries()
 *
 * @template K The type of keys maintained by this map
 * @template V The type of mapped values
 */
export abstract class AbstractMap<K, V> implements Map<K, V> {
  /**
   * Returns the number of key-value mappings in this map.
   * Must be implemented by subclasses.
   */
  abstract size(): number;

  /**
   * Returns true if this map contains no key-value mappings.
   * Must be implemented by subclasses.
   */
  abstract isEmpty(): boolean;

  /**
   * Returns true if this map contains a mapping for the specified key.
   * Must be implemented by subclasses.
   */
  abstract containsKey(key: K): boolean;

  /**
   * Returns true if this map maps one or more keys to the specified value.
   * Must be implemented by subclasses.
   */
  abstract containsValue(value: V): boolean;

  /**
   * Returns the value to which the specified key is mapped.
   * Must be implemented by subclasses.
   */
  abstract get(key: K): V | undefined;

  /**
   * Associates the specified value with the specified key in this map.
   * Must be implemented by subclasses.
   */
  abstract put(key: K, value: V): V | undefined;

  /**
   * Removes the mapping for the specified key from this map if present.
   * Must be implemented by subclasses.
   */
  abstract remove(key: K): V | undefined;

  /**
   * Removes all of the mappings from this map.
   * Must be implemented by subclasses.
   */
  abstract clear(): void;

  /**
   * Returns an iterator over the keys contained in this map.
   * Must be implemented by subclasses.
   */
  abstract keyIterator(): Iterator<K>;

  /**
   * Returns an iterator over the values contained in this map.
   * Must be implemented by subclasses.
   */
  abstract valueIterator(): Iterator<V>;

  /**
   * Returns a Collection view of the values contained in this map.
   * Must be implemented by subclasses.
   */
  abstract values(): Collection<V>;

  /**
   * Returns all keys in this map as an array.
   * Must be implemented by subclasses.
   */
  abstract keys(): K[];

  /**
   * Returns all key-value pairs as an array of tuples.
   * Must be implemented by subclasses.
   */
  abstract entries(): Array<[K, V]>;

  /**
   * Copies all of the mappings from the specified map to this map.
   *
   * Default implementation: iterates through all entries of the specified map
   * and puts each entry into this map.
   */
  putAll(other: Map<K, V>): void {
    const entries = other.entries();
    for (const [key, value] of entries) {
      this.put(key, value);
    }
  }
}
