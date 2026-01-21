import type { Iterator } from "../interfaces/Iterator";
import type { Collection } from "../interfaces/Collection";
import type { Map as MapInterface } from "../interfaces/Map";
import { AbstractMap } from "../abstracts/AbstractMap";

/**
 * A hash-based Map implementation using JavaScript's native Map for storage.
 * Provides O(1) average case for put, get, and remove operations.
 * Uses JSON stringification for consistent key hashing.
 *
 * @template K The type of keys in this map
 * @template V The type of values in this map
 *
 * @example
 * ```typescript
 * const map = new HashMap<string, number>();
 * map.put("a", 1);
 * map.put("b", 2);
 * console.log(map.get("a")); // 1
 * console.log(map.size()); // 2
 * ```
 */
export class HashMap<K, V> extends AbstractMap<K, V> implements MapInterface<K, V> {
  private mapEntries: Map<string, { key: K; value: V }> = new Map();

  override put(key: K, value: V): V | undefined {
    const hashKey = this.hash(key);
    const existing = this.mapEntries.get(hashKey);
    this.mapEntries.set(hashKey, { key, value });
    return existing?.value;
  }

  override get(key: K): V | undefined {
    const hashKey = this.hash(key);
    return this.mapEntries.get(hashKey)?.value;
  }

  override remove(key: K): V | undefined {
    const hashKey = this.hash(key);
    const existing = this.mapEntries.get(hashKey);
    this.mapEntries.delete(hashKey);
    return existing?.value;
  }

  override containsKey(key: K): boolean {
    const hashKey = this.hash(key);
    return this.mapEntries.has(hashKey);
  }

  override containsValue(value: V): boolean {
    return Array.from(this.mapEntries.values()).some((entry) => entry.value === value);
  }

  override size(): number {
    return this.mapEntries.size;
  }

  override isEmpty(): boolean {
    return this.mapEntries.size === 0;
  }

  override clear(): void {
    this.mapEntries.clear();
  }

  override keyIterator(): Iterator<K> {
    const keyArray = Array.from(this.mapEntries.values()).map((entry) => entry.key);
    let index = 0;

    return {
      hasNext: () => index < keyArray.length,
      next: () => {
        if (index >= keyArray.length) {
          throw new Error("No more elements");
        }
        const key = keyArray[index];
        if (key === undefined) {
          throw new Error(`Key at index ${index} is undefined`);
        }
        index += 1;
        return key;
      },
    };
  }

  override valueIterator(): Iterator<V> {
    const valueArray = Array.from(this.mapEntries.values()).map((entry) => entry.value);
    let index = 0;

    return {
      hasNext: () => index < valueArray.length,
      next: () => {
        if (index >= valueArray.length) {
          throw new Error("No more elements");
        }
        const value = valueArray[index];
        if (value === undefined) {
          throw new Error(`Value at index ${index} is undefined`);
        }
        index += 1;
        return value;
      },
    };
  }

  override values(): Collection<V> {
    const valueArray = Array.from(this.mapEntries.values()).map((entry) => entry.value);
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
      toArray: () => [...valueArray],
      iterator: () => {
        let idx = 0;
        return {
          hasNext: () => idx < valueArray.length,
          next: () => {
            if (idx >= valueArray.length) {
              throw new Error("No more elements");
            }
            const value = valueArray[idx];
            if (value === undefined) {
              throw new Error(`Value at index ${idx} is undefined`);
            }
            idx += 1;
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
    return Array.from(this.mapEntries.values()).map((entry) => entry.key);
  }

  override entries(): Array<[K, V]> {
    return Array.from(this.mapEntries.values()).map((entry) => [entry.key, entry.value]);
  }

  /**
   * Generates a hash key for a map key.
   * Uses JSON.stringify for consistent hashing.
   * Primitives and objects are both supported.
   *
   * @param key The key to hash
   * @returns A string hash key
   */
  private hash(key: K): string {
    if (key === null) {
      return "null";
    }
    if (key === undefined) {
      return "undefined";
    }
    try {
      return JSON.stringify(key);
    } catch {
      // Fallback for circular references or non-serializable objects
      return String(key);
    }
  }
}
