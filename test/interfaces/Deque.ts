import { beforeEach, describe, expect, it } from "vitest";
import type { Deque } from "../../src/interfaces";

/**
 * Creates a test suite for Deque interface implementations.
 *
 * @param createDeque Factory function to create deque instances
 */
export function describeDeque(createDeque: () => Deque<number>): void {
  describe("Deque Interface", () => {
    let deque: Deque<number>;

    beforeEach(() => {
      deque = createDeque();
    });

    describe("end insertions", () => {
      it("should add elements at both ends", () => {
        deque.addFirst(2);
        deque.addLast(3);
        deque.addFirst(1);

        expect(deque.toArray()).toEqual([1, 2, 3]);
      });

      it("should support offerFirst and offerLast", () => {
        expect(deque.offerFirst(2)).toBe(true);
        expect(deque.offerLast(3)).toBe(true);
        expect(deque.offerFirst(1)).toBe(true);

        expect(deque.toArray()).toEqual([1, 2, 3]);
      });
    });

    describe("end removals", () => {
      beforeEach(() => {
        deque.addLast(1);
        deque.addLast(2);
        deque.addLast(3);
      });

      it("should remove first and last correctly", () => {
        expect(deque.removeFirst()).toBe(1);
        expect(deque.removeLast()).toBe(3);
        expect(deque.toArray()).toEqual([2]);
      });

      it("should poll first and last without throwing when empty", () => {
        expect(deque.pollFirst()).toBe(1);
        expect(deque.pollLast()).toBe(3);
        expect(deque.pollFirst()).toBe(2);
        expect(deque.pollFirst()).toBeUndefined();
        expect(deque.pollLast()).toBeUndefined();
      });

      it("should throw on removeFirst/removeLast when empty", () => {
        deque.clear();
        expect(() => deque.removeFirst()).toThrow();
        expect(() => deque.removeLast()).toThrow();
      });
    });

    describe("inspection methods", () => {
      it("should inspect first and last without removing", () => {
        deque.addLast(1);
        deque.addLast(2);
        deque.addLast(3);

        expect(deque.getFirst()).toBe(1);
        expect(deque.getLast()).toBe(3);
        expect(deque.peekFirst()).toBe(1);
        expect(deque.peekLast()).toBe(3);
        expect(deque.size()).toBe(3);
      });

      it("should return undefined from peek methods when empty", () => {
        expect(deque.peekFirst()).toBeUndefined();
        expect(deque.peekLast()).toBeUndefined();
      });

      it("should throw from get methods when empty", () => {
        expect(() => deque.getFirst()).toThrow();
        expect(() => deque.getLast()).toThrow();
      });
    });

    describe("Queue compatibility", () => {
      it("should behave as FIFO queue through offer/poll", () => {
        deque.offer(1);
        deque.offer(2);
        deque.offer(3);

        expect(deque.poll()).toBe(1);
        expect(deque.poll()).toBe(2);
        expect(deque.poll()).toBe(3);
      });

      it("should provide element and peek semantics", () => {
        deque.offer(10);
        deque.offer(20);

        expect(deque.element()).toBe(10);
        expect(deque.peek()).toBe(10);
        expect(deque.size()).toBe(2);
      });

      it("should throw from element when empty", () => {
        expect(() => deque.element()).toThrow();
      });
    });

    describe("additional deque parity methods", () => {
      beforeEach(() => {
        deque.clear();
        deque.addLast(1);
        deque.addLast(2);
        deque.addLast(1);
        deque.addLast(3);
      });

      it("should remove first and last occurrences", () => {
        expect(deque.removeFirstOccurrence(1)).toBe(true);
        expect(deque.toArray()).toEqual([2, 1, 3]);

        expect(deque.removeLastOccurrence(1)).toBe(true);
        expect(deque.toArray()).toEqual([2, 3]);

        expect(deque.removeLastOccurrence(999)).toBe(false);
      });

      it("should support stack aliases push and pop", () => {
        deque.push(9);
        expect(deque.getFirst()).toBe(9);
        expect(deque.pop()).toBe(9);
      });

      it("should provide descending iterator", () => {
        const values: number[] = [];
        const iterator = deque.descendingIterator();

        while (iterator.hasNext()) {
          values.push(iterator.next());
        }

        expect(values).toEqual([3, 1, 2, 1]);
      });
    });

    describe("Collection integration", () => {
      it("should support add alias and remove by value", () => {
        expect(deque.add(10)).toBe(true);
        expect(deque.add(20)).toBe(true);
        expect(deque.remove(10)).toBe(true);
        expect(deque.contains(10)).toBe(false);
      });

      it("should enforce default type validation", () => {
        deque.addFirst(1);
        expect(() => deque.addLast("text" as unknown as number)).toThrow(
          TypeError,
        );
      });
    });
  });
}
