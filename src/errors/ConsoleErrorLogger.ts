import type { ErrorContext } from "./ErrorContext";
import type { IErrorLogger } from "./IErrorLogger";

export class ConsoleErrorLogger implements IErrorLogger {
	private static readonly TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss";

	private getTimestamp(): string {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, "0");
		const date = String(now.getDate()).padStart(2, "0");
		const hours = String(now.getHours()).padStart(2, "0");
		const minutes = String(now.getMinutes()).padStart(2, "0");
		const seconds = String(now.getSeconds()).padStart(2, "0");
		return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
	}

	private formatContext(context?: ErrorContext): string {
		if (!context) {
			return "";
		}
		const parts: string[] = [];
		if (context.collectionType) {
			parts.push(`[${context.collectionType}]`);
		}
		if (context.operation) {
			parts.push(`${context.operation}`);
		}
		return parts.length > 0 ? ` ${parts.join(" ")}` : "";
	}

	error(message: string, error?: Error, context?: ErrorContext): void {
		const timestamp = this.getTimestamp();
		const contextStr = this.formatContext(context);
		console.error(`[${timestamp}] ERROR${contextStr}: ${message}`);
		if (error) {
			console.error(error);
		}
	}

	warn(message: string, context?: ErrorContext): void {
		const timestamp = this.getTimestamp();
		const contextStr = this.formatContext(context);
		console.warn(`[${timestamp}] WARN${contextStr}: ${message}`);
	}

	info(message: string, context?: ErrorContext): void {
		const timestamp = this.getTimestamp();
		const contextStr = this.formatContext(context);
		// eslint-disable-next-line no-console
		console.warn(`[${timestamp}] INFO${contextStr}: ${message}`);
	}

	debug(message: string, context?: ErrorContext): void {
		const timestamp = this.getTimestamp();
		const contextStr = this.formatContext(context);
		// eslint-disable-next-line no-console
		console.warn(`[${timestamp}] DEBUG${contextStr}: ${message}`);
	}
}
