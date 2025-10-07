---
applyTo: ['**/*.ts', '**/*.tsx']
description: 'General coding standards for TypeScript and React code.'
tags: ['typescript', 'react', 'coding-standards']
version: '1.0.0'
last_updated: '2025-09-24T19:13:49Z'
status: 'stable'
---

# Project OverviewCoding Standards for TypeScript and React

## Introduction

Apply the general coding guidelines to all code.

## TypeScript Guidelines

- Use TypeScript for all new code
- Follow functional programming principles where possible
- Use interfaces or types for data structures and type definitions
- Prefer immutable data (const, readonly)
- Use optional chaining (?.) and nullish coalescing (??) operators
- Avoid using `any` type; prefer specific types or generics
- Use type guards and assertions to ensure type safety
- Use async/await for asynchronous code
- Handle errors with try/catch blocks or Promise.catch
- Use ESLint and Prettier for code formatting and linting

## React Guidelines

- Use functional components with hooks
- Follow the React hooks rules (no conditional hooks)
- Use React.FC type for components with children
- Keep components small and focused
- Use CSS modules for component styling
- Use prop-types for runtime type checking of props
- Use React context for global state management
- Use React Router for navigation and routing

## General Best Practices

- Write clear, descriptive comments and JSDoc for functions and classes
- Use meaningful variable and function names
- Adhere to the DRY (Don't Repeat Yourself) principle
- Adhere to SOLID principles for object-oriented design
- ALWAYS use `get_errors` or `get_error` for linting also make sure you use `#problem` for any issues
- Always import only what you need from libraries (tree-shaking)
- Always use `kebab-case` for file names and `camelCase` for variables and functions.
- Also always make sure you implement any unused imports or variables
    - Make sure they are fully implemented and used in the code.
- Never leave stubs, mock implementations or silent failures in the code.
    - Always implement the full functionality or remove the stub/mock.
    - If a feature is not yet implemented, #TODO or #FIXME or `@copilot` tags should be used to indicate that it needs attention.
- Try to avoid using `any` type in TypeScript, unless it is absolutely necessary.
    - Always strive to use specific types or interfaces to ensure type safety and maintainability.
    - If `any` is unavoidable, add a comment explaining why it's necessary and what type it should ideally be. Plus, add a `#TODO` or `#FIXME` tag to indicate that it should be revisited later.
