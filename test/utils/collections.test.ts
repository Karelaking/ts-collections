import { describe, expect, it } from "vitest";
import { disjoint, frequency } from "../../src/utils/collections";

describe("frequency", () => {
	it("counts occurrences in an array", () => {
		expect(frequency([1, 2, 2, 3, 2], 2)).toBe(3);
	});

	it("returns 0 for an empty iterable", () => {
		expect(frequency([], 1)).toBe(0);
	});

	it("returns 0 when the target is absent", () => {
		expect(frequency([1, 2, 3], 9)).toBe(0);
	});

	it("works with strings", () => {
		expect(frequency(["a", "b", "a"], "a")).toBe(2);
	});

	it("matches NaN via SameValueZero", () => {
		expect(frequency([NaN, NaN, 1], NaN)).toBe(2);
	});

	it("accepts any iterable, e.g. a Set", () => {
		expect(frequency(new Set([1, 2, 3]), 2)).toBe(1);
	});
});

describe("disjoint", () => {
	it("returns true when there is no common element", () => {
		expect(disjoint([1, 2], [3, 4])).toBe(true);
	});

	it("returns false when an element is shared", () => {
		expect(disjoint([1, 2], [2, 3])).toBe(false);
	});

	it("returns true when either iterable is empty", () => {
		expect(disjoint([], [1, 2])).toBe(true);
		expect(disjoint([1, 2], [])).toBe(true);
	});

	it("works with Sets", () => {
		expect(disjoint(new Set([1, 2]), new Set([3, 4]))).toBe(true);
		expect(disjoint(new Set([1, 2]), new Set([2]))).toBe(false);
	});
});
