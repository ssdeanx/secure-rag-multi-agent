---
title: AgentSchemas - Technical Documentation
component_path: `src/mastra/schemas/agent-schemas.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra Schemas / Backend
tags: [schemas, zod, agents, validation, documentation]
---

# AgentSchemas Documentation

Zod schema definitions for Mastra agent inputs/outputs, including JWT claims, access filters, document contexts, RAG answers, and verification results. Ensures type-safe data flow in workflows.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Validate and type agent-related data structures.

- OVR-002: Scope: 5 Zod objects for auth, filtering, contexts, answers, verification. Excludes workflow logic.

- OVR-003: Context: Used in governedRagAnswer workflow for step I/O validation.

## 2. Architecture Section

- ARC-001: Design patterns: Schema centralization for domain validation.

- ARC-002: Dependencies: zod (schemas)

- ARC-003: Interactions: Parsed in workflow steps; infer types via z.infer.

- ARC-004: Nested: Answers include citations array; contexts have tags/classification.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    AS[AgentSchemas] --> JCS[jwtClaimsSchema]
    AS --> AFS[accessFilterSchema]
    AS --> DCS[documentContextSchema]
    AS --> RAS[ragAnswerSchema]
    AS --> VRS[verificationResultSchema]

    subgraph "Nested"
        RAS --> CS[Citations: {docId, source}]
        DCS --> ST[securityTags: string[]]
        VRS --> AR[answer: string | {text, citations}]
    end

    subgraph "External"
        Z[zod] --> AS
    end

    classDiagram
        class JwtClaimsSchema {
            +sub: string
            +roles: string[]
            +tenant?: string
        }
        class AccessFilterSchema {
            +allowTags: string[]
            +maxClassification: enum
        }

        AgentSchemas ..> JwtClaimsSchema
```

## 3. Interface Documentation

- INT-001: Exported Zod objects.

| Schema                     | Purpose          | Key Fields                                           | Notes                               |
| -------------------------- | ---------------- | ---------------------------------------------------- | ----------------------------------- |
| `jwtClaimsSchema`          | JWT payload      | `sub, roles[], tenant?`                              | Optional exp/iat/iss                |
| `accessFilterSchema`       | Query filters    | `allowTags[], maxClassification`                     | Enum: public/internal/confidential  |
| `documentContextSchema`    | RAG context      | `text, docId, score, securityTags[], classification` | From vector query                   |
| `ragAnswerSchema`          | Generated answer | `answer, citations[]`                                | Citations: docId/source             |
| `verificationResultSchema` | Security check   | `ok, reason, answer`                                 | Answer: string or {text, citations} |

### Usage

```ts
type Claims = z.infer<typeof jwtClaimsSchema>
const validated = jwtClaimsSchema.parse(tokenPayload)
```

INT notes:

- INT-003: Unions/enums for strict validation.

## 4. Implementation Details

- IMP-001: Simple Zod objects with arrays/enums/optionals.

- IMP-002: Nested: Citations as array of objects; verification answer union.

- IMP-003: Enums: Classification levels.

- IMP-004: No defaults; strict parsing.

Edge cases and considerations:

- Optional fields: .optional() allows undefined.

- Invalid enum: Zod throws.

## 5. Usage Examples

### Validation

```ts
const filter = accessFilterSchema.parse({
    allowTags: ['role:admin'],
    maxClassification: 'internal',
})
```

### Type Inference

```ts
const answer: RagAnswer = {
    answer: 'Response',
    citations: [{ docId: '1', source: 'doc.md' }],
}
```

Best practices:

- Use parse() early in workflows.

- Extend for new fields.

## 6. Quality Attributes

- QUA-001 Security: Validates sensitive fields (roles, classification).

- QUA-002 Performance: Fast Zod parsing.

- QUA-003 Reliability: Catches invalid data.

- QUA-004 Maintainability: Central; easy updates.

- QUA-005 Extensibility: Add schemas for new agents.

## 7. Reference Information

- REF-001: Dependencies: zod (^3)

- REF-002: Configuration: None.

- REF-003: Testing: Schema roundtrip.

- REF-004: Troubleshooting: Parse errors — check types.

- REF-005: Related: governedRagAnswer.workflow.ts

- REF-006: Change history: 1.0 (2025-09-23)
