import { BaseCollectionError } from "./BaseCollectionError";
import type { ErrorContext } from "./ErrorContext";

export interface ValidationIssue {
	code: string;
	expected?: string;
	message: string;
	path: string;
	received?: string;
}

export class ValidationError extends BaseCollectionError {
	issues: ValidationIssue[];
	received?: unknown;

	constructor(
		message: string,
		issues: ValidationIssue[],
		context: ErrorContext,
		received?: unknown,
		originalError?: Error
	) {
		super("VALIDATION_ERROR", message, context, originalError);
		this.issues = issues;
		this.received = received;
		Object.setPrototypeOf(this, ValidationError.prototype);
	}

	protected override formatMessage(): string {
		const base = super.formatMessage();
		if (this.issues.length > 0) {
			const issueList = this.issues
				.map((issue) => `  - ${issue.path}: ${issue.message}`)
				.join("\n");
			return `${base}\nValidation issues:\n${issueList}`;
		}
		return base;
	}

	override toJSON(): object {
		return {
			...super.toJSON(),
			issues: this.issues,
			received: this.received,
		};
	}
}
