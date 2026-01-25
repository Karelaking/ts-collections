import type { Map, Iterator, Collection } from "../interfaces";
import { z, type ZodSchema } from "zod";

/**
 * Options for runtime type validation in maps.
 * 
 * By default, maps automatically enforce type consistency for both keys and values
 * based on the first key-value pair added (similar to Java's HashMap).
 * 
 * No configuration is needed - type safety works automatically!
 */
export interface MapTypeValidationOptions<K, V> {
  /**
   * If false, disables automatic type checking for keys and values.
   * Default: true (type safety is ON by default, like Java)
   * 
   * @example
   * ```typescript
   * // Type safety enabled by default
   * const map = new HashMap<string, number>();
   * map.put("age", 25);        // ✓ OK
   * map.put(123 as any, 30);   // ✗ TypeError: Key type mismatch
   * ```
   */
  strict?: boolean;

  /**
   * Optional Zod schema for validating keys.
   * Only used if strict mode is enabled.
   * For power users who need advanced validation.
   * 
   * @example
   * ```typescript
   * import { z } from 'zod';
   * 
   * const map = new HashMap<string, number>({
   *   keySchema: z.string().min(1)  // Keys must not be empty
   * });
   * ```
   */
  keySchema?: ZodSchema<K>;

  /**
   * Optional Zod schema for validating values.
   * Only used if strict mode is enabled.
   * For power users who need advanced validation.
   */
  valueSchema?: ZodSchema<V>;

  /**
   * Optional custom validator for keys.
   * Only used if strict mode is enabled and no keySchema is provided.
   */
  keyValidator?: (key: unknown) => boolean;

  /**
   * Optional custom validator for values.
   * Only used if strict mode is enabled and no valueSchema is provided.
   */
  valueValidator?: (value: unknown) => boolean;
}

/**
 * Abstract base class for Map implementations.
 * Provides default implementations of putAll, clear, and iterator methods.
 * 
 * **Type Safety by Default:** Maps automatically enforce type consistency for both keys and values
 * based on the first key-value pair added, just like Java's HashMap. No configuration needed!
 * 
 * For advanced use cases, you can optionally provide Zod schemas or custom validators.
 * 
 * Concrete subclasses must implement: size(), isEmpty(), containsKey(), containsValue(),
 * get(), put(), remove(), keyIterator(), valueIterator(), keys(), values(), entries()
 *
 * @template K The type of keys maintained by this map
 * @template V The type of mapped values
 * 
 * @example
 * ```typescript
 * import { HashMap } from 'ts-collections';
 * 
 * // Type-safe by default - just like Java!
 * const map = new HashMap<string, number>();
 * map.put("age", 25);        // ✓ OK
 * map.put("height", 180);    // ✓ OK
 * console.log(map.get("age")); // 25
 * 
 * // Type errors are caught automatically:
 * map.put(123, 30);          // ✗ TypeError: Key type mismatch
 * map.put("name", "Alice");  // ✗ TypeError: Value type mismatch
 * 
 * // For power users: advanced validation
 * import { z } from 'zod';
 * 
 * const products = new HashMap<string, number>({
 *   keySchema: z.string().min(1),      // SKU validation
 *   valueSchema: z.number().positive() // Price validation
 * });
 * ```
 */
export abstract class AbstractMap<K, V> implements Map<K, V> {
  protected keyValidator?: (key: unknown) => boolean;
  protected valueValidator?: (value: unknown) => boolean;
  protected keySchema?: ZodSchema<K>;
  protected valueSchema?: ZodSchema<V>;
  protected strict: boolean = true; // ✓ DEFAULT: Type safety is ON (like Java)
  protected inferredKeyType?: string;
  protected inferredValueType?: string;

  /**
   * Initializes the map with optional type validation settings.
   * 
   * By default, maps are type-safe (strict mode on).
   * The first key-value pair determines the types, and all subsequent
   * pairs must match those types - just like Java's HashMap!
   * 
   * @param options Configuration for type validation
   */
  constructor(options?: MapTypeValidationOptions<K, V>) {
    if (options) {
      this.strict = options.strict ?? true; // Default to true (type-safe)

      if (options.keySchema) {
        this.keySchema = options.keySchema;
      }
      if (options.valueSchema) {
        this.valueSchema = options.valueSchema;
      }
      if (options.keyValidator) {
        this.keyValidator = options.keyValidator;
      }
      if (options.valueValidator) {
        this.valueValidator = options.valueValidator;
      }
    }
  }
  /**
   * Returns the number of key-value mappings in this map.
   * Must be implemented by subclasses.
   */
  abstract size(): number;

  /**
   * Returns the number of key-value mappings in this map (alias for size()).
   * Provided for consistency with JavaScript arrays.
   */
  get length(): number {
    return this.size();
  }

  /**
   * Returns true if this map contains no key-value mappings.
   * Must be implemented by subclasses.
   */
  abstract isEmpty(): boolean;

  /**
   * Returns true if this map contains a mapping for the specified key.
   * Must be implemented by subclasses.
   */
  abstract containsKey(key: K): boolean;

  /**
   * Returns true if this map maps one or more keys to the specified value.
   * Must be implemented by subclasses.
   */
  abstract containsValue(value: V): boolean;

  /**
   * Returns the value to which the specified key is mapped.
   * Must be implemented by subclasses.
   */
  abstract get(key: K): V | undefined;

  /**
   * Associates the specified value with the specified key in this map.
   * Must be implemented by subclasses.
   */
  abstract put(key: K, value: V): V | undefined;

  /**
   * Removes the mapping for the specified key from this map if present.
   * Must be implemented by subclasses.
   */
  abstract remove(key: K): V | undefined;

  /**
   * Removes all of the mappings from this map.
   * Must be implemented by subclasses.
   */
  abstract clear(): void;

  /**
   * Returns an iterator over the keys contained in this map.
   * Must be implemented by subclasses.
   */
  abstract keyIterator(): Iterator<K>;

  /**
   * Returns an iterator over the values contained in this map.
   * Must be implemented by subclasses.
   */
  abstract valueIterator(): Iterator<V>;

  /**
   * Returns a Collection view of the values contained in this map.
   * Must be implemented by subclasses.
   */
  abstract values(): Collection<V>;

  /**
   * Returns all keys in this map as an array.
   * Must be implemented by subclasses.
   */
  abstract keys(): K[];

  /**
   * Returns all key-value pairs as an array of tuples.
   * Must be implemented by subclasses.
   */
  abstract entries(): Array<[K, V]>;

  /**
   * Copies all of the mappings from the specified map to this map.
   *
   * Default implementation: iterates through all entries of the specified map
   * and puts each entry into this map.
   */
  putAll(other: Map<K, V>): void {
    const entries = other.entries();
    for (const [key, value] of entries) {
      this.put(key, value);
    }
  }

  /**
   * Validates the type of a key before adding it to the map.
   * Uses cascading validation: Zod schema > Custom validator > Strict type checking.
   * 
   * By default (strict=true), enforces type consistency:
   * - First key determines the key type
   * - All subsequent keys must match that type
   * - No configuration needed! (Just like Java)
   * 
   * @param key The key to validate
   * @throws {TypeError} If key validation fails
   */
  protected validateKeyType(key: unknown): void {
    // Only validate if strict mode is enabled
    if (!this.strict) {
      return;
    }

    // Zod schema takes highest precedence (for power users)
    if (this.keySchema) {
      try {
        this.keySchema.parse(key);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const issues = error.issues
            .map(issue => {
              const path = issue.path.length > 0 ? `${issue.path.join('.')}` : 'root';
              return `${path}: ${issue.message}`;
            })
            .join('; ');
          throw new TypeError(`Key validation failed: ${issues}`);
        }
        throw error;
      }
      return;
    }

    // Custom validator takes second precedence
    if (this.keyValidator) {
      if (!this.keyValidator(key)) {
        throw new TypeError(
          'Key validation failed: key does not match the expected type'
        );
      }
      return;
    }

    // Default: Strict type inference (like Java's generics)
    if (this.size() === 0) {
      this.inferredKeyType = this.getTypeString(key);
    } else {
      const keyType = this.getTypeString(key);
      if (keyType !== this.inferredKeyType) {
        throw new TypeError(
          `Key type mismatch: expected ${this.inferredKeyType}, but got ${keyType}`
        );
      }
    }
  }

  /**
   * Validates the type of a value before adding it to the map.
   * Uses cascading validation: Zod schema > Custom validator > Strict type checking.
   * 
   * By default (strict=true), enforces type consistency:
   * - First value determines the value type
   * - All subsequent values must match that type
   * - No configuration needed! (Just like Java)
   * 
   * @param value The value to validate
   * @throws {TypeError} If value validation fails
   */
  protected validateValueType(value: unknown): void {
    // Only validate if strict mode is enabled
    if (!this.strict) {
      return;
    }

    // Zod schema takes highest precedence (for power users)
    if (this.valueSchema) {
      try {
        this.valueSchema.parse(value);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const issues = error.issues
            .map(issue => {
              const path = issue.path.length > 0 ? `${issue.path.join('.')}` : 'root';
              return `${path}: ${issue.message}`;
            })
            .join('; ');
          throw new TypeError(`Value validation failed: ${issues}`);
        }
        throw error;
      }
      return;
    }

    // Custom validator takes second precedence
    if (this.valueValidator) {
      if (!this.valueValidator(value)) {
        throw new TypeError(
          'Value validation failed: value does not match the expected type'
        );
      }
      return;
    }

    // Default: Strict type inference (like Java's generics)
    if (this.size() === 0) {
      this.inferredValueType = this.getTypeString(value);
    } else {
      const valueType = this.getTypeString(value);
      if (valueType !== this.inferredValueType) {
        throw new TypeError(
          `Value type mismatch: expected ${this.inferredValueType}, but got ${valueType}`
        );
      }
    }
  }

  /**
   * Resets the inferred types. Should be called when the map is cleared.
   */
  protected resetTypeInference(): void {
    delete this.inferredKeyType;
    delete this.inferredValueType;
  }

  /**
   * Gets a string representation of the type of a value.
   * @param value The value to get the type of
   * @returns String representing the type
   */
  private getTypeString(value: unknown): string {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (Array.isArray(value)) return "array";
    return typeof value;
  }

  /**
   * Checks if this map has key validation enabled (power users).
   * @returns true if either key schema or key validator is configured
   */
  protected hasKeyValidation(): boolean {
    return this.keySchema !== undefined || this.keyValidator !== undefined;
  }

  /**
   * Checks if this map has value validation enabled (power users).
   * @returns true if either value schema or value validator is configured
   */
  protected hasValueValidation(): boolean {
    return this.valueSchema !== undefined || this.valueValidator !== undefined;
  }

  /**
   * Gets the key validation mode as a string for debugging.
   * @returns Description of the current key validation mode
   */
  protected getKeyValidationMode(): string {
    if (!this.strict) {
      return 'No validation (strict: false)';
    }
    if (this.keySchema) {
      return 'Zod schema (power user mode)';
    }
    if (this.keyValidator) {
      return 'Custom validator (power user mode)';
    }
    return 'Strict type inference (default - like Java)';
  }

  /**
   * Gets the value validation mode as a string for debugging.
   * @returns Description of the current value validation mode
   */
  protected getValueValidationMode(): string {
    if (!this.strict) {
      return 'No validation (strict: false)';
    }
    if (this.valueSchema) {
      return 'Zod schema (power user mode)';
    }
    if (this.valueValidator) {
      return 'Custom validator (power user mode)';
    }
    return 'Strict type inference (default - like Java)';
  }
}
