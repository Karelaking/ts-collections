import type { Iterator, Collection } from "../interfaces";

/**
 * Abstract base class for Collection implementations.
 * Provides default implementations of aggregate operations (containsAll, addAll, removeAll, retainAll).
 * Concrete subclasses must implement: size(), isEmpty(), contains(), iterator(), add(), remove(), toArray(), clear()
 *
 * @template E The type of elements in this collection
 */
export abstract class AbstractCollection<E> implements Collection<E> {
  /**
   * Returns the number of elements in this collection.
   * Must be implemented by subclasses.
   */
  abstract size(): number;

  /**
   * Returns true if this collection contains no elements.
   * Default implementation checks if size is 0.
   */
  isEmpty(): boolean {
    return this.size() === 0;
  }

  /**
   * Returns true if this collection contains the specified element.
   * Must be implemented by subclasses.
   */
  abstract contains(element: E): boolean;

  /**
   * Returns an iterator over the elements in this collection.
   * Must be implemented by subclasses.
   */
  abstract iterator(): Iterator<E>;

  /**
   * Returns an array containing all of the elements in this collection.
   * Must be implemented by subclasses.
   */
  abstract toArray(): E[];

  /**
   * Adds the specified element to this collection.
   * Must be implemented by subclasses.
   */
  abstract add(element: E): boolean;

  /**
   * Removes a single instance of the specified element from this collection.
   * Must be implemented by subclasses.
   */
  abstract remove(element: E): boolean;

  /**
   * Removes all of the elements from this collection.
   * Must be implemented by subclasses.
   */
  abstract clear(): void;

  /**
   * Returns true if this collection contains all of the elements
   * in the specified collection.
   *
   * Default implementation: iterates through elements of the specified collection
   * and checks if each element is contained in this collection.
   *
   * Time Complexity: O(n * m) where n is size of this collection and m is size of specified collection
   * (assuming contains() is O(n) and iterator() is O(m))
   */
  containsAll(elements: Collection<E>): boolean {
    const iterator = elements.iterator();
    while (iterator.hasNext()) {
      if (!this.contains(iterator.next())) {
        return false;
      }
    }
    return true;
  }

  /**
   * Adds all of the elements in the specified collection to this collection.
   *
   * Default implementation: iterates through elements of the specified collection
   * and adds each element.
   *
   * @returns true if this collection changed as a result of the call
   */
  addAll(elements: Collection<E>): boolean {
    let modified = false;
    const iterator = elements.iterator();
    while (iterator.hasNext()) {
      if (this.add(iterator.next())) {
        modified = true;
      }
    }
    return modified;
  }

  /**
   * Removes all of this collection's elements that are also contained in the
   * specified collection.
   *
   * Default implementation: iterates through elements of this collection
   * and removes those that are in the specified collection.
   *
   * @returns true if this collection changed as a result of the call
   */
  removeAll(elements: Collection<E>): boolean {
    let modified = false;
    const iterator = this.iterator();
    while (iterator.hasNext()) {
      if (elements.contains(iterator.next())) {
        if (iterator.remove) {
          iterator.remove();
          modified = true;
        }
      }
    }
    return modified;
  }

  /**
   * Retains only the elements in this collection that are contained in the
   * specified collection.
   *
   * Default implementation: iterates through elements of this collection
   * and removes those that are NOT in the specified collection.
   *
   * @returns true if this collection changed as a result of the call
   */
  retainAll(elements: Collection<E>): boolean {
    let modified = false;
    const iterator = this.iterator();
    while (iterator.hasNext()) {
      if (!elements.contains(iterator.next())) {
        if (iterator.remove) {
          iterator.remove();
          modified = true;
        }
      }
    }
    return modified;
  }
}
