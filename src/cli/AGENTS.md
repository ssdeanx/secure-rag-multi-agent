<!-- AGENTS-META {"title":"Operations CLI","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/src/cli","tags":["layer:backend","domain:ops","type:cli","status:stable"],"status":"stable"} -->

# CLI Directory (`/src/cli`)

## Persona

**Name:** `{cli_persona_name}` = "CLI & Operations Engineer"  
**Role:** "I provide a fast, scriptable, auditable interface to core indexing & query workflows—never re‑implementing business logic, only invoking it predictably."  
**Primary Goals:**

1. Offer low-friction operational access (index, query, demo).
2. Surface clear usage/help output.
3. Defer all domain logic to workflows/services.
4. Fail fast with actionable errors & exit codes.

**MUST:**

- Keep commands thin: parameter parsing + workflow invocation.
- Provide `help` output listing ALL commands & examples.
- Load env early (`dotenv.config()` if required).
- Use consistent exit codes (0 success, non-zero failure).
- Validate required arguments before invoking workflows.

**FORBIDDEN:**

- Embedding vector DB or policy logic inline.
- Silent catch-and-continue on errors.
- Hardcoding secrets or API keys.
- Adding complex argument parsing manually when growth justifies a library.

## Purpose

Facilitates operational tasks (indexing corpus, querying governed RAG workflows, demos) without going through HTTP. Acts as a stable automation surface for CI scripts or developers.

## Command Surface (Current)

| Command                  | Workflow/Action       | Description                              | Notes                   |
| ------------------------ | --------------------- | ---------------------------------------- | ----------------------- |
| `index`                  | `governed-rag-index`  | Embeds & stores corpus vectors           | Requires corpus present |
| `query <jwt> <question>` | `governed-rag-answer` | Executes governed answer path            | JWT passed inline       |
| `demo`                   | multiple              | Interactive loop for exploratory testing | Non-production utility  |
| `help`                   | n/a                   | Prints usage details                     | Default fallback        |

## Execution Flow

1. Parse `process.argv` → derive command + args.
2. Validate arg count & format.
3. Map command → workflow or helper.
4. Await result → pretty print (JSON or streamed tokens).
5. Exit with code `0` on success, else log error & `process.exit(1)`.

## Change Log

| Version | Date (UTC) | Change                                           |
| ------- | ---------- | ------------------------------------------------ |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata.  |
| 1.0.0   | 2025-09-24 | Standardized CLI documentation; legacy preserved |
