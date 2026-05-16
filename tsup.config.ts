import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  target: "ES2022",
  dts: true,
  dtsResolve: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: true,
  outDir: "dist",
});
