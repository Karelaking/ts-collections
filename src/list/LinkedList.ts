import type { Iterator } from "../interfaces/Iterator";
import type { List } from "../interfaces/List";
import { AbstractList, type TypeValidationOptions } from "../abstracts/AbstractList";

interface Node<T> {
  value: T;
  prev: Node<T> | null;
  next: Node<T> | null;
}

/**
 * A doubly-linked List implementation.
 * Provides O(1) insertions/removals at ends and O(n) indexed access.
 * Includes automatic runtime type validation by default (like Java's collections).
 */
export class LinkedList<T> extends AbstractList<T> implements List<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  private elementCount = 0;

  constructor(options?: TypeValidationOptions<T>) {
    super(options);
  }

  override add(element: T): boolean {
    this.validateElementType(element);
    const newNode: Node<T> = { value: element, prev: this.tail, next: null };

    if (this.tail) {
      this.tail.next = newNode;
    } else {
      this.head = newNode;
    }

    this.tail = newNode;
    this.elementCount += 1;
    return true;
  }

  override get(index: number): T {
    const node = this.getNode(index);
    return node.value;
  }

  override set(index: number, element: T): T {
    const node = this.getNode(index);
    this.validateElementType(element);
    const previous = node.value;
    node.value = element;
    return previous;
  }

  override addAt(index: number, element: T): void {
    this.checkPositionIndex(index);
    this.validateElementType(element);

    if (index === this.elementCount) {
      this.add(element);
      return;
    }

    if (index === 0 && this.head !== null) {
      const newNode: Node<T> = { value: element, prev: null, next: this.head };
      this.head.prev = newNode;
      this.head = newNode;
      this.elementCount += 1;
      return;
    }

    const nextNode = this.getNode(index);
    const prevNode = nextNode.prev;
    const newNode: Node<T> = { value: element, prev: prevNode, next: nextNode };

    if (prevNode) {
      prevNode.next = newNode;
    }
    nextNode.prev = newNode;

    if (index === 0) {
      this.head = newNode;
    }

    this.elementCount += 1;
  }

  override removeAt(index: number): T {
    const node = this.getNode(index);
    const { prev, next } = node;

    if (prev) {
      prev.next = next;
    } else {
      this.head = next;
    }

    if (next) {
      next.prev = prev;
    } else {
      this.tail = prev;
    }

    this.elementCount -= 1;
    return node.value;
  }

  override indexOf(element: T): number {
    let current = this.head;
    let idx = 0;
    while (current) {
      if (current.value === element) {
        return idx;
      }
      current = current.next;
      idx += 1;
    }
    return -1;
  }

  override lastIndexOf(element: T): number {
    let current = this.tail;
    let idx = this.elementCount - 1;
    while (current) {
      if (current.value === element) {
        return idx;
      }
      current = current.prev;
      idx -= 1;
    }
    return -1;
  }

  override subList(fromIndex: number, toIndex: number): List<T> {
    if (fromIndex < 0 || toIndex > this.elementCount || fromIndex > toIndex) {
      throw new Error("Invalid index range");
    }

    const subListOptions: TypeValidationOptions<T> = { strict: this.strict };
    if (this.schema) {
      subListOptions.schema = this.schema;
    }
    if (this.typeValidator) {
      subListOptions.validator = this.typeValidator;
    }

    const subList = new LinkedList<T>(subListOptions);

    let current = this.head;
    let idx = 0;
    while (current && idx < toIndex) {
      if (idx >= fromIndex) {
        subList.add(current.value);
      }
      current = current.next;
      idx += 1;
    }

    return subList;
  }

  override size(): number {
    return this.elementCount;
  }

  override clear(): void {
    this.head = null;
    this.tail = null;
    this.elementCount = 0;
    this.resetTypeInference();
  }

  override contains(element: T): boolean {
    return this.indexOf(element) !== -1;
  }

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

  override toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  override sort(compareFn?: (a: T, b: T) => number): void {
    if (this.elementCount <= 1 || this.head === null) {
      return;
    }

    const comparator = compareFn ?? this.compareNatural.bind(this);
    const { head, tail } = this.mergeSort(this.head, this.elementCount, comparator);
    this.head = head;
    this.tail = tail;
  }

  private getNode(index: number): Node<T> {
    this.checkElementIndex(index);

    if (index < this.elementCount / 2) {
      let current = this.head;
      let idx = 0;
      while (current) {
        if (idx === index) {
          return current;
        }
        current = current.next;
        idx += 1;
      }
    } else {
      let current = this.tail;
      let idx = this.elementCount - 1;
      while (current) {
        if (idx === index) {
          return current;
        }
        current = current.prev;
        idx -= 1;
      }
    }

    throw new Error(`Index out of bounds: ${index}`);
  }

  private checkElementIndex(index: number): void {
    if (index < 0 || index >= this.elementCount) {
      throw new Error(`Index out of bounds: ${index}`);
    }
  }

  private checkPositionIndex(index: number): void {
    if (index < 0 || index > this.elementCount) {
      throw new Error(`Index out of bounds: ${index}`);
    }
  }

  private mergeSort(
    head: Node<T>,
    length: number,
    comparator: (a: T, b: T) => number
  ): { head: Node<T>; tail: Node<T> } {
    if (length === 1) {
      head.prev = null;
      head.next = null;
      return { head, tail: head };
    }

    const mid = Math.floor(length / 2);
    let rightHead = head;
    let leftTail: Node<T> | null = null;
    let idx = 0;
    while (idx < mid) {
      leftTail = rightHead;
      rightHead = rightHead.next as Node<T>;
      idx += 1;
    }

    if (!leftTail || !rightHead) {
      return { head, tail: leftTail ?? head };
    }

    leftTail.next = null;
    rightHead.prev = null;

    const left = this.mergeSort(head, mid, comparator);
    const right = this.mergeSort(rightHead, length - mid, comparator);
    return this.merge(left, right, comparator);
  }

  private merge(
    left: { head: Node<T>; tail: Node<T> },
    right: { head: Node<T>; tail: Node<T> },
    comparator: (a: T, b: T) => number
  ): { head: Node<T>; tail: Node<T> } {
    let l: Node<T> | null = left.head;
    let r: Node<T> | null = right.head;
    let mergedHead: Node<T> | null = null;
    let mergedTail: Node<T> | null = null;

    while (l && r) {
      const takeLeft = comparator(l.value, r.value) <= 0;
      const node = takeLeft ? l : r;
      if (takeLeft) {
        l = l.next;
      } else {
        r = r.next;
      }

      if (!mergedHead) {
        mergedHead = node;
        mergedTail = node;
        node.prev = null;
        node.next = null;
      } else {
        node.prev = mergedTail;
        node.next = null;
        mergedTail!.next = node;
        mergedTail = node;
      }
    }

    let remaining = l ?? r;
    while (remaining) {
      const node = remaining;
      remaining = remaining.next;
      node.prev = mergedTail;
      node.next = null;
      if (mergedTail) {
        mergedTail.next = node;
      }
      mergedTail = node;
      if (!mergedHead) {
        mergedHead = node;
      }
    }

    // mergedTail should be non-null because total length >= 1
    return { head: mergedHead as Node<T>, tail: mergedTail as Node<T> };
  }
}
