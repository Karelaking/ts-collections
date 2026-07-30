/**
 * Async iterator interface for traversing collection elements asynchronously.
 * Follows the TC39 AsyncIterable protocol and mirrors the synchronous Iterator
 * interface, returning Promises instead of values directly.
 *
 * @template E The type of elements in the iteration
 *
 * @example
 * const list = new ArrayList<string>();
 * list.add("a");
 * list.add("b");
 *
 * // Use the async iterator explicitly
 * const asyncIt = list.asyncIterator();
 * while (await asyncIt.hasNext()) {
 *   console.log(await asyncIt.next());
 * }
 *
 * // Or use for-await-of via Symbol.asyncIterator
 * for await (const item of list) {
 *   console.log(item);
 * }
 */
export interface AsyncIterator<E> {
	/**
	 * Returns a Promise that resolves to true if the iteration has more elements.
	 */
	hasNext(): Promise<boolean>;

	/**
	 * Returns a Promise that resolves to the next element in the iteration.
	 *
	 * @throws Error if the iteration has no more elements
	 */
	next(): Promise<E>;
}
