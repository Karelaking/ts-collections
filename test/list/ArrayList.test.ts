import { beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";
import { ArrayList } from "../../src/list/ArrayList";
import { describeList } from "../interfaces/List";

/**
 * Test suite for ArrayList implementation
 */
describeList(() => new ArrayList<number>());

describe("ArrayList - Core Methods", () => {
	let list: ArrayList<number>;

	beforeEach(() => {
		list = new ArrayList<number>();
	});

	describe("constructor and size", () => {
		it("should construct an empty list", () => {
			expect(list.size()).toBe(0);
			expect(list.length).toBe(0);
		});

		it("should track size after adding elements", () => {
			list.add(1);
			expect(list.size()).toBe(1);
			expect(list.length).toBe(1);
			list.add(2);
			list.add(3);
			expect(list.size()).toBe(3);
			expect(list.length).toBe(3);
		});

		it("should reduce size after removal", () => {
			list.add(1);
			list.add(2);
			list.add(3);
			list.removeAt(1);
			expect(list.size()).toBe(2);
			expect(list.length).toBe(2);
		});
	});

	describe("add method", () => {
		it("should add single element", () => {
			const result = list.add(10);
			expect(result).toBe(true);
			expect(list.size()).toBe(1);
			expect(list.get(0)).toBe(10);
		});

		it("should add multiple elements in order", () => {
			list.add(1);
			list.add(2);
			list.add(3);
			expect(list.get(0)).toBe(1);
			expect(list.get(1)).toBe(2);
			expect(list.get(2)).toBe(3);
		});

		it("should allow duplicate elements", () => {
			list.add(5);
			list.add(5);
			list.add(5);
			expect(list.size()).toBe(3);
			expect(list.get(0)).toBe(5);
			expect(list.get(1)).toBe(5);
			expect(list.get(2)).toBe(5);
		});

		it("should always return true", () => {
			expect(list.add(1)).toBe(true);
			expect(list.add(2)).toBe(true);
			expect(list.add(3)).toBe(true);
		});

		it("should report contextual validation failures with the original Zod cause", () => {
			const strictList = new ArrayList<number>({
				schema: z.number().int(),
			});

			let thrownError: unknown;

			try {
				strictList.add("text" as unknown as number);
			} catch (error) {
				thrownError = error;
			}

			// Should throw ValidationError (extends BaseCollectionError)
			expect(thrownError).toBeInstanceOf(Error);
			expect((thrownError as Error).name).toBe("ValidationError");
			const { issues, originalError } = thrownError as any;
			expect(issues).toBeDefined();
			expect(issues.length).toBeGreaterThan(0);
			expect(originalError).toBeInstanceOf(Error);
			expect((originalError as Error).name).toBe("ZodError");
		});
	});

	describe("get method", () => {
		beforeEach(() => {
			list.add(10);
			list.add(20);
			list.add(30);
		});

		it("should retrieve element at valid index", () => {
			expect(list.get(0)).toBe(10);
			expect(list.get(1)).toBe(20);
			expect(list.get(2)).toBe(30);
		});

		it("should throw error for negative index", () => {
			expect(() => list.get(-1)).toThrow("Index out of bounds: -1");
		});

		it("should throw error for out of bounds index", () => {
			expect(() => list.get(3)).toThrow();
			expect(() => list.get(100)).toThrow();
		});

		it("should work with different types", () => {
			const stringList = new ArrayList<string>();
			stringList.add("a");
			stringList.add("b");
			stringList.add("c");
			expect(stringList.get(1)).toBe("b");
		});
	});

	describe("set method", () => {
		beforeEach(() => {
			list.add(10);
			list.add(20);
			list.add(30);
		});

		it("should replace element and return old value", () => {
			const oldValue = list.set(1, 25);
			expect(oldValue).toBe(20);
			expect(list.get(1)).toBe(25);
		});

		it("should set element at first position", () => {
			list.set(0, 5);
			expect(list.get(0)).toBe(5);
			expect(list.size()).toBe(3);
		});

		it("should set element at last position", () => {
			list.set(2, 35);
			expect(list.get(2)).toBe(35);
			expect(list.size()).toBe(3);
		});

		it("should throw error for out of bounds index", () => {
			expect(() => list.set(3, 40)).toThrow();
			expect(() => list.set(-1, 5)).toThrow();
		});
	});

	describe("removeAt method", () => {
		beforeEach(() => {
			list.add(10);
			list.add(20);
			list.add(30);
		});

		it("should remove element and return it", () => {
			const removed = list.removeAt(1);
			expect(removed).toBe(20);
			expect(list.size()).toBe(2);
			expect(list.get(1)).toBe(30);
		});

		it("should remove first element", () => {
			const removed = list.removeAt(0);
			expect(removed).toBe(10);
			expect(list.get(0)).toBe(20);
		});

		it("should remove last element", () => {
			const removed = list.removeAt(2);
			expect(removed).toBe(30);
			expect(list.size()).toBe(2);
		});

		it("should throw for out of bounds", () => {
			expect(() => list.removeAt(3)).toThrow();
			expect(() => list.removeAt(-1)).toThrow();
		});
	});

	describe("indexOf and lastIndexOf", () => {
		beforeEach(() => {
			list.add(10);
			list.add(20);
			list.add(10);
			list.add(30);
		});

		it("should find first occurrence", () => {
			expect(list.indexOf(10)).toBe(0);
			expect(list.indexOf(20)).toBe(1);
			expect(list.indexOf(30)).toBe(3);
		});

		it("should find last occurrence", () => {
			expect(list.lastIndexOf(10)).toBe(2);
			expect(list.lastIndexOf(20)).toBe(1);
		});

		it("should return -1 for not found", () => {
			expect(list.indexOf(999)).toBe(-1);
			expect(list.lastIndexOf(999)).toBe(-1);
		});
	});

	describe("clear method", () => {
		it("should remove all elements", () => {
			list.add(1);
			list.add(2);
			list.add(3);
			list.clear();
			expect(list.size()).toBe(0);
			expect(list.isEmpty()).toBe(true);
		});
	});
});
