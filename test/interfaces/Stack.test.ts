import { describe, it, expect, beforeEach } from "vitest";
import type { Stack } from "../../src/interfaces/Stack";

/**
 * Creates a test suite for Stack interface implementations.
 *
 * @param createStack Factory function to create stack instances
 * @example
 * ```typescript
 * describeStack(() => new MyStack());
 * ```
 */
export function describeStack(createStack: () => Stack<number>): void {
  describe("Stack Interface", () => {
    let stack: Stack<number>;

    beforeEach(() => {
      stack = createStack();
    });

    describe("push", () => {
      it("should push element onto stack", () => {
        const result = stack.push(1);
        expect(result).toBe(true);
        expect(stack.size()).toBe(1);
        expect(stack.peek()).toBe(1);
      });

      it("should allow pushing duplicate elements", () => {
        stack.push(1);
        stack.push(1);
        expect(stack.size()).toBe(2);
        expect(stack.peek()).toBe(1);
      });
    });

    describe("pop", () => {
      it("should pop elements in LIFO order", () => {
        stack.push(1);
        stack.push(2);
        stack.push(3);

        expect(stack.pop()).toBe(3);
        expect(stack.pop()).toBe(2);
        expect(stack.pop()).toBe(1);
      });

      it("should return undefined when stack is empty", () => {
        expect(stack.pop()).toBeUndefined();
      });
    });

    describe("peek", () => {
      it("should return top element without removing it", () => {
        stack.push(1);
        stack.push(2);
        expect(stack.peek()).toBe(2);
        expect(stack.size()).toBe(2);
      });

      it("should return undefined when stack is empty", () => {
        expect(stack.peek()).toBeUndefined();
      });
    });

    describe("LIFO behavior", () => {
      it("should maintain LIFO order through push/pop cycle", () => {
        const elements = [1, 2, 3, 4];
        elements.forEach((el) => stack.push(el));

        const popped: number[] = [];
        while (!stack.isEmpty()) {
          const value = stack.pop();
          if (value !== undefined) {
            popped.push(value);
          }
        }

        expect(popped).toEqual(elements.reverse());
      });

      it("should maintain order with mixed operations", () => {
        stack.push(1);
        stack.push(2);
        expect(stack.pop()).toBe(2);
        stack.push(3);
        expect(stack.pop()).toBe(3);
        expect(stack.pop()).toBe(1);
      });
    });

    describe("Collection interface integration", () => {
      beforeEach(() => {
        stack.push(10);
        stack.push(20);
        stack.push(30);
      });

      it("should report size via size and length", () => {
        expect(stack.size()).toBe(3);
        expect(stack.length).toBe(3);
      });

      it("should support isEmpty", () => {
        expect(stack.isEmpty()).toBe(false);
        stack.clear();
        expect(stack.isEmpty()).toBe(true);
      });

      it("should support contains", () => {
        expect(stack.contains(20)).toBe(true);
        expect(stack.contains(999)).toBe(false);
      });

      it("should support add alias for push", () => {
        const result = stack.add(40);
        expect(result).toBe(true);
        expect(stack.peek()).toBe(40);
      });

      it("should support remove by value", () => {
        const removed = stack.remove(20);
        expect(removed).toBe(true);
        expect(stack.contains(20)).toBe(false);
        expect(stack.size()).toBe(2);
      });
    });

    describe("iterator", () => {
      it("should iterate from top to bottom", () => {
        stack.push(1);
        stack.push(2);
        stack.push(3);

        const values: number[] = [];
        const iterator = stack.iterator();

        while (iterator.hasNext()) {
          values.push(iterator.next());
        }

        expect(values).toEqual([3, 2, 1]);
      });

      it("should report no elements for empty stack", () => {
        const iterator = stack.iterator();
        expect(iterator.hasNext()).toBe(false);
      });
    });

    describe("toArray", () => {
      it("should return elements from top to bottom", () => {
        stack.push(1);
        stack.push(2);
        stack.push(3);
        expect(stack.toArray()).toEqual([3, 2, 1]);
      });

      it("should return empty array for empty stack", () => {
        expect(stack.toArray()).toEqual([]);
      });
    });

    describe("type validation", () => {
      it("should enforce type consistency by default", () => {
        stack.push(1);
        expect(() => stack.push("text" as unknown as number)).toThrow(TypeError);
      });
    });
  });
}
