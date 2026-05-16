# Agent Guidelines for ts-collections

This file provides coding guidelines and commands for agents working in this repository.

## Project Overview

ts-collections is a Java-inspired TypeScript Collections Framework providing type-safe data structures (List, Set, Map, Queue, Stack, Iterator) with runtime validation using Zod.

---

## Commands

### Build, Test, Lint

```bash
pnpm build        # Build with tsup (ESM output to dist/)
pnpm test         # Run all tests with Vitest
pnpm test:watch  # Run tests in watch mode
pnpm lint         # Run ESLint on src/
pnpm bench        # Run benchmarks
```

### Running a Single Test

```bash
pnpm test test/map/HashMap.test.ts
# or
npx vitest run test/map/HashMap.test.ts
```

### Type Checking

TypeScript strict mode is enabled. No additional command needed - it's part of build/test.

---

## Code Style Guidelines

### Naming Conventions

- **Classes/Interfaces/Types**: PascalCase (`ArrayList`, `List<T>`, `Queue`)
- **Variables/Functions/Methods**: camelCase (`add()`, `size()`, `elements`)
- **Constants**: UPPER_SNAKE_CASE (use sparingly)
- **Files**: kebab-case (`array-list.ts`, `hash-map.ts`)

### TypeScript Requirements

- **Strict mode enabled** (`tsconfig.json:11-14`)
- Avoid `any` - use specific types or `unknown`
- Use `import type` for type-only imports
- Enable `noUncheckedIndexedAccess` - always check for undefined
- Use generics for reusable collection types (`List<T>`, `Map<K,V>`)

### Import Organization

```typescript
// Group 1: External imports
import { describe, it, expect } from "vitest";
import type { z } from "zod";

// Group 2: Internal type imports (use 'type' keyword)
import type { List } from "../interfaces/List";
import type { Iterator } from "../interfaces/Iterator";

// Group 3: Implementation imports
import {
  AbstractList,
  type TypeValidationOptions,
} from "../abstracts/AbstractList";
```

### Error Handling

- Throw `Error` with descriptive messages
- Validate inputs using Zod schemas (enabled by default)
- Check bounds for index-based operations
- Use try-catch for integration tests only

### Documentation (JSDoc)

Document all public APIs with JSDoc:

```typescript
/**
 * Appends the specified element to the end of this list.
 *
 * @param element - The element to be appended to this list
 * @returns true if the element was added successfully
 * @throws Error if element is undefined (strict mode)
 * @example
 * list.add(42);  // O(1) amortized
 */
override add(element: T): boolean
```

---

## Architecture

### Directory Structure

```
src/
├── interfaces/     # Contract definitions (List, Set, Map, etc.)
├── abstracts/      # Base implementations (AbstractList, etc.)
├── list/          # ArrayList, LinkedList
├── map/           # HashMap
├── set/           # HashSet
├── queue/         # LinkedQueue
├── stack/         # LinkedStack
├── utils/         # Validation helpers
└── index.ts       # Public API exports
```

### Class Hierarchy

- All collections extend abstract base classes
- Abstracts implement interface contracts
- Concrete classes add storage/implementation details

### Runtime Validation

- Zod validation enabled by default (like Java's type-safe collections)
- Constructor accepts `TypeValidationOptions<T>`:
  - `{ strict: false }` - disable validation
  - `{ schema: z.number().positive() }` - custom Zod schema
  - `{ validator: (val) => boolean }` - custom function

---

## Testing Standards

### Test Framework

- **Vitest** - use `describe`, `it`, `expect`, `beforeEach`
- Place tests in `test/` directory, mirror src structure

### Test Structure

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { HashMap } from "../../src/map/HashMap";

describe("HashMap - Core Methods", () => {
  let map: HashMap<string, number>;

  beforeEach(() => {
    map = new HashMap<string, number>();
  });

  describe("put method", () => {
    it("should put and retrieve value", () => {
      map.put("key", 42);
      expect(map.get("key")).toBe(42);
    });
  });
});
```

### Coverage Requirements

- **100% coverage required** for all new code
- Run `pnpm test:coverage` to check
- Tests must cover: happy path, edge cases, error conditions

---

## Copilot Instructions (Applied)

From `.github/copilot-instructions.md`:

- Follow **TDD** approach: write tests before implementation
- Maintain **backward compatibility** unless absolutely necessary
- Use **SOLID principles** for object-oriented design
- Prefer **DRY** - extract reusable utilities
- Write descriptive **commit messages** following conventional format

---

## Common Patterns

### Adding a New Collection

1. Define interface in `src/interfaces/`
2. Create abstract in `src/abstracts/`
3. Implement in appropriate `src/*/` directory
4. Export from `src/index.ts`
5. Write tests in `test/`
6. Ensure 100% coverage

### Adding a Method

1. Add to interface in `src/interfaces/`
2. Add to abstract class in `src/abstracts/`
3. Implement in concrete class
4. Add tests covering: success, edge cases, errors
5. Run lint and verify coverage

---

## ESLint Rules

- `@typescript-eslint/no-explicit-any`: warn
- `@typescript-eslint/no-unused-vars`: warn (prefix with `_` to ignore)
- `no-console`: warn (allow warn/error only in src, off in tests)

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
