import { beforeEach, describe, expect, it } from "vitest";
import { LinkedList } from "../../src/list/LinkedList";

describe("LinkedList - Async Iterator", () => {
	let list: LinkedList<string>;

	beforeEach(() => {
		list = new LinkedList<string>();
		list.addAll(["x", "y", "z"]);
	});

	it("asyncIterator() traverses elements in insertion order", async () => {
		const it = list.asyncIterator();
		const result: string[] = [];
		while (await it.hasNext()) {
			result.push(await it.next());
		}
		expect(result).toEqual(["x", "y", "z"]);
	});

	it("Symbol.asyncIterator enables for-await-of loops", async () => {
		const collected: string[] = [];
		for await (const item of list) {
			collected.push(item);
		}
		expect(collected).toEqual(["x", "y", "z"]);
	});

	it("for-await-of works on an empty LinkedList", async () => {
		const empty = new LinkedList<string>();
		const collected: string[] = [];
		for await (const item of empty) {
			collected.push(item);
		}
		expect(collected).toEqual([]);
	});

	it("asyncIterator() rejects on next() when exhausted", async () => {
		const it = list.asyncIterator();
		await it.next();
		await it.next();
		await it.next();
		await expect(it.next()).rejects.toThrow();
	});
});
