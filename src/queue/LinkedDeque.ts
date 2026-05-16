import {
  AbstractDeque,
  type TypeValidationOptions,
} from "../abstracts/AbstractDeque";
import type { Deque } from "../interfaces/Deque";
import type { Iterator } from "../interfaces/Iterator";
import { LinkedList } from "../list/LinkedList";

/**
 * A linked list-based Deque implementation.
 *
 * Supports O(1) insertion and removal at both ends.
 * Includes runtime type validation by default.
 *
 * @template T The type of elements in this deque
 */
export class LinkedDeque<T> extends AbstractDeque<T> implements Deque<T> {
  private readonly list: LinkedList<T>;

  constructor(options?: TypeValidationOptions<T>) {
    super(options);
    // Deque handles validation itself; internal list is storage-only.
    this.list = new LinkedList<T>({ strict: false });
  }

  override addFirst(element: T): void {
    this.validateElementType(element);
    this.list.addFirst(element);
  }

  override addLast(element: T): void {
    this.validateElementType(element);
    this.list.addLast(element);
  }

  override offerFirst(element: T): boolean {
    this.addFirst(element);
    return true;
  }

  override offerLast(element: T): boolean {
    this.addLast(element);
    return true;
  }

  override removeFirst(): T {
    const value = this.list.removeFirst();

    if (this.list.isEmpty()) {
      this.resetTypeInference();
    }

    return value;
  }

  override removeLast(): T {
    const value = this.list.removeLast();

    if (this.list.isEmpty()) {
      this.resetTypeInference();
    }

    return value;
  }

  override pollFirst(): T | undefined {
    if (this.list.isEmpty()) {
      return undefined;
    }
    return this.removeFirst();
  }

  override pollLast(): T | undefined {
    if (this.list.isEmpty()) {
      return undefined;
    }
    return this.removeLast();
  }

  override getFirst(): T {
    return this.list.getFirst();
  }

  override getLast(): T {
    return this.list.getLast();
  }

  override peekFirst(): T | undefined {
    if (this.list.isEmpty()) {
      return undefined;
    }
    return this.list.getFirst();
  }

  override peekLast(): T | undefined {
    if (this.list.isEmpty()) {
      return undefined;
    }
    return this.list.getLast();
  }

  override size(): number {
    return this.list.size();
  }

  override clear(): void {
    this.list.clear();
    this.resetTypeInference();
  }

  override contains(element: T): boolean {
    return this.list.contains(element);
  }

  override remove(element: T): boolean {
    const removed = this.list.remove(element);

    if (this.list.isEmpty()) {
      this.resetTypeInference();
    }

    return removed;
  }

  override iterator(): Iterator<T> {
    return this.list.iterator();
  }

  override toArray(): T[] {
    return this.list.toArray();
  }
}
