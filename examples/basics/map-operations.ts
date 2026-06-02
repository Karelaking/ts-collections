import { HashMap } from "ts-collections";

// Create a HashMap where:
// key = string
// value = number
const map = new HashMap<string, number>();

// Add key-value pairs into the map
map.put("apple", 10);
map.put("banana", 20);

// Retrieve value associated with key "apple"
console.log(map.get("apple")); // Output: 10

// Check if key "banana" exists in the map
console.log(map.containsKey("banana")); // Output: true

// Remove the key "banana" from the map
map.remove("banana");

// Print the current number of entries in the map
console.log("Size:", map.size());
