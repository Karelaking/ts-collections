import { z } from "zod";

interface ValidationMessageOptions {
  collectionName: string;
  method: string;
  failureLabel: string;
  value: unknown;
  methodArgs?: unknown[] | undefined;
  suffix?: string | undefined;
}

const TYPE_MISMATCH_PATTERN = /^(?:(?:Key|Value) )?type mismatch: expected (.+), but got .+$/i;

/**
 * Builds a consistent, context-rich runtime validation error message.
 */
export function buildValidationMessage(
  options: ValidationMessageOptions,
  error: unknown
): string {
  const methodCall = formatMethodCall(
    options.collectionName,
    options.method,
    options.methodArgs
  );
  const detail = formatValidationDetail(error, options.value);
  const suffix = options.suffix ?? "";

  return `${methodCall} ${options.failureLabel}: ${detail}${suffix}`;
}

function formatMethodCall(
  collectionName: string,
  method: string,
  methodArgs: unknown[] = []
): string {
  const args = methodArgs.map(formatInlineValue).join(", ");
  return `${collectionName}.${method}(${args})`;
}

function formatValidationDetail(error: unknown, value: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues.map(issue => formatZodIssue(issue, value)).join("; ");
  }

  const message = error instanceof Error ? error.message : String(error);
  return normalizeValidationMessage(message, value);
}

function formatZodIssue(
  issue: z.core.$ZodIssue,
  value: unknown
): string {
  const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";

  if (issue.path.length === 0 && issue.code === "invalid_type" && "expected" in issue) {
    return `${path}Expected ${String(issue.expected)} but received ${describeValue(value)}`;
  }

  if (issue.path.length === 0) {
    return `${path}${issue.message} (received ${describeValue(value)})`;
  }

  return `${path}${issue.message}`;
}

function normalizeValidationMessage(message: string, value: unknown): string {
  const mismatch = message.match(TYPE_MISMATCH_PATTERN);
  if (mismatch) {
    return `Expected ${mismatch[1]} but received ${describeValue(value)}`;
  }

  if (message === "Type validation failed: element does not match the expected type") {
    return `Element did not pass custom validation (received ${describeValue(value)})`;
  }

  if (message === "Key validation failed: key does not match the expected type") {
    return `Key did not pass custom validation (received ${describeValue(value)})`;
  }

  if (message === "Value validation failed: value does not match the expected type") {
    return `Value did not pass custom validation (received ${describeValue(value)})`;
  }

  return `${message} (received ${describeValue(value)})`;
}

function describeValue(value: unknown): string {
  const valueType = getValueType(value);

  if (valueType === "null" || valueType === "undefined") {
    return valueType;
  }

  return `${valueType} ${formatInlineValue(value)}`;
}

function getValueType(value: unknown): string {
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

function formatInlineValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "bigint") {
    return `${value.toString()}n`;
  }

  if (typeof value === "function") {
    return value.name ? `[Function ${value.name}]` : "[Function anonymous]";
  }

  if (typeof value === "symbol") {
    return String(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  const serialized = safeSerialize(value);
  return serialized.length > 80 ? `${serialized.slice(0, 77)}...` : serialized;
}

function safeSerialize(value: unknown): string {
  try {
    const serialized = JSON.stringify(value);
    if (serialized !== undefined) {
      return serialized;
    }
  } catch {
    // Fall through to String() for circular or non-serializable values.
  }

  return String(value);
}
