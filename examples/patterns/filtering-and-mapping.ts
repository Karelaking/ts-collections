import { ArrayList } from "ts-collections";

const list = new ArrayList<number>();

for (let i = 1; i <= 10; i++) {
	list.add(i);
}

// FILTER (manual)
const evens = new ArrayList<number>();
const it1 = list.iterator();

while (it1.hasNext()) {
	const val = it1.next();
	if (val % 2 === 0) {
		evens.add(val);
	}
}

// MAP (manual)
const squares = new ArrayList<number>();
const it2 = evens.iterator();

while (it2.hasNext()) {
	const val = it2.next();
	squares.add(val * val);
}

console.log("Evens:", evens.toString());
console.log("Squares:", squares.toString());
