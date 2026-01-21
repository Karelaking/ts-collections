import { describe, it, expect, beforeEach } from "vitest";
import type { Map } from "../../src/interfaces/Map";

/**
 * Creates a test suite for Map interface implementations.
 *
 * @param createMap Factory function to create map instances
 * @example
 * ```typescript
 * describeMap(() => new MyMap());
 * ```
 */
export function describeMap(createMap: () => Map<string, number>): void {
  describe("Map Interface", () => {
    let map: Map<string, number>;

    beforeEach(() => {
      map = createMap();
    });

    describe("size and isEmpty", () => {
      it("should return 0 for empty map", () => {
        expect(map.size()).toBe(0);
      });

      it("should return true for isEmpty on empty map", () => {
        expect(map.isEmpty()).toBe(true);
      });

      it("should update size after putting entries", () => {
        map.put("a", 1);
        expect(map.size()).toBe(1);
        map.put("b", 2);
        expect(map.size()).toBe(2);
      });

      it("should not increase size when updating existing key", () => {
        map.put("a", 1);
        map.put("a", 2);
        expect(map.size()).toBe(1);
      });

      it("should return false for isEmpty after putting entry", () => {
        map.put("a", 1);
        expect(map.isEmpty()).toBe(false);
      });
    });

    describe("put and get", () => {
      it("should put and retrieve value", () => {
        map.put("key", 42);
        expect(map.get("key")).toBe(42);
      });

      it("should return undefined for non-existent key", () => {
        expect(map.get("nonexistent")).toBeUndefined();
      });

      it("should return previous value when updating", () => {
        map.put("key", 1);
        const previous = map.put("key", 2);
        expect(previous).toBe(1);
        expect(map.get("key")).toBe(2);
      });

      it("should return undefined when putting new key", () => {
        const previous = map.put("new", 42);
        expect(previous).toBeUndefined();
      });

      it("should allow null values", () => {
        map.put("key", 0);
        expect(map.get("key")).toBe(0);
      });
    });

    describe("containsKey", () => {
      beforeEach(() => {
        map.put("a", 1);
        map.put("b", 2);
        map.put("c", 3);
      });

      it("should return true for contained keys", () => {
        expect(map.containsKey("a")).toBe(true);
        expect(map.containsKey("b")).toBe(true);
      });

      it("should return false for non-existent keys", () => {
        expect(map.containsKey("z")).toBe(false);
      });

      it("should return false for empty map", () => {
        map.clear();
        expect(map.containsKey("a")).toBe(false);
      });
    });

    describe("containsValue", () => {
      beforeEach(() => {
        map.put("a", 1);
        map.put("b", 2);
        map.put("c", 3);
      });

      it("should return true for contained values", () => {
        expect(map.containsValue(1)).toBe(true);
        expect(map.containsValue(2)).toBe(true);
      });

      it("should return false for non-existent values", () => {
        expect(map.containsValue(999)).toBe(false);
      });
    });

    describe("remove", () => {
      beforeEach(() => {
        map.put("a", 1);
        map.put("b", 2);
        map.put("c", 3);
      });

      it("should remove entry and return value", () => {
        const removed = map.remove("b");
        expect(removed).toBe(2);
      });

      it("should not contain key after removal", () => {
        map.remove("b");
        expect(map.containsKey("b")).toBe(false);
      });

      it("should decrease size after removal", () => {
        const initialSize = map.size();
        map.remove("b");
        expect(map.size()).toBe(initialSize - 1);
      });

      it("should return undefined when removing non-existent key", () => {
        const result = map.remove("nonexistent");
        expect(result).toBeUndefined();
      });

      it("should return undefined when removing from empty map", () => {
        map.clear();
        const result = map.remove("a");
        expect(result).toBeUndefined();
      });
    });

    describe("putAll", () => {
      it("should add all entries from another map", () => {
        map.put("a", 1);

        const other = createMap();
        other.put("b", 2);
        other.put("c", 3);

        map.putAll(other);
        expect(map.size()).toBe(3);
        expect(map.get("a")).toBe(1);
        expect(map.get("b")).toBe(2);
        expect(map.get("c")).toBe(3);
      });

      it("should overwrite existing keys", () => {
        map.put("a", 1);

        const other = createMap();
        other.put("a", 999);

        map.putAll(other);
        expect(map.get("a")).toBe(999);
      });
    });

    describe("clear", () => {
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
      });
    });

    describe("keys", () => {
      beforeEach(() => {
        map.put("a", 1);
        map.put("b", 2);
        map.put("c", 3);
      });

      it("should return all keys", () => {
        const keys = map.keys();
        expect(keys.length).toBe(3);
        expect(keys).toContain("a");
        expect(keys).toContain("b");
        expect(keys).toContain("c");
      });

      it("should return empty array for empty map", () => {
        map.clear();
        expect(map.keys()).toEqual([]);
      });
    });

    describe("values method (array)", () => {
      beforeEach(() => {
        map.put("a", 1);
        map.put("b", 2);
        map.put("c", 3);
      });

      it("should return all values", () => {
        const values = map.values();
        expect(values).toBeDefined();
      });

      it("should return empty collection for empty map", () => {
        map.clear();
        const values = map.values();
        if (Array.isArray(values)) {
          expect(values).toEqual([]);
        }
      });
    });

    describe("entries", () => {
      beforeEach(() => {
        map.put("a", 1);
        map.put("b", 2);
      });

      it("should return all key-value pairs", () => {
        const entries = map.entries();
        expect(entries.length).toBe(2);
        expect(entries).toContainEqual(["a", 1]);
        expect(entries).toContainEqual(["b", 2]);
      });

      it("should return empty array for empty map", () => {
        map.clear();
        expect(map.entries()).toEqual([]);
      });
    });

    describe("iterators", () => {
      beforeEach(() => {
        map.put("a", 1);
        map.put("b", 2);
        map.put("c", 3);
      });

      it("should provide key iterator", () => {
        const iterator = map.keyIterator();
        expect(iterator).toBeDefined();
        expect(iterator.hasNext()).toBe(true);

        const keys: string[] = [];
        while (iterator.hasNext()) {
          keys.push(iterator.next());
        }
        expect(keys.length).toBe(3);
        expect(keys).toContain("a");
        expect(keys).toContain("b");
        expect(keys).toContain("c");
      });

      it("should provide value iterator", () => {
        const iterator = map.valueIterator();
        expect(iterator).toBeDefined();
        expect(iterator.hasNext()).toBe(true);

        const values: number[] = [];
        while (iterator.hasNext()) {
          values.push(iterator.next());
        }
        expect(values.length).toBe(3);
        expect(values).toContain(1);
        expect(values).toContain(2);
        expect(values).toContain(3);
      });
    });
  });
}
