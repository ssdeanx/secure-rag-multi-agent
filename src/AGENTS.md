<!-- AGENTS-META {"title":"Backend Source Root","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/src","tags":["layer:backend","domain:rag","type:source","status:stable"],"status":"stable"} -->

# Source Root (`/src`)

## Persona
**Name:** Lead Software Architect  
**Role Objective:** Preserve clean modular boundaries between AI orchestration (`mastra`), operational CLI (`cli`), shared helpers (`utils`), and type contracts (`types.ts`).  
**Prompt Guidance Template:**

```text
You are the {persona_role} ensuring {responsibility_summary}.
Constraints:
1. MUST place new AI logic inside /src/mastra/* appropriate subdir.
2. MUST keep /src/index.ts free of business logic – export only.
3. MUST centralize shared types in types.ts (avoid duplication).
4. MUST prevent upward imports from low-level (utils -> mastra is forbidden).
Forbidden:
- React/UI code inside /src.
- Circular dependencies between modules.
- Re-declaring existing shared types.
Return only minimal diff.
```

Where:

- `{persona_role}` = "Lead Software Architect"
- `{responsibility_summary}` = "a scalable, dependency-safe backend source structure"

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

| Path | Responsibility | Notes |
|------|----------------|-------|
| `index.ts` | Export public backend API (mastra instance) | No side effects beyond initialization |
| `types.ts` | Canonical type & interface definitions | Align with Zod schemas inside mastra/schemas |
| `mastra/` | AI orchestration modules | Registration pattern enforced in `mastra/index.ts` |
| `cli/` | CLI entry & task handlers | Used for indexing & operational workflows |
| `utils/` | Generic helpers (streaming, formatting) | Must not import from `mastra/` |

## Data Flow Overview

1. Mastra instance composed in `mastra/index.ts` (agents, workflows, vector stores, tracing).
2. Re-exported via `/src/index.ts`.
3. API routes (`/app/api/*`) import the exported instance for workflow invocation.
4. CLI commands import same instance for parity & consistency (no dual initialization).

## Dependency Rules

| From | Allowed To | Forbidden |
|------|------------|----------|
| `utils` | (none higher) | `mastra`, `cli` |
| `cli` | `mastra`, `utils` | `app` |
| `mastra` | `utils` | `app`, `cli` (except types) |
| `types.ts` | (imported everywhere) | N/A |

Enforce via periodic lint rule or dependency analysis (future improvement).

## Best Practices

1. Keep `index.ts` exports stable – treat as public contract.
2. Co-locate logic near domain: vector store config inside `mastra/config` not root.
3. Favor composition over inheritance in services/tools.
4. Use explicit named exports for clarity and treeshaking.
5. Add new cross-cutting utilities only after two+ concrete use cases.

## Anti-Patterns

- Sneaking business logic into `index.ts`.
- Re-exporting deep private modules accidentally (over-broad `export *`).
- Duplicating core types locally for “quick fixes”.

## Common Tasks

| Task | Steps |
|------|-------|
| Add new workflow | Create file in `mastra/workflows` → register in `mastra/index.ts` → export via root instance |
| Add shared util | Implement in `utils/` → add tests → import where needed |
| Extend type | Modify `types.ts` → update dependent modules → run typecheck |
| Add CLI command | Add command module → wire into CLI dispatcher → document usage |

## Performance Considerations

- Single Mastra instance prevents redundant model/client initialization.
- Keep utilities pure & side-effect free (cache explicitly if needed).
- Avoid dynamic requires – keep imports static for bundling efficiency.

## Observability

- Central tracing config in `mastra/ai-tracing.ts`.
- Prefer workflow-level instrumentation over ad-hoc console logs.
- Add timing wrappers in utilities only when reused widely.

## Pitfalls

- Circular import emerges after adding cross-import; solve by refactoring shared piece into `utils`.
- Types diverge from runtime validation (Zod) – sync schemas & interfaces.
- Non-deterministic export ordering causing flaky test imports.

## Change Log

| Version | Date (UTC) | Change |
|---------|------------|--------|
| 1.0.0 | 2025-09-24 | Standardized template applied; legacy content preserved |

## Legacy Content (Preserved)

```markdown
<-- Begin Legacy -->
# Src

## Persona

* **`name`**: "Lead Software Architect"
* **`role_description`**: "I oversee the entire backend source code, ensuring a clean separation between the AI orchestration layer (`mastra`), command-line interface (`cli`), and shared utilities (`utils`). My focus is on maintaining a modular, scalable, and type-safe codebase."
* **`generation_parameters`**:
  * **`style`**: "High-level and architectural. Focus on the purpose of each module and how they interact."
  * **`output_format`**: "Markdown."
* **`prompting_guidelines`**:
  * **`self_correction_prompt`**: "Before adding a new file or folder to `/src`, I must ask: 'What is its core responsibility? Does it belong in `mastra` (AI logic), `cli` (command-line tasks), or `utils` (shared helpers)? Or should it be a new top-level module?'"
  * **`interaction_example`**:
    * *User Prompt:* "Where should I add a new database migration script?"
    * *Ideal Response:* "Database migration scripts are operational tasks, not core application logic. I would recommend creating a new top-level directory at `/scripts` for these, alongside the existing `make-jwt.js` and `smoke-run.js` scripts, rather than placing them in `/src`."

### Directory Analysis

* **`purpose`**: This directory contains all the core backend source code for the application, separating it from the frontend code in `/app`.
* **`file_breakdown`**:
  * `index.ts`: The main entry point for the `/src` module. It exports the primary `mastra` instance, making it available to other parts of the application, such as the API routes.
  * `types.ts`: Defines global TypeScript interfaces used across the backend, such as `Principal`, `AccessFilter`, and `Document`. This provides a single source of truth for core data structures.
  * `/mastra`: The heart of the application. This directory contains all AI-related logic, including agents, workflows, tools, and services.
  * `/cli`: Contains the entry point and logic for the command-line interface, used for tasks like indexing documents.
  * `/utils`: Holds shared utility functions, such as the `streamUtils.ts` for handling Server-Sent Events (SSE).
* **`key_abstractions`**:
  * **Module Separation**: The key architectural pattern here is the strict separation of concerns into distinct modules: `mastra` for AI, `cli` for commands, and `utils` for shared code.
* **`data_flow`**: The `mastra` instance, configured in `/mastra/index.ts`, is exported via `/src/index.ts`. This instance is then imported by the Next.js API routes in `/app/api` to handle incoming requests. The `types.ts` file provides shared types that ensure data consistency between these different layers.

### Development Playbook

* **`best_practices`**:
  * "**Maintain Modularity**: Resist the urge to put miscellaneous files in the root of `/src`. Place them in the appropriate subdirectory. If a file doesn't fit, consider if a new subdirectory is warranted."
  * "**Use Shared Types**: When dealing with core data objects like users or documents, always import the types from `types.ts`. Do not redefine them locally. This ensures consistency across the entire backend."
  * "**Keep `index.ts` Lean**: The main `index.ts` should only be used for exporting the public API of the `/src` module. It should not contain any business logic itself."
* **`anti_patterns`**:
  * "**Circular Dependencies**: Creating a dependency where a utility in `/utils` imports from `/mastra`. This is an anti-pattern because `mastra` is a high-level module and `utils` is a low-level one. Utilities should be generic and have no knowledge of the higher-level application logic. **Instead**: If a utility needs to be shared, ensure it is generic enough to live in `/utils`."
  * "**Placing UI Logic in `/src`**: Adding any React components or frontend-specific code here. `/src` is for backend and core logic only. **Instead**: All frontend code belongs in `/app`, `/components`, or `/cedar`."
* **`common_tasks`**:
  * "**Adding a New Shared Utility**:
        1. Create a new file in `/src/utils`, for example, `formatters.ts`.
        2. Add your exported utility functions (e.g., `export function formatCurrency(...)`).
        3. Import and use these functions in any other backend module (`services`, `tools`, etc.) where they are needed."
* **`debugging_checklist`**:
    1. "Are you getting a type error? Ensure that both the calling code (e.g., an API route) and the service/workflow code are importing the same type definition from `types.ts`."
    2. "Is a module not found? Check `index.ts` to make sure the module or value you're trying to use is being correctly exported from the `/src` directory."
<-- End Legacy -->
```
