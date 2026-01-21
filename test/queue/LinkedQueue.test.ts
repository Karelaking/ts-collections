import { describe, it, expect } from "vitest";
import { LinkedQueue } from "../../src/queue/LinkedQueue";
import { describeQueue } from "../interfaces/Queue.test";

/**
 * Test suite for LinkedQueue implementation
 */
describeQueue(() => new LinkedQueue<number>());

describe("LinkedQueue (additional tests)", () => {
  it("should construct an empty queue", () => {
    const queue = new LinkedQueue<number>();
    expect(queue.size()).toBe(0);
  });

  it("should support offer and dequeue operations", () => {
    const queue = new LinkedQueue<number>();
    expect(queue.offer(1)).toBe(true);
    expect(queue.offer(2)).toBe(true);
    expect(queue.offer(3)).toBe(true);

    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBe(2);
    expect(queue.dequeue()).toBe(3);
    expect(queue.dequeue()).toBeUndefined();
  });

  it("should support poll operation", () => {
    const queue = new LinkedQueue<number>();
    queue.offer(1);
    queue.offer(2);

    expect(queue.poll()).toBe(1);
    expect(queue.poll()).toBe(2);
    expect(queue.poll()).toBeUndefined();
  });

  it("should support element operation", () => {
    const queue = new LinkedQueue<number>();
    queue.offer(1);
    queue.offer(2);

    expect(queue.element()).toBe(1);
    expect(queue.element()).toBe(1); // Should still be 1

    expect(() => {
      const emptyQueue = new LinkedQueue<number>();
      emptyQueue.element();
    }).toThrow();
  });

  it("should support peek operation", () => {
    const queue = new LinkedQueue<number>();
    expect(queue.peek()).toBeUndefined();

    queue.offer(1);
    queue.offer(2);

    expect(queue.peek()).toBe(1);
    expect(queue.peek()).toBe(1); // Should still be 1
  });

  it("should maintain FIFO order", () => {
    const queue = new LinkedQueue<number>();
    const elements = [1, 2, 3, 4, 5];

    for (const elem of elements) {
      queue.offer(elem);
    }

    for (const elem of elements) {
      expect(queue.dequeue()).toBe(elem);
    }
  });

  it("should support contains operation", () => {
    const queue = new LinkedQueue<number>();
    queue.offer(1);
    queue.offer(2);
    queue.offer(3);

    expect(queue.contains(1)).toBe(true);
    expect(queue.contains(2)).toBe(true);
    expect(queue.contains(4)).toBe(false);
  });

  it("should iterate through elements in order", () => {
    const queue = new LinkedQueue<number>();
    queue.offer(1);
    queue.offer(2);
    queue.offer(3);

    const elements: number[] = [];
    const iterator = queue.iterator();

    while (iterator.hasNext()) {
      elements.push(iterator.next());
    }

    expect(elements).toEqual([1, 2, 3]);
  });

  it("should convert to array", () => {
    const queue = new LinkedQueue<number>();
    queue.offer(1);
    queue.offer(2);
    queue.offer(3);

    expect(queue.toArray()).toEqual([1, 2, 3]);
  });

  it("should clear all elements", () => {
    const queue = new LinkedQueue<number>();
    queue.offer(1);
    queue.offer(2);
    queue.offer(3);

    queue.clear();

    expect(queue.size()).toBe(0);
    expect(queue.peek()).toBeUndefined();
  });
});
