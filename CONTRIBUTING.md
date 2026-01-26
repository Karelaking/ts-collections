# Contributing to ts-collections

Thank you for your interest in contributing to **ts-collections**! We're excited to have you help make this TypeScript Collections Framework better for everyone.

## 📖 Table of Contents

1. [Introduction](#introduction)
2. [Code of Conduct](#code-of-conduct)
3. [How to Get Started](#how-to-get-started)
4. [Finding Issues to Work On](#finding-issues-to-work-on)
5. [Creating Issues](#creating-issues)
6. [Branching Strategy](#branching-strategy)
7. [Commit Message Guidelines](#commit-message-guidelines)
8. [Pull Request Guidelines](#pull-request-guidelines)
9. [Review Process](#review-process)
10. [Testing Standards](#testing-standards)
11. [Documentation Standards](#documentation-standards)
12. [Security Reporting](#security-reporting)
13. [Community & Communication](#community--communication)
14. [Licensing](#licensing)

---

## 1. 📚 Introduction

### 🏛️ Purpose of the Project

**ts-collections** is a robust, Java-inspired collections framework for TypeScript. It provides developers with powerful, type-safe data structures including lists, sets, maps, and queues—all with compile-time and runtime validation.

### 💝 Why Your Contributions Matter

We believe in the power of community-driven development. Your contributions—whether code, documentation, bug reports, or feature suggestions—help us:
- Improve code quality and reliability
- Expand functionality and usability
- Build a more inclusive and welcoming community
- Create better documentation for all users

### 👥 Who This Guide Is For

This guide is for **everyone** interested in contributing:
- **First-time contributors**: We welcome you! See [Finding Issues to Work On](#finding-issues-to-work-on) for beginner-friendly tasks.
- **Experienced developers**: Feel free to tackle complex features and refactorings.
- **Documentation writers**: Help us improve guides and API documentation.
- **Bug reporters**: Report issues you discover to help us improve.

---

## 2. 🤝 Code of Conduct

### 💪 Our Commitment

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background, identity, or experience level.

### 🚫 Zero-Tolerance Policy

We have **zero tolerance** for:
- Harassment, discrimination, or bullying
- Disrespectful or offensive language
- Exclusionary behavior

**Violations will result in immediate action**, including removal from the project.

If you witness or experience misconduct, please contact the maintainers immediately.

---

## 3. 🚀 How to Get Started

### Step 1️⃣: Fork the Repository

Click the **"Fork"** button on the [ts-collections GitHub repository](https://github.com/Karelaking/ts-collections) to create your own copy.

### Step 2️⃣: Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/ts-collections.git
cd ts-collections
```

### Step 3️⃣: Add Upstream Remote

Keep your fork in sync with the original repository:

```bash
git remote add upstream https://github.com/Karelaking/ts-collections.git
git fetch upstream
```

### Step 4️⃣: Set Up Development Environment

**Requirements:**
- Node.js 18+ or higher
- pnpm 10.18+ (or npm/yarn)
- TypeScript 5.9+

### Step 5️⃣: Install Dependencies

```bash
pnpm install
```

### Step 6️⃣: Run the Project Locally

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run linting
pnpm lint

# Build the project
pnpm build

# Run benchmarks
pnpm bench
```

✅ **All tests should pass** before you start working on a contribution.

---

## 4. 🔍 Finding Issues to Work On

### 🏷️ Issue Labels Explained

| Label | Meaning | Good For |
|-------|---------|----------|
| `good first issue` | Perfect for first-time contributors | Beginners, onboarding |
| `help wanted` | Maintainers need assistance | Anyone, any skill level |
| `bug` | Something isn't working | Bug fixes |
| `feature` | New functionality request | Feature implementations |
| `documentation` | Needs docs or docs improvements | Documentation writers |
| `enhancement` | Improve existing functionality | Refactoring, optimization |
| `discussion` | Needs community input | Design decisions |

### 🌱 For Beginners

Start with issues labeled **`good first issue`** or **`help wanted`**. These are carefully scoped and well-documented.

**Steps:**
1. Find an issue you're interested in on [GitHub Issues](https://github.com/Karelaking/ts-collections/issues)
2. Comment "I'd like to work on this" to claim it
3. Ask questions if anything is unclear
4. Start working! 🚀

### ⭐ For Experienced Contributors

Feel free to:
- Tackle **`feature`** and **`enhancement`** issues
- Refactor and optimize existing code
- Review pull requests from other contributors
- Help answer questions in issues and discussions

---

## 5. ✏️ Creating Issues

### 📝 When to Open an Issue

Open an issue if you've found a **bug**, want to request a **feature**, or have an **idea for improvement**.

### 📋 How to Write a Good Issue

#### 🐛 Bug Report Template

**Title:** `[Bug] Short, descriptive title`

**Description:**
```
## Description
Brief summary of the problem.

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen?

## Actual Behavior
What actually happens?

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Node.js version: [e.g., 18.0.0]
- TypeScript version: [e.g., 5.9]

## Code Example
```typescript
// Minimal code to reproduce the issue
```

## Additional Context
Screenshots, logs, or other relevant information.
```

#### ✨ Feature Request Template

**Title:** `[Feature] Short, descriptive title`

**Description:**
```
## Description
What feature would you like to see?

## Use Case
Why do you need this? What problem does it solve?

## Proposed Solution
How should it work?

## Example
```typescript
// How would users use this?
```

## Alternatives Considered
Other approaches or solutions?
```

### 💡 Pro Tips

✅ **DO:**
- Be clear and concise
- Search for existing issues first (avoid duplicates)
- Include code examples
- Attach screenshots or logs when relevant
- Be constructive and respectful

❌ **DON'T:**
- Use ALL CAPS or excessive punctuation
- Include multiple unrelated issues in one report
- Demand a fix or feature
- Spam or ping maintainers repeatedly

---

## 6. 🌿 Branching Strategy

### 📌 Branch Naming Conventions

Use descriptive branch names following this format:

```
<type>/<description>
```

**Types:**
- `feature/` — New feature
- `fix/` — Bug fix
- `refactor/` — Code refactoring
- `docs/` — Documentation updates
- `test/` — Test additions/improvements
- `chore/` — Maintenance, dependencies, tooling

**Examples:**
- `feature/add-linked-queue`
- `fix/arraylist-bounds-checking`
- `docs/update-api-reference`
- `test/improve-hashmap-coverage`

### 🔄 Keep Your Branch Up to Date

Before submitting a PR, sync with the upstream main branch:

```bash
git fetch upstream
git rebase upstream/master
```

---

## 7. 💬 Commit Message Guidelines

### 🏗️ Format

Use **imperative mood** (as if giving a command):

```
<type>: <subject>

<body>

<footer>
```

### 🏷️ Type

- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `docs:` Documentation updates
- `test:` Test additions/modifications
- `chore:` Build, dependencies, tooling

### 📄 Subject

- Limit to **50 characters**
- Use imperative, present tense ("add", not "added" or "adds")
- Don't capitalize the first letter
- No period at the end

### 📖 Body (Optional)

- Wrap at **72 characters**
- Explain **what** and **why**, not how
- Separate from subject with a blank line

### 🔗 Footer (Optional)

Link to related issues:

```
Fixes #123
Closes #456
Related to #789
```

### 📚 Examples

✅ **Good:**
```
feat: add LinkedQueue collection type

Implement a FIFO queue data structure with O(1) offer and poll operations.
Includes support for the Queue interface with optional validation.

Fixes #45
```

✅ **Good:**
```
fix: prevent ArrayList index out of bounds

Check bounds before accessing elements in get() and set() methods.
```

---

## 8. 🔀 Pull Request Guidelines

### ✅ Before Creating a PR

- [ ] Create a feature branch (see [Branching Strategy](#branching-strategy))
- [ ] Make your changes
- [ ] Write/update tests (see [Testing Standards](#testing-standards))
- [ ] Update documentation if needed
- [ ] Run `pnpm test` and `pnpm lint` locally
- [ ] Ensure all tests pass

### 🔗 Linking Issues

**Always link your PR to related issues:**

In the PR description, use:
```
Fixes #123
Closes #456
Related to #789
```

### 📝 PR Title Convention

Follow this format:

```
<Type>: <Description>
```

**Examples:**
- `Add: LinkedQueue collection type`
- `Fix: ArrayList out of bounds check`
- `Update: API reference documentation`
- `Remove: unused utility functions`

### ⭐ PR Best Practices

✅ **DO:**
- Keep PRs **focused and single-purpose**
- Link to related issues
- Write descriptive PR descriptions
- Update documentation
- Include tests for new features
- Respond promptly to feedback
- Be open to suggestions

❌ **DON'T:**
- Submit large, unfocused PRs
- Forget to add tests
- Ignore review comments
- Push back defensively on feedback
- Include unrelated changes

---

## 9. 👀 Review Process

### 🔎 What Maintainers Look For

During review, we assess:

1. **Correctness**: Does the code work as intended?
2. **Quality**: Is it clean, readable, and maintainable?
3. **Tests**: Are there tests? Do they cover edge cases?
4. **Documentation**: Are changes documented?
5. **Performance**: Does it impact performance negatively?
6. **SOLID Principles**: Does it follow our architecture patterns?
7. **Code Style**: Does it match the project's conventions?

### 💬 Responding to Feedback

**During review, you may receive feedback.** This is normal and valuable!

1. **Read carefully**: Understand the concern
2. **Ask for clarification**: If unclear, ask questions
3. **Make changes**: Address feedback constructively
4. **Respond**: Explain your changes and reasoning
5. **Re-request review**: After addressing feedback

### 🎯 Code Review Etiquette

✅ **DO:**
- Be respectful and professional
- Assume good intent
- Ask questions, don't demand
- Explain your reasoning
- Thank reviewers for their time

---

## 10. 🧪 Testing Standards

### ▶️ Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test ArrayList.test.ts
```

### 📊 Test Coverage Expectation

**We require 100% code coverage for new code.**

If your PR decreases coverage, it will not be accepted.

### ✏️ Writing Tests

Use **Vitest** (our testing framework).

```typescript
import { describe, it, expect } from 'vitest';
import { ArrayList } from '../src';

describe('ArrayList', () => {
  describe('add', () => {
    it('should add element to the list', () => {
      const list = new ArrayList<number>();
      list.add(1);
      expect(list.get(0)).toBe(1);
    });

    it('should throw when adding undefined', () => {
      const list = new ArrayList<string>();
      expect(() => list.add(undefined as any)).toThrow();
    });
  });

  describe('get', () => {
    it('should throw when index is out of bounds', () => {
      const list = new ArrayList<number>();
      expect(() => list.get(0)).toThrow();
    });
  });
});
```

### ✔️ Test Coverage Checklist

For new features/fixes, include tests for:

- ✅ Happy path (normal usage)
- ✅ Edge cases (empty, single element, large dataset)
- ✅ Error conditions (invalid input, out of bounds)
- ✅ Type safety (wrong types)

### 🤖 CI Requirements

All tests must pass in CI before merging:
- ✅ Unit tests (Vitest)
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Code coverage (100%)

---

## 11. 📖 Documentation Standards

### 📅 When to Update Documentation

Update docs when:
- [ ] Adding a new feature
- [ ] Changing existing API
- [ ] Fixing a bug (if docs were misleading)
- [ ] Improving clarity of existing docs

### 📂 Where to Add Documentation

| Type | Location |
|------|----------|
| API reference | Inline JSDoc comments in source files |
| Guides | `wiki/` directory |
| Architecture | `ARCHITECTURE.md` |
| Quick start | `QUICKSTART.md` |

### 💬 JSDoc Comments

```typescript
/**
 * Adds an element to the end of the list.
 *
 * @param element - The element to add
 * @throws Error if element is undefined (strict mode)
 * @example
 * list.add(42);  // O(1) amortized
 */
add(element: E): void {
  // Implementation
}
```

---

## 12. 🔒 Security Reporting

### 🚨 Report Vulnerabilities Responsibly

If you discover a **security vulnerability**, please do **NOT** open a public issue.

Contact maintainers privately with:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

Allow 48 hours for initial response.

---

## 13. 💬 Community & Communication

### ❓ How to Ask Questions

1. **Search first**: Check issues and discussions for existing answers
2. **Use Discussions**: Post questions in [GitHub Discussions](https://github.com/Karelaking/ts-collections/discussions)
3. **Be specific**: Include code examples
4. **Be patient**: Volunteers help when able

### 🤖 Respectful Collaboration

Remember:

- 🤝 We're all volunteers with limited time
- 🙏 Be respectful and grateful
- 💭 Listen to others' perspectives
- 🚀 Focus on shared goals

---

## 14. ⚖️ Licensing

### 📄 Contribution Licensing

When you contribute to ts-collections, you agree that:

1. Your contribution is licensed under the **MIT License**
2. You have the right to license your contribution
3. You grant the project perpetual, worldwide, non-exclusive license to use your work
4. You understand the project may be used for commercial purposes

### ✋ No Copyright Assignment

We **do not** require copyright assignment. You retain copyright to your work.

---

## 🎉 Thank You!

We appreciate your interest in contributing to **ts-collections**. Your efforts help make this project better for everyone!

### ✅ Quick Checklist Before Submitting a PR

- [ ] I've read the Code of Conduct
- [ ] My branch is based on `master`
- [ ] I've run tests locally and they pass
- [ ] I've added tests for my changes
- [ ] I've updated documentation
- [ ] My commit messages follow the guidelines
- [ ] My PR title follows the convention
- [ ] I've linked related issues

### 🎨 Need Help?

- 📖 Read the [README](README.md)
- 📚 Check the [API Reference](wiki/API-Reference)
- 💬 Ask in [Discussions](https://github.com/Karelaking/ts-collections/discussions)
- 🐛 Report a bug in [Issues](https://github.com/Karelaking/ts-collections/issues)

---

**Happy contributing!** 🚀

*Last updated: January 2026*
