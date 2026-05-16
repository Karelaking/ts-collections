# Behavior Consistency Matrix

**Purpose:** single source of truth for behavior consistency across `ts-collections` classes/interfaces.  
**Aligned with:** `PRD.md` (locked decisions).

---

## Global Policies (Locked)
1. API style: Java-like with TS-idiomatic adjustments.
2. `null`/`undefined`: allowed by default.
3. Runtime validation: ON by default; can be disabled.
4. Deterministic errors for invalid operations.

---

## A) Common Collection Semantics (`Collection<E>`)

| Behavior Area | Policy | Notes |
|---|---|---|
| `add` with valid value | Succeeds | Returns boolean per contract |
| `add` with `null`/`undefined` | Allowed by default | Validation config may reject |
| `remove` missing element | No throw | Returns false |
| `contains` | Deterministic equality policy | Document equality strategy per impl |
| `size` | O(1) preferred | If not O(1), must be documented |
| `clear` | No throw | Collection becomes empty |

---

## B) List Semantics (`List<E>`) — `ArrayList`, `LinkedList`

| Behavior Area | Policy | Notes |
|---|---|---|
| `get(index)` invalid index | Throw | Standardized bounds error message |
| `set(index, value)` invalid index | Throw | Same bounds behavior as `get` |
| `addAt(index, value)` invalid index | Throw | Explicit index range contract |
| `removeAt(index)` invalid index | Throw | Deterministic error type/message |
| duplicate elements | Allowed | Java-like list semantics |
| order | Preserved insertion/index order | |

---

## C) Set Semantics (`Set<E>`) — `HashSet`

| Behavior Area | Policy | Notes |
|---|---|---|
| duplicate `add` | No throw | Returns false when already exists |
| `remove` missing element | No throw | Returns false |
| membership check | Deterministic | Equality/hash policy documented |
| iteration order | Implementation-defined unless documented | Must be explicit in docs |

---

## D) Map Semantics (`Map<K,V>`) — `HashMap`

| Behavior Area | Policy | Notes |
|---|---|---|
| `put` existing key | Replace value | Return previous value per contract |
| `get` missing key | Return `undefined` | No throw |
| `remove` missing key | No throw | Returns `undefined` |
| key/value `null`/`undefined` | Allowed by default | Validation may restrict |
| iteration order | Implementation-defined unless documented | Must be explicit |

---

## E) Queue Semantics (`Queue<E>`) — `LinkedQueue`

| Behavior Area | Policy | Notes |
|---|---|---|
| `offer` | No throw for normal path | Returns boolean |
| `poll` empty queue | No throw | Returns undefined/null per contract |
| `peek` empty queue | No throw | Returns undefined/null per contract |
| ordering | FIFO | Strictly preserved |

---

## F) Stack Semantics (`Stack<E>`) — `LinkedStack`

| Behavior Area | Policy | Notes |
|---|---|---|
| `push` | Succeeds on valid input | |
| `pop` empty stack | No throw | Returns `undefined` |
| `peek` empty stack | No throw | Returns `undefined` |
| ordering | LIFO | Strictly preserved |

---

## G) Iterator Semantics (`Iterator<E>`)

| Behavior Area | Policy | Notes |
|---|---|---|
| `hasNext` after end | Returns false | |
| `next` at end | Throw deterministic error | Java-like behavior preferred |
| mutation during iteration | Defined per implementation | Must be documented clearly |

---

## H) Runtime Validation Semantics

| Mode | Default | Behavior |
|---|---|---|
| Schema-based | Supported | Strong runtime checks with clear messages |
| Custom validator | Supported | Developer-defined policy |
| Strict-type mode | Supported | Lightweight checks |
| Validation off | Supported | Performance-first path |

---

## I) Expansion-Specific Matrix Placeholders

### I-1 Deque (`LinkedDeque`)

| Behavior Area | Policy | Notes |
|---|---|---|
| `addFirst` / `addLast` | Succeeds on valid input | Throws `TypeError` when validation rejects input |
| `offerFirst` / `offerLast` | Returns `true` | Unbounded implementation |
| `removeFirst` / `removeLast` on empty | Throw | Mirrors strict remove semantics |
| `pollFirst` / `pollLast` on empty | No throw | Returns `undefined` |
| `getFirst` / `getLast` on empty | Throw | Mirrors strict element access semantics |
| `peekFirst` / `peekLast` on empty | No throw | Returns `undefined` |
| `offer` / `poll` queue compatibility | FIFO via front removal | `offer` maps to back insertion |
| iteration order | Front to back | Deterministic |

### I-2 PriorityQueue (`PriorityQueue`)

| Behavior Area | Policy | Notes |
|---|---|---|
| default ordering | Min-heap for comparable primitives | number/string/bigint/boolean/Date |
| custom ordering | Supported via comparator | comparator in constructor options |
| non-primitive without comparator | Throw when comparison is required | Error: comparator required |
| `offer` | Returns `true` | Unbounded implementation |
| `poll` on empty | No throw | Returns `undefined` |
| `peek` on empty | No throw | Returns `undefined` |
| `element` on empty | Throw | `Queue is empty` |
| `toArray` / `iterator` ordering | Priority order snapshot | Deterministic sorted view |

### I-3 TreeMap (`TreeMap`)

| Behavior Area | Policy | Notes |
|---|---|---|
| key ordering | Sorted by comparator | Default comparator supports primitive/date keys |
| custom ordering | Supported via comparator | comparator in constructor options |
| comparator equality (`cmp === 0`) | Replace existing entry | Size unchanged |
| `get`/`remove` missing key | No throw | Returns `undefined` |
| non-primitive keys without comparator | Throw when comparison is required | Error: comparator required |
| `keys`/`entries` ordering | Sorted key order | Deterministic |
| iterator ordering (`keyIterator`/`valueIterator`) | Key-sorted traversal | Deterministic |

### I-4 TreeSet (`TreeSet`)

| Behavior Area | Policy | Notes |
|---|---|---|
| element ordering | Sorted by comparator | Default comparator supports primitive/date values |
| custom ordering | Supported via comparator | comparator in constructor options |
| duplicate handling | Comparator equality (`cmp === 0`) blocks duplicates | `add` returns `false` |
| non-primitive values without comparator | Throw when comparison is required | Error: comparator required |
| `remove` missing element | No throw | Returns `false` |
| iterator / `toArray` ordering | Sorted order | Deterministic |
| `removeAll` / `retainAll` | Explicitly implemented | Contract-consistent boolean result |

---

## J) Test Mapping Checklist
For each row above, ensure there is:
1. at least one happy-path test
2. at least one edge-case test
3. at least one error/invalid-operation test (where applicable)
4. a documentation note if behavior is implementation-defined
