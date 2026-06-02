import { ArrayList } from "ts-collections";

// Creating a list
const list = new ArrayList<string>();

// Adding elements
list.add("apple");
list.add("banana");
list.add("orange");

// Getting elements
console.log("First element:", list.get(0));

// Removing elements
list.remove("banana");

// Iterating
const iterator = list.iterator();
while (iterator.hasNext()) {
	console.log("Item:", iterator.next());
}

// Size check
console.log("Size:", list.size());
