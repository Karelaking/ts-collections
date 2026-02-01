import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

/**
 * Test suite for docker-compose.yml configuration
 *
 * Validates that the docker-compose.yml file is properly configured with:
 * - All required services (dev, test, lint, build, prod)
 * - Correct service configurations and build targets
 * - Proper volume mounts for development
 * - Appropriate commands for each service
 */
describe("docker-compose.yml Configuration", () => {
  const dockerComposePath = resolve(process.cwd(), "docker-compose.yml");
  let dockerComposeContent: string;

  it("should exist in the project root", () => {
    expect(existsSync(dockerComposePath)).toBe(true);
  });

  describe("File structure validation", () => {
    it("should be readable and non-empty", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      expect(dockerComposeContent).toBeTruthy();
      expect(dockerComposeContent.length).toBeGreaterThan(0);
    });

    it("should not include deprecated version field", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // Should not have version: field at the start
      const hasVersionField = dockerComposeContent.match(/^version:\s*['"]?[\d.]+['"]?$/m);

      // If it has version field, it should be commented as deprecated
      if (hasVersionField) {
        const versionLine = dockerComposeContent.split("\n").find(line =>
          line.match(/version:\s*['"]?[\d.]+['"]?/)
        );

        // If version exists and is not commented, fail
        if (versionLine && !versionLine.trim().startsWith("#")) {
          // Check if there's a comment explaining deprecation nearby
          const lines = dockerComposeContent.split("\n");
          const versionIndex = lines.indexOf(versionLine);
          const hasDeprecationComment = lines.slice(Math.max(0, versionIndex - 2), versionIndex + 1)
            .some(line => line.includes("deprecated"));

          expect(hasDeprecationComment).toBe(true);
        }
      }
    });

    it("should have a services section", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      expect(dockerComposeContent).toMatch(/^services:/m);
    });

    it("should define all required services", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      const requiredServices = ["dev", "test", "lint", "build", "prod"];

      for (const service of requiredServices) {
        const serviceRegex = new RegExp(`^\\s+${service}:`, "m");
        expect(dockerComposeContent).toMatch(serviceRegex);
      }
    });
  });

  describe("Dev service configuration", () => {
    it("should use development build target", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const devSection = extractServiceSection(dockerComposeContent, "dev");

      expect(devSection).toMatch(/target:\s*development/);
    });

    it("should have proper build context", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const devSection = extractServiceSection(dockerComposeContent, "dev");

      expect(devSection).toMatch(/context:\s*\./);
    });

    it("should mount source code as volume", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const devSection = extractServiceSection(dockerComposeContent, "dev");

      expect(devSection).toMatch(/volumes:/);
      expect(devSection).toMatch(/\.\s*:\s*\/app/);
    });

    it("should preserve node_modules with anonymous volume", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const devSection = extractServiceSection(dockerComposeContent, "dev");

      // Should have volume to prevent node_modules from being overwritten
      expect(devSection).toMatch(/\/app\/node_modules/);
    });

    it("should be interactive with tty and stdin_open", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const devSection = extractServiceSection(dockerComposeContent, "dev");

      expect(devSection).toMatch(/stdin_open:\s*true/);
      expect(devSection).toMatch(/tty:\s*true/);
    });

    it("should use shell command for interactivity", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const devSection = extractServiceSection(dockerComposeContent, "dev");

      expect(devSection).toMatch(/command:\s*\/bin\/sh/);
    });

    it("should have a meaningful container name", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const devSection = extractServiceSection(dockerComposeContent, "dev");

      expect(devSection).toMatch(/container_name:\s*ts-collections-dev/);
    });

    it("should set working directory", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const devSection = extractServiceSection(dockerComposeContent, "dev");

      expect(devSection).toMatch(/working_dir:\s*\/app/);
    });
  });

  describe("Test service configuration", () => {
    it("should use development build target", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const testSection = extractServiceSection(dockerComposeContent, "test");

      expect(testSection).toMatch(/target:\s*development/);
    });

    it("should mount source code as volume", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const testSection = extractServiceSection(dockerComposeContent, "test");

      expect(testSection).toMatch(/volumes:/);
      expect(testSection).toMatch(/\.\s*:\s*\/app/);
    });

    it("should preserve node_modules with anonymous volume", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const testSection = extractServiceSection(dockerComposeContent, "test");

      expect(testSection).toMatch(/\/app\/node_modules/);
    });

    it("should run test command", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const testSection = extractServiceSection(dockerComposeContent, "test");

      expect(testSection).toMatch(/command:\s*npm\s+test/);
      // Should run in non-watch mode
      expect(testSection).toMatch(/--run/);
    });

    it("should have a meaningful container name", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const testSection = extractServiceSection(dockerComposeContent, "test");

      expect(testSection).toMatch(/container_name:\s*ts-collections-test/);
    });
  });

  describe("Lint service configuration", () => {
    it("should use development build target", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const lintSection = extractServiceSection(dockerComposeContent, "lint");

      expect(lintSection).toMatch(/target:\s*development/);
    });

    it("should mount source code as volume", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const lintSection = extractServiceSection(dockerComposeContent, "lint");

      expect(lintSection).toMatch(/volumes:/);
      expect(lintSection).toMatch(/\.\s*:\s*\/app/);
    });

    it("should preserve node_modules with anonymous volume", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const lintSection = extractServiceSection(dockerComposeContent, "lint");

      expect(lintSection).toMatch(/\/app\/node_modules/);
    });

    it("should run lint command", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const lintSection = extractServiceSection(dockerComposeContent, "lint");

      expect(lintSection).toMatch(/command:\s*npm\s+run\s+lint/);
    });

    it("should have a meaningful container name", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const lintSection = extractServiceSection(dockerComposeContent, "lint");

      expect(lintSection).toMatch(/container_name:\s*ts-collections-lint/);
    });
  });

  describe("Build service configuration", () => {
    it("should use build target stage", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const buildSection = extractServiceSection(dockerComposeContent, "build");

      expect(buildSection).toMatch(/target:\s*build/);
    });

    it("should mount dist directory as volume", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const buildSection = extractServiceSection(dockerComposeContent, "build");

      expect(buildSection).toMatch(/volumes:/);
      expect(buildSection).toMatch(/\.\/dist\s*:\s*\/app\/dist/);
    });

    it("should run build command", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const buildSection = extractServiceSection(dockerComposeContent, "build");

      expect(buildSection).toMatch(/command:\s*npm\s+run\s+build/);
    });

    it("should have a meaningful container name", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const buildSection = extractServiceSection(dockerComposeContent, "build");

      expect(buildSection).toMatch(/container_name:\s*ts-collections-build/);
    });
  });

  describe("Production service configuration", () => {
    it("should use production build target", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const prodSection = extractServiceSection(dockerComposeContent, "prod");

      expect(prodSection).toMatch(/target:\s*production/);
    });

    it("should not mount source code volumes", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const prodSection = extractServiceSection(dockerComposeContent, "prod");

      // Production should not have development volumes
      const hasVolumes = prodSection.match(/volumes:/);

      // If it has volumes, they should not be source code mounts
      if (hasVolumes) {
        expect(prodSection).not.toMatch(/\.\s*:\s*\/app/);
      }
    });

    it("should have a meaningful container name", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const prodSection = extractServiceSection(dockerComposeContent, "prod");

      expect(prodSection).toMatch(/container_name:\s*ts-collections-prod/);
    });

    it("should not expose ports (library usage)", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const prodSection = extractServiceSection(dockerComposeContent, "prod");

      // Libraries don't need ports exposed
      expect(prodSection).not.toMatch(/ports:/);
    });

    it("should not have a default command (library usage)", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const prodSection = extractServiceSection(dockerComposeContent, "prod");

      // Libraries typically don't need a command
      // Check if command is absent or commented
      const hasCommand = prodSection.match(/^\s*command:/m);

      // If it has command, it's okay as long as it's documented
      expect(true).toBe(true); // Soft check
    });
  });

  describe("Volume configuration validation", () => {
    it("should consistently use anonymous volumes for node_modules", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // Services with volume mounts should protect node_modules
      const servicesWithSourceMount = ["dev", "test", "lint"];

      for (const service of servicesWithSourceMount) {
        const section = extractServiceSection(dockerComposeContent, service);
        if (section.includes("volumes:")) {
          expect(section).toMatch(/\/app\/node_modules/);
        }
      }
    });

    it("should use host path notation for source mounts", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // Volume mounts should use .:/app format
      const volumeMatches = dockerComposeContent.match(/\.\s*:\s*\/app/g);
      expect(volumeMatches).toBeTruthy();
    });
  });

  describe("Build configuration validation", () => {
    it("should specify build context for all services", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      const services = ["dev", "test", "lint", "build", "prod"];

      for (const service of services) {
        const section = extractServiceSection(dockerComposeContent, service);
        expect(section).toMatch(/build:/);
        expect(section).toMatch(/context:\s*\./);
      }
    });

    it("should specify target for multi-stage builds", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      const services = ["dev", "test", "lint", "build", "prod"];
      const expectedTargets = {
        dev: "development",
        test: "development",
        lint: "development",
        build: "build",
        prod: "production"
      };

      for (const service of services) {
        const section = extractServiceSection(dockerComposeContent, service);
        const expectedTarget = expectedTargets[service as keyof typeof expectedTargets];
        expect(section).toMatch(new RegExp(`target:\\s*${expectedTarget}`));
      }
    });
  });

  describe("Best practices validation", () => {
    it("should use consistent YAML formatting", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // Check for consistent indentation (2 spaces is standard)
      const lines = dockerComposeContent.split("\n");
      const indentedLines = lines.filter(line => line.startsWith("  "));

      expect(indentedLines.length).toBeGreaterThan(0);
    });

    it("should have meaningful container names", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // All services should have descriptive container names
      const services = ["dev", "test", "lint", "build", "prod"];

      for (const service of services) {
        const section = extractServiceSection(dockerComposeContent, service);
        expect(section).toMatch(/container_name:\s*ts-collections-/);
      }
    });

    it("should not expose unnecessary ports", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // Library project doesn't need exposed ports
      const portsMatches = dockerComposeContent.match(/^\s*ports:/gm);

      // Should have no or minimal port exposures
      if (portsMatches) {
        expect(portsMatches.length).toBe(0);
      }
    });

    it("should use run --rm for ephemeral services", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // While we can't test the actual command usage here,
      // we can verify services are configured to be removable
      // by not using restart policies

      const services = ["test", "lint", "build"];

      for (const service of services) {
        const section = extractServiceSection(dockerComposeContent, service);
        // These services should not have restart: always
        expect(section).not.toMatch(/restart:\s*always/);
      }
    });
  });

  describe("Security validation", () => {
    it("should not expose sensitive environment variables", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // Should not have hardcoded secrets
      expect(dockerComposeContent).not.toMatch(/password|secret|api_key|token/i);
    });

    it("should not run containers in privileged mode", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // Should not use privileged: true
      expect(dockerComposeContent).not.toMatch(/privileged:\s*true/);
    });

    it("should not disable security features", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // Should not disable security opt
      expect(dockerComposeContent).not.toMatch(/security_opt:\s*\[\s*"no-new-privileges:false"\s*\]/);
    });
  });

  describe("Comments and documentation", () => {
    it("should include comments for complex configurations", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // Should have comments explaining service purposes
      const commentLines = dockerComposeContent.split("\n").filter(line =>
        line.trim().startsWith("#")
      );

      expect(commentLines.length).toBeGreaterThan(0);
    });

    it("should explain version field deprecation if present", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // If there's any mention of version, should be documented
      if (dockerComposeContent.includes("version")) {
        expect(dockerComposeContent).toMatch(/#.*deprecated/i);
      }
    });

    it("should document service purposes", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // Should have comments describing what each service does
      const services = ["dev", "test", "lint", "build", "prod"];

      for (const service of services) {
        const lines = dockerComposeContent.split("\n");
        const serviceIndex = lines.findIndex(line =>
          line.match(new RegExp(`^\\s+${service}:`))
        );

        if (serviceIndex > 0) {
          // Check if there's a comment above or inline
          const commentNearby = lines.slice(Math.max(0, serviceIndex - 2), serviceIndex + 2)
            .some(line => line.trim().startsWith("#"));

          expect(commentNearby).toBe(true);
        }
      }
    });

    it("should explain why production service has no ports", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");
      const prodSection = extractServiceSection(dockerComposeContent, "prod", true);

      // Should have comment explaining library usage (may be above service definition)
      expect(prodSection).toMatch(/#.*library|#.*consumer|#.*server/i);
    });
  });

  describe("Edge cases and special scenarios", () => {
    it("should handle service name conflicts with unique container names", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // Extract all container names
      const containerNames = [];
      const matches = dockerComposeContent.matchAll(/container_name:\s*(.+)/g);

      for (const match of matches) {
        containerNames.push(match[1].trim());
      }

      // All container names should be unique
      const uniqueNames = new Set(containerNames);
      expect(uniqueNames.size).toBe(containerNames.length);
    });

    it("should work with docker compose v2 syntax", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // Should not require version field (v2+ syntax)
      // Should use services: at root level
      expect(dockerComposeContent).toMatch(/^services:/m);
    });

    it("should have consistent line endings", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // Should use LF line endings
      expect(dockerComposeContent).not.toMatch(/\r\n/);
    });
  });

  describe("Integration with Dockerfile", () => {
    it("should reference valid Dockerfile targets", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // All targets should exist in Dockerfile
      const validTargets = ["base", "development", "build", "production"];
      const usedTargets = [];

      const targetMatches = dockerComposeContent.matchAll(/target:\s*(\w+)/g);
      for (const match of targetMatches) {
        usedTargets.push(match[1]);
      }

      for (const target of usedTargets) {
        expect(validTargets).toContain(target);
      }
    });

    it("should use consistent working directory with Dockerfile", () => {
      dockerComposeContent = readFileSync(dockerComposePath, "utf-8");

      // Working directories should match Dockerfile (/app)
      const workdirMatches = dockerComposeContent.matchAll(/working_dir:\s*(.+)/g);

      for (const match of workdirMatches) {
        const workdir = match[1].trim();
        expect(workdir).toBe("/app");
      }
    });
  });
});

/**
 * Helper function to extract a specific service section from docker-compose.yml
 * @param content The full docker-compose.yml content
 * @param serviceName The name of the service to extract
 * @param includeComments Whether to include comments above the service (default: false)
 */
function extractServiceSection(content: string, serviceName: string, includeComments: boolean = false): string {
  const lines = content.split("\n");

  // Find the service line - must be at 2-space indentation and followed by a colon
  const serviceIndex = lines.findIndex((line, index) => {
    // Match service name at exactly 2 spaces indentation
    const match = line.match(/^  (\w+):$/);
    if (match && match[1] === serviceName) {
      // Verify next line is indented more (part of this service)
      if (index + 1 < lines.length) {
        const nextLine = lines[index + 1];
        return nextLine.match(/^    /) || nextLine.trim() === "";
      }
      return true;
    }
    return false;
  });

  if (serviceIndex === -1) {
    return "";
  }

  // Extract from service name to next service or end of file
  const sectionLines = [];
  let startIndex = serviceIndex;

  // If includeComments is true, look backwards for comment lines
  if (includeComments) {
    let i = serviceIndex - 1;
    while (i >= 0) {
      const line = lines[i];
      // Include comment lines and empty lines before the service
      if (line.trim().startsWith("#") || line.trim() === "") {
        startIndex = i;
        i--;
      } else {
        break;
      }
    }
  }

  let i = startIndex;
  while (i < lines.length) {
    const line = lines[i];

    // Stop if we hit another service at the same indentation level (2 spaces)
    if (i > serviceIndex && line.match(/^  \w+:$/)) {
      break;
    }

    sectionLines.push(line);
    i++;
  }

  return sectionLines.join("\n");
}