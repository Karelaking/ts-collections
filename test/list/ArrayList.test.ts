import { describe, it, expect, beforeEach } from "vitest";
import { ArrayList } from "../../src/list/ArrayList";
import { describeList } from "../interfaces/List.test";

/**
 * Test suite for ArrayList implementation
 */
describeList(() => new ArrayList<number>());

describe("ArrayList - Core Methods", () => {
  let list: ArrayList<number>;

  beforeEach(() => {
    list = new ArrayList<number>();
  });

  describe("constructor and size", () => {
    it("should construct an empty list", () => {
      expect(list.size()).toBe(0);
    });

    it("should track size after adding elements", () => {
      list.add(1);
      expect(list.size()).toBe(1);
      list.add(2);
      list.add(3);
      expect(list.size()).toBe(3);
    });

    it("should reduce size after removal", () => {
      list.add(1);
      list.add(2);
      list.add(3);
      list.removeAt(1);
      expect(list.size()).toBe(2);
    });
  });

  describe("add method", () => {
    it("should add single element", () => {
      const result = list.add(10);
      expect(result).toBe(true);
      expect(list.size()).toBe(1);
      expect(list.get(0)).toBe(10);
    });

    it("should add multiple elements in order", () => {
      list.add(1);
      list.add(2);
      list.add(3);
      expect(list.get(0)).toBe(1);
      expect(list.get(1)).toBe(2);
      expect(list.get(2)).toBe(3);
    });

    it("should allow duplicate elements", () => {
      list.add(5);
      list.add(5);
      list.add(5);
      expect(list.size()).toBe(3);
      expect(list.get(0)).toBe(5);
      expect(list.get(1)).toBe(5);
      expect(list.get(2)).toBe(5);
    });

    it("should always return true", () => {
      expect(list.add(1)).toBe(true);
      expect(list.add(2)).toBe(true);
      expect(list.add(3)).toBe(true);
    });
  });

  describe("get method", () => {
    beforeEach(() => {
      list.add(10);
      list.add(20);
      list.add(30);
    });

    it("should retrieve element at valid index", () => {
      expect(list.get(0)).toBe(10);
      expect(list.get(1)).toBe(20);
      expect(list.get(2)).toBe(30);
    });

    it("should throw error for negative index", () => {
      expect(() => list.get(-1)).toThrow("Index out of bounds: -1");
    });

    it("should throw error for out of bounds index", () => {
      expect(() => list.get(3)).toThrow();
      expect(() => list.get(100)).toThrow();
    });

    it("should work with different types", () => {
      const stringList = new ArrayList<string>();
      stringList.add("a");
      stringList.add("b");
      stringList.add("c");
      expect(stringList.get(1)).toBe("b");
    });
  });

  describe("set method", () => {
    beforeEach(() => {
      list.add(10);
      list.add(20);
      list.add(30);
    });

    it("should replace element and return old value", () => {
      const oldValue = list.set(1, 25);
      expect(oldValue).toBe(20);
      expect(list.get(1)).toBe(25);
    });

    it("should set element at first position", () => {
      const oldValue = list.set(0, 5);
      expect(oldValue).toBe(10);
      expect(list.get(0)).toBe(5);
    });

    it("should set element at last position", () => {
      const oldValue = list.set(2, 35);
      expect(oldValue).toBe(30);
      expect(list.get(2)).toBe(35);
    });

    it("should throw error for invalid index", () => {
      expect(() => list.set(5, 100)).toThrow();
    });

    it("should throw error for negative index", () => {
      expect(() => list.set(-1, 100)).toThrow();
    });
  });

  describe("addAt method", () => {
    beforeEach(() => {
      list.add(10);
      list.add(30);
    });

    it("should insert at beginning", () => {
      list.addAt(0, 5);
      expect(list.size()).toBe(3);
      expect(list.get(0)).toBe(5);
      expect(list.get(1)).toBe(10);
      expect(list.get(2)).toBe(30);
    });

    it("should insert in middle", () => {
      list.addAt(1, 20);
      expect(list.size()).toBe(3);
      expect(list.get(0)).toBe(10);
      expect(list.get(1)).toBe(20);
      expect(list.get(2)).toBe(30);
    });

    it("should insert at end", () => {
      list.addAt(2, 40);
      expect(list.size()).toBe(3);
      expect(list.get(0)).toBe(10);
      expect(list.get(1)).toBe(30);
      expect(list.get(2)).toBe(40);
    });

    it("should throw error for negative index", () => {
      expect(() => list.addAt(-1, 100)).toThrow();
    });

    it("should throw error for index beyond size", () => {
      expect(() => list.addAt(5, 100)).toThrow();
    });
  });

  describe("removeAt method", () => {
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

    it("should remove first element", () => {
      const removed = list.removeAt(0);
      expect(removed).toBe(10);
      expect(list.get(0)).toBe(20);
      expect(list.size()).toBe(2);
    });

    it("should remove last element", () => {
      const removed = list.removeAt(2);
      expect(removed).toBe(30);
      expect(list.size()).toBe(2);
      expect(list.get(1)).toBe(20);
    });

    it("should shift elements after removal", () => {
      list.removeAt(1);
      expect(list.get(0)).toBe(10);
      expect(list.get(1)).toBe(30);
    });

    it("should throw error for negative index", () => {
      expect(() => list.removeAt(-1)).toThrow();
    });

    it("should throw error for out of bounds index", () => {
      expect(() => list.removeAt(3)).toThrow();
      expect(() => list.removeAt(100)).toThrow();
    });

    it("should throw error when removing from empty list", () => {
      const emptyList = new ArrayList<number>();
      expect(() => emptyList.removeAt(0)).toThrow();
    });
  });

  describe("indexOf method", () => {
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

    it("should find first occurrence when duplicates exist", () => {
      expect(list.indexOf(10)).toBe(0);
    });

    it("should work with empty list", () => {
      const emptyList = new ArrayList<number>();
      expect(emptyList.indexOf(10)).toBe(-1);
    });
  });

  describe("lastIndexOf method", () => {
    beforeEach(() => {
      list.add(10);
      list.add(20);
      list.add(10);
      list.add(30);
    });

    it("should find index of last occurrence", () => {
      expect(list.lastIndexOf(10)).toBe(2);
      expect(list.lastIndexOf(20)).toBe(1);
      expect(list.lastIndexOf(30)).toBe(3);
    });

    it("should return -1 for non-existent element", () => {
      expect(list.lastIndexOf(999)).toBe(-1);
    });

    it("should find last occurrence when duplicates exist", () => {
      expect(list.lastIndexOf(10)).toBe(2);
    });

    it("should work with empty list", () => {
      const emptyList = new ArrayList<number>();
      expect(emptyList.lastIndexOf(10)).toBe(-1);
    });
  });

  describe("subList method", () => {
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

    it("should return sub-list from start", () => {
      const subList = list.subList(0, 3);
      expect(subList.size()).toBe(3);
      expect(subList.get(0)).toBe(10);
      expect(subList.get(1)).toBe(20);
      expect(subList.get(2)).toBe(30);
    });

    it("should return sub-list to end", () => {
      const subList = list.subList(2, 5);
      expect(subList.size()).toBe(3);
      expect(subList.get(0)).toBe(30);
      expect(subList.get(1)).toBe(40);
      expect(subList.get(2)).toBe(50);
    });

    it("should return empty list when fromIndex equals toIndex", () => {
      const subList = list.subList(2, 2);
      expect(subList.size()).toBe(0);
    });

    it("should throw error when fromIndex > toIndex", () => {
      expect(() => list.subList(3, 1)).toThrow();
    });

    it("should throw error when indices are out of range", () => {
      expect(() => list.subList(-1, 3)).toThrow();
      expect(() => list.subList(0, 10)).toThrow();
    });

    it("should return independent sub-list", () => {
      const subList = list.subList(1, 3);
      subList.add(99);
      expect(list.size()).toBe(5); // Original list unchanged
      expect(subList.size()).toBe(3);
    });
  });

  describe("contains method", () => {
    beforeEach(() => {
      list.add(10);
      list.add(20);
      list.add(30);
    });

    it("should find existing elements", () => {
      expect(list.contains(10)).toBe(true);
      expect(list.contains(20)).toBe(true);
      expect(list.contains(30)).toBe(true);
    });

    it("should return false for non-existent elements", () => {
      expect(list.contains(5)).toBe(false);
      expect(list.contains(999)).toBe(false);
    });

    it("should work with duplicates", () => {
      list.add(10);
      expect(list.contains(10)).toBe(true);
    });

    it("should return false for empty list", () => {
      const emptyList = new ArrayList<number>();
      expect(emptyList.contains(10)).toBe(false);
    });
  });

  describe("clear method", () => {
    beforeEach(() => {
      list.add(1);
      list.add(2);
      list.add(3);
    });

    it("should remove all elements", () => {
      list.clear();
      expect(list.size()).toBe(0);
    });

    it("should allow adding elements after clear", () => {
      list.clear();
      list.add(10);
      expect(list.size()).toBe(1);
      expect(list.get(0)).toBe(10);
    });

    it("should work on empty list", () => {
      const emptyList = new ArrayList<number>();
      emptyList.clear();
      expect(emptyList.size()).toBe(0);
    });
  });

  describe("isEmpty method", () => {
    it("should return true for empty list", () => {
      expect(list.isEmpty()).toBe(true);
    });

    it("should return false when list has elements", () => {
      list.add(1);
      expect(list.isEmpty()).toBe(false);
    });

    it("should return true after clearing", () => {
      list.add(1);
      list.add(2);
      list.clear();
      expect(list.isEmpty()).toBe(true);
    });
  });

  describe("toArray method", () => {
    it("should return empty array for empty list", () => {
      const array = list.toArray();
      expect(array).toEqual([]);
    });

    it("should return array with all elements in order", () => {
      list.add(1);
      list.add(2);
      list.add(3);
      const array = list.toArray();
      expect(array).toEqual([1, 2, 3]);
    });

    it("should return independent array", () => {
      list.add(1);
      list.add(2);
      const array = list.toArray();
      array.push(3);
      expect(list.size()).toBe(2); // Original list unchanged
    });

    it("should handle duplicates", () => {
      list.add(1);
      list.add(1);
      list.add(2);
      const array = list.toArray();
      expect(array).toEqual([1, 1, 2]);
    });
  });

  describe("iterator method", () => {
    beforeEach(() => {
      list.add(10);
      list.add(20);
      list.add(30);
    });

    it("should iterate through all elements", () => {
      const iterator = list.iterator();
      const elements: number[] = [];
      while (iterator.hasNext()) {
        elements.push(iterator.next());
      }
      expect(elements).toEqual([10, 20, 30]);
    });

    it("should return false when no more elements", () => {
      const iterator = list.iterator();
      iterator.next();
      iterator.next();
      iterator.next();
      expect(iterator.hasNext()).toBe(false);
    });

    it("should throw error when calling next on exhausted iterator", () => {
      const iterator = list.iterator();
      iterator.next();
      iterator.next();
      iterator.next();
      expect(() => iterator.next()).toThrow();
    });

    it("should work on empty list", () => {
      const emptyList = new ArrayList<number>();
      const iterator = emptyList.iterator();
      expect(iterator.hasNext()).toBe(false);
    });

    it("should return true for hasNext when elements exist", () => {
      const iterator = list.iterator();
      expect(iterator.hasNext()).toBe(true);
    });
  });

  describe("remove method (inherited from AbstractList)", () => {
    beforeEach(() => {
      list.add(10);
      list.add(20);
      list.add(30);
    });

    it("should remove first occurrence of element", () => {
      const result = list.remove(20);
      expect(result).toBe(true);
      expect(list.size()).toBe(2);
      expect(list.get(0)).toBe(10);
      expect(list.get(1)).toBe(30);
    });

    it("should return false for non-existent element", () => {
      const result = list.remove(999);
      expect(result).toBe(false);
    });

    it("should remove only first occurrence with duplicates", () => {
      list.add(20);
      const result = list.remove(20);
      expect(result).toBe(true);
      expect(list.size()).toBe(3);
      expect(list.contains(20)).toBe(true);
    });

    it("should work on empty list", () => {
      const emptyList = new ArrayList<number>();
      expect(emptyList.remove(10)).toBe(false);
    });
  });

  describe("containsAll method (inherited from AbstractCollection)", () => {
    beforeEach(() => {
      list.add(10);
      list.add(20);
      list.add(30);
    });

    it("should return true when all elements are contained", () => {
      const other = new ArrayList<number>();
      other.add(10);
      other.add(20);
      expect(list.containsAll(other)).toBe(true);
    });

    it("should return false when some elements are missing", () => {
      const other = new ArrayList<number>();
      other.add(10);
      other.add(40);
      expect(list.containsAll(other)).toBe(false);
    });

    it("should return true for empty collection", () => {
      const emptyList = new ArrayList<number>();
      expect(list.containsAll(emptyList)).toBe(true);
    });
  });

  describe("addAll method (inherited from AbstractCollection)", () => {
    beforeEach(() => {
      list.add(1);
      list.add(2);
    });

    it("should add all elements from another collection", () => {
      const other = new ArrayList<number>();
      other.add(3);
      other.add(4);
      const result = list.addAll(other);
      expect(result).toBe(true);
      expect(list.size()).toBe(4);
      expect(list.toArray()).toEqual([1, 2, 3, 4]);
    });

    it("should return false when adding empty collection", () => {
      const emptyList = new ArrayList<number>();
      const result = list.addAll(emptyList);
      expect(result).toBe(false);
    });

    it("should handle adding to empty list", () => {
      const emptyList = new ArrayList<number>();
      const other = new ArrayList<number>();
      other.add(1);
      other.add(2);
      const result = emptyList.addAll(other);
      expect(result).toBe(true);
      expect(emptyList.size()).toBe(2);
    });
  });

  describe("removeAll method (inherited from AbstractCollection)", () => {
    beforeEach(() => {
      list.add(1);
      list.add(2);
      list.add(3);
      list.add(4);
    });

    it("should not modify list when iterator.remove is not implemented", () => {
      const other = new ArrayList<number>();
      other.add(2);
      other.add(4);
      const result = list.removeAll(other);
      // removeAll uses iterator.remove() which is optional
      // Since ArrayList iterator doesn't implement remove(), list remains unchanged
      expect(result).toBe(false);
      expect(list.size()).toBe(4);
    });

    it("should return false when no matching elements", () => {
      const other = new ArrayList<number>();
      other.add(5);
      other.add(6);
      const result = list.removeAll(other);
      expect(result).toBe(false);
    });

    it("should handle empty collection", () => {
      const emptyList = new ArrayList<number>();
      const result = list.removeAll(emptyList);
      expect(result).toBe(false);
    });
  });

  describe("retainAll method (inherited from AbstractCollection)", () => {
    beforeEach(() => {
      list.add(1);
      list.add(2);
      list.add(3);
      list.add(4);
    });

    it("should not modify list when iterator.remove is not implemented", () => {
      const other = new ArrayList<number>();
      other.add(2);
      other.add(4);
      const result = list.retainAll(other);
      // retainAll uses iterator.remove() which is optional
      // Since ArrayList iterator doesn't implement remove(), list remains unchanged
      expect(result).toBe(false);
      expect(list.size()).toBe(4);
    });

    it("should return false when all elements are retained", () => {
      const other = new ArrayList<number>();
      other.add(1);
      other.add(2);
      other.add(3);
      other.add(4);
      const result = list.retainAll(other);
      expect(result).toBe(false);
    });

    it("should handle empty collection (no common elements)", () => {
      const other = new ArrayList<number>();
      other.add(5);
      other.add(6);
      const result = list.retainAll(other);
      // retainAll uses iterator.remove() which is optional
      expect(result).toBe(false);
      expect(list.size()).toBe(4); // List unchanged
    });
  });

  describe("edge cases and special scenarios", () => {
    it("should handle large number of elements", () => {
      for (let i = 0; i < 1000; i++) {
        list.add(i);
      }
      expect(list.size()).toBe(1000);
      expect(list.get(0)).toBe(0);
      expect(list.get(999)).toBe(999);
    });

    it("should handle alternating add and remove operations", () => {
      list.add(1);
      list.add(2);
      list.removeAt(0);
      list.add(3);
      list.removeAt(0);
      list.add(4);
      expect(list.size()).toBe(2);
      expect(list.get(0)).toBe(3);
      expect(list.get(1)).toBe(4);
    });

    it("should maintain integrity after multiple operations", () => {
      list.add(1);
      list.add(2);
      list.add(3);
      list.set(1, 20);
      list.addAt(1, 15);
      list.removeAt(2);
      expect(list.toArray()).toEqual([1, 15, 3]);
    });

    it("should work with different data types", () => {
      const stringList = new ArrayList<string>();
      stringList.add("a");
      stringList.add("b");
      stringList.add("c");
      expect(stringList.get(1)).toBe("b");
      expect(stringList.remove("b")).toBe(true);
      expect(stringList.size()).toBe(2);
    });

    it("should work with object types", () => {
      const objList = new ArrayList<{ id: number; name: string }>();
      const obj1 = { id: 1, name: "Alice" };
      const obj2 = { id: 2, name: "Bob" };
      objList.add(obj1);
      objList.add(obj2);
      expect(objList.get(0)).toBe(obj1);
      expect(objList.contains(obj2)).toBe(true);
    });
  });
});
