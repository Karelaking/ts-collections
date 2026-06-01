import { describe, expect, it } from "vitest";
import { ArrayList } from "../src/list/ArrayList";
import { LinkedList } from "../src/list/LinkedList";
import { HashMap } from "../src/map/HashMap";
import { LinkedQueue } from "../src/queue/LinkedQueue";
import { HashSet } from "../src/set/HashSet";
import { LinkedStack } from "../src/stack/LinkedStack";

describe("Collection edge cases", () => {
	describe("empty collections", () => {
		it("throws when an ArrayList iterator is advanced past the end", () => {
			const iterator = new ArrayList<number>().iterator();

			expect(iterator.hasNext()).toBe(false);
			expect(() => iterator.next()).toThrow("No more elements");
		});

		it("returns undefined when queue and stack removals are attempted", () => {
			const queue = new LinkedQueue<string>();
			const stack = new LinkedStack<string>();

			expect(queue.dequeue()).toBeUndefined();
			expect(queue.peek()).toBeUndefined();
			expect(stack.pop()).toBeUndefined();
			expect(stack.peek()).toBeUndefined();
		});
	});

	describe("single element collections", () => {
		it("empties a LinkedList after removing its only element", () => {
			const list = new LinkedList<number>();
			list.add(42);

			expect(list.removeFirst()).toBe(42);
			expect(list.isEmpty()).toBe(true);
			expect(list.size()).toBe(0);
			expect(() => list.removeFirst()).toThrow("List is empty");
		});

		it("empties a HashSet after removing its only value", () => {
			const set = new HashSet<string>();
			set.add("only");

			expect(set.remove("only")).toBe(true);
			expect(set.isEmpty()).toBe(true);
			expect(set.contains("only")).toBe(false);
			expect(set.remove("only")).toBe(false);
		});
	});

	describe("boundary values", () => {
		it("preserves numeric and string boundary values in ArrayList", () => {
			const numbers = new ArrayList<number>();
			numbers.add(Number.MAX_SAFE_INTEGER);
			numbers.add(Number.MIN_SAFE_INTEGER);

			const strings = new ArrayList<string>();
			const longString = "x".repeat(10_000);
			strings.add("");
			strings.add(longString);

			expect(numbers.toArray()).toEqual([
				Number.MAX_SAFE_INTEGER,
				Number.MIN_SAFE_INTEGER,
			]);
			expect(strings.get(0)).toBe("");
			expect(strings.get(1)).toHaveLength(10_000);
		});

		it("treats object keys by reference in HashMap", () => {
			const firstKey = { id: 1 };
			const secondKey = { id: 1 };
			const map = new HashMap<object, string>();

			map.put(firstKey, "first");
			map.put(secondKey, "second");

			expect(map.size()).toBe(2);
			expect(map.get(firstKey)).toBe("first");
			expect(map.get(secondKey)).toBe("second");
		});
	});

	describe("iterator snapshots", () => {
		it("continues a HashSet iterator over the captured values after mutation", () => {
			const set = new HashSet<number>();
			set.add(1);
			set.add(2);
			const iterator = set.iterator();

			set.add(3);

			expect(iterator.next()).toBe(1);
			expect(iterator.next()).toBe(2);
			expect(iterator.hasNext()).toBe(false);
			expect(set.contains(3)).toBe(true);
		});
	});
});
