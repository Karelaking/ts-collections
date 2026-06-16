import { beforeEach, describe, expect, it } from "vitest";
import { LinkedStack } from "../../src/stack/LinkedStack";

describe("LinkedStack - clear", () => {
  let stack: LinkedStack<number>;

  beforeEach(() => {
    stack = new LinkedStack<number>();
  });

  it("should remove all elements", () => {
    stack.push(1);
    stack.push(2);
    stack.clear();
    expect(stack.size()).toBe(0);
    expect(stack.isEmpty()).toBe(true);
    expect(stack.peek()).toBeUndefined();
  });

  it("should allow pushing after clearing", () => {
    stack.push(5);
    stack.clear();
    stack.push(10);
    expect(stack.peek()).toBe(10);
    expect(stack.size()).toBe(1);
  });
});
