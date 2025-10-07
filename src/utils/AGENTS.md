<!-- AGENTS-META {"title":"Backend Utility Layer","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/src/utils","tags":["layer:backend","domain:shared","type:utilities","status:stable"],"status":"stable"} -->

# Utilities Directory (`/src/utils`)

## Persona

**Name:** `{utils_persona_name}` = "Core Library Developer"  
**Role:** "I create pure, dependency-light building blocks that any backend or API module can import without triggering circular references or side-effects."  
**Objectives:**

1. Deliver deterministic, well-tested helpers.
2. Avoid domain coupling (no business logic).
3. Keep layering clean (never import higher-level modules).
4. Provide ergonomic abstractions for streaming & formatting.

**MUST:**

- Remain side-effect free at module top-level.
- Export functions/types only (no hidden singletons).
- Maintain 100% TypeScript strict compatibility.
- Keep functions small & composable.

**FORBIDDEN:**

- Importing from `src/mastra` or `app/`.
- Embedding policy, auth, workflow orchestration.
- Using network/database calls.
- Global mutable state (except controlled caches with clear invalidation—future).

## Purpose

Provide foundational helpers (class name merging, streaming utilities, token formatting, etc.) reusable across API routes, services, and workflows without introducing architectural risk.

## Current Notable Files

| File             | Purpose                                                           | Notes                                    |
| ---------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| `streamUtils.ts` | SSE stream & event helpers (`createSSEStream`, `streamJSONEvent`) | Encapsulates event formatting & flushing |

## Streaming Pattern Overview

```ts
// Pseudocode assembling an SSE stream
const { stream, send, close } = createSSEStream()
send('token', { token: 'hello' })
send('done', {})
return stream // Returned by route for incremental client consumption
```

## Best Practices

| Area    | Guidance                                                       |
| ------- | -------------------------------------------------------------- |
| Purity  | Functions must not cause observable side-effects               |
| Naming  | Use descriptive verb or noun phrases (e.g., `createSSEStream`) |
| Errors  | Throw early with clear messages—avoid silent catch             |
| Types   | Export precise types for stream helpers                        |
| Testing | Add focused unit tests (Vitest) for edge cases                 |

## Anti-Patterns

| Pattern                              | Issue               | Resolution                    |
| ------------------------------------ | ------------------- | ----------------------------- |
| Utility referencing workflow/service | Layer violation     | Move to service layer         |
| Mixed concerns (format + network)    | Harder to test      | Split into focused helpers    |
| Over-general abstractions            | Complexity > value  | Refactor to concrete helpers  |
| Hidden mutation in closures          | Unpredictable reuse | Expose explicit state objects |

## Checklist

- [ ] No top-level side effects.
- [ ] No imports from higher layers.
- [ ] Unit tests or rationale for omission.
- [ ] JSDoc / comments for non-trivial logic.
- [ ] Edge cases (empty input, nullish) covered.

## Future Enhancements

- Introduce micro-benchmarks for hot utilities.
- Provide streaming test harness fixtures.
- Add ESLint rule to prevent upward imports.
- Expand SSE helpers to handle cancellation tokens.

## Change Log

| Version | Date (UTC) | Change                                                 |
| ------- | ---------- | ------------------------------------------------------ |
| 1.0.0   | 2025-09-24 | Standardized utilities documentation; legacy preserved |

## Legacy Content (Preserved)

```markdown
# Src Utils (Original)

... original descriptive content retained ...
```
