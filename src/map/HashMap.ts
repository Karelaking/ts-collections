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

  override put(key: K, value: V): V | undefined {
    this.validateKeyType(key);
    this.validateValueType(value);
    const oldValue = this.mapEntries.get(key);
    this.mapEntries.set(key, value);
    return oldValue;
  }

  override get(key: K): V | undefined {
    return this.mapEntries.get(key);
  }

  override remove(key: K): V | undefined {
    const value = this.mapEntries.get(key);
    this.mapEntries.delete(key);
    return value;
  }

  override containsKey(key: K): boolean {
    return this.mapEntries.has(key);
  }

  override containsValue(value: V): boolean {
    for (const v of this.mapEntries.values()) {
      if (v === value) {
        return true;
      }
    }
    return false;
  }

  override size(): number {
    return this.mapEntries.size;
  }

  override isEmpty(): boolean {
    return this.mapEntries.size === 0;
  }

  override clear(): void {
    this.mapEntries.clear();
    this.resetTypeInference();
  }

  override keyIterator(): Iterator<K> {
    const keys = Array.from(this.mapEntries.keys());
    let index = 0;

    return {
      hasNext: () => index < keys.length,
      next: () => {
        if (index >= keys.length) {
          throw new Error("No more elements");
        }
        const key = keys[index++];
        if (key === undefined) {
          throw new Error("Key is undefined");
        }
        return key;
      },
    };
  }

  override valueIterator(): Iterator<V> {
    const values = Array.from(this.mapEntries.values());
    let index = 0;

    return {
      hasNext: () => index < values.length,
      next: () => {
        if (index >= values.length) {
          throw new Error("No more elements");
        }
        const value = values[index++];
        if (value === undefined) {
          throw new Error("Value is undefined");
        }
        return value;
      },
    };
  }

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

  override keys(): K[] {
    return Array.from(this.mapEntries.keys());
  }

  override entries(): Array<[K, V]> {
    return Array.from(this.mapEntries.entries());
  }
}
