/**
 * Re-export integrity tests for src/index.ts
 *
 * These tests ensure that the public API surface of the package remains intact.
 * If any export is accidentally removed from a barrel file, these tests will
 * catch the breakage before it reaches users.
 *
 * Covers issue #42: "Vitest coverage excludes index.ts files - re-export quality at risk"
 */

import { describe, expect, it } from "vitest";

// ── Concrete implementations ──────────────────────────────────────────────────
import {
	ArrayList,
	HashMap,
	HashSet,
	LinkedDeque,
	LinkedList,
	LinkedQueue,
	LinkedStack,
	PriorityQueue,
	TreeMap,
	TreeSet,
} from "../src/index";

// ── Abstract base classes ─────────────────────────────────────────────────────
import {
	AbstractCollection,
	AbstractDeque,
	AbstractList,
	AbstractMap,
	AbstractQueue,
	AbstractSet,
	AbstractStack,
} from "../src/index";

// ── Error classes ─────────────────────────────────────────────────────────────
import {
	BaseCollectionError,
	CollectionEmptyError,
	ComparatorRequiredError,
	ConsoleErrorLogger,
	DuplicateKeyError,
	IndexOutOfBoundsError,
	InvalidOperationError,
	TypeMismatchError,
	ValidationError,
} from "../src/index";

// ── Validation utilities ──────────────────────────────────────────────────────
import {
	createTransformingValidator,
	createUnionValidator,
	createValidator,
	formatValidationError,
	getSchemaDescription,
	validateSafe,
} from "../src/index";

// ─────────────────────────────────────────────────────────────────────────────

describe("src/index.ts - concrete implementations are exported", () => {
	it("exports ArrayList as a constructor", () => {
		expect(ArrayList).toBeDefined();
		expect(typeof ArrayList).toBe("function");
		expect(new ArrayList()).toBeInstanceOf(ArrayList);
	});

	it("exports LinkedList as a constructor", () => {
		expect(LinkedList).toBeDefined();
		expect(typeof LinkedList).toBe("function");
		expect(new LinkedList()).toBeInstanceOf(LinkedList);
	});

	it("exports HashMap as a constructor", () => {
		expect(HashMap).toBeDefined();
		expect(typeof HashMap).toBe("function");
		expect(new HashMap()).toBeInstanceOf(HashMap);
	});

	it("exports TreeMap as a constructor", () => {
		expect(TreeMap).toBeDefined();
		expect(typeof TreeMap).toBe("function");
		expect(new TreeMap()).toBeInstanceOf(TreeMap);
	});

	it("exports HashSet as a constructor", () => {
		expect(HashSet).toBeDefined();
		expect(typeof HashSet).toBe("function");
		expect(new HashSet()).toBeInstanceOf(HashSet);
	});

	it("exports TreeSet as a constructor", () => {
		expect(TreeSet).toBeDefined();
		expect(typeof TreeSet).toBe("function");
		expect(new TreeSet()).toBeInstanceOf(TreeSet);
	});

	it("exports LinkedQueue as a constructor", () => {
		expect(LinkedQueue).toBeDefined();
		expect(typeof LinkedQueue).toBe("function");
		expect(new LinkedQueue()).toBeInstanceOf(LinkedQueue);
	});

	it("exports LinkedDeque as a constructor", () => {
		expect(LinkedDeque).toBeDefined();
		expect(typeof LinkedDeque).toBe("function");
		expect(new LinkedDeque()).toBeInstanceOf(LinkedDeque);
	});

	it("exports PriorityQueue as a constructor", () => {
		expect(PriorityQueue).toBeDefined();
		expect(typeof PriorityQueue).toBe("function");
		expect(new PriorityQueue()).toBeInstanceOf(PriorityQueue);
	});

	it("exports LinkedStack as a constructor", () => {
		expect(LinkedStack).toBeDefined();
		expect(typeof LinkedStack).toBe("function");
		expect(new LinkedStack()).toBeInstanceOf(LinkedStack);
	});
});

describe("src/index.ts - abstract base classes are exported", () => {
	it("exports AbstractCollection", () => {
		expect(AbstractCollection).toBeDefined();
		expect(typeof AbstractCollection).toBe("function");
	});

	it("exports AbstractList", () => {
		expect(AbstractList).toBeDefined();
		expect(typeof AbstractList).toBe("function");
	});

	it("exports AbstractSet", () => {
		expect(AbstractSet).toBeDefined();
		expect(typeof AbstractSet).toBe("function");
	});

	it("exports AbstractMap", () => {
		expect(AbstractMap).toBeDefined();
		expect(typeof AbstractMap).toBe("function");
	});

	it("exports AbstractQueue", () => {
		expect(AbstractQueue).toBeDefined();
		expect(typeof AbstractQueue).toBe("function");
	});

	it("exports AbstractStack", () => {
		expect(AbstractStack).toBeDefined();
		expect(typeof AbstractStack).toBe("function");
	});

	it("exports AbstractDeque", () => {
		expect(AbstractDeque).toBeDefined();
		expect(typeof AbstractDeque).toBe("function");
	});
});

describe("src/index.ts - error classes are exported", () => {
	it("exports BaseCollectionError", () => {
		expect(BaseCollectionError).toBeDefined();
		expect(typeof BaseCollectionError).toBe("function");
	});

	it("exports CollectionEmptyError", () => {
		expect(CollectionEmptyError).toBeDefined();
		const err = new CollectionEmptyError("test");
		expect(err).toBeInstanceOf(CollectionEmptyError);
		expect(err).toBeInstanceOf(BaseCollectionError);
	});

	it("exports IndexOutOfBoundsError", () => {
		expect(IndexOutOfBoundsError).toBeDefined();
		const err = new IndexOutOfBoundsError(99, 10);
		expect(err).toBeInstanceOf(IndexOutOfBoundsError);
		expect(err).toBeInstanceOf(BaseCollectionError);
	});

	it("exports InvalidOperationError", () => {
		expect(InvalidOperationError).toBeDefined();
		const err = new InvalidOperationError("nope");
		expect(err).toBeInstanceOf(InvalidOperationError);
		expect(err).toBeInstanceOf(BaseCollectionError);
	});

	it("exports TypeMismatchError", () => {
		expect(TypeMismatchError).toBeDefined();
		expect(typeof TypeMismatchError).toBe("function");
	});

	it("exports DuplicateKeyError", () => {
		expect(DuplicateKeyError).toBeDefined();
		expect(typeof DuplicateKeyError).toBe("function");
	});

	it("exports ComparatorRequiredError", () => {
		expect(ComparatorRequiredError).toBeDefined();
		expect(typeof ComparatorRequiredError).toBe("function");
	});

	it("exports ValidationError", () => {
		expect(ValidationError).toBeDefined();
		expect(typeof ValidationError).toBe("function");
	});

	it("exports ConsoleErrorLogger", () => {
		expect(ConsoleErrorLogger).toBeDefined();
		expect(typeof ConsoleErrorLogger).toBe("function");
	});
});

describe("src/index.ts - validation utilities are exported", () => {
	it("exports createValidator as a function", () => {
		expect(createValidator).toBeDefined();
		expect(typeof createValidator).toBe("function");
	});

	it("exports createUnionValidator as a function", () => {
		expect(createUnionValidator).toBeDefined();
		expect(typeof createUnionValidator).toBe("function");
	});

	it("exports createTransformingValidator as a function", () => {
		expect(createTransformingValidator).toBeDefined();
		expect(typeof createTransformingValidator).toBe("function");
	});

	it("exports validateSafe as a function", () => {
		expect(validateSafe).toBeDefined();
		expect(typeof validateSafe).toBe("function");
	});

	it("exports formatValidationError as a function", () => {
		expect(formatValidationError).toBeDefined();
		expect(typeof formatValidationError).toBe("function");
	});

	it("exports getSchemaDescription as a function", () => {
		expect(getSchemaDescription).toBeDefined();
		expect(typeof getSchemaDescription).toBe("function");
	});
});

describe("src/index.ts - re-exports are consistent with implementation", () => {
	it("ArrayList from index is the same reference as from its module", async () => {
		const { ArrayList: ArrayListDirect } = await import(
			"../src/list/ArrayList"
		);
		expect(ArrayList).toBe(ArrayListDirect);
	});

	it("HashMap from index is the same reference as from its module", async () => {
		const { HashMap: HashMapDirect } = await import("../src/map/HashMap");
		expect(HashMap).toBe(HashMapDirect);
	});

	it("HashSet from index is the same reference as from its module", async () => {
		const { HashSet: HashSetDirect } = await import("../src/set/HashSet");
		expect(HashSet).toBe(HashSetDirect);
	});

	it("LinkedList from index is the same reference as from its module", async () => {
		const { LinkedList: LinkedListDirect } = await import(
			"../src/list/LinkedList"
		);
		expect(LinkedList).toBe(LinkedListDirect);
	});

	it("TreeMap from index is the same reference as from its module", async () => {
		const { TreeMap: TreeMapDirect } = await import("../src/map/TreeMap");
		expect(TreeMap).toBe(TreeMapDirect);
	});

	it("TreeSet from index is the same reference as from its module", async () => {
		const { TreeSet: TreeSetDirect } = await import("../src/set/TreeSet");
		expect(TreeSet).toBe(TreeSetDirect);
	});

	it("LinkedStack from index is the same reference as from its module", async () => {
		const { LinkedStack: LinkedStackDirect } = await import(
			"../src/stack/LinkedStack"
		);
		expect(LinkedStack).toBe(LinkedStackDirect);
	});

	it("LinkedQueue from index is the same reference as from its module", async () => {
		const { LinkedQueue: LinkedQueueDirect } = await import(
			"../src/queue/LinkedQueue"
		);
		expect(LinkedQueue).toBe(LinkedQueueDirect);
	});

	it("LinkedDeque from index is the same reference as from its module", async () => {
		const { LinkedDeque: LinkedDequeDirect } = await import(
			"../src/queue/LinkedDeque"
		);
		expect(LinkedDeque).toBe(LinkedDequeDirect);
	});

	it("PriorityQueue from index is the same reference as from its module", async () => {
		const { PriorityQueue: PriorityQueueDirect } = await import(
			"../src/queue/PriorityQueue"
		);
		expect(PriorityQueue).toBe(PriorityQueueDirect);
	});
});
