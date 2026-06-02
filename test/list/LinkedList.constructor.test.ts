import { beforeEach, describe, expect, it } from "vitest";
import { LinkedList } from "../../src/list/LinkedList";
import { describeList } from "../interfaces/List";

describeList(() => new LinkedList<number>());

describe("LinkedList - Construction & Size", () => {
  let list: LinkedList<number>;

  beforeEach(() => {
    list = new LinkedList<number>();
  });

  it("constructs empty and reports size correctly", () => {
    expect(list.size()).toBe(0);
    expect(list.isEmpty()).toBe(true);
  });

  it("updates size as elements are added", () => {
    list.add(1);
    expect(list.size()).toBe(1);
    list.addAll([2, 3]);
    expect(list.size()).toBe(3);
  });
});
