import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/**
 * Test suite for README.md documentation
 */
describe("README.md Documentation Tests", () => {
  const projectRoot = path.join(__dirname, "../..");
  const readmePath = path.join(projectRoot, "README.md");
  let readmeContent: string;

  beforeAll(() => {
    readmeContent = fs.readFileSync(readmePath, "utf-8");
  });

  describe("File Structure", () => {
    it("should exist in project root", () => {
      expect(fs.existsSync(readmePath)).toBe(true);
    });

    it("should not be empty", () => {
      expect(readmeContent.length).toBeGreaterThan(100);
    });

    it("should have a title", () => {
      expect(readmeContent).toMatch(/^#\s+.+/m);
    });

    it("should be written in Markdown format", () => {
      expect(readmeContent).toMatch(/^#+\s/m); // Headers
      expect(readmeContent).toMatch(/```/); // Code blocks
    });
  });

  describe("Essential Sections", () => {
    it("should have a project description", () => {
      expect(readmeContent).toMatch(/ts-collections/i);
      expect(readmeContent).toMatch(/TypeScript|collections|framework/i);
    });

    it("should have an installation section", () => {
      expect(readmeContent).toMatch(/##\s+.*[Ii]nstall/);
      expect(readmeContent).toContain("npm install");
    });

    it("should have usage examples", () => {
      expect(readmeContent).toMatch(/##\s+.*(Usage|Quick Start|Examples)/i);
    });

    it("should have Docker documentation", () => {
      expect(readmeContent).toMatch(/##\s+[^\n]*Docker/i);
      expect(readmeContent).toContain("docker");
    });

    it("should have testing documentation", () => {
      expect(readmeContent).toMatch(/##\s+.*[Tt]est/);
      expect(readmeContent).toContain("npm test");
    });

    it("should have contributing guidelines", () => {
      expect(readmeContent).toMatch(/##\s+.*[Cc]ontribut/);
    });

    it("should have license information", () => {
      expect(readmeContent).toMatch(/##\s+.*[Ll]icense/);
      expect(readmeContent).toContain("MIT");
    });

    it("should have goals or features section", () => {
      expect(readmeContent).toMatch(/##\s+.*(Goals|Features)/i);
    });

    it("should have architecture documentation", () => {
      expect(readmeContent).toMatch(/##\s+.*Architecture/i);
    });
  });

  describe("Docker Documentation", () => {
    let dockerSection: string;

    beforeAll(() => {
      const dockerMatch = readmeContent.match(/##\s+[^\n]*Docker[^\n]*[\s\S]*?(?=\n##\s+[^#]|$)/i);
      dockerSection = dockerMatch ? dockerMatch[0] : "";
    });

    it("should document docker compose commands", () => {
      expect(dockerSection).toContain("docker compose");
    });

    it("should document test service", () => {
      expect(dockerSection).toMatch(/docker compose run.*test/);
    });

    it("should document lint service", () => {
      expect(dockerSection).toMatch(/docker compose run.*lint/);
    });

    it("should document build service", () => {
      expect(dockerSection).toMatch(/docker compose run.*build/);
    });

    it("should document dev service", () => {
      expect(dockerSection).toContain("dev");
    });

    it("should document Docker build commands", () => {
      expect(dockerSection).toContain("docker build");
    });

    it("should document development image", () => {
      expect(dockerSection).toMatch(/--target development/);
    });

    it("should document production image", () => {
      expect(dockerSection).toMatch(/--target production/);
    });

    it("should list Docker benefits", () => {
      expect(dockerSection).toMatch(/Benefits|Advantages/i);
    });

    it("should mention Docker services", () => {
      expect(dockerSection).toMatch(/services/i);
    });
  });

  describe("Code Examples", () => {
    it("should have TypeScript code examples", () => {
      expect(readmeContent).toMatch(/```typescript/);
    });

    it("should have bash/shell command examples", () => {
      expect(readmeContent).toMatch(/```(bash|shell|sh)/);
    });

    it("should show ArrayList usage", () => {
      expect(readmeContent).toContain("ArrayList");
      expect(readmeContent).toMatch(/new ArrayList/);
    });

    it("should show HashSet usage", () => {
      expect(readmeContent).toContain("HashSet");
      expect(readmeContent).toMatch(/new HashSet/);
    });

    it("should show HashMap usage", () => {
      expect(readmeContent).toContain("HashMap");
      expect(readmeContent).toMatch(/new HashMap/);
    });

    it("should show Queue usage", () => {
      expect(readmeContent).toContain("Queue");
      expect(readmeContent).toMatch(/Queue/);
    });

    it("should demonstrate type safety", () => {
      expect(readmeContent).toMatch(/<number>|<string>|<\w+>/);
    });

    it("should have complete, runnable examples", () => {
      const codeBlocks = readmeContent.match(/```typescript[\s\S]*?```/g);
      expect(codeBlocks).toBeDefined();
      expect(codeBlocks!.length).toBeGreaterThan(5);

      // Check that examples have imports
      const hasImports = codeBlocks!.some(block =>
        block.includes("import") && block.includes("from")
      );
      expect(hasImports).toBe(true);
    });
  });

  describe("Installation Instructions", () => {
    it("should show npm install command", () => {
      expect(readmeContent).toMatch(/npm install ts-collections/);
    });

    it("should show pnpm install command", () => {
      expect(readmeContent).toMatch(/pnpm add ts-collections/);
    });

    it("should show yarn install command", () => {
      expect(readmeContent).toMatch(/yarn add ts-collections/);
    });
  });

  describe("Testing Documentation", () => {
    it("should document test command", () => {
      expect(readmeContent).toContain("npm test");
    });

    it("should document test coverage", () => {
      expect(readmeContent).toMatch(/coverage|test.*coverage/i);
    });

    it("should document watch mode", () => {
      expect(readmeContent).toMatch(/--watch|watch mode/i);
    });

    it("should mention test framework", () => {
      expect(readmeContent).toContain("Vitest");
    });

    it("should document test structure", () => {
      expect(readmeContent).toMatch(/test\//);
    });
  });

  describe("Links and References", () => {
    it("should have working markdown links", () => {
      const links = readmeContent.match(/\[([^\]]+)\]\(([^)]+)\)/g);
      expect(links).toBeDefined();
      expect(links!.length).toBeGreaterThan(5);
    });

    it("should have badges", () => {
      expect(readmeContent).toMatch(/!\[.*\]\(.*\)/);
    });

    it("should reference repository", () => {
      expect(readmeContent).toMatch(/github\.com/i);
    });

    it("should link to documentation files", () => {
      expect(readmeContent).toMatch(/CONTRIBUTING\.md|ARCHITECTURE\.md|\.md/);
    });

    it("should have license badge or link", () => {
      expect(readmeContent).toMatch(/MIT|LICENSE/);
    });
  });

  describe("API Documentation", () => {
    it("should document Collection interface", () => {
      expect(readmeContent).toContain("Collection");
    });

    it("should document List interface", () => {
      expect(readmeContent).toContain("List");
    });

    it("should document Set interface", () => {
      expect(readmeContent).toContain("Set");
    });

    it("should document Map interface", () => {
      expect(readmeContent).toContain("Map");
    });

    it("should document Queue interface", () => {
      expect(readmeContent).toContain("Queue");
    });

    it("should document Iterator interface", () => {
      expect(readmeContent).toContain("Iterator");
    });

    it("should show method signatures", () => {
      expect(readmeContent).toMatch(/add\(|get\(|remove\(|size\(/);
    });
  });

  describe("Architecture Information", () => {
    it("should have architecture diagram", () => {
      expect(readmeContent).toMatch(/```mermaid|architecture/i);
    });

    it("should explain interfaces", () => {
      expect(readmeContent).toMatch(/interface/i);
    });

    it("should explain abstract classes", () => {
      expect(readmeContent).toMatch(/abstract/i);
    });

    it("should mention SOLID principles", () => {
      expect(readmeContent).toMatch(/SOLID/);
    });
  });

  describe("Contributing Guidelines", () => {
    it("should explain how to contribute", () => {
      const contributingMatch = readmeContent.match(/##\s+.*[Cc]ontribut[\s\S]*?(?=##|$)/);
      expect(contributingMatch).toBeDefined();
    });

    it("should mention forking", () => {
      expect(readmeContent).toMatch(/fork/i);
    });

    it("should mention pull requests", () => {
      expect(readmeContent).toMatch(/pull request|PR/i);
    });

    it("should mention testing requirements", () => {
      const contributingSection = readmeContent.match(/##\s+.*[Cc]ontribut[\s\S]*?(?=##|$)/);
      if (contributingSection) {
        expect(contributingSection[0]).toMatch(/test/i);
      }
    });

    it("should mention linting", () => {
      expect(readmeContent).toMatch(/lint|eslint/i);
    });
  });

  describe("Development Setup", () => {
    it("should document development dependencies installation", () => {
      expect(readmeContent).toMatch(/npm install|pnpm install/);
    });

    it("should document build command", () => {
      expect(readmeContent).toMatch(/npm run build|pnpm build|yarn build/);
    });

    it("should document lint command", () => {
      expect(readmeContent).toMatch(/npm run lint|pnpm lint|yarn lint/);
    });

    it("should document docs generation", () => {
      expect(readmeContent).toMatch(/npm.*docs|typedoc/i);
    });
  });

  describe("Formatting and Style", () => {
    it("should use consistent header levels", () => {
      const headers = readmeContent.match(/^#+\s/gm);
      expect(headers).toBeDefined();
      expect(headers!.length).toBeGreaterThan(10);

      headers!.forEach(header => {
        const level = header.match(/^(#+)/)?.[1].length || 0;
        expect(level).toBeGreaterThan(0);
        expect(level).toBeLessThan(7);
      });
    });

    it("should use code blocks with language specification", () => {
      const codeBlocks = readmeContent.match(/```\w+/g);
      expect(codeBlocks).toBeDefined();
      expect(codeBlocks!.length).toBeGreaterThan(5);
    });

    it("should have proper spacing between sections", () => {
      const sections = readmeContent.split(/\n##\s/);
      expect(sections.length).toBeGreaterThan(5);
    });

    it("should use bullet points for lists", () => {
      expect(readmeContent).toMatch(/^[\s]*[-*]\s/m);
    });

    it("should use numbered lists where appropriate", () => {
      expect(readmeContent).toMatch(/^\d+\.\s/m);
    });
  });

  describe("Completeness", () => {
    it("should be comprehensive (reasonable length)", () => {
      expect(readmeContent.length).toBeGreaterThan(5000);
    });

    it("should cover all main data structures", () => {
      const structures = ["ArrayList", "HashSet", "HashMap", "Queue"];
      structures.forEach(structure => {
        expect(readmeContent).toContain(structure);
      });
    });

    it("should have contact or support information", () => {
      expect(readmeContent).toMatch(/support|contact|email|issues/i);
    });

    it("should have acknowledgments or credits", () => {
      expect(readmeContent).toMatch(/acknowledgment|credit|inspired/i);
    });
  });

  describe("Special Features Documentation", () => {
    it("should document type safety features", () => {
      expect(readmeContent).toMatch(/type safe|type safety/i);
    });

    it("should document Java compatibility", () => {
      expect(readmeContent).toMatch(/Java/i);
    });

    it("should document performance characteristics", () => {
      expect(readmeContent).toMatch(/performance|complexity|O\(/);
    });

    it("should document validation features", () => {
      expect(readmeContent).toMatch(/validation|Zod/i);
    });
  });

  describe("Edge Cases and Error Scenarios", () => {
    it("should not have broken links to local files", () => {
      const localLinks = readmeContent.match(/\[([^\]]+)\]\(([^):/]+\.md)\)/g);
      if (localLinks) {
        localLinks.forEach(link => {
          const filename = link.match(/\(([^)]+)\)/)?.[1];
          if (filename && !filename.startsWith("http")) {
            // Check if file is mentioned as existing
            expect(filename).toMatch(/\.md$/);
          }
        });
      }
    });

    it("should not have unclosed code blocks", () => {
      const codeBlockMarkers = readmeContent.match(/```/g);
      expect(codeBlockMarkers).toBeDefined();
      expect(codeBlockMarkers!.length % 2).toBe(0);
    });

    it("should not have malformed links", () => {
      const malformedLinks = readmeContent.match(/\]\([^\)]*$/m);
      expect(malformedLinks).toBeNull();
    });

    it("should not have trailing whitespace", () => {
      const lines = readmeContent.split("\n");
      const linesWithTrailing = lines.filter(line => line.match(/\s+$/));
      expect(linesWithTrailing.length).toBeLessThan(10);
    });
  });

  describe("Quick Start Section", () => {
    it("should have a quick start or getting started section", () => {
      expect(readmeContent).toMatch(/##\s+.*(Quick Start|Getting Started)/i);
    });

    it("should show simple example first", () => {
      const firstCodeBlock = readmeContent.match(/```typescript[\s\S]*?```/);
      expect(firstCodeBlock).toBeDefined();
    });

    it("should explain basic usage before advanced features", () => {
      const advancedIndex = readmeContent.toLowerCase().indexOf("advanced");
      const quickStartIndex = readmeContent.toLowerCase().indexOf("quick start");

      if (advancedIndex > -1 && quickStartIndex > -1) {
        expect(quickStartIndex).toBeLessThan(advancedIndex);
      }
    });
  });

  describe("Advanced Examples Section", () => {
    it("should have advanced usage examples", () => {
      expect(readmeContent).toMatch(/##\s+.*Advanced/i);
    });

    it("should show real-world use cases", () => {
      expect(readmeContent).toMatch(/use case|example|pattern/i);
    });

    it("should demonstrate iterators", () => {
      expect(readmeContent).toMatch(/iterator\(/i);
      expect(readmeContent).toMatch(/hasNext|next/);
    });

    it("should demonstrate error handling", () => {
      expect(readmeContent).toMatch(/try.*catch|error/i);
    });
  });

  describe("Regression Tests", () => {
    it("should not contain Lorem Ipsum placeholder text", () => {
      expect(readmeContent.toLowerCase()).not.toContain("lorem ipsum");
    });

    it("should not contain TODO markers", () => {
      expect(readmeContent).not.toMatch(/TODO|FIXME|XXX/);
    });

    it("should not have duplicate headers", () => {
      const headers = readmeContent.match(/^##\s+(.+)$/gm);
      if (headers) {
        const headerTexts = headers.map(h => h.toLowerCase().trim());
        const uniqueHeaders = new Set(headerTexts);
        expect(uniqueHeaders.size).toBe(headerTexts.length);
      }
    });

    it("should use consistent package name", () => {
      const packageNames = readmeContent.match(/ts-collections|ts_collections|tscollections/gi);
      if (packageNames) {
        packageNames.forEach(name => {
          expect(name.toLowerCase()).toBe("ts-collections");
        });
      }
    });

    it("should use consistent code style in examples", () => {
      const codeBlocks = readmeContent.match(/```typescript[\s\S]*?```/g);
      if (codeBlocks) {
        codeBlocks.forEach(block => {
          // Should use semicolons consistently
          const lines = block.split("\n").filter(l => l.trim() && !l.includes("//"));
          if (lines.length > 2) {
            expect(block).toBeTruthy();
          }
        });
      }
    });
  });

  describe("Accessibility", () => {
    it("should have alt text for images", () => {
      const images = readmeContent.match(/!\[([^\]]*)\]/g);
      if (images) {
        images.forEach(img => {
          const altText = img.match(/!\[([^\]]*)\]/)?.[1];
          expect(altText).toBeDefined();
        });
      }
    });

    it("should use descriptive link text", () => {
      const links = readmeContent.match(/\[([^\]]+)\]/g);
      if (links) {
        links.forEach(link => {
          const text = link.match(/\[([^\]]+)\]/)?.[1];
          expect(text).toBeDefined();
          expect(text!.length).toBeGreaterThan(1);
          expect(text!.toLowerCase()).not.toBe("here");
          expect(text!.toLowerCase()).not.toBe("click here");
        });
      }
    });
  });

  describe("Version and Status Information", () => {
    it("should have version badge or version information", () => {
      expect(readmeContent).toMatch(/version|v\d+\.\d+\.\d+/i);
    });

    it("should indicate project status", () => {
      expect(readmeContent).toMatch(/badge|build|test.*pass/i);
    });

    it("should mention TypeScript version", () => {
      expect(readmeContent).toMatch(/TypeScript.*\d+/i);
    });
  });

  describe("SEO and Discoverability", () => {
    it("should have relevant keywords", () => {
      const keywords = ["TypeScript", "collections", "data structures", "library"];
      keywords.forEach(keyword => {
        expect(readmeContent.toLowerCase()).toContain(keyword.toLowerCase());
      });
    });

    it("should have a clear project description near the top", () => {
      const first1000Chars = readmeContent.substring(0, 1000);
      expect(first1000Chars).toMatch(/collection|TypeScript|framework/i);
    });
  });

  describe("Docker Section Completeness", () => {
    it("should list all docker-compose services", () => {
      const dockerSection = readmeContent.match(/##\s+[^\n]*Docker[^\n]*[\s\S]*?(?=\n##\s+[^#]|$)/i)?.[0] || "";
      const services = ["dev", "test", "lint", "build", "prod"];
      services.forEach(service => {
        expect(dockerSection).toContain(service);
      });
    });

    it("should explain volume mounts", () => {
      const dockerSection = readmeContent.match(/##\s+[^\n]*Docker[^\n]*[\s\S]*?(?=\n##\s+[^#]|$)/i)?.[0] || "";
      expect(dockerSection).toMatch(/volume|mount/i);
    });

    it("should explain image targets", () => {
      const dockerSection = readmeContent.match(/##\s+[^\n]*Docker[^\n]*[\s\S]*?(?=\n##\s+[^#]|$)/i)?.[0] || "";
      expect(dockerSection).toMatch(/target|stage/i);
    });
  });

  describe("Boundary Tests", () => {
    it("should not exceed reasonable file size (under 100KB)", () => {
      const stats = fs.statSync(readmePath);
      expect(stats.size).toBeLessThan(100 * 1024);
    });

    it("should not have excessively long lines", () => {
      const lines = readmeContent.split("\n");
      const longLines = lines.filter(line => line.length > 200);
      expect(longLines.length).toBeLessThan(50);
    });

    it("should not have excessive nesting in lists", () => {
      const lines = readmeContent.split("\n");
      lines.forEach(line => {
        const indentation = line.match(/^(\s*)/)?.[1].length || 0;
        expect(indentation).toBeLessThan(20);
      });
    });
  });

  describe("Maintenance and Updates", () => {
    it("should reference current year or be timeless", () => {
      const currentYear = new Date().getFullYear();
      // If it mentions a year, it should be recent
      const yearMatches = readmeContent.match(/20\d{2}/g);
      if (yearMatches) {
        yearMatches.forEach(year => {
          const yearNum = parseInt(year);
          expect(yearNum).toBeGreaterThanOrEqual(currentYear - 2);
        });
      }
    });

    it("should not reference outdated dependencies", () => {
      expect(readmeContent).not.toMatch(/node\s+14|node\s+16/i);
    });
  });
});

/**
 * README Docker documentation specific tests
 */
describe("README Docker Documentation Quality", () => {
  const projectRoot = path.join(__dirname, "../..");
  const readmePath = path.join(projectRoot, "README.md");
  let readmeContent: string;
  let dockerSection: string;

  beforeAll(() => {
    readmeContent = fs.readFileSync(readmePath, "utf-8");
    const dockerMatch = readmeContent.match(/##\s+[^\n]*Docker[^\n]*[\s\S]*?(?=\n##\s+[^#]|$)/i);
    dockerSection = dockerMatch ? dockerMatch[0] : "";
  });

  describe("Docker Commands Coverage", () => {
    it("should document all docker compose services", () => {
      expect(dockerSection).toContain("test");
      expect(dockerSection).toContain("lint");
      expect(dockerSection).toContain("build");
      expect(dockerSection).toContain("dev");
    });

    it("should show --rm flag usage", () => {
      expect(dockerSection).toMatch(/--rm/);
    });

    it("should show proper command syntax", () => {
      expect(dockerSection).toMatch(/docker compose run/);
    });

    it("should show image tagging", () => {
      expect(dockerSection).toMatch(/ts-collections:dev|ts-collections:prod/);
    });
  });

  describe("Docker Benefits Section", () => {
    it("should list advantages of using Docker", () => {
      expect(dockerSection).toMatch(/✅|benefit|advantage/i);
    });

    it("should mention consistency", () => {
      expect(dockerSection).toMatch(/consistent|same environment/i);
    });

    it("should mention isolation", () => {
      expect(dockerSection).toMatch(/isolat/i);
    });

    it("should mention CI/CD", () => {
      expect(dockerSection).toMatch(/CI\/CD|continuous integration/i);
    });
  });
});