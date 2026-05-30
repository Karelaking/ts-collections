import type { ErrorContext } from "./ErrorContext";
import type { ICollectionError } from "./ICollectionError";

export abstract class BaseCollectionError
	extends Error
	implements ICollectionError
{
	code: string;
	context: ErrorContext;
	originalError?: Error;

	constructor(
		code: string,
		message: string,
		context: ErrorContext,
		originalError?: Error
	) {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		this.context = context;
		if (originalError) {
			this.originalError = originalError;
		}

		Object.setPrototypeOf(this, BaseCollectionError.prototype);
	}

	protected formatMessage(): string {
		return `[${this.code}] ${this.message}`;
	}

	override toString(): string {
		const msg = this.formatMessage();
		const ctx = this.formatContext();
		return ctx ? `${msg}\n${ctx}` : msg;
	}

	protected formatContext(): string {
		const parts: string[] = [];

		if (this.context.collectionType) {
			parts.push(`Collection: ${this.context.collectionType}`);
		}
		if (this.context.operation) {
			parts.push(`Operation: ${this.context.operation}`);
		}

		const additionalKeys = Object.keys(this.context).filter(
			(key) => !["collectionType", "operation"].includes(key)
		);

		additionalKeys.forEach((key) => {
			const value = this.context[key];
			parts.push(`${key}: ${JSON.stringify(value)}`);
		});

		return parts.length > 0 ? parts.join("\n") : "";
	}

	toJSON(): object {
		return {
			name: this.name,
			code: this.code,
			message: this.message,
			context: this.context,
			stack: this.stack,
			...(this.originalError && {
				originalError: {
					name: this.originalError.name,
					message: this.originalError.message,
					stack: this.originalError.stack,
				},
			}),
		};
	}
}
