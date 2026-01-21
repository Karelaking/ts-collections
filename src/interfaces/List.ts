import type { Collection } from "./Collection";

/**
 * An ordered Collection (also known as a sequence).
 * Lists typically allow duplicate elements and access by index.
 *
 * @template E The type of elements in this list
 */
export interface List<E> extends Collection<E> {
  /**
   * Returns the element at the specified position in this list.
   *
   * @param index Index of the element to return
   * @returns The element at the specified position
   * @throws Error if the index is out of range
   */
  get(index: number): E;

  /**
   * Replaces the element at the specified position in this list with the specified element.
   *
   * @param index Index of the element to replace
   * @param element Element to be stored at the specified position
   * @returns The element previously at the specified position
   * @throws Error if the index is out of range
   */
  set(index: number, element: E): E;

  /**
   * Inserts the specified element at the specified position in this list.
   *
   * @param index Index at which the specified element is to be inserted
   * @param element Element to be inserted
   * @throws Error if the index is out of range
   */
  addAt(index: number, element: E): void;

  /**
   * Appends the specified element to the end of this list.
   *
   * @param element Element to be appended to this list
   * @returns true if the element was appended successfully
   */
  add(element: E): boolean;

  /**
   * Removes the element at the specified position in this list.
   *
   * @param index Index of the element to be removed
   * @returns The element that was removed from the list
   * @throws Error if the index is out of range
   */
  removeAt(index: number): E;

  /**
   * Returns the index of the first occurrence of the specified element in this list.
   *
   * @param element Element to search for
   * @returns The index of the first occurrence, or -1 if not found
   */
  indexOf(element: E): number;

  /**
   * Returns the index of the last occurrence of the specified element in this list.
   *
   * @param element Element to search for
   * @returns The index of the last occurrence, or -1 if not found
   */
  lastIndexOf(element: E): number;

  /**
   * Returns a view of the portion of this list between fromIndex (inclusive) and toIndex (exclusive).
   *
   * @param fromIndex Low endpoint (inclusive) of the subList
   * @param toIndex High endpoint (exclusive) of the subList
   * @returns A view of the specified range of this list
   * @throws Error if indices are out of range or fromIndex > toIndex
   */
  subList(fromIndex: number, toIndex: number): List<E>;
}
