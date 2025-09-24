<!-- AGENTS-META {"title":"Mastra Config","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/src/mastra/config","tags":["layer:backend","domain:infra","type:config","status:stable"],"status":"stable"} -->

# Config Directory (`/src/mastra/config`)

## Persona
**Name:** DevOps & Cloud Engineer  
**Role Objective:** Centralize secure initialization of external services (models, vector store, databases, logging, role hierarchy) with environment-driven configuration.  
**Prompt Guidance Template:**

```text
You are the {persona_role} ensuring {responsibility_summary}.
Constraints:
1. MUST read secrets from environment (never hardcode).
2. MUST fail fast with descriptive error if required env missing.
3. MUST isolate provider logic per file (single responsibility).
4. MUST export initialized singleton instances (no duplicate clients).
Forbidden:
- Inline secret literals.
- Mixing unrelated provider setup in one file.
- Silent fallback defaults for critical creds.
Return minimal config diff only.
```

Where:

- `{persona_role}` = "DevOps & Cloud Engineer"
- `{responsibility_summary}` = "secure, observable service/client initialization"

## Purpose
Establish consistent, testable, and secure entry points for all external dependencies consumed by Mastra agents, tools, and workflows.

## Key Files

| File | Responsibility | Notes |
|------|----------------|-------|
| `openai.ts` / `google.ts` | Model provider client setup | API keys pulled from env |
| `vector-store.ts` | Qdrant vector client config | Host/port/collection naming |
| `libsql.ts` / `pg-storage.ts` | SQL connectivity abstraction | Future: connection pooling tuning |
| `libsql-storage.ts` | Vector + memory support over LibSQL | Higher-level helper functions |
| `logger.ts` | Structured logging (Pino) | Standard log helpers & transports |
| `role-hierarchy.ts` | RBAC inheritance model | Drives policy & access filters |

## Initialization Pattern

```ts
const required = (name: string) => {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
};

export const OPENAI_API_KEY = required('OPENAI_API_KEY');
```

## Best Practices

1. Validate all mandatory env vars at startup (fail fast principle).
2. Provide minimal abstraction—avoid creating heavy wrappers.
3. Tag logs with contextual identifiers (workflow id, step id) downstream; keep config logging minimal.
4. Keep role hierarchy definitions deterministic & documented.
5. Consider lazy init only for rarely used providers (perf trade-off).

## Anti-Patterns

- Swallowing missing env and continuing with degraded behavior.
- Multiplying instances of expensive clients (embedding models, vector store) per invocation.
- Embedding business logic in config files (belongs in services/tools).

## Common Tasks

| Task | Steps |
|------|-------|
| Add new provider | Create `<provider>.ts` → read env → init client → export singleton |
| Add role | Update `ROLE_HIERARCHY` + adjust `ROLE_LEVELS` → review policies |
| Add logging sink | Extend `logger.ts` transports → validate performance impact |
| Harden startup | Add validation for new env → integrate into required() guard |

## Security Notes

- Secrets never logged; redact if diagnostic required.
- Role hierarchy updates require downstream re-index (security tags) if altering inheritance semantics.
- Avoid permissive defaults for classification mapping.

## Change Log

| Version | Date (UTC) | Change |
|---------|------------|--------|
| 1.0.0 | 2025-09-24 | Standardized template applied; legacy content preserved |

## Legacy Content (Preserved)

```markdown
<-- Begin Legacy -->
# Mastra Config

## Persona: DevOps & Cloud Engineer

### Purpose

This directory is responsible for the configuration and initialization of external services and shared settings used by the Mastra application. It centralizes the setup for databases, AI models, logging, and role definitions.

### File Overview

- **`openai.ts` & `google.ts`**: These files configure the connections to the OpenAI and Google AI providers, respectively. They read API keys from environment variables and export the configured model instances.
- **`libsql.ts`, `pg-storage.ts`, `vector-store.ts`**: These files configure connections to various data stores. `libsql.ts` and `pg-storage.ts` set up connections to SQL databases, while `vector-store.ts` specifically configures the Qdrant vector store.
- **`libsql-storage.ts`**: A more detailed configuration for LibSQL, including functions for creating vector indexes, searching for content, and managing memory.
- **`logger.ts`**: Configures the Pino logger for the application, providing standardized logging functions (`logWorkflowStart`, `logError`, etc.) and setting up file-based transports.
- **`role-hierarchy.ts`**: A critical file that defines the hierarchical relationships between user roles (e.g., `admin` inherits from `employee`). This is the source of truth for the application's RBAC logic.

### Best Practices

- **Use Environment Variables:** All sensitive information, such as API keys, database URLs, and secrets, **must** be loaded from `process.env`. Do not hardcode credentials in these files.
- **Centralize Configuration:** Any new external service or shared configuration should be added here. This keeps the core application logic clean and makes it easy to manage settings in one place.
- **Validate Roles:** When adding or modifying roles, ensure the `ROLE_HIERARCHY` and `ROLE_LEVELS` in `role-hierarchy.ts` are consistent. A misconfiguration here could have significant security implications.
- **Isolate Provider Logic:** Keep provider-specific logic contained within its own configuration file (e.g., all OpenAI setup is in `openai.ts`).
<-- End Legacy -->
```
