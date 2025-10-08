<!-- AGENTS-META {"title":"Mastra Schemas","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/src/mastra/schemas","tags":["layer:backend","domain:validation","type:schemas","status":"stable"],"status":"stable"} -->

# Schemas Directory (`/src/mastra/schemas`)

## Persona

**Name:** Data Modeler / API Designer  
**Role Objective:** Maintain a single, versioned source of truth for all cross-layer data contracts using strict, composable Zod schemas.  

## Purpose

Provide canonical runtime + development-time enforcement of shapes for identity, access control, retrieval context, answer assembly, verification, and research artifacts.

## Key File(s)

| File               | Responsibility                | Notable Schemas                                                                                                 |
| ------------------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `agent-schemas.ts` | Core RAG & security contracts | `jwtClaimsSchema`, `accessFilterSchema`, `documentContextSchema`, `ragAnswerSchema`, `verificationResultSchema` |

## Composition Guidelines

1. Small primitives (claims, filters, chunk metadata) → composed into workflow/agent I/O schemas.
2. Always export both Zod schema & inferred TypeScript type: `export type JwtClaims = z.infer<typeof jwtClaimsSchema>`.
3. Prefer enums over free-form strings when value set is closed.
4. Provide refinement/error messages for actionable debugging.
5. Keep security-related fields explicit (e.g., `classification`, `allowedRoles`).

## Change Log

| Version | Date (UTC) | Change                                   |
| ------- | ---------- | ---------------------------------------- |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata. |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved |