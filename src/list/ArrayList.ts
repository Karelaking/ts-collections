import { AbstractList, type TypeValidationOptions } from "../abstracts/AbstractList";
import type { Iterator } from "../interfaces/Iterator";
import type { List } from "../interfaces/List";
import util from "util";

/**
 * A resizable, ordered list backed by a native array.
 *
 * This list behaves like Java’s `ArrayList`: it stores elements in insertion
 * order, supports random access by index, and grows as needed when elements
 * are appended or inserted.
 */
export class ArrayList<T> extends AbstractList<T> implements List<T> {
	private elements: T[] = [];

	constructor(options?: TypeValidationOptions<T>) {
		super(options);
	}

	override add(element: T): boolean {
		this.validateElementType(
			element,
			this.createValidationContext(
				"add",
				`element at index ${this.elements.length}`,
				element,
				this.elements.length
			)
		);
		this.elements.push(element);
		return true;
	}

	override addAll(elements: Iterable<T>): boolean {
		let modified = false;
		for (const element of elements) {
			this.validateElementType(
				element,
				this.createValidationContext(
					"addAll",
					`element at index ${this.elements.length}`,
					element,
					this.elements.length
				)
			);
			this.elements.push(element);
			modified = true;
		}
		return modified;
	}

	override addFirst(element: T): void {
		this.validateElementType(
			element,
			this.createValidationContext(
				"addFirst",
				"first element",
				element,
				this.elements.length
			)
		);
		this.elements.unshift(element);
	}

	override addLast(element: T): void {
		this.validateElementType(
			element,
			this.createValidationContext(
				"addLast",
				`element at index ${this.elements.length}`,
				element,
				this.elements.length
			)
		);
		this.elements.push(element);
	}

	override get(index: number): T {
		this.checkIndex(index);
		return this.elements[index] as T;
	}

	override getFirst(): T {
		if (this.isEmpty()) {
			throw new Error("List is empty");
		}
		return this.elements[0] as T;
	}

	override getLast(): T {
		if (this.isEmpty()) {
			throw new Error("List is empty");
		}
		return this.elements[this.elements.length - 1] as T;
	}

	override set(index: number, element: T): T {
		this.checkIndex(index);
		this.validateElementType(
			element,
			this.createValidationContext(
				"set",
				`element at index ${index}`,
				element,
				this.elements.length
			)
		);
		const oldElement = this.elements[index];
		this.elements[index] = element;
		return oldElement as T;
	}

	override addAt(index: number, element: T): void {
		if (index < 0 || index > this.elements.length) {
			throw new Error(`Index out of bounds: ${index}`);
		}
		this.validateElementType(
			element,
			this.createValidationContext(
				"addAt",
				`element at index ${index}`,
				element,
				this.elements.length
			)
		);
		this.elements.splice(index, 0, element);
	}

	override remove(element: T): boolean {
		const index = this.elements.indexOf(element);
		if (index === -1) {
			return false;
		}
		this.elements.splice(index, 1);
		return true;
	}

	override removeAt(index: number): T {
		this.checkIndex(index);
		const [removed] = this.elements.splice(index, 1);
		return removed as T;
	}

	override removeFirst(): T {
		if (this.isEmpty()) {
			throw new Error("List is empty");
		}
		return this.elements.shift() as T;
	}

	override removeLast(): T {
		if (this.isEmpty()) {
			throw new Error("List is empty");
		}
		return this.elements.pop() as T;
	}

	override indexOf(element: T): number {
		return this.elements.indexOf(element);
	}

	override lastIndexOf(element: T): number {
		return this.elements.lastIndexOf(element);
	}

	override subList(fromIndex: number, toIndex: number): List<T> {
		if (
			fromIndex < 0 ||
			toIndex > this.elements.length ||
			fromIndex > toIndex
		) {
			throw new Error("Invalid index range");
		}
		const subArray = this.elements.slice(fromIndex, toIndex);
		const subList = new ArrayList<T>();
		for (const element of subArray) {
			subList.add(element);
		}
		return subList;
	}

	override size(): number {
		return this.elements.length;
	}

	override clear(): void {
		this.elements = [];
		this.resetTypeInference();
	}

	override contains(element: T): boolean {
		return this.elements.includes(element);
	}

	override iterator(): Iterator<T> {
		let index = 0;
		const elements = this.elements;
		return {
			hasNext: () => index < elements.length,
			next: () => {
				if (index >= elements.length) {
					throw new Error("No more elements");
				}
				const element = elements[index];
				index += 1;
				if (element === undefined) {
					throw new Error("No more elements");
				}
				return element as T;
			},
		};
	}

	override toArray(): T[] {
		return [...this.elements];
	}

	override isEmpty(): boolean {
		return this.elements.length === 0;
	}

	override toString(): string {
		return `[${this.elements.map((e) => String(e)).join(", ")}]`;
	}

	private checkIndex(index: number): void {
		if (index < 0 || index >= this.elements.length) {
			throw new Error(`Index out of bounds: ${index}`);
		}
	}
}
