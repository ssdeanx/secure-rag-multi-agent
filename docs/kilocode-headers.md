# Kilocode Headers Guide

## Introduction

Kilocode headers are specialized comment blocks in TypeScript files within the Mastra framework. They serve as metadata to enforce governance, security, and auditability in the Retrieval-Augmented Generation (RAG) system. These headers document explicit contracts for agents and tools, ensuring least privilege access, predictable behavior, and traceability for sensitive operations involving data classification, vector stores, and external I/O.

### Purpose

- **Security and Governance**: Prevent ad-hoc tool usage or unauthorized access to sensitive data (e.g., confidential documents). Headers specify required permissions, whitelists, and side effects to align with ACL-based access control.
- **Auditability**: Enable tracing of operations (network, filesystem, vector upserts/queries) and support PR reviews via checklists.
- **Fail-Safe Design**: Mandate validation (e.g., embedding dimensions, domains) and sanitization to avoid runtime errors or data leaks.
- **Consistency**: Centralize documentation of input/output schemas, caller claims, and approvals, reducing inconsistencies across agents, tools, and workflows.

Headers are enforced through manual PR checklists and optional linting rules, not runtime parsing. They are required for all Mastra agents (src/mastra/agents/) and tools (src/mastra/tools/) performing side effects.

## Header Types

There are two primary types: **Agent Contract** for Mastra agents and **Tool Approval** for tools. Both start with `// Kilocode: [Type]` and use key-value lines.

### 1. Agent Contract

**Applies to**: Files in `src/mastra/agents/` (e.g., answerer.agent.ts, assistant.ts).

**Required Fields**:

- `owner`: Team or individual responsible (e.g., team-ai).
- `category`: Type (e.g., mastra-agent).
- `approvalRequired`: Boolean (true for agents accessing sensitive data).
- `tools`: List of expected tools (e.g., - vector-query.tool).
- `outputSchema`: Reference to Zod/TS schema (e.g., src/mastra/schemas/agent-schemas.ts::AnswererOutput).
- `requiredCallerClaims`: JWT requirements (e.g., roles: [role:engineering], tenant: engineering).

**Template**:

```
// Kilocode: Agent Contract
// owner: team-ai
// category: mastra-agent
// approvalRequired: true
// tools:
//  - vector-query.tool
//  - jwt-auth.tool
// outputSchema: src/mastra/schemas/agent-schemas.ts::AnswererOutput
// requiredCallerClaims:
//  - roles: [role:engineering]
//  - tenant: engineering
```

**Example** (from src/mastra/agents/assistant.ts):

```
// Kilocode: Agent Contract
// owner: team-ai
// category: mastra-agent
// approvalRequired: true
// tools:
//  - vector-query.tool
// outputSchema: src/mastra/schemas/agent-schemas.ts::AssistantOutput
// requiredCallerClaims:
//  - roles: [role:engineering]
//  - tenant: engineering
```

**Rationale**:

- Prevents over-permissive tool calls in RAG agents handling retrieval/answering.
- Ensures outputs conform to schemas for structured responses with citations.
- Enforces role/tenant checks to protect classified data per ACL.

### 2. Tool Approval

**Applies to**: Files in `src/mastra/tools/` (e.g., web-scraper-tool.ts, data-file-manager.ts) with network I/O or filesystem writes.

**Required Fields**:

- `owner`: Team or individual (e.g., team-data).
- `justification`: Brief reason and scope (e.g., fetch public docs for RAG indexing).
- `allowedDomains`: Array of permitted domains (e.g., - example.com) or [].
- `allowedDataPaths`: Array of permitted paths (e.g., - corpus/public) or [].
- `sideEffects`: Object listing impacts (e.g., network: true, write: true).
- `approvedBy`: Approver name.
- `approvalDate`: ISO date (e.g., 2025-09-23).

**Template**:

```
// Kilocode: Tool Approval
// owner: team-data
// justification: Reason for the tool and its limited scope
// allowedDomains:
//  - example.com
// allowedDataPaths:
//  - corpus/public
// sideEffects:
//  - network: true
//  - write: true
// approvedBy: TODO
// approvalDate: TODO
```

**Example** (from src/mastra/tools/web-scraper-tool.ts):

```
// Kilocode: Tool Approval
// owner: team-data
// justification: fetch public docs for RAG indexing with whitelist
// allowedDomains:
//  - example.com
//  - docs.example.com
// allowedDataPaths:
//  - corpus/public
// sideEffects:
//  - network: true
//  - write: true
// approvedBy: TODO
// approvalDate: TODO
```

**Rationale**:

- High-risk tools (e.g., fetch, write) require explicit whitelists to prevent exfiltration or corruption.
- Documents side effects for auditing; mandates validation (e.g., validateUrl, validateDataPath).
- Ensures reversibility and sanitization (e.g., HTML to Markdown) for safe integration.

## Enforcement and Best Practices

- **Placement**: Headers at the top of the file, before exports.
- **PR Checklists**: Include verification (e.g., [ ] Header present, [ ] Whitelist populated) from review-checklists.md.
- **Validation**: Use suggested scripts (e.g., validate-rules.js) in CI for header presence.
- **Updates**: When modifying agents/tools, update headers and PR description with rationale.
- **Related Rules**: See mastra.md for agent/tool specifics, tools.md for I/O gating, security.md for embedding/validation.

For more examples, refer to .kilocode/rules/generated-headers.md and .kilocode/rules/memory-bank/examples.md.

This guide ensures Mastra components adhere to governed RAG principles, maintaining security in a multi-tenant, classified environment.
