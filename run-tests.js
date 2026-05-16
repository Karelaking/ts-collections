#!/usr/bin/env node
import { execSync } from "child_process";

try {
  console.log("Running tests...");
  execSync("npm test", { stdio: "inherit", cwd: process.cwd() });
  process.exit(0);
} catch (error) {
  console.error("Tests failed:", error.message);
  process.exit(1);
}
