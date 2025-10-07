---
title: GoogleAIConfig - Technical Documentation
component_path: `src/mastra/config/google.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra AI / Backend
tags: [config, google, gemini, ai, sdk]
---

# GoogleAIConfig Documentation

Configuration for Google Generative AI provider using @ai-sdk/google, exporting models for text generation and embeddings. Uses API key from env.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Setup Gemini models for Mastra agents/workflows.

- OVR-002: Scope: createGoogleGenerativeAI with key; exports pro/flash/lite models + embedding. Excludes custom options.

- OVR-003: Context: Used in agents (e.g., productRoadmapAgent model).

## 2. Architecture Section

- ARC-001: Design patterns: Provider factory.

- ARC-002: Dependencies: @ai-sdk/google (createGoogleGenerativeAI)

- ARC-003: Interactions: Exported models used in agent constructors.

- ARC-004: Models: 2.5 variants for balance of capability/speed.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    GAC[GoogleAIConfig] --> CG[createGoogleGenerativeAI]
    CG --> GAP[googleAIPro: gemini-2.5-pro]
    CG --> GAF[googleAIFlash: gemini-2.5-flash]
    CG --> GAL[googleAIFlashLite: gemini-2.5-flash-lite]
    CG --> GAE[googleAIEmbedding: gemini-embedding-001]

    Env[GOOGLE_GENERATIVE_AI_API_KEY] --> CG

    subgraph "Usage"
        A[Agent] --> GAP
        Emb[Embedder] --> GAE
    end

    subgraph "External"
        AI[Google AI SDK] --> CG
    end

    classDiagram
        class GoogleGenerativeAI {
            +apiKey: string
            +model(id): Model
        }
        class ExportedModels {
            +googleAIPro: Model
            +googleAIFlash: Model
            +googleAIEmbedding: EmbeddingModel
        }

        GoogleAIConfig --> GoogleGenerativeAI
```

## 3. Interface Documentation

- INT-001: Exported models.

| Export              | Purpose             | Model ID                | Notes           |
| ------------------- | ------------------- | ----------------------- | --------------- |
| `googleAIPro`       | Advanced generation | `gemini-2.5-pro`        | High capability |
| `googleAIFlash`     | Fast generation     | `gemini-2.5-flash`      | Balanced        |
| `googleAIFlashLite` | Lightweight         | `gemini-2.5-flash-lite` | Speed-focused   |
| `googleAIEmbedding` | Embeddings          | `gemini-embedding-001`  | Dim=1536?       |

INT notes:

- INT-003: Default options; extend with params.

## 4. Implementation Details

- IMP-001: createGoogleGenerativeAI({apiKey: env}); model calls without options.

- IMP-002: Env: GOOGLE_GENERATIVE_AI_API_KEY required.

- IMP-003: No custom fetch/headers.

- IMP-004: Embedding separate for vector ops.

Edge cases and considerations:

- No key: Runtime error.

- Invalid model: SDK throws.

## 5. Usage Examples

### In Agent

```ts
import { googleAIPro } from '../config/google'

const agent = new Agent({ model: googleAIPro })
```

### Embedding

```ts
const embedder = googleAIEmbedding
const vectors = await embedMany([{ text: 'query' }], { model: embedder })
```

Best practices:

- Use Flash for chat; Pro for complex.

- Secure key (server-only).

## 6. Quality Attributes

- QUA-001 Security: Env key; no client exposure.

- QUA-002 Performance: Model selection per use.

- QUA-003 Reliability: SDK handles retries.

- QUA-004 Maintainability: Central exports.

- QUA-005 Extensibility: Add models/options.

## 7. Reference Information

- REF-001: Dependencies: @ai-sdk/google (^0.0.x)

- REF-002: Env: GOOGLE_GENERATIVE_AI_API_KEY

- REF-003: Testing: Mock SDK.

- REF-004: Troubleshooting: Key error — check env.

- REF-005: Related: Agents using models

- REF-006: Change history: 1.0 (2025-09-23)
