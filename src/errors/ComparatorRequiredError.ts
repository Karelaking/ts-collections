import { BaseCollectionError } from "./BaseCollectionError";
import type { ErrorContext } from "./ErrorContext";

export class ComparatorRequiredError extends BaseCollectionError {
	subject: string;

	constructor(
		context: ErrorContext,
		subject = "element",
		originalError?: Error
	) {
		const message = `Comparator is required for non-primitive ${subject} types`;
		super("COMPARATOR_REQUIRED", message, context, originalError);
		this.subject = subject;
		Object.setPrototypeOf(this, ComparatorRequiredError.prototype);
	}

	override toJSON(): object {
		return {
			...super.toJSON(),
			subject: this.subject,
		};
	}
}
