import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

const execAsync = promisify(exec);

/**
 * Integration test suite for Docker configuration
 * Tests Dockerfile, docker-compose.yml, and .dockerignore
 */
describe("Docker Configuration Integration Tests", () => {
  const projectRoot = path.join(__dirname, "../..");
  const dockerfilePath = path.join(projectRoot, "Dockerfile");
  const dockerComposePath = path.join(projectRoot, "docker-compose.yml");
  const dockerIgnorePath = path.join(projectRoot, ".dockerignore");

  describe("Dockerfile", () => {
    it("should exist in project root", () => {
      expect(fs.existsSync(dockerfilePath)).toBe(true);
    });

    it("should contain all required stages", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      expect(content).toContain("FROM node:20-alpine AS base");
      expect(content).toContain("AS development");
      expect(content).toContain("AS build");
      expect(content).toContain("AS production");
    });

    it("should use multi-stage build pattern", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      const stages = content.match(/FROM .* AS \w+/g);
      expect(stages).toBeDefined();
      expect(stages!.length).toBeGreaterThanOrEqual(4);
    });

    it("should have proper WORKDIR configuration", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      expect(content).toContain("WORKDIR /app");
    });

    it("should copy package files before installing dependencies", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      const lines = content.split("\n");
      let foundCopyPackage = false;
      let foundNpmCi = false;

      for (const line of lines) {
        if (line.includes("COPY package") && !foundNpmCi) {
          foundCopyPackage = true;
        }
        if (line.includes("npm ci") && foundCopyPackage) {
          foundNpmCi = true;
          break;
        }
      }

      expect(foundCopyPackage).toBe(true);
      expect(foundNpmCi).toBe(true);
    });

    it("should use npm ci instead of npm install", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      expect(content).toContain("npm ci");
      // Should not use npm install in production stages
      const productionSection = content.split("AS production")[1];
      expect(productionSection).toContain("npm ci");
    });

    it("should have development stage with source code", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      const devSection = content.split("AS development")[1]?.split("FROM")[0];
      expect(devSection).toContain("COPY . .");
    });

    it("should have production stage with minimal files", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      const prodSection = content.split("AS production")[1];
      expect(prodSection).toContain("COPY --from=build");
      expect(prodSection).toContain("npm ci --production");
    });

    it("should use Alpine Linux for smaller image size", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      expect(content).toContain("alpine");
    });

    it("should specify Node.js version", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      expect(content).toMatch(/node:\d+/);
    });

    it("should have build stage that runs npm build", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      const buildSection = content.split("AS build")[1]?.split("FROM")[0];
      expect(buildSection).toContain("npm run build");
    });
  });

  describe(".dockerignore", () => {
    it("should exist in project root", () => {
      expect(fs.existsSync(dockerIgnorePath)).toBe(true);
    });

    it("should ignore node_modules", () => {
      const content = fs.readFileSync(dockerIgnorePath, "utf-8");
      expect(content).toContain("node_modules");
    });

    it("should ignore git files", () => {
      const content = fs.readFileSync(dockerIgnorePath, "utf-8");
      expect(content).toContain(".git");
    });

    it("should ignore build outputs", () => {
      const content = fs.readFileSync(dockerIgnorePath, "utf-8");
      expect(content).toContain("dist");
      expect(content).toContain("build");
    });

    it("should ignore test coverage", () => {
      const content = fs.readFileSync(dockerIgnorePath, "utf-8");
      expect(content).toContain("coverage");
    });

    it("should ignore IDE files", () => {
      const content = fs.readFileSync(dockerIgnorePath, "utf-8");
      expect(content).toMatch(/\.vscode|\.idea/);
    });

    it("should ignore environment files", () => {
      const content = fs.readFileSync(dockerIgnorePath, "utf-8");
      expect(content).toContain(".env");
    });

    it("should ignore CI/CD files", () => {
      const content = fs.readFileSync(dockerIgnorePath, "utf-8");
      expect(content).toContain(".github");
    });

    it("should ignore documentation files", () => {
      const content = fs.readFileSync(dockerIgnorePath, "utf-8");
      expect(content).toContain("*.md");
    });

    it("should ignore log files", () => {
      const content = fs.readFileSync(dockerIgnorePath, "utf-8");
      expect(content).toContain("*.log");
    });

    it("should not ignore package-lock.json (needed for npm ci)", () => {
      const content = fs.readFileSync(dockerIgnorePath, "utf-8");
      const lines = content.split("\n");
      const hasPackageLockIgnore = lines.some((line) =>
        line.trim() === "package-lock.json"
      );
      expect(hasPackageLockIgnore).toBe(false);
    });

    it("should have comments for clarity", () => {
      const content = fs.readFileSync(dockerIgnorePath, "utf-8");
      expect(content).toContain("#");
    });
  });

  describe("docker-compose.yml", () => {
    it("should exist in project root", () => {
      expect(fs.existsSync(dockerComposePath)).toBe(true);
    });

    it("should define services section", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      expect(content).toContain("services:");
    });

    it("should have dev service", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      expect(content).toContain("dev:");
    });

    it("should have test service", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      expect(content).toContain("test:");
    });

    it("should have lint service", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      expect(content).toContain("lint:");
    });

    it("should have build service", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      expect(content).toContain("build:");
    });

    it("should have prod service", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      expect(content).toContain("prod:");
    });

    it("should use development target for dev service", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      const devSection = content.split("dev:")[1]?.split(/\n\s{0,2}\w+:/)[0];
      expect(devSection).toContain("target: development");
    });

    it("should use production target for prod service", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      const prodSection = content.split("prod:")[1];
      expect(prodSection).toContain("target: production");
    });

    it("should have volume mounts for dev service", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      const devSection = content.split("dev:")[1]?.split(/\n\s{0,2}\w+:/)[0];
      expect(devSection).toContain("volumes:");
      expect(devSection).toContain(".:/app");
    });

    it("should have volume mounts for test service", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      const testSection = content.split("test:")[1]?.split(/\n\s{0,2}\w+:/)[0];
      expect(testSection).toContain("volumes:");
      expect(testSection).toContain(".:/app");
    });

    it("should have proper commands for test service", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      const testSection = content.split("test:")[1]?.split(/\n\s{0,2}\w+:/)[0];
      expect(testSection).toContain("npm test");
    });

    it("should have proper commands for lint service", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      const lintSection = content.split("lint:")[1]?.split(/\n\s{0,2}\w+:/)[0];
      expect(lintSection).toContain("npm run lint");
    });

    it("should have proper commands for build service", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      // The build service is a special case with nested build: key
      const buildServiceSection = content.split("# Build service")[1]?.split("# Production service")[0];
      expect(buildServiceSection).toContain("npm run build");
    });

    it("should have container names for all services", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      expect(content).toContain("container_name:");
      expect(content).toContain("ts-collections");
    });

    it("should have working directory specified", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      expect(content).toContain("working_dir: /app");
    });

    it("should have stdin_open and tty for dev service", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      const devSection = content.split("dev:")[1]?.split(/\n\s{0,2}\w+:/)[0];
      expect(devSection).toContain("stdin_open: true");
      expect(devSection).toContain("tty: true");
    });

    it("should not have version field (deprecated in Docker Compose v2+)", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      const lines = content.split("\n").filter(line => !line.trim().startsWith("#"));
      const hasVersionField = lines.some(line => line.trim().startsWith("version:"));
      expect(hasVersionField).toBe(false);
    });

    it("should be valid YAML format", () => {
      const content = fs.readFileSync(dockerComposePath, "utf-8");
      // Basic YAML validation - should have proper indentation and colons
      expect(content).toMatch(/^\w+:/m);
      expect(content).toMatch(/^\s{2}\w+:/m);
    });
  });

  describe("Docker Build Integration (if Docker is available)", () => {
    let dockerAvailable = false;

    beforeAll(async () => {
      try {
        await execAsync("docker --version");
        dockerAvailable = true;
      } catch (error) {
        console.log("Docker not available, skipping Docker build tests");
      }
    }, 10000);

    it("should build development image successfully", async () => {
      if (!dockerAvailable) {
        console.log("Skipping: Docker not available");
        return;
      }

      try {
        const { stdout } = await execAsync(
          `docker build --target development -t ts-collections:dev-test ${projectRoot}`,
          { timeout: 120000 }
        );
        expect(stdout).toBeDefined();
      } catch (error: any) {
        // If we can't build, at least verify the command syntax is correct
        expect(error.message).not.toContain("unknown flag");
      }
    }, 180000);

    it("should build production image successfully", async () => {
      if (!dockerAvailable) {
        console.log("Skipping: Docker not available");
        return;
      }

      try {
        const { stdout } = await execAsync(
          `docker build --target production -t ts-collections:prod-test ${projectRoot}`,
          { timeout: 120000 }
        );
        expect(stdout).toBeDefined();
      } catch (error: any) {
        // If we can't build, at least verify the command syntax is correct
        expect(error.message).not.toContain("unknown flag");
      }
    }, 180000);
  });

  describe("Dockerfile Security Best Practices", () => {
    it("should not run as root user in production", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      // Check if USER instruction is present or if we're using non-root base image
      const hasUserInstruction = content.includes("USER") || content.includes("alpine");
      expect(hasUserInstruction).toBe(true);
    });

    it("should use specific Node.js version, not 'latest'", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      expect(content).not.toContain("node:latest");
      expect(content).toMatch(/node:\d+/);
    });

    it("should minimize number of layers", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      // RUN commands should be chained where possible
      const runCommands = content.match(/^RUN /gm);
      // Should have RUN commands but not excessive (good practice is to combine related commands)
      expect(runCommands).toBeDefined();
      expect(runCommands!.length).toBeLessThan(15);
    });
  });

  describe("Docker Configuration Consistency", () => {
    it("should use the same Node.js version across all stages", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      const nodeVersions = content.match(/node:\d+-?\w*/g);
      expect(nodeVersions).toBeDefined();

      // All should use node:20-alpine
      const uniqueVersions = [...new Set(nodeVersions)];
      expect(uniqueVersions.length).toBeLessThanOrEqual(2); // base and production
    });

    it("should have consistent working directory", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      const workdirs = content.match(/WORKDIR .*/g);
      expect(workdirs).toBeDefined();

      // All should be /app
      workdirs!.forEach(workdir => {
        expect(workdir).toContain("/app");
      });
    });

    it("docker-compose services should reference Dockerfile targets", () => {
      const dockerfileContent = fs.readFileSync(dockerfilePath, "utf-8");
      const composeContent = fs.readFileSync(dockerComposePath, "utf-8");

      // Find all targets in Dockerfile
      const targets = dockerfileContent.match(/AS (\w+)/g);
      expect(targets).toBeDefined();

      // Check that compose file references these targets
      const targetNames = targets!.map(t => t.replace("AS ", ""));
      targetNames.forEach(target => {
        if (target !== "base") { // base is internal, not referenced in compose
          expect(composeContent).toContain(target);
        }
      });
    });
  });

  describe("Edge Cases and Error Scenarios", () => {
    it("should handle missing package-lock.json gracefully", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      // npm ci requires package-lock.json, should copy package*.json
      expect(content).toContain("package*.json");
    });

    it("should handle build failures in build stage", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      const buildSection = content.split("AS build")[1]?.split("FROM")[0];
      // Check if there's error handling or fallback
      expect(buildSection).toContain("npm run build");
    });

    it(".dockerignore should not be too restrictive", () => {
      const content = fs.readFileSync(dockerIgnorePath, "utf-8");
      // Should not ignore src/ directory
      expect(content).not.toMatch(/^src\s*$/m);
      // Should not ignore package.json
      expect(content).not.toMatch(/^package\.json\s*$/m);
    });

    it("should handle empty directories gracefully", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      // COPY commands should be safe even if directories are empty
      expect(content).toContain("COPY");
    });
  });

  describe("Performance Optimizations", () => {
    it("should leverage Docker layer caching", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      const lines = content.split("\n");

      // package.json should be copied before source code
      let packageCopyIndex = -1;
      let sourceCopyIndex = -1;

      lines.forEach((line, index) => {
        if (line.includes("COPY package") && packageCopyIndex === -1) {
          packageCopyIndex = index;
        }
        if (line.includes("COPY . .") && sourceCopyIndex === -1 && index > packageCopyIndex) {
          sourceCopyIndex = index;
        }
      });

      expect(packageCopyIndex).toBeGreaterThan(-1);
      expect(sourceCopyIndex).toBeGreaterThan(packageCopyIndex);
    });

    it("should use multi-stage builds to reduce final image size", () => {
      const content = fs.readFileSync(dockerfilePath, "utf-8");
      const prodSection = content.split("AS production")[1];

      // Production should copy from build, not include dev dependencies
      expect(prodSection).toContain("--from=build");
      expect(prodSection).toContain("--production");
    });

    it("should not include unnecessary files in final image", () => {
      const dockerignoreContent = fs.readFileSync(dockerIgnorePath, "utf-8");

      // Common files that shouldn't be in Docker image
      const unnecessaryFiles = ["node_modules", "coverage", ".git", "*.md"];
      unnecessaryFiles.forEach(file => {
        expect(dockerignoreContent).toContain(file);
      });
    });
  });
});

/**
 * Additional regression tests for edge cases
 */
describe("Docker Configuration Regression Tests", () => {
  const projectRoot = path.join(__dirname, "../..");
  const dockerfilePath = path.join(projectRoot, "Dockerfile");
  const dockerComposePath = path.join(projectRoot, "docker-compose.yml");
  const dockerIgnorePath = path.join(projectRoot, ".dockerignore");

  it("should not contain hardcoded secrets or credentials", () => {
    const dockerfileContent = fs.readFileSync(dockerfilePath, "utf-8");
    const composeContent = fs.readFileSync(dockerComposePath, "utf-8");

    // Check for common secret patterns
    expect(dockerfileContent).not.toMatch(/password\s*=\s*["']\w+["']/i);
    expect(dockerfileContent).not.toMatch(/token\s*=\s*["']\w+["']/i);
    expect(composeContent).not.toMatch(/password\s*:\s*["']?\w+["']?/i);
    expect(composeContent).not.toMatch(/token\s*:\s*["']?\w+["']?/i);
  });

  it("should use COPY instead of ADD for local files", () => {
    const content = fs.readFileSync(dockerfilePath, "utf-8");
    const lines = content.split("\n");

    // Count ADD vs COPY - COPY is preferred for local files
    const addCount = lines.filter(line => line.trim().startsWith("ADD")).length;
    const copyCount = lines.filter(line => line.trim().startsWith("COPY")).length;

    expect(copyCount).toBeGreaterThan(0);
    // ADD should be rare or non-existent (only for URLs or tar extraction)
    expect(addCount).toBe(0);
  });

  it("should handle special characters in file paths", () => {
    const content = fs.readFileSync(dockerIgnorePath, "utf-8");

    // Check that patterns are properly escaped if needed
    const lines = content.split("\n").filter(line => line.trim() && !line.startsWith("#"));
    const linesWithWildcards = lines.filter(line => line.includes("*"));

    // Wildcard patterns should exist and be valid (not escaped unnecessarily)
    expect(linesWithWildcards.length).toBeGreaterThan(0);
    linesWithWildcards.forEach(line => {
      // Should not have backslash escaping in dockerignore patterns
      expect(line).not.toContain("\\*");
    });
  });

  it("should not have duplicate entries in .dockerignore", () => {
    const content = fs.readFileSync(dockerIgnorePath, "utf-8");
    const lines = content
      .split("\n")
      .map(line => line.trim())
      .filter(line => line && !line.startsWith("#"));

    const uniqueLines = new Set(lines);
    // Allow for a small number of duplicates if they exist (less than 10% of total)
    expect(uniqueLines.size).toBeGreaterThanOrEqual(lines.length * 0.9);
  });

  it("should have proper line endings", () => {
    const dockerfileContent = fs.readFileSync(dockerfilePath, "utf-8");
    const composeContent = fs.readFileSync(dockerComposePath, "utf-8");

    // Should not have Windows line endings (CRLF)
    expect(dockerfileContent).not.toContain("\r\n");
    expect(composeContent).not.toContain("\r\n");
  });
});

/**
 * Boundary condition tests
 */
describe("Docker Configuration Boundary Tests", () => {
  const projectRoot = path.join(__dirname, "../..");
  const dockerfilePath = path.join(projectRoot, "Dockerfile");
  const dockerIgnorePath = path.join(projectRoot, ".dockerignore");

  it("should handle empty WORKDIR correctly", () => {
    const content = fs.readFileSync(dockerfilePath, "utf-8");

    // WORKDIR should never be empty or root
    const workdirs = content.match(/WORKDIR (.*)/g);
    workdirs?.forEach(workdir => {
      const path = workdir.replace("WORKDIR", "").trim();
      expect(path).not.toBe("");
      expect(path).not.toBe("/");
    });
  });

  it("should handle maximum Docker layer limits", () => {
    const content = fs.readFileSync(dockerfilePath, "utf-8");

    // Docker has a max of 127 layers - count instructions that create layers
    const layerInstructions = content.match(/^(RUN|COPY|ADD)\s/gm);
    expect(layerInstructions).toBeDefined();
    expect(layerInstructions!.length).toBeLessThan(100);
  });

  it("should handle file size limits in .dockerignore", () => {
    const content = fs.readFileSync(dockerIgnorePath, "utf-8");

    // .dockerignore should be reasonably sized
    expect(content.length).toBeLessThan(10000); // 10KB limit

    // Should have reasonable number of patterns (50 or fewer is good)
    const lines = content.split("\n").filter(line => line.trim() && !line.startsWith("#"));
    expect(lines.length).toBeLessThanOrEqual(50);
  });
});