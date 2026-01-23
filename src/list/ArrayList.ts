import type { Iterator } from "../interfaces/Iterator";
import type { List } from "../interfaces/List";
import { AbstractList, type TypeValidationOptions } from "../abstracts/AbstractList";

/**
 * A simple array-based List implementation using dynamic resizing.
 * Provides O(1) random access and O(n) insertion/deletion at arbitrary positions.
 * Leverages JavaScript's native array resizing for optimal performance.
 * Includes automatic runtime type validation by default (like Java's type-safe collections).
 *
 * @template T The type of elements in this list
 *
 * @example
 * ```typescript
 * import { ArrayList } from 'ts-collections';
 * import { z } from 'zod';
 * 
 * // Automatic type safety (enabled by default, like Java)
 * const list = new ArrayList<number>();
 * list.add(1);
 * list.add(2);
 * console.log(list.size()); // 2
 * console.log(list.get(0)); // 1
 * list.add("text" as any); // ✗ Throws TypeError: type mismatch (automatic!)
 * 
 * // Disable type checking if needed
 * const unvalidatedList = new ArrayList<number>({ strict: false });
 * unvalidatedList.add(1);
 * unvalidatedList.add("text"); // OK (no validation)
 * 
 * // Advanced: With Zod schema for complex validation (power users)
 * const strictList = new ArrayList<number>({
 *   schema: z.number().positive()
 * });
 * strictList.add(5); // OK
 * strictList.add(-1 as any); // ✗ Throws: "Validation failed: Number must be greater than 0"
 * 
 * // Advanced: With custom validator (power users)
 * const validatedList = new ArrayList<number>({
 *   validator: (val) => typeof val === 'number' && val > 0
 * });
 * ```
 */
export class ArrayList<T> extends AbstractList<T> implements List<T> {
  private elements: T[] = [];

  /**
   * Creates a new ArrayList with optional runtime type validation.
   * @param options Configuration for runtime type checking
   */
  constructor(options?: TypeValidationOptions<T>) {
    super(options);
  }

  override add(element: T): boolean {
    this.validateElementType(element);
    this.elements.push(element);
    return true;
  }

  override get(index: number): T {
    this.checkIndex(index);
    const element = this.elements[index];
    if (element === undefined) {
      throw new Error(`Element at index ${index} is undefined`);
    }
    return element;
  }

  override set(index: number, element: T): T {
    this.checkIndex(index);
    this.validateElementType(element);
    const oldElement = this.elements[index];
    if (oldElement === undefined) {
      throw new Error(`Element at index ${index} is undefined`);
    }
    this.elements[index] = element;
    return oldElement;
  }

  override addAt(index: number, element: T): void {
    if (index < 0 || index > this.elements.length) {
      throw new Error(`Index out of bounds: ${index}`);
    }
    this.validateElementType(element);
    this.elements.splice(index, 0, element);
  }

  override removeAt(index: number): T {
    this.checkIndex(index);
    const removed = this.elements.splice(index, 1);
    const element = removed[0];
    if (element === undefined) {
      throw new Error(`Failed to remove element at index ${index}`);
    }
    return element;
  }

  override indexOf(element: T): number {
    return this.elements.indexOf(element);
  }

  override lastIndexOf(element: T): number {
    return this.elements.lastIndexOf(element);
  }

  override subList(fromIndex: number, toIndex: number): List<T> {
    if (fromIndex < 0 || toIndex > this.elements.length || fromIndex > toIndex) {
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
        if (element === undefined) {
          throw new Error(`Element at index ${index} is undefined`);
        }
        index += 1;
        return element;
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
