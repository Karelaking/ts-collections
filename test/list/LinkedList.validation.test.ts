import { describe, expect, it } from "vitest";
import { z } from "zod";
import { LinkedList } from "../../src/list/LinkedList";
import { ValidationError } from "../../src/errors";

describe("LinkedList - Validation (Zod)", () => {
  it("reports contextual validation failures with original Zod cause", () => {
    const strictList = new LinkedList<number>({ schema: z.number().int() });

    let thrownError: unknown;
    try {
      strictList.add("text" as unknown as number);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(Error);
    expect((thrownError as Error).name).toBe("ValidationError");
    const validationError = thrownError as ValidationError;
    expect(validationError.issues).toBeDefined();
    expect(validationError.issues?.length).toBeGreaterThan(0);
    expect(validationError.originalError).toBeInstanceOf(Error);
    expect((validationError.originalError as Error).name).toBe("ZodError");
    expect(validationError.context.collectionType).toBe("LinkedList");
expect(validationError.context.operation).toBe("add");
expect(validationError.received).toBe("text");
  });

  it("type inference resets after clear and strict mode enforces types", () => {
    const list = new LinkedList<unknown>();
    list.add(1);
    let threw = false;
    try {
      list.add("x");
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
    list.clear();
    list.add("hello");
    expect(list.getFirst()).toBe("hello");
  });

  it("strict:false allows mixed types", () => {
    const list = new LinkedList<unknown>({ strict: false });
    list.add(1);
    list.add("two");
    expect(list.toArray()).toEqual([1, "two"]);
  });
});
