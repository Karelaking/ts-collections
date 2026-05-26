import { beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";
import { HashMap } from "../../src/map/HashMap";
import { describeMap } from "../interfaces/Map";

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

		it("should report contextual validation failures with the original Zod cause", () => {
			const strictMap = new HashMap<string, number>({
				keySchema: z.string().min(1),
				valueSchema: z.number().int(),
			});

			let thrownError: unknown;

			try {
				strictMap.put(123 as unknown as string, "text" as unknown as number);
			} catch (error) {
				thrownError = error;
			}

			expect(thrownError).toBeInstanceOf(TypeError);
			expect((thrownError as Error).message).toContain(
				"HashMap.put() validation failed"
			);
			expect((thrownError as Error).message).toContain(
				"Expected string for key 123, but got number 123"
			);
			expect((thrownError as Error).message).toContain(
				"size before operation: 0"
			);
			const cause = (thrownError as Error & { cause?: unknown }).cause;
			expect(cause).toBeInstanceOf(Error);
			expect((cause as Error).name).toBe("ZodError");
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
		});

		it("should return true for existing keys", () => {
			expect(map.containsKey("a")).toBe(true);
			expect(map.containsKey("b")).toBe(true);
		});

		it("should return false for non-existent keys", () => {
			expect(map.containsKey("z")).toBe(false);
		});
	});

	describe("containsValue method", () => {
		beforeEach(() => {
			map.put("a", 1);
			map.put("b", 2);
		});

		it("should return true for existing values", () => {
			expect(map.containsValue(1)).toBe(true);
			expect(map.containsValue(2)).toBe(true);
		});

		it("should return false for non-existent values", () => {
			expect(map.containsValue(999)).toBe(false);
		});
	});

	describe("remove method", () => {
		beforeEach(() => {
			map.put("a", 1);
			map.put("b", 2);
			map.put("c", 3);
		});

		it("should remove entry and return value", () => {
			const removed = map.remove("b");
			expect(removed).toBe(2);
			expect(map.containsKey("b")).toBe(false);
			expect(map.size()).toBe(2);
		});

		it("should return undefined for non-existent key", () => {
			const removed = map.remove("z");
			expect(removed).toBeUndefined();
			expect(map.size()).toBe(3);
		});
	});

	describe("clear method", () => {
		it("should remove all entries", () => {
			map.put("a", 1);
			map.put("b", 2);
			map.clear();
			expect(map.size()).toBe(0);
			expect(map.isEmpty()).toBe(true);
		});
	});
});
