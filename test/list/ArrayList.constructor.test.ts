import { beforeEach, describe, expect, it } from "vitest";
import { ArrayList } from "../../src/list/ArrayList";
import { describeList } from "../interfaces/List";

describeList(() => new ArrayList<number>());

describe("ArrayList - Construction & Size", () => {
  let list: ArrayList<number>;

  beforeEach(() => {
    list = new ArrayList<number>();
  });

  it("constructs empty and reports size/length correctly", () => {
    expect(list.size()).toBe(0);
    expect(list.length).toBe(0);
    expect(list.isEmpty()).toBe(true);
  });

  it("updates size as elements are added", () => {
    list.add(1);
    expect(list.size()).toBe(1);
    list.addAll([2, 3]);
    expect(list.size()).toBe(3);
  });
});
