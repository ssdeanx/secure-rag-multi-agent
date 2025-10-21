<!-- META {"title":"Active Context","version":"1.0","last_updated":"2025-10-20T12:06:30Z","source":"src/mastra/index.ts","tags":["memory-bank","active","context"]} -->

# Active Context

## Current Goals

- [CORRECTED 2025-10-20] Removed the incorrect memory-bank assertion that agents must perform exactly one tool call. Actual execution model: agents may execute asynchronously and call multiple tools. The orchestrator (workflows/networks) maintains sequencing, retries, and audit logging. package.json shows Mastra dependencies and Cedar integration; dashboard uses `lib/mastra` client. `role-hierarchy.ts` and `acl.yaml` remain authoritative for RBAC.

## Current Blockers

- None yet