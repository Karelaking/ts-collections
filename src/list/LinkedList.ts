import type { Iterator } from "../interfaces/Iterator";
import type { List } from "../interfaces/List";
import { AbstractList, type TypeValidationOptions } from "../abstracts/AbstractList";

/**
 * Node in a doubly linked list.
 * Holds a value and pointers to previous and next nodes.
 */
interface Node<T> {
  value: T;
  previous: Node<T> | null;
  next: Node<T> | null;
}

/**
 * A doubly linked list implementation (Java-style LinkedList).
 * Provides O(1) insertion/deletion at both ends and bidirectional traversal.
 * Includes complete runtime type safety validation by default.
 *
 * @template T The type of elements in this list
 *
 * @example
 * ```typescript
 * import { LinkedList } from 'ts-collections';
 * 
 * // Automatic type safety (enabled by default, like Java)
 * const list = new LinkedList<number>();
 * list.add(1);
 * list.addFirst(0);
 * list.addLast(2);
 * console.log(list.toArray()); // [0, 1, 2]
 * list.add("text" as any); // ✗ Throws TypeError: type mismatch
 * 
 * // Bidirectional iteration
 * const fwd = list.iterator();
 * while (fwd.hasNext()) console.log(fwd.next());
 * 
 * const rev = list.reverseIterator();
 * while (rev.hasNext()) console.log(rev.next());
 * ```
 */
export class LinkedList<T> extends AbstractList<T> implements List<T> {
  /** First node in the list */
  private head: Node<T> | null = null;
  /** Last node in the list */
  private tail: Node<T> | null = null;
  /** Number of elements in the list */
  private elementCount: number = 0;

  constructor(options?: TypeValidationOptions<T>) {
    super(options);
  }

  /**
   * Appends an element to the end of the list.
   * @param element Element to add.
   * @returns true if added.
   */
  override add(element: T): boolean {
    this.validateElementType(element);
    this.addLast(element);
    return true;
  }

  /**
   * Inserts an element at the beginning of the list.
   * @param element Element to add.
   */
  addFirst(element: T): void {
    this.validateElementType(element);
    const newNode: Node<T> = {
      value: element,
      previous: null,
      next: this.head,
    };

    if (this.head !== null) {
      // List is non-empty; update old head's previous pointer
      this.head.previous = newNode;
    } else {
      // List was empty; new node is also the tail
      this.tail = newNode;
    }

    this.head = newNode;
    this.elementCount++;
  }

  /**
   * Appends an element to the end of the list.
   * @param element Element to add.
   */
  addLast(element: T): void {
    this.validateElementType(element);
    const newNode: Node<T> = {
      value: element,
      previous: this.tail,
      next: null,
    };

    if (this.tail !== null) {
      // List is non-empty; update old tail's next pointer
      this.tail.next = newNode;
    } else {
      // List was empty; new node is also the head
      this.head = newNode;
    }

    this.tail = newNode;
    this.elementCount++;
  }

  /**
   * Gets the element at the specified index.
   * @param index Index to retrieve.
   * @returns The element at the index.
   * @throws Error if index is out of bounds.
   */
  override get(index: number): T {
    this.checkIndex(index);
    const node = this.getNode(index);
    if (node === null) {
      throw new Error(`Element at index ${index} is undefined`);
    }
    return node.value;
  }

  /**
   * Gets the first element in the list.
   * @returns The first element.
   * @throws Error if the list is empty.
   */
  getFirst(): T {
    if (this.head === null) {
      throw new Error("List is empty");
    }
    return this.head.value;
  }

  /**
   * Gets the last element in the list.
   * @returns The last element.
   * @throws Error if the list is empty.
   */
  getLast(): T {
    if (this.tail === null) {
      throw new Error("List is empty");
    }
    return this.tail.value;
  }

  /**
   * Removes and returns the first element in the list.
   * @returns The removed element.
   * @throws Error if the list is empty.
   */
  removeFirst(): T {
    if (this.head === null) {
      throw new Error("List is empty");
    }

    const value = this.head.value;
    if (this.head.next !== null) {
      // More than one element; update head and clear new head's previous pointer
      this.head.next.previous = null;
      this.head = this.head.next;
    } else {
      // Only one element; list becomes empty
      this.head = null;
      this.tail = null;
    }
    this.elementCount--;

    if (this.elementCount === 0) {
      this.resetTypeInference();
    }

    return value;
  }

  /**
   * Removes and returns the last element in the list.
   * @returns The removed element.
   * @throws Error if the list is empty.
   */
  removeLast(): T {
    if (this.tail === null) {
      throw new Error("List is empty");
    }

    const value = this.tail.value;
    if (this.tail.previous !== null) {
      // More than one element; update tail and clear old tail's previous
      this.tail.previous.next = null;
      this.tail = this.tail.previous;
    } else {
      // Only one element; list becomes empty
      this.head = null;
      this.tail = null;
    }
    this.elementCount--;

    if (this.elementCount === 0) {
      this.resetTypeInference();
    }

    return value;
  }

  /**
   * Replaces the element at the specified index with a new value.
   * @param index Index to replace.
   * @param element New value.
   * @returns The old value at the index.
   * @throws Error if index is out of bounds.
   */
  override set(index: number, element: T): T {
    this.checkIndex(index);
    this.validateElementType(element);
    const node = this.getNode(index);
    if (node === null) {
      throw new Error(`Element at index ${index} is undefined`);
    }
    const oldElement = node.value;
    node.value = element;
    return oldElement;
  }

  /**
   * Inserts an element at the specified index.
   * @param index Index to insert at.
   * @param element Element to insert.
   * @throws Error if index is out of bounds.
   */
  override addAt(index: number, element: T): void {
    if (index < 0 || index > this.elementCount) {
      throw new Error(`Index out of bounds: ${index}`);
    }

    this.validateElementType(element);

    if (index === this.elementCount) {
      // Insert at end
      this.addLast(element);
      return;
    }

    if (index === 0) {
      // Insert at head
      this.addFirst(element);
      return;
    }

    // Insert in the middle
    const nextNode = this.getNode(index);
    if (nextNode === null) {
      throw new Error(`Cannot insert at index ${index}`);
    }

    const newNode: Node<T> = {
      value: element,
      previous: nextNode.previous,
      next: nextNode,
    };

    if (nextNode.previous !== null) {
      nextNode.previous.next = newNode;
    }
    nextNode.previous = newNode;

    this.elementCount++;
  }

  /**
   * Removes and returns the element at the specified index.
   * @param index Index to remove.
   * @returns The removed element.
   * @throws Error if index is out of bounds.
   */
  override removeAt(index: number): T {
    this.checkIndex(index);

    if (index === 0) {
      // Remove head
      return this.removeFirst();
    }

    if (index === this.elementCount - 1) {
      // Remove tail
      return this.removeLast();
    }

    // Remove from the middle
    const node = this.getNode(index);
    if (node === null) {
      throw new Error(`Failed to remove element at index ${index}`);
    }

    const value = node.value;

    if (node.previous !== null) {
      node.previous.next = node.next;
    }
    if (node.next !== null) {
      node.next.previous = node.previous;
    }

    this.elementCount--;

    if (this.elementCount === 0) {
      this.resetTypeInference();
    }

    return value;
  }

  /**
   * Returns the index of the first occurrence of the specified element, or -1 if not found.
   * @param element Element to search for.
   * @returns Index of the element, or -1.
   */
  override indexOf(element: T): number {
    let index = 0;
    let current = this.head;

    while (current !== null) {
      if (current.value === element) {
        return index;
      }
      current = current.next;
      index++;
    }

    return -1;
  }

  /**
   * Returns the index of the last occurrence of the specified element, or -1 if not found.
   * @param element Element to search for.
   * @returns Index of the last occurrence, or -1.
   */
  override lastIndexOf(element: T): number {
    let index = this.elementCount - 1;
    let current = this.tail;

    while (current !== null) {
      if (current.value === element) {
        return index;
      }
      current = current.previous;
      index--;
    }

    return -1;
  }

  /**
   * Returns a view of the portion of this list between the specified fromIndex (inclusive) and toIndex (exclusive).
   * @param fromIndex Starting index (inclusive).
   * @param toIndex Ending index (exclusive).
   * @returns A new list containing the elements in the specified range.
   * @throws Error if indices are invalid.
   */
  override subList(fromIndex: number, toIndex: number): List<T> {
    if (fromIndex < 0 || toIndex > this.elementCount || fromIndex > toIndex) {
      throw new Error("Invalid index range");
    }

    const subList = new LinkedList<T>();
    for (let i = fromIndex; i < toIndex; i++) {
      const node = this.getNode(i);
      if (node !== null) {
        subList.add(node.value);
      }
    }
    return subList;
  }

  /**
   * Returns the number of elements in the list.
   * @returns The size of the list.
   */
  override size(): number {
    return this.elementCount;
  }

  /**
   * Removes all elements from the list.
   */
  override clear(): void {
    this.head = null;
    this.tail = null;
    this.elementCount = 0;
    this.resetTypeInference();
  }

  /**
   * Checks if the list contains the specified element.
   * @param element Element to check for.
   * @returns true if the element is found, false otherwise.
   */
  override contains(element: T): boolean {
    let current = this.head;

    while (current !== null) {
      if (current.value === element) {
        return true;
      }
      current = current.next;
    }

    return false;
  }

  /**
   * Returns an iterator over the elements in the list (from head to tail).
   * @returns An iterator for forward traversal.
   */
  override iterator(): Iterator<T> {
    let current = this.head;

    return {
      hasNext: () => current !== null,
      next: () => {
        if (current === null) {
          throw new Error("No more elements");
        }
        const value = current.value;
        current = current.next;
        return value;
      },
    };
  }

  /**
   * Converts the list to an array.
   * @returns An array containing all elements in order.
   */
  override toArray(): T[] {
    const array: T[] = [];
    let current = this.head;

    while (current !== null) {
      array.push(current.value);
      current = current.next;
    }

    return array;
  }

  /**
   * Returns a reverse iterator over the elements in the list (from tail to head).
   * @returns An iterator for backward traversal.
   */
  reverseIterator(): Iterator<T> {
    let current = this.tail;

    return {
      hasNext: () => current !== null,
      next: () => {
        if (current === null) {
          throw new Error("No more elements");
        }
        const value = current.value;
        current = current.previous;
        return value;
      },
    };
  }

  /**
   * Returns the node at the specified index, or null if out of bounds.
   * Optimizes traversal by starting from head or tail depending on index.
   * @param index Index of the node to retrieve.
   */
  private getNode(index: number): Node<T> | null {
    if (index < 0 || index >= this.elementCount) {
      return null;
    }

    // Optimize traversal: start from head or tail depending on index
    if (index < this.elementCount / 2) {
      let current = this.head;
      for (let i = 0; i < index; i++) {
        if (current === null) {
          return null;
        }
        current = current.next;
      }
      return current;
    } else {
      let current = this.tail;
      for (let i = this.elementCount - 1; i > index; i--) {
        if (current === null) {
          return null;
        }
        current = current.previous;
      }
      return current;
    }
  }

  /**
   * Throws if the index is out of bounds for the list.
   * @param index Index to check.
   */
  private checkIndex(index: number): void {
    if (index < 0 || index >= this.elementCount) {
      throw new Error(`Index out of bounds: ${index}`);
    }
  }
}
