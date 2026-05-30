import { BaseCollectionError } from "./BaseCollectionError";
import type { ErrorContext } from "./ErrorContext";

export class CollectionEmptyError extends BaseCollectionError {
	operationName: string;

	constructor(
		operationName: string,
		context: ErrorContext,
		originalError?: Error
	) {
		const message = `Cannot perform '${operationName}' on empty collection`;
		super("COLLECTION_EMPTY", message, context, originalError);
		this.operationName = operationName;
		Object.setPrototypeOf(this, CollectionEmptyError.prototype);
	}

	override toJSON(): object {
		return {
			...super.toJSON(),
			operationName: this.operationName,
		};
	}
}
