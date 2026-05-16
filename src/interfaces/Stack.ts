import type { Collection } from "./Collection";

/**
 * A last-in-first-out (LIFO) collection of elements.
 * Provides push and pop operations for stack behavior.
 *
 * @template E The type of elements in this stack
 *
 * @example
 * const stack = new LinkedStack<number>();
 * stack.push(1); stack.push(2);
 * stack.peek(); // 2 (not removed)
 * stack.pop();  // 2 (removed)
 * stack.size(); // 1
 */
export interface Stack<E> extends Collection<E> {
  /**
   * Pushes an element onto the top of the stack.
   *
   * @param element Element to push onto the stack
   * @returns true if the element was pushed
   */
  push(element: E): boolean;

  /**
   * Removes and returns the element at the top of the stack.
   * Returns undefined if the stack is empty.
   */
  pop(): E | undefined;

  /**
   * Retrieves, but does not remove, the element at the top of the stack.
   * Returns undefined if the stack is empty.
   */
  peek(): E | undefined;
}
