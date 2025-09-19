# Mastra Governed RAG: Testing Guide

This guide outlines the testing strategy and procedures for the project.

## 1. Testing Framework

- **Vitest** is the primary testing framework, as configured in `vitest.config.ts`.
- Tests are co-located with the source code they are testing, or placed in a `__tests__` directory.
- The `package.json` currently has a placeholder `test` script. This should be updated.

## 2. How to Run Tests

To run the test suite, use the following command:

```bash
npm test
```

*(Note: The `test` script in `package.json` needs to be updated to `vitest run` or a similar command.)*

## 3. What to Test

- **Unit Tests:**
    - **Services (`src/mastra/services/`):** Business logic within services, like the role expansion logic in `RoleService.ts`, should be unit tested.
    - **Utilities (`lib/`):** Helper functions, such as the JWT generation in `jwt-utils.ts`, are prime candidates for unit tests.
    - **Components (`components/`, `cedar/`):** Test component rendering and basic interactions.

- **Integration Tests:**
    - **Mastra Workflows (`src/mastra/workflows/`):** The primary focus for integration testing. A test should trigger a workflow and mock its external dependencies (like OpenAI and Qdrant) to verify that the agents and tools are orchestrated correctly.
    - **API Routes (`app/api/`):** Test the API endpoints to ensure they handle requests, authentication, and errors correctly.

## 4. Writing New Tests

- Create test files with a `.test.ts` or `.spec.ts` extension.
- Use the `describe`, `it`, and `expect` functions from Vitest.
- Mock dependencies to isolate the code under test. Vitest provides mocking capabilities via `vi.mock()`.

**Example (Conceptual Test for a Service):**

```typescript
// src/mastra/services/RoleService.test.ts

import { describe, it, expect } from 'vitest';
import { RoleService } from './RoleService';

describe('RoleService', () => {
  it('should expand roles correctly based on hierarchy', () => {
    const userRoles = ['finance.viewer'];
    const expectedExpandedRoles = ['finance.viewer', 'employee', 'public']; // Assuming this hierarchy

    const expandedRoles = RoleService.expandRoles(userRoles);

    // Use a set for order-independent comparison
    expect(new Set(expandedRoles)).toEqual(new Set(expectedExpandedRoles));
  });
});
```
