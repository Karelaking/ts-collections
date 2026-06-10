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

The exact conversion method depends on the APIs provided by `ArrayList`.

Refer to the collection's traversal or conversion methods (such as `toArray()` if available) for converting an `ArrayList` back to a native JavaScript array.

## Set → HashSet

```ts
import { HashSet } from "ts-collections";

const nativeSet = new Set(["apple", "banana", "orange"]);

const hashSet = new HashSet<string>();
nativeSet.forEach(item => hashSet.add(item));
```

## HashSet → Array

The exact conversion method depends on the APIs provided by `HashSet`.

Refer to the collection's traversal or conversion methods (such as `toArray()` or iterator-based traversal if available) for converting a `HashSet` back to a native JavaScript array.

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

## HashMap → Map

```ts
const nativeMap = new Map<string, number>();

for (const [key, value] of hashMap.entries()) {
  nativeMap.set(key, value);
}
```

## Notes

- Use collection APIs such as `add()` and `put()` when populating ts-collections structures.
- Choose the collection type that best fits your use case.