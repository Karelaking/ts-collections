import { describe, it, expect, beforeEach } from "vitest";
import { LinkedQueue } from "../../src/queue/LinkedQueue";
import { describeQueue } from "../interfaces/Queue.test";

/**
 * Test suite for LinkedQueue implementation
 */
describeQueue(() => new LinkedQueue<number>());

describe("LinkedQueue - Core Methods", () => {
  let queue: LinkedQueue<number>;

  beforeEach(() => {
    queue = new LinkedQueue<number>();
  });

  describe("constructor and size", () => {
    it("should construct an empty queue", () => {
      expect(queue.size()).toBe(0);
      expect(queue.isEmpty()).toBe(true);
    });

    it("should track size after offering elements", () => {
      queue.offer(1);
      expect(queue.size()).toBe(1);
      queue.offer(2);
      queue.offer(3);
      expect(queue.size()).toBe(3);
    });

    it("should reduce size after polling", () => {
      queue.offer(1);
      queue.offer(2);
      queue.offer(3);
      queue.poll();
      expect(queue.size()).toBe(2);
    });
  });

  describe("offer method", () => {
    it("should add element and return true", () => {
      const result = queue.offer(1);
      expect(result).toBe(true);
      expect(queue.size()).toBe(1);
    });

    it("should add multiple elements", () => {
      expect(queue.offer(1)).toBe(true);
      expect(queue.offer(2)).toBe(true);
      expect(queue.offer(3)).toBe(true);
      expect(queue.size()).toBe(3);
    });

    it("should allow duplicate elements", () => {
      queue.offer(1);
      queue.offer(1);
      queue.offer(1);
      expect(queue.size()).toBe(3);
    });
  });

  describe("poll method", () => {
    beforeEach(() => {
      queue.offer(1);
      queue.offer(2);
      queue.offer(3);
    });

    it("should remove and return head element", () => {
      const result = queue.poll();
      expect(result).toBe(1);
      expect(queue.size()).toBe(2);
    });

    it("should return undefined when queue is empty", () => {
      queue.poll();
      queue.poll();
      queue.poll();
      expect(queue.poll()).toBeUndefined();
    });

    it("should maintain FIFO order", () => {
      expect(queue.poll()).toBe(1);
      expect(queue.poll()).toBe(2);
      expect(queue.poll()).toBe(3);
    });

    it("should not throw error on empty queue", () => {
      queue.poll();
      queue.poll();
      queue.poll();
      expect(() => queue.poll()).not.toThrow();
    });
  });

  describe("dequeue method (alias for poll)", () => {
    beforeEach(() => {
      queue.offer(1);
      queue.offer(2);
      queue.offer(3);
    });

    it("should support dequeue operation", () => {
      const result = queue.dequeue();
      expect(result).toBe(1);
      expect(queue.size()).toBe(2);
    });

    it("should return undefined when queue is empty", () => {
      queue.dequeue();
      queue.dequeue();
      queue.dequeue();
      expect(queue.dequeue()).toBeUndefined();
    });
  });

  describe("peek method", () => {
    it("should return head element without removing", () => {
      queue.offer(1);
      queue.offer(2);
      queue.offer(3);
      const result = queue.peek();
      expect(result).toBe(1);
      expect(queue.size()).toBe(3);
    });

    it("should consistently return same element", () => {
      queue.offer(1);
      queue.offer(2);
      queue.offer(3);
      const first = queue.peek();
      const second = queue.peek();
      expect(first).toBe(second);
      expect(queue.size()).toBe(3);
    });

    it("should return undefined when queue is empty", () => {
      const emptyQueue = new LinkedQueue<number>();
      expect(emptyQueue.peek()).toBeUndefined();
    });

    it("should not throw error on empty queue", () => {
      const emptyQueue = new LinkedQueue<number>();
      expect(() => emptyQueue.peek()).not.toThrow();
    });
  });

  describe("element method", () => {
    beforeEach(() => {
      queue.offer(1);
      queue.offer(2);
      queue.offer(3);
    });

    it("should return head element without removing", () => {
      const result = queue.element();
      expect(result).toBe(1);
      expect(queue.size()).toBe(3);
    });

    it("should consistently return same element", () => {
      const first = queue.element();
      const second = queue.element();
      expect(first).toBe(second);
    });

    it("should throw error when queue is empty", () => {
      const emptyQueue = new LinkedQueue<number>();
      expect(() => emptyQueue.element()).toThrow();
    });
  });

  describe("FIFO behavior", () => {
    it("should maintain FIFO order through offer/poll cycle", () => {
      const elements = [5, 10, 15, 20];
      elements.forEach((e) => queue.offer(e));

      const result: number[] = [];
      while (!queue.isEmpty()) {
        const polled = queue.poll();
        if (polled !== undefined) {
          result.push(polled);
        }
      }

      expect(result).toEqual(elements);
    });

    it("should maintain FIFO order with mixed operations", () => {
      queue.offer(1);
      queue.offer(2);
      expect(queue.poll()).toBe(1);
      queue.offer(3);
      expect(queue.poll()).toBe(2);
      expect(queue.poll()).toBe(3);
    });

    it("should maintain order with peek and poll", () => {
      queue.offer(1);
      queue.offer(2);
      queue.offer(3);

      expect(queue.peek()).toBe(1);
      expect(queue.poll()).toBe(1);
      expect(queue.peek()).toBe(2);
      expect(queue.poll()).toBe(2);
      expect(queue.peek()).toBe(3);
      expect(queue.poll()).toBe(3);
    });
  });

  describe("contains method", () => {
    beforeEach(() => {
      queue.offer(1);
      queue.offer(2);
      queue.offer(3);
    });

    it("should find existing elements", () => {
      expect(queue.contains(1)).toBe(true);
      expect(queue.contains(2)).toBe(true);
      expect(queue.contains(3)).toBe(true);
    });

    it("should return false for non-existent elements", () => {
      expect(queue.contains(999)).toBe(false);
      expect(queue.contains(0)).toBe(false);
    });

    it("should work on empty queue", () => {
      const emptyQueue = new LinkedQueue<number>();
      expect(emptyQueue.contains(1)).toBe(false);
    });

    it("should find after partial removal", () => {
      queue.poll();
      expect(queue.contains(2)).toBe(true);
      expect(queue.contains(1)).toBe(false);
    });
  });

  describe("iterator method", () => {
    beforeEach(() => {
      queue.offer(1);
      queue.offer(2);
      queue.offer(3);
    });

    it("should iterate through all elements in FIFO order", () => {
      const elements: number[] = [];
      const iterator = queue.iterator();

      while (iterator.hasNext()) {
        elements.push(iterator.next());
      }

      expect(elements).toEqual([1, 2, 3]);
    });

    it("should return false when no more elements", () => {
      const iterator = queue.iterator();
      iterator.next();
      iterator.next();
      iterator.next();
      expect(iterator.hasNext()).toBe(false);
    });

    it("should throw error when calling next on exhausted iterator", () => {
      const iterator = queue.iterator();
      iterator.next();
      iterator.next();
      iterator.next();
      expect(() => iterator.next()).toThrow();
    });

    it("should work on empty queue", () => {
      const emptyQueue = new LinkedQueue<number>();
      const iterator = emptyQueue.iterator();
      expect(iterator.hasNext()).toBe(false);
    });
  });

  describe("toArray method", () => {
    it("should return all elements in FIFO order", () => {
      queue.offer(1);
      queue.offer(2);
      queue.offer(3);

      expect(queue.toArray()).toEqual([1, 2, 3]);
    });

    it("should return empty array for empty queue", () => {
      expect(queue.toArray()).toEqual([]);
    });

    it("should return independent array", () => {
      queue.offer(1);
      queue.offer(2);
      const arr = queue.toArray();
      arr.push(3);
      expect(queue.size()).toBe(2);
    });
  });

  describe("clear method", () => {
    beforeEach(() => {
      queue.offer(1);
      queue.offer(2);
      queue.offer(3);
    });

    it("should remove all elements", () => {
      queue.clear();
      expect(queue.size()).toBe(0);
      expect(queue.isEmpty()).toBe(true);
    });

    it("should allow adding elements after clear", () => {
      queue.clear();
      queue.offer(10);
      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe(10);
    });

    it("should work on empty queue", () => {
      const emptyQueue = new LinkedQueue<number>();
      emptyQueue.clear();
      expect(emptyQueue.size()).toBe(0);
    });
  });

  describe("isEmpty method", () => {
    it("should return true for empty queue", () => {
      expect(queue.isEmpty()).toBe(true);
    });

    it("should return false when queue has elements", () => {
      queue.offer(1);
      expect(queue.isEmpty()).toBe(false);
    });

    it("should return true after clearing", () => {
      queue.offer(1);
      queue.clear();
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe("single element queue", () => {
    it("should handle single element", () => {
      queue.offer(42);
      expect(queue.peek()).toBe(42);
      expect(queue.element()).toBe(42);
      expect(queue.size()).toBe(1);
      expect(queue.poll()).toBe(42);
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe("add method (Collection interface)", () => {
    it("should support add via Collection interface", () => {
      const result = queue.add(1);
      expect(result).toBe(true);
      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe(1);
    });

    it("should add multiple elements", () => {
      queue.add(1);
      queue.add(2);
      queue.add(3);
      expect(queue.size()).toBe(3);
    });
  });

  describe("remove method (Collection interface)", () => {
    beforeEach(() => {
      queue.offer(1);
      queue.offer(2);
      queue.offer(3);
    });

    it("should remove first occurrence via Collection interface", () => {
      const result = queue.remove(2);
      expect(result).toBe(true);
      expect(queue.contains(2)).toBe(false);
      expect(queue.size()).toBe(2);
    });

    it("should return false when removing non-existent element", () => {
      const result = queue.remove(999);
      expect(result).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle large number of elements", () => {
      for (let i = 0; i < 100; i++) {
        queue.offer(i);
      }
      expect(queue.size()).toBe(100);
      expect(queue.peek()).toBe(0);
      expect(queue.poll()).toBe(0);
      expect(queue.size()).toBe(99);
    });

    it("should handle alternating offer and poll", () => {
      queue.offer(1);
      queue.offer(2);
      queue.poll();
      queue.offer(3);
      queue.poll();
      queue.offer(4);

      expect(queue.toArray()).toEqual([3, 4]);
    });

    it("should handle removing and re-adding elements", () => {
      queue.offer(1);
      queue.poll();
      queue.offer(1);

      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe(1);
    });

    it("should maintain integrity after multiple operations", () => {
      const ops = [1, 2, 3, 4, 5];
      ops.forEach((n) => queue.offer(n));

      queue.poll(); // Remove 1
      queue.offer(6);
      queue.poll(); // Remove 2

      expect(queue.toArray()).toEqual([3, 4, 5, 6]);
    });

    it("should handle duplicate elements", () => {
      queue.offer(1);
      queue.offer(1);
      queue.offer(2);
      queue.offer(1);

      const arr = queue.toArray();
      expect(arr).toEqual([1, 1, 2, 1]);
    });
  });

  describe("different data types", () => {
    it("should work with string elements", () => {
      const strQueue = new LinkedQueue<string>();
      strQueue.offer("a");
      strQueue.offer("b");
      strQueue.offer("c");

      expect(strQueue.poll()).toBe("a");
      expect(strQueue.peek()).toBe("b");
      expect(strQueue.size()).toBe(2);
    });

    it("should work with object elements", () => {
      const objQueue = new LinkedQueue<{ id: number; name: string }>();
      const obj1 = { id: 1, name: "Alice" };
      const obj2 = { id: 2, name: "Bob" };

      objQueue.offer(obj1);
      objQueue.offer(obj2);

      expect(objQueue.peek()).toBe(obj1);
      expect(objQueue.poll()).toBe(obj1);
      expect(objQueue.peek()).toBe(obj2);
    });
  });
});
