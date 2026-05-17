import { Bench } from "tinybench";
import { scenarios, COLLECTION_NAMES, OPERATION_NAMES } from "./scenarios.mjs";
import { formatTable, formatJSON, formatCSV } from "./formatters.mjs";

// ── Argument parsing ───────────────────────────────────────────────────────

const args = process.argv.slice(2);

/**
 * Returns the value of a single-value flag, e.g. --format json → "json"
 * Fails fast if the flag is present but has no value or the next token is another flag.
 */
function getFlag(flag) {
  const idx = args.indexOf(flag);
  if (idx === -1) return null;
  const next = args[idx + 1];
  if (next === undefined || next.startsWith("--")) {
    console.error(`Error: ${flag} requires a value.`);
    process.exit(1);
  }
  return next;
}

/**
 * Returns all values after a flag until the next flag or end of args.
 * e.g. --compare ArrayList LinkedList → ["ArrayList", "LinkedList"]
 * Fails fast if no values follow the flag.
 */
function getFlagValues(flag) {
  const idx = args.indexOf(flag);
  if (idx === -1) return [];
  const values = [];
  for (let i = idx + 1; i < args.length; i++) {
    if (args[i].startsWith("--")) break;
    values.push(args[i]);
  }
  if (values.length === 0) {
    console.error(`Error: ${flag} requires at least one value.`);
    process.exit(1);
  }
  return values;
}

function showHelp() {
  console.log(`
ts-collections CLI Benchmark Tool

Usage:
  pnpm bench                                        Run all benchmarks
  pnpm bench -- --compare <col1> [col2...]          Compare specific collections
  pnpm bench -- --operation <op>                    Filter by operation
  pnpm bench -- --size <n>                          Set collection size (default: 1000)
  pnpm bench -- --format <table|json|csv>           Output format (default: table)

Options:
  --compare     Collections to include: ${COLLECTION_NAMES.join(", ")}
  --operation   Operations to include:  ${OPERATION_NAMES.join(", ")}
  --size        Number of elements per benchmark (default: 1000)
  --format      Output format: table, json, csv (default: table)
  --help        Show this help message

Examples:
  pnpm bench -- --compare ArrayList LinkedList
  pnpm bench -- --operation add --size 10000
  pnpm bench -- --compare HashMap HashSet --format json
  pnpm bench -- --format csv > results.csv
`);
}

// ── Parse flags ────────────────────────────────────────────────────────────

if (args.includes("--help")) {
  showHelp();
  process.exit(0);
}

// Fail fast on unknown flags to catch typos before running benchmarks
const KNOWN_FLAGS = new Set(["--help", "--compare", "--operation", "--size", "--format"]);
const unknownFlags = args.filter((a) => a.startsWith("--") && !KNOWN_FLAGS.has(a));
if (unknownFlags.length > 0) {
  console.error(`Error: Unknown flag(s): ${unknownFlags.join(", ")}`);
  showHelp();
  process.exit(1);
}

const compareFilter = getFlagValues("--compare");
const operationFilter = getFlag("--operation");
const rawSize = getFlag("--size");
const size = rawSize != null ? Number(rawSize) : 1000;
const format = getFlag("--format") ?? "table";

if (!Number.isInteger(size) || size <= 0) {
  console.error("Error: --size must be a positive integer.");
  process.exit(1);
}

if (!["table", "json", "csv"].includes(format)) {
  console.error(`Error: --format must be one of: table, json, csv`);
  process.exit(1);
}

if (compareFilter.length > 0) {
  const invalid = compareFilter.filter((c) => !COLLECTION_NAMES.includes(c));
  if (invalid.length > 0) {
    console.error(`Error: Unknown collection(s): ${invalid.join(", ")}`);
    console.error(`Valid collections: ${COLLECTION_NAMES.join(", ")}`);
    process.exit(1);
  }
}

if (operationFilter && !OPERATION_NAMES.includes(operationFilter)) {
  console.error(`Error: Unknown operation: ${operationFilter}`);
  console.error(`Valid operations: ${OPERATION_NAMES.join(", ")}`);
  process.exit(1);
}

// ── Filter scenarios ───────────────────────────────────────────────────────

let filtered = scenarios;

if (compareFilter.length > 0) {
  filtered = filtered.filter((s) => compareFilter.includes(s.name));
}

if (operationFilter) {
  filtered = filtered.filter((s) => s.operation === operationFilter);
}

if (filtered.length === 0) {
  console.error("No matching benchmarks found for the given filters.");
  showHelp();
  process.exit(1);
}

// ── Run benchmarks ─────────────────────────────────────────────────────────

// Use stderr so progress messages don't pollute --format json/csv output
console.error(`\nRunning ${filtered.length} benchmark(s) with size=${size}...\n`);

const bench = new Bench({ time: 200 });

for (const scenario of filtered) {
  bench.add(`${scenario.name} ${scenario.operation}`, scenario.fn(size));
}

await bench.run();

// ── Build results ──────────────────────────────────────────────────────────

const fmt = (n) => Math.round(n).toLocaleString("en-US");

const results = bench.tasks.map((task) => {
  const lat = task.result?.latency;
  const tput = task.result?.throughput;
  return {
    name: task.name,
    "ops/sec (avg)": tput?.mean != null ? fmt(tput.mean) : "N/A",
    "ops/sec (median)": tput?.p50 != null ? fmt(tput.p50) : "N/A",
    "latency avg (ms)": lat?.mean != null ? lat.mean.toFixed(4) : "N/A",
    "latency p99 (ms)": lat?.p99 != null ? lat.p99.toFixed(4) : "N/A",
  };
});

// ── Output ─────────────────────────────────────────────────────────────────

if (format === "json") formatJSON(results);
else if (format === "csv") formatCSV(results);
else formatTable(results);
