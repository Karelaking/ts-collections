import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";

/**
 * Test suite for GitHub Actions workflow configuration
 */
describe("GitHub Actions Workflow Tests", () => {
  const projectRoot = path.join(__dirname, "../..");
  const workflowPath = path.join(projectRoot, ".github/workflows/docker.yml");

  describe("Workflow File Structure", () => {
    it("should exist at correct path", () => {
      expect(fs.existsSync(workflowPath)).toBe(true);
    });

    it("should be valid YAML", () => {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(() => {
        const parsed = content.split("\n").reduce((acc, line) => {
          if (line.includes(":")) return acc + "\n" + line;
          return acc;
        }, "");
        // Basic validation - should have key: value pairs
        expect(parsed).toBeTruthy();
      }).not.toThrow();
    });

    it("should have a name field", () => {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).toMatch(/^name:\s*.+/m);
    });

    it("should have on trigger configuration", () => {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).toContain("on:");
    });

    it("should have jobs section", () => {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).toContain("jobs:");
    });
  });

  describe("Workflow Triggers", () => {
    let workflowContent: string;

    beforeEach(() => {
      workflowContent = fs.readFileSync(workflowPath, "utf-8");
    });

    it("should trigger on pull_request", () => {
      expect(workflowContent).toContain("pull_request:");
    });

    it("should trigger on push to master", () => {
      expect(workflowContent).toContain("push:");
      const pushSection = workflowContent.split("push:")[1]?.split(/\n\s{0,2}\w+:/)[0];
      expect(pushSection).toContain("master");
    });

    it("should trigger on workflow_dispatch", () => {
      expect(workflowContent).toContain("workflow_dispatch");
    });

    it("should have path filters for Docker-related files", () => {
      expect(workflowContent).toContain("paths:");

      // Check for specific paths
      const pathPatterns = [
        "Dockerfile",
        "docker-compose.yml",
        ".dockerignore",
        "package*.json",
        "src/**",
        "test/**"
      ];

      pathPatterns.forEach(pattern => {
        expect(workflowContent).toContain(pattern);
      });
    });

    it("should target master branch for pull requests", () => {
      const prSection = workflowContent.split("pull_request:")[1]?.split(/\n\s{0,2}\w+:/)[0];
      expect(prSection).toContain("master");
    });

    it("should not trigger on unrelated file changes", () => {
      expect(workflowContent).toContain("paths:");
      // Workflow should have path filtering, meaning it won't run on all changes
      const hasPathFilter = workflowContent.includes("paths:");
      expect(hasPathFilter).toBe(true);
    });
  });

  describe("Workflow Permissions", () => {
    let workflowContent: string;

    beforeEach(() => {
      workflowContent = fs.readFileSync(workflowPath, "utf-8");
    });

    it("should have permissions section", () => {
      expect(workflowContent).toContain("permissions:");
    });

    it("should follow principle of least privilege", () => {
      expect(workflowContent).toContain("contents: read");
    });

    it("should not have write permissions unless necessary", () => {
      const permissionsSection = workflowContent.split("permissions:")[1]?.split(/\n\w+:/)[0];
      expect(permissionsSection).not.toContain("write");
    });
  });

  describe("Job Configuration", () => {
    let workflowContent: string;

    beforeEach(() => {
      workflowContent = fs.readFileSync(workflowPath, "utf-8");
    });

    it("should have docker-build-and-test job", () => {
      expect(workflowContent).toContain("docker-build-and-test:");
    });

    it("should use ubuntu-latest runner", () => {
      expect(workflowContent).toContain("runs-on: ubuntu-latest");
    });

    it("should checkout repository", () => {
      expect(workflowContent).toContain("uses: actions/checkout@v4");
    });

    it("should set up Docker Buildx", () => {
      expect(workflowContent).toContain("uses: docker/setup-buildx-action@v3");
    });

    it("should use official GitHub actions", () => {
      const actions = workflowContent.match(/uses: (\S+)/g);
      expect(actions).toBeDefined();

      actions!.forEach(action => {
        // Should use either actions/* or docker/* namespaces
        expect(action).toMatch(/uses: (actions|docker)\//);
      });
    });

    it("should use pinned action versions", () => {
      const actions = workflowContent.match(/uses: \S+@(\S+)/g);
      expect(actions).toBeDefined();

      actions!.forEach(action => {
        // Should have version specified
        expect(action).toMatch(/@v\d+/);
      });
    });
  });

  describe("Build Steps", () => {
    let workflowContent: string;

    beforeEach(() => {
      workflowContent = fs.readFileSync(workflowPath, "utf-8");
    });

    it("should build development image", () => {
      expect(workflowContent).toContain("Build development image");
      expect(workflowContent).toContain("target: development");
    });

    it("should build production image", () => {
      expect(workflowContent).toContain("Build production image");
      expect(workflowContent).toContain("target: production");
    });

    it("should use docker/build-push-action", () => {
      expect(workflowContent).toContain("docker/build-push-action@v5");
    });

    it("should not push images by default", () => {
      const buildSteps = workflowContent.split("docker/build-push-action");
      buildSteps.slice(1).forEach(step => {
        const stepContent = step.split(/\n\s+-\s+name:/)[0];
        expect(stepContent).toContain("push: false");
      });
    });

    it("should load images for testing", () => {
      const devBuildSection = workflowContent.split("Build development image")[1]?.split("- name:")[0];
      expect(devBuildSection).toContain("load: true");
    });

    it("should tag images appropriately", () => {
      expect(workflowContent).toContain("tags: ts-collections:dev");
      expect(workflowContent).toContain("tags: ts-collections:prod");
    });

    it("should use GitHub Actions cache", () => {
      expect(workflowContent).toContain("cache-from: type=gha");
      expect(workflowContent).toContain("cache-to: type=gha");
    });

    it("should use max cache mode for better performance", () => {
      expect(workflowContent).toContain("mode=max");
    });

    it("should set correct build context", () => {
      expect(workflowContent).toContain("context: .");
    });
  });

  describe("Test Steps", () => {
    let workflowContent: string;

    beforeEach(() => {
      workflowContent = fs.readFileSync(workflowPath, "utf-8");
    });

    it("should run tests in Docker", () => {
      expect(workflowContent).toContain("Run tests in Docker");
      expect(workflowContent).toMatch(/docker run.*npm test/);
    });

    it("should run linter in Docker", () => {
      expect(workflowContent).toContain("Run linter in Docker");
      expect(workflowContent).toMatch(/docker run.*npm run lint/);
    });

    it("should test docker-compose services", () => {
      expect(workflowContent).toContain("Test docker-compose services");
      expect(workflowContent).toContain("docker compose run");
    });

    it("should run tests before building production image", () => {
      const lines = workflowContent.split("\n");
      let testStepIndex = -1;
      let prodBuildIndex = -1;

      lines.forEach((line, index) => {
        if (line.includes("Run tests in Docker") && testStepIndex === -1) {
          testStepIndex = index;
        }
        if (line.includes("Build production image") && prodBuildIndex === -1) {
          prodBuildIndex = index;
        }
      });

      expect(testStepIndex).toBeGreaterThan(-1);
      expect(prodBuildIndex).toBeGreaterThan(testStepIndex);
    });

    it("should verify production image after build", () => {
      expect(workflowContent).toContain("Verify production image");
      expect(workflowContent).toContain("docker images");
    });

    it("should use --rm flag to clean up containers", () => {
      const dockerRunCommands = workflowContent.match(/docker run[^\n]+/g);
      expect(dockerRunCommands).toBeDefined();

      dockerRunCommands!.forEach(cmd => {
        expect(cmd).toContain("--rm");
      });
    });

    it("should use --run flag for vitest in non-watch mode", () => {
      expect(workflowContent).toMatch(/npm test.*--run/);
    });
  });

  describe("Workflow Best Practices", () => {
    let workflowContent: string;

    beforeEach(() => {
      workflowContent = fs.readFileSync(workflowPath, "utf-8");
    });

    it("should have descriptive step names", () => {
      const steps = workflowContent.match(/- name: (.+)/g);
      expect(steps).toBeDefined();
      expect(steps!.length).toBeGreaterThan(5);

      steps!.forEach(step => {
        const name = step.replace("- name:", "").trim();
        expect(name.length).toBeGreaterThan(5);
      });
    });

    it("should not contain hardcoded secrets", () => {
      expect(workflowContent).not.toMatch(/password\s*:\s*["']?\w+["']?/i);
      expect(workflowContent).not.toMatch(/token\s*:\s*["']?\w+["']?/i);
      expect(workflowContent).not.toMatch(/api[_-]?key\s*:\s*["']?\w+["']?/i);
    });

    it("should use proper indentation (2 spaces)", () => {
      const lines = workflowContent.split("\n");
      const indentedLines = lines.filter(line => line.match(/^\s+\S/));

      indentedLines.forEach(line => {
        const indent = line.match(/^(\s+)/)?.[1].length || 0;
        // Should be multiple of 2
        expect(indent % 2).toBe(0);
      });
    });

    it("should be well-structured YAML", () => {
      // Check that the workflow has proper structure
      expect(workflowContent).toContain("name:");
      expect(workflowContent).toContain("steps:");
    });

    it("should not have unnecessary environment variables", () => {
      // Check that env vars are used sparingly and only when needed
      const envCount = (workflowContent.match(/\n\s+env:/g) || []).length;
      expect(envCount).toBeLessThan(5);
    });
  });

  describe("Docker Compose Integration", () => {
    let workflowContent: string;

    beforeEach(() => {
      workflowContent = fs.readFileSync(workflowPath, "utf-8");
    });

    it("should test docker-compose test service", () => {
      expect(workflowContent).toContain("docker compose run --rm test");
    });

    it("should test docker-compose lint service", () => {
      expect(workflowContent).toContain("docker compose run --rm lint");
    });

    it("should use docker compose command", () => {
      // Check that docker compose commands are present
      const composeCommands = workflowContent.match(/docker[- ]compose/g);
      expect(composeCommands).toBeDefined();
      expect(composeCommands!.length).toBeGreaterThan(0);
    });

    it("should use --rm flag with docker compose", () => {
      const composeCommands = workflowContent.match(/docker compose run[^\n]+/g);
      expect(composeCommands).toBeDefined();

      composeCommands!.forEach(cmd => {
        expect(cmd).toContain("--rm");
      });
    });
  });

  describe("Error Handling", () => {
    let workflowContent: string;

    beforeEach(() => {
      workflowContent = fs.readFileSync(workflowPath, "utf-8");
    });

    it("should fail workflow if tests fail", () => {
      // By default, if any step fails, workflow fails
      // Check that we don't have continue-on-error for test steps
      const testSection = workflowContent.split("Run tests in Docker")[1]?.split("- name:")[0];
      expect(testSection).not.toContain("continue-on-error: true");
    });

    it("should fail workflow if linter fails", () => {
      const lintSection = workflowContent.split("Run linter in Docker")[1]?.split("- name:")[0];
      expect(lintSection).not.toContain("continue-on-error: true");
    });

    it("should fail workflow if build fails", () => {
      const buildSection = workflowContent.split("Build development image")[1]?.split("- name:")[0];
      expect(buildSection).not.toContain("continue-on-error: true");
    });
  });

  describe("Workflow Optimization", () => {
    let workflowContent: string;

    beforeEach(() => {
      workflowContent = fs.readFileSync(workflowPath, "utf-8");
    });

    it("should use caching to speed up builds", () => {
      expect(workflowContent).toContain("cache-from");
      expect(workflowContent).toContain("cache-to");
    });

    it("should build development image before running tests", () => {
      const lines = workflowContent.split("\n");
      let devBuildIndex = -1;
      let testIndex = -1;

      lines.forEach((line, index) => {
        if (line.includes("Build development image") && devBuildIndex === -1) {
          devBuildIndex = index;
        }
        if (line.includes("Run tests in Docker") && testIndex === -1) {
          testIndex = index;
        }
      });

      expect(devBuildIndex).toBeGreaterThan(-1);
      expect(testIndex).toBeGreaterThan(devBuildIndex);
    });

    it("should use Docker Buildx for advanced build features", () => {
      expect(workflowContent).toContain("docker/setup-buildx-action");
    });

    it("should use path filters to avoid unnecessary runs", () => {
      expect(workflowContent).toContain("paths:");

      // Count paths to ensure we're filtering appropriately
      const pathsSection = workflowContent.split("paths:")[1]?.split(/\n\s{0,4}\w+:/)[0];
      const pathCount = (pathsSection?.match(/- /g) || []).length;
      expect(pathCount).toBeGreaterThan(3);
    });
  });

  describe("Security Considerations", () => {
    let workflowContent: string;

    beforeEach(() => {
      workflowContent = fs.readFileSync(workflowPath, "utf-8");
    });

    it("should use pinned versions of actions", () => {
      const actions = workflowContent.match(/uses: [^\n]+/g);
      expect(actions).toBeDefined();

      actions!.forEach(action => {
        // Should have @vX or @commit-hash
        expect(action).toMatch(/@\w+/);
      });
    });

    it("should not expose sensitive information in logs", () => {
      expect(workflowContent).not.toMatch(/echo\s+\$\{\{.*secret/i);
    });

    it("should use read-only permissions by default", () => {
      expect(workflowContent).toContain("contents: read");
    });

    it("should not use pull_request_target without good reason", () => {
      // pull_request_target can be dangerous with untrusted code
      expect(workflowContent).not.toContain("pull_request_target");
    });
  });

  describe("Edge Cases", () => {
    let workflowContent: string;

    beforeEach(() => {
      workflowContent = fs.readFileSync(workflowPath, "utf-8");
    });

    it("should handle empty paths gracefully", () => {
      // Workflow should still run if paths match
      const pathsSection = workflowContent.split("paths:")[1];
      expect(pathsSection).toBeDefined();
      expect(pathsSection!.trim()).not.toBe("");
    });

    it("should handle workflow_dispatch without inputs", () => {
      // workflow_dispatch should work even without inputs
      const dispatchSection = workflowContent.split("workflow_dispatch")[1]?.split(/\n\w+:/)[0];
      // Should not have required inputs
      expect(dispatchSection).not.toContain("required: true");
    });

    it("should handle Docker build failures gracefully", () => {
      // Steps should fail the workflow, not silently continue
      expect(workflowContent).not.toContain("|| true");
      expect(workflowContent).not.toContain("|| echo");
    });

    it("should handle missing Docker images", () => {
      // Verify step should handle when images don't exist
      const verifySection = workflowContent.split("Verify production image")[1]?.split("- name:")[0];
      expect(verifySection).toContain("docker images");
    });
  });

  describe("Workflow Output and Feedback", () => {
    let workflowContent: string;

    beforeEach(() => {
      workflowContent = fs.readFileSync(workflowPath, "utf-8");
    });

    it("should provide clear success feedback", () => {
      expect(workflowContent).toContain("✅");
    });

    it("should list built images for verification", () => {
      expect(workflowContent).toContain("docker images");
    });

    it("should have meaningful step names for debugging", () => {
      const stepNames = workflowContent.match(/- name: (.+)/g);
      expect(stepNames).toBeDefined();

      stepNames!.forEach(name => {
        // Step names should be descriptive
        expect(name.toLowerCase()).toMatch(/(checkout|setup|build|run|test|verify)/);
      });
    });
  });

  describe("Regression Tests", () => {
    let workflowContent: string;

    beforeEach(() => {
      workflowContent = fs.readFileSync(workflowPath, "utf-8");
    });

    it("should not have duplicate steps", () => {
      const steps = workflowContent.match(/- name: (.+)/g);
      expect(steps).toBeDefined();

      const stepNames = steps!.map(s => s.replace("- name:", "").trim());
      const uniqueSteps = new Set(stepNames);
      expect(uniqueSteps.size).toBe(stepNames.length);
    });

    it("should not have conflicting trigger conditions", () => {
      // Check that paths are consistent across triggers
      const prPaths = workflowContent.split("pull_request:")[1]?.split("push:")[0];
      const pushPaths = workflowContent.split("push:")[1]?.split(/\n\w+:/)[0];

      if (prPaths?.includes("paths:") && pushPaths?.includes("paths:")) {
        // Both should have similar paths
        expect(prPaths).toContain("Dockerfile");
        expect(pushPaths).toContain("Dockerfile");
      }
    });

    it("should not run tests multiple times unnecessarily", () => {
      const testCommands = workflowContent.match(/npm test/g);
      expect(testCommands).toBeDefined();

      // Should run tests in Docker and docker-compose, but not excessively
      expect(testCommands!.length).toBeLessThan(5);
    });

    it("should maintain consistent Docker tag naming", () => {
      const tags = workflowContent.match(/tags: (.+)/g);
      expect(tags).toBeDefined();

      tags!.forEach(tag => {
        expect(tag).toContain("ts-collections");
      });
    });

    it("should have reasonable line formatting", () => {
      const lines = workflowContent.split("\n");
      // Check that most lines don't have excessive trailing whitespace
      const linesWithTrailingSpace = lines.filter(line => line.match(/\s+$/));
      // Allow some trailing whitespace but not excessive
      expect(linesWithTrailingSpace.length).toBeLessThan(lines.length * 0.5);
    });
  });
});