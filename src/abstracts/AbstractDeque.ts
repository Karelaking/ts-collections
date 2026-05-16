import type { Deque, Iterator } from "../interfaces";
import { AbstractQueue, type TypeValidationOptions } from "./AbstractQueue";

export type { TypeValidationOptions };

/**
 * Abstract base class for Deque implementations.
 *
 * Provides Queue compatibility defaults:
 * - offer() delegates to offerLast()
 * - dequeue()/poll() delegate to pollFirst()
 * - element() delegates to getFirst()
 * - peek() delegates to peekFirst()
 *
 * @template E The type of elements in this deque
 */
export abstract class AbstractDeque<E>
  extends AbstractQueue<E>
  implements Deque<E> {
  constructor(options?: TypeValidationOptions<E>) {
    super(options);
  }

  abstract addFirst(element: E): void;

  abstract addLast(element: E): void;

  abstract offerFirst(element: E): boolean;

  abstract offerLast(element: E): boolean;

  abstract removeFirst(): E;

  abstract removeLast(): E;

  abstract pollFirst(): E | undefined;

  abstract pollLast(): E | undefined;

  abstract getFirst(): E;

  abstract getLast(): E;

  abstract peekFirst(): E | undefined;

  abstract peekLast(): E | undefined;

  removeFirstOccurrence(element: E): boolean {
    return this.remove(element);
  }

  removeLastOccurrence(element: E): boolean {
    const values = this.toArray();
    const index = values.lastIndexOf(element);
    if (index < 0) {
      return false;
    }

    this.clear();
    for (let i = 0; i < values.length; i++) {
      if (i !== index) {
        const value = values[i];
        if (value !== undefined) {
          this.addLast(value);
        }
      }
    }

    return true;
  }

  push(element: E): void {
    this.addFirst(element);
  }

  pop(): E {
    return this.removeFirst();
  }

  descendingIterator(): Iterator<E> {
    const snapshot = this.toArray();
    let index = snapshot.length - 1;

    return {
      hasNext: () => index >= 0,
      next: () => {
        if (index < 0) {
          throw new Error("No more elements");
        }
        const value = snapshot[index--];
        if (value === undefined) {
          throw new Error("No more elements");
        }
        return value;
      },
    };
  }

  override offer(element: E): boolean {
    return this.offerLast(element);
  }

  override dequeue(): E | undefined {
    return this.pollFirst();
  }

  override poll(): E | undefined {
    return this.pollFirst();
  }

  override element(): E {
    return this.getFirst();
  }

  override peek(): E | undefined {
    return this.peekFirst();
  }
}
