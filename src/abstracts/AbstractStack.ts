import type { Stack } from "../interfaces";
import { AbstractCollection, type TypeValidationOptions } from "./AbstractCollection";

export type { TypeValidationOptions };

/**
 * Abstract base class for Stack implementations.
 * Provides a default alias from Collection.add to push.
 * Concrete subclasses must implement push, pop, peek, size, contains, iterator, toArray, clear, and remove.
 *
 * @template E The type of elements in this stack
 */
export abstract class AbstractStack<E> extends AbstractCollection<E> implements Stack<E> {
  constructor(options?: TypeValidationOptions<E>) {
    super(options);
  }

  /**
   * Pushes an element onto the stack.
   */
  abstract push(element: E): boolean;

  /**
   * Pops the top element from the stack.
   */
  abstract pop(): E | undefined;

  /**
   * Peeks at the top element without removing it.
   */
  abstract peek(): E | undefined;

  /**
   * Collection.add alias that delegates to push for stack semantics.
   */
  override add(element: E): boolean {
    return this.push(element);
  }
}
