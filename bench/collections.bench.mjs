import { Bench } from "tinybench";
import { ArrayList, HashSet, HashMap, LinkedQueue } from "../dist/index.js";

const ITERATIONS = 1_000;

const bench = new Bench({ time: 200 });

bench.add("ArrayList add", () => {
  const list = new ArrayList();
  for (let i = 0; i < ITERATIONS; i += 1) {
    list.add(i);
  }
});

bench.add("ArrayList contains", () => {
  const list = new ArrayList();
  for (let i = 0; i < ITERATIONS; i += 1) {
    list.add(i);
  }
  list.contains(ITERATIONS - 1);
});

bench.add("ArrayList remove", () => {
  const list = new ArrayList();
  for (let i = 0; i < ITERATIONS; i += 1) {
    list.add(i);
  }
  list.removeAt(ITERATIONS - 1);
});

bench.add("HashSet add", () => {
  const set = new HashSet();
  for (let i = 0; i < ITERATIONS; i += 1) {
    set.add(i);
  }
});

bench.add("HashSet contains", () => {
  const set = new HashSet();
  for (let i = 0; i < ITERATIONS; i += 1) {
    set.add(i);
  }
  set.contains(ITERATIONS - 1);
});

bench.add("HashSet remove", () => {
  const set = new HashSet();
  for (let i = 0; i < ITERATIONS; i += 1) {
    set.add(i);
  }
  set.remove(ITERATIONS - 1);
});

bench.add("HashMap put", () => {
  const map = new HashMap();
  for (let i = 0; i < ITERATIONS; i += 1) {
    map.put(`k${i}`, i);
  }
});

bench.add("HashMap get", () => {
  const map = new HashMap();
  for (let i = 0; i < ITERATIONS; i += 1) {
    map.put(`k${i}`, i);
  }
  map.get(`k${ITERATIONS - 1}`);
});

bench.add("HashMap remove", () => {
  const map = new HashMap();
  for (let i = 0; i < ITERATIONS; i += 1) {
    map.put(`k${i}`, i);
  }
  map.remove(`k${ITERATIONS - 1}`);
});

bench.add("LinkedQueue offer+poll", () => {
  const queue = new LinkedQueue();
  for (let i = 0; i < ITERATIONS; i += 1) {
    queue.offer(i);
  }
  for (let i = 0; i < ITERATIONS; i += 1) {
    queue.poll();
  }
});

(async () => {
  await bench.run();
  console.table(bench.table());
})();
