# Collection Conversion Guide

This guide demonstrates common patterns for working with native JavaScript collections and ts-collections data structures.

## Array → ArrayList

```ts
import { ArrayList } from "ts-collections";

const numbers = [1, 2, 3, 4];

const list = new ArrayList<number>();
numbers.forEach(num => list.add(num));
```

## ArrayList → Array

```ts
const numbersArray = Array.from(list);
```

## Set → HashSet

```ts
import { HashSet } from "ts-collections";

const nativeSet = new Set(["apple", "banana", "orange"]);

const hashSet = new HashSet<string>();
nativeSet.forEach(item => hashSet.add(item));
```

## HashSet → Array

```ts
const items = Array.from(hashSet);
```

## Map → HashMap

```ts
import { HashMap } from "ts-collections";

const nativeMap = new Map<string, number>([
  ["A", 1],
  ["B", 2]
]);

const hashMap = new HashMap<string, number>();

nativeMap.forEach((value, key) => {
  hashMap.put(key, value);
});
```

## HashMap Usage

```ts
const value = hashMap.get("A");
```

## Iterating Collections

### ArrayList

```ts
for (const item of list) {
  console.log(item);
}
```

### HashSet

```ts
for (const item of hashSet) {
  console.log(item);
}
```

## Using the Spread Operator

```ts
const arrayFromList = [...list];
const arrayFromSet = [...hashSet];
```

## Notes

- Use `Array.from()` when converting iterable collections to arrays.
- Use collection APIs such as `add()` and `put()` when populating ts-collections structures.
- Choose the collection type that best fits your use case.