import { describe, it, expect, beforeEach } from "vitest";
import type { Collection } from "../../src/interfaces/Collection";

/**
 * Creates a test suite for Collection interface implementations.
 *
 * @param createCollection Factory function to create collection instances
 * @example
 * ```typescript
 * describeCollection(() => new MyCollection());
 * ```
 */
export function describeCollection(
  createCollection: () => Collection<number>
): void {
  describe("Collection Interface", () => {
    let collection: Collection<number>;

    beforeEach(() => {
      collection = createCollection();
    });

    describe("size and isEmpty", () => {
      it("should return 0 for empty collection", () => {
        expect(collection.size()).toBe(0);
      });

      it("should return true for isEmpty on empty collection", () => {
        expect(collection.isEmpty()).toBe(true);
      });

      it("should update size after adding elements", () => {
        collection.add(1);
        expect(collection.size()).toBe(1);
        collection.add(2);
        expect(collection.size()).toBe(2);
      });

      it("should return false for isEmpty after adding element", () => {
        collection.add(1);
        expect(collection.isEmpty()).toBe(false);
      });
    });

    describe("add and contains", () => {
      it("should add element and return true", () => {
        const result = collection.add(1);
        expect(result).toBe(true);
      });

      it("should contain element after adding", () => {
        collection.add(1);
        expect(collection.contains(1)).toBe(true);
      });

      it("should not contain element that was not added", () => {
        expect(collection.contains(1)).toBe(false);
      });

      it("should add multiple elements", () => {
        collection.add(1);
        collection.add(2);
        collection.add(3);
        expect(collection.size()).toBe(3);
        expect(collection.contains(1)).toBe(true);
        expect(collection.contains(2)).toBe(true);
        expect(collection.contains(3)).toBe(true);
      });
    });

    describe("remove", () => {
      beforeEach(() => {
        collection.add(1);
        collection.add(2);
        collection.add(3);
      });

      it("should remove element and return true", () => {
        const result = collection.remove(1);
        expect(result).toBe(true);
      });

      it("should not contain element after removal", () => {
        collection.remove(1);
        expect(collection.contains(1)).toBe(false);
      });

      it("should decrease size after removal", () => {
        const initialSize = collection.size();
        collection.remove(1);
        expect(collection.size()).toBe(initialSize - 1);
      });

      it("should return false when removing non-existent element", () => {
        const result = collection.remove(999);
        expect(result).toBe(false);
      });

      it("should return false when removing from empty collection", () => {
        collection.clear();
        const result = collection.remove(1);
        expect(result).toBe(false);
      });
    });

    describe("iterator", () => {
      beforeEach(() => {
        collection.add(1);
        collection.add(2);
        collection.add(3);
      });

      it("should provide an iterator", () => {
        const iterator = collection.iterator();
        expect(iterator).toBeDefined();
        expect(iterator.hasNext).toBeDefined();
        expect(iterator.next).toBeDefined();
      });

      it("should iterate through all elements", () => {
        const iterator = collection.iterator();
        const result: number[] = [];
        while (iterator.hasNext()) {
          result.push(iterator.next());
        }
        expect(result.length).toBe(3);
      });

      it("should iterate over empty collection", () => {
        collection.clear();
        const iterator = collection.iterator();
        expect(iterator.hasNext()).toBe(false);
      });
    });

    describe("toArray", () => {
      it("should return empty array for empty collection", () => {
        expect(collection.toArray()).toEqual([]);
      });

      it("should return array with all elements", () => {
        collection.add(1);
        collection.add(2);
        collection.add(3);
        const array = collection.toArray();
        expect(array.length).toBe(3);
        expect(array).toContain(1);
        expect(array).toContain(2);
        expect(array).toContain(3);
      });
    });

    describe("containsAll", () => {
      beforeEach(() => {
        collection.add(1);
        collection.add(2);
        collection.add(3);
      });

      it("should return true when all elements are contained", () => {
        const other = createCollection();
        other.add(1);
        other.add(2);
        expect(collection.containsAll(other)).toBe(true);
      });

      it("should return false when not all elements are contained", () => {
        const other = createCollection();
        other.add(1);
        other.add(999);
        expect(collection.containsAll(other)).toBe(false);
      });

      it("should return true for empty collection", () => {
        const other = createCollection();
        expect(collection.containsAll(other)).toBe(true);
      });
    });

    describe("addAll", () => {
      it("should add all elements from another collection", () => {
        const other = createCollection();
        other.add(1);
        other.add(2);

        const result = collection.addAll(other);
        expect(result).toBe(true);
        expect(collection.size()).toBe(2);
        expect(collection.contains(1)).toBe(true);
        expect(collection.contains(2)).toBe(true);
      });

      it("should return false when adding empty collection", () => {
        const other = createCollection();
        const result = collection.addAll(other);
        expect(result).toBe(false);
      });
    });

    describe("removeAll", () => {
      beforeEach(() => {
        collection.add(1);
        collection.add(2);
        collection.add(3);
      });

      it("should remove all specified elements", () => {
        const other = createCollection();
        other.add(1);
        other.add(2);

        const result = collection.removeAll(other);
        expect(result).toBe(true);
        expect(collection.size()).toBe(1);
        expect(collection.contains(3)).toBe(true);
      });

      it("should return false when removing non-existent elements", () => {
        const other = createCollection();
        other.add(999);
        const result = collection.removeAll(other);
        expect(result).toBe(false);
      });
    });

    describe("retainAll", () => {
      beforeEach(() => {
        collection.add(1);
        collection.add(2);
        collection.add(3);
      });

      it("should retain only specified elements", () => {
        const other = createCollection();
        other.add(1);
        other.add(2);

        const result = collection.retainAll(other);
        expect(result).toBe(true);
        expect(collection.size()).toBe(2);
        expect(collection.contains(1)).toBe(true);
        expect(collection.contains(2)).toBe(true);
        expect(collection.contains(3)).toBe(false);
      });
    });

    describe("clear", () => {
      beforeEach(() => {
        collection.add(1);
        collection.add(2);
        collection.add(3);
      });

      it("should remove all elements", () => {
        collection.clear();
        expect(collection.size()).toBe(0);
        expect(collection.isEmpty()).toBe(true);
      });

      it("should allow adding elements after clear", () => {
        collection.clear();
        collection.add(42);
        expect(collection.contains(42)).toBe(true);
      });
    });
  });
}
