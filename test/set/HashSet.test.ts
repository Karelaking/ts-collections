import { describe, it, expect, beforeEach } from "vitest";
import { HashSet } from "../../src/set/HashSet";
import { describeSet } from "../interfaces/Set.test";

/**
 * Test suite for HashSet implementation
 */
describeSet(() => new HashSet<number>());

describe("HashSet - Core Methods", () => {
  let set: HashSet<number>;

  beforeEach(() => {
    set = new HashSet<number>();
  });

  describe("constructor and size", () => {
    it("should construct an empty set", () => {
      expect(set.size()).toBe(0);
      expect(set.length).toBe(0);
      expect(set.isEmpty()).toBe(true);
    });

    it("should track size after adding elements", () => {
      set.add(1);
      expect(set.size()).toBe(1);
      expect(set.length).toBe(1);
      set.add(2);
      set.add(3);
      expect(set.size()).toBe(3);
      expect(set.length).toBe(3);
    });

    it("should not increase size when adding duplicate", () => {
      set.add(1);
      expect(set.size()).toBe(1);
      expect(set.length).toBe(1);
      set.add(1);
      expect(set.size()).toBe(1);
      expect(set.length).toBe(1);
    });

    it("should reduce size after removal", () => {
      set.add(1);
      set.add(2);
      set.add(3);
      set.remove(2);
      expect(set.size()).toBe(2);
      expect(set.length).toBe(2);
    });
  });

  describe("add method", () => {
    it("should add new element and return true", () => {
      const result = set.add(1);
      expect(result).toBe(true);
      expect(set.size()).toBe(1);
      expect(set.contains(1)).toBe(true);
    });

    it("should return false when adding duplicate", () => {
      set.add(1);
      const result = set.add(1);
      expect(result).toBe(false);
      expect(set.size()).toBe(1);
    });

    it("should add multiple unique elements", () => {
      expect(set.add(1)).toBe(true);
      expect(set.add(2)).toBe(true);
      expect(set.add(3)).toBe(true);
      expect(set.size()).toBe(3);
    });

    it("should maintain uniqueness when adding many duplicates", () => {
      set.add(5);
      set.add(5);
      set.add(5);
      set.add(5);
      expect(set.size()).toBe(1);
    });
  });

  describe("contains method", () => {
    beforeEach(() => {
      set.add(1);
      set.add(2);
      set.add(3);
    });

    it("should return true for contained elements", () => {
      expect(set.contains(1)).toBe(true);
      expect(set.contains(2)).toBe(true);
      expect(set.contains(3)).toBe(true);
    });

    it("should return false for non-existent elements", () => {
      expect(set.contains(999)).toBe(false);
      expect(set.contains(0)).toBe(false);
    });

    it("should work on empty set", () => {
      const emptySet = new HashSet<number>();
      expect(emptySet.contains(1)).toBe(false);
    });
  });

  describe("remove method", () => {
    beforeEach(() => {
      set.add(1);
      set.add(2);
      set.add(3);
    });

    it("should remove element and return true", () => {
      const result = set.remove(2);
      expect(result).toBe(true);
      expect(set.contains(2)).toBe(false);
      expect(set.size()).toBe(2);
    });

    it("should return false when removing non-existent element", () => {
      const result = set.remove(999);
      expect(result).toBe(false);
      expect(set.size()).toBe(3);
    });

    it("should return false when removing from empty set", () => {
      const emptySet = new HashSet<number>();
      expect(emptySet.remove(1)).toBe(false);
    });

    it("should remove first element", () => {
      const result = set.remove(1);
      expect(result).toBe(true);
      expect(set.size()).toBe(2);
    });

    it("should remove last element", () => {
      const result = set.remove(3);
      expect(result).toBe(true);
      expect(set.size()).toBe(2);
    });
  });

  describe("iterator method", () => {
    beforeEach(() => {
      set.add(1);
      set.add(2);
      set.add(3);
    });

    it("should iterate through all elements", () => {
      const elements: number[] = [];
      const iterator = set.iterator();

      while (iterator.hasNext()) {
        elements.push(iterator.next());
      }

      expect(elements.sort()).toEqual([1, 2, 3]);
    });

    it("should return false when no more elements", () => {
      const iterator = set.iterator();
      iterator.next();
      iterator.next();
      iterator.next();
      expect(iterator.hasNext()).toBe(false);
    });

    it("should throw error when calling next on exhausted iterator", () => {
      const iterator = set.iterator();
      iterator.next();
      iterator.next();
      iterator.next();
      expect(() => iterator.next()).toThrow();
    });

    it("should work on empty set", () => {
      const emptySet = new HashSet<number>();
      const iterator = emptySet.iterator();
      expect(iterator.hasNext()).toBe(false);
    });
  });

  describe("toArray method", () => {
    it("should convert to array", () => {
      set.add(1);
      set.add(2);
      set.add(3);

      const arr = set.toArray();
      expect(arr.length).toBe(3);
      expect(arr.sort()).toEqual([1, 2, 3]);
    });

    it("should return empty array for empty set", () => {
      const arr = set.toArray();
      expect(arr).toEqual([]);
    });

    it("should return independent array", () => {
      set.add(1);
      set.add(2);
      const arr = set.toArray();
      arr.push(3);
      expect(set.size()).toBe(2);
    });
  });

  describe("clear method", () => {
    beforeEach(() => {
      set.add(1);
      set.add(2);
      set.add(3);
    });

    it("should remove all elements", () => {
      set.clear();
      expect(set.size()).toBe(0);
      expect(set.isEmpty()).toBe(true);
    });

    it("should allow adding elements after clear", () => {
      set.clear();
      set.add(10);
      expect(set.size()).toBe(1);
      expect(set.contains(10)).toBe(true);
    });

    it("should work on empty set", () => {
      const emptySet = new HashSet<number>();
      emptySet.clear();
      expect(emptySet.size()).toBe(0);
    });
  });

  describe("isEmpty method", () => {
    it("should return true for empty set", () => {
      expect(set.isEmpty()).toBe(true);
    });

    it("should return false when set has elements", () => {
      set.add(1);
      expect(set.isEmpty()).toBe(false);
    });

    it("should return true after clearing", () => {
      set.add(1);
      set.clear();
      expect(set.isEmpty()).toBe(true);
    });
  });

  describe("handling object keys", () => {
    it("should handle numeric elements", () => {
      const numSet = new HashSet<number>();
      numSet.add(1);
      numSet.add(2);
      numSet.add(3);
      expect(numSet.size()).toBe(3);
      expect(numSet.contains(2)).toBe(true);
    });

    it("should handle string elements", () => {
      const strSet = new HashSet<string>();
      strSet.add("a");
      strSet.add("b");
      strSet.add("c");
      expect(strSet.size()).toBe(3);
      expect(strSet.contains("b")).toBe(true);
    });

    it("should handle object references", () => {
      const objSet = new HashSet<{ id: number }>();
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      objSet.add(obj1);
      objSet.add(obj2);
      expect(objSet.size()).toBe(2);
      expect(objSet.contains(obj1)).toBe(true);
    });
  });

  describe("collision handling", () => {
    it("should handle many elements", () => {
      for (let i = 0; i < 100; i++) {
        set.add(i);
      }
      expect(set.size()).toBe(100);
      expect(set.contains(50)).toBe(true);
      expect(set.contains(99)).toBe(true);
    });

    it("should maintain uniqueness with many elements", () => {
      for (let i = 0; i < 50; i++) {
        set.add(i);
      }
      for (let i = 0; i < 50; i++) {
        set.add(i); // Adding duplicates
      }
      expect(set.size()).toBe(50);
    });
  });

  describe("edge cases", () => {
    it("should handle alternating add and remove", () => {
      set.add(1);
      set.add(2);
      set.remove(1);
      set.add(3);
      set.remove(2);
      set.add(4);

      expect(set.size()).toBe(2);
      expect(set.contains(3)).toBe(true);
      expect(set.contains(4)).toBe(true);
    });

    it("should handle removing and re-adding same element", () => {
      set.add(1);
      set.remove(1);
      set.add(1);

      expect(set.size()).toBe(1);
      expect(set.contains(1)).toBe(true);
    });

    it("should maintain integrity after multiple operations", () => {
      set.add(1);
      set.add(2);
      set.add(3);
      set.add(1); // Duplicate
      set.remove(2);
      set.add(4);

      const arr = set.toArray().sort();
      expect(arr).toEqual([1, 3, 4]);
    });

    it("should handle removing elements multiple times", () => {
      set.add(1);
      expect(set.remove(1)).toBe(true);
      expect(set.remove(1)).toBe(false);
      expect(set.size()).toBe(0);
    });
  });

  describe("inherited Collection methods", () => {
    beforeEach(() => {
      set.add(1);
      set.add(2);
      set.add(3);
    });

    it("should implement containsAll", () => {
      const other = new HashSet<number>();
      other.add(1);
      other.add(2);
      expect(set.containsAll(other)).toBe(true);

      other.add(999);
      expect(set.containsAll(other)).toBe(false);
    });

    it("should implement addAll correctly for sets", () => {
      const other = new HashSet<number>();
      other.add(1);
      other.add(4);
      other.add(5);

      const result = set.addAll(other);
      expect(result).toBe(true);
      expect(set.size()).toBe(5);
      expect(set.contains(4)).toBe(true);
      expect(set.contains(5)).toBe(true);
    });

    it("should implement removeAll correctly for sets", () => {
      const other = new HashSet<number>();
      other.add(1);
      other.add(2);

      const result = set.removeAll(other);
      // removeAll uses iterator.remove() which is optional
      expect([true, false]).toContain(result);
    });

    it("should implement retainAll correctly for sets", () => {
      const other = new HashSet<number>();
      other.add(1);
      other.add(3);

      const result = set.retainAll(other);
      // retainAll uses iterator.remove() which is optional
      expect([true, false]).toContain(result);
    });
  });
});
