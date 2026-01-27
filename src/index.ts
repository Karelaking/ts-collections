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
 * - **Zod Runtime Validation**: Complete type safety at runtime with Zod integration
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
 * - {@link Stack} - LIFO collection for push/pop workflows
 * - {@link Iterator} - Element traversal
 *
 * ## Abstract Base Classes
 *
 * - {@link AbstractCollection} - Base implementation for all collections
 * - {@link AbstractList} - Foundation for list implementations
 * - {@link AbstractSet} - Foundation for set implementations
 * - {@link AbstractMap} - Foundation for map implementations
 * - {@link AbstractQueue} - Foundation for queue implementations
 * - {@link AbstractStack} - Foundation for stack implementations
 *
 * ## Runtime Type Validation with Zod
 *
 * All collections support optional runtime validation using Zod schemas for complete type safety:
 *
 * ```typescript
 * import { ArrayList } from 'ts-collections';
 * import { z } from 'zod';
 *
 * // Type-safe list with Zod validation
 * const numbers = new ArrayList<number>({
 *   schema: z.number().int().positive()
 * });
 *
 * numbers.add(42);      // ✓ Valid
 * numbers.add(-1);      // ✗ Throws: Validation failed
 * numbers.add("text");  // ✗ Throws: Validation failed
 * ```
 *
 * ## Usage Examples
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
 * 4. **Utilities** (`src/utils/`) - Helper functions and validation utilities
 *
 * ## Design Principles
 *
 * - **Single Responsibility**: Each class has one reason to change
 * - **Open/Closed**: Open for extension, closed for modification
 * - **Liskov Substitution**: Subclasses can replace parent classes
 * - **Interface Segregation**: Clients depend only on needed methods
 * - **Dependency Inversion**: Depend on abstractions, not concretions
 * - **Type Safety First**: Comprehensive validation at runtime with Zod
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
  Stack,
} from "./interfaces";

// Type Validation Options (Zod-based)
export type { TypeValidationOptions } from "./abstracts/AbstractCollection";
export type { MapTypeValidationOptions } from "./abstracts/AbstractMap";

// Validation Utilities
export {
  validateSafe,
  createValidator,
  createUnionValidator,
  getSchemaDescription,
  createTransformingValidator,
  formatValidationError,
  type ValidationResult,
  type ValidationError,
  type ValidationIssue,
  type SchemaType,
} from "./utils/validation";

// Abstract Base Classes
export {
  AbstractCollection,
  AbstractList,
  AbstractSet,
  AbstractMap,
  AbstractQueue,
  AbstractStack,
} from "./abstracts";

// Concrete Implementations
export { ArrayList } from "./list/ArrayList";
export { LinkedList } from "./list/LinkedList";
export { HashSet } from "./set/HashSet";
export { HashMap } from "./map/HashMap";
export { LinkedQueue } from "./queue/LinkedQueue";
export { LinkedStack } from "./stack/LinkedStack";
