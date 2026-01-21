import type { Iterator } from "../interfaces/Iterator";
import type { Collection } from "../interfaces/Collection";
import type { Set } from "../interfaces/Set";
import { AbstractSet } from "../abstracts/AbstractSet";

/**
 * A hash-based Set implementation using a simple object-based map for storage.
 * Provides O(1) average case for add, remove, and contains operations.
 * Uses a hash function based on JSON stringification for object keys.
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
  private elements: Map<string, T> = new Map();

  override add(element: T): boolean {
    const key = this.hash(element);
    if (this.elements.has(key)) {
      return false;
    }
    this.elements.set(key, element);
    return true;
  }

  override remove(element: T): boolean {
    const key = this.hash(element);
    return this.elements.delete(key);
  }

  override contains(element: T): boolean {
    const key = this.hash(element);
    return this.elements.has(key);
  }

  override size(): number {
    return this.elements.size;
  }

  override clear(): void {
    this.elements.clear();
  }

  override iterator(): Iterator<T> {
    const values = Array.from(this.elements.values());
    let index = 0;

    return {
      hasNext: () => index < values.length,
      next: () => {
        if (index >= values.length) {
          throw new Error("No more elements");
        }
        const element = values[index];
        if (element === undefined) {
          throw new Error(`Element at index ${index} is undefined`);
        }
        index += 1;
        return element;
      },
    };
  }

  override toArray(): T[] {
    return Array.from(this.elements.values());
  }

  override removeAll(elements: Collection<T>): boolean {
    let modified = false;
    const elementsToRemove = elements.toArray();

    for (const element of elementsToRemove) {
      if (this.remove(element)) {
        modified = true;
      }
    }

    return modified;
  }

  override retainAll(elements: Collection<T>): boolean {
    let modified = false;
    const currentElements = this.toArray();

    for (const element of currentElements) {
      if (!elements.contains(element)) {
        if (this.remove(element)) {
          modified = true;
        }
      }
    }

    return modified;
  }

  /**
   * Generates a hash key for an element.
   * Uses JSON.stringify for consistent hashing.
   * Primitives and objects are both supported.
   *
   * @param element The element to hash
   * @returns A string hash key
   */
  private hash(element: T): string {
    if (element === null) {
      return "null";
    }
    if (element === undefined) {
      return "undefined";
    }
    try {
      return JSON.stringify(element);
    } catch {
      // Fallback for circular references or non-serializable objects
      return String(element);
    }
  }
}
