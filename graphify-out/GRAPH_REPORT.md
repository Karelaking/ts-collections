# Graph Report - .  (2026-04-22)

## Corpus Check
- 68 files · ~51,505 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 303 nodes · 424 edges · 53 communities detected
- Extraction: 75% EXTRACTED · 25% INFERRED · 0% AMBIGUOUS · INFERRED: 105 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_add LinkedList clear|add LinkedList clear]]
- [[_COMMUNITY_constructor peek LinkedDeque|constructor peek LinkedDeque]]
- [[_COMMUNITY_constructor TreeMap getKeyValidationMode|constructor TreeMap getKeyValidationMode]]
- [[_COMMUNITY_constructor length remove|constructor length remove]]
- [[_COMMUNITY_Semantics Rationale Extension|Semantics Rationale Extension]]
- [[_COMMUNITY_PriorityQueue pop constructor|PriorityQueue pop constructor]]
- [[_COMMUNITY_constructor toArray LinkedQueue|constructor toArray LinkedQueue]]
- [[_COMMUNITY_ArrayList add addAt|ArrayList add addAt]]
- [[_COMMUNITY_HashMap clear constructor|HashMap clear constructor]]
- [[_COMMUNITY_TreeSet addAll add|TreeSet addAll add]]
- [[_COMMUNITY_HashSet add clear|HashSet add clear]]
- [[_COMMUNITY_System Architecture Contribution|System Architecture Contribution]]
- [[_COMMUNITY_createTransformingValidator createUnionValidator|createTransformingValidator createUnionValidator]]
- [[_COMMUNITY_describeCollection|describeCollection]]
- [[_COMMUNITY_describeDeque Deque|describeDeque Deque]]
- [[_COMMUNITY_describeIterator Iterator|describeIterator Iterator]]
- [[_COMMUNITY_describeList List|describeList List]]
- [[_COMMUNITY_describeMap Map|describeMap Map]]
- [[_COMMUNITY_describeQueue Queue|describeQueue Queue]]
- [[_COMMUNITY_describeSet Set|describeSet Set]]
- [[_COMMUNITY_describeStack Stack|describeStack Stack]]
- [[_COMMUNITY_eslint config|eslint config]]
- [[_COMMUNITY_tsup config|tsup config]]
- [[_COMMUNITY_vitest config|vitest config]]
- [[_COMMUNITY_bench mjs|bench mjs]]
- [[_COMMUNITY_index|index]]
- [[_COMMUNITY_index|index]]
- [[_COMMUNITY_Collection.ts|Collection.ts]]
- [[_COMMUNITY_Deque|Deque]]
- [[_COMMUNITY_index|index]]
- [[_COMMUNITY_Iterator|Iterator]]
- [[_COMMUNITY_List|List]]
- [[_COMMUNITY_Map|Map]]
- [[_COMMUNITY_Queue|Queue]]
- [[_COMMUNITY_Set|Set]]
- [[_COMMUNITY_Stack|Stack]]
- [[_COMMUNITY_index|index]]
- [[_COMMUNITY_docker integration|docker integration]]
- [[_COMMUNITY_readme.test.ts|readme.test.ts]]
- [[_COMMUNITY_index|index]]
- [[_COMMUNITY_ArrayList|ArrayList]]
- [[_COMMUNITY_LinkedList|LinkedList]]
- [[_COMMUNITY_HashMap|HashMap]]
- [[_COMMUNITY_TreeMap|TreeMap]]
- [[_COMMUNITY_LinkedDeque|LinkedDeque]]
- [[_COMMUNITY_LinkedQueue|LinkedQueue]]
- [[_COMMUNITY_PriorityQueue|PriorityQueue]]
- [[_COMMUNITY_HashSet|HashSet]]
- [[_COMMUNITY_TreeSet|TreeSet]]
- [[_COMMUNITY_LinkedStack|LinkedStack]]
- [[_COMMUNITY_github-actions|github-actions]]
- [[_COMMUNITY_Agent Guidelines|Agent Guidelines]]
- [[_COMMUNITY_SOLID Principles Mapping|SOLID Principles Mapping]]

## God Nodes (most connected - your core abstractions)
1. `LinkedList` - 24 edges
2. `resetTypeInference()` - 22 edges
3. `PriorityQueue` - 21 edges
4. `LinkedDeque` - 20 edges
5. `validateElementType()` - 18 edges
6. `TreeMap` - 17 edges
7. `ArrayList` - 16 edges
8. `HashMap` - 15 edges
9. `LinkedQueue` - 13 edges
10. `TreeSet` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Automatic Type Enforcement` --semantically_similar_to--> `Runtime Validation ON by Default`  [INFERRED] [semantically similar]
  QUICKSTART.md → PRD.md
- `Collection Extension Points` --semantically_similar_to--> `Extension via Abstract Base Classes`  [INFERRED] [semantically similar]
  ARCHITECTURE.md → PRD.md
- `Cross-Cutting Quality Gates` --semantically_similar_to--> `PR Workflow and Quality Checks`  [INFERRED] [semantically similar]
  IMPLEMENTATION_ROADMAP.md → CONTRIBUTING.md
- `Validation Quick Reference` --conceptually_related_to--> `Project Setup Summary`  [AMBIGUOUS]
  QUICK_REFERENCE.md → PROJECT_SETUP.md
- `Expansion Order Deque→PriorityQueue→TreeMap→TreeSet` --shares_data_with--> `Deque Semantics Placeholder`  [INFERRED]
  PRD.md → BEHAVIOR_CONSISTENCY_MATRIX.md

## Hyperedges (group relationships)
- **Contract Governance Across PRD, Matrix, and Roadmap** — prd_product_requirements, behavior_consistency_matrix, implementation_roadmap, roadmap_m1_contract_stabilization [INFERRED 0.89]
- **Expansion Sequence Alignment** — prd_expansion_order, behavior_deque_semantics, behavior_priorityqueue_semantics, behavior_treemap_semantics, behavior_treeset_semantics, implementation_roadmap [INFERRED 0.90]
- **Quality Gate Execution Loop** — roadmap_cross_cutting_quality_gates, contributing_pr_workflow, readme_main_readme, project_summary_overview [INFERRED 0.83]

## Communities

### Community 0 - "add LinkedList clear"
Cohesion: 0.12
Nodes (5): validateElementType(), add(), remove(), resetTypeInference(), LinkedList

### Community 1 - "constructor peek LinkedDeque"
Cohesion: 0.11
Nodes (6): dequeue(), element(), offer(), peek(), poll(), LinkedDeque

### Community 2 - "constructor TreeMap getKeyValidationMode"
Cohesion: 0.11
Nodes (6): getTypeString(), putAll(), validateKeyType(), validateValueType(), TreeMap, getSchemaDescription()

### Community 3 - "constructor length remove"
Cohesion: 0.1
Nodes (13): containsAll(), getTypeString(), isEmpty(), length(), removeAll(), retainAll(), length(), add() (+5 more)

### Community 4 - "Semantics Rationale Extension"
Cohesion: 0.11
Nodes (23): Collection Extension Points, Behavior Consistency Matrix, Deque Semantics Placeholder, Global Collection Policies, PriorityQueue Semantics Placeholder, TreeMap Semantics Placeholder, TreeSet Semantics Placeholder, PR Workflow and Quality Checks (+15 more)

### Community 5 - "PriorityQueue pop constructor"
Cohesion: 0.17
Nodes (1): PriorityQueue

### Community 6 - "constructor toArray LinkedQueue"
Cohesion: 0.11
Nodes (2): add(), LinkedQueue

### Community 7 - "ArrayList add addAt"
Cohesion: 0.15
Nodes (1): ArrayList

### Community 8 - "HashMap clear constructor"
Cohesion: 0.17
Nodes (1): HashMap

### Community 9 - "TreeSet addAll add"
Cohesion: 0.22
Nodes (2): addAll(), TreeSet

### Community 10 - "HashSet add clear"
Cohesion: 0.2
Nodes (1): HashSet

### Community 11 - "System Architecture Contribution"
Cohesion: 0.44
Nodes (9): System Architecture, Contribution Guidelines, Java Collections Framework Tutorial, Project Setup Summary, Project Summary, Validation Quick Reference, Quickstart Guide, Main README (+1 more)

### Community 12 - "createTransformingValidator createUnionValidator"
Cohesion: 0.4
Nodes (2): createUnionValidator(), createValidator()

### Community 13 - "describeCollection"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "describeDeque Deque"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "describeIterator Iterator"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "describeList List"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "describeMap Map"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "describeQueue Queue"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "describeSet Set"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "describeStack Stack"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "eslint config"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "tsup config"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "vitest config"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "bench mjs"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "index"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "index"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Collection.ts"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Deque"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "index"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Iterator"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "List"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Map"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Queue"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Set"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Stack"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "index"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "docker integration"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "readme.test.ts"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "index"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "ArrayList"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "LinkedList"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "HashMap"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "TreeMap"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "LinkedDeque"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "LinkedQueue"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "PriorityQueue"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "HashSet"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "TreeSet"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "LinkedStack"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "github-actions"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Agent Guidelines"
Cohesion: 1.0
Nodes (1): Agent Guidelines Overview

### Community 52 - "SOLID Principles Mapping"
Cohesion: 1.0
Nodes (1): SOLID Principles Mapping

## Ambiguous Edges - Review These
- `Project Setup Summary` → `Validation Quick Reference`  [AMBIGUOUS]
  QUICK_REFERENCE.md · relation: conceptually_related_to

## Knowledge Gaps
- **13 isolated node(s):** `Agent Guidelines Overview`, `Wiki Home Guide`, `Null and Undefined Allowed by Default`, `Global Collection Policies`, `Milestone M1 Contract Stabilization` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `describeCollection`** (2 nodes): `describeCollection()`, `Collection.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `describeDeque Deque`** (2 nodes): `describeDeque()`, `Deque.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `describeIterator Iterator`** (2 nodes): `describeIterator()`, `Iterator.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `describeList List`** (2 nodes): `describeList()`, `List.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `describeMap Map`** (2 nodes): `describeMap()`, `Map.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `describeQueue Queue`** (2 nodes): `describeQueue()`, `Queue.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `describeSet Set`** (2 nodes): `describeSet()`, `Set.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `describeStack Stack`** (2 nodes): `describeStack()`, `Stack.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `eslint config`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `tsup config`** (1 nodes): `tsup.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `vitest config`** (1 nodes): `vitest.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `bench mjs`** (1 nodes): `collections.bench.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `index`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `index`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Collection.ts`** (1 nodes): `Collection.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Deque`** (1 nodes): `Deque.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `index`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Iterator`** (1 nodes): `Iterator.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `List`** (1 nodes): `List.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Map`** (1 nodes): `Map.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Queue`** (1 nodes): `Queue.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Set`** (1 nodes): `Set.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Stack`** (1 nodes): `Stack.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `index`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `docker integration`** (1 nodes): `docker.integration.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `readme.test.ts`** (1 nodes): `readme.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `index`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ArrayList`** (1 nodes): `ArrayList.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `LinkedList`** (1 nodes): `LinkedList.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `HashMap`** (1 nodes): `HashMap.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `TreeMap`** (1 nodes): `TreeMap.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `LinkedDeque`** (1 nodes): `LinkedDeque.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `LinkedQueue`** (1 nodes): `LinkedQueue.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PriorityQueue`** (1 nodes): `PriorityQueue.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `HashSet`** (1 nodes): `HashSet.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `TreeSet`** (1 nodes): `TreeSet.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `LinkedStack`** (1 nodes): `LinkedStack.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `github-actions`** (1 nodes): `github-actions.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Agent Guidelines`** (1 nodes): `Agent Guidelines Overview`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SOLID Principles Mapping`** (1 nodes): `SOLID Principles Mapping`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Project Setup Summary` and `Validation Quick Reference`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `resetTypeInference()` connect `add LinkedList clear` to `constructor peek LinkedDeque`, `constructor TreeMap getKeyValidationMode`, `constructor length remove`, `PriorityQueue pop constructor`, `ArrayList add addAt`, `HashMap clear constructor`, `TreeSet addAll add`, `HashSet add clear`?**
  _High betweenness centrality (0.184) - this node is a cross-community bridge._
- **Why does `validateElementType()` connect `add LinkedList clear` to `constructor peek LinkedDeque`, `constructor length remove`, `PriorityQueue pop constructor`, `constructor toArray LinkedQueue`, `ArrayList add addAt`, `TreeSet addAll add`, `HashSet add clear`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Why does `TreeMap` connect `constructor TreeMap getKeyValidationMode` to `constructor peek LinkedDeque`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `resetTypeInference()` (e.g. with `.clear()` and `.removeFirst()`) actually correct?**
  _`resetTypeInference()` has 21 INFERRED edges - model-reasoned connections that need verification._
- **Are the 16 inferred relationships involving `validateElementType()` (e.g. with `.size()` and `.add()`) actually correct?**
  _`validateElementType()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Agent Guidelines Overview`, `Wiki Home Guide`, `Null and Undefined Allowed by Default` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._