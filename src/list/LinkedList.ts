import type { Iterator } from "../interfaces/Iterator";
import type { List } from "../interfaces/List";
import { AbstractList, type TypeValidationOptions } from "../abstracts/AbstractList";

/**
 * Node in a doubly linked list.
 *
 * Each node holds a value and maintains bidirectional pointers to its
 * predecessor and successor nodes in the list.
 *
 * @typeParam T - Type of value stored in the node.
 */
interface Node<T> {
  /** The value stored in this node. */
  value: T;
  /** Reference to the previous node in the list, or `null` if this is the head. */
  previous: Node<T> | null;
  /** Reference to the next node in the list, or `null` if this is the tail. */
  next: Node<T> | null;
}

/**
 * A doubly linked list that supports efficient insertions and removals at both ends.
 *
 * This list behaves like Java's `LinkedList`: it maintains bidirectional node
 * pointers for forward and reverse traversal, and provides constant-time access
 * to head and tail elements.
 *
 * ### Performance characteristics
 * - Insert/remove at head or tail: $O(1)$
 * - Insert/remove at arbitrary index: $O(n)$ due to traversal
 * - Random access (`get`, `set`): $O(n)$ due to traversal
 * - Search (`contains`, `indexOf`, `lastIndexOf`): $O(n)$
 *
 * ### Internal behavior
 * - Maintains `head` and `tail` pointers to the first and last nodes.
 * - Each `Node<T>` holds a value and pointers to its predecessor and successor.
 * - The `getNode` method optimizes traversal by starting from the closer end
 *   (head or tail) based on the target index.
 * - When runtime type validation is enabled, each added or replaced element
 *   is validated before insertion.
 * - `subList` produces a snapshot copy, so changes to the original list do
 *   not affect the returned list.
 *
 * ### Error behavior
 * - Methods that access by index throw when the index is out of range.
 * - `getFirst`, `getLast`, `removeFirst`, and `removeLast` throw when the list is empty.
 * - Iterator `next()` throws when no elements remain.
 *
 * @typeParam T - The element type stored in the list.
 *
 * @example
 * const list = new LinkedList<number>();
 * list.add(1);
 * list.addFirst(0);
 * list.addLast(2);
 * console.log(list.toArray()); // [0, 1, 2]
 * 
 * // Bidirectional iteration
 * const fwd = list.iterator();
 * while (fwd.hasNext()) console.log(fwd.next());
 * 
 * const rev = list.reverseIterator();
 * while (rev.hasNext()) console.log(rev.next());
 */
export class LinkedList<T> extends AbstractList<T> implements List<T> {
  /**
   * Reference to the first node in the list.
   * `null` when the list is empty.
   */
  private head: Node<T> | null = null;

  /**
   * Reference to the last node in the list.
   * `null` when the list is empty.
   */
  private tail: Node<T> | null = null;

  /**
   * The number of elements currently stored in the list.
   */
  private elementCount: number = 0;

  /**
   * Creates a new empty doubly linked list.
   *
   * @param options - Optional type-validation configuration inherited from `AbstractList`.
   *
   * @example
   * const list = new LinkedList<string>();
   * const strictList = new LinkedList<number>({ strictTypeChecking: true });
   */
  constructor(options?: TypeValidationOptions<T>) {
    super(options);
  }

  /**
   * Appends an element to the end of the list.
   *
   * @param element - The element to add.
   * @returns `true` when the element is added successfully.
   * @throws Error If the element type is invalid under the current validation rules.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.add(42); // true
   */
  override add(element: T): boolean {
    this.validateElementType(element);
    this.addLast(element);
    return true;
  }

  /**
   * Inserts an element at the beginning of the list.
   *
   * @param element - The element to add at the head.
   * @throws Error If the element type is invalid under the current validation rules.
   *
   * @example
   * const list = new LinkedList<string>();
   * list.addFirst("first");
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
   *
   * @param element - The element to add at the tail.
   * @throws Error If the element type is invalid under the current validation rules.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.addLast(99);
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
   * Returns the element at the specified index.
   *
   * @param index - Zero-based position of the element.
   * @returns The element at the given index.
   * @throws Error If the index is out of bounds or the node is `null`.
   *
   * @example
   * const list = new LinkedList<string>();
   * list.add("a");
   * list.get(0); // "a"
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
   * Returns the first element in the list.
   *
   * @returns The element at the head of the list.
   * @throws Error If the list is empty.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.add(10);
   * list.getFirst(); // 10
   */
  getFirst(): T {
    if (this.head === null) {
      throw new Error("List is empty");
    }
    return this.head.value;
  }

  /**
   * Returns the last element in the list.
   *
   * @returns The element at the tail of the list.
   * @throws Error If the list is empty.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.add(10);
   * list.add(20);
   * list.getLast(); // 20
   */
  getLast(): T {
    if (this.tail === null) {
      throw new Error("List is empty");
    }
    return this.tail.value;
  }

  /**
   * Removes and returns the first element in the list.
   *
   * @returns The element that was at the head.
   * @throws Error If the list is empty.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.add(1);
   * list.removeFirst(); // 1
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
   *
   * @returns The element that was at the tail.
   * @throws Error If the list is empty.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.add(1);
   * list.add(2);
   * list.removeLast(); // 2
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
   * Replaces the element at the specified index.
   *
   * @param index - Zero-based position of the element to replace.
   * @param element - New element to store at the index.
   * @returns The element previously stored at the index.
   * @throws Error If the index is out of bounds or the new element fails validation.
   * @throws Error If the node at the index is `null`.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.add(1);
   * list.set(0, 2); // returns 1
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
   * Inserts an element at the specified index, shifting later elements to the right.
   *
   * @param index - Zero-based insertion position. Can be equal to `size()` to append.
   * @param element - The element to insert.
   * @throws Error If the index is out of bounds or the element fails validation.
   *
   * @example
   * const list = new LinkedList<string>();
   * list.add("b");
   * list.addAt(0, "a");
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
   *
   * @param index - Zero-based position of the element to remove.
   * @returns The removed element.
   * @throws Error If the index is out of bounds or removal fails.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.add(7);
   * list.removeAt(0); // 7
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
   * Returns the index of the first occurrence of an element.
   *
   * @param element - Element to locate.
   * @returns Zero-based index of the first match, or `-1` if not found.
   *
   * @example
   * const list = new LinkedList<string>();
   * list.add("x");
   * list.indexOf("x"); // 0
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
   * Returns the index of the last occurrence of an element.
   *
   * @param element - Element to locate.
   * @returns Zero-based index of the last match, or `-1` if not found.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.add(1);
   * list.add(1);
   * list.lastIndexOf(1); // 1
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
   * Returns a new list containing elements in the specified range.
   *
   * @param fromIndex - Start index (inclusive).
   * @param toIndex - End index (exclusive).
   * @returns A new `LinkedList` with the selected elements.
   * @throws Error If the index range is invalid.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.add(1);
   * list.add(2);
   * list.add(3);
   * const sub = list.subList(1, 3); // [2, 3]
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
   *
   * @returns Current size of the list.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.size(); // 0
   */
  override size(): number {
    return this.elementCount;
  }

  /**
   * Removes all elements from the list.
   *
   * @example
   * const list = new LinkedList<string>();
   * list.add("a");
   * list.clear();
   */
  override clear(): void {
    this.head = null;
    this.tail = null;
    this.elementCount = 0;
    this.resetTypeInference();
  }

  /**
   * Checks whether the list contains a given element.
   *
   * @param element - Element to check.
   * @returns `true` if the element is present; otherwise `false`.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.add(3);
   * list.contains(3); // true
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
   * Returns an iterator over the elements in insertion order.
   *
   * @returns An iterator with `hasNext()` and `next()` methods.
   * @throws Error When `next()` is called with no remaining elements.
   *
   * @example
   * const list = new LinkedList<string>();
   * list.add("a");
   * const it = list.iterator();
   * while (it.hasNext()) {
   *   console.log(it.next());
   * }
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
   * Returns a shallow copy of the list as a native array.
   *
   * @returns A new array containing the list elements.
   *
   * @example
   * const list = new LinkedList<number>();
   * list.add(1);
   * const arr = list.toArray(); // [1]
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
   * Returns an iterator over the elements in reverse order.
   *
   * @returns An iterator with `hasNext()` and `next()` methods for backward traversal.
   * @throws Error When `next()` is called with no remaining elements.
   *
   * @example
   * const list = new LinkedList<string>();
   * list.add("a");
   * list.add("b");
   * const rev = list.reverseIterator();
   * while (rev.hasNext()) {
   *   console.log(rev.next()); // "b", then "a"
   * }
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
   * Returns the node at the specified index.
   *
   * @param index - Zero-based index of the node to retrieve.
   * @returns The node at the given index, or `null` if out of bounds.
   *
   * @remarks
   * Optimizes traversal by starting from the closer end (head or tail)
   * based on the target index.
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
   * Validates that an index is within the bounds of the list.
   *
   * @param index - Zero-based index to validate.
   * @throws Error If the index is out of range.
   */
  private checkIndex(index: number): void {
    if (index < 0 || index >= this.elementCount) {
      throw new Error(`Index out of bounds: ${index}`);
    }
  }
}
