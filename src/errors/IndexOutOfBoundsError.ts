import { BaseCollectionError } from "./BaseCollectionError";
import type { ErrorContext } from "./ErrorContext";

export class IndexOutOfBoundsError extends BaseCollectionError {
	index: number;
	size: number;

	constructor(
		index: number,
		size: number,
		context: ErrorContext,
		originalError?: Error
	) {
		const message = `Index ${index} out of bounds for size ${size}`;
		super("INDEX_OUT_OF_BOUNDS", message, context, originalError);
		this.index = index;
		this.size = size;
		Object.setPrototypeOf(this, IndexOutOfBoundsError.prototype);
	}

	override toJSON(): object {
		return {
			...super.toJSON(),
			index: this.index,
			size: this.size,
		};
	}
}
