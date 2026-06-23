import {
	AbstractDeque,
	type TypeValidationOptions,
} from "../abstracts/AbstractDeque";
import type { Deque } from "../interfaces/Deque";
import type { Iterator } from "../interfaces/Iterator";
import { CollectionEmptyError } from "../errors";

/**
 * A resizable-array implementation of the Deque interface.
 *
 * Array deques have no capacity restrictions; they grow as necessary to support usage.
 * They are not thread-safe; in the absence of external synchronization, they do not support
 * concurrent access by multiple threads. Null elements are prohibited.
 *
 * This class is likely to be faster than `LinkedDeque` when used as a queue or a stack.
 *
 * @template T The type of elements in this deque
 */
export class ArrayDeque<T> extends AbstractDeque<T> implements Deque<T> {
	private elements: (T | undefined)[];
	private headIndex: number;
	private tailIndex: number;
	private count: number;

	constructor(options?: TypeValidationOptions<T>) {
		super(options);
		this.elements = new Array(16).fill(undefined);
		this.headIndex = 0;
		this.tailIndex = 0;
		this.count = 0;
	}

	private resize(): void {
		const newCapacity = this.elements.length * 2;
		const newElements = new Array(newCapacity).fill(undefined);

		for (let i = 0; i < this.count; i++) {
			newElements[i] =
				this.elements[(this.headIndex + i) % this.elements.length];
		}

		this.elements = newElements;
		this.headIndex = 0;
		this.tailIndex = this.count;
	}

	override addFirst(element: T): void {
		this.validateElementType(
			element,
			this.createValidationContext(
				"addFirst",
				"deque element at the front",
				element,
				this.size(),
			),
		);

		if (this.count === this.elements.length) {
			this.resize();
		}

		this.headIndex =
			(this.headIndex - 1 + this.elements.length) % this.elements.length;
		this.elements[this.headIndex] = element;
		this.count++;
	}

	override addLast(element: T): void {
		this.validateElementType(
			element,
			this.createValidationContext(
				"addLast",
				"deque element at the back",
				element,
				this.size(),
			),
		);

		if (this.count === this.elements.length) {
			this.resize();
		}

		this.elements[this.tailIndex] = element;
		this.tailIndex = (this.tailIndex + 1) % this.elements.length;
		this.count++;
	}

	override offerFirst(element: T): boolean {
		this.addFirst(element);
		return true;
	}

	override offerLast(element: T): boolean {
		this.addLast(element);
		return true;
	}

	override removeFirst(): T {
		if (this.count === 0) {
			throw new CollectionEmptyError("removeFirst", { collectionType: "ArrayDeque", operation: "removeFirst" });
		}

		const value = this.elements[this.headIndex];
		if (value === undefined) {
			throw new Error("Unexpected undefined value");
		}

		this.elements[this.headIndex] = undefined;
		this.headIndex = (this.headIndex + 1) % this.elements.length;
		this.count--;

		if (this.count === 0) {
			this.resetTypeInference();
		}

		return value;
	}

	override removeLast(): T {
		if (this.count === 0) {
			throw new CollectionEmptyError("removeLast", { collectionType: "ArrayDeque", operation: "removeLast" });
		}

		this.tailIndex =
			(this.tailIndex - 1 + this.elements.length) % this.elements.length;
		const value = this.elements[this.tailIndex];
		if (value === undefined) {
			throw new Error("Unexpected undefined value");
		}

		this.elements[this.tailIndex] = undefined;
		this.count--;

		if (this.count === 0) {
			this.resetTypeInference();
		}

		return value;
	}

	override pollFirst(): T | undefined {
		if (this.count === 0) {
			return undefined;
		}
		return this.removeFirst();
	}

	override pollLast(): T | undefined {
		if (this.count === 0) {
			return undefined;
		}
		return this.removeLast();
	}

	override getFirst(): T {
		if (this.count === 0) {
			throw new CollectionEmptyError("getFirst", { collectionType: "ArrayDeque", operation: "getFirst" });
		}
		const value = this.elements[this.headIndex];
		if (value === undefined) {
			throw new Error("Unexpected undefined value");
		}
		return value;
	}

	override getLast(): T {
		if (this.count === 0) {
			throw new CollectionEmptyError("getLast", { collectionType: "ArrayDeque", operation: "getLast" });
		}
		const index =
			(this.tailIndex - 1 + this.elements.length) % this.elements.length;
		const value = this.elements[index];
		if (value === undefined) {
			throw new Error("Unexpected undefined value");
		}
		return value;
	}

	override peekFirst(): T | undefined {
		if (this.count === 0) {
			return undefined;
		}
		return this.elements[this.headIndex];
	}

	override peekLast(): T | undefined {
		if (this.count === 0) {
			return undefined;
		}
		const index =
			(this.tailIndex - 1 + this.elements.length) % this.elements.length;
		return this.elements[index];
	}

	override size(): number {
		return this.count;
	}

	override clear(): void {
		this.elements.fill(undefined);
		this.headIndex = 0;
		this.tailIndex = 0;
		this.count = 0;
		this.resetTypeInference();
	}

	override contains(element: T): boolean {
		for (let i = 0; i < this.count; i++) {
			const index = (this.headIndex + i) % this.elements.length;
			if (this.elements[index] === element) {
				return true;
			}
		}
		return false;
	}

	override remove(element: T): boolean {
		return this.removeFirstOccurrence(element);
	}

	override removeFirstOccurrence(element: T): boolean {
		for (let i = 0; i < this.count; i++) {
			const index = (this.headIndex + i) % this.elements.length;
			if (this.elements[index] === element) {
				this.deleteIndex(index);
				return true;
			}
		}
		return false;
	}

	override removeLastOccurrence(element: T): boolean {
		for (let i = this.count - 1; i >= 0; i--) {
			const index = (this.headIndex + i) % this.elements.length;
			if (this.elements[index] === element) {
				this.deleteIndex(index);
				return true;
			}
		}
		return false;
	}

	private deleteIndex(index: number): void {
		// Calculate the logical position of the index to delete (0 to count - 1)
		let logicalIndex = index - this.headIndex;
		if (logicalIndex < 0) {
			logicalIndex += this.elements.length;
		}

		if (logicalIndex < this.count / 2) {
			// Shift elements after head up to index towards the right
			for (let i = logicalIndex; i > 0; i--) {
				const current = (this.headIndex + i) % this.elements.length;
				const prev =
					(this.headIndex + i - 1 + this.elements.length) %
					this.elements.length;
				this.elements[current] = this.elements[prev];
			}
			this.elements[this.headIndex] = undefined;
			this.headIndex = (this.headIndex + 1) % this.elements.length;
		} else {
			// Shift elements after index up to tail towards the left
			for (let i = logicalIndex; i < this.count - 1; i++) {
				const current = (this.headIndex + i) % this.elements.length;
				const next = (this.headIndex + i + 1) % this.elements.length;
				this.elements[current] = this.elements[next];
			}
			this.tailIndex =
				(this.tailIndex - 1 + this.elements.length) % this.elements.length;
			this.elements[this.tailIndex] = undefined;
		}
		this.count--;

		if (this.count === 0) {
			this.resetTypeInference();
		}
	}

	override iterator(): Iterator<T> {
		let i = 0;
		return {
			hasNext: () => i < this.count,
			next: () => {
				if (i >= this.count) {
					throw new Error("No more elements");
				}
				const value = this.elements[(this.headIndex + i) % this.elements.length];
				if (value === undefined) {
					throw new Error("No more elements");
				}
				i++;
				return value;
			},
		};
	}

	override descendingIterator(): Iterator<T> {
		let i = this.count - 1;
		return {
			hasNext: () => i >= 0,
			next: () => {
				if (i < 0) {
					throw new Error("No more elements");
				}
				const value = this.elements[(this.headIndex + i) % this.elements.length];
				if (value === undefined) {
					throw new Error("No more elements");
				}
				i--;
				return value;
			},
		};
	}

	override toArray(): T[] {
		const result: T[] = [];
		for (let i = 0; i < this.count; i++) {
			const value = this.elements[(this.headIndex + i) % this.elements.length];
			if (value !== undefined) {
				result.push(value);
			}
		}
		return result;
	}
}
