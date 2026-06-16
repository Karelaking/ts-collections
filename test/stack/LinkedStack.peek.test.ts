import { beforeEach, describe, expect, it } from "vitest";
import { LinkedStack } from "../../src/stack/LinkedStack";

describe("LinkedStack - peek", () => {
  let stack: LinkedStack<number>;

  beforeEach(() => {
    stack = new LinkedStack<number>();
  });

  it("should return the top element without removing it", () => {
    stack.push(10);
    stack.push(20);
    expect(stack.peek()).toBe(20);
    expect(stack.size()).toBe(2);
    expect(stack.pop()).toBe(20);
    expect(stack.peek()).toBe(10);
    expect(stack.size()).toBe(1);
    expect(stack.pop()).toBe(10);
    expect(stack.peek()).toBeUndefined();
  });

  it("should return undefined on empty stack", () => {
    expect(stack.peek()).toBeUndefined();
  });
});
