# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-27

### Added

#### Core Collections
- **ArrayList** - Dynamic array-based list with O(1) random access
- **LinkedList** - Doubly-linked list with O(1) insertion at both ends
- **HashMap** - Hash-based map with O(1) average lookup
- **TreeMap** - Sorted map implementation
- **HashSet** - Hash-based set with O(1) average operations
- **TreeSet** - Sorted set implementation
- **LinkedQueue** - FIFO queue with O(1) enqueue/dequeue
- **PriorityQueue** - Priority-based queue
- **LinkedDeque** - Double-ended queue
- **LinkedStack** - LIFO stack with O(1) operations

#### Type Safety Features
- Automatic runtime type validation using Zod
- Optional custom Zod schema validation
- Optional custom validator functions
- Strict mode enabled by default (like Java Collections)

#### Interfaces
- Collection<E> - Base collection interface
- List<E> - Ordered indexed collection
- Set<E> - Unique elements collection
- Map<K,V> - Key-value mapping
- Queue<E> - FIFO queue interface
- Stack<E> - LIFO stack interface
- Deque<E> - Double-ended queue
- Iterator<E> - Element traversal
- SortedMap<K,V> - Ordered map
- SortedSet<E> - Ordered set
- NavigableMap<K,V> - Navigable sorted map
- NavigableSet<E> - Navigable sorted set

#### Abstract Base Classes
- AbstractCollection<E> - Base for all collections
- AbstractList<E> - Base for list implementations
- AbstractSet<E> - Base for set implementations
- AbstractMap<K,V> - Base for map implementations
- AbstractQueue<E> - Base for queue implementations
- AbstractStack<E> - Base for stack implementations
- AbstractDeque<E> - Base for deque implementations

#### Utilities
- createValidator() - Create validators from Zod schemas
- validateSafe() - Safe validation returning Result type
- formatValidationError() - Format validation errors
- createUnionValidator() - Validate union types
- createTransformingValidator() - Validate and transform
- getSchemaDescription() - Get schema descriptions

#### Documentation
- Comprehensive README with quick start guide
- Architecture documentation
- API reference
- Contributing guidelines
- Quick reference guide
- Project setup guide

#### Build & Publishing
- ESM and CJS dual-format output
- TypeScript declaration files
- Tree-shaking support (sideEffects: false)
- Minified builds
- Source maps for debugging

#### Testing
- 332 comprehensive tests across all collections
- 100% code coverage for implementations
- Integration tests
- Docker-based testing support

#### Developer Experience
- TypeScript strict mode enabled
- ESLint configuration with @typescript-eslint
- Prettier code formatting
- Vitest test runner with watch mode
- Benchmark suite with tinybench
- GitHub issue templates (bug, feature, documentation, question)
- GitHub workflows for CI/CD

### Configuration
- TypeScript 5.9+ support
- Node.js 18+ compatibility
- pnpm 10.18+ package manager
- Strict tsconfig with:
  - noImplicitAny: true
  - noUncheckedIndexedAccess: true
  - exactOptionalPropertyTypes: true
  - noImplicitOverride: true

## Release Notes

### Version 1.0.0 - First Stable Release

This is the initial stable release of ts-collections, featuring:

- ✅ 6 fully-implemented collection types
- ✅ 332/332 tests passing
- ✅ 100% test coverage
- ✅ Automatic runtime type safety
- ✅ Java-inspired APIs for familiar DX
- ✅ Production-ready code quality
- ✅ Comprehensive documentation
- ✅ Zero breaking changes ahead (committed to semver)

### Known Limitations

- Async iteration not yet supported (planned for 1.1.0)
- Custom Comparator support for TreeMap/TreeSet limited
- HashMap uses native JS Map (different collision strategy than Java)

### Performance

See `bench/` for benchmarks. Key metrics:
- ArrayList: O(1) add/get, O(n) insert at index
- LinkedList: O(1) add/remove at both ends, O(n) get
- HashMap: O(1) average put/get, O(n) worst case
- Validation overhead: ~5-10% for typical operations

---

## Future Roadmap

### 1.1.0 (Q2 2026)
- AsyncIterator support
- Comparator interface for TreeMap/TreeSet
- LinkedHashMap (insertion-order map)
- WeakMap wrapper utilities

### 1.2.0 (Q3 2026)
- CopyOnWriteArrayList
- Collections.unmodifiable() utilities
- Bulk operations optimization
- Performance optimization pass

### 2.0.0 (Q4 2026+)
- Full async collection support
- Parallel iteration utilities
- Advanced data structures (SkipList, BloomFilter)
- GraphQL/REST integration helpers

---

## Migration Guides

For users migrating from other collection libraries:
- See CONTRIBUTING.md for Java Collections migration
- See QUICKSTART.md for getting started
- See QUICK_REFERENCE.md for API comparison

---

**For more information, see the [README.md](README.md) and [ARCHITECTURE.md](ARCHITECTURE.md)**
