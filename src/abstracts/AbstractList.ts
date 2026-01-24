import type { List } from "../interfaces";
import { AbstractCollection, type TypeValidationOptions } from "./AbstractCollection";

export type { TypeValidationOptions };

/**
 * Abstract base class for List implementations.
 * Provides default implementations for add(element: E) and remove(element: E) methods.
 * Concrete subclasses must implement: size(), contains(), iterator(), toArray(), clear(),
 * and List-specific methods: get(), set(), add(index, element), removeAt(), indexOf(), lastIndexOf(), subList()
 *
 * @template E The type of elements in this list
 */
export abstract class AbstractList<E> extends AbstractCollection<E> implements List<E> {
  /**
   * Returns the element at the specified position in this list.
   * Must be implemented by subclasses.
   */
  abstract get(index: number): E;

  /**
   * Replaces the element at the specified position in this list.
   * Must be implemented by subclasses.
   */
  abstract set(index: number, element: E): E;

  /**
   * Inserts the specified element at the specified position in this list.
   * Must be implemented by subclasses.
   */
  abstract addAt(index: number, element: E): void;

  /**
   * Removes the element at the specified position in this list.
   * Must be implemented by subclasses.
   */
  abstract removeAt(index: number): E;

  /**
   * Returns the index of the first occurrence of the specified element.
   * Must be implemented by subclasses.
   */
  abstract indexOf(element: E): number;

  /**
   * Returns the index of the last occurrence of the specified element.
   * Must be implemented by subclasses.
   */
  abstract lastIndexOf(element: E): number;

  /**
   * Returns a view of the portion of this list between fromIndex and toIndex.
   * Must be implemented by subclasses.
   */
  abstract subList(fromIndex: number, toIndex: number): List<E>;

  /**
   * Sorts this list in place.
   * Must be implemented by subclasses.
   */
  abstract sort(compareFn?: (a: E, b: E) => number): void;

  /**
   * Default natural comparator used when no comparator is supplied.
   * Numbers are compared arithmetically, strings via localeCompare,
   * otherwise falls back to relational comparison.
   */
  protected compareNatural(a: E, b: E): number {
    if (a === b) return 0;

    // Handle undefined/null deterministically to avoid throwing
    if (a === undefined) return -1;
    if (b === undefined) return 1;
    if (a === null) return -1;
    if (b === null) return 1;

    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    }

    if (typeof a === "string" && typeof b === "string") {
      return a.localeCompare(b);
    }

    // Fallback to relational comparison; consistent with JS sort contract
    if (a < (b as unknown as E)) return -1;
    if (a > (b as unknown as E)) return 1;
    return 0;
  }

  /**
   * Appends the specified element to the end of this list.
   * Default implementation: delegates to addAt(index, element) with index = size()
   *
   * @returns true if the element was appended successfully
   */
  add(element: E): boolean {
    this.addAt(this.size(), element);
    return true;
  }

  /**
   * Removes the first occurrence of the specified element from this list.
   * Default implementation: finds the index of the element and removes it.
   *
   * @returns true if an element was removed
   */
  override remove(element: E): boolean {
    const index = this.indexOf(element);
    if (index === -1) {
      return false;
    }
    this.removeAt(index);
    return true;
  }
}
