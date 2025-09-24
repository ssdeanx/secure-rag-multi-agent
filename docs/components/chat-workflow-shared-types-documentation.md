---
title: ChatWorkflowSharedTypes - Technical Documentation
component_path: `src/mastra/workflows/chatWorkflowSharedTypes.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra Workflows / Backend
tags: [types, schemas, zod, chat, documentation]
---

# ChatWorkflowSharedTypes Documentation

TypeScript type definitions and Zod schemas shared across chat workflows, including messages, actions, agent responses, and roadmap-specific node actions. Ensures type safety for inputs/outputs and structured agent responses.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Define consistent data shapes for chat interactions and roadmap manipulations.

- OVR-002: Scope: Schemas for Message, Action, ChatAgentResponse; roadmap types (FeatureNodeData, Node, actions like AddNodeAction). Excludes implementation.

- OVR-003: Context: Used in chatWorkflow.ts and agents for validation and type checking.

## 2. Architecture Section

- ARC-001: Design patterns: Type/schema centralization for domain (chat/roadmap).

- ARC-002: Dependencies: zod (schemas), reactflow (Node/Edge types, inferred)

- ARC-003: Interactions: Schemas validate workflow I/O; types guide agent outputs (e.g., action JSON).

- ARC-004: Decisions: Zod for runtime validation; union for action types; defaults in FeatureNodeData.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Types"
        MT[MessageSchema] --> CW[ChatWorkflow]
        AT[ActionSchema] --> ARA[ActionResponseSchema]
        CARS[ChatAgentResponseSchema] --> A[Agent]
    end

    subgraph "Roadmap Types"
        FNDS[FeatureNodeDataSchema] --> NS[NodeSchema]
        ANA[AddNodeActionSchema] --> ARS[ActionResponseSchema]
        RNA[RemoveNodeActionSchema] --> ARS
        CNA[ChangeNodeActionSchema] --> ARS
        EFRS[ExecuteFunctionResponseSchema] --> A
    end

    subgraph "External"
        Z[zod] --> MT
        Z --> FNDS
        RF[reactflow] --> NS
    end

    classDiagram
        class MessageSchema {
            +content: string
            +role: 'user'|'assistant'|'system'
        }
        class ActionSchema {
            +type: 'action'
            +stateKey: string
            +setterKey: string
            +args: any[]
        }
        class FeatureNodeDataSchema {
            +title: string
            +description: string
            +status: enum
            +comments: array
        }

        MessageSchema <|-- ChatAgentResponseSchema
        ActionSchema <|-- AddNodeActionSchema
        FeatureNodeDataSchema --> NodeSchema
```

## 3. Interface Documentation

- INT-001: Exported schemas/types.

| Schema/Type | Purpose | Key Fields | Notes |
|-------------|---------|------------|-------|
| `MessageSchema` | Chat message | `content, role` | Zod object |
| `ActionSchema` | State action | `type, stateKey, setterKey, args` | Base for roadmap actions |
| `ChatAgentResponseSchema` | Agent output | `content, action?` | Optional action |

### Roadmap Actions

- AddNodeAction: args [NodeSchema]

- RemoveNodeAction: args [string id]

- ChangeNodeAction: args [NodeSchema]

INT notes:

- INT-003: Unions for polymorphic actions; infer from Zod.

## 4. Implementation Details

- IMP-001: Zod objects with enums/defaults (e.g., status enum, comments array).

- IMP-002: Roadmap: FeatureNodeData with defaults; Node optional id/position/data.

- IMP-003: Actions: Literal types for type/setterKey; array args.

- IMP-004: Response: Union of action schemas; ExecuteFunction optional object.

Edge cases and considerations:

- Optional fields: Handled by Zod .optional().

- Enum validation: Runtime checks via Zod.

## 5. Usage Examples

### Schema Validation

```ts
const input = ChatInputSchema.parse({prompt: 'Hi'});
const message: Message = {content: 'Hi', role: 'user'};
```

### Agent Response Typing

```ts
const response: ChatAgentResponse = {
  content: 'Added',
  action: {type: 'setState', stateKey: 'nodes', setterKey: 'addNode', args: [node]}
};
```

Best practices:

- Use parse() for runtime safety.

- Extend for new actions.

## 6. Quality Attributes

- QUA-001 Security: Schemas validate inputs; no secrets.

- QUA-002 Performance: Compile-time types; Zod fast.

- QUA-003 Reliability: Defaults prevent invalid states.

- QUA-004 Maintainability: Central; easy to add schemas.

- QUA-005 Extensibility: Add enums/unions for new domains.

## 7. Reference Information

- REF-001: Dependencies: zod (^3), reactflow (types)

- REF-002: Configuration: None; pure types.

- REF-003: Testing: Zod test schemas; type checks.

- REF-004: Troubleshooting: Parse errors — check field types.

- REF-005: Related: chatWorkflow.ts

- REF-006: Change history: 1.0 (2025-09-23)
