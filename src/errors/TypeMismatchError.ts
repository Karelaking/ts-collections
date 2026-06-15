import { BaseCollectionError } from "./BaseCollectionError";
import type { ErrorContext } from "./ErrorContext";

export class TypeMismatchError extends BaseCollectionError {
	expected: string;
	received: string;
	path?: string;

	constructor(
		expected: string,
		received: string,
		context: ErrorContext,
		path?: string,
		originalError?: Error
	) {
		const message = `Type mismatch: expected ${expected}, received ${received}${path ? ` at ${path}` : ""}`;
		super("TYPE_MISMATCH", message, context, originalError);
		this.expected = expected;
		this.received = received;
		if (path) {
			this.path = path;
		}
		Object.setPrototypeOf(this, TypeMismatchError.prototype);
	}

	override toJSON(): object {
		return {
			...super.toJSON(),
			expected: this.expected,
			received: this.received,
			path: this.path,
		};
	}
}
