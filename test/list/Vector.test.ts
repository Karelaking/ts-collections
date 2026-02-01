import { describe, it, expect } from "vitest";
import { Vector } from "../../src/list/Vector";
import { describeList } from "../interfaces/List.test";
import { z } from "zod";

/**
 * Test suite for Vector implementation
 * Uses shared List test suite to ensure Vector behaves like other List implementations
 */
describeList(() => new Vector<number>());

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
