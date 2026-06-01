import { beforeEach, describe, expect, it } from "vitest";
import { ArrayList } from "../../src/list/ArrayList";

describe("ArrayList - Iterator Behavior", () => {
  let list: ArrayList<number>;

  beforeEach(() => {
    list = new ArrayList<number>();
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
    // next should now return the value that moved into index 1 (originally 30)
    expect(it.next()).toBe(30);
    // append while iterating
    list.addLast(40);
    expect(it.next()).toBe(40);
  });
});
