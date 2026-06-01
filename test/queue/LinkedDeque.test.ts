import { beforeEach, describe, expect, it } from "vitest";
import { LinkedDeque } from "../../src/queue/LinkedDeque";
import { describeDeque } from "../interfaces/Deque";

// Run shared Deque interface tests
describeDeque(() => new LinkedDeque<number>());

describe("LinkedDeque - Core Methods", () => {
  let deque: LinkedDeque<number>;

  beforeEach(() => {
    deque = new LinkedDeque<number>();
  });

  it("should support mixed front/back operations", () => {
    deque.addFirst(2);
    deque.addLast(3);
    deque.addFirst(1);
    deque.addLast(4);

    expect(deque.toArray()).toEqual([1, 2, 3, 4]);

    expect(deque.pollFirst()).toBe(1);
    expect(deque.pollLast()).toBe(4);
    expect(deque.pollFirst()).toBe(2);
    expect(deque.pollLast()).toBe(3);
    expect(deque.isEmpty()).toBe(true);
  });

  it("should reset inferred type when emptied", () => {
    deque.addLast(1);
    expect(deque.pollFirst()).toBe(1);
    expect(deque.isEmpty()).toBe(true);

    // Should allow different type inference in a new lifecycle when casted through unknown
    const anyDeque = deque as unknown as LinkedDeque<unknown>;
    expect(() => anyDeque.addLast("text")).not.toThrow();
  });

  it("should return independent array", () => {
    deque.addLast(1);
    deque.addLast(2);
    const arr = deque.toArray();
    arr.pop();
    expect(deque.size()).toBe(2);
  });

  it("should provide iterator from front to back", () => {
    deque.addLast(1);
    deque.addLast(2);
    deque.addLast(3);

    const values: number[] = [];
    const iterator = deque.iterator();

    while (iterator.hasNext()) {
      values.push(iterator.next());
    }

    expect(values).toEqual([1, 2, 3]);
  });
});
