import { describe, it, expect, beforeEach } from "vitest";
import type { Set } from "../../src/interfaces/Set";

/**
 * Creates a test suite for Set interface implementations.
 *
 * @param createSet Factory function to create set instances
 * @example
 * ```typescript
 * describeSet(() => new MySet());
 * ```
 */
export function describeSet(createSet: () => Set<number>): void {
  describe("Set Interface", () => {
    let set: Set<number>;

    beforeEach(() => {
      set = createSet();
    });

    describe("uniqueness constraint", () => {
      it("should not add duplicate element", () => {
        expect(set.add(1)).toBe(true);
        expect(set.add(1)).toBe(false);
        expect(set.size()).toBe(1);
      });

      it("should maintain unique elements when adding multiple", () => {
        set.add(1);
        set.add(2);
        set.add(1);
        set.add(3);
        set.add(2);
        expect(set.size()).toBe(3);
      });

      it("should return false for subsequent add of same element", () => {
        set.add(5);
        set.add(5);
        expect(set.size()).toBe(1);
      });
    });

    describe("contains", () => {
      beforeEach(() => {
        set.add(1);
        set.add(2);
        set.add(3);
      });

      it("should contain added elements", () => {
        expect(set.contains(1)).toBe(true);
        expect(set.contains(2)).toBe(true);
        expect(set.contains(3)).toBe(true);
      });

      it("should not contain non-existent elements", () => {
        expect(set.contains(999)).toBe(false);
      });
    });

    describe("remove", () => {
      beforeEach(() => {
        set.add(1);
        set.add(2);
        set.add(3);
      });

      it("should remove existing element and return true", () => {
        expect(set.remove(1)).toBe(true);
        expect(set.contains(1)).toBe(false);
        expect(set.size()).toBe(2);
      });

      it("should return false when removing non-existent element", () => {
        expect(set.remove(999)).toBe(false);
        expect(set.size()).toBe(3);
      });

      it("should return false when removing from empty set", () => {
        set.clear();
        expect(set.remove(1)).toBe(false);
      });
    });

    describe("Collection interface integration", () => {
      beforeEach(() => {
        set.add(1);
        set.add(2);
        set.add(3);
      });

      it("should implement size correctly", () => {
        expect(set.size()).toBe(3);
      });

      it("should implement isEmpty correctly", () => {
        expect(set.isEmpty()).toBe(false);
        set.clear();
        expect(set.isEmpty()).toBe(true);
      });

      it("should provide iterator", () => {
        const iterator = set.iterator();
        expect(iterator).toBeDefined();
        expect(iterator.hasNext()).toBe(true);
        const first = iterator.next();
        expect([1, 2, 3]).toContain(first);
      });

      it("should convert to array without duplicates", () => {
        const array = set.toArray();
        expect(array.length).toBe(3);
        expect(new Set(array).size).toBe(3);
      });

      it("should clear all elements", () => {
        set.clear();
        expect(set.size()).toBe(0);
        expect(set.isEmpty()).toBe(true);
      });
    });

    describe("addAll for sets", () => {
      it("should add all unique elements from another set", () => {
        const other = createSet();
        other.add(1);
        other.add(2);
        other.add(3);

        set.add(2);
        set.add(3);
        const result = set.addAll(other);
        expect(result).toBe(true);
        expect(set.size()).toBe(3);
        expect(set.contains(1)).toBe(true);
      });

      it("should not add duplicates when using addAll", () => {
        const other = createSet();
        other.add(1);
        other.add(2);

        set.add(1);
        const result = set.addAll(other);
        expect(result).toBe(true);
        expect(set.size()).toBe(2);
      });
    });

    describe("removeAll for sets", () => {
      beforeEach(() => {
        set.add(1);
        set.add(2);
        set.add(3);
      });

      it("should remove all elements that are in another set", () => {
        const other = createSet();
        other.add(1);
        other.add(2);

        const result = set.removeAll(other);
        expect(result).toBe(true);
        expect(set.size()).toBe(1);
        expect(set.contains(3)).toBe(true);
      });
    });

    describe("retainAll for sets", () => {
      beforeEach(() => {
        set.add(1);
        set.add(2);
        set.add(3);
        set.add(4);
      });

      it("should retain only elements that are in another set", () => {
        const other = createSet();
        other.add(1);
        other.add(3);

        const result = set.retainAll(other);
        expect(result).toBe(true);
        expect(set.size()).toBe(2);
        expect(set.contains(1)).toBe(true);
        expect(set.contains(3)).toBe(true);
        expect(set.contains(2)).toBe(false);
        expect(set.contains(4)).toBe(false);
      });
    });
  });
}
