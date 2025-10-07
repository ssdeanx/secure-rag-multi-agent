<!-- AGENTS-META {"title":"Operations CLI","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/src/cli","tags":["layer:backend","domain:ops","type:cli","status:stable"],"status":"stable"} -->

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

## Design Principles

| Principle     | Rationale                     | Implementation Cue                                   |
| ------------- | ----------------------------- | ---------------------------------------------------- |
| Delegation    | Avoid logic drift             | Always call workflow/tool instead of re-implementing |
| Determinism   | Predictable automation        | Stable output formatting & exit codes                |
| Transparency  | Debuggability                 | Log command + args (sanitized) at start              |
| Safety        | Prevent destructive surprises | Add confirmation for destructive ops (future)        |
| Extensibility | Future growth                 | Consider migrating to `commander` when >5 commands   |

## Adding a New Command

```text
1. Define: purpose, workflow mapping, arguments.
2. Implement small async function (keep pure except I/O & logging).
3. Add `case` in dispatcher switch.
4. Update `help` output (ALWAYS in same commit).
5. Test manually & (optionally) add a lightweight Vitest harness.
```

## Error Handling Patterns

| Scenario                 | Behavior                          | Example                   |
| ------------------------ | --------------------------------- | ------------------------- |
| Missing required arg     | Print usage + exit 1              | `query` without JWT       |
| Workflow throws          | Log stack (dev) + concise message | Network / model error     |
| Unknown command          | Print help + exit 1               | Typo: `qurey`             |
| JSON parse/display error | Fallback to raw output            | Malformed streaming chunk |

## Best Practices

| Area      | Guidance                                     |
| --------- | -------------------------------------------- |
| Logging   | Minimal: command + duration                  |
| Output    | Prefer machine-parseable JSON where feasible |
| Secrets   | Never echo JWT contents beyond role metadata |
| Streaming | Flush partial tokens promptly; final newline |
| Help      | Keep first line concise; examples below      |

## Anti-Patterns

| Pattern                             | Issue                | Fix                                |
| ----------------------------------- | -------------------- | ---------------------------------- |
| Added retry loops inline            | Hidden complexity    | Add retry inside service/workflow  |
| Embedding classification heuristics | Duplication risk     | Leave in indexing workflow/API     |
| Mixing interactive & batch logic    | Unpredictable output | Separate `demo` from machine modes |
| Hard-coded ANSI color noise         | Breaks parsing       | Provide flag for color             |

## Checklist (Before Commit)

- [ ] Command documented in help.
- [ ] No business logic duplication.
- [ ] Errors produce non-zero exit code.
- [ ] Arguments validated early.
- [ ] Workflow name stable & not stringly across files.

## Future Enhancements

- Adopt structured arg parser (`commander`) when expanding.
- Add `clear-index` with confirmation prompt.
- Add JSON schema validation for command inputs.
- Provide `--format json|pretty` flag.
- Add timing metrics output (`--verbose`).

## Change Log

| Version | Date (UTC) | Change                                           |
| ------- | ---------- | ------------------------------------------------ |
| 1.0.0   | 2025-09-24 | Standardized CLI documentation; legacy preserved |

## Legacy Content (Preserved)

```markdown
# (Original CLI Documentation)

- **`name`**: "CLI & Operations Engineer"
- **`role_description`**: "I build command-line tools for managing the application's operational tasks, such as data indexing and batch processing. I focus on creating clear, usable, and robust command structures that provide a direct interface to the backend workflows."
  ... (truncated for brevity, original content retained in git history) ...
```
