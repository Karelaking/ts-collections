import { describe, it, expect, beforeEach } from "vitest";
import { LinkedList } from "../../src/list/LinkedList";
import { describeList } from "../interfaces/List.test";
import { z } from "zod";

/**
 * Test suite for LinkedList implementation
 */
describeList(() => new LinkedList<number>());

describe("LinkedList - Core Methods", () => {
  let list: LinkedList<number>;

  beforeEach(() => {
    list = new LinkedList<number>();
  });

  describe("constructor and size", () => {
    it("should construct an empty list", () => {
      expect(list.size()).toBe(0);
      expect(list.isEmpty()).toBe(true);
    });

    it("should track size after adding elements", () => {
      list.add(1);
      expect(list.size()).toBe(1);
      list.add(2);
      list.add(3);
      expect(list.size()).toBe(3);
    });
  });

  describe("addFirst and addLast", () => {
    it("should add elements at the beginning", () => {
      list.add(2);
      list.add(3);
      list.addFirst(1);
      expect(list.get(0)).toBe(1);
      expect(list.get(1)).toBe(2);
      expect(list.size()).toBe(3);
    });

    it("should add elements at the end", () => {
      list.add(1);
      list.add(2);
      list.addLast(3);
      expect(list.get(2)).toBe(3);
      expect(list.size()).toBe(3);
    });
  });

  describe("getFirst and getLast", () => {
    it("should return first element", () => {
      list.add(1);
      list.add(2);
      expect(list.getFirst()).toBe(1);
    });

    it("should return last element", () => {
      list.add(1);
      list.add(2);
      expect(list.getLast()).toBe(2);
    });

    it("should throw when empty", () => {
      expect(() => list.getFirst()).toThrow("List is empty");
      expect(() => list.getLast()).toThrow("List is empty");
    });
  });

  describe("removeFirst and removeLast", () => {
    beforeEach(() => {
      list.add(1);
      list.add(2);
      list.add(3);
    });

    it("should remove first element", () => {
      const removed = list.removeFirst();
      expect(removed).toBe(1);
      expect(list.size()).toBe(2);
      expect(list.getFirst()).toBe(2);
    });

    it("should remove last element", () => {
      const removed = list.removeLast();
      expect(removed).toBe(3);
      expect(list.size()).toBe(2);
      expect(list.getLast()).toBe(2);
    });

    it("should throw when removing from empty list", () => {
      list.clear();
      expect(() => list.removeFirst()).toThrow("List is empty");
      expect(() => list.removeLast()).toThrow("List is empty");
    });
  });

  describe("reverseIterator", () => {
    it("should iterate in reverse order", () => {
      list.add(1);
      list.add(2);
      list.add(3);

      const iterator = list.reverseIterator();
      expect(iterator.next()).toBe(3);
      expect(iterator.next()).toBe(2);
      expect(iterator.next()).toBe(1);
      expect(iterator.hasNext()).toBe(false);
    });
  });
});

describe("LinkedList - Runtime Type Safety", () => {
  it("should enforce type consistency by default", () => {
    const list = new LinkedList<number>();
    list.add(1);
    expect(() => list.add("text" as any)).toThrow("Type mismatch");
  });

  it("should validate with Zod schema", () => {
    const list = new LinkedList<number>({
      schema: z.number().positive(),
    });
    list.add(5);
    expect(() => list.add(-1)).toThrow("Validation failed");
  });

  it("should validate with custom validator", () => {
    const list = new LinkedList<number>({
      validator: (val) => typeof val === "number" && val > 0,
    });
    list.add(5);
    expect(() => list.add(-1)).toThrow("Type validation failed");
  });

  it("should allow mixed types when strict is false", () => {
    const list = new LinkedList<any>({ strict: false });
    list.add(1);
    list.add("text");
    list.add(true);
    expect(list.size()).toBe(3);
  });

  it("should validate on addFirst", () => {
    const list = new LinkedList<number>();
    list.add(1);
    expect(() => list.addFirst("text" as any)).toThrow("Type mismatch");
  });

  it("should validate on addLast", () => {
    const list = new LinkedList<number>();
    list.add(1);
    expect(() => list.addLast("text" as any)).toThrow("Type mismatch");
  });

  it("should validate on set", () => {
    const list = new LinkedList<number>();
    list.add(1);
    expect(() => list.set(0, "text" as any)).toThrow("Type mismatch");
  });

  it("should reset type inference after clear", () => {
    const list = new LinkedList<any>();
    list.add(1);
    list.clear();
    list.add("text");
    expect(list.get(0)).toBe("text");
  });
});

describe("LinkedList - Performance and Edge Cases", () => {
  it("should handle rapid adds and removes", () => {
    const list = new LinkedList<number>();
    for (let i = 0; i < 100; i++) {
      list.add(i);
    }
    expect(list.size()).toBe(100);

    for (let i = 0; i < 50; i++) {
      list.removeFirst();
    }
    expect(list.size()).toBe(50);
    expect(list.getFirst()).toBe(50);
  });

  it("should optimize random access from nearest end", () => {
    const list = new LinkedList<number>();
    for (let i = 0; i < 100; i++) {
      list.add(i);
    }
    expect(list.get(0)).toBe(0);
    expect(list.get(50)).toBe(50);
    expect(list.get(99)).toBe(99);
  });

  it("should handle single element correctly", () => {
    const list = new LinkedList<number>();
    list.add(42);
    expect(list.getFirst()).toBe(42);
    expect(list.getLast()).toBe(42);
    expect(list.removeFirst()).toBe(42);
    expect(list.isEmpty()).toBe(true);
  });
});
