import { describe, expect, it } from "vitest";
import type { AsyncIterator } from "../../src/interfaces/AsyncIterator";

/**
 * Shared test suite for AsyncIterator interface implementations.
 * Import and call this from concrete-collection async iterator tests.
 *
 * @param createAsyncIterator Factory that returns an AsyncIterator over the given elements
 */
export function describeAsyncIterator(
	createAsyncIterator: (elements: unknown[]) => AsyncIterator<unknown>,
): void {
	describe("AsyncIterator Interface", () => {
		it("should resolve hasNext() to true when elements are available", async () => {
			const it = createAsyncIterator([1, 2, 3]);
			await expect(it.hasNext()).resolves.toBe(true);
		});

		it("should resolve hasNext() to false when iteration is exhausted", async () => {
			const it = createAsyncIterator([1]) as AsyncIterator<number>;
			await it.next();
			await expect(it.hasNext()).resolves.toBe(false);
		});

		it("should resolve next() to elements in sequence", async () => {
			const it = createAsyncIterator([10, 20, 30]) as AsyncIterator<number>;
			await expect(it.next()).resolves.toBe(10);
			await expect(it.next()).resolves.toBe(20);
			await expect(it.next()).resolves.toBe(30);
		});

		it("should reject next() when the iterator is exhausted", async () => {
			const it = createAsyncIterator([]) as AsyncIterator<number>;
			await expect(it.next()).rejects.toThrow();
		});

		it("should iterate through all elements in order", async () => {
			const elements = [1, 2, 3];
			const it = createAsyncIterator(elements) as AsyncIterator<number>;
			const result: number[] = [];
			while (await it.hasNext()) {
				result.push(await it.next());
			}
			expect(result).toEqual(elements);
		});

		it("should handle empty collection – hasNext() resolves to false immediately", async () => {
			const it = createAsyncIterator([]);
			await expect(it.hasNext()).resolves.toBe(false);
		});

		it("should handle single element", async () => {
			const it = createAsyncIterator([42]) as AsyncIterator<number>;
			await expect(it.hasNext()).resolves.toBe(true);
			await expect(it.next()).resolves.toBe(42);
			await expect(it.hasNext()).resolves.toBe(false);
		});
	});
}
