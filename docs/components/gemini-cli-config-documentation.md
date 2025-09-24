---
title: GeminiCLIConfig - Technical Documentation
component_path: `src/mastra/config/gemini-cli.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra AI / Backend
tags: [config, gemini, cli, oauth, ai]
---

# GeminiCLIConfig Documentation

Configuration for Gemini AI using ai-sdk-provider-gemini-cli, supporting OAuth (dev) or API key (prod). Exports multiple 2.5 models including experimental variants for audio/tts.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Setup Gemini provider with auth fallback for local/prod.

- OVR-002: Scope: createGeminiProvider with authType/key/cache; exports 7 models (pro, flash variants, image/audio/tts). Excludes usage.

- OVR-003: Context: Alternative to Google SDK for CLI/OAuth flows in dev.

## 2. Architecture Section

- ARC-001: Design patterns: Conditional provider factory.

- ARC-002: Dependencies: ai-sdk-provider-gemini-cli (createGeminiProvider)

- ARC-003: Interactions: Exported models for agent embedding.

- ARC-004: Auth: OAuth in dev (cache env), API in prod.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    GCC[GeminiCLIConfig] --> CGP[createGeminiProvider]
    CGP --> Auth[authType: oauth-personal | api-key]
    Auth --> Key[API_KEY if api-key]
    Auth --> Cache[GEMINI_OAUTH_CACHE if oauth]

    CGP --> GP[geminiAI: gemini-2.5-pro]
    CGP --> GF[geminiAIFlash: gemini-2.5-flash]
    CGP --> GFL[geminiAIFlashLite: gemini-2.5-flash-lite]
    CGP --> GFI[geminiAIFlashimg: gemini-2.5-flash-image-preview]
    CGP --> GAV[geminiAIv: gemini-2.5-flash-preview-native-audio-dialog]
    CGP --> GAV2[geminiAIv2: gemini-2.5-flash-preview-tts]
    CGP --> GAV3[geminiAIv3: gemini-2.5-flash-exp-native-audio-thinking-dialog]

    Env[GOOGLE_GENERATIVE_AI_API_KEY, NODE_ENV] --> Auth

    subgraph "Usage"
        A[Agent] --> GP
        Emb[Embed/Audio] --> GFI
    end

    subgraph "External"
        CLI[Gemini CLI SDK] --> CGP
    end

    classDiagram
        class GeminiProvider {
            +authType: string
            +apiKey?: string
            +cacheDir?: string
            +model(id, options): Model
        }

        GeminiCLIConfig --> GeminiProvider
```

## 3. Interface Documentation

- INT-001: Exported models.

| Export | Model ID | Purpose | Notes |
|--------|----------|---------|-------|
| `geminiAI` | `gemini-2.5-pro` | Pro generation | {} options |
| `geminiAIFlash` | `gemini-2.5-flash` | Fast gen | {} |
| `geminiAIFlashLite` | `gemini-2.5-flash-lite` | Lite | {} |
| `geminiAIFlashimg` | `gemini-2.5-flash-image-preview` | Image | {} |
| `geminiAIv` /v2/v3 | Experimental audio/tts | Specialized | Preview models |

INT notes:

- INT-003: Empty options; extend per model.

## 4. Implementation Details

- IMP-001: useApiKey = !!key || prod; authType oauth-personal (dev) or api-key.

- IMP-002: createGeminiProvider with conditional key/cacheDir.

- IMP-003: Model exports without params.

- IMP-004: Experimental: Audio/dialog/tts previews.

Edge cases and considerations:

- No key in dev: OAuth.

- Invalid cache: Fallback?

## 5. Usage Examples

### Provider Setup

```ts
import { geminiAI } from '../config/gemini-cli';

const agent = new Agent({model: geminiAI});
```

### With Options

```ts
const model = geminiAIFlashimg({stream: true});
```

Best practices:

- Use OAuth dev for local testing.

- Prod: Secure API key.

## 6. Quality Attributes

- QUA-001 Security: Env key; OAuth tokens cached securely.

- QUA-002 Performance: CLI efficient for local.

- QUA-003 Reliability: Fallback auth.

- QUA-004 Maintainability: Central models.

- QUA-005 Extensibility: Add experimental models.

## 7. Reference Information

- REF-001: Dependencies: ai-sdk-provider-gemini-cli

- REF-002: Env: GOOGLE_GENERATIVE_AI_API_KEY, GEMINI_OAUTH_CACHE, NODE_ENV

- REF-003: Testing: Mock provider.

- REF-004: Troubleshooting: Auth fail — check key/cache.

- REF-005: Related: Agents using models

- REF-006: Change history: 1.0 (2025-09-23)
