import { describe, it, expect, beforeEach } from "vitest";
import type { Iterator } from "../../src/interfaces/Iterator";

/**
 * Creates a test suite for Iterator interface implementations.
 *
 * @param createIterator Factory function to create iterator instances
 * @example
 * ```typescript
 * describeIterator(() => new MyIterator([1, 2, 3]));
 * ```
 */
export function describeIterator(
  createIterator: (elements: unknown[]) => Iterator<unknown>
): void {
  describe("Iterator Interface", () => {
    let iterator: Iterator<number>;
    let elements: number[];

    beforeEach(() => {
      elements = [1, 2, 3];
      iterator = createIterator(elements) as Iterator<number>;
    });

    it("should return true for hasNext when elements are available", () => {
      expect(iterator.hasNext()).toBe(true);
    });

    it("should return false for hasNext when at the end of iteration", () => {
      while (iterator.hasNext()) {
        iterator.next();
      }
      expect(iterator.hasNext()).toBe(false);
    });

    it("should return the next element in sequence", () => {
      expect(iterator.next()).toBe(1);
      expect(iterator.next()).toBe(2);
      expect(iterator.next()).toBe(3);
    });

    it("should throw an error when calling next() on exhausted iterator", () => {
      while (iterator.hasNext()) {
        iterator.next();
      }
      expect(() => iterator.next()).toThrow();
    });

    it("should iterate through all elements", () => {
      const result: number[] = [];
      while (iterator.hasNext()) {
        result.push(iterator.next());
      }
      expect(result).toEqual(elements);
    });

    it("should handle empty collection", () => {
      iterator = createIterator([]) as Iterator<number>;
      expect(iterator.hasNext()).toBe(false);
      expect(() => iterator.next()).toThrow();
    });

    it("should support single element", () => {
      iterator = createIterator([42]) as Iterator<number>;
      expect(iterator.hasNext()).toBe(true);
      expect(iterator.next()).toBe(42);
      expect(iterator.hasNext()).toBe(false);
    });
  });
}
