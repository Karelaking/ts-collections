import { beforeEach, describe, expect, it } from "vitest";
import { LinkedList } from "../../src/list/LinkedList";

describe("LinkedList - Iterator Behavior", () => {
  let list: LinkedList<number>;

  beforeEach(() => {
    list = new LinkedList<number>();
    list.addAll([10, 20, 30]);
  });

  it("iterator traverses in insertion order and throws when exhausted", () => {
    const it = list.iterator();
    expect(it.hasNext()).toBe(true);
    expect(it.next()).toBe(10);
    expect(it.next()).toBe(20);
    expect(it.next()).toBe(30);
    expect(it.hasNext()).toBe(false);
    expect(() => it.next()).toThrow();
  });

  it("iterator sees mutations to the list (no snapshot behavior)", () => {
    const it = list.iterator();
    expect(it.next()).toBe(10);
    // remove middle element
    list.removeAt(1);
    // iterator still returns the removed node's value, then continues
    expect(it.next()).toBe(20);
    expect(it.next()).toBe(30);
    // iterator has reached the end; adding after exhaustion is not observed
    expect(it.hasNext()).toBe(false);
    list.addLast(40);
    expect(it.hasNext()).toBe(false);
    expect(() => it.next()).toThrow();
  });
});
