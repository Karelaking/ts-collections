import { ComparatorRequiredError } from "../errors";

function compareNullishValues(a: unknown, b: unknown): number | undefined {
	if (a === null && b === null) {
		return 0;
	}
	if (a === null) {
		return -1;
	}
	if (b === null) {
		return 1;
	}
	if (a === undefined && b === undefined) {
		return 0;
	}
	if (a === undefined) {
		return -1;
	}
	if (b === undefined) {
		return 1;
	}

	return;
}

function compareStrings(a: string, b: string): number {
	if (a < b) {
		return -1;
	}
	if (a > b) {
		return 1;
	}
	return 0;
}

function compareBigInts(a: bigint, b: bigint): number {
	if (a < b) {
		return -1;
	}
	if (a > b) {
		return 1;
	}
	return 0;
}

/**
 * Compares two comparable values using a predictable ordering.
 *
 * Supports null, undefined, numbers, strings, bigints, booleans, and Date objects.
 * For other types, callers should supply a custom comparator.
 */
export function compareComparableValues<T>(
	a: T,
	b: T,
	subject = "element"
): number {
	const nullishComparison = compareNullishValues(a, b);
	if (nullishComparison !== undefined) {
		return nullishComparison;
	}

	if (typeof a === "number" && typeof b === "number") {
		return a - b;
	}

	if (typeof a === "string" && typeof b === "string") {
		return compareStrings(a, b);
	}

	if (typeof a === "bigint" && typeof b === "bigint") {
		return compareBigInts(a, b);
	}

	if (typeof a === "boolean" && typeof b === "boolean") {
		return Number(a) - Number(b);
	}

	if (a instanceof Date && b instanceof Date) {
		return a.getTime() - b.getTime();
	}

	throw new ComparatorRequiredError(
		{
			collectionType: "Comparable",
			operation: "compare",
		},
		subject
	);
}
