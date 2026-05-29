import { ArrayList } from "ts-collections";
import { z } from "zod";

const list = new ArrayList<number>();

const schema = z.number().positive();

function validate(n: number) {
	return schema.parse(n);
}

describe("Zod validation", () => {
	test("should accept positive numbers", () => {
		expect(() => list.add(validate(10))).not.toThrow();
		expect(list.size()).toBe(1);
	});

	test("should throw error for negative numbers", () => {
		expect(() => validate(-5)).toThrow();
	});

	test("should contain proper zod error message", () => {
		try {
			validate(-5);
		} catch (error: unknown) {
			if (!(error instanceof Error)) {
				throw error;
			}
			expect(error.message).toContain("positive");
		}
	});
});
