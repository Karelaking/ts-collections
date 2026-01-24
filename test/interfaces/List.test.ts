import { describe, it, expect, beforeEach } from "vitest";
import type { List } from "../../src/interfaces/List";

/**
 * Creates a test suite for List interface implementations.
 *
 * @param createList Factory function to create list instances
 * @example
 * ```typescript
 * describeList(() => new MyList());
 * ```
 */
export function describeList(createList: () => List<number>): void {
  describe("List Interface", () => {
    let list: List<number>;

    beforeEach(() => {
      list = createList();
    });

    describe("get and set", () => {
      beforeEach(() => {
        list.add(10);
        list.add(20);
        list.add(30);
      });

      it("should get element at valid index", () => {
        expect(list.get(0)).toBe(10);
        expect(list.get(1)).toBe(20);
        expect(list.get(2)).toBe(30);
      });

      it("should throw error for negative index", () => {
        expect(() => list.get(-1)).toThrow();
      });

      it("should throw error for out of bounds index", () => {
        expect(() => list.get(999)).toThrow();
      });

      it("should set element at valid index and return old value", () => {
        const oldValue = list.set(1, 25);
        expect(oldValue).toBe(20);
        expect(list.get(1)).toBe(25);
      });

      it("should throw error when setting at invalid index", () => {
        expect(() => list.set(999, 100)).toThrow();
      });
    });

    describe("indexed add", () => {
      beforeEach(() => {
        list.add(10);
        list.add(30);
      });

      it("should insert element at specified index", () => {
        list.addAt(1, 20);
        expect(list.get(0)).toBe(10);
        expect(list.get(1)).toBe(20);
        expect(list.get(2)).toBe(30);
        expect(list.size()).toBe(3);
      });

      it("should insert at beginning", () => {
        list.addAt(0, 5);
        expect(list.get(0)).toBe(5);
        expect(list.get(1)).toBe(10);
      });

      it("should insert at end", () => {
        list.addAt(list.size(), 40);
        expect(list.get(list.size() - 1)).toBe(40);
      });

      it("should throw error for invalid index", () => {
        expect(() => list.addAt(999, 100)).toThrow();
      });

      it("should throw error for negative index", () => {
        expect(() => list.addAt(-1, 100)).toThrow();
      });
    });

    describe("removeAt", () => {
      beforeEach(() => {
        list.add(10);
        list.add(20);
        list.add(30);
      });

      it("should remove and return element at index", () => {
        const removed = list.removeAt(1);
        expect(removed).toBe(20);
        expect(list.size()).toBe(2);
      });

      it("should shift elements after removal", () => {
        list.removeAt(1);
        expect(list.get(1)).toBe(30);
      });

      it("should throw error for invalid index", () => {
        expect(() => list.removeAt(999)).toThrow();
      });

      it("should throw error for negative index", () => {
        expect(() => list.removeAt(-1)).toThrow();
      });

      it("should remove first element", () => {
        const removed = list.removeAt(0);
        expect(removed).toBe(10);
        expect(list.get(0)).toBe(20);
      });

      it("should remove last element", () => {
        const removed = list.removeAt(2);
        expect(removed).toBe(30);
        expect(list.size()).toBe(2);
      });
    });

    describe("indexOf and lastIndexOf", () => {
      beforeEach(() => {
        list.add(10);
        list.add(20);
        list.add(10);
        list.add(30);
      });

      it("should find index of first occurrence", () => {
        expect(list.indexOf(10)).toBe(0);
        expect(list.indexOf(20)).toBe(1);
        expect(list.indexOf(30)).toBe(3);
      });

      it("should return -1 for non-existent element", () => {
        expect(list.indexOf(999)).toBe(-1);
      });

      it("should find index of last occurrence", () => {
        expect(list.lastIndexOf(10)).toBe(2);
        expect(list.lastIndexOf(20)).toBe(1);
        expect(list.lastIndexOf(30)).toBe(3);
      });

      it("should return -1 for lastIndexOf with non-existent element", () => {
        expect(list.lastIndexOf(999)).toBe(-1);
      });
    });

    describe("subList", () => {
      beforeEach(() => {
        list.add(10);
        list.add(20);
        list.add(30);
        list.add(40);
        list.add(50);
      });

      it("should return sub-list with correct elements", () => {
        const subList = list.subList(1, 4);
        expect(subList.size()).toBe(3);
        expect(subList.get(0)).toBe(20);
        expect(subList.get(1)).toBe(30);
        expect(subList.get(2)).toBe(40);
      });

      it("should handle sub-list from start", () => {
        const subList = list.subList(0, 2);
        expect(subList.size()).toBe(2);
        expect(subList.get(0)).toBe(10);
        expect(subList.get(1)).toBe(20);
      });

      it("should handle sub-list to end", () => {
        const subList = list.subList(3, 5);
        expect(subList.size()).toBe(2);
        expect(subList.get(0)).toBe(40);
        expect(subList.get(1)).toBe(50);
      });

      it("should throw error when fromIndex > toIndex", () => {
        expect(() => list.subList(3, 1)).toThrow();
      });

      it("should throw error when indices are out of range", () => {
        expect(() => list.subList(-1, 3)).toThrow();
        expect(() => list.subList(0, 999)).toThrow();
      });

      it("should return empty list when fromIndex === toIndex", () => {
        const subList = list.subList(2, 2);
        expect(subList.size()).toBe(0);
      });
    });

    describe("List-specific Collection behavior", () => {
      it("should maintain insertion order", () => {
        list.add(3);
        list.add(1);
        list.add(2);
        const array = list.toArray();
        expect(array).toEqual([3, 1, 2]);
      });

      it("should allow duplicate elements", () => {
        list.add(1);
        list.add(1);
        list.add(1);
        expect(list.size()).toBe(3);
      });
    });

    describe("sort", () => {
      it("sorts numbers in natural ascending order by default", () => {
        list.add(3);
        list.add(1);
        list.add(2);
        list.sort();
        expect(list.toArray()).toEqual([1, 2, 3]);
      });

      it("supports custom comparator", () => {
        list.add(1);
        list.add(2);
        list.add(3);
        list.sort((a, b) => b - a);
        expect(list.toArray()).toEqual([3, 2, 1]);
      });

      it("handles empty list", () => {
        list.sort();
        expect(list.size()).toBe(0);
      });

      it("preserves size and elements after sort", () => {
        list.add(2);
        list.add(2);
        list.add(1);
        list.sort();
        expect(list.size()).toBe(3);
        expect(list.toArray()).toEqual([1, 2, 2]);
      });
    });
  });
}
