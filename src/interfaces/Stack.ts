import type { Collection } from "./Collection";

/**
 * A last-in-first-out (LIFO) collection of elements.
 * Provides push and pop operations for stack behavior.
 *
 * @template E The type of elements in this stack
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
