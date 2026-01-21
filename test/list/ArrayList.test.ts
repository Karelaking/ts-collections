import { describe, it, expect } from "vitest";
import { ArrayList } from "../../src/list/ArrayList";
import { describeList } from "../interfaces/List.test";

/**
 * Test suite for ArrayList implementation
 */
describeList(() => new ArrayList<number>());

describe("ArrayList (additional tests)", () => {
  it("should construct an empty list", () => {
    const list = new ArrayList<number>();
    expect(list.size()).toBe(0);
  });

  it("should support adding and retrieving elements", () => {
    const list = new ArrayList<string>();
    list.add("hello");
    list.add("world");
    expect(list.get(0)).toBe("hello");
    expect(list.get(1)).toBe("world");
  });

  it("should support removing elements by index", () => {
    const list = new ArrayList<number>();
    list.add(1);
    list.add(2);
    list.add(3);
    const removed = list.removeAt(1);
    expect(removed).toBe(2);
    expect(list.size()).toBe(2);
    expect(list.get(1)).toBe(3);
  });

  it("should throw error on invalid indices", () => {
    const list = new ArrayList<number>();
    list.add(1);
    expect(() => list.get(5)).toThrow();
    expect(() => list.removeAt(-1)).toThrow();
  });
});
