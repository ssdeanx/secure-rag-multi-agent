---
title: ChatWorkflow - Technical Documentation
component_path: `src/mastra/workflows/chatWorkflow.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra Workflows / Backend
tags: [workflow, mastra, chat, streaming, documentation]
---

# ChatWorkflow Documentation

A Mastra workflow for handling chat interactions, including context fetching, message building, event emission, and agent invocation with streaming support. Replicates /chat/execute-function behavior.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Orchestrate chat flow: input → context → messages → agent call → output.

- OVR-002: Scope: 4 steps (fetchContext, buildAgentContext, emitMastraEvents, callAgent). Supports streaming via controller. Excludes agent definition.

- OVR-003: Context: Used in /api/chat endpoint for conversational AI with roadmap agent.

## 2. Architecture Section

- ARC-001: Design patterns: Sequential workflow with streaming composition.

- ARC-002: Dependencies:

  - @mastra/core (createWorkflow, createStep)

  - zod (schemas: ChatInput/Output)

  - Local: productRoadmapAgent, streamUtils (streamJSONEvent, handleTextStream)

- ARC-003: Interactions: Steps chain input; callAgent streams to controller.

- ARC-004: Decisions: Placeholder events for Mastra nested streaming; optional memory/thread.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Workflow"
        W[ChatWorkflow] --> F[fetchContext Step]
        F --> B[buildAgentContext]
        B --> E[emitMastraEvents]
        E --> C[callAgent]
    end

    subgraph "Streaming"
        C --> PRA[productRoadmapAgent.stream]
        PRA --> H[handleTextStream]
        H --> SC[streamController]
    end

    subgraph "Input/Output"
        API[/api/chat] --> W
        W --> Out[ChatOutput: content, usage]
    end

    subgraph "External"
        M[Mastra Core] --> W
        Z[zod] --> W
    end

    classDiagram
        class ChatWorkflow {
            +inputSchema: ZodObject
            +outputSchema: ZodObject
            +steps: array
        }
        class WorkflowStep {
            +id: string
            +inputSchema: ZodObject
            +outputSchema: ZodObject
            +execute(input): Promise<Output>
        }

        ChatWorkflow --> WorkflowStep
```

## 3. Interface Documentation

- INT-001: Workflow with schemas.

| Schema | Purpose | Fields | Notes |
|--------|---------|--------|-------|
| Input | Chat request | `prompt, temperature, maxTokens, systemPrompt, resourceId, threadId, streamController` | Optional memory/stream |
| Output | Response | `content: string, usage?: any` | From agent |

### Usage

```ts
const result = await chatWorkflow.execute({prompt: 'Hello'});
```

INT notes:

- INT-003: Streaming via streamController in input.

## 4. Implementation Details

- IMP-001: Steps: fetchContext (passthrough with frontend context), buildAgentContext (user message array), emitMastraEvents (placeholder JSON events), callAgent (agent.stream + handleTextStream).

- IMP-002: Streaming: If controller, emit progress/events; handleTextStream forwards chunks.

- IMP-003: Schemas: Zod for validation; optional output for structured.

- IMP-004: Events: 9 Mastra types + alert/unregistered for demo.

Edge cases and considerations:

- No streamController: Falls back to non-stream generate.

- Empty prompt: Builds empty message array.

## 5. Usage Examples

### API Endpoint Integration

```ts
// /api/chat
import { chatWorkflow } from '../mastra/workflows/chatWorkflow';

export async function POST(req) {
  const input = await req.json();
  const result = await chatWorkflow.execute(input);
  return Response.json(result);
}
```

### With Streaming

```ts
const input = {prompt: 'Query', streamController};
const streamResult = await chatWorkflow.execute(input); // Handles via callAgent
```

Best practices:

- Pass threadId/resourceId for memory.

- Use stream for real-time UI.

## 6. Quality Attributes

- QUA-001 Security: Input validation via Zod; no direct secrets.

- QUA-002 Performance: Sequential steps; streaming non-blocking.

- QUA-003 Reliability: Try-catch in steps; fallbacks for stream.

- QUA-004 Maintainability: Modular steps; utils for streaming.

- QUA-005 Extensibility: Add steps (e.g., post-process).

## 7. Reference Information

- REF-001: Dependencies: @mastra/core, zod, local agent/utils

- REF-002: Configuration: Agent model in callAgent.

- REF-003: Testing: Mock agent/stream; validate schemas.

- REF-004: Troubleshooting: No stream — check controller.

- REF-005: Related: productRoadmapAgent.ts

- REF-006: Change history: 1.0 (2025-09-23)
