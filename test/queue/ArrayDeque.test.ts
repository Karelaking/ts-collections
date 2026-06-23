import { describe, expect, it, beforeEach } from "vitest";
import { ArrayDeque } from "../../src/queue/ArrayDeque";
import { CollectionEmptyError, ValidationError } from "../../src/errors";
import { z } from "zod";

describe("ArrayDeque", () => {
	let deque: ArrayDeque<number>;

	beforeEach(() => {
		deque = new ArrayDeque<number>({ strict: false });
	});

	describe("Initialization", () => {
		it("should initialize empty", () => {
			expect(deque.isEmpty()).toBe(true);
			expect(deque.size()).toBe(0);
		});

		it("should initialize with type validation when strict is true", () => {
			const validatedDeque = new ArrayDeque<number>({
				strict: true,
				schema: z.number(),
			});
			validatedDeque.addFirst(1);
			expect(() => validatedDeque.addFirst("2" as any)).toThrow(ValidationError);
		});
	});

	describe("Adding elements", () => {
		it("should add elements to the front", () => {
			deque.addFirst(1);
			deque.addFirst(2);
			expect(deque.size()).toBe(2);
			expect(deque.getFirst()).toBe(2);
			expect(deque.getLast()).toBe(1);
		});

		it("should add elements to the back", () => {
			deque.addLast(1);
			deque.addLast(2);
			expect(deque.size()).toBe(2);
			expect(deque.getFirst()).toBe(1);
			expect(deque.getLast()).toBe(2);
		});

		it("should correctly handle offer methods", () => {
			expect(deque.offerFirst(1)).toBe(true);
			expect(deque.offerLast(2)).toBe(true);
			expect(deque.getFirst()).toBe(1);
			expect(deque.getLast()).toBe(2);
		});
	});

	describe("Removing elements", () => {
		it("should remove elements from the front", () => {
			deque.addLast(1);
			deque.addLast(2);
			const removed = deque.removeFirst();
			expect(removed).toBe(1);
			expect(deque.size()).toBe(1);
			expect(deque.getFirst()).toBe(2);
		});

		it("should remove elements from the back", () => {
			deque.addLast(1);
			deque.addLast(2);
			const removed = deque.removeLast();
			expect(removed).toBe(2);
			expect(deque.size()).toBe(1);
			expect(deque.getFirst()).toBe(1);
		});

		it("should throw when removing from empty deque", () => {
			expect(() => deque.removeFirst()).toThrow(CollectionEmptyError);
			expect(() => deque.removeLast()).toThrow(CollectionEmptyError);
		});

		it("should poll elements safely", () => {
			expect(deque.pollFirst()).toBeUndefined();
			expect(deque.pollLast()).toBeUndefined();

			deque.addLast(1);
			expect(deque.pollFirst()).toBe(1);
			expect(deque.pollFirst()).toBeUndefined();
		});
	});

	describe("Peeking elements", () => {
		it("should peek elements from the front", () => {
			expect(deque.peekFirst()).toBeUndefined();
			deque.addLast(1);
			deque.addLast(2);
			expect(deque.peekFirst()).toBe(1);
			expect(deque.size()).toBe(2);
		});

		it("should peek elements from the back", () => {
			expect(deque.peekLast()).toBeUndefined();
			deque.addLast(1);
			deque.addLast(2);
			expect(deque.peekLast()).toBe(2);
			expect(deque.size()).toBe(2);
		});

		it("should throw when getting from empty deque", () => {
			expect(() => deque.getFirst()).toThrow(CollectionEmptyError);
			expect(() => deque.getLast()).toThrow(CollectionEmptyError);
		});
	});

	describe("Dynamic resizing and ring buffer wrapping", () => {
		it("should resize correctly when capacity is reached", () => {
			// Initial capacity is 16. Let's add 20 elements.
			for (let i = 0; i < 20; i++) {
				deque.addLast(i);
			}
			expect(deque.size()).toBe(20);
			expect(deque.getFirst()).toBe(0);
			expect(deque.getLast()).toBe(19);

			// Should maintain order after resize
			const arr = deque.toArray();
			for (let i = 0; i < 20; i++) {
				expect(arr[i]).toBe(i);
			}
		});

		it("should correctly handle wrapped indices during resize", () => {
			// Fill part of the array, remove some to advance head, then add to wrap around tail.
			for (let i = 0; i < 10; i++) deque.addLast(i);
			for (let i = 0; i < 5; i++) deque.removeFirst(); // Head is now at 5. Size is 5.
			for (let i = 10; i < 25; i++) deque.addLast(i); // This should cause wrap-around and then resize.
			
			expect(deque.size()).toBe(20);
			expect(deque.getFirst()).toBe(5);
			expect(deque.getLast()).toBe(24);

			const arr = deque.toArray();
			let expected = 5;
			for (let i = 0; i < 20; i++) {
				expect(arr[i]).toBe(expected++);
			}
		});
	});

	describe("Contains and removal by value", () => {
		it("should check if it contains an element", () => {
			deque.addLast(1);
			deque.addLast(2);
			deque.addLast(3);

			expect(deque.contains(2)).toBe(true);
			expect(deque.contains(4)).toBe(false);
		});

		it("should remove first occurrence", () => {
			deque.addLast(1);
			deque.addLast(2);
			deque.addLast(1);
			
			expect(deque.removeFirstOccurrence(1)).toBe(true);
			expect(deque.toArray()).toEqual([2, 1]);
			expect(deque.size()).toBe(2);
			
			expect(deque.removeFirstOccurrence(3)).toBe(false);
		});

		it("should remove last occurrence", () => {
			deque.addLast(1);
			deque.addLast(2);
			deque.addLast(1);
			
			expect(deque.removeLastOccurrence(1)).toBe(true);
			expect(deque.toArray()).toEqual([1, 2]);
			expect(deque.size()).toBe(2);
		});

		it("should remove elements shifting towards head or tail efficiently", () => {
			for (let i = 0; i < 10; i++) deque.addLast(i);
			
			// Remove from first half (shifts from head)
			deque.removeFirstOccurrence(2);
			expect(deque.toArray()).toEqual([0, 1, 3, 4, 5, 6, 7, 8, 9]);

			// Remove from second half (shifts from tail)
			deque.removeFirstOccurrence(7);
			expect(deque.toArray()).toEqual([0, 1, 3, 4, 5, 6, 8, 9]);
		});
		
		it("should handle remove via Collection interface", () => {
			deque.addLast(1);
			deque.addLast(2);
			expect(deque.remove(1)).toBe(true);
			expect(deque.toArray()).toEqual([2]);
		});
	});

	describe("Iterators", () => {
		it("should iterate forward correctly", () => {
			deque.addLast(1);
			deque.addLast(2);
			deque.addLast(3);

			const it = deque.iterator();
			expect(it.hasNext()).toBe(true);
			expect(it.next()).toBe(1);
			expect(it.next()).toBe(2);
			expect(it.next()).toBe(3);
			expect(it.hasNext()).toBe(false);
			expect(() => it.next()).toThrow("No more elements");
		});

		it("should iterate backward correctly with descendingIterator", () => {
			deque.addLast(1);
			deque.addLast(2);
			deque.addLast(3);

			const it = deque.descendingIterator();
			expect(it.hasNext()).toBe(true);
			expect(it.next()).toBe(3);
			expect(it.next()).toBe(2);
			expect(it.next()).toBe(1);
			expect(it.hasNext()).toBe(false);
			expect(() => it.next()).toThrow("No more elements");
		});
	});

	describe("Stack and Queue overrides", () => {
		it("should handle Stack methods (push/pop)", () => {
			deque.push(1);
			deque.push(2);
			expect(deque.pop()).toBe(2);
			expect(deque.pop()).toBe(1);
		});

		it("should handle Queue methods (offer/poll)", () => {
			deque.offer(1);
			deque.offer(2);
			expect(deque.poll()).toBe(1);
			expect(deque.poll()).toBe(2);
			expect(deque.poll()).toBeUndefined();
		});

		it("should handle Queue peek/element", () => {
			deque.offer(1);
			expect(deque.peek()).toBe(1);
			expect(deque.element()).toBe(1);
			deque.poll();
			expect(deque.peek()).toBeUndefined();
			expect(() => deque.element()).toThrow(CollectionEmptyError);
		});
	});

	describe("Clear", () => {
		it("should clear the deque", () => {
			deque.addLast(1);
			deque.addLast(2);
			deque.clear();
			expect(deque.isEmpty()).toBe(true);
			expect(deque.size()).toBe(0);
			expect(deque.toArray()).toEqual([]);
		});
	});
});
