/**
 * TypeScript Collections Framework - Root entry point
 *
 * This library provides a comprehensive, type-safe Collections Framework
 * inspired by Java's Collections API, designed for TypeScript.
 *
 * @packageDocumentation
 *
 * ## Features
 *
 * - **Industry-Grade Implementation**: SOLID principles, comprehensive test coverage
 * - **Type Safety**: Full TypeScript support with generics and strict typing
 * - **Java-Inspired API**: Familiar Collections interface for Java developers
 * - **Extensible Design**: Abstract base classes for easy custom implementations
 * - **Tree-Shakeable**: ESM build with dead code elimination support
 *
 * ## Core Interfaces
 *
 * - {@link Collection} - Base collection interface
 * - {@link List} - Ordered collection with index access
 * - {@link Set} - Collection with no duplicate elements
 * - {@link Map} - Key-value mappings
 * - {@link Queue} - FIFO collection for element processing
 * - {@link Iterator} - Element traversal
 *
 * ## Abstract Base Classes
 *
 * - {@link AbstractCollection} - Base implementation for all collections
 * - {@link AbstractList} - Foundation for list implementations
 * - {@link AbstractSet} - Foundation for set implementations
 * - {@link AbstractMap} - Foundation for map implementations
 * - {@link AbstractQueue} - Foundation for queue implementations
 *
 * ## Usage Example
 *
 * ```typescript
 * import { ArrayList, HashSet, HashMap } from 'ts-collections';
 *
 * // Working with Lists
 * const list = new ArrayList<number>();
 * list.add(1);
 * list.add(2);
 * list.addAt(1, 1.5);
 *
 * // Working with Sets
 * const set = new HashSet<string>();
 * set.add("apple");
 * set.add("apple"); // No duplicates
 *
 * // Working with Maps
 * const map = new HashMap<string, number>();
 * map.put("count", 42);
 * ```
 *
 * ## Architecture
 *
 * The framework follows a clear layering:
 *
 * 1. **Interfaces** (`src/interfaces/`) - Define contracts
 * 2. **Abstract Classes** (`src/abstracts/`) - Provide common functionality
 * 3. **Concrete Implementations** (`src/{list,set,map,queue}/`) - Specific data structures
 * 4. **Utilities** (`src/utils/`) - Helper functions and algorithms
 *
 * ## Design Principles
 *
 * - **Single Responsibility**: Each class has one reason to change
 * - **Open/Closed**: Open for extension, closed for modification
 * - **Liskov Substitution**: Subclasses can replace parent classes
 * - **Interface Segregation**: Clients depend only on needed methods
 * - **Dependency Inversion**: Depend on abstractions, not concretions
 *
 * @see {@link https://github.com/yourusername/ts-collections} GitHub Repository
 */

// Core Interfaces
export type {
  Iterator,
  Collection,
  List,
  Set,
  Map,
  Queue,
} from "./interfaces";

// Abstract Base Classes
export {
  AbstractCollection,
  AbstractList,
  AbstractSet,
  AbstractMap,
  AbstractQueue,
} from "./abstracts";

// Concrete Implementations
export { ArrayList } from "./list/ArrayList";
export { HashSet } from "./set/HashSet";
export { HashMap } from "./map/HashMap";
export { LinkedQueue } from "./queue/LinkedQueue";
