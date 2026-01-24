import { describe, it, expect, beforeEach } from "vitest";
import { LinkedList } from "../../src/list/LinkedList";
import { describeList } from "../interfaces/List.test";

// Shared interface compliance tests
describeList(() => new LinkedList<number>());

/**
 * Additional coverage for LinkedList specifics
 */
describe("LinkedList - Core Behavior", () => {
  let list: LinkedList<number>;

  beforeEach(() => {
    list = new LinkedList<number>();
  });

  it("appends elements in order", () => {
    list.add(1);
    list.add(2);
    list.add(3);
    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  it("prepends via addAt at index 0", () => {
    list.add(2);
    list.add(3);
    list.addAt(0, 1);
    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  it("inserts in the middle", () => {
    list.add(1);
    list.add(3);
    list.addAt(1, 2);
    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  it("removes from both ends", () => {
    list.add(1);
    list.add(2);
    list.add(3);
    expect(list.removeAt(0)).toBe(1);
    expect(list.removeAt(list.size() - 1)).toBe(3);
    expect(list.toArray()).toEqual([2]);
  });

  it("clears and can be reused", () => {
    list.add(1);
    list.add(2);
    list.clear();
    expect(list.size()).toBe(0);
    list.add(3);
    expect(list.toArray()).toEqual([3]);
  });

  it("performs stable sort for objects with equal keys", () => {
    type Item = { key: number; id: string };
    const objList = new LinkedList<Item>();
    objList.add({ key: 1, id: "a" });
    objList.add({ key: 1, id: "b" });
    objList.add({ key: 2, id: "c" });

    objList.sort((x, y) => x.key - y.key);

    expect(objList.toArray().map(i => i.id)).toEqual(["a", "b", "c"]);
  });
});
