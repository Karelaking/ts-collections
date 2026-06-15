import { describe, expect, it } from "vitest";
import { LinkedStack } from "../../src/stack/LinkedStack";

describe("LinkedStack - different data types", () => {
  it("should work with string elements", () => {
    const strStack = new LinkedStack<string>();
    strStack.push("a");
    strStack.push("b");
    expect(strStack.pop()).toBe("b");
    expect(strStack.peek()).toBe("a");
  });

  it("should work with object elements", () => {
    const objStack = new LinkedStack<{ id: number; name: string }>();
    const first = { id: 1, name: "Alice" };
    const second = { id: 2, name: "Bob" };

    objStack.push(first);
    objStack.push(second);

    expect(objStack.peek()).toBe(second);
    expect(objStack.pop()).toBe(second);
    expect(objStack.peek()).toBe(first);
  });
});
