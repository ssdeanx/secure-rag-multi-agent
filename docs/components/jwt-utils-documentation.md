---
title: JWT Utilities - Technical Documentation
component_path: `lib/jwt-utils.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Frontend / Auth
tags: [jwt, utilities, tokens, authentication, documentation]
---

# JWT Utilities Documentation

Utility functions for JWT token generation and demo token management. Provides secure token creation for development and testing purposes.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide JWT token generation utilities for development and testing.

- OVR-002: Scope includes token signing with HS256, demo token presets, and claim management. It deliberately excludes token verification (handled by backend services).

- OVR-003: Context: Used in development environments and demo scenarios to generate valid JWT tokens with predefined user roles.

## 2. Architecture Section

- ARC-001: Design patterns: Utility module with async token generation.

- ARC-002: Dependencies:
    - `jose`: JWT signing and verification library

- ARC-003: Interactions: Generates signed JWTs using environment secrets. No external service calls.

- ARC-004: Visual/behavioral decisions: 2-hour token expiration, HS256 algorithm, predefined demo user profiles.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "JWT Utils Module"
        JU[jwt-utils.ts] --> GDT[generateDemoToken]
        JU --> DT[DEMO_TOKENS]
    end

    subgraph "Dependencies"
        JU --> J[jose]
    end

    classDiagram
        class JwtUtils {
            +generateDemoToken(claims: TokenClaims): Promise<string>
            +DEMO_TOKENS: Record<string, () => Promise<string>>
        }
```

## 3. Interface Documentation

- INT-001: Token generation function and demo token presets.

| Export              | Purpose                | Parameters            | Return Type                             | Usage Notes                         |
| ------------------- | ---------------------- | --------------------- | --------------------------------------- | ----------------------------------- |
| `generateDemoToken` | Generate signed JWT    | `claims: TokenClaims` | `Promise<string>`                       | Creates HS256 signed token          |
| `DEMO_TOKENS`       | Predefined demo tokens | none                  | `Record<string, () => Promise<string>>` | Finance, HR, engineering, executive |

### TokenClaims Interface

```ts
interface TokenClaims {
    sub: string // Subject (user identifier)
    roles: string[] // User roles
    tenant: string // Tenant identifier
    stepUp?: boolean // Optional step-up authentication flag
}
```

### DEMO_TOKENS Structure

```ts
{
  finance: () => Promise<string>,     // finance.viewer role
  engineering: () => Promise<string>, // engineering.admin role
  hr: () => Promise<string>,          // hr.admin + stepUp
  executive: () => Promise<string>    // Multiple admin roles
}
```

## 4. Implementation Details

- IMP-001: Uses jose library for secure JWT signing with HS256.
- IMP-002: Tokens expire in 2 hours from issuance.
- IMP-003: Secret sourced from environment variables with dev fallback.
- IMP-004: Demo tokens provide realistic user profiles for testing.

Corner cases and considerations:

- Environment secret fallback to 'dev-secret' for development.
- Automatic iat and exp claim injection.
- Async token generation for cryptographic operations.

## 5. Usage Examples

### Generating custom token

```ts
import { generateDemoToken } from '@/lib/jwt-utils'

const token = await generateDemoToken({
    sub: 'user@acme.com',
    roles: ['employee'],
    tenant: 'acme',
    stepUp: false,
})
```

### Using demo tokens

```ts
import { DEMO_TOKENS } from '@/lib/jwt-utils'

// Get HR admin token with step-up
const hrToken = await DEMO_TOKENS.hr()

// Use in API calls
const response = await fetch('/api/chat', {
    headers: { Authorization: `Bearer ${hrToken}` },
})
```

### Environment setup

```bash
# Required for production
JWT_SECRET=your-secure-secret-here

# Optional (falls back to JWT_SECRET)
NEXT_PUBLIC_JWT_SECRET=dev-secret
```

## 6. Quality Attributes

- QUA-001 Security: HS256 signing, environment-based secrets, short expiration.
- QUA-002 Performance: Async crypto operations, lightweight.
- QUA-003 Reliability: jose library handles edge cases, proper error propagation.
- QUA-004 Maintainability: Clear demo profiles, configurable secrets.
- QUA-005 Extensibility: Easy to add new demo token profiles.

## 7. Reference Information

- REF-001: Dependencies (approximate):
    - jose (^4.0.0)

- REF-002: Configuration
    - JWT_SECRET or NEXT_PUBLIC_JWT_SECRET environment variables

- REF-003: Testing guidelines
    - Test token generation and verification.
    - Validate demo token claims.

- REF-004: Troubleshooting
    - Invalid tokens may indicate secret mismatch.
    - Expiration errors suggest time sync issues.

- REF-005: Related docs
    - Authentication service documentation
    - JWT auth tool documentation

- REF-006: Change history
    - 1.0 (2025-09-23) - Initial documentation generated
