import {
  AbstractQueue,
  type TypeValidationOptions,
} from "../abstracts/AbstractQueue";
import type { Iterator } from "../interfaces/Iterator";
import type { Queue } from "../interfaces/Queue";

export interface PriorityQueueOptions<T> extends TypeValidationOptions<T> {
  comparator?: (a: T, b: T) => number;
}

/**
 * A priority-based queue implementation backed by a binary heap.
 *
 * Default behavior is min-heap ordering for comparable primitive values.
 * For custom ordering or non-primitive values, provide a comparator.
 *
 * @template T The type of elements in this queue
 */
export class PriorityQueue<T> extends AbstractQueue<T> implements Queue<T> {
  private readonly heap: T[] = [];
  private readonly comparator: (a: T, b: T) => number;

  constructor(options?: PriorityQueueOptions<T>) {
    super(options);
    this.comparator = options?.comparator ?? this.defaultComparator;
  }

  override offer(element: T): boolean {
    this.validateElementType(element);
    this.heap.push(element);
    this.siftUp(this.heap.length - 1);
    return true;
  }

  override dequeue(): T | undefined {
    return this.poll();
  }

  override poll(): T | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }

    const root = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0 && last !== undefined) {
      this.heap[0] = last;
      this.siftDown(0);
    }

    if (this.heap.length === 0) {
      this.resetTypeInference();
    }

    return root;
  }

  override element(): T {
    const value = this.peek();
    if (value === undefined) {
      throw new Error("Queue is empty");
    }
    return value;
  }

  override peek(): T | undefined {
    return this.heap[0];
  }

  override size(): number {
    return this.heap.length;
  }

  override clear(): void {
    this.heap.length = 0;
    this.resetTypeInference();
  }

  override contains(element: T): boolean {
    return this.heap.includes(element);
  }

  override remove(element: T): boolean {
    const index = this.heap.findIndex((candidate) => candidate === element);

    if (index === -1) {
      return false;
    }

    const last = this.heap.pop();

    if (last !== undefined && index < this.heap.length) {
      this.heap[index] = last;
      this.restoreHeap(index);
    }

    if (this.heap.length === 0) {
      this.resetTypeInference();
    }

    return true;
  }

  override iterator(): Iterator<T> {
    const snapshot = this.toArray();
    let index = 0;

    return {
      hasNext: () => index < snapshot.length,
      next: () => {
        if (index >= snapshot.length) {
          throw new Error("No more elements");
        }
        const value = snapshot[index++];
        if (value === undefined) {
          throw new Error("No more elements");
        }
        return value;
      },
    };
  }

  override toArray(): T[] {
    return [...this.heap].sort((a, b) => this.comparator(a, b));
  }

  private restoreHeap(index: number): void {
    if (index > 0) {
      const parent = this.parentIndex(index);
      if (this.comparator(this.valueAt(index), this.valueAt(parent)) < 0) {
        this.siftUp(index);
        return;
      }
    }

    this.siftDown(index);
  }

  private siftUp(startIndex: number): void {
    let index = startIndex;

    while (index > 0) {
      const parent = this.parentIndex(index);
      if (this.comparator(this.valueAt(index), this.valueAt(parent)) >= 0) {
        break;
      }
      this.swap(index, parent);
      index = parent;
    }
  }

  private siftDown(startIndex: number): void {
    let index = startIndex;

    while (true) {
      const left = this.leftChildIndex(index);
      const right = this.rightChildIndex(index);
      let smallest = index;

      if (
        left < this.heap.length &&
        this.comparator(this.valueAt(left), this.valueAt(smallest)) < 0
      ) {
        smallest = left;
      }

      if (
        right < this.heap.length &&
        this.comparator(this.valueAt(right), this.valueAt(smallest)) < 0
      ) {
        smallest = right;
      }

      if (smallest === index) {
        break;
      }

      this.swap(index, smallest);
      index = smallest;
    }
  }

  private swap(i: number, j: number): void {
    const left = this.valueAt(i);
    const right = this.valueAt(j);
    this.heap[i] = right;
    this.heap[j] = left;
  }

  private valueAt(index: number): T {
    const value = this.heap[index];
    if (value === undefined) {
      throw new Error(`Heap corruption: invalid index ${index}`);
    }
    return value;
  }

  private parentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private leftChildIndex(index: number): number {
    return index * 2 + 1;
  }

  private rightChildIndex(index: number): number {
    return index * 2 + 2;
  }

  private readonly defaultComparator = (a: T, b: T): number => {
    // Handle null and undefined
    if (a === null && b === null) return 0;
    if (a === null) return -1;
    if (b === null) return 1;
    if (a === undefined && b === undefined) return 0;
    if (a === undefined) return -1;
    if (b === undefined) return 1;

    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    }

    if (typeof a === "string" && typeof b === "string") {
      return a < b ? -1 : a > b ? 1 : 0;
    }

    if (typeof a === "bigint" && typeof b === "bigint") {
      return a < b ? -1 : a > b ? 1 : 0;
    }

    if (typeof a === "boolean" && typeof b === "boolean") {
      return Number(a) - Number(b);
    }

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() - b.getTime();
    }

    throw new Error("Comparator is required for non-primitive element types");
  };
}
