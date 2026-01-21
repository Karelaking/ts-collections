import { describe, it, expect } from "vitest";
import { HashSet } from "../../src/set/HashSet";
import { describeSet } from "../interfaces/Set.test";

/**
 * Test suite for HashSet implementation
 */
describeSet(() => new HashSet<number>());

describe("HashSet (additional tests)", () => {
  it("should construct an empty set", () => {
    const set = new HashSet<number>();
    expect(set.size()).toBe(0);
  });

  it("should prevent duplicate elements", () => {
    const set = new HashSet<number>();
    expect(set.add(1)).toBe(true);
    expect(set.add(1)).toBe(false);
    expect(set.size()).toBe(1);
  });

  it("should support adding and checking elements", () => {
    const set = new HashSet<string>();
    set.add("hello");
    set.add("world");
    expect(set.contains("hello")).toBe(true);
    expect(set.contains("world")).toBe(true);
    expect(set.contains("foo")).toBe(false);
  });

  it("should support removing elements", () => {
    const set = new HashSet<number>();
    set.add(1);
    set.add(2);
    expect(set.remove(1)).toBe(true);
    expect(set.remove(1)).toBe(false);
    expect(set.size()).toBe(1);
  });

  it("should iterate through all elements", () => {
    const set = new HashSet<number>();
    set.add(1);
    set.add(2);
    set.add(3);

    const elements: number[] = [];
    const iterator = set.iterator();

    while (iterator.hasNext()) {
      elements.push(iterator.next());
    }

    expect(elements.sort()).toEqual([1, 2, 3]);
  });

  it("should convert to array", () => {
    const set = new HashSet<number>();
    set.add(1);
    set.add(2);
    set.add(3);

    const arr = set.toArray();
    expect(arr.sort()).toEqual([1, 2, 3]);
  });

  it("should handle object keys", () => {
    const set = new HashSet<{ id: number }>();
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 1 }; // Same as obj1 but different reference

    set.add(obj1);
    set.add(obj2);
    set.add(obj3); // Different reference but same structure

    // Depending on implementation, this should be 2 or 3
    expect([2, 3]).toContain(set.size());
  });

  it("should clear all elements", () => {
    const set = new HashSet<number>();
    set.add(1);
    set.add(2);
    set.add(3);

    set.clear();

    expect(set.size()).toBe(0);
    expect(set.contains(1)).toBe(false);
  });
});
