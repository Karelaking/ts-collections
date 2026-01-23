import type { Set } from "../interfaces";
import { AbstractCollection, type TypeValidationOptions } from "./AbstractCollection";

export type { TypeValidationOptions };

/**
 * Abstract base class for Set implementations.
 * Provides Set-specific behavior and ensures no duplicate elements.
 * Concrete subclasses must implement: size(), isEmpty(), contains(), iterator(), add(), remove(), toArray(), clear()
 *
 * @template E The type of elements in this set
 */
export abstract class AbstractSet<E> extends AbstractCollection<E> implements Set<E> {
  /**
   * Returns true if this set contains the specified element.
   * Must be implemented by subclasses.
   */
  abstract override contains(element: E): boolean;

  /**
   * Adds the specified element to this set if it is not already present.
   * Must be implemented by subclasses and ensure no duplicates.
   */
  abstract override add(element: E): boolean;

  /**
   * Removes the specified element from this set if it is present.
   * Must be implemented by subclasses.
   */
  abstract override remove(element: E): boolean;

  /**
   * Computes and returns the hash code for this set.
   * Default implementation: sum of hash codes of all elements.
   */
  hashCode(): number {
    let hash = 0;
    const iterator = this.iterator();
    while (iterator.hasNext()) {
      const element = iterator.next();
      hash += this.hashElement(element);
    }
    return hash;
  }

  /**
   * Returns the hash code for an element.
   * Default implementation: uses element's toString() method.
   * Subclasses can override for better performance.
   */
  protected hashElement(element: E): number {
    const str = String(element);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * Indicates whether another object is "equal to" this set.
   * Default implementation: checks if other is a Set and contains the same elements.
   */
  equals(obj: unknown): boolean {
    if (obj === this) {
      return true;
    }
    if (!(obj instanceof AbstractSet)) {
      return false;
    }
    if (this.size() !== obj.size()) {
      return false;
    }
    return this.containsAll(obj);
  }
}
