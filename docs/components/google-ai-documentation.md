---
title: Google AI Configuration - Technical Documentation
component_path: `src/mastra/config/google.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra / Backend
tags: [config, ai, google, gemini, documentation]
---

# Google AI Configuration Documentation

Configuration module for Google AI Gemini models via direct API. Provides pre-configured model instances for use in Mastra agents and workflows with API key authentication.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide configured Google AI model instances for the application.

- OVR-002: Scope includes API key validation, client creation, and model instance exports. It deliberately excludes model usage logic.

- OVR-003: Context: Used by agents and workflows that need Google Gemini models via direct API (alternative to Vertex AI).

## 2. Architecture Section

- ARC-001: Design patterns: Configuration module pattern. Exports pre-configured model instances.

- ARC-002: Dependencies:
    - `@ai-sdk/google`: createGoogleGenerativeAI

- ARC-003: Interactions: Creates Google AI client with API key, exports model instances.

- ARC-004: Visual/behavioral decisions: Uses direct API key authentication. Includes embedding model for vector operations.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Google AI Config"
        GC[google.ts] --> CG[createGoogleGenerativeAI]
        GC --> GAP[googleAIPro]
        GC --> GA[googleAI]
        GC --> GAFL[googleAIFlashLite]
        GC --> GAE[googleAIEmbedding]
    end

    subgraph "Environment"
        GC --> GGAK[GOOGLE_GENERATIVE_AI_API_KEY]
    end

    classDiagram
        class GoogleAIConfig {
            +googleAIPro: GoogleModel
            +googleAI: GoogleModel
            +googleAIFlashLite: GoogleModel
            +googleAIEmbedding: GoogleModel
        }
```

## 3. Interface Documentation

- INT-001: Exports model instances.

| Export              | Purpose                     | Type          | Usage Notes               |
| ------------------- | --------------------------- | ------------- | ------------------------- |
| `googleAIPro`       | Gemini 2.5 Pro model        | `GoogleModel` | High-performance model    |
| `googleAI`          | Gemini 2.5 Flash model      | `GoogleModel` | Balanced performance/cost |
| `googleAIFlashLite` | Gemini 2.5 Flash Lite model | `GoogleModel` | Cost-optimized model      |
| `googleAIEmbedding` | Embedding model             | `GoogleModel` | For document embeddings   |

## 4. Implementation Details

- IMP-001: Creates Google AI client with API key from environment.
- IMP-002: Exports multiple model variants for different use cases.
- IMP-003: Includes embedding model for vector operations.

Corner cases and considerations:

- API key is required; client will fail without it.
- Uses direct Google AI API (not Vertex AI).
- Embedding model is separate for vector storage operations.

## 5. Usage Examples

### Using models in agents

```ts
import { googleAIPro, googleAI } from '@/src/mastra/config/google'

// High-quality agent
const researchAgent = createAgent({
    name: 'ResearchAgent',
    model: googleAIPro,
    // ...
})

// Cost-effective agent
const summaryAgent = createAgent({
    name: 'SummaryAgent',
    model: googleAI,
    // ...
})
```

### Using embedding model

```ts
import { googleAIEmbedding } from '@/src/mastra/config/google'

// For document embedding
const embeddings = await googleAIEmbedding.embed({
    value: 'document text',
})
```

### Environment setup

```bash
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here
```

## 6. Quality Attributes

- QUA-001 Security: API key from environment, not hardcoded.
- QUA-002 Performance: Pre-configured instances avoid client recreation.
- QUA-003 Reliability: Simple configuration with minimal failure points.
- QUA-004 Maintainability: Centralized model configuration.
- QUA-005 Extensibility: Easy to add new Gemini model variants.

## 7. Reference Information

- REF-001: Dependencies (approximate):
    - @ai-sdk/google (^1.0.0)

- REF-002: Configuration
    - GOOGLE_GENERATIVE_AI_API_KEY (required)

- REF-003: Testing guidelines
    - Mock API key for unit tests.
    - Test model instantiation.

- REF-004: Troubleshooting
    - Issue: Auth errors — verify API key is valid and has proper permissions.

- REF-005: Related docs
    - Google AI Gemini documentation
    - Other AI config files (vertex.ts, openai.ts, etc.)

- REF-006: Change history
    - 1.0 (2025-09-23) - Initial documentation generated
