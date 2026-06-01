import {
  AbstractStack,
  type TypeValidationOptions,
} from "../abstracts/AbstractStack";
import type { Iterator } from "../interfaces/Iterator";
import type { Stack } from "../interfaces/Stack";
import { ArrayList } from "../list/ArrayList";

/**
 * An array-based Stack implementation with LIFO semantics.
 * Uses an ArrayList internally for efficient operations at the end of the list.
 * Includes automatic runtime type validation by default.
 *
 * ### Error behavior
 * - `pop()` and `peek()` return `undefined` when the stack is empty.
 * - Iterator `next()` throws when no elements remain.
 *
 * @typeParam T - The element type stored in the stack.
 *
 * @example
 * const stack = new ArrayStack<number>();
 * stack.push(1);
 * stack.push(2);
 * console.log(stack.pop()); // 2
 * console.log(stack.peek()); // 1
 */
export class ArrayStack<T> extends AbstractStack<T> implements Stack<T> {
  private readonly list: ArrayList<T>;

  constructor(options?: TypeValidationOptions<T>) {
    super(options);
    this.list = new ArrayList<T>(options);
  }

  /**
   * Pushes an element onto the top of the stack.
   * @returns true if the element was pushed
   */
  override push(element: T): boolean {
    this.validateElementType(
      element,
      this.createValidationContext(
        "push",
        "stack element",
        element,
        this.list.size(),
      ),
    );
    this.list.add(element);
    return true;
  }

  /**
   * Removes and returns the top element of the stack.
   * @returns The top element, or undefined if the stack is empty
   */
  override pop(): T | undefined {
    if (this.list.isEmpty()) {
      return;
    }

    const value = this.list.removeAt(this.list.size() - 1);

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
      return;
    }
    return this.list.get(this.list.size() - 1);
  }

  /**
   * Returns the 1-based position where an object is on this stack.
   * @returns The 1-based position from the top of the stack, or -1 if not found
   */
  override search(element: T): number {
    const index = this.list.lastIndexOf(element);
    return index >= 0 ? this.list.size() - index : -1;
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
    let index = this.list.size() - 1;
    return {
      hasNext: () => index >= 0,
      next: () => {
        if (index < 0) {
          throw new Error("No more elements");
        }
        const value = this.list.get(index);
        index--;
        return value;
      },
    };
  }

  /**
   * Returns an array containing all stack elements from top to bottom.
   */
  override toArray(): T[] {
    return this.list.toArray().reverse();
  }
}
