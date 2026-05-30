/**
 * TypeSystem - Core type codes and registry
 *
 * Provides O(1) type detection via numeric codes instead of string comparison.
 * Supports 16 built-in types (0-15) plus user-defined types via registry.
 */

/**
 * Numeric type codes for fast comparison
 * Using 4-bit codes (0-15) for optimal performance
 */
export enum TypeCode {
	// Primitives (0-8)
	NUMBER = 0,
	STRING = 1,
	BOOLEAN = 2,
	FUNCTION = 3,
	SYMBOL = 4,
	BIGINT = 5,
	NULL = 6,
	UNDEFINED = 7,

	// Objects (8-13)
	ARRAY = 8,
	OBJECT = 9,

	// Built-in Objects (10-15)
	DATE = 10,
	MAP = 11,
	SET = 12,
	REGEX = 13,
	ERROR = 14,

	// Reserved for custom types
	CUSTOM = 15,
}

/**
 * Category of type for grouping and filtering
 */
export enum TypeCategory {
	PRIMITIVE = "primitive",
	OBJECT = "object",
	COLLECTION = "collection",
	BUILTIN = "builtin",
	CUSTOM = "custom",
	ERROR = "error",
}

/**
 * Runtime type information
 */
export interface TypeInfo {
	category: TypeCategory;
	code: TypeCode;
	description?: string;
	detector: TypeDetector;
	name: string;
}

/**
 * Type detector function
 * Returns true if value matches this type
 */
export type TypeDetector = (value: unknown) => boolean;

/**
 * Type detection result with caching info
 */
export interface DetectionResult {
	cached: boolean;
	code: TypeCode;
	name: string;
	timestamp?: number;
}

/**
 * Lookup table for type codes -> names (for error messages, logging)
 */
export const TYPE_CODE_TO_NAME: Record<TypeCode, string> = {
	[TypeCode.NUMBER]: "number",
	[TypeCode.STRING]: "string",
	[TypeCode.BOOLEAN]: "boolean",
	[TypeCode.FUNCTION]: "function",
	[TypeCode.SYMBOL]: "symbol",
	[TypeCode.BIGINT]: "bigint",
	[TypeCode.NULL]: "null",
	[TypeCode.UNDEFINED]: "undefined",
	[TypeCode.ARRAY]: "array",
	[TypeCode.OBJECT]: "object",
	[TypeCode.DATE]: "Date",
	[TypeCode.MAP]: "Map",
	[TypeCode.SET]: "Set",
	[TypeCode.REGEX]: "RegExp",
	[TypeCode.ERROR]: "Error",
	[TypeCode.CUSTOM]: "custom",
};

/**
 * Reverse lookup: name -> code
 */
export const TYPE_NAME_TO_CODE: Record<string, TypeCode> = {
	number: TypeCode.NUMBER,
	string: TypeCode.STRING,
	boolean: TypeCode.BOOLEAN,
	function: TypeCode.FUNCTION,
	symbol: TypeCode.SYMBOL,
	bigint: TypeCode.BIGINT,
	null: TypeCode.NULL,
	undefined: TypeCode.UNDEFINED,
	array: TypeCode.ARRAY,
	object: TypeCode.OBJECT,
	Date: TypeCode.DATE,
	Map: TypeCode.MAP,
	Set: TypeCode.SET,
	RegExp: TypeCode.REGEX,
	Error: TypeCode.ERROR,
};

/**
 * Well-known symbols for type metadata
 */
export const TypeSymbols = {
	TYPE_CODE: Symbol.for("ts-collections:type:code"),
	TYPE_NAME: Symbol.for("ts-collections:type:name"),
	TYPE_CATEGORY: Symbol.for("ts-collections:type:category"),
	CUSTOM_DETECTOR: Symbol.for("ts-collections:type:detector"),
	TYPED_COLLECTION: Symbol.for("ts-collections:decorator:typed"),
};

/**
 * Default type detectors (optimized for performance)
 */
export const DefaultDetectors: Record<TypeCode, TypeDetector> = {
	[TypeCode.NUMBER]: (val): val is number => typeof val === "number",
	[TypeCode.STRING]: (val): val is string => typeof val === "string",
	[TypeCode.BOOLEAN]: (val): val is boolean => typeof val === "boolean",
	[TypeCode.FUNCTION]: (val): val is (...args: unknown[]) => unknown =>
		typeof val === "function",
	[TypeCode.SYMBOL]: (val): val is symbol => typeof val === "symbol",
	[TypeCode.BIGINT]: (val): val is bigint => typeof val === "bigint",
	[TypeCode.NULL]: (val): val is null => val === null,
	[TypeCode.UNDEFINED]: (_val): _val is undefined =>
		typeof _val === "undefined",
	[TypeCode.ARRAY]: (val): val is unknown[] => Array.isArray(val),
	[TypeCode.OBJECT]: (val): val is object =>
		val !== null && typeof val === "object",
	[TypeCode.DATE]: (val): val is Date => val instanceof Date,
	[TypeCode.MAP]: (val): val is Map<unknown, unknown> =>
		val instanceof Map || val instanceof WeakMap,
	[TypeCode.SET]: (val): val is Set<unknown> =>
		val instanceof Set || val instanceof WeakSet,
	[TypeCode.REGEX]: (val): val is RegExp => val instanceof RegExp,
	[TypeCode.ERROR]: (val): val is Error => val instanceof Error,
	[TypeCode.CUSTOM]: (_val): boolean => false,
};

/**
 * Global type registry for custom types
 * Maps type names to their type information
 */
export const GlobalTypeRegistry = new Map<string, TypeInfo>();

/**
 * Register a custom type with the type system
 * @param name - Unique type name
 * @param detector - Function to detect this type
 * @param category - Type category
 * @param code - Optional numeric code (auto-assigned if omitted)
 */
export function registerCustomType(
	name: string,
	detector: TypeDetector,
	category: TypeCategory = TypeCategory.CUSTOM,
	code: TypeCode = TypeCode.CUSTOM
): void {
	if (GlobalTypeRegistry.has(name)) {
		throw new Error(`Type '${name}' is already registered`);
	}

	GlobalTypeRegistry.set(name, {
		code,
		name,
		category,
		detector,
		description: `Custom type: ${name}`,
	});
}

/**
 * Unregister a custom type
 */
export function unregisterCustomType(name: string): boolean {
	return GlobalTypeRegistry.delete(name);
}

/**
 * Get registered type by name
 */
export function getRegisteredType(name: string): TypeInfo | undefined {
	return GlobalTypeRegistry.get(name);
}

/**
 * Get all registered custom types
 */
export function getAllRegisteredTypes(): TypeInfo[] {
	return Array.from(GlobalTypeRegistry.values());
}

/**
 * Clear all custom type registrations (mainly for testing)
 */
export function clearCustomTypeRegistry(): void {
	GlobalTypeRegistry.clear();
}
