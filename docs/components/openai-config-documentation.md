---
title: OpenAIConfig - Technical Documentation
component_path: `src/mastra/config/openai.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra AI / Backend
tags: [config, openai, sdk, timeout, ai]
---

# OpenAIConfig Documentation

Configuration for OpenAI provider using @ai-sdk/openai, with custom fetch timeout (10min) for long reasoning. Separate embedding config; exports provider/models.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Setup OpenAI for generation/embeddings with extended timeouts.

- OVR-002: Scope: createOpenAI with env key/baseURL; custom fetch AbortController (600s); exports main/embedding providers + model. Excludes usage.

- OVR-003: Context: Fallback/alternative to Gemini in agents.

## 2. Architecture Section

- ARC-001: Design patterns: Provider with custom transport.

- ARC-002: Dependencies: @ai-sdk/openai (createOpenAI), dotenv (env)

- ARC-003: Interactions: Exported for agent models; custom fetch prevents hangs.

- ARC-004: Timeout: 600s for reasoning; separate embedding (real OpenAI).

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    OC[OpenAIConfig] --> CO[createOpenAI (main)]
    OC --> COE[createOpenAI (embedding)]
    CO --> OM[openAIModel: gpt-4o-mini]
    COE --> OEP[openAIEmbeddingProvider]

    Env[OPENAI_API_KEY, BASE_URL, MODEL] --> CO
    EnvE[OPENAI_EMBEDDING_API_KEY, BASE_URL] --> COE

    subgraph "Custom Fetch"
        CF[AbortController 600s] --> CO
    end

    subgraph "Usage"
        A[Agent] --> OM
        Emb[Embed] --> OEP
    end

    subgraph "External"
        SDK[OpenAI SDK] --> CO
    end

    classDiagram
        class OpenAIProvider {
            +apiKey: string
            +baseURL?: string
            +headers?: object
            +fetch?: Function
            +model(id): Model
        }
        class Config {
            +openAIConfig: {apiKey, baseURL, model}
            +openAIEmbeddingConfig: {apiKey, baseURL}
        }

        OpenAIConfig --> OpenAIProvider
```

## 3. Interface Documentation

- INT-001: Exported configs/providers.

| Export | Purpose | Config | Notes |
|--------|---------|--------|-------|
| `openAIConfig` | Main settings | `{apiKey, baseURL, model}` | gpt-4o-mini default |
| `openAIProvider` | Main provider | `createOpenAI(...)` | Custom fetch/headers |
| `openAIModel` | Default model | `provider(model)` | For generation |
| `openAIEmbeddingConfig` | Embedding | `{apiKey, baseURL}` | Real OpenAI |
| `openAIEmbeddingProvider` | Embedding provider | `createOpenAI(...)` | Separate key |

INT notes:

- INT-003: Timeout via custom fetch.

## 4. Implementation Details

- IMP-001: dotenv.config(); configs from env with defaults.

- IMP-002: Main provider: Key/baseURL, headers timeout, custom fetch with AbortController.

- IMP-003: Model: provider(env model).

- IMP-004: Embedding: Separate provider/key for embeddings.

Edge cases and considerations:

- No key: Empty string (SDK error).

- Timeout: 10min for long calls.

## 5. Usage Examples

### Provider Use

```ts
import { openAIModel } from '../config/openai';

const agent = new Agent({model: openAIModel});
```

### Custom Call

```ts
const result = await openAIProvider.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [...]
});
```

Best practices:

- Use embedding provider for vectors.

- Monitor timeouts for long prompts.

## 6. Quality Attributes

- QUA-001 Security: Env keys.

- QUA-002 Performance: Timeout prevents hangs.

- QUA-003 Reliability: Separate embedding.

- QUA-004 Maintainability: Central configs.

- QUA-005 Extensibility: Add models/headers.

## 7. Reference Information

- REF-001: Dependencies: @ai-sdk/openai, dotenv

- REF-002: Env: OPENAI_API_KEY, BASE_URL, MODEL, EMBEDDING_*

- REF-003: Testing: Mock fetch.

- REF-004: Troubleshooting: Timeout — increase or check prompt.

- REF-005: Related: Agents

- REF-006: Change history: 1.0 (2025-09-23)
