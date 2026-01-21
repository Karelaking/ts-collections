import { describe, it, expect } from "vitest";
import { HashMap } from "../../src/map/HashMap";
import { describeMap } from "../interfaces/Map.test";

/**
 * Test suite for HashMap implementation
 */
describeMap(() => new HashMap<string, number>());

describe("HashMap (additional tests)", () => {
  it("should construct an empty map", () => {
    const map = new HashMap<string, number>();
    expect(map.size()).toBe(0);
    expect(map.isEmpty()).toBe(true);
  });

  it("should support put and get operations", () => {
    const map = new HashMap<string, number>();
    map.put("a", 1);
    map.put("b", 2);

    expect(map.get("a")).toBe(1);
    expect(map.get("b")).toBe(2);
    expect(map.get("c")).toBeUndefined();
  });

  it("should replace existing values", () => {
    const map = new HashMap<string, number>();
    const oldValue = map.put("key", 10);
    expect(oldValue).toBeUndefined();

    const newOldValue = map.put("key", 20);
    expect(newOldValue).toBe(10);
    expect(map.get("key")).toBe(20);
  });

  it("should support remove operations", () => {
    const map = new HashMap<string, number>();
    map.put("a", 1);
    map.put("b", 2);

    const removed = map.remove("a");
    expect(removed).toBe(1);
    expect(map.get("a")).toBeUndefined();
    expect(map.size()).toBe(1);
  });

  it("should check key existence", () => {
    const map = new HashMap<string, number>();
    map.put("a", 1);

    expect(map.containsKey("a")).toBe(true);
    expect(map.containsKey("b")).toBe(false);
  });

  it("should check value existence", () => {
    const map = new HashMap<string, number>();
    map.put("a", 1);
    map.put("b", 2);

    expect(map.containsValue(1)).toBe(true);
    expect(map.containsValue(2)).toBe(true);
    expect(map.containsValue(3)).toBe(false);
  });

  it("should iterate through keys", () => {
    const map = new HashMap<string, number>();
    map.put("a", 1);
    map.put("b", 2);
    map.put("c", 3);

    const keys: string[] = [];
    const iterator = map.keyIterator();

    while (iterator.hasNext()) {
      keys.push(iterator.next());
    }

    expect(keys.sort()).toEqual(["a", "b", "c"]);
  });

  it("should iterate through values", () => {
    const map = new HashMap<string, number>();
    map.put("a", 1);
    map.put("b", 2);
    map.put("c", 3);

    const values: number[] = [];
    const iterator = map.valueIterator();

    while (iterator.hasNext()) {
      values.push(iterator.next());
    }

    expect(values.sort()).toEqual([1, 2, 3]);
  });

  it("should return keys as array", () => {
    const map = new HashMap<string, number>();
    map.put("a", 1);
    map.put("b", 2);

    const keys = map.keys();
    expect(keys.sort()).toEqual(["a", "b"]);
  });

  it("should return entries as array", () => {
    const map = new HashMap<string, number>();
    map.put("a", 1);
    map.put("b", 2);

    const entries = map.entries();
    expect(entries.length).toBe(2);
    expect(entries.map((e) => e[0]).sort()).toEqual(["a", "b"]);
    expect(entries.map((e) => e[1]).sort()).toEqual([1, 2]);
  });

  it("should clear all entries", () => {
    const map = new HashMap<string, number>();
    map.put("a", 1);
    map.put("b", 2);

    map.clear();

    expect(map.size()).toBe(0);
    expect(map.get("a")).toBeUndefined();
  });
});
