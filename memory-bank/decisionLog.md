<!-- DECISIONS-META {"title":"Decision Log","version":"1.1","last_updated":"2025-10-20T12:13:45Z","applies_to":"/","tags":["memory-bank","decisions","architecture"]} -->

# Decision Log

| Date | Decision | Rationale | Sources |
|------|----------|-----------|---------|
| 2025-10-20 12:00:00Z | Agent Execution Model: allow asynchronous, multi-tool agents | Removed earlier incorrect constraint that agents must call exactly one tool; agents may run asynchronously and invoke multiple tools when required. Workflows and Mastra orchestration (with Langfuse tracing) provide sequencing, retries, and auditability. | `src/mastra/index.ts`, `src/mastra/agents/*`, `src/mastra/config/pg-storage.ts`, `lib/mastra/mastra-client.ts` |
