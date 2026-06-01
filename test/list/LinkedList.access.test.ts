import { beforeEach, describe, expect, it } from "vitest";
import { LinkedList } from "../../src/list/LinkedList";

describe("LinkedList - Accessors and Indexing", () => {
  let list: LinkedList<number>;

  beforeEach(() => {
    list = new LinkedList<number>();
    list.addAll([10, 20, 30, 40]);
  });

  it("get/getFirst/getLast return correct values and validate bounds", () => {
    expect(list.get(0)).toBe(10);
    expect(list.getFirst()).toBe(10);
    expect(list.getLast()).toBe(40);
    expect(() => list.get(-1)).toThrow();
    expect(() => list.get(4)).toThrow();
  });

  it("set replaces value and returns old value", () => {
    const old = list.set(1, 25);
    expect(old).toBe(20);
    expect(list.get(1)).toBe(25);
  });

  it("indexOf and lastIndexOf work with duplicates", () => {
    list.add(20);
    expect(list.indexOf(20)).toBe(1);
    expect(list.lastIndexOf(20)).toBe(4);
    expect(list.indexOf(999)).toBe(-1);
  });

  it("subList creates expected view or throws for invalid ranges", () => {
    const sub = list.subList(1, 3);
    expect(sub.toArray()).toEqual([20, 30]);
    expect(() => list.subList(3, 2)).toThrow();
  });

  it("subList with from==to returns empty and full-range returns equivalent list", () => {
    const full = list.subList(0, list.size());
    expect(full.toArray()).toEqual(list.toArray());
    const empty = list.subList(2, 2);
    expect(empty.size()).toBe(0);
  });

  it("toArray returns a shallow copy (mutating returned array does not mutate list)", () => {
    const arr = list.toArray();
    arr.push(999);
    expect(list.toArray()).not.toEqual(arr);
  });

  it("indexOf with NaN documents current behavior (NaN !== NaN => -1)", () => {
    const nl = new LinkedList<number>();
    nl.addAll([NaN, 1, 2]);
    const arr = nl.toArray();
    expect(Number.isNaN(arr[0])).toBe(true);
    expect(nl.indexOf(NaN)).toBe(-1);
  });
});
