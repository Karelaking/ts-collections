import { beforeEach, describe, expect, it } from "vitest";
import { LinkedList } from "../../src/list/LinkedList";

describe("LinkedList - Mutation Operations", () => {
  let list: LinkedList<number>;

  beforeEach(() => {
    list = new LinkedList<number>();
    list.addAll([1, 2, 3, 2, 4]);
  });

  it("removeAt/removeFirst/removeLast behave correctly", () => {
    expect(list.removeAt(1)).toBe(2);
    expect(list.removeFirst()).toBe(1);
    expect(list.removeLast()).toBe(4);
  });

  it("remove(element) removes first occurrence and returns boolean", () => {
    expect(list.remove(2)).toBe(true);
    expect(list.toArray()).toEqual([1, 3, 2, 4]);
    expect(list.remove(999)).toBe(false);
  });

  it("removeAll accepts iterable and removes all occurrences", () => {
    list.removeAll([2]);
    expect(list.toArray()).toEqual([1, 3, 4]);
  });

  it("removeAll with empty iterable does nothing and returns false", () => {
    const changed = list.removeAll([]);
    expect(changed).toBe(false);
    expect(list.toArray()).toEqual([1, 2, 3, 2, 4]);
  });

  it("retainAll with empty iterable clears the list", () => {
    const changed = list.retainAll([]);
    expect(changed).toBe(true);
    expect(list.size()).toBe(0);
  });

  it("remove(element) on an empty list returns false", () => {
    const l2 = new LinkedList<number>();
    expect(l2.remove(1)).toBe(false);
  });

  it("retainAll accepts iterable and keeps only specified elements", () => {
    list.retainAll([1, 4]);
    expect(list.toArray()).toEqual([1, 4]);
  });

  it("clear empties the list and resets type inference", () => {
    list.clear();
    expect(list.size()).toBe(0);
    expect(list.isEmpty()).toBe(true);
  });
});
