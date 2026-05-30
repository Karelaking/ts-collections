import type { ErrorContext } from "./ErrorContext";

export interface IErrorLogger {
	debug(message: string, context?: ErrorContext): void;
	error(message: string, error?: Error, context?: ErrorContext): void;
	info(message: string, context?: ErrorContext): void;
	warn(message: string, context?: ErrorContext): void;
}
