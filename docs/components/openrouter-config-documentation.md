---
title: OpenRouterConfig - Technical Documentation
component_path: `src/mastra/config/openrouter.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra AI / Backend
tags: [config, openrouter, grok, ai, sdk]
---

# OpenRouterConfig Documentation

Configuration for OpenRouter AI provider using @openrouter/ai-sdk-provider, exporting Grok-4-fast model with reasoning/streaming options.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Setup OpenRouter for alternative LLM access.

- OVR-002: Scope: createOpenRouter with key; exports openGrokAI with includeReasoning/extraBody/usage. Excludes multi-model.

- OVR-003: Context: Fallback/provider for agents needing Grok.

## 2. Architecture Section

- ARC-001: Design patterns: Provider factory with options.

- ARC-002: Dependencies: @openrouter/ai-sdk-provider (createOpenRouter)

- ARC-003: Interactions: Model with reasoning max_tokens=20000, stream=true, usage include.

- ARC-004: Free tier: grok-4-fast:free

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    ORC[OpenRouterConfig] --> CO[createOpenRouter]
    CO --> OG[openGrokAI: x-ai/grok-4-fast:free]
    Env[OPENROUTER_API_KEY] --> CO

    OG --> Opt[{includeReasoning: true, extraBody: {reasoning: {max_tokens: 20000}, stream: true}, usage: {include: true}}]

    subgraph "Usage"
        A[Agent] --> OG
    end

    subgraph "External"
        OR[OpenRouter SDK] --> CO
    end

    classDiagram
        class OpenRouterProvider {
            +apiKey: string
            +model(id, options): Model
        }
        class GrokModel {
            +includeReasoning: bool
            +extraBody: object
            +usage: object
        }

        OpenRouterConfig --> OpenRouterProvider
```

## 3. Interface Documentation

- INT-001: Exported model.

| Export       | Model ID                | Options                                                        | Notes     |
| ------------ | ----------------------- | -------------------------------------------------------------- | --------- |
| `openGrokAI` | `x-ai/grok-4-fast:free` | `{includeReasoning, extraBody (reasoning 20k, stream), usage}` | Free tier |

INT notes:

- INT-003: Options fixed; override in calls.

## 4. Implementation Details

- IMP-001: createOpenRouter({apiKey: env}).

- IMP-002: Model with options for reasoning/stream/usage.

- IMP-003: No custom fetch.

- IMP-004: Free model for cost.

Edge cases and considerations:

- No key: SDK error.

- Limit exceeded: Usage tracks.

## 5. Usage Examples

### In Agent

```ts
import { openGrokAI } from '../config/openrouter'

const agent = new Agent({ model: openGrokAI })
```

### Call with Options

```ts
const result = await openGrokAI.generate('Query', { stream: true })
```

Best practices:

- Monitor usage for free tier.

- Use for reasoning tasks.

## 6. Quality Attributes

- QUA-001 Security: Env key.

- QUA-002 Performance: Stream for real-time.

- QUA-003 Reliability: Usage include for billing.

- QUA-004 Maintainability: Simple export.

- QUA-005 Extensibility: Add models.

## 7. Reference Information

- REF-001: Dependencies: @openrouter/ai-sdk-provider

- REF-002: Env: OPENROUTER_API_KEY

- REF-003: Testing: Mock provider.

- REF-004: Troubleshooting: Key invalid — check env.

- REF-005: Related: Agents

- REF-006: Change history: 1.0 (2025-09-23)
