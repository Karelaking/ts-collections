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


# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `pnpm dlx ultracite fix`
- **Check for issues**: `pnpm dlx ultracite check`
- **Diagnose setup**: `pnpm dlx ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**
- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**
- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `pnpm dlx ultracite fix` before committing to ensure compliance.
