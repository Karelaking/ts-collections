import type { Iterator } from "../interfaces/Iterator";
import type { Stack } from "../interfaces/Stack";
import { LinkedList } from "../list/LinkedList";
import { AbstractStack, type TypeValidationOptions } from "../abstracts/AbstractStack";

/**
 * A LIFO stack backed by a doubly linked list.
 *
 * This stack behaves like Java's `Stack`: it maintains last-in-first-out ordering,
 * provides constant-time push and pop operations, and delegates to an internal
 * `LinkedList` for storage.
 *
 * ### Performance characteristics
 * - `push`, `pop`, `peek`: $O(1)$
 * - `contains`, `remove`: $O(n)$ due to traversal
 * - `size`: $O(1)$
 *
 * ### Internal behavior
 * - Uses a `LinkedList<T>` internally for element storage.
 * - Elements are added and removed from the head of the list (LIFO).
 * - When runtime type validation is enabled, each pushed element is validated.
 *
 * ### Error behavior
 * - `pop()` and `peek()` return `undefined` when the stack is empty.
 * - Iterator `next()` throws when no elements remain.
 *
 * @typeParam T - The element type stored in the stack.
 *
 * @example
 * const stack = new LinkedStack<number>();
 * stack.push(1);
 * stack.push(2);
 * console.log(stack.pop()); // 2
 * console.log(stack.peek()); // 1
 */
export class LinkedStack<T> extends AbstractStack<T> implements Stack<T> {
  /**
   * Internal storage using a doubly linked list.
   * Elements are added and removed from the head for LIFO behavior.
   */
  private readonly list: LinkedList<T>;

  /**
   * Creates a new empty stack.
   *
   * @param options - Optional type-validation configuration inherited from `AbstractStack`.
   *
   * @example
   * const stack = new LinkedStack<string>();
   * const strictStack = new LinkedStack<number>({ strictTypeChecking: true });
   */
  constructor(options?: TypeValidationOptions<T>) {
    super(options);
    this.list = new LinkedList<T>(options);
  }

  /**
   * Pushes an element onto the top of the stack.
   *
   * @param element - The element to be pushed onto the stack.
   * @returns `true` when the element is pushed successfully.
   * @throws Error If the element type is invalid under the current validation rules.
   *
   * @example
   * const stack = new LinkedStack<number>();
   * stack.push(42); // true
   */
  override push(element: T): boolean {
    this.validateElementType(element);
    this.list.addFirst(element);
    return true;
  }

  /**
   * Removes and returns the top element of the stack.
   *
   * @returns The top element, or `undefined` if the stack is empty.
   *
   * @example
   * const stack = new LinkedStack<number>();
   * stack.push(1);
   * stack.pop(); // 1
   * stack.pop(); // undefined
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
   *
   * @returns The top element, or `undefined` if the stack is empty.
   *
   * @example
   * const stack = new LinkedStack<number>();
   * stack.peek(); // undefined
   * stack.push(1);
   * stack.peek(); // 1
   */
  override peek(): T | undefined {
    if (this.list.isEmpty()) {
      return undefined;
    }
    return this.list.getFirst();
  }

  /**
   * Returns the number of elements in the stack.
   *
   * @returns Current size of the stack.
   *
   * @example
   * const stack = new LinkedStack<number>();
   * stack.size(); // 0
   * stack.push(1);
   * stack.size(); // 1
   */
  override size(): number {
    return this.list.size();
  }

  /**
   * Removes all elements from the stack.
   *
   * @example
   * const stack = new LinkedStack<string>();
   * stack.push("a");
   * stack.clear();
   * stack.size(); // 0
   */
  override clear(): void {
    this.list.clear();
    this.resetTypeInference();
  }

  /**
   * Returns `true` if the stack contains the specified element.
   *
   * @param element - Element to check.
   * @returns `true` if the element is present; otherwise `false`.
   *
   * @example
   * const stack = new LinkedStack<number>();
   * stack.push(3);
   * stack.contains(3); // true
   * stack.contains(5); // false
   */
  override contains(element: T): boolean {
    return this.list.contains(element);
  }

  /**
   * Removes the first occurrence of the specified element from the stack.
   *
   * @param element - The element to be removed from the stack.
   * @returns `true` if an element was removed; otherwise `false`.
   *
   * @example
   * const stack = new LinkedStack<number>();
   * stack.push(1);
   * stack.push(2);
   * stack.remove(1); // true
   * stack.remove(1); // false
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
   *
   * @returns An iterator with `hasNext()` and `next()` methods.
   * @throws Error When `next()` is called with no remaining elements.
   *
   * @example
   * const stack = new LinkedStack<string>();
   * stack.push("a");
   * stack.push("b");
   * const it = stack.iterator();
   * while (it.hasNext()) {
   *   console.log(it.next()); // "b", then "a"
   * }
   */
  override iterator(): Iterator<T> {
    return this.list.iterator();
  }

  /**
   * Returns a shallow copy of the stack as a native array.
   *
   * @returns A new array containing all stack elements from top to bottom.
   *
   * @example
   * const stack = new LinkedStack<number>();
   * stack.push(1);
   * stack.push(2);
   * const arr = stack.toArray(); // [2, 1]
   */
  override toArray(): T[] {
    return this.list.toArray();
  }
}
