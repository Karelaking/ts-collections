import { ArrayList } from "ts-collections";

class ValidatedList<T> extends ArrayList<T> {
	private readonly validator: (v: T) => boolean;

	constructor(validator: (v: T) => boolean) {
		super();
		this.validator = validator;
	}

	override add(value: T): boolean {
		if (!this.validator(value)) {
			throw new Error("Validation failed");
		}
		return super.add(value);
	}
}

describe("ValidatedList", () => {
	test("should accept valid even numbers", () => {
		const evenList = new ValidatedList<number>((num) => num % 2 === 0);

		expect(() => evenList.add(2)).not.toThrow();
		expect(() => evenList.add(4)).not.toThrow();
	});

	test("should throw validation error for invalid values", () => {
		const evenList = new ValidatedList<number>((num) => num % 2 === 0);

		expect(() => evenList.add(3)).toThrow("Validation failed");
		expect(() => evenList.add(5)).toThrow("Validation failed");
	});
});
