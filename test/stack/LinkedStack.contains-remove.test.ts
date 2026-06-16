import { beforeEach, describe, expect, it } from "vitest";
import { LinkedStack } from "../../src/stack/LinkedStack";

describe("LinkedStack - contains and remove", () => {
  let stack: LinkedStack<number>;

  beforeEach(() => {
    stack = new LinkedStack<number>();
  });

  it("should confirm containment and remove elements", () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);

    expect(stack.contains(2)).toBe(true);
    expect(stack.remove(2)).toBe(true);
    expect(stack.contains(2)).toBe(false);
    expect(stack.size()).toBe(2);
  });

  it("should return false when removing non-existent element", () => {
    stack.push(1);
    stack.push(2);
    expect(stack.remove(999)).toBe(false);
    expect(stack.size()).toBe(2);
  });
});
