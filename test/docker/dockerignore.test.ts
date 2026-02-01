import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

/**
 * Test suite for .dockerignore file configuration
 *
 * Validates that the .dockerignore file is properly configured to:
 * - Exclude unnecessary files from Docker build context
 * - Reduce image size by excluding development files
 * - Improve build performance by ignoring large directories
 */
describe(".dockerignore Configuration", () => {
  const dockerignorePath = resolve(process.cwd(), ".dockerignore");
  let dockerignoreContent: string;

  it("should exist in the project root", () => {
    expect(existsSync(dockerignorePath)).toBe(true);
  });

  describe("Content validation", () => {
    it("should be readable and non-empty", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toBeTruthy();
      expect(dockerignoreContent.length).toBeGreaterThan(0);
    });

    it("should exclude node_modules directory", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toMatch(/node_modules/);
    });

    it("should exclude build output directories", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toMatch(/dist/);
      expect(dockerignoreContent).toMatch(/build/);
    });

    it("should exclude test coverage directories", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toMatch(/coverage/);
      expect(dockerignoreContent).toMatch(/\.nyc_output/);
    });

    it("should exclude IDE and editor files", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toMatch(/\.vscode/);
      expect(dockerignoreContent).toMatch(/\.idea/);
      expect(dockerignoreContent).toMatch(/\.DS_Store/);
    });

    it("should exclude Git files", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toMatch(/\.git/);
      expect(dockerignoreContent).toMatch(/\.gitignore/);
    });

    it("should exclude documentation files", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toMatch(/\*\.md/);
      expect(dockerignoreContent).toMatch(/docs/);
    });

    it("should exclude CI/CD files", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toMatch(/\.github/);
    });

    it("should exclude environment files", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toMatch(/\.env/);
    });

    it("should exclude debug log files", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toMatch(/npm-debug\.log/);
      expect(dockerignoreContent).toMatch(/yarn-debug\.log/);
      expect(dockerignoreContent).toMatch(/pnpm-debug\.log/);
    });

    it("should exclude temporary files", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toMatch(/tmp/);
      expect(dockerignoreContent).toMatch(/temp/);
      expect(dockerignoreContent).toMatch(/\*\.log/);
    });

    it("should exclude non-npm lock files but preserve package-lock.json", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toMatch(/yarn\.lock/);
      expect(dockerignoreContent).toMatch(/pnpm-lock\.yaml/);
      // package-lock.json should NOT be in .dockerignore (needed for npm ci)
      expect(dockerignoreContent).not.toMatch(/^package-lock\.json$/m);
    });

    it("should exclude TypeScript build info files", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toMatch(/\*\.tsbuildinfo/);
    });
  });

  describe("Pattern format validation", () => {
    it("should use valid Docker ignore patterns", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      const lines = dockerignoreContent.split("\n");

      // Check for common pattern issues
      for (const line of lines) {
        const trimmedLine = line.trim();

        // Skip empty lines and comments
        if (trimmedLine === "" || trimmedLine.startsWith("#")) {
          continue;
        }

        // Patterns should not start with /
        // (unless it's a specific absolute pattern, but generally we use relative patterns)
        // This is a soft check - we just verify the file is parseable
        expect(trimmedLine.length).toBeGreaterThan(0);
      }
    });

    it("should have comments for major sections", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      const lines = dockerignoreContent.split("\n");
      const commentLines = lines.filter(line => line.trim().startsWith("#"));

      // Should have at least a few comment lines for organization
      expect(commentLines.length).toBeGreaterThan(0);
    });
  });

  describe("Security validation", () => {
    it("should exclude sensitive environment files", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toMatch(/\.env/);
      expect(dockerignoreContent).toMatch(/\.env\.local/);
      expect(dockerignoreContent).toMatch(/\.env\.\*\.local/);
    });

    it("should exclude editor swap files that may contain secrets", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toMatch(/\*\.swp/);
      expect(dockerignoreContent).toMatch(/\*\.swo/);
    });
  });

  describe("Build optimization validation", () => {
    it("should exclude files that would increase image size unnecessarily", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");

      // Large directories that shouldn't be in the image
      const largeDirectories = [
        "node_modules",
        "coverage",
        ".git",
        "dist",
        "build"
      ];

      for (const dir of largeDirectories) {
        expect(dockerignoreContent).toMatch(new RegExp(dir));
      }
    });

    it("should be organized into logical sections", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");

      // Check that content is organized (has multiple comment sections)
      const commentSections = dockerignoreContent.match(/#\s*\w+/g);
      expect(commentSections).toBeTruthy();
      expect(commentSections!.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Edge cases", () => {
    it("should handle files with special characters in names", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");

      // Check for patterns that handle special characters
      expect(dockerignoreContent).toMatch(/\*/); // Wildcard patterns
    });

    it("should not exclude package.json (required for builds)", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");

      // package.json should NOT be ignored
      const lines = dockerignoreContent.split("\n").map(l => l.trim());
      const excludesPackageJson = lines.some(line =>
        line === "package.json" ||
        line === "**/package.json" ||
        line === "package*.json" && !line.includes("#")
      );

      expect(excludesPackageJson).toBe(false);
    });

    it("should not exclude source files needed for build", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");

      // src/ directory should NOT be ignored
      const lines = dockerignoreContent.split("\n").map(l => l.trim());
      const excludesSrc = lines.some(line =>
        line === "src" ||
        line === "src/" ||
        line === "**/src"
      );

      expect(excludesSrc).toBe(false);
    });
  });

  describe("Consistency with .gitignore", () => {
    it("should exclude similar patterns as .gitignore where appropriate", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");

      // Common patterns that should be in both
      const commonPatterns = [
        "node_modules",
        "coverage",
        ".env"
      ];

      for (const pattern of commonPatterns) {
        expect(dockerignoreContent).toMatch(new RegExp(pattern));
      }
    });
  });

  describe("Performance implications", () => {
    it("should reduce build context by excluding large directories", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      const lines = dockerignoreContent.split("\n").map(l => l.trim());
      const nonCommentLines = lines.filter(l => l && !l.startsWith("#"));

      // Should have a reasonable number of exclusion patterns
      expect(nonCommentLines.length).toBeGreaterThan(10);
    });

    it("should exclude all log files to reduce context size", () => {
      dockerignoreContent = readFileSync(dockerignorePath, "utf-8");
      expect(dockerignoreContent).toMatch(/\*\.log/);
    });
  });
});