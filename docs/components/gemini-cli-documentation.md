---
title: Gemini CLI Configuration - Technical Documentation
component_path: `src/mastra/config/gemini-cli.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra / Backend
tags: [config, ai, gemini, cli, oauth, documentation]
---

# Gemini CLI Configuration Documentation

Configuration module for Gemini AI models using CLI provider with OAuth authentication support. Provides pre-configured model instances that automatically handle authentication based on environment (OAuth for dev, API key for production).

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide configured Gemini AI model instances with flexible authentication.

- OVR-002: Scope includes auth type detection, OAuth token caching, and model instance exports. It deliberately excludes model usage logic.

- OVR-003: Context: Used in CLI tools and development environments where OAuth flow is preferred over API keys.

## 2. Architecture Section

- ARC-001: Design patterns: Configuration module with environment-aware authentication.

- ARC-002: Dependencies:
    - `ai-sdk-provider-gemini-cli`: createGeminiProvider

- ARC-003: Interactions: Detects auth type from environment, creates provider with appropriate auth, exports model instances.

- ARC-004: Visual/behavioral decisions: OAuth for development (interactive), API key for production. Supports experimental audio models.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Gemini CLI Config"
        GCC[gemini-cli.ts] --> CGP[createGeminiProvider]
        GCC --> GAI[geminiAI]
        GCC --> GAIF[geminiAIFlash]
        GCC --> GAIFL[geminiAIFlashLite]
        GCC --> GAIFI[geminiAIFlashimg]
        GCC --> GAIV[geminiAIv]
        GCC --> GAIV2[geminiAIv2]
        GCC --> GAIV3[geminiAIv3]
    end

    subgraph "Environment"
        GCC --> GGAK[GOOGLE_GENERATIVE_AI_API_KEY]
        GCC --> NODE_ENV[NODE_ENV]
        GCC --> GOC[GEMINI_OAUTH_CACHE]
    end

    classDiagram
        class GeminiCLIConfig {
            +geminiAI: GeminiModel
            +geminiAIFlash: GeminiModel
            +geminiAIFlashLite: GeminiModel
            +geminiAIFlashimg: GeminiModel
            +geminiAIv: GeminiModel
            +geminiAIv2: GeminiModel
            +geminiAIv3: GeminiModel
        }
```

## 3. Interface Documentation

- INT-001: Exports model instances and default provider.

| Export              | Purpose                  | Type          | Usage Notes               |
| ------------------- | ------------------------ | ------------- | ------------------------- |
| `geminiAI`          | Gemini 2.5 Pro           | `GeminiModel` | Standard high-performance |
| `geminiAIFlash`     | Gemini 2.5 Flash         | `GeminiModel` | Balanced performance      |
| `geminiAIFlashLite` | Gemini 2.5 Flash Lite    | `GeminiModel` | Cost-optimized            |
| `geminiAIFlashimg`  | Flash with image preview | `GeminiModel` | Image processing          |
| `geminiAIv`         | Native audio dialog      | `GeminiModel` | Audio conversation        |
| `geminiAIv2`        | Text-to-speech preview   | `GeminiModel` | TTS capabilities          |
| `geminiAIv3`        | Audio thinking dialog    | `GeminiModel` | Advanced audio            |

## 4. Implementation Details

- IMP-001: Detects auth type based on API key presence and NODE_ENV.
- IMP-002: Uses OAuth for development with token caching.
- IMP-003: Falls back to API key auth for production.
- IMP-004: Exports multiple model variants including experimental ones.

Corner cases and considerations:

- OAuth requires interactive login for token acquisition.
- Cache directory for storing OAuth tokens.
- Experimental models may have different stability guarantees.

## 5. Usage Examples

### Using in CLI tools

```ts
import { geminiAI } from '@/src/mastra/config/gemini-cli'

// CLI agent for development
const cliAgent = createAgent({
    name: 'CLIAssistant',
    model: geminiAI,
    // ...
})
```

### Custom model creation

```ts
import gemini from '@/src/mastra/config/gemini-cli'

const customModel = gemini('gemini-2.5-pro', {
    // custom options
})
```

### Environment setup

```bash
# For production (API key auth)
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key
NODE_ENV=production

# For development (OAuth auth)
# No API key needed, will prompt for OAuth
GEMINI_OAUTH_CACHE=/path/to/cache/dir
NODE_ENV=development
```

## 6. Quality Attributes

- QUA-001 Security: OAuth for dev prevents API key exposure. API key for prod.
- QUA-002 Performance: Pre-configured instances. OAuth caching reduces auth overhead.
- QUA-003 Reliability: Auth type auto-detection. Fallback auth methods.
- QUA-004 Maintainability: Centralized auth logic.
- QUA-005 Extensibility: Easy to add new experimental models.

## 7. Reference Information

- REF-001: Dependencies (approximate):
    - ai-sdk-provider-gemini-cli (^1.0.0)

- REF-002: Configuration
    - GOOGLE_GENERATIVE_AI_API_KEY (for API key auth)
    - NODE_ENV (determines auth type)
    - GEMINI_OAUTH_CACHE (optional cache directory)

- REF-003: Testing guidelines
    - Mock auth environment. Test both auth types.

- REF-004: Troubleshooting
    - Issue: OAuth login required — run in interactive terminal.
    - Issue: Cache permission errors — check cache directory access.

- REF-005: Related docs
    - Gemini AI documentation
    - Other AI config files

- REF-006: Change history
    - 1.0 (2025-09-23) - Initial documentation generated
