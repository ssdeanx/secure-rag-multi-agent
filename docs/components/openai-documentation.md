---
title: OpenAI Configuration - Technical Documentation
component_path: `src/mastra/config/openai.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra / Backend
tags: [config, ai, openai, timeout, documentation]
---

# OpenAI Configuration Documentation

Configuration module for OpenAI API integration with extended timeouts for reasoning models. Provides pre-configured OpenAI provider instances for chat models and embeddings with custom fetch implementation.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide configured OpenAI API clients for the application with extended timeouts.

- OVR-002: Scope includes environment-based configuration, custom fetch with timeouts, and separate providers for chat and embeddings. It deliberately excludes model usage logic.

- OVR-003: Context: Used by agents and workflows requiring OpenAI models with support for long-running reasoning tasks.

## 2. Architecture Section

- ARC-001: Design patterns: Configuration module with environment-driven setup and custom fetch wrapper.

- ARC-002: Dependencies:

  - `@ai-sdk/openai`: createOpenAI
  - `dotenv`: Environment loading

- ARC-003: Interactions: Loads environment variables, creates providers with custom timeouts, exports configured instances.

- ARC-004: Visual/behavioral decisions: 10-minute timeouts for reasoning models. Separate providers for chat vs embeddings to allow different API keys.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "OpenAI Config"
        OC[openai.ts] --> CO[createOpenAI]
        OC --> OAC[openAIConfig]
        OC --> OAP[openAIProvider]
        OC --> OAM[openAIModel]
        OC --> OAEC[openAIEmbeddingConfig]
        OC --> OAEP[openAIEmbeddingProvider]
    end

    subgraph "Environment"
        OC --> OAK[OPENAI_API_KEY]
        OC --> OABU[OPENAI_BASE_URL]
        OC --> OAM[OPENAI_MODEL]
        OC --> OEAK[OPENAI_EMBEDDING_API_KEY]
    end

    classDiagram
        class OpenAIConfig {
            +openAIConfig: object
            +openAIProvider: OpenAIProvider
            +openAIModel: OpenAIModel
            +openAIEmbeddingConfig: object
            +openAIEmbeddingProvider: OpenAIProvider
        }
```

## 3. Interface Documentation

- INT-001: Exports configuration objects and provider instances.

| Export | Purpose | Type | Usage Notes |
|--------|---------|------|-------------|
| `openAIConfig` | Chat model config | `{apiKey, baseURL, model}` | From environment |
| `openAIProvider` | Chat provider | `OpenAIProvider` | With custom timeouts |
| `openAIModel` | Default chat model | `OpenAIModel` | Configured model instance |
| `openAIEmbeddingConfig` | Embedding config | `{apiKey, baseURL}` | Separate API key support |
| `openAIEmbeddingProvider` | Embedding provider | `OpenAIProvider` | For embedding operations |

## 4. Implementation Details

- IMP-001: Loads dotenv to ensure environment variables are available.
- IMP-002: Custom fetch implementation with AbortController for 10-minute timeouts.
- IMP-003: Separate providers allow different API keys for chat vs embeddings.
- IMP-004: Fallbacks for all environment variables with sensible defaults.

Corner cases and considerations:

- Empty API keys will cause OpenAI client to fail at usage time.
- Custom fetch handles cleanup of timeout timers.
- Embedding config falls back to main API key if embedding-specific key not set.

## 5. Usage Examples

### Using chat model

```ts
import { openAIModel } from '@/src/mastra/config/openai';

// Use in agent
const agent = createAgent({
  name: 'ChatAgent',
  model: openAIModel,
  // ...
});
```

### Using embedding provider

```ts
import { openAIEmbeddingProvider } from '@/src/mastra/config/openai';

const embeddingModel = openAIEmbeddingProvider('text-embedding-3-small');
// Use for document embedding
```

### Custom model with provider

```ts
import { openAIProvider } from '@/src/mastra/config/openai';

const customModel = openAIProvider('gpt-4-turbo-preview');
// Use for specific tasks
```

### Environment configuration

```bash
# Required for basic usage
OPENAI_API_KEY=sk-...

# Optional
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# Separate embedding key (optional)
OPENAI_EMBEDDING_API_KEY=sk-...
```

## 6. Quality Attributes

- QUA-001 Security: API keys loaded from environment, not hardcoded.
- QUA-002 Performance: Extended timeouts prevent premature aborts on long reasoning tasks.
- QUA-003 Reliability: Custom fetch with proper cleanup. Environment validation through usage.
- QUA-004 Maintainability: Centralized configuration with clear separation of concerns.
- QUA-005 Extensibility: Easy to add new model variants or providers.

## 7. Reference Information

- REF-001: Dependencies (approximate):
  - @ai-sdk/openai (^1.0.0)
  - dotenv (^16.0.0)

- REF-002: Configuration
  - OPENAI_API_KEY (required)
  - OPENAI_BASE_URL (optional)
  - OPENAI_MODEL (optional, default: gpt-4o-mini)
  - OPENAI_EMBEDDING_API_KEY (optional)

- REF-003: Testing guidelines
  - Mock environment variables.
  - Test timeout behavior with slow responses.

- REF-004: Troubleshooting
  - Issue: Timeout errors — check network or increase timeout.
  - Issue: Auth errors — verify API key validity.

- REF-005: Related docs
  - OpenAI API documentation
  - Other AI config files (vertex.ts, google.ts, etc.)

- REF-006: Change history
  - 1.0 (2025-09-23) - Initial documentation generated