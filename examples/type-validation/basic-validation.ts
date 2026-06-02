import { ArrayList } from "ts-collections";

function validateNumber(value: unknown): number {
	if (typeof value !== "number") {
		throw new Error("Value must be a number");
	}
	return value;
}

describe("Basic Number Validation", () => {
	test("should allow valid numbers", () => {
		const list = new ArrayList<number>();

		expect(() => list.add(validateNumber(10))).not.toThrow();
		expect(() => list.add(validateNumber(20))).not.toThrow();

		expect(list.size()).toBe(2);
	});

	test("should throw error for invalid type", () => {
		expect(() => validateNumber("10")).toThrow("Value must be a number");
		expect(() => validateNumber(null)).toThrow("Value must be a number");
		expect(() => validateNumber(undefined)).toThrow("Value must be a number");
	});
});
