import { ZodError, type ZodSchema, z } from "zod";

/**
 * Result type for validation operations.
 * Represents either a successful validation or a validation error.
 */
export type ValidationResult<T> =
	| { success: true; data: T }
	| { success: false; error: ValidationError };

/**
 * Context for a collection validation failure.
 */
export interface ValidationContext {
	collectionType: string;
	operation: string;
	sizeBefore?: number;
	targetDescription: string;
	targetValue: unknown;
}

/**
 * Structured validation error with detailed information.
 */
export interface ValidationError {
	issues: ValidationIssue[];
	message: string;
	rawError: Error;
}

/**
 * Individual validation issue.
 */
export interface ValidationIssue {
	code: string;
	expected?: string;
	message: string;
	path: string;
	received?: string;
}

function describeType(value: unknown): string {
	if (value === null) {
		return "null";
	}
	if (value === undefined) {
		return "undefined";
	}
	if (Array.isArray(value)) {
		return "array";
	}
	return typeof value;
}

function describeValue(value: unknown): string {
	if (typeof value === "string") {
		return `"${value}"`;
	}
	if (typeof value === "bigint") {
		return `${value}n`;
	}
	if (typeof value === "symbol") {
		return value.toString();
	}
	if (
		typeof value === "number" ||
		typeof value === "boolean" ||
		value === null ||
		value === undefined
	) {
		return String(value);
	}

	try {
		return JSON.stringify(value, (key: string, val: unknown) => {
			if (typeof key === "string" && /password|secret|token|credential|key/i.test(key)) {
				return "[REDACTED]";
			}
			return val;
		});
	} catch {
		return String(value);
	}
}

/**
 * Formats a value for use in contextual failure text.
 *
 * @param value The value to format
 * @returns A readable representation without the runtime type prefix
 */
export function formatValidationContextValue(value: unknown): string {
	return describeValue(value);
}

function describeValueWithType(value: unknown): string {
	const type = describeType(value);
	const renderedValue = describeValue(value);

	if (renderedValue === type) {
		return type;
	}

	return `${type} ${renderedValue}`;
}

/**
 * Describes a value using its runtime type and a readable representation.
 *
 * @param value The value to describe
 * @returns A type-aware description of the value
 */
export function describeValidationValue(value: unknown): string {
	return describeValueWithType(value);
}

function mapIssueDetails(issue: ZodError["issues"][number]): ValidationIssue {
	return {
		path: issue.path.join("."),
		message: issue.message,
		code: issue.code,
		...("expected" in issue ? { expected: String(issue.expected) } : {}),
		...("received" in issue ? { received: String(issue.received) } : {}),
	};
}

/**
 * Converts a thrown error into a structured validation error.
 *
 * @param error The thrown error to normalize
 * @returns A structured validation error representation
 */
export function toValidationError(error: unknown): ValidationError {
	if (error instanceof ZodError) {
		return {
			message: error.message,
			issues: error.issues.map(mapIssueDetails),
			rawError: error,
		};
	}

	return {
		message: "Unknown validation error",
		issues: [],
		rawError: error instanceof Error ? error : new Error(String(error)),
	};
}

function buildValidationHeader(context?: ValidationContext): string {
	if (!context) {
		return "Validation failed";
	}

	const sizeSuffix =
		context.sizeBefore === undefined
			? ""
			: ` (size before operation: ${context.sizeBefore})`;

	return `${context.collectionType}.${context.operation}() validation failed${sizeSuffix}`;
}

function buildIssueMessage(
	issue: ValidationIssue,
	context?: ValidationContext
): string {
	if (!context) {
		if (issue.path) {
			return `${issue.path}: ${issue.message}`;
		}
		return issue.message;
	}

	if (issue.code === "invalid_type" && issue.expected) {
		return `Expected ${issue.expected} for ${context.targetDescription}, but got ${describeValueWithType(context.targetValue)}`;
	}

	if (issue.path) {
		return `${context.targetDescription} (${issue.path}): ${issue.message}`;
	}

	return `${context.targetDescription}: ${issue.message}`;
}

/**
 * Format validation error as a readable message.
 *
 * @param error The validation error to format
 * @param context Optional collection context
 * @returns Formatted error message
 */
export function formatValidationError(
	error: ValidationError,
	context?: ValidationContext
): string {
	if (error.issues.length === 0) {
		return context ? buildValidationHeader(context) : error.message;
	}

	const issueMessages = error.issues
		.map((issue) => buildIssueMessage(issue, context))
		.join("; ");

	return `${buildValidationHeader(context)}: ${issueMessages}`;
}

/**
 * Creates a TypeError with contextual collection validation details.
 *
 * @param error The structured validation error to format
 * @param context Additional collection context to include in the message
 * @returns A TypeError that preserves the original raw error as the cause
 */
export function createCollectionValidationError(
	error: ValidationError,
	context?: ValidationContext
): TypeError {
	return new TypeError(formatValidationError(error, context), {
		cause: error.rawError,
	});
}

/**
 * Safe validation that returns a result instead of throwing.
 *
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @returns A ValidationResult containing either the validated data or an error
 */
export function validateSafe<T>(
	schema: ZodSchema<T>,
	data: unknown
): ValidationResult<T> {
	try {
		const validated = schema.parse(data);
		return { success: true, data: validated };
	} catch (error) {
		return {
			success: false,
			error: toValidationError(error),
		};
	}
}

/**
 * Create a type-safe validator function from a Zod schema.
 *
 * @param schema The Zod schema
 * @param context Optional collection context for error messages
 * @returns A validator function that throws on invalid data
 */
export function createValidator<T>(
	schema: ZodSchema<T>,
	context?: ValidationContext
): (value: unknown) => T {
	return (value: unknown): T => {
		try {
			return schema.parse(value);
		} catch (error) {
			if (error instanceof ZodError) {
				throw createCollectionValidationError(
					toValidationError(error),
					context
				);
			}
			throw error;
		}
	};
}

/**
 * Create a type-safe validator for a collection element with union type support.
 * Validates that a value matches one of the provided schemas (e.g., for multi-type collections)
 *
 * @param schemas Array of Zod schemas (union type validation)
 * @returns A validator function that validates against any of the schemas
 */
export function createUnionValidator<T>(
	schemas: ZodSchema<T>[],
	context?: ValidationContext
): (value: unknown) => T {
	const unionSchema = z.union(schemas as [ZodSchema<T>, ...ZodSchema<T>[]]);
	return createValidator(unionSchema, context);
}

/**
 * Get type information from a Zod schema for debugging.
 *
 * @param schema The Zod schema
 * @returns A string description of the schema
 */
export function getSchemaDescription(schema: ZodSchema<unknown>): string {
	const schemaWithDef = schema as ZodSchema<unknown> & {
		_def?: { typeName?: string };
	};
	if (schema instanceof z.ZodObject) {
		const schemaObject = schema as ZodSchema<unknown> & {
			_shape?: Record<string, unknown>;
		};
		const shape = schemaObject._shape;
		if (!shape) {
			return "object { }";
		}

		const fields = Object.entries(shape)
			.map(([key, value]) => {
				const fieldSchema = value as ZodSchema<unknown> & {
					_def?: { typeName?: string };
				};
				return `${key}: ${fieldSchema._def?.typeName || "unknown"}`;
			})
			.join(", ");
		return `object { ${fields} }`;
	}

	const def = schemaWithDef._def;
	return def?.typeName || "unknown";
}

/**
 * Extract inferred TypeScript type from a Zod schema.
 * This is a type-level helper that should be used at compile time.
 *
 * @example
 * const userSchema = z.object({ name: z.string(), age: z.number() });
 * type User = z.infer<typeof userSchema>;
 */
export type SchemaType<T extends ZodSchema<unknown>> = z.infer<T>;

/**
 * Create a composite validator for validating collections with transformation.
 * Useful for collections that need to transform or validate elements before storage.
 *
 * @param schema The Zod schema for individual elements
 * @param transform Optional transformation function
 * @returns A validator that validates and optionally transforms
 */
export function createTransformingValidator<T, U>(
	schema: ZodSchema<T>,
	transform?: (value: T) => U
): (value: unknown) => U {
	return (value: unknown): U => {
		const validated = schema.parse(value) as T;
		return transform ? transform(validated) : (validated as unknown as U);
	};
}
