import { beforeEach, describe, expect, it } from "vitest";
import { LinkedStack } from "../../src/stack/LinkedStack";

describe("LinkedStack - toArray", () => {
  let stack: LinkedStack<number>;

  beforeEach(() => {
    stack = new LinkedStack<number>();
  });

  it("should return elements from top to bottom", () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.toArray()).toEqual([3, 2, 1]);
  });

  it("should return independent array", () => {
    stack.push(1);
    stack.push(2);
    const arr = stack.toArray();
    arr.pop();
    expect(stack.size()).toBe(2);
    expect(stack.peek()).toBe(2);
  });
});
