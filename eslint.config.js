import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default [
	js.configs.recommended,
	{
		files: ["**/*.{js,mjs}"],
		languageOptions: {
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
			globals: {
				console: "readonly",
				process: "readonly",
			},
		},
	},
	{
		files: ["**/*.cjs"],
		languageOptions: {
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "commonjs",
			},
			globals: {
				console: "readonly",
				process: "readonly",
			},
		},
	},
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
			globals: {
				console: "readonly",
				process: "readonly",
			},
		},
		plugins: {
			"@typescript-eslint": typescript,
		},
		rules: {
			...typescript.configs.recommended.rules,
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_" },
			],
			"no-console": ["warn", { allow: ["warn", "error"] }],
		},
	},
	{
		files: ["test/**/*.ts"],
		rules: {
			"no-console": "off",
		},
	},
];
