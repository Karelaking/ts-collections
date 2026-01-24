# TypeScript Collections Framework - Architecture Overview

## 🎯 System Architecture Diagram

Mermaid Diagram: see diagrams/architecture.mmd
```

## 🔄 Class Hierarchy

### Collection Hierarchy

Mermaid Diagram: see diagrams/class-hierarchy.mmd

### Map Hierarchy

```
Map<K,V> (Interface)
├── AbstractMap<K,V> (Abstract)
│   ├── HashMap<K,V> (Concrete)
│   ├── TreeMap<K,V> (Concrete)
│   └── ...
```

## 📊 Interface Contract Matrix

| Interface | Key Methods | Abstract | Concrete |
|-----------|-----------|----------|----------|
| **Iterator** | hasNext(), next(), remove?() | ✅ | ❌ |
| **Collection** | add(), remove(), contains(), size(), iterator(), toArray(), toString(), addAll(), removeAll(), retainAll(), containsAll(), clear(), isEmpty() | ✅ | ❌ |
| **List** | get(), set(), addAt(), removeAt(), indexOf(), lastIndexOf(), subList() | ✅ | ❌ |
| **Set** | (extends Collection) - guarantees uniqueness | ✅ | ❌ |
| **Map** | put(), get(), remove(), keys(), values(), entries(), putAll() | ✅ | ❌ |
| **Queue** | offer(), dequeue(), poll(), element(), peek() | ✅ | ❌ |

## 🧩 Method Resolution Order (MRO)

### For ArrayList (implements List)

```
ArrayList<E>
    ↑
    └─ AbstractList<E>
        ↑
        └─ AbstractCollection<E>
            ↑
            ├─ Collection<E> (interface)
            └─ List<E> (interface)
```

**Method Resolution:**
1. ArrayList (if defined) → Abstract List → AbstractCollection → Interface

**Example:**
```
ArrayList.add(element)
→ AbstractList.add(element)     // Delegates to addAt()
→ AbstractCollection.add()       // Abstract - must override
→ ArrayList.addAt()              // Concrete implementation
```

## 🔗 Dependency Relationships

Mermaid Diagram: see diagrams/architecture.mmd

## 🎯 SOLID Principles Mapping

```
┌──────────────────────────────────────────────────────────────┐
│  S - Single Responsibility Principle                         │
├──────────────────────────────────────────────────────────────┤
│  ✅ Iterator: Only traversal                                 │
│  ✅ Collection: Only core operations                         │
│  ✅ List: Only ordered access                                │
│  ✅ Set: Only uniqueness guarantee                           │
│  ✅ Map: Only key-value storage                              │
│  ✅ Queue: Only FIFO processing                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  O - Open/Closed Principle                                   │
├──────────────────────────────────────────────────────────────┤
│  ✅ Open for extension: Abstract classes, interfaces         │
│  ✅ Closed for modification: Implement, don't change         │
│  ✅ New collection types without modifying existing code     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  L - Liskov Substitution Principle                           │
├──────────────────────────────────────────────────────────────┤
│  ✅ processCollection(Collection<E>) works with:             │
│     - ArrayList, LinkedList, HashSet, TreeSet, Queue, etc.   │
│  ✅ All maintain Collection contract                         │
│  ✅ Safe polymorphic behavior                                │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  I - Interface Segregation Principle                         │
├──────────────────────────────────────────────────────────────┤
│  ✅ Queue doesn't inherit all Collection operations          │
│  ✅ Iterator only has 3 core methods                         │
│  ✅ Clients depend only on needed interface                  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  D - Dependency Inversion Principle                          │
├──────────────────────────────────────────────────────────────┤
│  ✅ Code depends on Collection, not ArrayList               │
│  ✅ Implementations are interchangeable                      │
│  ✅ Abstract dependencies enable flexibility                 │
└──────────────────────────────────────────────────────────────┘
```

## 📈 Extension Points

```
┌─────────────────────────────────────────────────────┐
│         Create New Collection Type                  │
└────────────────┬──────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │  Identify Type   │
        │ • Ordered? List  │
        │ • Unique? Set    │
        │ • KV? Map        │
        │ • FIFO? Queue    │
        └────────┬────────┘
                 │
    ┌────────────▼────────────┐
    │  Extend Abstract Class   │
    │ • AbstractList, etc.     │
    │ • Override abstracts     │
    │ • Implement specifics    │
    └────────────┬─────────────┘
                 │
    ┌────────────▼────────────┐
    │  Test with Factory       │
    │ • describeList(creator)  │
    │ • describeSet(creator)   │
    │ • ... etc                │
    └────────────┬─────────────┘
                 │
    ┌────────────▼────────────┐
    │  Add Custom Tests        │
    │ • Performance edge cases │
    │ • Type-specific features │
    └────────────┬─────────────┘
                 │
    ┌────────────▼────────────┐
    │  Export & Document       │
    │ • src/index.ts           │
    │ • README.md              │
    │ • JSDoc comments         │
    └──────────────────────────┘
```

## 🧪 Testing Architecture

Mermaid Diagram: see diagrams/testing-architecture.mmd

## 🔐 Type Safety Guarantees

```
┌──────────────────────────────────────────────────┐
│          TypeScript Strict Mode                  │
├──────────────────────────────────────────────────┤
│  ✅ strict: true                                 │
│  ✅ noImplicitOverride: true                     │
│  ✅ noUncheckedIndexedAccess: true               │
│  ✅ exactOptionalPropertyTypes: true             │
│  ✅ noUncheckedSideEffectImports: true           │
│  ✅ verbatimModuleSyntax: true                   │
│  ✅ isolatedModules: true                        │
│  ✅ moduleDetection: "force"                     │
└──────────────────────────────────────────────────┘

     ↓

┌──────────────────────────────────────────────────┐
│      Compile-Time Safety Guarantees             │
├──────────────────────────────────────────────────┤
│  ✅ Type errors caught during development        │
│  ✅ No implicit 'any' types                      │
│  ✅ null/undefined explicitly typed              │
│  ✅ Property access validation                   │
│  ✅ Override correctness enforced                │
│  ✅ No silent side effects                       │
│  ✅ Module boundaries enforced                   │
└──────────────────────────────────────────────────┘

     ↓

┌──────────────────────────────────────────────────┐
│      Runtime Confidence & Safety                │
├──────────────────────────────────────────────────┤
│  ✅ Types accurate at runtime                    │
│  ✅ Generic constraints enforced                 │
│  ✅ Collection contracts guaranteed              │
│  ✅ Iterator safety verified                     │
└──────────────────────────────────────────────────┘
```

## 🚀 Development Workflow

```
1. DESIGN
   └─ Define interface contract
      └─ Document methods & complexity

2. TEST (Test-Driven)
   └─ Create test suite (factory function)
      └─ Specify expected behavior
         └─ Cover edge cases

3. IMPLEMENT
   └─ Extend abstract base class
      └─ Implement abstract methods
         └─ Follow interface contract

4. VERIFY
   └─ Run tests via factory
      └─ Ensure 100% pass
         └─ Check code coverage

5. OPTIMIZE
   └─ Profile performance
      └─ Document complexity
         └─ Improve algorithms

6. DOCUMENT
   └─ Update README
      └─ Add JSDoc comments
         └─ Provide examples
```

## 🎓 Example: Implementing ArrayList

```
User Code
    ↓
   new ArrayList<number>()
    ↓
   ArrayList<E> (Concrete)
    ├─ get(index): E          // Override
    ├─ set(index, element): E // Override
    ├─ addAt(index, element)  // Override
    ├─ removeAt(index): E      // Override
    ├─ indexOf(element): number // Override
    ├─ lastIndexOf(element)   // Override
    ├─ subList(from, to)      // Override
    ├─ size()                 // Override
    ├─ contains(element)      // Override
    ├─ iterator()             // Override
   ├─ toArray()              // Override
   ├─ toString()             // Inherited default (override if custom formatting)
    ├─ add(element)           // Inherited from AbstractList
    ├─ remove(element)        // Inherited from AbstractList
    ├─ clear()                // Override
    └─ All Collection methods // Inherited from AbstractCollection
        ├─ containsAll()
        ├─ addAll()
        ├─ removeAll()
        ├─ retainAll()
        └─ isEmpty()
```

---

This architecture provides:
- ✅ **Clarity** - Clear hierarchy and responsibility
- ✅ **Reusability** - Common code in abstract classes
- ✅ **Testability** - Factory-based test suites
- ✅ **Extensibility** - Easy to add new types
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Maintainability** - SOLID principles throughout

##  Runtime Type Validation Architecture (NEW)

Zod-based validation system integrated as core functionality:

- **validateSafe()** - Safe validation without throwing
- **createValidator()** - Create reusable validators
- **Cascading strategy** - Zod > Custom > Strict > None
- **Independent key/value validation** - For HashMap
- **Detailed error messages** - Path-aware error reporting
- **Zero overhead when unused** - Fully opt-in

All collections now support:
`	ypescript
const list = new ArrayList<T>({
  schema: z.object({...}),     // Recommended
  strictType: true,             // Lightweight
  typeValidator: (v) => {...}   // Custom logic
});
`

Complete type safety at compile-time and runtime!
