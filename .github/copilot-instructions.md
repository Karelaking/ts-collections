---
applyTo: "**"
---

# Project general coding standards
- Follow consistent naming conventions: use camelCase for variables and functions, PascalCase for classes and interfaces, and UPPER_SNAKE_CASE for constants.
- Write clear and concise comments to explain complex logic and decisions in the code.
- Ensure proper error handling: always handle potential errors gracefully and provide meaningful error messages.
- Adhere to DRY (Don't Repeat Yourself) principles: avoid code duplication by creating reusable functions or modules.
- Maintain code readability: use consistent indentation, spacing, and line breaks to enhance the readability of the codebase.
- Write unit tests for new features and bug fixes to ensure code reliability and facilitate future maintenance.
- Follow version control best practices: write descriptive commit messages and create branches for new features or bug fixes.
- Regularly review and refactor code to improve performance, readability, and maintainability.
- Stay updated with the latest language features and best practices to continuously improve code quality.
- follow the test driven development (TDD) approach when adding new features or fixing bugs.
- Ensure compatibility with existing code and libraries when integrating new features or making changes.
- to not make such changes that would break backward compatibility unless absolutely necessary or if needed make deprecated warnings first.
- Prioritize performance optimization: identify and address performance bottlenecks in the codebase.
- Use SOLID principles to guide object-oriented design and architecture decisions.
- Generate code optimized for type script and javascript environments.

# Specific instructions for TypeScript files
- Use strict typing wherever possible to leverage TypeScript's type safety features.
- Define interfaces for complex data structures to ensure consistent usage across the codebase.
- Utilize TypeScript's advanced features like generics, union types, and intersection types to create flexible and reusable components.
- Avoid using the `any` type; prefer more specific types to maintain type safety.

# Naming Conventions
- For collection classes, use names that clearly indicate their purpose.
- For methods that modify collections, use verbs that describe the action.
- For properties that represent the state of a collection, use nouns that describe the data.
- When creating utility functions, use descriptive names that indicate their functionality.
- Follow consistent naming conventions for files and directories, using kebab-case for file names and PascalCase for directory names.

# File Organization
- Organize files into directories based on their functionality.
- Group related classes, interfaces, and functions together in the same file when appropriate.
- Use index.ts files to re-export modules for easier imports.
- Maintain a clear and logical project structure to facilitate navigation and understanding of the codebase.

# Documentation
- Maintain up-to-date documentation for all public APIs, including usage examples.
- Use JSDoc comments to document functions, classes, and interfaces.

# Testing
- Write comprehensive unit tests for all public methods and functions.
- Use a consistent testing framework and follow best practices for writing tests.
- Ensure tests cover edge cases and potential error scenarios.
- Maintain a high test coverage percentage to ensure code reliability.

# Code Reviews
- Participate in code reviews to ensure code quality and share knowledge among team members.
- Provide constructive feedback and suggestions for improvement during code reviews.
- Address feedback from code reviews promptly and thoroughly.

# Test Driven Development (TDD)
- Write tests before implementing new features or fixing bugs.
- Ensure that all tests pass before considering a feature or bug fix complete.
- Refactor code as needed to improve design and maintainability while ensuring all tests continue to pass.

