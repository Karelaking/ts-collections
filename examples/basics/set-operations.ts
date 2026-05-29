import { HashSet } from "ts-collections";

const set = new HashSet<number>();

set.add(1);
set.add(2);
set.add(2); // ignored duplicate

console.log(set.contains(1));

const it = set.iterator();
while (it.hasNext()) {
	console.log(it.next());
}

set.remove(1);
console.log("Size:", set.size());
