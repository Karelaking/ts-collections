import {
	ArrayList,
	HashMap,
	HashSet,
	LinkedList,
	LinkedQueue,
	LinkedStack,
} from "../dist/index.js";

/**
 * Each scenario: { name, operation, fn(size) → benchmarkFn }
 * name     = collection type shown in output
 * operation = the operation being tested
 * fn        = returns the function tinybench will call repeatedly
 */
export const scenarios = [
	// ── ArrayList ──────────────────────────────────────────────────
	{
		name: "ArrayList",
		operation: "add",
		fn: (size) => () => {
			const list = new ArrayList();
			for (let i = 0; i < size; i++) {
				list.add(i);
			}
		},
	},
	{
		name: "ArrayList",
		operation: "get",
		fn: (size) => {
			const list = new ArrayList();
			for (let i = 0; i < size; i++) {
				list.add(i);
			}
			return () => list.get(Math.floor(size / 2));
		},
	},
	{
		name: "ArrayList",
		operation: "addAt",
		fn: (size) => () => {
			const list = new ArrayList();
			for (let i = 0; i < size; i++) {
				list.add(i);
			}
			list.addAt(Math.floor(size / 2), 999);
		},
	},
	{
		name: "ArrayList",
		operation: "contains",
		fn: (size) => {
			const list = new ArrayList();
			for (let i = 0; i < size; i++) {
				list.add(i);
			}
			return () => list.contains(size - 1);
		},
	},
	{
		name: "ArrayList",
		operation: "removeAt",
		fn: (size) => () => {
			const list = new ArrayList();
			for (let i = 0; i < size; i++) {
				list.add(i);
			}
			list.removeAt(size - 1);
		},
	},

	// ── LinkedList ─────────────────────────────────────────────────
	{
		name: "LinkedList",
		operation: "add",
		fn: (size) => () => {
			const list = new LinkedList();
			for (let i = 0; i < size; i++) {
				list.add(i);
			}
		},
	},
	{
		name: "LinkedList",
		operation: "get",
		fn: (size) => {
			const list = new LinkedList();
			for (let i = 0; i < size; i++) {
				list.add(i);
			}
			return () => list.get(Math.floor(size / 2));
		},
	},
	{
		name: "LinkedList",
		operation: "addAt",
		fn: (size) => () => {
			const list = new LinkedList();
			for (let i = 0; i < size; i++) {
				list.add(i);
			}
			list.addAt(Math.floor(size / 2), 999);
		},
	},
	{
		name: "LinkedList",
		operation: "contains",
		fn: (size) => {
			const list = new LinkedList();
			for (let i = 0; i < size; i++) {
				list.add(i);
			}
			return () => list.contains(size - 1);
		},
	},
	{
		name: "LinkedList",
		operation: "removeAt",
		fn: (size) => () => {
			const list = new LinkedList();
			for (let i = 0; i < size; i++) {
				list.add(i);
			}
			list.removeAt(size - 1);
		},
	},

	// ── HashMap ────────────────────────────────────────────────────
	{
		name: "HashMap",
		operation: "put",
		fn: (size) => () => {
			const map = new HashMap();
			for (let i = 0; i < size; i++) {
				map.put(`k${i}`, i);
			}
		},
	},
	{
		name: "HashMap",
		operation: "get",
		fn: (size) => {
			const map = new HashMap();
			for (let i = 0; i < size; i++) {
				map.put(`k${i}`, i);
			}
			return () => map.get(`k${size - 1}`);
		},
	},
	{
		name: "HashMap",
		operation: "remove",
		fn: (size) => () => {
			const map = new HashMap();
			for (let i = 0; i < size; i++) {
				map.put(`k${i}`, i);
			}
			map.remove(`k${size - 1}`);
		},
	},

	// ── HashSet ────────────────────────────────────────────────────
	{
		name: "HashSet",
		operation: "add",
		fn: (size) => () => {
			const set = new HashSet();
			for (let i = 0; i < size; i++) {
				set.add(i);
			}
		},
	},
	{
		name: "HashSet",
		operation: "contains",
		fn: (size) => {
			const set = new HashSet();
			for (let i = 0; i < size; i++) {
				set.add(i);
			}
			return () => set.contains(size - 1);
		},
	},
	{
		name: "HashSet",
		operation: "remove",
		fn: (size) => () => {
			const set = new HashSet();
			for (let i = 0; i < size; i++) {
				set.add(i);
			}
			set.remove(size - 1);
		},
	},

	// ── LinkedQueue ────────────────────────────────────────────────
	{
		name: "LinkedQueue",
		operation: "offer+poll",
		fn: (size) => () => {
			const queue = new LinkedQueue();
			for (let i = 0; i < size; i++) {
				queue.offer(i);
			}
			for (let i = 0; i < size; i++) {
				queue.poll();
			}
		},
	},

	// ── LinkedStack ────────────────────────────────────────────────
	{
		name: "LinkedStack",
		operation: "push+pop",
		fn: (size) => () => {
			const stack = new LinkedStack();
			for (let i = 0; i < size; i++) {
				stack.push(i);
			}
			for (let i = 0; i < size; i++) {
				stack.pop();
			}
		},
	},
];

export const COLLECTION_NAMES = [
	"ArrayList",
	"LinkedList",
	"HashMap",
	"HashSet",
	"LinkedQueue",
	"LinkedStack",
];

export const OPERATION_NAMES = [
	"add",
	"get",
	"addAt",
	"contains",
	"removeAt",
	"put",
	"remove",
	"offer+poll",
	"push+pop",
];
