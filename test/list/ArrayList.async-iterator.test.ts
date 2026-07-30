import { beforeEach, describe, expect, it } from "vitest";
import { ArrayList } from "../../src/list/ArrayList";
import { describeAsyncIterator } from "../interfaces/AsyncIterator.test";

// Run the shared AsyncIterator contract tests against ArrayList
describeAsyncIterator((elements) => {
	const list = new ArrayList<unknown>({ strict: false });
	for (const el of elements) {
		list.add(el);
	}
	return list.asyncIterator();
});

describe("ArrayList - Async Iterator", () => {
	let list: ArrayList<number>;

	beforeEach(() => {
		list = new ArrayList<number>();
		list.addAll([1, 2, 3]);
	});

	it("asyncIterator() traverses elements in insertion order", async () => {
		const it = list.asyncIterator();
		const result: number[] = [];
		while (await it.hasNext()) {
			result.push(await it.next());
		}
		expect(result).toEqual([1, 2, 3]);
	});

	it("asyncIterator() rejects on next() when exhausted", async () => {
		const it = list.asyncIterator();
		await it.next();
		await it.next();
		await it.next();
		await expect(it.next()).rejects.toThrow();
	});

	it("Symbol.asyncIterator enables for-await-of loops", async () => {
		const collected: number[] = [];
		for await (const item of list) {
			collected.push(item);
		}
		expect(collected).toEqual([1, 2, 3]);
	});

	it("for-await-of works on an empty list", async () => {
		const empty = new ArrayList<number>();
		const collected: number[] = [];
		for await (const item of empty) {
			collected.push(item);
		}
		expect(collected).toEqual([]);
	});

	it("asyncIterator() on a single-element list resolves correctly", async () => {
		const single = new ArrayList<number>();
		single.add(99);
		const it = single.asyncIterator();
		await expect(it.hasNext()).resolves.toBe(true);
		await expect(it.next()).resolves.toBe(99);
		await expect(it.hasNext()).resolves.toBe(false);
	});

	it("multiple independent async iterators do not share state", async () => {
		const it1 = list.asyncIterator();
		const it2 = list.asyncIterator();
		await expect(it1.next()).resolves.toBe(1);
		// it2 is still at the start
		await expect(it2.next()).resolves.toBe(1);
	});
});
