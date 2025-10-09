<!-- AGENTS-META {"title":"Backend Source Root","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/src","tags":["layer:backend","domain:rag","type:source","status:stable"],"status":"stable"} -->

# Source Root (`/src`)

## Persona

**Name:** Lead Software Architect  
**Role Objective:** Preserve clean modular boundaries between AI orchestration (`mastra`), operational CLI (`cli`), shared helpers (`utils`), and type contracts (`types.ts`).

## Purpose

Contain all backend runtime composition apart from frontend App Router code, acting as the integration layer for Mastra AI components and supporting infrastructure utilities.

## Scope

### In-Scope

- Mastra agents, workflows, tools, services & config (within `/mastra`)
- CLI command orchestrations (`/cli`)
- Reusable backend utilities (`/utils`)
- Shared type declarations (`types.ts`)

### Out-of-Scope

- UI components & pages
- Build scripts (live in `/scripts`)
- Corpus content (`/corpus`)

## Key Files / Directories

| Path       | Responsibility                              | Notes                                              |
| ---------- | ------------------------------------------- | -------------------------------------------------- |
| `index.ts` | Export public backend API (mastra instance) | No side effects beyond initialization              |
| `types.ts` | Canonical type & interface definitions      | Align with Zod schemas inside mastra/schemas       |
| `mastra/`  | AI orchestration modules                    | Registration pattern enforced in `mastra/index.ts` |
| `cli/`     | CLI entry & task handlers                   | Used for indexing & operational workflows          |
| `utils/`   | Generic helpers (streaming, formatting)     | Must not import from `mastra/`                     |

## Data Flow Overview

1. Mastra instance composed in `mastra/index.ts` (agents, workflows, vector stores, tracing).
2. Re-exported via `/src/index.ts`.
3. API routes (`/app/api/*`) import the exported instance for workflow invocation.
4. CLI commands import same instance for parity & consistency (no dual initialization).

## Dependency Rules

| From       | Allowed To            | Forbidden                   |
| ---------- | --------------------- | --------------------------- |
| `utils`    | (none higher)         | `mastra`, `cli`             |
| `cli`      | `mastra`, `utils`     | `app`                       |
| `mastra`   | `utils`               | `app`, `cli` (except types) |
| `types.ts` | (imported everywhere) | N/A                         |

## Change Log

| Version | Date (UTC) | Change                                                  |
| ------- | ---------- | ------------------------------------------------------- |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata.         |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved |
