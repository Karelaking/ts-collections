import type { Iterator } from "../interfaces/Iterator";
import type { Stack } from "../interfaces/Stack";
import { LinkedList } from "../list/LinkedList";
import { AbstractStack, type TypeValidationOptions } from "../abstracts/AbstractStack";

/**
 * A linked list-based Stack implementation with LIFO semantics.
 * Uses a doubly linked list internally for O(1) push and pop operations.
 * Includes automatic runtime type validation by default.
 *
 * @template T The type of elements in this stack
 */
export class LinkedStack<T> extends AbstractStack<T> implements Stack<T> {
  private readonly list: LinkedList<T>;

  constructor(options?: TypeValidationOptions<T>) {
    super(options);
    this.list = new LinkedList<T>(options);
  }

  /**
   * Pushes an element onto the top of the stack.
   * @returns true if the element was pushed
   */
  override push(element: T): boolean {
    this.validateElementType(element);
    this.list.addFirst(element);
    return true;
  }

  /**
   * Removes and returns the top element of the stack.
   * @returns The top element, or undefined if the stack is empty
   */
  override pop(): T | undefined {
    if (this.list.isEmpty()) {
      return undefined;
    }

    const value = this.list.removeFirst();

    if (this.list.isEmpty()) {
      this.resetTypeInference();
    }

    return value;
  }

  /**
   * Retrieves, but does not remove, the top element of the stack.
   * @returns The top element, or undefined if the stack is empty
   */
  override peek(): T | undefined {
    if (this.list.isEmpty()) {
      return undefined;
    }
    return this.list.getFirst();
  }

  /**
   * Returns the number of elements in the stack.
   */
  override size(): number {
    return this.list.size();
  }

  /**
   * Removes all elements from the stack.
   */
  override clear(): void {
    this.list.clear();
    this.resetTypeInference();
  }

  /**
   * Returns true if the stack contains the specified element.
   */
  override contains(element: T): boolean {
    return this.list.contains(element);
  }

  /**
   * Removes the first occurrence of the specified element from the stack.
   * @returns true if an element was removed
   */
  override remove(element: T): boolean {
    const removed = this.list.remove(element);
    if (this.list.isEmpty()) {
      this.resetTypeInference();
    }
    return removed;
  }

  /**
   * Returns an iterator over the stack elements from top to bottom.
   */
  override iterator(): Iterator<T> {
    return this.list.iterator();
  }

  /**
   * Returns an array containing all stack elements from top to bottom.
   */
  override toArray(): T[] {
    return this.list.toArray();
  }
}
