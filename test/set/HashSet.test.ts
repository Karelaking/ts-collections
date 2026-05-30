import { beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";
import { HashSet } from "../../src/set/HashSet";
import { describeSet } from "../interfaces/Set";

/**
 * Test suite for HashSet implementation
 */
describeSet(() => new HashSet<number>());

describe("HashSet - Core Methods", () => {
	let set: HashSet<number>;

	beforeEach(() => {
		set = new HashSet<number>();
	});

	describe("constructor and size", () => {
		it("should construct an empty set", () => {
			expect(set.size()).toBe(0);
			expect(set.length).toBe(0);
			expect(set.isEmpty()).toBe(true);
		});

		it("should track size after adding elements", () => {
			set.add(1);
			expect(set.size()).toBe(1);
			expect(set.length).toBe(1);
			set.add(2);
			set.add(3);
			expect(set.size()).toBe(3);
			expect(set.length).toBe(3);
		});

		it("should not increase size when adding duplicate", () => {
			set.add(1);
			expect(set.size()).toBe(1);
			expect(set.length).toBe(1);
			set.add(1);
			expect(set.size()).toBe(1);
			expect(set.length).toBe(1);
		});

		it("should reduce size after removal", () => {
			set.add(1);
			set.add(2);
			set.add(3);
			set.remove(2);
			expect(set.size()).toBe(2);
			expect(set.length).toBe(2);
		});
	});

	describe("add method", () => {
		it("should add new element and return true", () => {
			const result = set.add(1);
			expect(result).toBe(true);
			expect(set.size()).toBe(1);
			expect(set.contains(1)).toBe(true);
		});

		it("should return false when adding duplicate", () => {
			set.add(1);
			const result = set.add(1);
			expect(result).toBe(false);
			expect(set.size()).toBe(1);
		});

		it("should add multiple unique elements", () => {
			expect(set.add(1)).toBe(true);
			expect(set.add(2)).toBe(true);
			expect(set.add(3)).toBe(true);
			expect(set.size()).toBe(3);
		});

		it("should report contextual validation failures with the original Zod cause", () => {
			const strictSet = new HashSet<number>({
				schema: z.number().int(),
			});

			let thrownError: unknown;

			try {
				strictSet.add("text" as unknown as number);
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

		it("should maintain uniqueness when adding many duplicates", () => {
			set.add(5);
			set.add(5);
			set.add(5);
			set.add(5);
			expect(set.size()).toBe(1);
		});
	});

	describe("contains method", () => {
		beforeEach(() => {
			set.add(1);
			set.add(2);
			set.add(3);
		});

		it("should return true for contained elements", () => {
			expect(set.contains(1)).toBe(true);
			expect(set.contains(2)).toBe(true);
			expect(set.contains(3)).toBe(true);
		});

		it("should return false for non-existent elements", () => {
			expect(set.contains(999)).toBe(false);
			expect(set.contains(0)).toBe(false);
		});

		it("should work on empty set", () => {
			const emptySet = new HashSet<number>();
			expect(emptySet.contains(1)).toBe(false);
		});
	});

	describe("remove method", () => {
		beforeEach(() => {
			set.add(1);
			set.add(2);
			set.add(3);
		});

		it("should remove element and return true", () => {
			const result = set.remove(2);
			expect(result).toBe(true);
			expect(set.contains(2)).toBe(false);
			expect(set.size()).toBe(2);
		});

		it("should return false when removing non-existent element", () => {
			const result = set.remove(999);
			expect(result).toBe(false);
			expect(set.size()).toBe(3);
		});
	});

	describe("clear method", () => {
		it("should remove all elements", () => {
			set.add(1);
			set.add(2);
			set.clear();
			expect(set.size()).toBe(0);
			expect(set.isEmpty()).toBe(true);
		});
	});
});
