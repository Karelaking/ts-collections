import { describe, it, expect, beforeEach } from "vitest";
import { Vector } from "../../src/list/Vector";
import { describeList } from "../interfaces/List.test";
import { z } from "zod";

/**
 * Test suite for Vector implementation
 * Uses shared List test suite plus Vector-specific async operation tests
 */
describeList(() => new Vector<number>());

describe("Vector - Async Operations", () => {
  let vector: Vector<number>;

  beforeEach(() => {
    vector = new Vector<number>();
    vector.add(1);
    vector.add(2);
    vector.add(3);
  });

  describe("forEach", () => {
    it("should execute callback for each element", async () => {
      const results: number[] = [];
      await vector.forEach(async (element, index) => {
        await new Promise(resolve => setTimeout(resolve, 1));
        results.push(element * 2);
      });
      expect(results).toEqual([2, 4, 6]);
    });

    it("should pass index to callback", async () => {
      const indices: number[] = [];
      await vector.forEach(async (element, index) => {
        indices.push(index);
      });
      expect(indices).toEqual([0, 1, 2]);
    });

    it("should handle empty vector", async () => {
      const emptyVector = new Vector<number>();
      const results: number[] = [];
      await emptyVector.forEach(async (element) => {
        results.push(element);
      });
      expect(results).toEqual([]);
    });
  });

  describe("map", () => {
    it("should map elements using async callback", async () => {
      const result = await vector.map(async (element) => {
        await new Promise(resolve => setTimeout(resolve, 1));
        return element * 2;
      });
      expect(result).toEqual([2, 4, 6]);
    });

    it("should map to different type", async () => {
      const result = await vector.map(async (element) => {
        return `num${element}`;
      });
      expect(result).toEqual(["num1", "num2", "num3"]);
    });

    it("should pass index to callback", async () => {
      const result = await vector.map(async (element, index) => {
        return element + index;
      });
      expect(result).toEqual([1, 3, 5]);
    });

    it("should handle empty vector", async () => {
      const emptyVector = new Vector<number>();
      const result = await emptyVector.map(async (element) => element * 2);
      expect(result).toEqual([]);
    });
  });

  describe("filter", () => {
    it("should filter elements using async predicate", async () => {
      const result = await vector.filter(async (element) => {
        await new Promise(resolve => setTimeout(resolve, 1));
        return element > 1;
      });
      expect(result.size()).toBe(2);
      expect(result.get(0)).toBe(2);
      expect(result.get(1)).toBe(3);
    });

    it("should return empty vector if no matches", async () => {
      const result = await vector.filter(async (element) => {
        return element > 10;
      });
      expect(result.size()).toBe(0);
    });

    it("should pass index to predicate", async () => {
      const result = await vector.filter(async (element, index) => {
        return index > 0;
      });
      expect(result.size()).toBe(2);
      expect(result.toArray()).toEqual([2, 3]);
    });

    it("should handle empty vector", async () => {
      const emptyVector = new Vector<number>();
      const result = await emptyVector.filter(async () => true);
      expect(result.size()).toBe(0);
    });
  });

  describe("some", () => {
    it("should return true if any element matches", async () => {
      const result = await vector.some(async (element) => {
        return element > 2;
      });
      expect(result).toBe(true);
    });

    it("should return false if no elements match", async () => {
      const result = await vector.some(async (element) => {
        return element > 10;
      });
      expect(result).toBe(false);
    });

    it("should short-circuit on first match", async () => {
      let count = 0;
      await vector.some(async (element) => {
        count++;
        return element === 2;
      });
      expect(count).toBe(2); // Should stop after finding 2
    });

    it("should handle empty vector", async () => {
      const emptyVector = new Vector<number>();
      const result = await emptyVector.some(async () => true);
      expect(result).toBe(false); // Empty arrays have no elements to match
    });
  });

  describe("every", () => {
    it("should return true if all elements match", async () => {
      const result = await vector.every(async (element) => {
        return element > 0;
      });
      expect(result).toBe(true);
    });

    it("should return false if any element doesn't match", async () => {
      const result = await vector.every(async (element) => {
        return element > 2;
      });
      expect(result).toBe(false);
    });

    it("should short-circuit on first non-match", async () => {
      let count = 0;
      await vector.every(async (element) => {
        count++;
        return element < 2;
      });
      expect(count).toBe(2); // Should stop after finding 2
    });

    it("should handle empty vector", async () => {
      const emptyVector = new Vector<number>();
      const result = await emptyVector.every(async () => false);
      expect(result).toBe(true); // Empty arrays vacuously satisfy 'every' (no counterexample exists)
    });
  });

  describe("find", () => {
    it("should find matching element", async () => {
      const result = await vector.find(async (element) => {
        return element === 2;
      });
      expect(result).toBe(2);
    });

    it("should return undefined if no match", async () => {
      const result = await vector.find(async (element) => {
        return element > 10;
      });
      expect(result).toBeUndefined();
    });

    it("should return first match", async () => {
      vector.add(2); // Add duplicate
      const result = await vector.find(async (element) => {
        return element === 2;
      });
      expect(result).toBe(2);
    });

    it("should pass index to predicate", async () => {
      const result = await vector.find(async (element, index) => {
        return index === 1;
      });
      expect(result).toBe(2);
    });

    it("should handle empty vector", async () => {
      const emptyVector = new Vector<number>();
      const result = await emptyVector.find(async () => true);
      expect(result).toBeUndefined();
    });
  });

  describe("findIndex", () => {
    it("should find index of matching element", async () => {
      const result = await vector.findIndex(async (element) => {
        return element === 2;
      });
      expect(result).toBe(1);
    });

    it("should return -1 if no match", async () => {
      const result = await vector.findIndex(async (element) => {
        return element > 10;
      });
      expect(result).toBe(-1);
    });

    it("should return first match index", async () => {
      vector.add(2); // Add duplicate
      const result = await vector.findIndex(async (element) => {
        return element === 2;
      });
      expect(result).toBe(1);
    });

    it("should handle empty vector", async () => {
      const emptyVector = new Vector<number>();
      const result = await emptyVector.findIndex(async () => true);
      expect(result).toBe(-1);
    });
  });

  describe("reduce", () => {
    it("should reduce to single value", async () => {
      const result = await vector.reduce(async (acc, element) => {
        await new Promise(resolve => setTimeout(resolve, 1));
        return acc + element;
      }, 0);
      expect(result).toBe(6);
    });

    it("should pass index to callback", async () => {
      const result = await vector.reduce(async (acc, element, index) => {
        return acc + index;
      }, 0);
      expect(result).toBe(3); // 0 + 1 + 2
    });

    it("should work with different accumulator type", async () => {
      const result = await vector.reduce(async (acc, element) => {
        return acc + element.toString();
      }, "");
      expect(result).toBe("123");
    });

    it("should handle empty vector", async () => {
      const emptyVector = new Vector<number>();
      const result = await emptyVector.reduce(async (acc, element) => {
        return acc + element;
      }, 10);
      expect(result).toBe(10);
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

describe("Vector - Integration with async workflows", () => {
  it("should chain multiple async operations", async () => {
    const vector = new Vector<number>();
    vector.add(1);
    vector.add(2);
    vector.add(3);
    vector.add(4);
    vector.add(5);

    // Filter > Map > Reduce chain
    const filtered = await vector.filter(async (x) => x > 2);
    const doubled = await filtered.map(async (x) => x * 2);
    
    expect(doubled).toEqual([6, 8, 10]);
  });

  it("should handle errors in async operations", async () => {
    const vector = new Vector<number>();
    vector.add(1);
    vector.add(2);

    await expect(async () => {
      await vector.forEach(async (element) => {
        if (element === 2) {
          throw new Error("Test error");
        }
      });
    }).rejects.toThrow("Test error");
  });

  it("should work with real async operations", async () => {
    const vector = new Vector<number>();
    vector.add(1);
    vector.add(2);
    vector.add(3);

    const results = await vector.map(async (x) => {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 10));
      return x * 2;
    });

    expect(results).toEqual([2, 4, 6]);
  });
});
