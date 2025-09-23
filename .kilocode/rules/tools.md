# Tools Kilocode rule (tools.md)

Scope
- Apply to network and filesystem tools in the codebase.
- Targets: - [`src/mastra/tools/copywriter-agent-tool.ts`](src/mastra/tools/copywriter-agent-tool.ts:1)
- [`src/mastra/tools/data-file-manager.ts`](src/mastra/tools/data-file-manager.ts:1)
- [`src/mastra/tools/editor-agent-tool.ts`](src/mastra/tools/editor-agent-tool.ts:1)
- [`src/mastra/tools/evaluateResultTool.ts`](src/mastra/tools/evaluateResultTool.ts:1)
- [`src/mastra/tools/extractLearningsTool.ts`](src/mastra/tools/extractLearningsTool.ts:1)
- [`src/mastra/tools/jwt-auth.tool.ts`](src/mastra/tools/jwt-auth.tool.ts:1)
- [`src/mastra/tools/roadmapTool.ts`](src/mastra/tools/roadmapTool.ts:1)
- [`src/mastra/tools/starter-agent-tool.ts`](src/mastra/tools/starter-agent-tool.ts:1)
- [`src/mastra/tools/vector-query.tool.ts`](src/mastra/tools/vector-query.tool.ts:1)
- [`src/mastra/tools/weather-tool.ts`](src/mastra/tools/weather-tool.ts:1)
- [`src/mastra/tools/web-scraper-tool.ts`](src/mastra/tools/web-scraper-tool.ts:1)

Principles
- Explicit approval: any tool that performs network I/O or writes to disk needs explicit approval metadata and a whitelist.
- Minimal scope: tools should operate only on allowed domains/paths and use safe defaults.
- Auditable and reversible: side-effects must be auditable and have safe cleanup or rollback where possible.

Rules
1) Approval metadata
- Tool files must include a Kilocode approval header with:
  - owner
  - justification
  - allowedDomains: []
  - allowedDataPaths: []
  - approvalDate and reviewer
- Checklist:
  - [ ] Kilocode approval header present
  - [ ] allowedDomains or allowedDataPaths populated

2) Network I O controls
- All network calls must:
  - validate target domain against allowedDomains
  - follow robots rules where applicable
  - set conservative timeouts and rate limits
  - sanitize and normalize fetched content before storing or passing to models
- Checklist:
  - [ ] domain whitelist enforced
  - [ ] timeouts and rate limits configured
  - [ ] HTML sanitized before markdown conversion

3) Filesystem gating and sandboxing
- Tools that write files must restrict writes to an explicit DATA_DIR and use validateDataPath/realpath checks.
- No writes allowed outside the repo data sandbox; operations must be reversible (temporary files, atomic writes).
- Checklist:
  - [ ] writes confined to DATA_DIR
  - [ ] validateDataPath used for all paths
  - [ ] atomic write or backup performed before overwrite

4) Interface contracts and idempotency
- Each tool must declare its input/output schema (zod/TS) and list side-effects in header.
- Prefer idempotent operations; document non-idempotent actions and require explicit confirmation in approval header.
- Checklist:
  - [ ] input/output schema referenced
  - [ ] side-effects listed
  - [ ] non-idempotent flagged and approved

5) Auditing and observability
- All side-effecting operations must emit tracing events with requestId, actor, timestamp, and outcome.
- Errors must be safe-failed (no partial writes) and logged to workflows audit log.
- Checklist:
  - [ ] tracing calls present
  - [ ] errors lead to rollback or clean failure state

Examples
- Approval header snippet:
```
// Kilocode: Tool Approval
// owner: team-data
// justification: fetch public docs for RAG indexing
// allowedDomains:
//  - example.com
// allowedDataPaths:
//  - corpus/public
// approvedBy: alice
// approvalDate: 2025-09-23
```

Reviewer checklist (PR)
- [ ] Approval header present for modified tools
- [ ] Domain/path whitelist reviewed
- [ ] validateUrl and validateDataPath used
- [ ] Tracing and safe-fail behavior present

Enforcement suggestions (non-invasive)
- Add URL/path validation helpers to shared utils and reference them in header.
- Provide a review template for tool approval changes.

Next steps
- File written to .kilocode/rules/tools.md as draft.