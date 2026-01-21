# Contributing to TypeScript Collections Framework

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the TypeScript Collections Framework.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful to all contributors and maintain professional communication.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10.18+
- Git
- TypeScript knowledge
- Familiarity with collections/data structures

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/ts-collections.git
cd ts-collections

# Install dependencies
pnpm install

# Verify setup
pnpm test
pnpm lint
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/description` - Documentation improvements
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### 2. Make Your Changes

Follow the existing code style and patterns:

```typescript
// ✅ Good: Clear, documented, follows SOLID
export abstract class AbstractCollection<E> implements Collection<E> {
  /**
   * Returns true if this collection contains the specified element.
   * Time Complexity: O(n)
   */
  abstract contains(element: E): boolean;

  // Implementation with error handling
  remove(element: E): boolean {
    if (!this.contains(element)) {
      return false;
    }
    // ... remove logic
    return true;
  }
}
```

### 3. Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test src/list/ArrayList.test.ts

# Generate coverage report
pnpm test --coverage
```

### 4. Check Code Quality

```bash
# Run linter
pnpm lint

# Fix linting issues automatically
pnpm lint --fix

# Format code
pnpm format
```

### 5. Build and Verify

```bash
# Build the project
pnpm build

# Verify build output
ls dist/
```

### 6. Commit Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add ArrayList implementation with comprehensive tests"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `test:` - Tests
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Maintenance

### 7. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with a clear description.

## Contributing Guidelines

### Code Style

#### TypeScript/JavaScript

- Use TypeScript for all code
- Strict mode enabled (`strict: true` in tsconfig.json)
- 2-space indentation
- Semicolons required
- Use `const`/`let`, avoid `var`

```typescript
// ✅ Good
const items: number[] = [];
let count = 0;

// ❌ Bad
var items = [];
let count;
```

#### Naming Conventions

- Classes: `PascalCase` (e.g., `ArrayList`)
- Methods/Variables: `camelCase` (e.g., `add()`, `myVariable`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_CAPACITY`)
- Private fields: `_fieldName` (e.g., `_elements`)
- Type parameters: `E` for elements, `K` for keys, `V` for values

```typescript
class MyCollection<E> {
  private _elements: E[];
  private readonly _DEFAULT_CAPACITY = 10;

  private addElement(element: E): void {
    // Implementation
  }
}
```

### Documentation

Every public method must be documented with JSDoc:

```typescript
/**
 * Returns the element at the specified position in this list.
 * 
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 *
 * @param index The index of the element to return (0-based)
 * @returns The element at the specified position
 * @throws Error If index is out of bounds
 *
 * @example
 * ```typescript
 * const list = new ArrayList([1, 2, 3]);
 * console.log(list.get(0)); // 1
 * ```
 */
get(index: number): E {
  if (index < 0 || index >= this.size()) {
    throw new Error(`Index ${index} out of bounds [0, ${this.size()})`);
  }
  return this._elements[index];
}
```

### Testing Requirements

All code must have comprehensive test coverage:

1. **Use provided test suites** for implementations:

```typescript
import { describeList } from 'ts-collections/test';

describe('ArrayList', () => {
  describeList(() => new ArrayList<number>());

  // Add custom tests for ArrayList-specific behavior
  describe('ArrayList-specific behaviors', () => {
    it('should allocate capacity efficiently', () => {
      // Custom test
    });
  });
});
```

2. **Test coverage targets**:
   - Lines: ≥ 95%
   - Branches: ≥ 90%
   - Functions: ≥ 95%
   - Statements: ≥ 95%

3. **Test structure**:
   - Clear test names
   - One assertion per test (when possible)
   - Arrange-Act-Assert pattern
   - Edge cases covered

```typescript
describe('ArrayList', () => {
  let list: ArrayList<number>;

  beforeEach(() => {
    list = new ArrayList<number>();
  });

  describe('add', () => {
    it('should add element and return true', () => {
      // Arrange
      const element = 42;

      // Act
      const result = list.add(element);

      // Assert
      expect(result).toBe(true);
      expect(list.contains(element)).toBe(true);
    });

    it('should throw when adding null (if applicable)', () => {
      expect(() => list.add(null)).toThrow();
    });
  });
});
```

### SOLID Principles in Code

Ensure your code follows SOLID principles:

#### Single Responsibility
```typescript
// ✅ Good: Each class has one reason to change
class ArrayList<E> extends AbstractList<E> {
  // Only responsible for array-based list operations
}

class HashSet<E> extends AbstractSet<E> {
  // Only responsible for hash-based set operations
}
```

#### Open/Closed
```typescript
// ✅ Good: Open for extension, closed for modification
abstract class AbstractCollection<E> implements Collection<E> {
  // Concrete methods can be extended
  // Abstract methods must be implemented
}

class MyCollection<E> extends AbstractCollection<E> {
  // Extend without modifying parent
}
```

#### Liskov Substitution
```typescript
// ✅ Good: Subclass can replace parent
function processCollection(collection: Collection<number>) {
  // Works with any Collection implementation
  collection.add(1);
  collection.remove(1);
}

processCollection(new ArrayList<number>()); // ✅
processCollection(new LinkedList<number>()); // ✅
processCollection(new HashSet<number>()); // ✅
```

#### Interface Segregation
```typescript
// ✅ Good: Clients depend only on needed methods
interface Collection<E> {
  add(element: E): boolean;
  // Specific methods only, not kitchen sink
}

interface Queue<E> extends Collection<E> {
  offer(element: E): boolean;
  // Queue-specific methods
}
```

#### Dependency Inversion
```typescript
// ✅ Good: Depend on abstractions
function processElements(collection: Collection<number>) {
  const iterator = collection.iterator();
  while (iterator.hasNext()) {
    console.log(iterator.next());
  }
}
```

## Common Contribution Scenarios

### Adding a New Data Structure

1. **Define the interface** (if needed):
   ```typescript
   // src/interfaces/Deque.ts
   export interface Deque<E> extends Queue<E> {
     addFirst(element: E): void;
     removeLast(): E | undefined;
     // ...
   }
   ```

2. **Create abstract class** (if applicable):
   ```typescript
   // src/abstracts/AbstractDeque.ts
   export abstract class AbstractDeque<E> extends AbstractQueue<E> implements Deque<E> {
     // Default implementations
   }
   ```

3. **Implement concrete class**:
   ```typescript
   // src/queue/LinkedDeque.ts
   export class LinkedDeque<E> extends AbstractDeque<E> {
     // Concrete implementation
   }
   ```

4. **Create comprehensive tests**:
   ```typescript
   // test/queue/LinkedDeque.test.ts
   import { describeQueue } from 'ts-collections/test';
   
   describe('LinkedDeque', () => {
     describeQueue(() => new LinkedDeque<number>());
     // Custom tests
   });
   ```

5. **Update exports**:
   ```typescript
   // src/index.ts
   export { LinkedDeque } from './queue/LinkedDeque';
   ```

6. **Update documentation**:
   - Add to README.md
   - Add code examples
   - Document complexity

### Fixing a Bug

1. Create an issue describing the bug
2. Create a test that reproduces the bug
3. Fix the bug
4. Ensure test passes
5. Submit PR with reference to issue

```typescript
// Example: Test for bug fix
it('should handle edge case when list is empty', () => {
  const list = new ArrayList<number>();
  expect(list.isEmpty()).toBe(true);
  expect(list.removeAt(0)).toThrow(); // Bug fix verification
});
```

### Performance Improvements

1. **Benchmark before**:
   ```typescript
   console.time('operation');
   // ... operation
   console.timeEnd('operation');
   ```

2. **Document the improvement**:
   - Old complexity: O(n²)
   - New complexity: O(n log n)
   - Performance gain: ~60% faster on large sets

3. **Ensure tests still pass**

4. **Update documentation** with new complexity

## Pull Request Process

### Before Submitting

- [ ] Tests pass: `pnpm test`
- [ ] Linter passes: `pnpm lint`
- [ ] Code is formatted: `pnpm format`
- [ ] Build succeeds: `pnpm build`
- [ ] Code coverage targets met
- [ ] Documentation updated
- [ ] Commit messages are clear

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Testing
Describe tests added/modified

## Checklist
- [ ] Tests pass
- [ ] Code is documented
- [ ] No breaking changes
- [ ] Performance impact assessed
```

## Review Process

1. **Automated Checks**:
   - Linting
   - Type checking
   - Tests
   - Coverage

2. **Code Review**:
   - Functionality
   - Code style
   - Documentation
   - Performance

3. **Approval & Merge**:
   - Maintainer approval required
   - Automatic merge on green

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Design Patterns](https://refactoring.guru/design-patterns)
- [Jest Testing Best Practices](https://jestjs.io/docs/getting-started)
- [Git Workflow](https://git-scm.com/docs)

## Questions?

- Open an issue for bugs
- Start a discussion for questions
- Email: support@example.com

---

**Thank you for contributing to TypeScript Collections Framework!**
