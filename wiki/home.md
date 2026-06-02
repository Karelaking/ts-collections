# 🎯 TypeScript Collections Framework

> **A production-ready, type-safe Collections Framework for TypeScript, inspired by Java's proven design patterns.**

---

## ✨ Welcome to ts-collections

**ts-collections** brings the power and familiarity of Java's Collections API to TypeScript, combined with modern runtime type validation, strict typing, and excellent developer experience.

Whether you're building a complex data-intensive application or need reliable, well-tested data structures, ts-collections has you covered.

### 🌟 Core Features

| Feature                           | Description                                                      |
| --------------------------------- | ---------------------------------------------------------------- |
| 🔒 **Full TypeScript Support**    | Strict generics, no `any` types, complete type inference         |
| ✅ **Runtime Type Validation**    | Optional Zod schemas or custom validators for bulletproof safety |
| 🎓 **Java-Inspired API**          | Familiar patterns for developers from Java backgrounds           |
| 📦 **Zero Required Dependencies** | Zod is optional—use it when you need advanced validation         |
| ⚙️ **Industry-Grade Quality**     | SOLID principles, >80% test coverage, comprehensive edge cases   |
| 🌳 **Tree-Shakeable ESM**         | Dead code elimination, minimal bundle footprint                  |
| ⚡ **High Performance**           | Optimized algorithms with clear time complexity guarantees       |
| 📖 **Well Documented**            | Complete API docs, examples, and architectural guides            |

---

## � Installation & Setup

### Quick Install

Choose your package manager:

```bash
# 🚀 Using pnpm (recommended for monorepos)
pnpm add ts-collections

# 📦 Using npm
npm install ts-collections

# 🧶 Using yarn
yarn add ts-collections
```

### Optional: Zod Integration

For advanced schema validation features:

```bash
pnpm add zod  # Install alongside ts-collections
```

### Verify Installation

```typescript
import { ArrayList, LinkedStack, HashMap } from "ts-collections";

const list = new ArrayList<number>();
console.log("✅ Installation successful!");
```

---

## 🚀 Quick Start Guide

### 📝 Lists — Ordered Collections

**Use when:** You need to maintain element order and access by index.

```typescript
import { ArrayList, LinkedList } from "ts-collections";

// ⚡ ArrayList: Fast random access (array-backed)
const list = new ArrayList<number>();
list.add(10);
list.add(20);
list.addAt(1, 15); // Insert at index 1
list.set(0, 5); // Replace element at index 0
console.log(list.get(1)); // 15
console.log(list.toArray()); // [5, 15, 20]

// 🔗 LinkedList: Fast insertion at ends (doubly-linked)
const linked = new LinkedList<string>();
linked.addFirst("start"); // O(1) - efficient
linked.addLast("end"); // O(1) - efficient
linked.removeFirst(); // Returns "start"

// Iterate with reverse support
const iterator = linked.reverseIterator();
while (iterator.hasNext()) {
  console.log(iterator.next()); // "end"
}
```

**When to use:**

- **ArrayList**: Random access, append-heavy workloads, moderate inserts
- **LinkedList**: Frequent insertion/deletion at both ends, bidirectional traversal

---

### 🎯 Sets — Unique Collections

**Use when:** You need to ensure no duplicates and fast membership testing.

```typescript
import { HashSet } from "ts-collections";

const set = new HashSet<string>();
set.add("apple");
set.add("banana");
set.add("apple"); // Duplicate ignored
set.add("orange");

console.log(set.size()); // 3 (not 4)
console.log(set.contains("banana")); // true

// Iterate through unique values
for (const item of set.iterator()) {
  console.log(item); // "apple", "banana", "orange" (order not guaranteed)
}

// Check subset relationships
const otherSet = new HashSet<string>();
otherSet.add("apple");
console.log(set.containsAll(otherSet)); // true
```

**Perfect for:**

- Deduplication
- Membership testing
- Set operations (intersection, union)
- Unique tag/label collections

---

### 🗺️ Maps — Key-Value Storage

**Use when:** You need fast lookups by key.

```typescript
import { HashMap } from "ts-collections";

const map = new HashMap<string, number>();
map.put("age", 25);
map.put("count", 100);
map.put("score", 95);

console.log(map.get("age")); // 25
console.log(map.containsKey("age")); // true
console.log(map.size()); // 3

map.remove("count"); // Remove entry
console.log(map.size()); // 2

// Get all keys and values
const keys = map.keys(); // Collection<string>
const values = map.values(); // Collection<number>

// Iterate entries
for (const key of keys.iterator()) {
  console.log(`${key}: ${map.get(key)}`);
}
```

**Ideal for:**

- Config/settings storage
- Caching
- Lookup tables
- Grouping data by key

---

### 🔄 Queues — FIFO Processing

**Use when:** You need First-In-First-Out processing (event loops, task queues).

```typescript
import { LinkedQueue } from "ts-collections";

const queue = new LinkedQueue<string>();

// Enqueue elements
queue.offer("task1");
queue.offer("task2");
queue.offer("task3");

console.log(queue.peek()); // "task1" (inspect head)
console.log(queue.size()); // 3 (unchanged)

// Process queue
while (!queue.isEmpty()) {
  const task = queue.poll(); // Dequeue
  console.log(`Processing: ${task}`);
  // Output: Processing: task1, Processing: task2, Processing: task3
}

// Alternative API
queue.offer("urgent");
const item = queue.dequeue(); // Alias for poll()
```

**Use cases:**

- Event queues
- Job processors
- Request handling (web servers)
- Message processing systems

---

### 📚 Stacks — LIFO Processing

**Use when:** You need Last-In-First-Out processing (undo/redo, call stacks).

```typescript
import { LinkedStack } from "ts-collections";

const stack = new LinkedStack<string>();

// Push elements
stack.push("page1");
stack.push("page2");
stack.push("page3");

// Browser back navigation
console.log(stack.peek()); // "page3" (inspect top)
console.log(stack.pop()); // "page3" (remove and return)
console.log(stack.pop()); // "page2"
console.log(stack.pop()); // "page1"

// Undo/Redo pattern
const edits = new LinkedStack<string>();
edits.push("typed 'hello'");
edits.push("added '!'");

// Undo
const lastEdit = edits.pop(); // "added '!'"
console.log(`Undid: ${lastEdit}`);
```

**Perfect for:**

- Browser history (back button)
- Undo/redo functionality
- Expression parsing
- Depth-first search (DFS) algorithms
- Function call stacks

---

## 🔒 Type Safety: The Smart Default

### Automatic Type Enforcement

Collections enforce type consistency automatically—**no configuration needed**. The type is inferred from the first element added:

```typescript
const list = new ArrayList<number>();
list.add(1); // ✅ OK
list.add(2); // ✅ OK
list.add("text"); // ❌ TypeError: type mismatch (automatic!)
// Expected: number, but got: string

const set = new HashSet<string>();
set.add("hello"); // ✅ OK
set.add(42); // ❌ TypeError: type mismatch
```

### Why This Matters

Just like Java's type-safe collections, ts-collections prevent accidental type mismatches at **runtime**, catching bugs before they propagate:

```typescript
// Without runtime validation (plain JS)
const data = [];
data.push(10);
data.push("oops");
data.push({ id: 5 });
// Now you have mixed types—bugs waiting to happen!

// With ts-collections (safe by default)
const safeData = new ArrayList<number>();
safeData.add(10); // ✅ OK
safeData.add("oops"); // ❌ Caught immediately!
```

### Zero Setup

Unlike many validation libraries, you don't need to write schemas or validators. It just works:

```typescript
import { LinkedQueue } from "ts-collections";

// Type safety—instant. No boilerplate.
const queue = new LinkedQueue<{ id: number; name: string }>();
queue.offer({ id: 1, name: "Alice" }); // ✅ OK
queue.offer({ id: 2, name: "Bob" }); // ✅ OK
queue.offer({ id: 3, name: "Charlie" }); // ✅ OK
queue.offer({ id: 4 }); // ❌ Error: missing "name"
```

---

## 🛡️ Advanced Validation (Power Users)

Beyond the default type checking, ts-collections supports **Zod schemas** and **custom validators** for sophisticated validation requirements.

### Zod Schema Validation

Perfect for validating complex constraints:

```typescript
import { ArrayList } from "ts-collections";
import { z } from "zod";

// ✨ Define precise validation rules
const positiveInt = z.number().int().positive();

const numbers = new ArrayList<number>({
  schema: positiveInt,
});

numbers.add(42); // ✅ Valid
numbers.add(-1); // ❌ Validation failed: Number must be greater than 0
numbers.add(3.14); // ❌ Validation failed: Expected integer

// Complex objects
const userSchema = z.object({
  id: z.number().positive(),
  email: z.string().email(),
  age: z.number().min(18).max(120),
});

const users = new ArrayList<z.infer<typeof userSchema>>({
  schema: userSchema,
});

users.add({ id: 1, email: "alice@example.com", age: 25 }); // ✅ OK
users.add({ id: 2, email: "invalid", age: 25 }); // ❌ Invalid email
users.add({ id: 3, email: "bob@example.com", age: 16 }); // ❌ Age too young
```

### Custom Validator Functions

For lightweight, inline validation:

```typescript
const emails = new HashSet<string>({
  validator: (val) => {
    if (typeof val !== "string") return false;
    return val.includes("@") && val.includes(".");
  },
});

emails.add("user@example.com"); // ✅ Valid
emails.add("invalid"); // ❌ Custom validation failed
emails.add("test@domain"); // ❌ Missing TLD
```

### Combining Multiple Validators

Zod takes precedence, then custom validators:

```typescript
const phoneSet = new HashSet<string>({
  schema: z.string().min(10), // 1. Try Zod first
  validator: (val) => /^\d+$/.test(val), // 2. Then custom
  strict: true, // 3. Always enforce
});
```

### Disabling Validation (Not Recommended)

For performance-critical code where you control all inputs:

```typescript
const unsafeList = new ArrayList<any>({ strict: false });
unsafeList.add(1);
unsafeList.add("text");
unsafeList.add({ mixed: true }); // All allowed when strict: false
```

> ⚠️ **Warning:** Disabling validation trades safety for speed. Only use when you're absolutely certain about your data sources.

---

## 📊 Collections Deep Dive

### Comparison Table

| Collection      | Backing       |     Get      |       Add        |      Remove      | Best For                         |
| --------------- | ------------- | :----------: | :--------------: | :--------------: | -------------------------------- |
| **ArrayList**   | Dynamic Array |   **O(1)**   |  O(1) amortized  |       O(n)       | Fast random access, append-heavy |
| **LinkedList**  | Doubly-Linked |     O(n)     | **O(1)** at ends | **O(1)** at ends | Frequent insertion at ends       |
| **HashSet**     | Hash Table    |      -       |   **O(1)** avg   |   **O(1)** avg   | Uniqueness, membership tests     |
| **HashMap**     | Hash Table    | **O(1)** avg |   **O(1)** avg   |   **O(1)** avg   | Key-value lookups                |
| **LinkedQueue** | Linked List   |      -       |     **O(1)**     |     **O(1)**     | FIFO task processing             |
| **LinkedStack** | Linked List   |      -       |     **O(1)**     |     **O(1)**     | LIFO processing, undo/redo       |

### Detailed Characteristics

#### ArrayList

- **Strengths**: O(1) indexed access, cache-friendly contiguous memory
- **Weaknesses**: O(n) insertion/deletion in middle, dynamic resizing overhead
- **Memory**: Dense packing, minimal overhead
- **Best for**: Read-heavy, append-heavy workloads

#### LinkedList

- **Strengths**: O(1) insertion/deletion at both ends, no resizing
- **Weaknesses**: O(n) indexed access, pointer overhead per node
- **Memory**: ~24 bytes overhead per node (pointers)
- **Best for**: Bidirectional access, queue/stack simulation

#### HashSet

- **Strengths**: O(1) average add/remove, exact duplicate detection
- **Weaknesses**: Unordered, O(n) worst case if poor hash function
- **Memory**: Load factor management, hash collisions
- **Best for**: Fast membership testing, deduplication

#### HashMap

- **Strengths**: O(1) average lookup, flexible key types
- **Weaknesses**: Unordered, memory overhead for load factor
- **Memory**: ~56 bytes base + load factor overhead
- **Best for**: Config storage, caching, lookup tables

#### LinkedQueue

- **Strengths**: O(1) offer/poll, true FIFO semantics
- **Weaknesses**: Not random accessible
- **Memory**: Pointer overhead like LinkedList
- **Best for**: Job queues, event processing, message handling

#### LinkedStack

- **Strengths**: O(1) push/pop, clean LIFO semantics
- **Weaknesses**: Not random accessible
- **Memory**: Pointer overhead
- **Best for**: Undo/redo, expression evaluation, DFS algorithms

---

## 🎓 Architecture & Design Patterns

### Interface Hierarchy

ts-collections follows a clean, layered architecture inspired by Java:

```
Collection<E> (base)
├── List<E> (ordered)
│   ├── ArrayList<E>
│   └── LinkedList<E>
├── Set<E> (unique)
│   └── HashSet<E>
├── Map<K, V> (key-value)
│   └── HashMap<K, V>
├── Queue<E> (FIFO)
│   └── LinkedQueue<E>
└── Stack<E> (LIFO)
    └── LinkedStack<E>
```

### Abstract Base Classes

Don't repeat yourself—extend abstract bases for custom implementations:

```typescript
import { AbstractList } from "ts-collections";
import type { Iterator } from "ts-collections";

class CustomList<T> extends AbstractList<T> {
  private items: T[] = [];

  override size(): number {
    return this.items.length;
  }

  override get(index: number): T {
    return this.items[index];
  }

  override set(index: number, element: T): T {
    const old = this.items[index];
    this.items[index] = element;
    return old;
  }

  override addAt(index: number, element: T): void {
    this.items.splice(index, 0, element);
  }

  override removeAt(index: number): T {
    return this.items.splice(index, 1)[0];
  }

  override indexOf(element: T): number {
    return this.items.indexOf(element);
  }

  override lastIndexOf(element: T): number {
    return this.items.lastIndexOf(element);
  }

  override subList(fromIndex: number, toIndex: number): CustomList<T> {
    const sub = new CustomList<T>();
    for (let i = fromIndex; i < toIndex; i++) {
      sub.add(this.items[i]);
    }
    return sub;
  }

  override contains(element: T): boolean {
    return this.items.includes(element);
  }

  override iterator(): Iterator<T> {
    let index = 0;
    return {
      hasNext: () => index < this.items.length,
      next: () => this.items[index++],
    };
  }

  override toArray(): T[] {
    return [...this.items];
  }

  override clear(): void {
    this.items = [];
  }
}
```

### Iterator Pattern

All collections implement the Iterator pattern for clean traversal:

```typescript
const list = new ArrayList<number>();
list.add(1);
list.add(2);
list.add(3);

const iterator = list.iterator();
while (iterator.hasNext()) {
  const value = iterator.next();
  console.log(value); // 1, 2, 3
}

// Or with for loop (via toArray)
for (const value of list.toArray()) {
  console.log(value);
}

// LinkedList supports reverse iteration
const linked = new LinkedList<string>();
linked.add("a");
linked.add("b");
linked.add("c");

const reverse = linked.reverseIterator();
while (reverse.hasNext()) {
  console.log(reverse.next()); // c, b, a
}
```

### Common Collection Operations

```typescript
// Add all elements from one collection to another
const list1 = new ArrayList<number>();
list1.add(1);
list1.add(2);

const list2 = new ArrayList<number>();
list2.add(3);
list2.add(4);
list2.addAll(list1); // Now: [3, 4, 1, 2]

// Check if contains all elements
const set = new HashSet<string>();
set.add("apple");
set.add("banana");
set.add("orange");

const required = new HashSet<string>();
required.add("apple");
required.add("banana");
console.log(set.containsAll(required)); // true

// Remove collection of elements
set.removeAll(required); // Now only "orange"

// Retain only specific elements
const keep = new HashSet<string>();
keep.add("apple");
set.add("apple");
set.add("orange");
set.retainAll(keep); // Now only "apple"
```

---

## 📈 Performance Guide

### Time Complexity Reference

```
LISTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ArrayList<T>
  get(index)           → O(1)       ✨ Fast
  add(element)         → O(1) amortized
  addAt(index, elem)   → O(n)       ⚠️ Slow for middle inserts
  removeAt(index)      → O(n)       ⚠️ Slow for middle deletes
  indexOf(element)     → O(n)
  contains(element)    → O(n)

LinkedList<T>
  get(index)           → O(n)       ⚠️ Slow
  addFirst(element)    → O(1)       ✨ Fast
  addLast(element)     → O(1)       ✨ Fast
  removeFirst()        → O(1)       ✨ Fast
  removeLast()         → O(1)       ✨ Fast
  indexOf(element)     → O(n)
  contains(element)    → O(n)

SETS & MAPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HashSet<T> / HashMap<K,V>
  add/put(element)     → O(1) avg   ✨ Fast
  get(key)             → O(1) avg   ✨ Fast
  remove(key)          → O(1) avg   ✨ Fast
  contains(key)        → O(1) avg   ✨ Fast
  [worst case]         → O(n)       (poor hash function)

QUEUES & STACKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LinkedQueue<T>
  offer(element)       → O(1)       ✨ Fast
  poll()               → O(1)       ✨ Fast
  peek()               → O(1)       ✨ Fast

LinkedStack<T>
  push(element)        → O(1)       ✨ Fast
  pop()                → O(1)       ✨ Fast
  peek()               → O(1)       ✨ Fast
```

### Memory Footprint

```
ArrayList<number>
  - 0 elements:    ~48 bytes (overhead)
  - 100 elements:  ~848 bytes (48 + 100*8)
  - Growth:        1.5x capacity when full

LinkedList<number>
  - Per node:      ~48 bytes (value + pointers)
  - 100 elements:  ~4.8 KB (48 * 100)
  - Plus:          ~16 bytes head/tail pointers

HashSet<string>
  - Base:          ~56 bytes
  - Per element:   ~32 bytes average
  - 100 elements:  ~3.2 KB + load factor overhead

HashMap<string, number>
  - Base:          ~56 bytes
  - Per entry:     ~48 bytes average
  - 100 entries:   ~4.8 KB + load factor overhead
```

### Performance Tips

✨ **Optimize ArrayList:**

```typescript
// ❌ Avoid: Frequent middle inserts
const list = new ArrayList<number>();
for (let i = 0; i < 1000; i++) {
  list.addAt(0, i); // O(n) each time = O(n²) overall
}

// ✅ Better: Use LinkedList for frequent inserts
const list = new LinkedList<number>();
for (let i = 0; i < 1000; i++) {
  list.addFirst(i); // O(1) each time = O(n) overall
}

// ✅ Or: Build array, then convert
const arr = [];
for (let i = 999; i >= 0; i--) arr.push(i);
const list = new ArrayList<number>();
arr.forEach((x) => list.add(x));
```

⚡ **Optimize HashSet/HashMap:**

```typescript
// ❌ Avoid: Hash collisions with poor keys
const badMap = new HashMap<any, number>();
badMap.put({}, 1);
badMap.put({}, 2); // Creates new entry (not same key)

// ✅ Better: Use immutable, well-hashing keys
const goodMap = new HashMap<string, number>();
goodMap.put("key1", 1);
goodMap.put("key2", 2);

// ✅ Consider: String numbers for performance
const fastMap = new HashMap<number, boolean>();
for (let i = 0; i < 1000000; i++) {
  fastMap.put(i, true);
}
```

🎯 **Optimize Queue/Stack:**

```typescript
// ✨ Already O(1)—just use appropriately
const queue = new LinkedQueue<Task>();
for (const task of tasks) {
  queue.offer(task); // Always O(1)
}

// Process FIFO
while (!queue.isEmpty()) {
  const task = queue.poll(); // Always O(1)
  processTask(task);
}
```

---

## 🧪 Testing & Quality Assurance

### Run Tests

```bash
# 🧪 Full test suite
pnpm test

# 🎯 Run tests matching pattern
pnpm test -- --grep LinkedStack

# 👀 Watch mode (re-run on file change)
pnpm test --watch

# 📊 With coverage report
pnpm test --coverage
```

### Test Coverage

- **Unit Tests**: Every public method and edge case
- **Type Safety**: Validation behavior, type enforcement
- **Integration**: Collection interactions, iterator patterns
- **Edge Cases**: Empty collections, single element, large datasets
- **Target**: >80% code coverage

### Example Test

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { LinkedStack } from "ts-collections";

describe("LinkedStack", () => {
  let stack: LinkedStack<number>;

  beforeEach(() => {
    stack = new LinkedStack<number>();
  });

  it("should push and pop in LIFO order", () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);

    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
  });

  it("should enforce type safety", () => {
    stack.push(1);
    expect(() => stack.push("string" as any)).toThrow(TypeError);
  });
});
```

---

## 📚 Complete API Reference

### Collection Interface

Base interface implemented by all collections.

```typescript
interface Collection<E> {
  // Core operations
  size(): number; // Number of elements
  length: number; // Alias for size() (JS-friendly)
  isEmpty(): boolean; // True if size is 0

  // Element operations
  add(element: E): boolean; // Add element
  remove(element: E): boolean; // Remove first occurrence
  contains(element: E): boolean; // Check membership
  clear(): void; // Remove all elements

  // Bulk operations
  addAll(elements: Collection<E>): boolean; // Add all from another collection
  removeAll(elements: Collection<E>): boolean; // Remove all matching
  retainAll(elements: Collection<E>): boolean; // Keep only matching
  containsAll(elements: Collection<E>): boolean; // Check if contains all

  // Iteration
  iterator(): Iterator<E>; // Iterate from beginning
  toArray(): E[]; // Convert to array
}
```

### List Interface

Ordered collections with indexed access.

```typescript
interface List<E> extends Collection<E> {
  // Indexed access
  get(index: number): E; // Get by index
  set(index: number, element: E): E; // Replace at index
  indexOf(element: E): number; // First occurrence index (-1 if not found)
  lastIndexOf(element: E): number; // Last occurrence index

  // Indexed modification
  addAt(index: number, element: E): void; // Insert at index
  removeAt(index: number): E; // Remove and return element

  // Range operations
  subList(fromIndex: number, toIndex: number): List<E>; // Get slice
}
```

### Set Interface

Collections ensuring no duplicates.

```typescript
interface Set<E> extends Collection<E> {
  // Set-specific operations are inherited from Collection
  // (no duplicates guaranteed automatically)
}
```

### Map Interface

Key-value storage with fast lookups.

```typescript
interface Map<K, V> extends Collection<V> {
  // Key-value operations
  put(key: K, value: V): V | undefined; // Store or update
  get(key: K): V | undefined; // Retrieve by key
  remove(key: K): V | undefined; // Remove and return value
  containsKey(key: K): boolean; // Check key existence

  // Key/value collections
  keys(): Collection<K>; // All keys
  values(): Collection<V>; // All values
  entries(): Collection<[K, V]>; // All key-value pairs
}
```

### Queue Interface

FIFO (First-In-First-Out) collections.

```typescript
interface Queue<E> extends Collection<E> {
  // FIFO operations
  offer(element: E): boolean; // Add to back
  poll(): E | undefined; // Remove and return front (safe)
  dequeue(): E | undefined; // Alias for poll()
  peek(): E | undefined; // Inspect front (safe)
  element(): E; // Inspect front (throws if empty)
}
```

### Stack Interface

LIFO (Last-In-First-Out) collections.

```typescript
interface Stack<E> extends Collection<E> {
  // LIFO operations
  push(element: E): boolean; // Add to top
  pop(): E | undefined; // Remove and return top (safe)
  peek(): E | undefined; // Inspect top (safe)
}
```

### Iterator Interface

For traversing collections.

```typescript
interface Iterator<E> {
  hasNext(): boolean; // Check if more elements
  next(): E; // Get next element (throws if none)
  remove?(): void; // Optional: remove last returned element
}
```

---

## 🔧 Configuration & Options

### TypeValidationOptions

Customize type checking behavior for any collection:

```typescript
interface TypeValidationOptions<T> {
  // Enable/disable type enforcement (default: true)
  strict?: boolean;

  // Zod schema for sophisticated validation
  schema?: ZodSchema<T>;

  // Custom validation function
  validator?: (value: unknown) => boolean;
}
```

### Configuration Examples

```typescript
// 🔒 Default: Strict type safety (recommended)
const list = new ArrayList<number>();
list.add(1); // ✅ OK
list.add("text"); // ❌ Error

// 🛡️ With Zod schema validation
import { z } from "zod";

const positiveNumbers = new ArrayList<number>({
  strict: true,
  schema: z.number().positive(),
});

positiveNumbers.add(42); // ✅ OK
positiveNumbers.add(-5); // ❌ Error

// 🎯 Custom validator
const evenNumbers = new HashSet<number>({
  validator: (val) => typeof val === "number" && val % 2 === 0,
});

evenNumbers.add(4); // ✅ OK
evenNumbers.add(3); // ❌ Error

// ⚠️ No validation (not recommended)
const unsafe = new LinkedQueue<any>({ strict: false });
unsafe.offer(1);
unsafe.offer("mixed"); // ✅ Allowed
unsafe.offer({ any: true }); // ✅ Allowed
```

---

## 💡 Best Practices & Patterns

### ✅ Do's

**1. Use Type-Safe Collections by Default**

```typescript
// ✅ Good: Type safety enabled
const numbers = new ArrayList<number>();
numbers.add(1);
numbers.add(2);

// ❌ Avoid: Disabling safety
const unsafe = new ArrayList<number>({ strict: false });
```

**2. Choose the Right Collection**

```typescript
// ✅ Good: ArrayList for indexed access
const data = new ArrayList<Record>();
const record = data.get(index);

// ❌ Avoid: Using ArrayList for frequent inserts
const stack = new ArrayList<number>();
for (let i = 0; i < 1000; i++) {
  stack.addAt(0, i); // O(n) each time!
}
```

**3. Leverage Type System**

```typescript
// ✅ Good: Strong typing
function processNumbers(collection: Collection<number>) {
  for (const num of collection.toArray()) {
    console.log(num * 2);
  }
}

// ❌ Avoid: Using any
function process(collection: Collection<any>) {
  // Type information lost
}
```

**4. Use Zod for Complex Validation**

```typescript
// ✅ Good: Comprehensive validation
const users = new ArrayList<User>({
  schema: z.object({
    id: z.number().positive(),
    email: z.string().email(),
    age: z.number().min(18),
  }),
});

// ❌ Avoid: No validation for complex data
const users = new ArrayList<User>();
```

**5. Clear Collections When Reusing**

```typescript
// ✅ Good: Explicit cleanup
const buffer = new ArrayList<number>();
// ... use buffer ...
buffer.clear(); // Ready for reuse

// ❌ Avoid: Leaving stale data
const buffer = new ArrayList<number>();
// ... use buffer ...
// Just create new one without cleanup
```

### ❌ Don'ts

**1. Don't Disable Strict Mode Without Reason**

```typescript
// ❌ Bad: Sacrificing safety
const list = new ArrayList<number>({ strict: false });
list.add("oops"); // Caught too late!

// ✅ Good: Keep strict mode
const list = new ArrayList<number>();
```

**2. Don't Modify Collections During Iteration**

```typescript
// ❌ Bad: Concurrent modification
const list = new ArrayList<number>();
list.add(1);
list.add(2);
list.add(3);

for (const item of list.toArray()) {
  if (item === 2) list.remove(2); // ⚠️ May cause issues
}

// ✅ Good: Collect removals, then remove
const toRemove = [];
for (const item of list.toArray()) {
  if (item === 2) toRemove.push(item);
}
toRemove.forEach((item) => list.remove(item));
```

**3. Don't Mix Type Checking Levels**

```typescript
// ❌ Bad: Inconsistent validation
const list1 = new ArrayList<number>();
const list2 = new ArrayList<number>({ strict: false });
list1.addAll(list2); // Type safety violated

// ✅ Good: Consistent strategy
const list1 = new ArrayList<number>();
const list2 = new ArrayList<number>();
list1.addAll(list2); // Both strict
```

**4. Don't Ignore Test Failures**

```typescript
// ❌ Bad: Skipping failing tests
test.skip("should validate email", () => {
  // Test failure ignored
});

// ✅ Good: Fix or properly mark as todo
test.todo("should validate email once API is ready");

test("should validate email", () => {
  // Fix and ensure passes
});
```

**5. Don't Use Collections for One-Off Data**

```typescript
// ❌ Overkill: Using collection for single check
const config = new HashMap<string, string>();
config.put("version", "1.0");
const version = config.get("version");

// ✅ Better: Use plain object for simple cases
const config = { version: "1.0" };
const version = config.version;

// ✅ Use collections when: complex operations needed
const cache = new HashMap<string, CacheEntry>();
cache.put(key, entry);
cache.remove(expiredKey);
```

---

## 🤝 Contributing Guide

### Getting Started

1. **Fork & Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/ts-collections.git
   cd ts-collections
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or for bug fixes:
   git checkout -b fix/issue-description
   ```

### Development Workflow

**Follow Test-Driven Development (TDD):**

```bash
# 1️⃣ Write tests first
# Create test file: test/myfeature/MyFeature.test.ts

# 2️⃣ Run tests (will fail initially)
pnpm test

# 3️⃣ Implement feature
# Create src/myfeature/MyFeature.ts

# 4️⃣ Tests pass
pnpm test

# 5️⃣ Ensure code quality
pnpm lint
pnpm build

# 6️⃣ Commit
git add .
git commit -m "feat: add amazing feature"
```

### Code Style & Conventions

````typescript
// 🏷️ Naming conventions
const variableName = 1; // camelCase for variables
function functionName() {} // camelCase for functions
class ClassName {} // PascalCase for classes
interface InterfaceName {} // PascalCase for interfaces
const CONSTANT_VALUE = 100; // UPPER_SNAKE_CASE for constants

// 📝 Comments & Documentation
/**
 * Performs important operation.
 *
 * @param input The input value
 * @returns The result
 * @throws {Error} If input is invalid
 *
 * @example
 * ```typescript
 * const result = importantFunction(42);
 * console.log(result); // Output
 * ```
 */
function importantFunction(input: number): number {
  // Implementation
  return input;
}

// 🗂️ Import ordering
// 1. Type imports
import type { MyType } from "./types";
import type { OtherType } from "../shared";

// 2. Concrete imports
import { MyClass } from "./impl";
import { utility } from "../utils";

// 3. Relative imports
import { helper } from "./helper";
````

### Testing Guidelines

```typescript
describe("MyFeature", () => {
  let instance: MyFeature;

  beforeEach(() => {
    instance = new MyFeature();
  });

  // ✅ Descriptive test names
  describe("constructor", () => {
    it("should initialize with empty state", () => {
      expect(instance.size()).toBe(0);
      expect(instance.isEmpty()).toBe(true);
    });
  });

  // ✅ Test happy path
  describe("add operation", () => {
    it("should add single element", () => {
      const result = instance.add(1);
      expect(result).toBe(true);
      expect(instance.size()).toBe(1);
    });

    it("should add multiple elements", () => {
      instance.add(1);
      instance.add(2);
      instance.add(3);
      expect(instance.size()).toBe(3);
    });
  });

  // ✅ Test error cases
  describe("type validation", () => {
    it("should enforce type safety", () => {
      instance.add(1);
      expect(() => instance.add("text" as any)).toThrow(TypeError);
    });
  });

  // ✅ Test edge cases
  describe("edge cases", () => {
    it("should handle empty collection", () => {
      expect(instance.isEmpty()).toBe(true);
      expect(() => instance.remove(1)).not.toThrow();
    });

    it("should handle large datasets", () => {
      for (let i = 0; i < 10000; i++) {
        instance.add(i);
      }
      expect(instance.size()).toBe(10000);
    });
  });
});
```

### Pull Request Process

1. **Ensure all tests pass**

   ```bash
   pnpm test
   ```

2. **Check lint/type safety**

   ```bash
   pnpm lint
   pnpm build
   ```

3. **Update documentation**
   - Add/update JSDoc comments
   - Update relevant wiki pages
   - Include examples if adding features

4. **Write clear commit messages**

   ```
   feat: add stack implementation using linked list

   - Implements LinkedStack<T> extending AbstractStack<T>
   - Provides O(1) push/pop operations
   - Includes full test coverage
   - Adds performance documentation
   ```

5. **Create Pull Request**
   - Reference related issues
   - Include description of changes
   - Explain motivation and design decisions

### Project Structure

```
ts-collections/
├── src/
│   ├── interfaces/          # TypeScript interfaces
│   ├── abstracts/           # Abstract base classes
│   ├── list/                # List implementations
│   ├── set/                 # Set implementations
│   ├── map/                 # Map implementations
│   ├── queue/               # Queue implementations
│   ├── stack/               # Stack implementations
│   ├── utils/               # Utility functions
│   └── index.ts             # Main export file
├── test/
│   ├── interfaces/          # Interface tests
│   ├── list/                # List tests
│   ├── set/                 # Set tests
│   ├── map/                 # Map tests
│   ├── queue/               # Queue tests
│   └── stack/               # Stack tests
├── wiki/                    # Documentation
├── tsconfig.json            # TypeScript config
├── vitest.config.ts         # Test configuration
└── package.json             # Package metadata
```

### Common Issues & Solutions

**ESLint errors for new files:**

```bash
# Files are auto-included if they match tsconfig patterns
# No additional setup needed for test/** and src/**
```

**Test file not running:**

```bash
# Check tsconfig.json includes pattern:
# "**/*.{test,spec}.?(c|m)[jt]s?(x)"
```

**Type errors in IDE:**

```bash
# Rebuild TypeScript cache:
pnpm run build

# Or restart TypeScript server in VS Code:
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

---

## 🗺️ Roadmap

**Planned Features:**

- [ ] Bounded queues with capacity limits
- [ ] Priority queues
- [ ] Tree-based maps and sets (TreeMap, TreeSet)
- [ ] Concurrent/thread-safe collections
- [ ] Async iterator support
- [ ] Observable/reactive collections
- [ ] Immutable collection variants

**Improvements:**

- [ ] Better error messages
- [ ] Performance optimizations
- [ ] Extended documentation and examples
- [ ] More advanced validation helpers

---

## 📄 License

MIT — See [LICENSE](https://github.com/Karelaking/ts-collections/blob/master/LICENSE) file.

---

## 🔗 Links & Resources

- **Repository**: https://github.com/Karelaking/ts-collections
- **NPM Package**: https://www.npmjs.com/package/ts-collections
- **Issues**: https://github.com/Karelaking/ts-collections/issues
- **Discussions**: https://github.com/Karelaking/ts-collections/discussions
- **Java Collections**: https://docs.oracle.com/javase/tutorial/collections/

---

## ❓ FAQ

**Q: Do I need Zod?**
A: No. Zod is optional. Basic type validation works without it.

**Q: Can I use this in production?**
A: Yes! The library follows SOLID principles, has comprehensive tests, and strict typing.

**Q: Is this a polyfill for native JS collections?**
A: No. It's a framework providing Java-like APIs with additional type safety features.

**Q: How does it compare to native JS arrays/objects?**
A: ts-collections provide structured APIs, runtime validation, and better semantics for specific use cases (e.g., sets, queues, stacks).

**Q: Can I extend collections?**
A: Yes! All collections have abstract base classes designed for extension.

---

## 💬 Support

- **Questions?** Open a [discussion](https://github.com/Karelaking/ts-collections/discussions)
- **Found a bug?** File an [issue](https://github.com/Karelaking/ts-collections/issues)
- **Want to contribute?** See [CONTRIBUTING.md](https://github.com/Karelaking/ts-collections/blob/master/CONTRIBUTING.md)

---

**Happy coding! 🚀**
