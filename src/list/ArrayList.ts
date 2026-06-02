import { AbstractList, type TypeValidationOptions } from "../abstracts/AbstractList";
import type { Iterator } from "../interfaces/Iterator";
import type { List } from "../interfaces/List";

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

	override get(index: number): T {
		this.checkIndex(index);
		return this.elements[index] as T;
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

	override removeAt(index: number): T {
		this.checkIndex(index);
		const [removed] = this.elements.splice(index, 1);
		return removed as T;
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

	private checkIndex(index: number): void {
		if (index < 0 || index >= this.elements.length) {
			throw new Error(`Index out of bounds: ${index}`);
		}
	}
}
