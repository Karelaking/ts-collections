import { beforeEach, describe, expect, it } from "vitest";
import { TreeMap } from "../../src/map/TreeMap";
import { describeMap } from "../interfaces/Map";

// Run shared Map interface tests
describeMap(() => new TreeMap<string, number>());

describe("TreeMap - Ordering and Comparator", () => {
  let map: TreeMap<number, string>;

  beforeEach(() => {
    map = new TreeMap<number, string>();
  });

  it("should keep keys sorted in ascending order by default", () => {
    map.put(10, "ten");
    map.put(2, "two");
    map.put(7, "seven");

    expect(map.keys()).toEqual([2, 7, 10]);
  });

  it("should keep entries sorted by key", () => {
    map.put(3, "three");
    map.put(1, "one");
    map.put(2, "two");

    expect(map.entries()).toEqual([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]);
  });

  it("should support custom comparator", () => {
    const desc = new TreeMap<number, string>({ comparator: (a, b) => b - a });

    desc.put(1, "one");
    desc.put(3, "three");
    desc.put(2, "two");

    expect(desc.keys()).toEqual([3, 2, 1]);
  });

  it("should replace key considered equal by comparator", () => {
    const caseInsensitive = new TreeMap<string, number>({
      comparator: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),
    });

    caseInsensitive.put("A", 1);
    const previous = caseInsensitive.put("a", 2);

    expect(previous).toBe(1);
    expect(caseInsensitive.size()).toBe(1);
    expect(caseInsensitive.get("A")).toBe(2);
  });

  it("should require comparator for object keys", () => {
    const objectKeyMap = new TreeMap<{ id: number }, string>();
    objectKeyMap.put({ id: 1 }, "one");

    expect(() => objectKeyMap.put({ id: 2 }, "two")).toThrow(
      "Comparator is required for non-primitive key types",
    );
  });

  it("should provide first/last keys and entries", () => {
    map.put(10, "ten");
    map.put(2, "two");
    map.put(7, "seven");

    expect(map.firstKey()).toBe(2);
    expect(map.lastKey()).toBe(10);
    expect(map.firstEntry()).toEqual([2, "two"]);
    expect(map.lastEntry()).toEqual([10, "ten"]);
  });

  it("should throw first/last methods when empty", () => {
    expect(() => map.firstKey()).toThrow("Map is empty");
    expect(() => map.lastKey()).toThrow("Map is empty");
    expect(() => map.firstEntry()).toThrow("Map is empty");
    expect(() => map.lastEntry()).toThrow("Map is empty");
  });

  it("should provide lower/floor/ceiling/higher key navigation", () => {
    map.put(10, "ten");
    map.put(20, "twenty");
    map.put(30, "thirty");

    expect(map.lowerKey(20)).toBe(10);
    expect(map.lowerKey(10)).toBeUndefined();

    expect(map.floorKey(20)).toBe(20);
    expect(map.floorKey(25)).toBe(20);
    expect(map.floorKey(5)).toBeUndefined();

    expect(map.ceilingKey(20)).toBe(20);
    expect(map.ceilingKey(25)).toBe(30);
    expect(map.ceilingKey(35)).toBeUndefined();

    expect(map.higherKey(20)).toBe(30);
    expect(map.higherKey(30)).toBeUndefined();
  });

  it("should poll first and last entries", () => {
    map.put(10, "ten");
    map.put(20, "twenty");
    map.put(30, "thirty");

    expect(map.pollFirstEntry()).toEqual([10, "ten"]);
    expect(map.pollLastEntry()).toEqual([30, "thirty"]);
    expect(map.entries()).toEqual([[20, "twenty"]]);

    expect(map.pollFirstEntry()).toEqual([20, "twenty"]);
    expect(map.pollFirstEntry()).toBeUndefined();
    expect(map.pollLastEntry()).toBeUndefined();
  });

  it("should create subMap, headMap, and tailMap ranges", () => {
    map.put(10, "ten");
    map.put(20, "twenty");
    map.put(30, "thirty");
    map.put(40, "forty");

    expect(map.subMap(15, 35).entries()).toEqual([
      [20, "twenty"],
      [30, "thirty"],
    ]);
    expect(map.subMap(20, 40, true, true).entries()).toEqual([
      [20, "twenty"],
      [30, "thirty"],
      [40, "forty"],
    ]);

    expect(map.headMap(30).entries()).toEqual([
      [10, "ten"],
      [20, "twenty"],
    ]);
    expect(map.headMap(30, true).entries()).toEqual([
      [10, "ten"],
      [20, "twenty"],
      [30, "thirty"],
    ]);

    expect(map.tailMap(20).entries()).toEqual([
      [20, "twenty"],
      [30, "thirty"],
      [40, "forty"],
    ]);
    expect(map.tailMap(20, false).entries()).toEqual([
      [30, "thirty"],
      [40, "forty"],
    ]);
  });
});
