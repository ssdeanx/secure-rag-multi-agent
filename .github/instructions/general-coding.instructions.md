---
applyTo: ["**/*.ts,**/*.tsx"]
---
# Project coding standards for TypeScript and React

Apply the general coding guidelines to all code.

## TypeScript Guidelines
- Use TypeScript for all new code
- Follow functional programming principles where possible
- Use interfaces for data structures and type definitions
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
