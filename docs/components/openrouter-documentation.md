---
title: OpenRouter Configuration - Technical Documentation
component_path: `src/mastra/config/openrouter.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra / Backend
tags: [config, ai, openrouter, grok, documentation]
---

# OpenRouter Configuration Documentation

Configuration module for OpenRouter API providing access to various AI models including Grok. Provides pre-configured model instances with reasoning capabilities and usage tracking.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide configured OpenRouter model instances for the application.

- OVR-002: Scope includes API key configuration, model setup with reasoning options, and instance exports. It deliberately excludes model usage logic.

- OVR-003: Context: Used for cost-effective or specialized AI tasks via OpenRouter's model marketplace.

## 2. Architecture Section

- ARC-001: Design patterns: Configuration module pattern. Exports pre-configured model instances.

- ARC-002: Dependencies:
    - `@openrouter/ai-sdk-provider`: createOpenRouter

- ARC-003: Interactions: Creates OpenRouter client with API key, configures models with reasoning and streaming options.

- ARC-004: Visual/behavioral decisions: Configured for Grok model with reasoning capabilities. Includes usage tracking and streaming.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "OpenRouter Config"
        ORC[openrouter.ts] --> COR[createOpenRouter]
        ORC --> OGA[openGrokAI]
    end

    subgraph "Environment"
        ORC --> ORAK[OPENROUTER_API_KEY]
    end

    classDiagram
        class OpenRouterConfig {
            +openGrokAI: OpenRouterModel
        }
```

## 3. Interface Documentation

- INT-001: Exports model instances and default client.

| Export       | Purpose           | Type               | Usage Notes               |
| ------------ | ----------------- | ------------------ | ------------------------- |
| `openGrokAI` | Grok 4 Fast model | `OpenRouterModel`  | Free tier with reasoning  |
| `default`    | OpenRouter client | `OpenRouterClient` | For custom model creation |

## 4. Implementation Details

- IMP-001: Creates OpenRouter client with API key from environment.
- IMP-002: Configures Grok model with reasoning (20k tokens), streaming, and usage tracking.
- IMP-003: Uses free tier model for cost optimization.

Corner cases and considerations:

- Requires OpenRouter API key.
- Reasoning tokens are capped at 20k.
- Streaming enabled for real-time responses.

## 5. Usage Examples

### Using Grok model

```ts
import { openGrokAI } from '@/src/mastra/config/openrouter'

// Agent with reasoning capabilities
const reasoningAgent = createAgent({
    name: 'ReasoningAgent',
    model: openGrokAI,
    // ...
})
```

### Custom model creation

```ts
import openrouter from '@/src/mastra/config/openrouter'

const customModel = openrouter('anthropic/claude-3-haiku', {
    // custom options
})
```

### Environment setup

```bash
# Required
OPENROUTER_API_KEY=your-openrouter-key
```

## 6. Quality Attributes

- QUA-001 Security: API key from environment.
- QUA-002 Performance: Streaming enabled. Free tier for cost control.
- QUA-003 Reliability: Usage tracking for monitoring.
- QUA-004 Maintainability: Centralized configuration.
- QUA-005 Extensibility: Easy to add more OpenRouter models.

## 7. Reference Information

- REF-001: Dependencies (approximate):
    - @openrouter/ai-sdk-provider (^1.0.0)

- REF-002: Configuration
    - OPENROUTER_API_KEY (required)

- REF-003: Testing guidelines
    - Mock API key. Test reasoning output.

- REF-004: Troubleshooting
    - Issue: Auth errors — verify OpenRouter API key.
    - Issue: Rate limits — monitor usage tracking.

- REF-005: Related docs
    - OpenRouter documentation
    - Grok AI documentation

- REF-006: Change history
    - 1.0 (2025-09-23) - Initial documentation generated
