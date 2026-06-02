import { HashMap } from "ts-collections";

const cache = new HashMap<string, number>();

function expensiveComputation(n: number): number {
	const key = n.toString();

	if (cache.containsKey(key)) {
		console.log("Cache hit:", key);
		const cachedValue = cache.get(key);
		if (cachedValue === undefined) {
			throw new Error("Cache entry was expected but not found");
		}
		return cachedValue;
	}
	console.log("Computing:", key);

	const result = n * n;
	cache.put(key, result);

	return result;
}

console.log(expensiveComputation(5));
console.log(expensiveComputation(5));
console.log(expensiveComputation(10));
