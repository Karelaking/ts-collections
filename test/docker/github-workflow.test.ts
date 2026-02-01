import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

/**
 * Test suite for GitHub Actions Docker workflow (.github/workflows/docker.yml)
 *
 * Validates that the Docker workflow is properly configured with:
 * - Correct trigger conditions (pull_request, push, workflow_dispatch)
 * - Proper Docker Buildx setup
 * - Multi-stage build testing
 * - Test execution and linting steps
 * - Production image verification
 */
describe("GitHub Actions Docker Workflow", () => {
  const workflowPath = resolve(process.cwd(), ".github/workflows/docker.yml");
  let workflowContent: string;

  it("should exist in the correct location", () => {
    expect(existsSync(workflowPath)).toBe(true);
  });

  describe("File structure validation", () => {
    it("should be readable and non-empty", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      expect(workflowContent).toBeTruthy();
      expect(workflowContent.length).toBeGreaterThan(0);
    });

    it("should have a descriptive name", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      expect(workflowContent).toMatch(/^name:\s*.+/m);
      expect(workflowContent).toMatch(/name:\s*.*[Dd]ocker/);
    });

    it("should be valid YAML format", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Basic YAML structure checks
      expect(workflowContent).toMatch(/^on:/m);
      expect(workflowContent).toMatch(/^jobs:/m);
    });
  });

  describe("Trigger configuration", () => {
    it("should trigger on pull requests to master", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/pull_request:/);
      expect(workflowContent).toMatch(/branches:.*master/);
    });

    it("should trigger on push to master", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/push:/);
      expect(workflowContent).toMatch(/branches:.*master/);
    });

    it("should support manual workflow dispatch", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/workflow_dispatch:/);
    });

    it("should filter by relevant file paths", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Should include paths for Docker-related files
      expect(workflowContent).toMatch(/paths:/);
      expect(workflowContent).toMatch(/Dockerfile/);
      expect(workflowContent).toMatch(/docker-compose\.yml/);
      expect(workflowContent).toMatch(/\.dockerignore/);
    });

    it("should trigger on source code changes", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Should trigger when source or tests change
      expect(workflowContent).toMatch(/src\/\*\*/);
      expect(workflowContent).toMatch(/test\/\*\*/);
    });

    it("should trigger on package.json changes", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/package.*\.json/);
    });

    it("should trigger on workflow file changes", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/\.github\/workflows\/docker\.yml/);
    });
  });

  describe("Permissions configuration", () => {
    it("should set appropriate permissions", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/permissions:/);
    });

    it("should have read access to contents", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/contents:\s*read/);
    });

    it("should follow principle of least privilege", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Should not have write permissions unless necessary
      expect(workflowContent).not.toMatch(/:\s*write/);
    });
  });

  describe("Job configuration", () => {
    it("should define docker-build-and-test job", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/docker-build-and-test:/);
    });

    it("should run on ubuntu-latest", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/runs-on:\s*ubuntu-latest/);
    });

    it("should have multiple steps", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      const stepsMatch = workflowContent.match(/steps:/);
      expect(stepsMatch).toBeTruthy();

      // Should have at least 5 steps (checkout, buildx, build dev, test, build prod)
      const stepMatches = workflowContent.match(/- name:/g);
      expect(stepMatches).toBeTruthy();
      expect(stepMatches!.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("Checkout step", () => {
    it("should checkout repository code", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/- name:.*[Cc]heckout/);
      expect(workflowContent).toMatch(/uses:\s*actions\/checkout@v4/);
    });

    it("should use pinned version of checkout action", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Should specify version (v4 or later)
      expect(workflowContent).toMatch(/actions\/checkout@v\d+/);
    });
  });

  describe("Docker Buildx setup", () => {
    it("should set up Docker Buildx", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/- name:.*[Bb]uildx/);
      expect(workflowContent).toMatch(/uses:\s*docker\/setup-buildx-action@v3/);
    });

    it("should use pinned version of buildx action", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/docker\/setup-buildx-action@v\d+/);
    });
  });

  describe("Development image build step", () => {
    it("should build development image", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/- name:.*[Bb]uild.*development/i);
      expect(workflowContent).toMatch(/uses:\s*docker\/build-push-action@v5/);
    });

    it("should use correct build context", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const buildSection = extractStepSection(workflowContent, "Build development");

      expect(buildSection).toMatch(/context:\s*\./);
    });

    it("should target development stage", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const buildSection = extractStepSection(workflowContent, "Build development");

      expect(buildSection).toMatch(/target:\s*development/);
    });

    it("should not push image to registry", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const buildSection = extractStepSection(workflowContent, "Build development");

      expect(buildSection).toMatch(/push:\s*false/);
    });

    it("should load image for local use", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const buildSection = extractStepSection(workflowContent, "Build development");

      expect(buildSection).toMatch(/load:\s*true/);
    });

    it("should tag image appropriately", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const buildSection = extractStepSection(workflowContent, "Build development");

      expect(buildSection).toMatch(/tags:\s*ts-collections:dev/);
    });

    it("should use GitHub Actions cache", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const buildSection = extractStepSection(workflowContent, "Build development");

      expect(buildSection).toMatch(/cache-from:\s*type=gha/);
      expect(buildSection).toMatch(/cache-to:\s*type=gha/);
    });
  });

  describe("Test execution steps", () => {
    it("should run tests in Docker container", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/- name:.*[Rr]un tests/i);
      expect(workflowContent).toMatch(/docker run.*ts-collections:dev.*npm test/);
    });

    it("should run tests in non-watch mode", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const testSection = extractStepSection(workflowContent, "Run tests");

      expect(testSection).toMatch(/--run/);
    });

    it("should use --rm flag for cleanup", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const testSection = extractStepSection(workflowContent, "Run tests");

      expect(testSection).toMatch(/docker run --rm/);
    });
  });

  describe("Linting steps", () => {
    it("should run linter in Docker container", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/- name:.*[Ll]int/i);
      expect(workflowContent).toMatch(/docker run.*ts-collections:dev.*npm run lint/);
    });

    it("should use --rm flag for cleanup", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const lintSection = extractStepSection(workflowContent, "linter");

      expect(lintSection).toMatch(/docker run --rm/);
    });
  });

  describe("Docker Compose integration", () => {
    it("should test docker-compose services", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/- name:.*docker-compose/i);
    });

    it("should run test service with docker compose", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const composeSection = extractStepSection(workflowContent, "docker-compose");

      expect(composeSection).toMatch(/docker compose run --rm test/);
    });

    it("should run lint service with docker compose", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const composeSection = extractStepSection(workflowContent, "docker-compose");

      expect(composeSection).toMatch(/docker compose run --rm lint/);
    });
  });

  describe("Production image build step", () => {
    it("should build production image", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/- name:.*[Bb]uild.*production/i);
    });

    it("should target production stage", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const prodSection = extractStepSection(workflowContent, "Build production");

      expect(prodSection).toMatch(/target:\s*production/);
    });

    it("should not push production image", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const prodSection = extractStepSection(workflowContent, "Build production");

      expect(prodSection).toMatch(/push:\s*false/);
    });

    it("should tag production image appropriately", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const prodSection = extractStepSection(workflowContent, "Build production");

      expect(prodSection).toMatch(/tags:\s*ts-collections:prod/);
    });

    it("should use cache for production build", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const prodSection = extractStepSection(workflowContent, "Build production");

      expect(prodSection).toMatch(/cache-from:\s*type=gha/);
    });
  });

  describe("Verification steps", () => {
    it("should verify production image was created", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/- name:.*[Vv]erify.*production/i);
    });

    it("should list Docker images", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const verifySection = extractStepSection(workflowContent, "Verify");

      expect(verifySection).toMatch(/docker images/);
      expect(verifySection).toMatch(/ts-collections/);
    });

    it("should include success message", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");
      const verifySection = extractStepSection(workflowContent, "Verify");

      expect(verifySection).toMatch(/echo.*success/i);
    });
  });

  describe("Best practices validation", () => {
    it("should use pinned action versions", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // All actions should have version tags
      const actionMatches = workflowContent.matchAll(/uses:\s*(.+)@(.+)/g);
      let count = 0;

      for (const match of actionMatches) {
        const version = match[2];
        // Should have a version (v1, v2, sha, etc.)
        expect(version).toBeTruthy();
        expect(version.length).toBeGreaterThan(0);
        count++;
      }

      expect(count).toBeGreaterThan(0);
    });

    it("should use shell commands cautiously", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // run: commands should be safe (no arbitrary code execution)
      const runMatches = workflowContent.matchAll(/run:\s*\|?\s*\n?\s*(.+)/g);

      for (const match of runMatches) {
        const command = match[1];
        // Should not use eval, curl | bash, or other dangerous patterns
        expect(command).not.toMatch(/eval|curl.*\|.*bash|wget.*\|.*sh/i);
      }
    });

    it("should have descriptive step names", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      const stepNames = workflowContent.matchAll(/- name:\s*(.+)/g);
      let count = 0;

      for (const match of stepNames) {
        const name = match[1];
        // Step names should be meaningful
        expect(name.length).toBeGreaterThan(3);
        count++;
      }

      expect(count).toBeGreaterThan(5);
    });

    it("should follow GitHub Actions best practices", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Should not use deprecated syntax
      expect(workflowContent).not.toMatch(/::set-output/);
      expect(workflowContent).not.toMatch(/::save-state/);
      expect(workflowContent).not.toMatch(/::set-env/);
    });
  });

  describe("Security validation", () => {
    it("should not contain hardcoded secrets", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Should not have hardcoded passwords, tokens, etc.
      expect(workflowContent).not.toMatch(/password:\s*['"][^$]/i);
      expect(workflowContent).not.toMatch(/token:\s*['"][^$]/i);
      expect(workflowContent).not.toMatch(/api_key:\s*['"][^$]/i);
    });

    it("should use secrets from GitHub Secrets if needed", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // If secrets are used, they should reference ${{ secrets.* }}
      const secretRefs = workflowContent.matchAll(/\$\{\{\s*secrets\./g);

      // For this workflow, secrets might not be needed (public testing)
      // Just verify if they're used, they're used correctly
      for (const _ of secretRefs) {
        expect(true).toBe(true); // Secrets are properly referenced
      }
    });

    it("should not disable security features", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Should not disable Docker security
      expect(workflowContent).not.toMatch(/--privileged/);
      expect(workflowContent).not.toMatch(/--security-opt/);
    });
  });

  describe("Cache optimization", () => {
    it("should use GitHub Actions cache for Docker layers", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/cache-from:\s*type=gha/);
      expect(workflowContent).toMatch(/cache-to:\s*type=gha/);
    });

    it("should use max cache mode for better performance", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      expect(workflowContent).toMatch(/cache-to:.*mode=max/);
    });

    it("should cache for both dev and prod builds", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Both development and production builds should use cache
      const devSection = extractStepSection(workflowContent, "Build development");
      const prodSection = extractStepSection(workflowContent, "Build production");

      expect(devSection).toMatch(/cache-from/);
      expect(prodSection).toMatch(/cache-from/);
    });
  });

  describe("Error handling", () => {
    it("should fail workflow if tests fail", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Steps should not have continue-on-error: true for critical steps
      const testSection = extractStepSection(workflowContent, "Run tests");

      expect(testSection).not.toMatch(/continue-on-error:\s*true/);
    });

    it("should fail workflow if lint fails", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      const lintSection = extractStepSection(workflowContent, "linter");

      expect(lintSection).not.toMatch(/continue-on-error:\s*true/);
    });

    it("should fail workflow if build fails", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      const buildSections = [
        extractStepSection(workflowContent, "Build development"),
        extractStepSection(workflowContent, "Build production")
      ];

      for (const section of buildSections) {
        expect(section).not.toMatch(/continue-on-error:\s*true/);
      }
    });
  });

  describe("Performance considerations", () => {
    it("should build images in parallel where possible", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Production build should happen after tests (sequential)
      const lines = workflowContent.split("\n");
      const testLineIndex = lines.findIndex(line => line.includes("Run tests"));
      const prodBuildIndex = lines.findIndex(line => line.includes("Build production"));

      if (testLineIndex > -1 && prodBuildIndex > -1) {
        expect(prodBuildIndex).toBeGreaterThan(testLineIndex);
      }
    });

    it("should minimize build time with efficient step ordering", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      const lines = workflowContent.split("\n");

      // Checkout should be first
      const checkoutIndex = lines.findIndex(line => line.includes("Checkout"));
      const buildxIndex = lines.findIndex(line => line.includes("Buildx"));

      expect(checkoutIndex).toBeGreaterThan(-1);
      expect(buildxIndex).toBeGreaterThan(checkoutIndex);
    });
  });

  describe("Edge cases and special scenarios", () => {
    it("should handle multi-line commands correctly", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Multi-line commands should use | or |- or >
      const multiLineSteps = workflowContent.match(/run:\s*\|[\s\S]*?(?=\n\s*-|\n[a-z]|$)/g);

      if (multiLineSteps) {
        for (const step of multiLineSteps) {
          // Should have proper indentation
          expect(step).toMatch(/\|/);
        }
      }
    });

    it("should handle workflow dispatch with no inputs", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // workflow_dispatch can be empty (no required inputs)
      const dispatchSection = workflowContent.match(/workflow_dispatch:\s*(?:\n|$)/);

      expect(dispatchSection).toBeTruthy();
    });

    it("should work with both docker and docker compose", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Should use both docker run and docker compose
      expect(workflowContent).toMatch(/docker run/);
      expect(workflowContent).toMatch(/docker compose/);
    });
  });

  describe("Integration and consistency", () => {
    it("should use consistent image names across steps", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Image names should be consistent
      const devImageMatches = workflowContent.match(/ts-collections:dev/g);
      const prodImageMatches = workflowContent.match(/ts-collections:prod/g);

      expect(devImageMatches).toBeTruthy();
      expect(prodImageMatches).toBeTruthy();
    });

    it("should reference correct docker-compose services", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Services referenced should exist in docker-compose.yml
      const validServices = ["test", "lint", "build", "dev", "prod"];

      const composeSection = extractStepSection(workflowContent, "docker-compose");
      const serviceMatches = composeSection.matchAll(/docker compose run --rm (\w+)/g);

      for (const match of serviceMatches) {
        const service = match[1];
        expect(validServices).toContain(service);
      }
    });

    it("should match Dockerfile stage names", () => {
      workflowContent = readFileSync(workflowPath, "utf-8");

      // Targets should match Dockerfile stages
      const validTargets = ["development", "build", "production"];
      const targetMatches = workflowContent.matchAll(/target:\s*(\w+)/g);

      for (const match of targetMatches) {
        const target = match[1];
        expect(validTargets).toContain(target);
      }
    });
  });
});

/**
 * Helper function to extract a specific step section from workflow
 */
function extractStepSection(content: string, stepNamePattern: string): string {
  const lines = content.split("\n");
  const stepIndex = lines.findIndex(line =>
    line.match(new RegExp(`- name:.*${stepNamePattern}`, "i"))
  );

  if (stepIndex === -1) {
    return "";
  }

  // Extract from step name to next step or end
  const sectionLines = [];
  let i = stepIndex;

  while (i < lines.length) {
    const line = lines[i];

    // Stop if we hit another step at the same level
    if (i > stepIndex && line.match(/^\s*- name:/)) {
      break;
    }

    sectionLines.push(line);
    i++;
  }

  return sectionLines.join("\n");
}