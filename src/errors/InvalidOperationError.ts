import { BaseCollectionError } from "./BaseCollectionError";
import type { ErrorContext } from "./ErrorContext";

export class InvalidOperationError extends BaseCollectionError {
	operationName: string;
	currentState?: string;

	constructor(
		operationName: string,
		context: ErrorContext,
		currentState?: string,
		originalError?: Error
	) {
		const message = `Invalid operation: ${operationName}${currentState ? ` in state ${currentState}` : ""}`;
		super("INVALID_OPERATION", message, context, originalError);
		this.operationName = operationName;
		if (currentState) {
			this.currentState = currentState;
		}
		Object.setPrototypeOf(this, InvalidOperationError.prototype);
	}

	override toJSON(): object {
		return {
			...super.toJSON(),
			operationName: this.operationName,
			currentState: this.currentState,
		};
	}
}
