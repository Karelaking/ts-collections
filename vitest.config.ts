import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["test/**/*.test.ts"],
		exclude: [
			"node_modules",
			"dist",
			".idea",
			".git",
			".cache",
			"test/interfaces/**/*.test.ts",
		],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			include: ["src/**/*.ts"],
			exclude: [
				// Exclude subdirectory barrel files (pure re-exports, no logic to test)
				"src/abstracts/index.ts",
				"src/errors/index.ts",
				"src/interfaces/index.ts",
				"src/types/index.ts",
				"src/utils/index.ts",
				// Standard exclusions
				"**/*.d.ts",
				"**/node_modules/**",
			],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(process.cwd(), "src"),
		},
	},
});
