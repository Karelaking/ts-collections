import { z, type ZodSchema, ZodError } from 'zod';

/**
 * Result type for validation operations
 * Represents either a successful validation or a validation error
 */
export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: ValidationError };

/**
 * Structured validation error with detailed information
 */
export interface ValidationError {
  message: string;
  issues: ValidationIssue[];
  rawError: Error;
}

/**
 * Individual validation issue
 */
export interface ValidationIssue {
  path: string;
  message: string;
  code: string;
}

/**
 * Safe validation that returns a result instead of throwing
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
    if (error instanceof ZodError) {
      return {
        success: false,
        error: {
          message: error.message,
          issues: error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })),
          rawError: error,
        },
      };
    }
    return {
      success: false,
      error: {
        message: 'Unknown validation error',
        issues: [],
        rawError: error instanceof Error ? error : new Error(String(error)),
      },
    };
  }
}

/**
 * Format validation error as a readable message
 * @param error The validation error to format
 * @returns Formatted error message
 */
export function formatValidationError(error: ValidationError): string {
  if (error.issues.length === 0) {
    return error.message;
  }

  const issueMessages = error.issues
    .map(issue => {
      const path = issue.path ? `${issue.path}: ` : '';
      return `${path}${issue.message}`;
    })
    .join('; ');

  return `Validation failed: ${issueMessages}`;
}

/**
 * Create a type-safe validator function from a Zod schema
 * @param schema The Zod schema
 * @returns A validator function that throws on invalid data
 */
export function createValidator<T>(schema: ZodSchema<T>): (value: unknown) => T {
  return (value: unknown): T => {
    try {
      return schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new TypeError(formatValidationError({
          message: error.message,
          issues: error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })),
          rawError: error,
        }));
      }
      throw error;
    }
  };
}

/**
 * Create a type-safe validator for a collection element with union type support
 * Validates that a value matches one of the provided schemas (e.g., for multi-type collections)
 * @param schemas Array of Zod schemas (union type validation)
 * @returns A validator function that validates against any of the schemas
 */
export function createUnionValidator<T>(
  schemas: ZodSchema<T>[]
): (value: unknown) => T {
  const unionSchema = z.union(schemas as [ZodSchema<T>, ...ZodSchema<T>[]]);
  return createValidator(unionSchema);
}

/**
 * Get type information from a Zod schema for debugging
 * @param schema The Zod schema
 * @returns A string description of the schema
 */
export function getSchemaDescription(schema: ZodSchema<unknown>): string {
  const schemaWithDef = schema as ZodSchema<unknown> & { _def?: { typeName?: string } };
  if (schema instanceof z.ZodObject) {
    const schemaObject = schema as ZodSchema<unknown> & { _shape?: Record<string, unknown> };
    const shape = schemaObject._shape;
    if (!shape) return 'object { }';
    
    const fields = Object.entries(shape)
      .map(([key, value]) => {
        const fieldSchema = value as ZodSchema<unknown> & { _def?: { typeName?: string } };
        return `${key}: ${fieldSchema._def?.typeName || 'unknown'}`;
      })
      .join(', ');
    return `object { ${fields} }`;
  }

  const def = schemaWithDef._def;
  return def?.typeName || 'unknown';
}

/**
 * Extract inferred TypeScript type from a Zod schema
 * This is a type-level helper that should be used at compile time
 * @example
 * const userSchema = z.object({ name: z.string(), age: z.number() });
 * type User = z.infer<typeof userSchema>;
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SchemaType<T extends ZodSchema<any>> = z.infer<T>;

/**
 * Create a composite validator for validating collections with transformation
 * Useful for collections that need to transform or validate elements before storage
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
