# ts-collections Implementation Roadmap

**Aligned with:** `PRD.md`  
**Date:** 2026-04-21

---

## Roadmap Overview
This roadmap converts the PRD into execution milestones with acceptance criteria.

### Locked direction
- Package/repo direction: continue with `ts-collections`
- API posture: Java-like with TS-idiomatic adjustments
- Null/undefined: allowed by default
- Validation: ON by default, opt-out available
- Expansion order: `Deque` → `PriorityQueue` → `TreeMap` → `TreeSet`

---

## Milestone M1 — Contract Stabilization

### Scope
- Finalize behavioral contracts for existing interfaces and implementations.
- Freeze naming and semantic conventions for v1.x.

### Deliverables
- `BEHAVIOR_CONSISTENCY_MATRIX.md` completed and approved.
- Interface docs updated with explicit edge-case behavior.
- Shared contract tests for existing structures.

### Acceptance Criteria
- All current collections pass contract tests.
- No unresolved ambiguity in return/throw semantics.
- CI remains green (test/lint/build).

---

## Milestone M2 — Consistency Hardening

### Scope
- Align behavior across classes for mutation, iteration, and boundary conditions.
- Standardize error messages and error categories.

### Deliverables
- Unified error message guidelines doc (or section in architecture docs).
- Additional edge-case tests per collection.
- Changelog note documenting consistency guarantees.

### Acceptance Criteria
- Cross-implementation contract parity verified by tests.
- No high-severity consistency bugs in release candidate.

---

## Milestone M3 — Performance & DX

### Scope
- Benchmark baseline for existing implementations.
- Improve Java migration documentation and TS ergonomics examples.

### Deliverables
- Benchmark baseline report in repo docs.
- Java-to-ts-collections mapping guide updates.
- Examples for validation ON/OFF modes.

### Acceptance Criteria
- Benchmark suite runnable from CI/local.
- No unexplained regression >10% on key operations.
- Docs pass link/consistency checks.

---

## Milestone M4 — Expansion: Deque

### Scope
- Add interface + abstract support if needed.
- Implement first concrete `Deque`.

### Deliverables
- `Deque` interface and implementation(s).
- Full contract + edge-case tests.
- API docs and examples.

### Acceptance Criteria
- 100% passing tests for new API surface.
- Behavior matrix updated.
- No breaking changes to existing interfaces.

---

## Milestone M5 — Expansion: PriorityQueue

### Scope
- Implement comparator-based priority queue semantics for TS.

### Deliverables
- `PriorityQueue` implementation.
- Comparator behavior docs and test matrix.

### Acceptance Criteria
- Stable ordering behavior documented for equal priority policy.
- Complexity targets documented and met in baseline benchmarks.

---

## Milestone M6 — Expansion: TreeMap

### Scope
- Sorted key-value map with explicit comparator/natural-order policy.

### Deliverables
- `TreeMap` implementation with API docs.
- Contract tests for ordering, replacement, and iteration.

### Acceptance Criteria
- Deterministic key ordering guaranteed.
- Java parity differences explicitly documented.

---

## Milestone M7 — Expansion: TreeSet

### Scope
- Sorted set implementation aligned with `TreeMap` ordering rules.

### Deliverables
- `TreeSet` implementation + tests + docs.
- Interop examples with `TreeMap` comparator strategy.

### Acceptance Criteria
- Duplicate and ordering semantics match documented contract.
- No unresolved performance regressions from M6 baseline.

---

## Cross-Cutting Quality Gates (All Milestones)
1. `pnpm test` must pass.
2. `pnpm lint` must pass.
3. `pnpm build` must pass.
4. Public API changes require docs + examples.
5. Breaking changes require deprecation path or major-version plan.

---

## Suggested Issue Breakdown Template
For each feature issue:
1. Contract definition
2. Interface/abstract changes
3. Concrete implementation
4. Tests (happy path + edge + errors)
5. Docs and migration note
6. Benchmark addition (if performance-sensitive)

---

## Suggested Release Strategy
- `v1.x` for consistency and additive features
- Pre-release tags (`alpha`/`beta`) for new structure classes
- Semver + changelog with parity/behavior notes per release
