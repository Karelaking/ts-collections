# Examples for ts-collections

This folder contains practical, copy-paste-ready examples demonstrating how to use all major collections, validation features, and common programming patterns in `ts-collections`.

## Why these examples?

These examples are designed to help developers:

- Learn `ts-collections` quickly
- Understand real-world use cases
- Explore validation support
- Practice common collection patterns
- Copy code directly into projects

Each example is:

- ✅ Runnable
- ✅ Well-commented
- ✅ Beginner friendly
- ✅ Type-safe
- ✅ Lint clean

## Directory Structure

examples/
├── basics/
│ ├── list-operations.ts
│ ├── set-operations.ts
│ ├── map-operations.ts
│ ├── queue-operations.ts
│ └── stack-operations.ts
│
├── type-validation/
│ ├── basic-validation.ts
│ ├── zod-schema-validation.ts
│ └── custom-validator.ts
│
├── patterns/
│ ├── filtering-and-mapping.ts
│ ├── batch-processing.ts
│ └── caching.ts
│
└── README.md

## Quick Start

### Install dependencies

```bash
npm install
```

### Run any example

Run examples from the project root:

```bash
npx ts-node examples/basics/list-operations.ts
```

Example:

```bash
npx ts-node examples/type-validation/custom-validator.ts
```

---

## Example Categories

### Basics

Learn fundamental operations for each collection type.

| Example               | Description                                |
| --------------------- | ------------------------------------------ |
| `list-operations.ts`  | ArrayList operations: add, remove, iterate |
| `set-operations.ts`   | Unique collections and membership checks   |
| `map-operations.ts`   | Key-value storage and retrieval            |
| `queue-operations.ts` | FIFO operations with queues                |
| `stack-operations.ts` | LIFO operations with stacks                |

---

### Type Validation

Learn how to validate data before inserting into collections.

| Example                    | Description                |
| -------------------------- | -------------------------- |
| `basic-validation.ts`      | Manual validation logic    |
| `zod-schema-validation.ts` | Schema validation with Zod |
| `custom-validator.ts`      | Custom reusable validators |

---

### Patterns

Real-world practical usage patterns.

| Example                    | Description                           |
| -------------------------- | ------------------------------------- |
| `filtering-and-mapping.ts` | Functional collection transformations |
| `batch-processing.ts`      | Process queue items in batches        |
| `caching.ts`               | Cache frequently used values          |

---

## Covered Features

### Collections

- ArrayList
- Set
- Map
- Queue
- Stack
- Iterators

### Validation

- Runtime validation
- Schema validation
- Custom validators

### Real-world Patterns

- Filtering
- Mapping
- Batch processing
- Caching

## Recommended Learning Order

If you're new to `ts-collections`, follow this order:

1. `basics/`
2. `type-validation/`
3. `patterns/`

## Common Commands

Run an example:

```bash
npx ts-node examples/basics/list-operations.ts
```

Lint project:

```bash
npm run lint
```

Build library:

```bash
npm run build
```

Built for developers learning and building with **ts-collections**.
