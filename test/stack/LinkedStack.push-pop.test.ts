import { beforeEach, describe, expect, it } from "vitest";
import { LinkedStack } from "../../src/stack/LinkedStack";

describe("LinkedStack - push and pop", () => {
  let stack: LinkedStack<number>;

  beforeEach(() => {
    stack = new LinkedStack<number>();
  });

  it("should push elements and pop them in LIFO order", () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);

    expect(stack.size()).toBe(3);
    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
    expect(stack.pop()).toBeUndefined();
  });

  it("should push another union member after becoming empty", () => {
    const mixedStack = new LinkedStack<number | string>();

    mixedStack.push(1);
    expect(mixedStack.pop()).toBe(1);
    expect(mixedStack.isEmpty()).toBe(true);

    expect(mixedStack.push("after-empty")).toBe(true);
    expect(mixedStack.peek()).toBe("after-empty");
  });

  it("should handle a large-ish number of operations", () => {
    // Reduced iterations so tests run reliably in CI/local environments
    const N = 10000;
    for (let i = 0; i < N; i++) {
      stack.push(i);
    }

    expect(stack.size()).toBe(N);
    expect(stack.peek()).toBe(N - 1);

    for (let i = N - 1; i >= 0; i--) {
      expect(stack.pop()).toBe(i);
    }

    expect(stack.isEmpty()).toBe(true);
    expect(stack.pop()).toBeUndefined();
  });
});
