/**
 * Formats benchmark results as a console table.
 * @param {Array<Object>} results
 */
export function formatTable(results) {
	console.table(results);
}

/**
 * Formats benchmark results as pretty-printed JSON.
 * @param {Array<Object>} results
 */
export function formatJSON(results) {
	console.log(JSON.stringify(results, null, 2));
}

/**
 * Escapes a single CSV field value.
 * Wraps in quotes if the value contains commas, quotes, or newlines.
 * @param {unknown} value
 * @returns {string}
 */
function escapeCSV(value) {
	const str = String(value);
	if (str.includes('"') || str.includes(",") || str.includes("\n")) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

/**
 * Formats benchmark results as CSV.
 * @param {Array<Object>} results
 */
export function formatCSV(results) {
	if (results.length === 0) {
		return;
	}
	const headers = Object.keys(results[0]).map(escapeCSV).join(",");
	const rows = results.map((r) => Object.values(r).map(escapeCSV).join(","));
	console.log([headers, ...rows].join("\n"));
}
