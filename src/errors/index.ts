// Base error classes and interfaces
export { BaseCollectionError } from "./BaseCollectionError";
export { CollectionEmptyError } from "./CollectionEmptyError";
export { ComparatorRequiredError } from "./ComparatorRequiredError";
export { ConsoleErrorLogger } from "./ConsoleErrorLogger";
export { DuplicateKeyError } from "./DuplicateKeyError";
export type { ErrorContext } from "./ErrorContext";
export type { ICollectionError } from "./ICollectionError";
// Logger
export type { IErrorLogger } from "./IErrorLogger";
export { IndexOutOfBoundsError } from "./IndexOutOfBoundsError";
export { InvalidOperationError } from "./InvalidOperationError";
export { TypeMismatchError } from "./TypeMismatchError";
// Specific error classes
export { ValidationError, type ValidationIssue } from "./ValidationError";
