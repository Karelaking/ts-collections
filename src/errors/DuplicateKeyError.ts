import { BaseCollectionError } from "./BaseCollectionError";
import type { ErrorContext } from "./ErrorContext";

export class DuplicateKeyError extends BaseCollectionError {
	key: unknown;

	constructor(key: unknown, context: ErrorContext, originalError?: Error) {
		const message = `Duplicate key: ${JSON.stringify(key)}`;
		super("DUPLICATE_KEY", message, context, originalError);
		this.key = key;
		Object.setPrototypeOf(this, DuplicateKeyError.prototype);
	}

	override toJSON(): object {
		return {
			...super.toJSON(),
			key: this.key,
		};
	}
}
