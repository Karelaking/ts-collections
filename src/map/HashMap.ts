import type { Iterator } from "../interfaces/Iterator";
import type { Collection } from "../interfaces/Collection";
import type { Map as MapInterface } from "../interfaces/Map";
import { AbstractMap, type MapTypeValidationOptions } from "../abstracts/AbstractMap";

/**
 * A hash-based map that stores key-value pairs with fast lookups.
 *
 * This map behaves like Java's `HashMap`: it uses hashing for key storage,
 * supports null-safe operations, and provides constant-time performance for
 * basic operations under typical conditions.
 *
 * ### Performance characteristics
 * - `put`, `get`, `remove`: $O(1)$ average case
 * - `containsKey`: $O(1)$ average case
 * - `containsValue`: $O(n)$ due to full iteration
 * - `size`, `isEmpty`: $O(1)$
 *
 * ### Internal behavior
 * - Backed by the native JavaScript `Map` for efficient key-value storage.
 * - When runtime type validation is enabled (via `AbstractMap` options),
 *   each key and value is validated before insertion.
 * - Key equality uses JavaScript's `===` operator (strict equality).
 * - The `values()` method returns a snapshot collection view.
 *
 * ### Error behavior
 * - `put` throws if the key or value type is invalid under validation rules.
 * - Iterator `next()` throws when no elements remain.
 * - Collection views returned by `values()` throw on mutating operations.
 *
 * @typeParam K - The type of keys maintained by this map.
 * @typeParam V - The type of mapped values.
 *
 * @example
 * const map = new HashMap<string, number>();
 * map.put("a", 1);
 * map.put("b", 2);
 * console.log(map.get("a")); // 1
 * console.log(map.size()); // 2
 */
export class HashMap<K, V> extends AbstractMap<K, V> implements MapInterface<K, V> {
  /**
   * Internal storage for key-value mappings.
   * Backed by JavaScript's native `Map`.
   */
  private mapEntries: globalThis.Map<K, V>;

  /**
   * Creates a new empty map.
   *
   * @param options - Optional type-validation configuration inherited from `AbstractMap`.
   *
   * @example
   * const map = new HashMap<string, number>();
   * const strictMap = new HashMap<string, number>({ strict: true });
   */
  constructor(options?: MapTypeValidationOptions<K, V>) {
    super(options);
    this.mapEntries = new globalThis.Map<K, V>();
  }

  /**
   * Associates the specified value with the specified key in this map.
   *
   * If the map previously contained a mapping for the key, the old value is replaced.
   *
   * @param key - The key with which the specified value is to be associated.
   * @param value - The value to be associated with the specified key.
   * @returns The previous value associated with the key, or `undefined` if there was no mapping.
   * @throws Error If the key or value type is invalid under the current validation rules.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.put("a", 1); // undefined
   * map.put("a", 2); // 1
   */
  override put(key: K, value: V): V | undefined {
    this.validateKeyType(key);
    this.validateValueType(value);
    const oldValue = this.mapEntries.get(key);
    this.mapEntries.set(key, value);
    return oldValue;
  }

  /**
   * Returns the value to which the specified key is mapped.
   *
   * @param key - The key whose associated value is to be returned.
   * @returns The value to which the specified key is mapped, or `undefined` if no mapping exists.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.put("a", 1);
   * map.get("a"); // 1
   * map.get("b"); // undefined
   */
  override get(key: K): V | undefined {
    return this.mapEntries.get(key);
  }

  /**
   * Removes the mapping for a key from this map if it is present.
   *
   * @param key - The key whose mapping is to be removed from the map.
   * @returns The previous value associated with the key, or `undefined` if there was no mapping.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.put("a", 1);
   * map.remove("a"); // 1
   * map.remove("a"); // undefined
   */
  override remove(key: K): V | undefined {
    const value = this.mapEntries.get(key);
    this.mapEntries.delete(key);
    return value;
  }

  /**
   * Returns `true` if this map contains a mapping for the specified key.
   *
   * @param key - The key whose presence in this map is to be tested.
   * @returns `true` if this map contains a mapping for the specified key.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.put("a", 1);
   * map.containsKey("a"); // true
   * map.containsKey("b"); // false
   */
  override containsKey(key: K): boolean {
    return this.mapEntries.has(key);
  }

  /**
   * Returns `true` if this map maps one or more keys to the specified value.
   *
   * @param value - The value whose presence in this map is to be tested.
   * @returns `true` if this map maps one or more keys to the specified value.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.put("a", 1);
   * map.containsValue(1); // true
   * map.containsValue(2); // false
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
   *
   * @returns The number of key-value mappings in this map.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.size(); // 0
   * map.put("a", 1);
   * map.size(); // 1
   */
  override size(): number {
    return this.mapEntries.size;
  }

  /**
   * Returns `true` if this map contains no key-value mappings.
   *
   * @returns `true` if this map contains no key-value mappings.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.isEmpty(); // true
   * map.put("a", 1);
   * map.isEmpty(); // false
   */
  override isEmpty(): boolean {
    return this.mapEntries.size === 0;
  }

  /**
   * Removes all of the mappings from this map.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.put("a", 1);
   * map.clear();
   * map.size(); // 0
   */
  override clear(): void {
    this.mapEntries.clear();
    this.resetTypeInference();
  }

  /**
   * Returns an iterator over the keys in this map.
   *
   * @returns An iterator with `hasNext()` and `next()` methods.
   * @throws Error When `next()` is called with no remaining elements.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.put("a", 1);
   * const it = map.keyIterator();
   * while (it.hasNext()) {
   *   console.log(it.next());
   * }
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
   *
   * @returns An iterator with `hasNext()` and `next()` methods.
   * @throws Error When `next()` is called with no remaining elements.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.put("a", 1);
   * const it = map.valueIterator();
   * while (it.hasNext()) {
   *   console.log(it.next());
   * }
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
   *
   * The returned collection is a snapshot and does not reflect subsequent changes to the map.
   * Mutating operations on the collection throw errors.
   *
   * @returns A collection view of the values contained in this map.
   * @throws Error When attempting to modify the returned collection.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.put("a", 1);
   * const vals = map.values();
   * vals.contains(1); // true
   */
  override values(): Collection<V> {
    const valueArray = Array.from(this.mapEntries.values());
    return {
      size: () => valueArray.length,
      get length() {
        return valueArray.length;
      },
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
   *
   * @returns A new array containing all keys in this map.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.put("a", 1);
   * map.put("b", 2);
   * map.keys(); // ["a", "b"]
   */
  override keys(): K[] {
    return Array.from(this.mapEntries.keys());
  }

  /**
   * Returns an array of the key-value pairs contained in this map.
   *
   * @returns A new array of tuples, each containing a key and its associated value.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.put("a", 1);
   * map.put("b", 2);
   * map.entries(); // [["a", 1], ["b", 2]]
   */
  override entries(): Array<[K, V]> {
    return Array.from(this.mapEntries.entries());
  }
}
