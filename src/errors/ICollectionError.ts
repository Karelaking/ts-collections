import type { ErrorContext } from "./ErrorContext";

export interface ICollectionError extends Error {
	code: string;
	context: ErrorContext;
	originalError?: Error;
	toJSON(): object;
	toString(): string;
}
