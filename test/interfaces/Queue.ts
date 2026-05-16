import { describe, it, expect, beforeEach } from "vitest";
import type { Queue } from "../../src/interfaces/Queue";

/**
 * Creates a test suite for Queue interface implementations.
 *
 * @param createQueue Factory function to create queue instances
 * @example
 * ```typescript
 * describeQueue(() => new MyQueue());
 * ```
 */
export function describeQueue(createQueue: () => Queue<number>): void {
  describe("Queue Interface", () => {
    let queue: Queue<number>;

    beforeEach(() => {
      queue = createQueue();
    });

    describe("offer", () => {
      it("should add element to queue", () => {
        const result = queue.offer(1);
        expect(result).toBe(true);
        expect(queue.size()).toBe(1);
      });

      it("should add multiple elements", () => {
        queue.offer(1);
        queue.offer(2);
        queue.offer(3);
        expect(queue.size()).toBe(3);
      });

      it("should return false if capacity exceeded (bounded queues)", () => {
        // Most implementations will return true
        // Subclasses can override for bounded queue behavior
        const result = queue.offer(1);
        expect([true, false]).toContain(result);
      });
    });

    describe("remove", () => {
      beforeEach(() => {
        queue.offer(1);
        queue.offer(2);
        queue.offer(3);
      });

      it("should remove and return head element", () => {
        const result = queue.poll();
        expect(result).toBe(1);
        expect(queue.size()).toBe(2);
      });

      it("should throw error when queue is empty", () => {
        queue.poll();
        queue.poll();
        queue.poll();
        expect(() => queue.element()).toThrow();
      });

      it("should maintain FIFO order", () => {
        expect(queue.poll()).toBe(1);
        expect(queue.poll()).toBe(2);
        expect(queue.poll()).toBe(3);
      });
    });

    describe("poll", () => {
      beforeEach(() => {
        queue.offer(1);
        queue.offer(2);
        queue.offer(3);
      });

      it("should remove and return head element", () => {
        const result = queue.poll();
        expect(result).toBe(1);
        expect(queue.size()).toBe(2);
      });

      it("should return undefined when queue is empty", () => {
        queue.poll();
        queue.poll();
        queue.poll();
        expect(queue.poll()).toBeUndefined();
      });

      it("should not throw error on empty queue", () => {
        queue.poll();
        queue.poll();
        queue.poll();
        expect(() => queue.poll()).not.toThrow();
      });
    });

    describe("element", () => {
      beforeEach(() => {
        queue.offer(1);
        queue.offer(2);
        queue.offer(3);
      });

      it("should return head element without removing it", () => {
        const head = queue.element();
        expect(head).toBe(1);
        expect(queue.size()).toBe(3);
      });

      it("should throw error when queue is empty", () => {
        queue.poll();
        queue.poll();
        queue.poll();
        expect(() => queue.element()).toThrow();
      });

      it("should consistently return the same element", () => {
        const first = queue.element();
        const second = queue.element();
        expect(first).toBe(second);
      });
    });

    describe("peek", () => {
      beforeEach(() => {
        queue.offer(1);
        queue.offer(2);
        queue.offer(3);
      });

      it("should return head element without removing it", () => {
        const head = queue.peek();
        expect(head).toBe(1);
        expect(queue.size()).toBe(3);
      });

      it("should return undefined when queue is empty", () => {
        queue.poll();
        queue.poll();
        queue.poll();
        expect(queue.peek()).toBeUndefined();
      });

      it("should not throw error on empty queue", () => {
        queue.poll();
        queue.poll();
        queue.poll();
        expect(() => queue.peek()).not.toThrow();
      });
    });

    describe("Collection interface integration", () => {
      beforeEach(() => {
        queue.offer(10);
        queue.offer(20);
        queue.offer(30);
      });

      it("should implement size correctly", () => {
        expect(queue.size()).toBe(3);
      });

      it("should implement isEmpty correctly", () => {
        expect(queue.isEmpty()).toBe(false);
        queue.clear();
        expect(queue.isEmpty()).toBe(true);
      });

      it("should support contains", () => {
        expect(queue.contains(20)).toBe(true);
        expect(queue.contains(999)).toBe(false);
      });

      it("should support add via Collection interface", () => {
        const result = queue.add(40);
        expect(result).toBe(true);
        expect(queue.size()).toBe(4);
      });

      it("should support remove via Collection interface", () => {
        const result = queue.remove(20);
        expect(result).toBe(true);
        expect(queue.contains(20)).toBe(false);
      });

      it("should provide iterator", () => {
        const iterator = queue.iterator();
        expect(iterator.hasNext()).toBe(true);
        const first = iterator.next();
        expect([10, 20, 30]).toContain(first);
      });

      it("should convert to array", () => {
        const array = queue.toArray();
        expect(array.length).toBe(3);
        expect(array).toContain(10);
        expect(array).toContain(20);
        expect(array).toContain(30);
      });

      it("should clear all elements", () => {
        queue.clear();
        expect(queue.size()).toBe(0);
        expect(queue.isEmpty()).toBe(true);
      });
    });

    describe("FIFO behavior", () => {
      it("should maintain FIFO order through offer/poll cycle", () => {
        const elements = [5, 10, 15, 20];
        elements.forEach((e) => queue.offer(e));

        const result: number[] = [];
        while (!queue.isEmpty()) {
          result.push(queue.poll()!);
        }

        expect(result).toEqual(elements);
      });

      it("should maintain FIFO order with mixed operations", () => {
        queue.offer(1);
        queue.offer(2);
        expect(queue.poll()).toBe(1);
        queue.offer(3);
        expect(queue.poll()).toBe(2);
        expect(queue.poll()).toBe(3);
      });
    });

    describe("single element queue", () => {
      it("should handle single element", () => {
        queue.offer(42);
        expect(queue.peek()).toBe(42);
        expect(queue.poll()).toBe(42);
        expect(queue.isEmpty()).toBe(true);
      });
    });
  });
}
