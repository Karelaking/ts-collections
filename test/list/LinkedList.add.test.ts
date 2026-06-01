import { beforeEach, describe, expect, it } from "vitest";
import { LinkedList } from "../../src/list/LinkedList";

describe("LinkedList - Add Operations", () => {
  let list: LinkedList<number>;

  beforeEach(() => {
    list = new LinkedList<number>();
  });

  it("adds single elements and returns true", () => {
    expect(list.add(1)).toBe(true);
    expect(list.add(2)).toBe(true);
    expect(list.toArray()).toEqual([1, 2]);
  });

  it("addAll accepts iterables and arrays", () => {
    list.addAll([1, 2, 3]);
    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  it("addAt, addFirst, addLast behave correctly", () => {
    list.addAll([1, 3]);
    list.addAt(1, 2);
    expect(list.toArray()).toEqual([1, 2, 3]);
    list.addFirst(0);
    list.addLast(4);
    expect(list.toArray()).toEqual([0, 1, 2, 3, 4]);
  });

  it("addAt allows insertion at index == size (append)", () => {
    list.clear();
    list.addAll([1, 2, 3]);
    list.addAt(list.size(), 4);
    expect(list.toArray()).toEqual([1, 2, 3, 4]);
  });

  it("addAll accepts other iterables like Set", () => {
    list.clear();
    list.addAll(new Set([5, 6]));
    expect(list.toArray()).toEqual([5, 6]);
  });
});
