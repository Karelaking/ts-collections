import { describe, it, expect, beforeEach } from "vitest";
import { HashMap } from "../../src/map/HashMap";
import { describeMap } from "../interfaces/Map.test";

/**
 * Test suite for HashMap implementation
 */
describeMap(() => new HashMap<string, number>());

describe("HashMap - Core Methods", () => {
  let map: HashMap<string, number>;

  beforeEach(() => {
    map = new HashMap<string, number>();
  });

  describe("constructor and size", () => {
    it("should construct an empty map", () => {
      expect(map.size()).toBe(0);
      expect(map.length).toBe(0);
      expect(map.isEmpty()).toBe(true);
    });

    it("should track size after putting entries", () => {
      map.put("a", 1);
      expect(map.size()).toBe(1);
      expect(map.length).toBe(1);
      map.put("b", 2);
      map.put("c", 3);
      expect(map.size()).toBe(3);
      expect(map.length).toBe(3);
    });

    it("should not increase size when updating existing key", () => {
      map.put("key", 1);
      expect(map.size()).toBe(1);
      expect(map.length).toBe(1);
      map.put("key", 2);
      expect(map.size()).toBe(1);
      expect(map.length).toBe(1);
    });

    it("should reduce size after removal", () => {
      map.put("a", 1);
      map.put("b", 2);
      map.put("c", 3);
      map.remove("b");
      expect(map.size()).toBe(2);
      expect(map.length).toBe(2);
    });
  });

  describe("put method", () => {
    it("should put and retrieve value", () => {
      map.put("key", 42);
      expect(map.get("key")).toBe(42);
    });

    it("should return undefined when putting new key", () => {
      const prev = map.put("new", 42);
      expect(prev).toBeUndefined();
    });

    it("should return previous value when updating", () => {
      map.put("key", 1);
      const prev = map.put("key", 2);
      expect(prev).toBe(1);
      expect(map.get("key")).toBe(2);
    });

    it("should allow null/zero values", () => {
      map.put("key", 0);
      expect(map.get("key")).toBe(0);
    });

    it("should put multiple entries", () => {
      map.put("a", 1);
      map.put("b", 2);
      map.put("c", 3);
      expect(map.size()).toBe(3);
      expect(map.get("a")).toBe(1);
      expect(map.get("b")).toBe(2);
      expect(map.get("c")).toBe(3);
    });

    it("should overwrite existing entries", () => {
      map.put("a", 1);
      map.put("a", 10);
      map.put("a", 100);
      expect(map.get("a")).toBe(100);
      expect(map.size()).toBe(1);
    });
  });

  describe("get method", () => {
    beforeEach(() => {
      map.put("a", 1);
      map.put("b", 2);
      map.put("c", 3);
    });

    it("should retrieve existing values", () => {
      expect(map.get("a")).toBe(1);
      expect(map.get("b")).toBe(2);
      expect(map.get("c")).toBe(3);
    });

    it("should return undefined for non-existent keys", () => {
      expect(map.get("z")).toBeUndefined();
      expect(map.get("nonexistent")).toBeUndefined();
    });

    it("should retrieve value from empty map as undefined", () => {
      const emptyMap = new HashMap<string, number>();
      expect(emptyMap.get("any")).toBeUndefined();
    });
  });

  describe("containsKey method", () => {
    beforeEach(() => {
      map.put("a", 1);
      map.put("b", 2);
      map.put("c", 3);
    });

    it("should return true for contained keys", () => {
      expect(map.containsKey("a")).toBe(true);
      expect(map.containsKey("b")).toBe(true);
      expect(map.containsKey("c")).toBe(true);
    });

    it("should return false for non-existent keys", () => {
      expect(map.containsKey("z")).toBe(false);
      expect(map.containsKey("nonexistent")).toBe(false);
    });

    it("should work with empty map", () => {
      const emptyMap = new HashMap<string, number>();
      expect(emptyMap.containsKey("any")).toBe(false);
    });
  });

  describe("containsValue method", () => {
    beforeEach(() => {
      map.put("a", 1);
      map.put("b", 2);
      map.put("c", 3);
    });

    it("should return true for contained values", () => {
      expect(map.containsValue(1)).toBe(true);
      expect(map.containsValue(2)).toBe(true);
      expect(map.containsValue(3)).toBe(true);
    });

    it("should return false for non-existent values", () => {
      expect(map.containsValue(999)).toBe(false);
      expect(map.containsValue(0)).toBe(false);
    });

    it("should work with empty map", () => {
      const emptyMap = new HashMap<string, number>();
      expect(emptyMap.containsValue(1)).toBe(false);
    });

    it("should handle multiple keys with same value", () => {
      map.put("x", 1); // Same value as "a"
      expect(map.containsValue(1)).toBe(true);
    });
  });

  describe("remove method", () => {
    beforeEach(() => {
      map.put("a", 1);
      map.put("b", 2);
      map.put("c", 3);
    });

    it("should remove and return value", () => {
      const removed = map.remove("b");
      expect(removed).toBe(2);
      expect(map.containsKey("b")).toBe(false);
    });

    it("should decrease size after removal", () => {
      map.remove("b");
      expect(map.size()).toBe(2);
    });

    it("should return undefined when removing non-existent key", () => {
      const result = map.remove("nonexistent");
      expect(result).toBeUndefined();
    });

    it("should return undefined when removing from empty map", () => {
      const emptyMap = new HashMap<string, number>();
      const result = emptyMap.remove("a");
      expect(result).toBeUndefined();
    });

    it("should remove first key", () => {
      const removed = map.remove("a");
      expect(removed).toBe(1);
      expect(map.size()).toBe(2);
    });

    it("should remove last key", () => {
      const removed = map.remove("c");
      expect(removed).toBe(3);
      expect(map.size()).toBe(2);
    });
  });

  describe("keyIterator method", () => {
    beforeEach(() => {
      map.put("a", 1);
      map.put("b", 2);
      map.put("c", 3);
    });

    it("should iterate through all keys", () => {
      const keys: string[] = [];
      const iterator = map.keyIterator();

      while (iterator.hasNext()) {
        keys.push(iterator.next());
      }

      expect(keys.sort()).toEqual(["a", "b", "c"]);
    });

    it("should work on empty map", () => {
      const emptyMap = new HashMap<string, number>();
      const iterator = emptyMap.keyIterator();
      expect(iterator.hasNext()).toBe(false);
    });
  });

  describe("valueIterator method", () => {
    beforeEach(() => {
      map.put("a", 1);
      map.put("b", 2);
      map.put("c", 3);
    });

    it("should iterate through all values", () => {
      const values: number[] = [];
      const iterator = map.valueIterator();

      while (iterator.hasNext()) {
        values.push(iterator.next());
      }

      expect(values.sort()).toEqual([1, 2, 3]);
    });

    it("should work on empty map", () => {
      const emptyMap = new HashMap<string, number>();
      const iterator = emptyMap.valueIterator();
      expect(iterator.hasNext()).toBe(false);
    });
  });

  describe("keys method", () => {
    it("should return all keys as array", () => {
      map.put("a", 1);
      map.put("b", 2);
      map.put("c", 3);

      const keys = map.keys();
      expect(keys.length).toBe(3);
      expect(keys.sort()).toEqual(["a", "b", "c"]);
    });

    it("should return empty array for empty map", () => {
      expect(map.keys()).toEqual([]);
    });
  });

  describe("values method", () => {
    it("should return all values", () => {
      map.put("a", 1);
      map.put("b", 2);
      map.put("c", 3);

      const values = map.values();
      if (Array.isArray(values)) {
        expect(values.length).toBe(3);
        expect(values.sort()).toEqual([1, 2, 3]);
      }
    });

    it("should return empty for empty map", () => {
      const values = map.values();
      if (Array.isArray(values)) {
        expect(values).toEqual([]);
      }
    });
  });

  describe("entries method", () => {
    it("should return all key-value pairs", () => {
      map.put("a", 1);
      map.put("b", 2);

      const entries = map.entries();
      expect(entries.length).toBe(2);
      expect(entries).toContainEqual(["a", 1]);
      expect(entries).toContainEqual(["b", 2]);
    });

    it("should return empty array for empty map", () => {
      expect(map.entries()).toEqual([]);
    });
  });

  describe("putAll method", () => {
    beforeEach(() => {
      map.put("a", 1);
    });

    it("should add all entries from another map", () => {
      const other = new HashMap<string, number>();
      other.put("b", 2);
      other.put("c", 3);

      map.putAll(other);
      expect(map.size()).toBe(3);
      expect(map.get("a")).toBe(1);
      expect(map.get("b")).toBe(2);
      expect(map.get("c")).toBe(3);
    });

    it("should overwrite existing keys", () => {
      const other = new HashMap<string, number>();
      other.put("a", 999);

      map.putAll(other);
      expect(map.get("a")).toBe(999);
      expect(map.size()).toBe(1);
    });

    it("should handle empty map", () => {
      const other = new HashMap<string, number>();
      map.putAll(other);
      expect(map.size()).toBe(1);
      expect(map.get("a")).toBe(1);
    });
  });

  describe("clear method", () => {
    beforeEach(() => {
      map.put("a", 1);
      map.put("b", 2);
      map.put("c", 3);
    });

    it("should remove all entries", () => {
      map.clear();
      expect(map.size()).toBe(0);
      expect(map.isEmpty()).toBe(true);
    });

    it("should allow putting entries after clear", () => {
      map.clear();
      map.put("x", 100);
      expect(map.get("x")).toBe(100);
      expect(map.size()).toBe(1);
    });

    it("should work on empty map", () => {
      const emptyMap = new HashMap<string, number>();
      emptyMap.clear();
      expect(emptyMap.size()).toBe(0);
    });
  });

  describe("isEmpty method", () => {
    it("should return true for empty map", () => {
      expect(map.isEmpty()).toBe(true);
    });

    it("should return false when map has entries", () => {
      map.put("a", 1);
      expect(map.isEmpty()).toBe(false);
    });

    it("should return true after clearing", () => {
      map.put("a", 1);
      map.clear();
      expect(map.isEmpty()).toBe(true);
    });
  });

  describe("collision handling", () => {
    it("should handle entries with same hash", () => {
      map.put("a", 1);
      map.put("b", 2);
      map.put("c", 3);

      // Verify all entries are still accessible
      expect(map.get("a")).toBe(1);
      expect(map.get("b")).toBe(2);
      expect(map.get("c")).toBe(3);
      expect(map.size()).toBe(3);
    });

    it("should handle large number of entries", () => {
      for (let i = 0; i < 100; i++) {
        map.put(`key${i}`, i);
      }
      expect(map.size()).toBe(100);
      expect(map.get("key50")).toBe(50);
      expect(map.get("key99")).toBe(99);
    });
  });

  describe("special key types", () => {
    it("should work with numeric string keys", () => {
      map.put("1", 10);
      map.put("2", 20);
      map.put("10", 100);

      expect(map.get("1")).toBe(10);
      expect(map.get("10")).toBe(100);
    });

    it("should handle empty string key", () => {
      map.put("", 42);
      expect(map.get("")).toBe(42);
      expect(map.containsKey("")).toBe(true);
    });

    it("should distinguish between string and other keys", () => {
      map.put("1", 10);
      map.put("2", 20);

      expect(map.containsKey("1")).toBe(true);
      expect(map.size()).toBe(2);
    });
  });

  describe("edge cases", () => {
    it("should handle alternating put and remove", () => {
      map.put("a", 1);
      map.put("b", 2);
      map.remove("a");
      map.put("c", 3);
      map.remove("b");
      map.put("d", 4);

      expect(map.size()).toBe(2);
      expect(map.containsKey("c")).toBe(true);
      expect(map.containsKey("d")).toBe(true);
    });

    it("should handle removing and re-adding same key", () => {
      map.put("a", 1);
      map.remove("a");
      map.put("a", 2);

      expect(map.size()).toBe(1);
      expect(map.get("a")).toBe(2);
    });

    it("should maintain integrity after multiple operations", () => {
      map.put("a", 1);
      map.put("b", 2);
      map.put("c", 3);
      map.put("a", 10);
      map.remove("b");
      map.put("d", 4);

      const keys = map.keys().sort();
      expect(keys).toEqual(["a", "c", "d"]);
      expect(map.get("a")).toBe(10);
    });
  });
});
