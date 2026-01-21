import type { Iterator } from "../interfaces/Iterator";
import type { Collection } from "../interfaces/Collection";
import type { Set } from "../interfaces/Set";
import { AbstractSet } from "../abstracts/AbstractSet";

/**
 * A hash-based Set implementation using native JavaScript Set.
 * Provides O(1) average case for add, remove, and contains operations.
 * Optimized for both TypeScript and JavaScript runtimes.
 *
 * @template T The type of elements in this set
 *
 * @example
 * ```typescript
 * const set = new HashSet<number>();
 * set.add(1);
 * set.add(2);
 * console.log(set.size()); // 2
 * console.log(set.contains(1)); // true
 * ```
 */
export class HashSet<T> extends AbstractSet<T> implements Set<T> {
  private elements: globalThis.Set<T>;

  constructor() {
    super();
    this.elements = new globalThis.Set<T>();
  }

  override add(element: T): boolean {
    const sizeBefore = this.elements.size;
    this.elements.add(element);
    return this.elements.size > sizeBefore;
  }

  override remove(element: T): boolean {
    return this.elements.delete(element);
  }

  override contains(element: T): boolean {
    return this.elements.has(element);
  }

  override size(): number {
    return this.elements.size;
  }

  override clear(): void {
    this.elements.clear();
  }

  override iterator(): Iterator<T> {
    const values = Array.from(this.elements);
    let index = 0;

    return {
      hasNext: () => index < values.length,
      next: () => {
        if (index >= values.length) {
          throw new Error("No more elements");
        }
        const value = values[index++];
        if (value === undefined) {
          throw new Error("Element is undefined");
        }
        return value;
      },
    };
  }

  override toArray(): T[] {
    return Array.from(this.elements);
  }

  override removeAll(elements: Collection<T>): boolean {
    const otherArray = elements.toArray();
    let modified = false;

    for (const element of otherArray) {
      if (this.elements.delete(element)) {
        modified = true;
      }
    }

    return modified;
  }

  override retainAll(elements: Collection<T>): boolean {
    const otherSet = new globalThis.Set(elements.toArray());
    const toRemove: T[] = [];

    for (const element of this.elements) {
      if (!otherSet.has(element)) {
        toRemove.push(element);
      }
    }

    if (toRemove.length === 0) {
      return false;
    }

    for (const element of toRemove) {
      this.elements.delete(element);
    }

    return true;
  }
}
