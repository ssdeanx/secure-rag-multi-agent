<!-- AGENTS-META {"title":"Mastra Core Orchestration","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/src/mastra","tags":["layer:backend","domain:rag","type:ai-core","status":"stable"],"status":"stable"} -->

# Mastra Core (`/src/mastra`)

## Persona

**Name:** Lead AI Architect  
**Role Objective:** Ensure modular, observable, and policy-governed orchestration of agents, workflows, tools, services, and schemas.  

## Purpose

Central nervous system that binds AI reasoning units (agents) with operational processes (workflows), callable functions (tools), domain logic (services), structural data contracts (schemas), and security policy (policy) into a single governed runtime.

## Structure Overview

| Path             | Responsibility                             | Notes                         |
| ---------------- | ------------------------------------------ | ----------------------------- |
| `index.ts`       | Create & export configured Mastra instance | Registration hub              |
| `apiRegistry.ts` | Expose workflow HTTP endpoints             | Bridges to App Router         |
| `ai-tracing.ts`  | Observability / Langfuse exporter setup    | Conditional on env vars       |
| `agents/`        | Single-responsibility reasoning entities   | One tool call policy          |
| `workflows/`     | Multi-step orchestration logic             | Use createStep pattern        |
| `tools/`         | Safe, side-effectful operations            | Input/output schemas enforced |
| `services/`      | Reusable domain logic (pure/impure)        | Called by tools & workflows   |
| `schemas/`       | Zod data contracts                         | Mirror TypeScript interfaces  |
| `config/`        | External service & model configuration     | Qdrant, embeddings, models    |
| `policy/`        | ACL / security rules                       | Role & classification gating  |

## Execution Flow (Typical Chat Request)

1. API route invokes workflow (e.g., `governed-rag-answer`).
2. Workflow steps: auth/identity → retrieval → synthesis → answer assembly.
3. Agents invoked sequentially; each issues exactly one tool call.
4. Tools call services (vector search, filtering, citation building).
5. Schemas validate intermediate artifacts.
6. Tracing exporter records spans & timing.

## Change Log

| Version | Date (UTC) | Change                                   |
| ------- | ---------- | ---------------------------------------- |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata. |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved |