import { beforeEach, describe, expect, it } from "vitest";
import { PriorityQueue } from "../../src/queue/PriorityQueue";

describe("PriorityQueue - Core Methods", () => {
  let queue: PriorityQueue<number>;

  beforeEach(() => {
    queue = new PriorityQueue<number>();
  });

  it("should dequeue values in ascending priority by default", () => {
    queue.offer(5);
    queue.offer(1);
    queue.offer(3);
    queue.offer(2);

    expect(queue.poll()).toBe(1);
    expect(queue.poll()).toBe(2);
    expect(queue.poll()).toBe(3);
    expect(queue.poll()).toBe(5);
    expect(queue.poll()).toBeUndefined();
  });

  it("should support custom comparator", () => {
    const maxHeap = new PriorityQueue<number>({
      comparator: (a, b) => b - a,
    });

    maxHeap.offer(5);
    maxHeap.offer(1);
    maxHeap.offer(3);

    expect(maxHeap.poll()).toBe(5);
    expect(maxHeap.poll()).toBe(3);
    expect(maxHeap.poll()).toBe(1);
  });

  it("should expose element and peek semantics", () => {
    queue.offer(10);
    queue.offer(2);

    expect(queue.element()).toBe(2);
    expect(queue.peek()).toBe(2);
    expect(queue.size()).toBe(2);
  });

  it("should throw from element when empty", () => {
    expect(() => queue.element()).toThrow("Queue is empty");
  });

  it("should return undefined from poll/peek when empty", () => {
    expect(queue.poll()).toBeUndefined();
    expect(queue.peek()).toBeUndefined();
  });

  it("should remove a specific element", () => {
    queue.offer(4);
    queue.offer(1);
    queue.offer(3);

    expect(queue.remove(3)).toBe(true);
    expect(queue.contains(3)).toBe(false);
    expect(queue.size()).toBe(2);
  });

  it("should return false when removing missing element", () => {
    queue.offer(1);
    expect(queue.remove(99)).toBe(false);
  });

  it("should clear queue", () => {
    queue.offer(1);
    queue.offer(2);
    queue.clear();

    expect(queue.size()).toBe(0);
    expect(queue.isEmpty()).toBe(true);
    expect(queue.poll()).toBeUndefined();
  });

  it("should return sorted snapshot from toArray", () => {
    queue.offer(7);
    queue.offer(1);
    queue.offer(5);

    expect(queue.toArray()).toEqual([1, 5, 7]);
  });

  it("should iterate in priority order", () => {
    queue.offer(4);
    queue.offer(2);
    queue.offer(3);

    const values: number[] = [];
    const iterator = queue.iterator();

    while (iterator.hasNext()) {
      values.push(iterator.next());
    }

    expect(values).toEqual([2, 3, 4]);
  });

  it("should enforce runtime type validation by default", () => {
    queue.offer(1);
    expect(() => queue.offer("text" as unknown as number)).toThrow(TypeError);
  });

  it("should require comparator for non-comparable object values", () => {
    const objectQueue = new PriorityQueue<{ value: number }>();
    objectQueue.offer({ value: 1 });

    expect(() => objectQueue.offer({ value: 2 })).toThrow(
      "Comparator is required for non-primitive element types",
    );
  });
});
