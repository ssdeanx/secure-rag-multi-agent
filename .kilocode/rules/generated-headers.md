# Kilocode header drafts and model→dimension mapping

Decision: canonical embedding dimension: 1536

Model to embedding dimension mapping:

- gemini-embedding-001 => 1536
- (other models may vary; verify before use)

Agent header template

Template example:

```typescript
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

Examples

- [`src/mastra/agents/assistant.ts`](src/mastra/agents/assistant.ts:1)

```typescript
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

- [`src/mastra/agents/answerer.agent.ts`](src/mastra/agents/answerer.agent.ts:1)

```typescript
// Kilocode: Agent Contract
// owner: team-ai
// category: mastra-agent
// approvalRequired: true
// tools:
//  - vector-query.tool
//  - evaluateResultTool
// outputSchema: src/mastra/schemas/agent-schemas.ts::AnswererOutput
// requiredCallerClaims:
//  - roles: [role:reader]
//  - tenant: global
```

- [`src/mastra/agents/retrieve.agent.ts`](src/mastra/agents/retrieve.agent.ts:1)

```typescript
// Kilocode: Agent Contract
// owner: team-ai
// category: mastra-agent
// approvalRequired: true
// tools:
//  - vector-query.tool
// outputSchema: src/mastra/schemas/agent-schemas.ts::RetrieveOutput
// requiredCallerClaims:
//  - roles: [role:reader]
//  - tenant: global
```

- [`src/mastra/agents/verifier.agent.ts`](src/mastra/agents/verifier.agent.ts:1)

```typescript
// Kilocode: Agent Contract
// owner: team-ai
// category: mastra-agent
// approvalRequired: true
// tools:
//  - vector-query.tool
// outputSchema: src/mastra/schemas/agent-schemas.ts::VerifierOutput
// requiredCallerClaims:
//  - roles: [role:engineering]
//  - tenant: engineering
```

Tools approval template

Template:

```typescript
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

Examples

- [`src/mastra/tools/web-scraper-tool.ts`](src/mastra/tools/web-scraper-tool.ts:1)

```typescript
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

- [`src/mastra/tools/data-file-manager.ts`](src/mastra/tools/data-file-manager.ts:1)

```typescript
// Kilocode: Tool Approval
// owner: team-data
// justification: manage corpus files within DATA_DIR
// allowedDomains: []
// allowedDataPaths:
//  - corpus/
//  - docs/data/
// sideEffects:
//  - network: false
//  - write: true
// approvedBy: TODO
// approvalDate: TODO
```

- [`src/mastra/tools/vector-query.tool.ts`](src/mastra/tools/vector-query.tool.ts:1)

```typescript
// Kilocode: Tool Approval
// owner: team-data
// justification: authorized vector queries with RoleService enforcement
// allowedDomains: []
// allowedDataPaths: []
// sideEffects:
//  - network: true
//  - write: false
// approvedBy: TODO
// approvalDate: TODO
```

Next steps

- Insert these headers into agent and tool files (one PR per area).
- Run a validation script to check presence and consistency.

Contact: owner defaults used: agents -> team-ai, tools -> team-data
