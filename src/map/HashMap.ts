import {
	AbstractMap,
	type MapTypeValidationOptions,
} from "../abstracts/AbstractMap";
import type { Collection } from "../interfaces/Collection";
import type { Iterator } from "../interfaces/Iterator";
import type { Map as MapInterface } from "../interfaces/Map";
import { formatValidationContextValue } from "../utils/validation";

/**
 * A hash-based map that stores key-value pairs with fast lookups.
 *
 * This map behaves like Java's `HashMap`: it uses hashing for key storage,
 * supports null-safe operations, and provides constant-time performance for
 * basic operations under typical conditions.
 *
 * ### Performance characteristics
 * - `put`, `get`, `remove`: $O(1)$ average case
 * - `containsKey`: $O(1)$ average case
 * - `containsValue`: $O(n)$ due to full iteration
 * - `size`, `isEmpty`: $O(1)$
 *
 * ### Internal behavior
 * - Backed by the native JavaScript `Map` for efficient key-value storage.
 * - When runtime type validation is enabled (via `AbstractMap` options),
 *   each key and value is validated before insertion.
 * - Key equality uses JavaScript's `===` operator (strict equality).
 * - The `values()` method returns a snapshot collection view.
 *
 * ### Error behavior
 * - `put` throws if the key or value type is invalid under validation rules.
 * - Iterator `next()` throws when no elements remain.
 * - Collection views returned by `values()` throw on mutating operations.
 *
 * @typeParam K - The type of keys maintained by this map.
 * @typeParam V - The type of mapped values.
 *
 * @example
 * const map = new HashMap<string, number>();
 * map.put("a", 1);
 * map.put("b", 2);
 * console.log(map.get("a")); // 1
 * console.log(map.size()); // 2
 * map.put(123 as any, 456); // ❌ Throws TypeError (automatic!)
 *
 * // Disable type checking if needed
 * const unvalidatedMap = new HashMap<string, number>({ strict: false });
 * unvalidatedMap.put("key", 123); // OK
 * unvalidatedMap.put(123 as any, 456); // OK (no validation)
 * ```
 */
export class HashMap<K, V>
	extends AbstractMap<K, V>
	implements MapInterface<K, V>
{
	private readonly mapEntries: globalThis.Map<K, V>;

	constructor(options?: MapTypeValidationOptions<K, V>) {
		super(options);
		this.mapEntries = new globalThis.Map<K, V>();
	}

	/**
	 * Associates the specified value with the specified key in this map.
	 * If the map previously contained a mapping for the key, the old value is replaced.
	 * @param key The key with which the specified value is to be associated
	 * @param value The value to be associated with the specified key
	 * @returns The previous value associated with the key, or undefined if there was no mapping
	 */
	override put(key: K, value: V): V | undefined {
		this.validateKeyType(
			key,
			this.createValidationContext(
				"put",
				`key ${formatValidationContextValue(key)}`,
				key,
				this.size()
			)
		);
		this.validateValueType(
			value,
			this.createValidationContext(
				"put",
				`value for key ${formatValidationContextValue(key)}`,
				value,
				this.size()
			)
		);
		const oldValue = this.mapEntries.get(key);
		this.mapEntries.set(key, value);
		return oldValue;
	}

	/**
	 * Returns the value to which the specified key is mapped, or undefined if this map contains no mapping for the key.
	 * @param key The key whose associated value is to be returned
	 * @returns The value to which the specified key is mapped, or undefined if no mapping exists
	 */
	override get(key: K): V | undefined {
		return this.mapEntries.get(key);
	}

	/**
	 * Removes the mapping for a key from this map if it is present.
	 * @param key The key whose mapping is to be removed from the map
	 * @returns The previous value associated with the key, or undefined if there was no mapping
	 */
	override remove(key: K): V | undefined {
		const value = this.mapEntries.get(key);
		this.mapEntries.delete(key);
		return value;
	}

	/**
	 * Returns true if this map contains a mapping for the specified key.
	 * @param key The key whose presence in this map is to be tested
	 * @returns true if this map contains a mapping for the specified key
	 */
	override containsKey(key: K): boolean {
		return this.mapEntries.has(key);
	}

	/**
	 * Returns true if this map maps one or more keys to the specified value.
	 * @param value The value whose presence in this map is to be tested
	 * @returns true if this map maps one or more keys to the specified value
	 */
	override containsValue(value: V): boolean {
		for (const v of this.mapEntries.values()) {
			if (v === value) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Returns the number of key-value mappings in this map.
	 * @returns The number of key-value mappings in this map
	 */
	override size(): number {
		return this.mapEntries.size;
	}

	/**
	 * Returns true if this map contains no key-value mappings.
	 * @returns true if this map contains no key-value mappings
	 */
	override isEmpty(): boolean {
		return this.mapEntries.size === 0;
	}

	/**
	 * Removes all of the mappings from this map.
	 */
	override clear(): void {
		this.mapEntries.clear();
		this.resetTypeInference();
	}

	/**
	 * Returns an iterator over the keys in this map.
	 * @returns An iterator over the keys in this map
	 */
	override keyIterator(): Iterator<K> {
		const keys = Array.from(this.mapEntries.keys()) as K[];
		let index = 0;

		return {
			hasNext: () => index < keys.length,
			next: () => {
				if (index >= keys.length) {
					throw new Error("No more elements");
				}
				const key = keys[index++];
				if (key === undefined) {
					throw new Error("No more elements");
				}
				return key;
			},
		};
	}

	/**
	 * Returns an iterator over the values in this map.
	 * @returns An iterator over the values in this map
	 */
	override valueIterator(): Iterator<V> {
		const values = Array.from(this.mapEntries.values()) as V[];
		let index = 0;

		return {
			hasNext: () => index < values.length,
			next: () => {
				if (index >= values.length) {
					throw new Error("No more elements");
				}
				const value = values[index++];
				if (value === undefined) {
					throw new Error("No more elements");
				}
				return value;
			},
		};
	}

	/**
	 * Returns a collection view of the values contained in this map.
	 * @returns A collection view of the values contained in this map
	 */
	override values(): Collection<V> {
		const valueArray = Array.from(this.mapEntries.values());
		return {
			size: () => valueArray.length,
			get length() {
				return valueArray.length;
			},
			isEmpty: () => valueArray.length === 0,
			contains: (v: V) => valueArray.includes(v),
			add: () => {
				throw new Error("Unsupported operation");
			},
			remove: () => {
				throw new Error("Unsupported operation");
			},
			clear: () => {
				throw new Error("Unsupported operation");
			},
			toArray: () => valueArray,
			iterator: () => {
				let idx = 0;
				return {
					hasNext: () => idx < valueArray.length,
					next: () => {
						if (idx >= valueArray.length) {
							throw new Error("No more elements");
						}
						const value = valueArray[idx++];
						if (value === undefined) {
							throw new Error("Value is undefined");
						}
						return value;
					},
				};
			},
			containsAll: (other) => {
				const otherArray = other.toArray();
				return otherArray.every((v) => valueArray.includes(v));
			},
			addAll: () => {
				throw new Error("Unsupported operation");
			},
			removeAll: () => {
				throw new Error("Unsupported operation");
			},
			retainAll: () => {
				throw new Error("Unsupported operation");
			},
		};
	}

	/**
	 * Returns an array of the keys contained in this map.
	 * @returns An array of the keys contained in this map
	 */
	override keys(): K[] {
		return Array.from(this.mapEntries.keys());
	}

	/**
	 * Returns an array of the key-value pairs contained in this map.
	 * @returns An array of the key-value pairs contained in this map
	 */
	override entries(): [K, V][] {
		return Array.from(this.mapEntries.entries());
	}
}
