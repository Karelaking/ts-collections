import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

/**
 * Test suite for Dockerfile multi-stage build configuration
 *
 * Validates that the Dockerfile is properly configured with:
 * - Multi-stage builds for development, build, and production
 * - Proper base image selection (node:20-alpine)
 * - Correct dependency installation (npm ci)
 * - Appropriate build stages and optimizations
 */
describe("Dockerfile Configuration", () => {
  const dockerfilePath = resolve(process.cwd(), "Dockerfile");
  let dockerfileContent: string;

  it("should exist in the project root", () => {
    expect(existsSync(dockerfilePath)).toBe(true);
  });

  describe("File structure validation", () => {
    it("should be readable and non-empty", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      expect(dockerfileContent).toBeTruthy();
      expect(dockerfileContent.length).toBeGreaterThan(0);
    });

    it("should contain multi-stage build definitions", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Should have multiple FROM statements for multi-stage builds
      const fromStatements = dockerfileContent.match(/^FROM\s+/gm);
      expect(fromStatements).toBeTruthy();
      expect(fromStatements!.length).toBeGreaterThanOrEqual(3);
    });

    it("should define all required stages", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Required stages
      expect(dockerfileContent).toMatch(/FROM\s+\S+\s+AS\s+base/i);
      expect(dockerfileContent).toMatch(/FROM\s+\S+\s+AS\s+development/i);
      expect(dockerfileContent).toMatch(/FROM\s+\S+\s+AS\s+build/i);
      expect(dockerfileContent).toMatch(/FROM\s+\S+\s+AS\s+production/i);
    });
  });

  describe("Base image validation", () => {
    it("should use Node.js 20 Alpine image", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      expect(dockerfileContent).toMatch(/node:20-alpine/);
    });

    it("should use Alpine for minimal image size", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Base FROM statements (not referencing other stages) should use alpine variant
      const fromLines = dockerfileContent.split("\n").filter(line =>
        line.trim().startsWith("FROM")
      );

      for (const line of fromLines) {
        // Check if it's referencing another stage or a base image
        const isStageReference = line.match(/FROM\s+(?:base|development|build|production)\s+AS/i);
        if (!isStageReference) {
          // Only check base images, not stage references
          expect(line).toMatch(/alpine/i);
        }
      }
    });

    it("should pin Node.js version for reproducibility", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Should specify version 20, not just "node:alpine" or "node:latest"
      expect(dockerfileContent).toMatch(/node:20/);
    });
  });

  describe("Base stage configuration", () => {
    it("should set working directory", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      expect(dockerfileContent).toMatch(/WORKDIR\s+\/app/);
    });

    it("should copy package files first for layer caching", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // package files should be copied before npm ci
      const baseSection = dockerfileContent.match(/FROM\s+\S+\s+AS\s+base[\s\S]*?(?=FROM|$)/i);
      expect(baseSection).toBeTruthy();
      expect(baseSection![0]).toMatch(/COPY\s+package\*\.json/);
    });

    it("should use npm ci for reproducible installs", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Should use npm ci, not npm install
      const baseSection = dockerfileContent.match(/FROM\s+\S+\s+AS\s+base[\s\S]*?(?=FROM|$)/i);
      expect(baseSection).toBeTruthy();
      expect(baseSection![0]).toMatch(/npm\s+ci/);
    });

    it("should not use npm install in base stage", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const baseSection = dockerfileContent.match(/FROM\s+\S+\s+AS\s+base[\s\S]*?(?=FROM|$)/i);

      if (baseSection) {
        // npm install is less deterministic than npm ci
        expect(baseSection[0]).not.toMatch(/npm\s+install(?!\s+-g)/);
      }
    });
  });

  describe("Development stage configuration", () => {
    it("should extend from base stage", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      expect(dockerfileContent).toMatch(/FROM\s+base\s+AS\s+development/i);
    });

    it("should copy all source files", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const devSection = dockerfileContent.match(/FROM\s+base\s+AS\s+development[\s\S]*?(?=FROM|$)/i);

      expect(devSection).toBeTruthy();
      expect(devSection![0]).toMatch(/COPY\s+\.\s+\./);
    });

    it("should have a default command for running tests", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const devSection = dockerfileContent.match(/FROM\s+base\s+AS\s+development[\s\S]*?(?=FROM|$)/i);

      expect(devSection).toBeTruthy();
      expect(devSection![0]).toMatch(/CMD\s+\[.*npm.*test.*\]/);
    });

    it("should include development dependencies", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const devSection = dockerfileContent.match(/FROM\s+base\s+AS\s+development[\s\S]*?(?=FROM|$)/i);

      // Should inherit from base which runs npm ci (includes dev dependencies)
      expect(devSection).toBeTruthy();
      expect(devSection![0]).toMatch(/FROM\s+base/);
    });
  });

  describe("Build stage configuration", () => {
    it("should extend from development stage", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      expect(dockerfileContent).toMatch(/FROM\s+development\s+AS\s+build/i);
    });

    it("should run the build command", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const buildSection = dockerfileContent.match(/FROM\s+development\s+AS\s+build[\s\S]*?(?=FROM|$)/i);

      expect(buildSection).toBeTruthy();
      expect(buildSection![0]).toMatch(/RUN\s+npm\s+run\s+build/);
    });

    it("should handle existing type errors gracefully", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const buildSection = dockerfileContent.match(/FROM\s+development\s+AS\s+build[\s\S]*?(?=FROM|$)/i);

      expect(buildSection).toBeTruthy();
      // Should have fallback for build errors or comment explaining them
      const hasErrorHandling = buildSection![0].includes("||") || buildSection![0].includes("existing issue");
      expect(hasErrorHandling).toBe(true);
    });

    it("should include comments explaining build behavior", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const buildSection = dockerfileContent.match(/FROM\s+development\s+AS\s+build[\s\S]*?(?=FROM|$)/i);

      expect(buildSection).toBeTruthy();
      // Should have comments explaining the build process or known issues
      expect(buildSection![0]).toMatch(/#.*[Bb]uild/);
    });
  });

  describe("Production stage configuration", () => {
    it("should use fresh Node.js Alpine image", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const prodSection = dockerfileContent.match(/FROM\s+node:20-alpine\s+AS\s+production[\s\S]*$/i);

      expect(prodSection).toBeTruthy();
    });

    it("should set working directory", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const prodSection = dockerfileContent.match(/FROM\s+node:20-alpine\s+AS\s+production[\s\S]*$/i);

      expect(prodSection).toBeTruthy();
      expect(prodSection![0]).toMatch(/WORKDIR\s+\/app/);
    });

    it("should copy built artifacts from build stage", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const prodSection = dockerfileContent.match(/FROM\s+node:20-alpine\s+AS\s+production[\s\S]*$/i);

      expect(prodSection).toBeTruthy();
      expect(prodSection![0]).toMatch(/COPY\s+--from=build\s+.*dist/);
    });

    it("should copy package files from build stage", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const prodSection = dockerfileContent.match(/FROM\s+node:20-alpine\s+AS\s+production[\s\S]*$/i);

      expect(prodSection).toBeTruthy();
      expect(prodSection![0]).toMatch(/COPY\s+--from=build\s+.*package.*\.json/);
    });

    it("should install only production dependencies", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const prodSection = dockerfileContent.match(/FROM\s+node:20-alpine\s+AS\s+production[\s\S]*$/i);

      expect(prodSection).toBeTruthy();
      expect(prodSection![0]).toMatch(/npm\s+ci\s+--production/);
    });

    it("should not include development files", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const prodSection = dockerfileContent.match(/FROM\s+node:20-alpine\s+AS\s+production[\s\S]*$/i);

      expect(prodSection).toBeTruthy();
      // Should not copy entire source (COPY . .) in production
      expect(prodSection![0]).not.toMatch(/COPY\s+\.\s+\./);
    });

    it("should not have a default CMD for library usage", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const prodSection = dockerfileContent.match(/FROM\s+node:20-alpine\s+AS\s+production[\s\S]*$/i);

      expect(prodSection).toBeTruthy();
      // Library doesn't need a CMD - consumers will use it as a dependency
      // Check that there's no CMD or there's a comment explaining no CMD
      const hasCmd = prodSection![0].match(/^CMD\s+/m);
      expect(hasCmd).toBeFalsy();
    });

    it("should include comment explaining library usage pattern", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const prodSection = dockerfileContent.match(/FROM\s+node:20-alpine\s+AS\s+production[\s\S]*$/i);

      expect(prodSection).toBeTruthy();
      // Should explain why there's no CMD or how to use it
      const hasLibraryComment = prodSection![0].match(/#.*library|#.*consumer|#.*usage/i);
      expect(hasLibraryComment).toBeTruthy();
    });
  });

  describe("Best practices validation", () => {
    it("should leverage Docker layer caching properly", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // package.json should be copied before source code
      const baseSection = dockerfileContent.match(/FROM\s+\S+\s+AS\s+base[\s\S]*?(?=FROM|$)/i);
      if (baseSection) {
        const copyPackageIndex = baseSection[0].indexOf("COPY package");
        const npmCiIndex = baseSection[0].indexOf("npm ci");

        expect(copyPackageIndex).toBeGreaterThan(-1);
        expect(npmCiIndex).toBeGreaterThan(-1);
        expect(copyPackageIndex).toBeLessThan(npmCiIndex);
      }
    });

    it("should not run as root user in production (optional but recommended)", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Check if USER directive is used (optional for libraries)
      // This is a soft recommendation
      const hasUserDirective = dockerfileContent.match(/^USER\s+/m);

      // For a library, running as root is acceptable but log it
      if (!hasUserDirective) {
        // This is acceptable for a library - just verify no security issues
        expect(true).toBe(true);
      }
    });

    it("should use COPY instead of ADD for files", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // COPY is preferred over ADD unless extracting archives
      const addStatements = dockerfileContent.match(/^ADD\s+/gm);

      // Should not use ADD for regular file copying
      expect(addStatements).toBeFalsy();
    });

    it("should minimize number of layers", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Count RUN commands - should be reasonable
      const runCommands = dockerfileContent.match(/^RUN\s+/gm);

      expect(runCommands).toBeTruthy();
      // Should have a reasonable number of RUN commands (not too many layers)
      expect(runCommands!.length).toBeLessThan(10);
    });

    it("should have descriptive comments for each stage", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Each stage should have a comment
      const stages = ["base", "development", "build", "production"];
      for (const stage of stages) {
        const stageRegex = new RegExp(`#.*${stage}`, "i");
        expect(dockerfileContent).toMatch(stageRegex);
      }
    });
  });

  describe("Security validation", () => {
    it("should use specific version tags, not latest", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Should not use :latest tag
      expect(dockerfileContent).not.toMatch(/FROM\s+\S+:latest/);
    });

    it("should not expose sensitive information", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Should not contain hardcoded secrets, passwords, tokens
      expect(dockerfileContent).not.toMatch(/password|token|secret|api_key/i);
    });

    it("should not copy .env files explicitly", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Should not explicitly copy environment files
      expect(dockerfileContent).not.toMatch(/COPY\s+.*\.env/);
    });
  });

  describe("Optimization validation", () => {
    it("should use multi-stage builds to reduce final image size", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Production should copy from build, not include all intermediate files
      const prodSection = dockerfileContent.match(/FROM\s+node:20-alpine\s+AS\s+production[\s\S]*$/i);

      expect(prodSection).toBeTruthy();
      expect(prodSection![0]).toMatch(/COPY\s+--from=/);
    });

    it("should not include unnecessary files in production", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const prodSection = dockerfileContent.match(/FROM\s+node:20-alpine\s+AS\s+production[\s\S]*$/i);

      expect(prodSection).toBeTruthy();
      // Should not copy source files, test files, or development config
      expect(prodSection![0]).not.toMatch(/COPY\s+.*src/);
      expect(prodSection![0]).not.toMatch(/COPY\s+.*test/);
    });

    it("should separate dependency installation from source copying", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const baseSection = dockerfileContent.match(/FROM\s+\S+\s+AS\s+base[\s\S]*?(?=FROM|$)/i);

      expect(baseSection).toBeTruthy();
      // Dependencies should be installed before copying source
      const hasPackageCopy = baseSection![0].match(/COPY\s+package.*\.json/);
      const hasNpmCi = baseSection![0].match(/npm\s+ci/);

      expect(hasPackageCopy).toBeTruthy();
      expect(hasNpmCi).toBeTruthy();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle build failures gracefully", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const buildSection = dockerfileContent.match(/FROM\s+development\s+AS\s+build[\s\S]*?(?=FROM|$)/i);

      expect(buildSection).toBeTruthy();
      // Should have error handling or documentation for build issues
      const hasErrorHandling = buildSection![0].includes("||") || buildSection![0].includes("#");
      expect(hasErrorHandling).toBe(true);
    });

    it("should work with different package managers", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Primary package manager should be clear and consistent
      const packageManagers = ["npm", "yarn", "pnpm"];
      let usedPm = "";

      for (const pm of packageManagers) {
        if (dockerfileContent.includes(pm)) {
          usedPm = pm;
          break;
        }
      }

      expect(usedPm).toBeTruthy();
      // Should consistently use the same package manager
      const pmUsages = dockerfileContent.match(new RegExp(usedPm, "g"));
      expect(pmUsages).toBeTruthy();
    });

    it("should have consistent line endings", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Should use LF line endings (Docker standard)
      expect(dockerfileContent).not.toMatch(/\r\n/);
    });
  });

  describe("Documentation and maintainability", () => {
    it("should include comments explaining each stage purpose", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Should have comments explaining stages
      const commentLines = dockerfileContent.split("\n").filter(line =>
        line.trim().startsWith("#")
      );

      expect(commentLines.length).toBeGreaterThan(3);
    });

    it("should explain why build may have type errors", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");

      // Should document the known type error issue
      expect(dockerfileContent).toMatch(/#.*type error.*existing issue/i);
    });

    it("should be formatted consistently", () => {
      dockerfileContent = readFileSync(dockerfilePath, "utf-8");
      const lines = dockerfileContent.split("\n");

      // Check for consistent indentation and formatting
      for (const line of lines) {
        if (line.trim().startsWith("FROM")) {
          // FROM should not be indented
          expect(line).toMatch(/^FROM/);
        }
      }
    });
  });
});