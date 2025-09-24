---
title: Vertex AI Configuration - Technical Documentation
component_path: `src/mastra/config/vertex.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra / Backend
tags: [config, ai, vertex, google, gemini, documentation]
---

# Vertex AI Configuration Documentation

Configuration module for Google Vertex AI Gemini models. Provides pre-configured model instances for use in Mastra agents and workflows with proper authentication and project setup.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide configured Vertex AI model instances for the application.

- OVR-002: Scope includes environment validation, Vertex client creation, and model instance exports. It deliberately excludes model usage logic (handled by consumers).

- OVR-003: Context: Imported by agents and workflows that need Google Gemini models via Vertex AI.

## 2. Architecture Section

- ARC-001: Design patterns: Configuration module pattern. Exports pre-configured model instances.

- ARC-002: Dependencies:

  - `@ai-sdk/google-vertex`: createVertex function

- ARC-003: Interactions: Validates environment on import, creates Vertex client, exports model instances.

- ARC-004: Visual/behavioral decisions: Throws error if required GOOGLE_CLOUD_PROJECT is missing. Supports both API key and service account authentication.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Vertex Config"
        VC[vertex.ts] --> CV[createVertex]
        VC --> VAP[vertexAIPro]
        VC --> VAF[vertexAIFlash]
        VC --> VAFL[vertexAIFlashLite]
    end

    subgraph "Environment"
        VC --> GCP[GOOGLE_CLOUD_PROJECT]
        VC --> GCL[GOOGLE_CLOUD_LOCATION]
        VC --> GAC[GOOGLE_APPLICATION_CREDENTIALS]
    end

    classDiagram
        class VertexConfig {
            +vertexAIPro: VertexModel
            +vertexAIFlash: VertexModel
            +vertexAIFlashLite: VertexModel
        }
```

## 3. Interface Documentation

- INT-001: Exports model instances and default client.

| Export | Purpose | Type | Usage Notes |
|--------|---------|------|-------------|
| `vertexAIPro` | Gemini 2.5 Pro model | `VertexModel` | High-performance model |
| `vertexAIFlash` | Gemini 2.5 Flash model | `VertexModel` | Balanced performance/cost |
| `vertexAIFlashLite` | Gemini 2.5 Flash Lite model | `VertexModel` | Cost-optimized model |
| `default` | Vertex client instance | `VertexClient` | For custom model creation |

## 4. Implementation Details

- IMP-001: Validates GOOGLE_CLOUD_PROJECT environment variable on import.
- IMP-002: Uses us-central1 as default location if not specified.
- IMP-003: Conditionally includes service account key file if GOOGLE_APPLICATION_CREDENTIALS is set.
- IMP-004: Creates Vertex client with project and auth configuration.

Corner cases and considerations:

- Throws error on missing project ID to fail fast.
- Supports both OAuth (dev) and service account (prod) authentication.
- Location defaults to us-central1 for global availability.

## 5. Usage Examples

### Using pre-configured models

```ts
import { vertexAIPro, vertexAIFlash } from '@/src/mastra/config/vertex';

// Use in agent configuration
const agent = createAgent({
  name: 'ResearchAgent',
  model: vertexAIPro, // High-quality responses
  // ...
});

// Use for cost-effective tasks
const summaryAgent = createAgent({
  name: 'SummaryAgent', 
  model: vertexAIFlash, // Balanced performance
  // ...
});
```

### Custom model creation

```ts
import vertex from '@/src/mastra/config/vertex';

const customModel = vertex('gemini-2.5-pro', {
  // custom options
});
```

### Environment setup

```bash
# Required
GOOGLE_CLOUD_PROJECT=my-project-id

# Optional
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

## 6. Quality Attributes

- QUA-001 Security: Validates required credentials. Supports secure service account auth.
- QUA-002 Performance: Pre-configured instances avoid repeated client creation.
- QUA-003 Reliability: Environment validation prevents runtime failures.
- QUA-004 Maintainability: Centralized model configuration.
- QUA-005 Extensibility: Easy to add new model variants.

## 7. Reference Information

- REF-001: Dependencies (approximate):
  - @ai-sdk/google-vertex (^1.0.0)

- REF-002: Configuration
  - GOOGLE_CLOUD_PROJECT (required)
  - GOOGLE_CLOUD_LOCATION (optional, default: us-central1)
  - GOOGLE_APPLICATION_CREDENTIALS (optional, for service account)

- REF-003: Testing guidelines
  - Mock environment variables for unit tests.
  - Test error handling for missing project ID.

- REF-004: Troubleshooting
  - Issue: "GOOGLE_CLOUD_PROJECT is required" — set environment variable.
  - Issue: Auth errors — verify credentials and permissions.

- REF-005: Related docs
  - Google Cloud Vertex AI documentation
  - Other AI config files (openai.ts, google.ts, etc.)

- REF-006: Change history
  - 1.0 (2025-09-23) - Initial documentation generated