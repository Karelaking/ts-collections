import { describe, it, expect, beforeEach } from "vitest";
import { LinkedStack } from "../../src/stack/LinkedStack";
import { describeStack } from "../interfaces/Stack.test";

// Run shared Stack interface tests
describeStack(() => new LinkedStack<number>());

/**
 * Test suite for LinkedStack implementation
 */
describe("LinkedStack - Core Methods", () => {
  let stack: LinkedStack<number>;

  beforeEach(() => {
    stack = new LinkedStack<number>();
  });

  describe("push and pop", () => {
    it("should push elements and pop them in LIFO order", () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.pop()).toBe(3);
      expect(stack.pop()).toBe(2);
      expect(stack.pop()).toBe(1);
      expect(stack.pop()).toBeUndefined();
    });

    it("should handle large number of operations", () => {
      for (let i = 0; i < 100; i++) {
        stack.push(i);
      }

      expect(stack.size()).toBe(100);
      expect(stack.peek()).toBe(99);

      for (let i = 99; i >= 0; i--) {
        expect(stack.pop()).toBe(i);
      }

      expect(stack.isEmpty()).toBe(true);
      expect(stack.pop()).toBeUndefined();
    });
  });

  describe("peek", () => {
    it("should return the top element without removing it", () => {
      stack.push(10);
      stack.push(20);
      expect(stack.peek()).toBe(20);
      expect(stack.size()).toBe(2);
    });

    it("should return undefined on empty stack", () => {
      expect(stack.peek()).toBeUndefined();
    });
  });

  describe("clear", () => {
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

  describe("contains and remove", () => {
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

  describe("toArray", () => {
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

  describe("different data types", () => {
    it("should work with string elements", () => {
      const strStack = new LinkedStack<string>();
      strStack.push("a");
      strStack.push("b");
      expect(strStack.pop()).toBe("b");
      expect(strStack.peek()).toBe("a");
    });

    it("should work with object elements", () => {
      const objStack = new LinkedStack<{ id: number; name: string }>();
      const first = { id: 1, name: "Alice" };
      const second = { id: 2, name: "Bob" };

      objStack.push(first);
      objStack.push(second);

      expect(objStack.peek()).toBe(second);
      expect(objStack.pop()).toBe(second);
      expect(objStack.peek()).toBe(first);
    });
  });
});
