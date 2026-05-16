import {
  AbstractSet,
  type TypeValidationOptions,
} from "../abstracts/AbstractSet";
import type { Collection } from "../interfaces/Collection";
import type { Iterator } from "../interfaces/Iterator";
import type { NavigableSet } from "../interfaces/NavigableSet";

export interface TreeSetOptions<T> extends TypeValidationOptions<T> {
  comparator?: (a: T, b: T) => number;
}

/**
 * A sorted Set implementation backed by an ordered array.
 *
 * Ordering is defined by a custom comparator or by default primitive/date comparison.
 *
 * @template T The type of elements in this set
 */
export class TreeSet<T> extends AbstractSet<T> implements NavigableSet<T> {
  private readonly comparator: (a: T, b: T) => number;
  private readonly orderedValues: T[] = [];

  constructor(options?: TreeSetOptions<T>) {
    super(options);
    this.comparator = options?.comparator ?? this.defaultComparator;
  }

  override add(element: T): boolean {
    this.validateElementType(element);

    const index = this.findIndex(element);
    if (index >= 0) {
      return false;
    }

    const insertionIndex = -index - 1;
    this.orderedValues.splice(insertionIndex, 0, element);
    return true;
  }

  override remove(element: T): boolean {
    const index = this.findIndex(element);
    if (index < 0) {
      return false;
    }

    this.orderedValues.splice(index, 1);

    if (this.orderedValues.length === 0) {
      this.resetTypeInference();
    }

    return true;
  }

  override contains(element: T): boolean {
    return this.findIndex(element) >= 0;
  }

  override size(): number {
    return this.orderedValues.length;
  }

  override clear(): void {
    this.orderedValues.length = 0;
    this.resetTypeInference();
  }

  override iterator(): Iterator<T> {
    const snapshot = this.toArray();
    let index = 0;

    return {
      hasNext: () => index < snapshot.length,
      next: () => {
        if (index >= snapshot.length) {
          throw new Error("No more elements");
        }
        const value = snapshot[index++];
        if (value === undefined) {
          throw new Error("No more elements");
        }
        return value;
      },
    };
  }

  override toArray(): T[] {
    return [...this.orderedValues];
  }

  first(): T {
    if (this.orderedValues.length === 0) {
      throw new Error("Set is empty");
    }
    return this.valueAt(0);
  }

  last(): T {
    if (this.orderedValues.length === 0) {
      throw new Error("Set is empty");
    }
    return this.valueAt(this.orderedValues.length - 1);
  }

  pollFirst(): T | undefined {
    if (this.orderedValues.length === 0) {
      return undefined;
    }
    const value = this.orderedValues.shift();
    if (this.orderedValues.length === 0) {
      this.resetTypeInference();
    }
    return value;
  }

  pollLast(): T | undefined {
    if (this.orderedValues.length === 0) {
      return undefined;
    }
    const value = this.orderedValues.pop();
    if (this.orderedValues.length === 0) {
      this.resetTypeInference();
    }
    return value;
  }

  lower(element: T): T | undefined {
    const index = this.lowerIndex(element);
    if (index < 0) {
      return undefined;
    }
    return this.valueAt(index);
  }

  floor(element: T): T | undefined {
    const index = this.findIndex(element);
    if (index >= 0) {
      return this.valueAt(index);
    }
    const floorIndex = -index - 2;
    if (floorIndex < 0) {
      return undefined;
    }
    return this.valueAt(floorIndex);
  }

  ceiling(element: T): T | undefined {
    const index = this.findIndex(element);
    if (index >= 0) {
      return this.valueAt(index);
    }
    const ceilingIndex = -index - 1;
    if (ceilingIndex >= this.orderedValues.length) {
      return undefined;
    }
    return this.valueAt(ceilingIndex);
  }

  higher(element: T): T | undefined {
    const index = this.higherIndex(element);
    if (index >= this.orderedValues.length) {
      return undefined;
    }
    return this.valueAt(index);
  }

  descendingIterator(): Iterator<T> {
    const snapshot = this.toArray();
    let index = snapshot.length - 1;

    return {
      hasNext: () => index >= 0,
      next: () => {
        if (index < 0) {
          throw new Error("No more elements");
        }
        const value = snapshot[index--];
        if (value === undefined) {
          throw new Error("No more elements");
        }
        return value;
      },
    };
  }

  subSet(
    fromElement: T,
    toElement: T,
    fromInclusive: boolean = true,
    toInclusive: boolean = false,
  ): TreeSet<T> {
    const result = this.createCompatibleSet();

    for (const value of this.orderedValues) {
      const fromCmp = this.comparator(value, fromElement);
      const toCmp = this.comparator(value, toElement);
      const inLower = fromInclusive ? fromCmp >= 0 : fromCmp > 0;
      const inUpper = toInclusive ? toCmp <= 0 : toCmp < 0;
      if (inLower && inUpper) {
        result.add(value);
      }
    }

    return result;
  }

  headSet(toElement: T, inclusive: boolean = false): TreeSet<T> {
    const result = this.createCompatibleSet();

    for (const value of this.orderedValues) {
      const cmp = this.comparator(value, toElement);
      if (cmp < 0 || (inclusive && cmp === 0)) {
        result.add(value);
      } else {
        break;
      }
    }

    return result;
  }

  tailSet(fromElement: T, inclusive: boolean = true): TreeSet<T> {
    const result = this.createCompatibleSet();

    for (const value of this.orderedValues) {
      const cmp = this.comparator(value, fromElement);
      if (cmp > 0 || (inclusive && cmp === 0)) {
        result.add(value);
      }
    }

    return result;
  }

  override removeAll(elements: Collection<T>): boolean {
    let modified = false;
    for (const element of elements.toArray()) {
      if (this.remove(element)) {
        modified = true;
      }
    }
    return modified;
  }

  override retainAll(elements: Collection<T>): boolean {
    const keepValues = elements.toArray();
    const toRemove: T[] = [];

    for (const value of this.orderedValues) {
      if (
        !keepValues.some((candidate) => this.comparator(value, candidate) === 0)
      ) {
        toRemove.push(value);
      }
    }

    if (toRemove.length === 0) {
      return false;
    }

    for (const value of toRemove) {
      this.remove(value);
    }

    return true;
  }

  /**
   * Returns the found index, or insertion point encoded as `-(index + 1)`.
   */
  private findIndex(element: T): number {
    let low = 0;
    let high = this.orderedValues.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midValue = this.valueAt(mid);
      const cmp = this.comparator(element, midValue);

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

  private lowerIndex(element: T): number {
    const index = this.findIndex(element);
    if (index >= 0) {
      return index - 1;
    }
    return -index - 2;
  }

  private higherIndex(element: T): number {
    const index = this.findIndex(element);
    if (index >= 0) {
      return index + 1;
    }
    return -index - 1;
  }

  private createCompatibleSet(): TreeSet<T> {
    const options: TreeSetOptions<T> = {
      comparator: this.comparator,
      strict: this.strict,
    };

    if (this.schema !== undefined) {
      options.schema = this.schema;
    }
    if (this.typeValidator !== undefined) {
      options.validator = this.typeValidator;
    }

    return new TreeSet<T>(options);
  }

  private valueAt(index: number): T {
    const value = this.orderedValues[index];
    if (value === undefined) {
      throw new Error(`Invalid set index: ${index}`);
    }
    return value;
  }

  private readonly defaultComparator = (a: T, b: T): number => {
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

    throw new Error("Comparator is required for non-primitive element types");
  };
}
