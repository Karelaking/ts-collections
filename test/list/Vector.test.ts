import { describe, it, expect, beforeEach } from "vitest";
import { Vector } from "../../src/list/Vector";
import { describeList } from "../interfaces/List.test";
import { z } from "zod";

/**
 * Test suite for Vector implementation
 * Uses shared List test suite plus Vector-specific tests
 */
describeList(() => new Vector<number>());

describe("Vector - Constructor and Capacity", () => {
  it("should create empty vector with default capacity", () => {
    const vector = new Vector<number>();
    expect(vector.size()).toBe(0);
    expect(vector.capacity()).toBe(10);
    expect(vector.isEmpty()).toBe(true);
  });

  it("should create vector with custom initial capacity", () => {
    const vector = new Vector<string>({ initialCapacity: 20 });
    expect(vector.size()).toBe(0);
    expect(vector.capacity()).toBe(20);
  });

  it("should create vector with capacity increment", () => {
    const vector = new Vector<number>({ initialCapacity: 5, capacityIncrement: 3 });
    expect(vector.capacity()).toBe(5);
    
    // Add 6 elements to trigger growth
    for (let i = 0; i < 6; i++) {
      vector.add(i);
    }
    expect(vector.capacity()).toBe(8); // 5 + 3
  });

  it("should double capacity when capacityIncrement is 0", () => {
    const vector = new Vector<number>({ initialCapacity: 4, capacityIncrement: 0 });
    expect(vector.capacity()).toBe(4);
    
    // Add 5 elements to trigger growth
    for (let i = 0; i < 5; i++) {
      vector.add(i);
    }
    expect(vector.capacity()).toBe(8); // doubled
  });

  it("should throw error for negative initial capacity", () => {
    expect(() => new Vector<number>({ initialCapacity: -1 }))
      .toThrow("Illegal Capacity: -1");
  });
});

describe("Vector - Core Methods", () => {
  let vector: Vector<number>;

  beforeEach(() => {
    vector = new Vector<number>();
  });

  describe("add and addElement", () => {
    it("should add elements to vector", () => {
      expect(vector.add(1)).toBe(true);
      expect(vector.add(2)).toBe(true);
      expect(vector.add(3)).toBe(true);
      expect(vector.size()).toBe(3);
    });

    it("should add element using addElement", () => {
      vector.addElement(10);
      vector.addElement(20);
      expect(vector.size()).toBe(2);
      expect(vector.get(0)).toBe(10);
      expect(vector.get(1)).toBe(20);
    });

    it("should grow capacity when needed", () => {
      const smallVector = new Vector<number>({ initialCapacity: 2 });
      smallVector.add(1);
      smallVector.add(2);
      expect(smallVector.capacity()).toBe(2);
      
      smallVector.add(3);
      expect(smallVector.capacity()).toBe(4); // doubled
      expect(smallVector.size()).toBe(3);
    });
  });

  describe("get and elementAt", () => {
    beforeEach(() => {
      vector.add(10);
      vector.add(20);
      vector.add(30);
    });

    it("should get element at index", () => {
      expect(vector.get(0)).toBe(10);
      expect(vector.get(1)).toBe(20);
      expect(vector.get(2)).toBe(30);
    });

    it("should get element using elementAt", () => {
      expect(vector.elementAt(0)).toBe(10);
      expect(vector.elementAt(1)).toBe(20);
      expect(vector.elementAt(2)).toBe(30);
    });

    it("should throw error for invalid index", () => {
      expect(() => vector.get(-1)).toThrow("Index out of bounds: -1");
      expect(() => vector.get(3)).toThrow("Index out of bounds: 3");
      expect(() => vector.elementAt(5)).toThrow("Index out of bounds: 5");
    });
  });

  describe("firstElement and lastElement", () => {
    it("should return first element", () => {
      vector.add(1);
      vector.add(2);
      vector.add(3);
      expect(vector.firstElement()).toBe(1);
    });

    it("should return last element", () => {
      vector.add(1);
      vector.add(2);
      vector.add(3);
      expect(vector.lastElement()).toBe(3);
    });

    it("should throw error when vector is empty", () => {
      expect(() => vector.firstElement()).toThrow("Vector is empty");
      expect(() => vector.lastElement()).toThrow("Vector is empty");
    });

    it("should update after modifications", () => {
      vector.add(1);
      vector.add(2);
      vector.add(3);
      expect(vector.lastElement()).toBe(3);
      
      vector.add(4);
      expect(vector.lastElement()).toBe(4);
      
      vector.removeAt(3);
      expect(vector.lastElement()).toBe(3);
    });
  });

  describe("set and setElementAt", () => {
    beforeEach(() => {
      vector.add(1);
      vector.add(2);
      vector.add(3);
    });

    it("should set element at index", () => {
      const old = vector.set(1, 20);
      expect(old).toBe(2);
      expect(vector.get(1)).toBe(20);
    });

    it("should set element using setElementAt", () => {
      vector.setElementAt(30, 2);
      expect(vector.get(2)).toBe(30);
    });

    it("should throw error for invalid index", () => {
      expect(() => vector.set(-1, 5)).toThrow("Index out of bounds");
      expect(() => vector.set(3, 5)).toThrow("Index out of bounds");
    });
  });

  describe("addAt and insertElementAt", () => {
    beforeEach(() => {
      vector.add(1);
      vector.add(2);
      vector.add(3);
    });

    it("should insert element at beginning", () => {
      vector.addAt(0, 0);
      expect(vector.size()).toBe(4);
      expect(vector.get(0)).toBe(0);
      expect(vector.get(1)).toBe(1);
    });

    it("should insert element in middle", () => {
      vector.addAt(1, 15);
      expect(vector.size()).toBe(4);
      expect(vector.get(1)).toBe(15);
      expect(vector.get(2)).toBe(2);
    });

    it("should insert element at end", () => {
      vector.addAt(3, 4);
      expect(vector.size()).toBe(4);
      expect(vector.get(3)).toBe(4);
    });

    it("should insert using insertElementAt", () => {
      vector.insertElementAt(25, 2);
      expect(vector.get(2)).toBe(25);
      expect(vector.get(3)).toBe(3);
    });

    it("should throw error for invalid index", () => {
      expect(() => vector.addAt(-1, 5)).toThrow("Index out of bounds");
      expect(() => vector.addAt(4, 5)).toThrow("Index out of bounds");
    });
  });

  describe("removeAt and removeElementAt", () => {
    beforeEach(() => {
      vector.add(10);
      vector.add(20);
      vector.add(30);
      vector.add(40);
    });

    it("should remove element at index", () => {
      const removed = vector.removeAt(1);
      expect(removed).toBe(20);
      expect(vector.size()).toBe(3);
      expect(vector.get(1)).toBe(30);
    });

    it("should remove first element", () => {
      const removed = vector.removeAt(0);
      expect(removed).toBe(10);
      expect(vector.get(0)).toBe(20);
    });

    it("should remove last element", () => {
      const removed = vector.removeAt(3);
      expect(removed).toBe(40);
      expect(vector.size()).toBe(3);
    });

    it("should remove using removeElementAt", () => {
      vector.removeElementAt(2);
      expect(vector.size()).toBe(3);
      expect(vector.get(2)).toBe(40);
    });

    it("should throw error for invalid index", () => {
      expect(() => vector.removeAt(-1)).toThrow("Index out of bounds");
      expect(() => vector.removeAt(4)).toThrow("Index out of bounds");
    });
  });

  describe("removeElement", () => {
    beforeEach(() => {
      vector.add(10);
      vector.add(20);
      vector.add(30);
      vector.add(20);
    });

    it("should remove first occurrence of element", () => {
      const result = vector.removeElement(20);
      expect(result).toBe(true);
      expect(vector.size()).toBe(3);
      expect(vector.get(1)).toBe(30);
      expect(vector.get(2)).toBe(20); // second 20 still there
    });

    it("should return false if element not found", () => {
      const result = vector.removeElement(100);
      expect(result).toBe(false);
      expect(vector.size()).toBe(4);
    });
  });

  describe("clear and removeAllElements", () => {
    beforeEach(() => {
      vector.add(1);
      vector.add(2);
      vector.add(3);
    });

    it("should clear all elements", () => {
      vector.clear();
      expect(vector.size()).toBe(0);
      expect(vector.isEmpty()).toBe(true);
    });

    it("should clear using removeAllElements", () => {
      vector.removeAllElements();
      expect(vector.size()).toBe(0);
      expect(vector.isEmpty()).toBe(true);
    });

    it("should allow adding after clear", () => {
      vector.clear();
      vector.add(10);
      expect(vector.size()).toBe(1);
      expect(vector.get(0)).toBe(10);
    });
  });

  describe("indexOf and lastIndexOf", () => {
    beforeEach(() => {
      vector.add(10);
      vector.add(20);
      vector.add(30);
      vector.add(20);
      vector.add(40);
    });

    it("should find index of first occurrence", () => {
      expect(vector.indexOf(20)).toBe(1);
      expect(vector.indexOf(10)).toBe(0);
      expect(vector.indexOf(40)).toBe(4);
    });

    it("should find index of last occurrence", () => {
      expect(vector.lastIndexOf(20)).toBe(3);
      expect(vector.lastIndexOf(10)).toBe(0);
      expect(vector.lastIndexOf(40)).toBe(4);
    });

    it("should return -1 if element not found", () => {
      expect(vector.indexOf(100)).toBe(-1);
      expect(vector.lastIndexOf(200)).toBe(-1);
    });
  });

  describe("contains", () => {
    beforeEach(() => {
      vector.add(1);
      vector.add(2);
      vector.add(3);
    });

    it("should return true for existing elements", () => {
      expect(vector.contains(1)).toBe(true);
      expect(vector.contains(2)).toBe(true);
      expect(vector.contains(3)).toBe(true);
    });

    it("should return false for non-existing elements", () => {
      expect(vector.contains(0)).toBe(false);
      expect(vector.contains(4)).toBe(false);
    });
  });

  describe("subList", () => {
    beforeEach(() => {
      for (let i = 0; i < 10; i++) {
        vector.add(i);
      }
    });

    it("should return sublist", () => {
      const sub = vector.subList(2, 5);
      expect(sub.size()).toBe(3);
      expect(sub.get(0)).toBe(2);
      expect(sub.get(1)).toBe(3);
      expect(sub.get(2)).toBe(4);
    });

    it("should return empty sublist", () => {
      const sub = vector.subList(3, 3);
      expect(sub.size()).toBe(0);
    });

    it("should throw error for invalid range", () => {
      expect(() => vector.subList(-1, 5)).toThrow("Invalid index range");
      expect(() => vector.subList(5, 3)).toThrow("Invalid index range");
      expect(() => vector.subList(0, 11)).toThrow("Invalid index range");
    });
  });

  describe("toArray", () => {
    it("should convert to array", () => {
      vector.add(1);
      vector.add(2);
      vector.add(3);
      const arr = vector.toArray();
      expect(arr).toEqual([1, 2, 3]);
    });

    it("should return empty array for empty vector", () => {
      expect(vector.toArray()).toEqual([]);
    });
  });

  describe("iterator", () => {
    beforeEach(() => {
      vector.add(1);
      vector.add(2);
      vector.add(3);
    });

    it("should iterate through elements", () => {
      const iter = vector.iterator();
      expect(iter.hasNext()).toBe(true);
      expect(iter.next()).toBe(1);
      expect(iter.hasNext()).toBe(true);
      expect(iter.next()).toBe(2);
      expect(iter.hasNext()).toBe(true);
      expect(iter.next()).toBe(3);
      expect(iter.hasNext()).toBe(false);
    });

    it("should throw error when no more elements", () => {
      const iter = vector.iterator();
      iter.next();
      iter.next();
      iter.next();
      expect(() => iter.next()).toThrow("No more elements");
    });
  });
});

describe("Vector - Capacity Management", () => {
  let vector: Vector<number>;

  beforeEach(() => {
    vector = new Vector<number>({ initialCapacity: 5 });
  });

  describe("capacity", () => {
    it("should return current capacity", () => {
      expect(vector.capacity()).toBe(5);
    });

    it("should increase after growth", () => {
      for (let i = 0; i < 6; i++) {
        vector.add(i);
      }
      expect(vector.capacity()).toBeGreaterThan(5);
    });
  });

  describe("ensureCapacity", () => {
    it("should increase capacity if needed", () => {
      vector.ensureCapacity(20);
      expect(vector.capacity()).toBeGreaterThanOrEqual(20);
      expect(vector.size()).toBe(0); // size unchanged
    });

    it("should not decrease capacity", () => {
      vector.ensureCapacity(3);
      expect(vector.capacity()).toBe(5);
    });

    it("should handle current capacity", () => {
      vector.ensureCapacity(5);
      expect(vector.capacity()).toBe(5);
    });
  });

  describe("trimToSize", () => {
    it("should trim capacity to size", () => {
      vector.add(1);
      vector.add(2);
      vector.add(3);
      expect(vector.size()).toBe(3);
      expect(vector.capacity()).toBe(5);
      
      vector.trimToSize();
      expect(vector.capacity()).toBe(3);
      expect(vector.size()).toBe(3);
    });

    it("should work on empty vector", () => {
      vector.trimToSize();
      expect(vector.capacity()).toBe(0);
      expect(vector.size()).toBe(0);
    });

    it("should maintain elements after trim", () => {
      vector.add(10);
      vector.add(20);
      vector.trimToSize();
      expect(vector.get(0)).toBe(10);
      expect(vector.get(1)).toBe(20);
    });
  });

  describe("setSize", () => {
    beforeEach(() => {
      vector.add(1);
      vector.add(2);
      vector.add(3);
    });

    it("should increase size", () => {
      vector.setSize(5);
      expect(vector.size()).toBe(5);
    });

    it("should decrease size", () => {
      vector.setSize(1);
      expect(vector.size()).toBe(1);
      expect(vector.get(0)).toBe(1);
    });

    it("should throw error for negative size", () => {
      expect(() => vector.setSize(-1)).toThrow("Illegal size: -1");
    });

    it("should maintain existing elements when increasing", () => {
      vector.setSize(5);
      expect(vector.get(0)).toBe(1);
      expect(vector.get(1)).toBe(2);
      expect(vector.get(2)).toBe(3);
    });
  });
});

describe("Vector - Async Operations", () => {
  let vector: Vector<number>;

  beforeEach(() => {
    vector = new Vector<number>();
    vector.add(1);
    vector.add(2);
    vector.add(3);
  });

  describe("addAsync", () => {
    it("should add element from promise", async () => {
      const result = await vector.addAsync(Promise.resolve(4));
      expect(result).toBe(true);
      expect(vector.size()).toBe(4);
      expect(vector.get(3)).toBe(4);
    });

    it("should handle async computation", async () => {
      const asyncCompute = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 100;
      };
      await vector.addAsync(asyncCompute());
      expect(vector.lastElement()).toBe(100);
    });
  });

  describe("removeAsync", () => {
    it("should remove element from promise", async () => {
      const result = await vector.removeAsync(Promise.resolve(2));
      expect(result).toBe(true);
      expect(vector.size()).toBe(2);
      expect(vector.contains(2)).toBe(false);
    });

    it("should return false if element not found", async () => {
      const result = await vector.removeAsync(Promise.resolve(100));
      expect(result).toBe(false);
      expect(vector.size()).toBe(3);
    });
  });

  describe("forEachAsync", () => {
    it("should execute callback for each element", async () => {
      const results: number[] = [];
      await vector.forEachAsync(async (element, index) => {
        await new Promise(resolve => setTimeout(resolve, 1));
        results.push(element * 2);
      });
      expect(results).toEqual([2, 4, 6]);
    });

    it("should pass index to callback", async () => {
      const indices: number[] = [];
      await vector.forEachAsync(async (element, index) => {
        indices.push(index);
      });
      expect(indices).toEqual([0, 1, 2]);
    });
  });

  describe("mapAsync", () => {
    it("should map elements using async callback", async () => {
      const result = await vector.mapAsync(async (element) => {
        await new Promise(resolve => setTimeout(resolve, 1));
        return element * 2;
      });
      expect(result).toEqual([2, 4, 6]);
    });

    it("should map to different type", async () => {
      const result = await vector.mapAsync(async (element) => {
        return `num${element}`;
      });
      expect(result).toEqual(["num1", "num2", "num3"]);
    });

    it("should pass index to callback", async () => {
      const result = await vector.mapAsync(async (element, index) => {
        return element + index;
      });
      expect(result).toEqual([1, 3, 5]);
    });
  });

  describe("filterAsync", () => {
    it("should filter elements using async predicate", async () => {
      const result = await vector.filterAsync(async (element) => {
        await new Promise(resolve => setTimeout(resolve, 1));
        return element > 1;
      });
      expect(result.size()).toBe(2);
      expect(result.get(0)).toBe(2);
      expect(result.get(1)).toBe(3);
    });

    it("should return empty vector if no matches", async () => {
      const result = await vector.filterAsync(async (element) => {
        return element > 10;
      });
      expect(result.size()).toBe(0);
    });

    it("should pass index to predicate", async () => {
      const result = await vector.filterAsync(async (element, index) => {
        return index > 0;
      });
      expect(result.size()).toBe(2);
    });
  });

  describe("someAsync", () => {
    it("should return true if any element matches", async () => {
      const result = await vector.someAsync(async (element) => {
        return element > 2;
      });
      expect(result).toBe(true);
    });

    it("should return false if no elements match", async () => {
      const result = await vector.someAsync(async (element) => {
        return element > 10;
      });
      expect(result).toBe(false);
    });

    it("should short-circuit on first match", async () => {
      let count = 0;
      await vector.someAsync(async (element) => {
        count++;
        return element === 2;
      });
      expect(count).toBe(2); // Should stop after finding 2
    });
  });

  describe("everyAsync", () => {
    it("should return true if all elements match", async () => {
      const result = await vector.everyAsync(async (element) => {
        return element > 0;
      });
      expect(result).toBe(true);
    });

    it("should return false if any element doesn't match", async () => {
      const result = await vector.everyAsync(async (element) => {
        return element > 2;
      });
      expect(result).toBe(false);
    });

    it("should short-circuit on first non-match", async () => {
      let count = 0;
      await vector.everyAsync(async (element) => {
        count++;
        return element < 2;
      });
      expect(count).toBe(2); // Should stop after finding 2
    });
  });

  describe("findAsync", () => {
    it("should find matching element", async () => {
      const result = await vector.findAsync(async (element) => {
        return element === 2;
      });
      expect(result).toBe(2);
    });

    it("should return undefined if no match", async () => {
      const result = await vector.findAsync(async (element) => {
        return element > 10;
      });
      expect(result).toBeUndefined();
    });

    it("should return first match", async () => {
      vector.add(2); // Add duplicate
      const result = await vector.findAsync(async (element) => {
        return element === 2;
      });
      expect(result).toBe(2);
    });

    it("should pass index to predicate", async () => {
      const result = await vector.findAsync(async (element, index) => {
        return index === 1;
      });
      expect(result).toBe(2);
    });
  });
});

describe("Vector - Type Validation", () => {
  it("should validate types by default", () => {
    const vector = new Vector<number>();
    vector.add(1);
    vector.add(2);
    expect(() => vector.add("string" as any)).toThrow("Type mismatch");
  });

  it("should allow disabling validation", () => {
    const vector = new Vector<number>({ strict: false });
    vector.add(1);
    vector.add("string" as any);
    expect(vector.size()).toBe(2);
  });

  it("should work with Zod schema", () => {
    const vector = new Vector<number>({
      schema: z.number().positive()
    });
    vector.add(5);
    expect(() => vector.add(-1 as any)).toThrow("Validation failed");
  });

  it("should work with custom validator", () => {
    const vector = new Vector<number>({
      validator: (val) => typeof val === "number" && val > 0
    });
    vector.add(5);
    expect(() => vector.add(-1 as any)).toThrow("Type validation failed");
  });

  it("should reset type inference after clear", () => {
    const vector = new Vector<any>();
    vector.add(1);
    expect(() => vector.add("string")).toThrow("Type mismatch");
    
    vector.clear();
    vector.add("string"); // Should work now
    expect(vector.get(0)).toBe("string");
  });
});

describe("Vector - Edge Cases", () => {
  it("should handle large datasets", () => {
    const vector = new Vector<number>({ initialCapacity: 10 });
    const count = 1000;
    
    for (let i = 0; i < count; i++) {
      vector.add(i);
    }
    
    expect(vector.size()).toBe(count);
    expect(vector.get(0)).toBe(0);
    expect(vector.get(count - 1)).toBe(count - 1);
  });

  it("should handle single element operations", () => {
    const vector = new Vector<number>();
    vector.add(42);
    
    expect(vector.size()).toBe(1);
    expect(vector.firstElement()).toBe(42);
    expect(vector.lastElement()).toBe(42);
    expect(vector.get(0)).toBe(42);
    
    vector.removeAt(0);
    expect(vector.size()).toBe(0);
    expect(vector.isEmpty()).toBe(true);
  });

  it("should handle alternating add/remove", () => {
    const vector = new Vector<number>();
    
    for (let i = 0; i < 10; i++) {
      vector.add(i);
      if (i % 2 === 0 && vector.size() > 1) {
        vector.removeAt(0);
      }
    }
    
    expect(vector.size()).toBeGreaterThan(0);
  });

  it("should maintain integrity after multiple operations", () => {
    const vector = new Vector<number>();
    vector.add(1);
    vector.add(2);
    vector.add(3);
    vector.addAt(1, 15);
    vector.removeAt(2);
    vector.set(0, 10);
    
    expect(vector.size()).toBe(3);
    expect(vector.toArray()).toEqual([10, 15, 3]);
  });
});

describe("Vector - String Type", () => {
  let vector: Vector<string>;

  beforeEach(() => {
    vector = new Vector<string>();
  });

  it("should work with string elements", () => {
    vector.add("hello");
    vector.add("world");
    expect(vector.size()).toBe(2);
    expect(vector.get(0)).toBe("hello");
    expect(vector.get(1)).toBe("world");
  });

  it("should maintain string type safety", () => {
    vector.add("first");
    expect(() => vector.add(123 as any)).toThrow("Type mismatch");
  });
});

describe("Vector - Object Type", () => {
  interface TestObject {
    id: number;
    name: string;
  }

  let vector: Vector<TestObject>;

  beforeEach(() => {
    vector = new Vector<TestObject>();
  });

  it("should work with object elements", () => {
    const obj1 = { id: 1, name: "first" };
    const obj2 = { id: 2, name: "second" };
    
    vector.add(obj1);
    vector.add(obj2);
    
    expect(vector.size()).toBe(2);
    expect(vector.get(0)).toBe(obj1);
    expect(vector.get(1)).toBe(obj2);
  });

  it("should handle object references correctly", () => {
    const obj = { id: 1, name: "test" };
    vector.add(obj);
    
    const retrieved = vector.get(0);
    expect(retrieved).toBe(obj);
    
    retrieved.name = "modified";
    expect(vector.get(0).name).toBe("modified");
  });
});
