/**
 * Static collection utilities, mirroring parts of Java's `java.util.Collections`.
 * All functions are pure and operate on any `Iterable`.
 */

/**
 * Count how many elements of `elements` equal `target`.
 *
 * Uses SameValueZero equality, so `NaN` matches `NaN` (unlike `===`).
 *
 * @param elements - the iterable to scan
 * @param target - the value to count occurrences of
 * @returns the number of matching elements (0 if none)
 */
export function frequency<T>(elements: Iterable<T>, target: T): number {
	let count = 0;
	for (const element of elements) {
		// SameValueZero: `===` plus the NaN-matches-NaN case.
		if (element === target || (element !== element && target !== target)) {
			count++;
		}
	}
	return count;
}

/**
 * Determine whether two iterables share no elements.
 *
 * Returns `true` when `a` and `b` have no element in common — including when
 * either is empty (matching Java's `Collections.disjoint`).
 *
 * @param a - the first iterable
 * @param b - the second iterable
 * @returns `true` if the two have no element in common
 */
export function disjoint<T>(a: Iterable<T>, b: Iterable<T>): boolean {
	const seen = new Set<T>(a);
	for (const element of b) {
		if (seen.has(element)) {
			return false;
		}
	}
	return true;
}
