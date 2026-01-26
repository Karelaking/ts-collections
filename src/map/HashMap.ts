import type { Iterator } from "../interfaces/Iterator";
import type { Collection } from "../interfaces/Collection";
import type { Map as MapInterface } from "../interfaces/Map";
import { AbstractMap, type MapTypeValidationOptions } from "../abstracts/AbstractMap";

/**
 * A hash-based Map implementation using native JavaScript Map.
 * Provides O(1) average case for put, get, and remove operations.
 * Optimized for both TypeScript and JavaScript runtimes.
 * Includes automatic runtime type validation for both keys and values by default (like Java's type-safe maps).
 *
 * @template K The type of keys in this map
 * @template V The type of values in this map
 *
 * @example
 * ```typescript
 * // Automatic type safety (enabled by default, like Java's HashMap<K,V>)
 * const map = new HashMap<string, number>();
 * map.put("a", 1);
 * map.put("b", 2);
 * console.log(map.get("a")); // 1
 * console.log(map.size()); // 2
 * map.put(123 as any, 456); // ❌ Throws TypeError (automatic!)
 * 
 * // Disable type checking if needed
 * const unvalidatedMap = new HashMap<string, number>({ strict: false });
 * unvalidatedMap.put("key", 123); // OK
 * unvalidatedMap.put(123 as any, 456); // OK (no validation)
 * ```
 */
export class HashMap<K, V> extends AbstractMap<K, V> implements MapInterface<K, V> {
  private mapEntries: globalThis.Map<K, V>;

  constructor(options?: MapTypeValidationOptions<K, V>) {
    super(options);
    this.mapEntries = new globalThis.Map<K, V>();
  }

  /**
   * Associates the specified value with the specified key in this map.
   * If the map previously contained a mapping for the key, the old value is replaced.
   * @param key The key with which the specified value is to be associated
   * @param value The value to be associated with the specified key
   * @returns The previous value associated with the key, or undefined if there was no mapping
   */
  override put(key: K, value: V): V | undefined {
    this.validateKeyType(key);
    this.validateValueType(value);
    const oldValue = this.mapEntries.get(key);
    this.mapEntries.set(key, value);
    return oldValue;
  }

  /**
   * Returns the value to which the specified key is mapped, or undefined if this map contains no mapping for the key.
   * @param key The key whose associated value is to be returned
   * @returns The value to which the specified key is mapped, or undefined if no mapping exists
   */
  override get(key: K): V | undefined {
    return this.mapEntries.get(key);
  }

  /**
   * Removes the mapping for a key from this map if it is present.
   * @param key The key whose mapping is to be removed from the map
   * @returns The previous value associated with the key, or undefined if there was no mapping
   */
  override remove(key: K): V | undefined {
    const value = this.mapEntries.get(key);
    this.mapEntries.delete(key);
    return value;
  }

  /**
   * Returns true if this map contains a mapping for the specified key.
   * @param key The key whose presence in this map is to be tested
   * @returns true if this map contains a mapping for the specified key
   */
  override containsKey(key: K): boolean {
    return this.mapEntries.has(key);
  }

  /**
   * Returns true if this map maps one or more keys to the specified value.
   * @param value The value whose presence in this map is to be tested
   * @returns true if this map maps one or more keys to the specified value
   */
  override containsValue(value: V): boolean {
    for (const v of this.mapEntries.values()) {
      if (v === value) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns the number of key-value mappings in this map.
   * @returns The number of key-value mappings in this map
   */
  override size(): number {
    return this.mapEntries.size;
  }

  /**
   * Returns true if this map contains no key-value mappings.
   * @returns true if this map contains no key-value mappings
   */
  override isEmpty(): boolean {
    return this.mapEntries.size === 0;
  }

  /**
   * Removes all of the mappings from this map.
   */
  override clear(): void {
    this.mapEntries.clear();
    this.resetTypeInference();
  }

  /**
   * Returns an iterator over the keys in this map.
   * @returns An iterator over the keys in this map
   */
  override keyIterator(): Iterator<K> {
    const keys = Array.from(this.mapEntries.keys()) as K[];
    let index = 0;

    return {
      hasNext: () => index < keys.length,
      next: () => {
        if (index >= keys.length) {
          throw new Error("No more elements");
        }
        const key = keys[index++];
        return key!;
      },
    };
  }

  /**
   * Returns an iterator over the values in this map.
   * @returns An iterator over the values in this map
   */
  override valueIterator(): Iterator<V> {
    const values = Array.from(this.mapEntries.values()) as V[];
    let index = 0;

    return {
      hasNext: () => index < values.length,
      next: () => {
        if (index >= values.length) {
          throw new Error("No more elements");
        }
        const value = values[index++];
        return value!;
      },
    };
  }

  /**
   * Returns a collection view of the values contained in this map.
   * @returns A collection view of the values contained in this map
   */
  override values(): Collection<V> {
    const valueArray = Array.from(this.mapEntries.values());
    return {
      size: () => valueArray.length,
      isEmpty: () => valueArray.length === 0,
      contains: (v: V) => valueArray.includes(v),
      add: () => {
        throw new Error("Unsupported operation");
      },
      remove: () => {
        throw new Error("Unsupported operation");
      },
      clear: () => {
        throw new Error("Unsupported operation");
      },
      toArray: () => valueArray,
      iterator: () => {
        let idx = 0;
        return {
          hasNext: () => idx < valueArray.length,
          next: () => {
            if (idx >= valueArray.length) {
              throw new Error("No more elements");
            }
            const value = valueArray[idx++];
            if (value === undefined) {
              throw new Error("Value is undefined");
            }
            return value;
          },
        };
      },
      containsAll: (other) => {
        const otherArray = other.toArray();
        return otherArray.every((v) => valueArray.includes(v));
      },
      addAll: () => {
        throw new Error("Unsupported operation");
      },
      removeAll: () => {
        throw new Error("Unsupported operation");
      },
      retainAll: () => {
        throw new Error("Unsupported operation");
      },
    };
  }

  /**
   * Returns an array of the keys contained in this map.
   * @returns An array of the keys contained in this map
   */
  override keys(): K[] {
    return Array.from(this.mapEntries.keys());
  }

  /**
   * Returns an array of the key-value pairs contained in this map.
   * @returns An array of the key-value pairs contained in this map
   */
  override entries(): Array<[K, V]> {
    return Array.from(this.mapEntries.entries());
  }
}
