# Verified Mastra & Cedar Patterns

> **CRITICAL**: This document contains VERIFIED patterns from official documentation and actual codebase inspection. Use this as source of truth.

## Agent Patterns (VERIFIED)

### File Naming
- **Actual files use BOTH patterns**:
  - `.agent.ts` suffix: `answerer.agent.ts`, `verifier.agent.ts`, `retrieve.agent.ts`
  - `Agent.ts` suffix: `copywriterAgent.ts`, `editorAgent.ts`, `researchAgent.ts`

### Export Naming
- **ALL exports are camelCase**: `answererAgent`, `copywriterAgent`, `editorAgent`
- **NEVER PascalCase**: Not `AnswererAgent` or `CopywriterAgent`

### Agent Class Instantiation
```typescript
import { Agent } from "@mastra/core/agent";

export const copywriterAgent = new Agent({
  id: "copywriter",
  name: "copywriter",
  model: google('gemini-2.5-flash-lite'),
  instructions: `Your instructions here`,
  tools: { webScraperTool, vectorQueryTool },
  memory: createResearchMemory(),
});
```

### Agent.generate() Call
```typescript
// CORRECT - Message array format
const result = await agent.generate([
  { role: 'user', content: 'Hello' }
]);

// WRONG - No context option exists
const result = await agent.generate(prompt, { context: input }); // ❌

// WRONG - No writer parameter in execute
execute: async ({ inputData, writer }) => {} // ❌
```

## Workflow Patterns (VERIFIED)

### Step Execute Parameters (DEFINITIVE LIST)
```typescript
execute: async ({
  inputData,        // Step input matching inputSchema
  mastra,           // Mastra instance
  getStepResult,    // Get output from previous steps
  getInitData,      // Get workflow's initial input
  suspend,          // Pause workflow execution
  runId,            // Current run identifier
  runtimeContext?,  // Optional runtime context
  runCount?         // Step execution count
}) => {
  // NO writer parameter
  // NO context parameter
  // Implementation here
}
```

### Workflow Composition
```typescript
import { createWorkflow, createStep } from '@mastra/core/workflows';

const workflow = createWorkflow({
  id: 'my-workflow',
  description: 'Description',
  inputSchema: z.object({...}),
  outputSchema: z.object({...})
})
  .then(step1)
  .then(step2)
  .map(async ({ getStepResult }) => {
    // Combine multiple previous step outputs
    const result1 = getStepResult(step1);
    const result2 = getStepResult(step2);
    return { combined: result1, previous: result2 };
  })
  .then(step3)
  .commit();
```

### streamVNext API (EXPERIMENTAL)
```typescript
const run = await workflow.createRunAsync();
const stream = run.streamVNext({
  inputData: { ... },
  runtimeContext?: RuntimeContext,
  metadata?: Record<string, any>,
  closeOnSuspend?: boolean
});

// Available properties
stream.result   // Promise<WorkflowResult>
stream.status   // Promise<RunStatus>
stream.usage    // Promise<TokenUsage>
stream.traceId  // string for observability

// Stream events emitted
- workflow-start
- workflow-step-start
- workflow-step-output
- workflow-step-result
- workflow-finish
```

## Storage Patterns (VERIFIED)

### LibSQL Storage
```typescript
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { Memory } from "@mastra/memory";

// Function export pattern (NOT a class)
export function createResearchMemory() {
  return new Memory({
    storage: sqlstore,
    ...config
  });
}

// Used in agents
export const copywriterAgent = new Agent({
  memory: createResearchMemory(),
  ...
});
```

## Tool Patterns (VERIFIED)

### Tool Creation
```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const vectorQueryTool = createTool({
  id: 'vector-query',
  description: 'Search vector database',
  inputSchema: z.object({...}),
  outputSchema: z.object({...}),
  execute: async ({ context }) => {
    // Implementation
    return result;
  }
});
```

## Schema Export Patterns (VERIFIED)

### Schema Object Export
```typescript
// CORRECT - camelCase export name
export const agentOutputSchemas = {
  answerer: answererOutputSchema,
  copywriter: copywriterOutputSchema,
  editor: editorOutputSchema,
  // ... all camelCase keys
};

// WRONG - PascalCase export name
export const AgentOutputSchemas = { ... }; // ❌
```

## Cedar Integration Patterns (VERIFIED)

### State Registration
```typescript
import { useRegisterState } from 'cedar-os';

useRegisterState({
  key: 'nodes',
  value: nodes,
  setValue: setNodes,
  description: 'Product roadmap nodes',
  stateSetters: {
    addNode: {
      name: 'addNode',
      description: 'Add a new node to the roadmap',
      argsSchema: z.object({
        node: z.object({...})
      }),
      execute: (currentNodes, args) => {
        // Implementation
      }
    }
  }
});
```

### Agent Response Format for Cedar Actions
```typescript
// setState type response
{
  type: 'setState',
  stateKey: 'nodes',
  setterKey: 'addNode',
  args: { node: { data: {...} } }
}

// frontendTool type response
{
  type: 'frontendTool',
  toolName: 'showNotification',
  args: { message: 'Success!', type: 'success' }
}
```

### Cedar Context in Workflows
```typescript
export const cedarContextSchema = z.object({
  selectedFeatures: z.array(z.string()).optional(),
  userPreferences: z.record(z.string(), z.any()).optional(),
  sessionState: z.any().optional()
}).optional();

export const cedarActionSchema = z.object({
  type: z.literal("setState"),
  stateKey: z.string(),
  setterKey: z.string(),
  args: z.array(z.any())
}).optional();
```

## Mastra Registration (VERIFIED)

### Agent Registration
```typescript
import { Mastra } from "@mastra/core";
import { answererAgent } from "./agents/answerer.agent";
import { copywriterAgent } from "./agents/copywriterAgent";

export const mastra = new Mastra({
  agents: {
    answerer: answererAgent,
    copywriter: copywriterAgent,
    editor: editorAgent,
    // All camelCase keys
  },
  workflows: {
    'governed-rag-answer': governedRagAnswer,
    'content-generation': contentGenerationWorkflow,
    // kebab-case for workflow IDs
  }
});
```

## Common Mistakes to AVOID

### ❌ WRONG Patterns
```typescript
// WRONG: PascalCase agent exports
export const CopywriterAgent = new Agent({...});

// WRONG: Non-existent execute parameters
execute: async ({ inputData, writer, context }) => {}

// WRONG: Non-existent agent.generate() options
agent.generate(prompt, { context: input });

// WRONG: PascalCase schema export
export const AgentOutputSchemas = { ... };

// WRONG: Using .step() instead of .then()
workflow.step(myStep);
```

### ✅ CORRECT Patterns
```typescript
// CORRECT: camelCase agent exports
export const copywriterAgent = new Agent({...});

// CORRECT: Only valid execute parameters
execute: async ({ inputData, mastra, getStepResult }) => {}

// CORRECT: Message array format
agent.generate([{ role: 'user', content: prompt }]);

// CORRECT: camelCase schema export
export const agentOutputSchemas = { ... };

// CORRECT: Using .then() for sequential steps
workflow.then(myStep);
```

## Official Documentation URLs (ALL VERIFIED)

### Mastra Core
- Agent: https://mastra.ai/en/reference/agents/agent
- .generate(): https://mastra.ai/en/reference/agents/generate
- Workflow: https://mastra.ai/en/reference/workflows/workflow
- Step: https://mastra.ai/en/reference/workflows/step
- streamVNext: https://mastra.ai/en/reference/streaming/workflows/streamVNext

### Workflow Methods
- .then(): https://mastra.ai/en/reference/workflows/workflow-methods/then
- .map(): https://mastra.ai/en/reference/workflows/workflow-methods/map
- Input Mapping: https://mastra.ai/en/docs/workflows/input-data-mapping

### Cedar Integration
- Mastra Integration: https://docs.cedarcopilot.com/agent-backend-connection/mastra
- State Access: https://docs.cedarcopilot.com/state-access/agentic-state-access
- Agentic Actions: https://docs.cedarcopilot.com/state-access/agentic-actions

## Verified File Locations

### Actual Agent Files
```
src/mastra/agents/
├── answerer.agent.ts          → exports: answererAgent
├── copywriterAgent.ts         → exports: copywriterAgent
├── editorAgent.ts             → exports: editorAgent
├── evaluationAgent.ts         → exports: evaluationAgent
├── retrieve.agent.ts          → exports: retrieveAgent
├── rerank.agent.ts            → exports: rerankAgent
└── verifier.agent.ts          → exports: verifierAgent
```

### Actual Tool Files
```
src/mastra/tools/
├── vector-query.tool.ts       → exports: vectorQueryTool
├── web-scraper-tool.ts        → exports: webScraperTool
└── copywriter-agent-tool.ts   → exports: copywriterAgentTool
```

### Storage Files
```
src/mastra/config/
├── libsql-storage.ts          → exports: createResearchMemory()
├── vector-store.ts            → exports: qdrantVector
└── logger.ts                  → exports: log
```

---

**Last Updated**: 2025-10-02
**Verification Method**: Direct codebase inspection + official documentation fetch
**Status**: PRODUCTION-READY ✅
