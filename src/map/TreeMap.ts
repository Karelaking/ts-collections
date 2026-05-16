import {
  AbstractMap,
  type MapTypeValidationOptions,
} from "../abstracts/AbstractMap";
import type { Collection } from "../interfaces/Collection";
import type { Iterator } from "../interfaces/Iterator";
import type { NavigableMap } from "../interfaces/NavigableMap";

export interface TreeMapOptions<K, V> extends MapTypeValidationOptions<K, V> {
  comparator?: (a: K, b: K) => number;
}

/**
 * A sorted Map implementation that keeps entries ordered by key.
 *
 * Ordering is determined by a provided comparator or by default key comparison
 * for primitive/date key types.
 *
 * @template K The type of keys in this map
 * @template V The type of values in this map
 */
export class TreeMap<K, V>
  extends AbstractMap<K, V>
  implements NavigableMap<K, V> {
  private readonly comparator: (a: K, b: K) => number;
  private readonly orderedEntries: Array<[K, V]> = [];

  constructor(options?: TreeMapOptions<K, V>) {
    super(options);
    this.comparator = options?.comparator ?? this.defaultComparator;
  }

  override size(): number {
    return this.orderedEntries.length;
  }

  override isEmpty(): boolean {
    return this.orderedEntries.length === 0;
  }

  override containsKey(key: K): boolean {
    return this.findKeyIndex(key) >= 0;
  }

  override containsValue(value: V): boolean {
    return this.orderedEntries.some(
      ([, existingValue]) => existingValue === value,
    );
  }

  override get(key: K): V | undefined {
    const index = this.findKeyIndex(key);
    if (index < 0) {
      return undefined;
    }
    return this.entryAt(index)[1];
  }

  override put(key: K, value: V): V | undefined {
    this.validateKeyType(key);
    this.validateValueType(value);

    const index = this.findKeyIndex(key);
    if (index >= 0) {
      const previous = this.entryAt(index)[1];
      this.orderedEntries[index] = [key, value];
      return previous;
    }

    const insertionIndex = -index - 1;
    this.orderedEntries.splice(insertionIndex, 0, [key, value]);
    return undefined;
  }

  override remove(key: K): V | undefined {
    const index = this.findKeyIndex(key);
    if (index < 0) {
      return undefined;
    }

    const [removed] = this.orderedEntries.splice(index, 1);

    if (this.orderedEntries.length === 0) {
      this.resetTypeInference();
    }

    if (removed === undefined) {
      throw new Error("Failed to remove entry");
    }

    return removed[1];
  }

  override clear(): void {
    this.orderedEntries.length = 0;
    this.resetTypeInference();
  }

  override keyIterator(): Iterator<K> {
    const keys = this.keys();
    let index = 0;

    return {
      hasNext: () => index < keys.length,
      next: () => {
        if (index >= keys.length) {
          throw new Error("No more elements");
        }
        const key = keys[index++];
        if (key === undefined) {
          throw new Error("No more elements");
        }
        return key;
      },
    };
  }

  override valueIterator(): Iterator<V> {
    const values = this.orderedEntries.map(([, value]) => value);
    let index = 0;

    return {
      hasNext: () => index < values.length,
      next: () => {
        if (index >= values.length) {
          throw new Error("No more elements");
        }
        const value = values[index++];
        if (value === undefined) {
          throw new Error("No more elements");
        }
        return value;
      },
    };
  }

  override values(): Collection<V> {
    const valueArray = this.orderedEntries.map(([, value]) => value);

    return {
      size: () => valueArray.length,
      get length() {
        return valueArray.length;
      },
      isEmpty: () => valueArray.length === 0,
      contains: (value: V) => valueArray.includes(value),
      add: () => {
        throw new Error("Unsupported operation");
      },
      remove: () => {
        throw new Error("Unsupported operation");
      },
      clear: () => {
        throw new Error("Unsupported operation");
      },
      iterator: () => {
        let index = 0;
        return {
          hasNext: () => index < valueArray.length,
          next: () => {
            if (index >= valueArray.length) {
              throw new Error("No more elements");
            }
            const value = valueArray[index++];
            if (value === undefined) {
              throw new Error("No more elements");
            }
            return value;
          },
        };
      },
      toArray: () => [...valueArray],
      containsAll: (other) => {
        return other.toArray().every((value) => valueArray.includes(value));
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
    return this.orderedEntries.map(([key]) => key);
  }

  override entries(): Array<[K, V]> {
    return [...this.orderedEntries];
  }

  firstKey(): K {
    if (this.orderedEntries.length === 0) {
      throw new Error("Map is empty");
    }
    return this.entryAt(0)[0];
  }

  lastKey(): K {
    if (this.orderedEntries.length === 0) {
      throw new Error("Map is empty");
    }
    return this.entryAt(this.orderedEntries.length - 1)[0];
  }

  firstEntry(): [K, V] {
    if (this.orderedEntries.length === 0) {
      throw new Error("Map is empty");
    }
    const [key, value] = this.entryAt(0);
    return [key, value];
  }

  lastEntry(): [K, V] {
    if (this.orderedEntries.length === 0) {
      throw new Error("Map is empty");
    }
    const [key, value] = this.entryAt(this.orderedEntries.length - 1);
    return [key, value];
  }

  pollFirstEntry(): [K, V] | undefined {
    if (this.orderedEntries.length === 0) {
      return undefined;
    }
    const removed = this.orderedEntries.shift();
    if (removed === undefined) {
      return undefined;
    }
    if (this.orderedEntries.length === 0) {
      this.resetTypeInference();
    }
    return removed;
  }

  pollLastEntry(): [K, V] | undefined {
    if (this.orderedEntries.length === 0) {
      return undefined;
    }
    const removed = this.orderedEntries.pop();
    if (removed === undefined) {
      return undefined;
    }
    if (this.orderedEntries.length === 0) {
      this.resetTypeInference();
    }
    return removed;
  }

  lowerKey(key: K): K | undefined {
    const index = this.lowerIndex(key);
    if (index < 0) {
      return undefined;
    }
    return this.entryAt(index)[0];
  }

  floorKey(key: K): K | undefined {
    const index = this.findKeyIndex(key);
    if (index >= 0) {
      return this.entryAt(index)[0];
    }
    const floorIndex = -index - 2;
    if (floorIndex < 0) {
      return undefined;
    }
    return this.entryAt(floorIndex)[0];
  }

  ceilingKey(key: K): K | undefined {
    const index = this.findKeyIndex(key);
    if (index >= 0) {
      return this.entryAt(index)[0];
    }
    const ceilingIndex = -index - 1;
    if (ceilingIndex >= this.orderedEntries.length) {
      return undefined;
    }
    return this.entryAt(ceilingIndex)[0];
  }

  higherKey(key: K): K | undefined {
    const index = this.higherIndex(key);
    if (index >= this.orderedEntries.length) {
      return undefined;
    }
    return this.entryAt(index)[0];
  }

  subMap(
    fromKey: K,
    toKey: K,
    fromInclusive: boolean = true,
    toInclusive: boolean = false,
  ): TreeMap<K, V> {
    const result = this.createCompatibleMap();

    for (const [key, value] of this.orderedEntries) {
      const fromCmp = this.comparator(key, fromKey);
      const toCmp = this.comparator(key, toKey);
      const inLower = fromInclusive ? fromCmp >= 0 : fromCmp > 0;
      const inUpper = toInclusive ? toCmp <= 0 : toCmp < 0;
      if (inLower && inUpper) {
        result.put(key, value);
      }
    }

    return result;
  }

  headMap(toKey: K, inclusive: boolean = false): TreeMap<K, V> {
    const result = this.createCompatibleMap();

    for (const [key, value] of this.orderedEntries) {
      const cmp = this.comparator(key, toKey);
      if (cmp < 0 || (inclusive && cmp === 0)) {
        result.put(key, value);
      } else {
        break;
      }
    }

    return result;
  }

  tailMap(fromKey: K, inclusive: boolean = true): TreeMap<K, V> {
    const result = this.createCompatibleMap();

    for (const [key, value] of this.orderedEntries) {
      const cmp = this.comparator(key, fromKey);
      if (cmp > 0 || (inclusive && cmp === 0)) {
        result.put(key, value);
      }
    }

    return result;
  }

  private entryAt(index: number): [K, V] {
    const entry = this.orderedEntries[index];
    if (entry === undefined) {
      throw new Error(`Invalid entry index: ${index}`);
    }
    return entry;
  }

  private lowerIndex(key: K): number {
    const index = this.findKeyIndex(key);
    if (index >= 0) {
      return index - 1;
    }
    return -index - 2;
  }

  private higherIndex(key: K): number {
    const index = this.findKeyIndex(key);
    if (index >= 0) {
      return index + 1;
    }
    return -index - 1;
  }

  private createCompatibleMap(): TreeMap<K, V> {
    const options: TreeMapOptions<K, V> = {
      comparator: this.comparator,
      strict: this.strict,
    };

    if (this.keySchema !== undefined) {
      options.keySchema = this.keySchema;
    }
    if (this.valueSchema !== undefined) {
      options.valueSchema = this.valueSchema;
    }
    if (this.keyValidator !== undefined) {
      options.keyValidator = this.keyValidator;
    }
    if (this.valueValidator !== undefined) {
      options.valueValidator = this.valueValidator;
    }

    return new TreeMap<K, V>(options);
  }

  /**
   * Returns the found index, or insertion point encoded as `-(index + 1)`.
   */
  private findKeyIndex(key: K): number {
    let low = 0;
    let high = this.orderedEntries.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midEntry = this.entryAt(mid);
      const cmp = this.comparator(key, midEntry[0]);

      if (cmp === 0) {
        return mid;
      }

      if (cmp < 0) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    return -(low + 1);
  }

  private readonly defaultComparator = (a: K, b: K): number => {
    // Handle null and undefined
    if (a === null && b === null) return 0;
    if (a === null) return -1;
    if (b === null) return 1;
    if (a === undefined && b === undefined) return 0;
    if (a === undefined) return -1;
    if (b === undefined) return 1;

    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    }

    if (typeof a === "string" && typeof b === "string") {
      return a < b ? -1 : a > b ? 1 : 0;
    }

    if (typeof a === "bigint" && typeof b === "bigint") {
      return a < b ? -1 : a > b ? 1 : 0;
    }

    if (typeof a === "boolean" && typeof b === "boolean") {
      return Number(a) - Number(b);
    }

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() - b.getTime();
    }

    throw new Error("Comparator is required for non-primitive key types");
  };
}
