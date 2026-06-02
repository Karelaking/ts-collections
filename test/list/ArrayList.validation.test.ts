import { describe, expect, it } from "vitest";
import { z } from "zod";
import { ArrayList } from "../../src/list/ArrayList";

describe("ArrayList - Validation (Zod)", () => {
  it("reports contextual validation failures with original Zod cause", () => {
    const strictList = new ArrayList<number>({ schema: z.number().int() });

    let thrownError: unknown;
    try {
      strictList.add("text" as unknown as number);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(Error);
    expect((thrownError as Error).name).toBe("ValidationError");
    const validationError = thrownError as Error & {
      issues?: unknown[];
      originalError?: unknown;
    };
    expect(validationError.issues).toBeDefined();
    expect(validationError.issues?.length).toBeGreaterThan(0);
    expect(validationError.originalError).toBeInstanceOf(Error);
    expect((validationError.originalError as Error).name).toBe("ZodError");
  });

  it("type inference resets after clear and strict mode enforces types", () => {
    const list = new ArrayList<unknown>();
    list.add(1);
    let threw = false;
    try {
      // adding a different runtime type should throw under strict mode
      // (TypeScript accepts unknown at compile-time)
      list.add("x");
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
    list.clear();
    // after clear, new first element determines type; should succeed
    list.add("hello");
    expect(list.getFirst()).toBe("hello");
  });

  it("strict:false allows mixed types", () => {
    const list = new ArrayList<unknown>({ strict: false });
    list.add(1);
    // should not throw
    list.add("two");
    expect(list.toArray()).toEqual([1, "two"]);
  });
});
