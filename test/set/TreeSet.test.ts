import { beforeEach, describe, expect, it } from "vitest";
import { TreeSet } from "../../src/set/TreeSet";
import { describeSet } from "../interfaces/Set";

// Run shared Set interface tests
describeSet(() => new TreeSet<number>());

describe("TreeSet - Ordering and Comparator", () => {
  let set: TreeSet<number>;

  beforeEach(() => {
    set = new TreeSet<number>();
  });

  it("should keep values sorted in ascending order by default", () => {
    set.add(10);
    set.add(2);
    set.add(7);

    expect(set.toArray()).toEqual([2, 7, 10]);
  });

  it("should keep uniqueness by comparator equality", () => {
    const caseInsensitive = new TreeSet<string>({
      comparator: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),
    });

    expect(caseInsensitive.add("A")).toBe(true);
    expect(caseInsensitive.add("a")).toBe(false);
    expect(caseInsensitive.size()).toBe(1);
  });

  it("should support custom comparator", () => {
    const desc = new TreeSet<number>({ comparator: (a, b) => b - a });

    desc.add(1);
    desc.add(3);
    desc.add(2);

    expect(desc.toArray()).toEqual([3, 2, 1]);
  });

  it("should require comparator for object values", () => {
    const objectSet = new TreeSet<{ id: number }>();
    objectSet.add({ id: 1 });

    expect(() => objectSet.add({ id: 2 })).toThrow(
      "Comparator is required for non-primitive element types",
    );
  });

  it("should iterate in sorted order", () => {
    set.add(4);
    set.add(1);
    set.add(3);

    const values: number[] = [];
    const iterator = set.iterator();

    while (iterator.hasNext()) {
      values.push(iterator.next());
    }

    expect(values).toEqual([1, 3, 4]);
  });

  it("should provide first and last", () => {
    set.add(10);
    set.add(2);
    set.add(7);

    expect(set.first()).toBe(2);
    expect(set.last()).toBe(10);
  });

  it("should throw first/last on empty set", () => {
    expect(() => set.first()).toThrow("Set is empty");
    expect(() => set.last()).toThrow("Set is empty");
  });

  it("should provide lower/floor/ceiling/higher navigation", () => {
    set.add(10);
    set.add(20);
    set.add(30);

    expect(set.lower(20)).toBe(10);
    expect(set.lower(10)).toBeUndefined();

    expect(set.floor(20)).toBe(20);
    expect(set.floor(25)).toBe(20);
    expect(set.floor(5)).toBeUndefined();

    expect(set.ceiling(20)).toBe(20);
    expect(set.ceiling(25)).toBe(30);
    expect(set.ceiling(35)).toBeUndefined();

    expect(set.higher(20)).toBe(30);
    expect(set.higher(30)).toBeUndefined();
  });

  it("should poll first and last", () => {
    set.add(10);
    set.add(20);
    set.add(30);

    expect(set.pollFirst()).toBe(10);
    expect(set.pollLast()).toBe(30);
    expect(set.toArray()).toEqual([20]);

    expect(set.pollFirst()).toBe(20);
    expect(set.pollFirst()).toBeUndefined();
    expect(set.pollLast()).toBeUndefined();
  });

  it("should iterate in descending order", () => {
    set.add(4);
    set.add(1);
    set.add(3);

    const values: number[] = [];
    const iterator = set.descendingIterator();

    while (iterator.hasNext()) {
      values.push(iterator.next());
    }

    expect(values).toEqual([4, 3, 1]);
  });

  it("should create subset, headset and tailset ranges", () => {
    set.add(10);
    set.add(20);
    set.add(30);
    set.add(40);

    expect(set.subSet(15, 35).toArray()).toEqual([20, 30]);
    expect(set.subSet(20, 40, true, true).toArray()).toEqual([20, 30, 40]);

    expect(set.headSet(30).toArray()).toEqual([10, 20]);
    expect(set.headSet(30, true).toArray()).toEqual([10, 20, 30]);

    expect(set.tailSet(20).toArray()).toEqual([20, 30, 40]);
    expect(set.tailSet(20, false).toArray()).toEqual([30, 40]);
  });
});
