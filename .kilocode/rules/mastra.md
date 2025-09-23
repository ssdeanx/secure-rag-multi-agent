# Mastra Kilocode rule (mastra.md)

Scope
- Apply to Mastra agents, workflows, tools, services, and configs in the codebase.
- Targets: - [`src/mastra/index.ts`](src/mastra/index.ts:1)
- [`src/mastra/agents/answerer.agent.ts`](src/mastra/agents/answerer.agent.ts:1)
- [`src/mastra/agents/assistant.ts`](src/mastra/agents/assistant.ts:1)
- [`src/mastra/agents/copywriterAgent.ts`](src/mastra/agents/copywriterAgent.ts:1)
- [`src/mastra/agents/editorAgent.ts`](src/mastra/agents/editorAgent.ts:1)
- [`src/mastra/agents/evaluationAgent.ts`](src/mastra/agents/evaluationAgent.ts:1)
- [`src/mastra/agents/identity.agent.ts`](src/mastra/agents/identity.agent.ts:1)
- [`src/mastra/agents/learningExtractionAgent.ts`](src/mastra/agents/learningExtractionAgent.ts:1)
- [`src/mastra/agents/policy.agent.ts`](src/mastra/agents/policy.agent.ts:1)
- [`src/mastra/agents/productRoadmapAgent.ts`](src/mastra/agents/productRoadmapAgent.ts:1)
- [`src/mastra/agents/reportAgent.ts`](src/mastra/agents/reportAgent.ts:1)
- [`src/mastra/agents/rerank.agent.ts`](src/mastra/agents/rerank.agent.ts:1)
- [`src/mastra/agents/researchAgent.ts`](src/mastra/agents/researchAgent.ts:1)
- [`src/mastra/agents/retrieve.agent.ts`](src/mastra/agents/retrieve.agent.ts:1)
- [`src/mastra/agents/selfReferencingAgent.ts`](src/mastra/agents/selfReferencingAgent.ts:1)
- [`src/mastra/agents/starterAgent.ts`](src/mastra/agents/starterAgent.ts:1)
- [`src/mastra/agents/verifier.agent.ts`](src/mastra/agents/verifier.agent.ts:1)
- [`src/mastra/config/gemini-cli.ts`](src/mastra/config/gemini-cli.ts:1)
- [`src/mastra/config/google.ts`](src/mastra/config/google.ts:1)
- [`src/mastra/config/libsql-storage.ts`](src/mastra/config/libsql-storage.ts:1)
- [`src/mastra/config/openai.ts`](src/mastra/config/openai.ts:1)
- [`src/mastra/config/openrouter.ts`](src/mastra/config/openrouter.ts:1)
- [`src/mastra/config/pg-storage.ts`](src/mastra/config/pg-storage.ts:1)
- [`src/mastra/config/vector-store.ts`](src/mastra/config/vector-store.ts:1)
- [`src/mastra/policy/acl.yaml`](src/mastra/policy/acl.yaml:1)
- [`src/mastra/policy/policy.service.ts`](src/mastra/policy/policy.service.ts:1)
- [`src/mastra/index.ts`](src/mastra/index.ts:1)
- [`src/mastra/apiRegistry.ts`](src/mastra/apiRegistry.ts:1)
- [`src/mastra/cli/index.ts`](src/mastra/cli/index.ts:1)
- [`src/mastra/services/AuthenticationService.ts`](src/mastra/services/AuthenticationService.ts:1)

Principles
- Least privilege: agents and tools must only request the permissions and data they need.
- Explicit contracts: document input/output schema, side effects, approvals.
- Auditability: network/fs/vector ops must emit tracing and include securityTags.
- Fail-safe: sanitize external content before use.

High priority rules
1) Agent contracts
- Every file under [`src/mastra/agents/`](src/mastra/agents/assistant.ts:1) must include a Kilocode header documenting:
  - expected tool calls (names and constraints)
  - output JSON schema and zod/TS type reference
  - required caller JWT claims (roles, tenant)
- Checklist:
  - [ ] Kilocode header present
  - [ ] tool calls documented
  - [ ] output schema referenced

2) Tool approvals and side-effect gating
- Tools performing network I/O or filesystem writes (e.g. [`src/mastra/tools/web-scraper-tool.ts`](src/mastra/tools/web-scraper-tool.ts:1), [`src/mastra/tools/data-file-manager.ts`](src/mastra/tools/data-file-manager.ts:1)) must include:
  - Approval metadata: owner, justification, allowed targets
  - Whitelist of domains or paths
- Checklist:
  - [ ] Approval block present
  - [ ] Whitelist present
  - [ ] validateUrl/validateDataPath used

3) Vector store safety
- All upserts and queries must attach securityTags and validate embedding dimension against [`src/mastra/config/vector-store.ts`](src/mastra/config/vector-store.ts:1).
- Queries must build filters via RoleService and ACL, not ad-hoc strings.
- Checklist:
  - [ ] securityTags included
  - [ ] embedding dimension validated
  - [ ] queries use RoleService

4) Indexing and document processing
- Indexing pipelines must derive classification and tenant tags from authoritative ACL: [`src/mastra/policy/acl.yaml`](src/mastra/policy/acl.yaml:1).
- Checklist:
  - [ ] ACL read and validated
  - [ ] processing emits traces and docId mappings

5) Output verification and citations
- RAG agents must return structured answers with citations; verifier agent must validate claims.
- Checklist:
  - [ ] answer schema enforced
  - [ ] verifier in workflow

Operational requirements
- Add Kilocode header block to target files:
```
// Kilocode: { owner: team-ai, category: mastra-agent, approvalRequired: true }
```
- Reference canonical zod/TS types in header
- Reviewer PR checklist (one-liner) must be included in PR description when changing these files

Examples
- Kilocode header snippet for agent file:
```
// TypeScript
// Kilocode: Agent Contract
// owner: team-ai
// category: mastra-agent
// approvalRequired: true
// tools:
//  - vector-query.tool
// outputSchema: src/mastra/schemas/agent-schemas.ts::AnswererOutput
```

Enforcement suggestions
- Manual reviewer checklist in PR template
- Optional lint rule: require Kilocode header in matching file paths

Next steps
- I will write this draft to .kilocode/rules/mastra.md now if you approve. No other repo changes.