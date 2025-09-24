---
title: VertexAIConfig - Technical Documentation
component_path: `src/mastra/config/vertex.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra AI / Backend
tags: [config, vertex, gemini, google, cloud]
---

# VertexAIConfig Documentation

Configuration for Google Vertex AI using @ai-sdk/google-vertex, exporting Gemini 2.5 models. Requires project/location; optional keyFile for auth.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Setup Vertex for cloud-based Gemini access.

- OVR-002: Scope: createVertex with project/location/keyFile; exports pro/flash/lite models. Excludes custom auth.

- OVR-003: Context: Enterprise alternative to direct Google API.

## 2. Architecture Section

- ARC-001: Design patterns: Cloud provider factory.

- ARC-002: Dependencies: @ai-sdk/google-vertex (createVertex)

- ARC-003: Interactions: Models for agents; auth via keyFile or default.

- ARC-004: Location: us-central1 default.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    VAC[VertexAIConfig] --> CV[createVertex]
    CV --> VAP[vertexAIPro: gemini-2.5-pro]
    CV --> VAF[vertexAIFlash: gemini-2.5-flash]
    CV --> VAFL[vertexAIFlashLite: gemini-2.5-flash-lite]

    Env[GOOGLE_CLOUD_PROJECT, LOCATION, APPLICATION_CREDENTIALS] --> CV

    subgraph "Auth"
        Key[keyFile if provided] --> CV
        Default[Default auth] --> CV
    end

    subgraph "Usage"
        A[Agent] --> VAP
    end

    subgraph "External"
        V[Vertex SDK] --> CV
    end

    classDiagram
        class VertexProvider {
            +project: string
            +location: string
            +googleAuthOptions?: {keyFile}
            +model(id): Model
        }

        VertexAIConfig --> VertexProvider
```

## 3. Interface Documentation

- INT-001: Exported models.

| Export | Model ID | Notes |
|--------|----------|-------|
| `vertexAIPro` | `gemini-2.5-pro` | Advanced |
| `vertexAIFlash` | `gemini-2.5-flash` | Fast |
| `vertexAIFlashLite` | `gemini-2.5-flash-lite` | Lite |

INT notes:

- INT-003: No options; extend in calls.

## 4. Implementation Details

- IMP-001: Env project required; location default us-central1; keyFile conditional.

- IMP-002: createVertex with auth options.

- IMP-003: Model exports without params.

- IMP-004: Throw if no project.

Edge cases and considerations:

- No keyFile: Uses default ADC.

- Invalid project: Throw.

## 5. Usage Examples

### In Agent

```ts
import { vertexAIPro } from '../config/vertex';

const agent = new Agent({model: vertexAIPro});
```

Best practices:

- Set keyFile for service account.

- Use for cloud compliance.

## 6. Quality Attributes

- QUA-001 Security: Service account keyFile.

- QUA-002 Performance: Cloud optimized.

- QUA-003 Reliability: Default auth fallback.

- QUA-004 Maintainability: Simple exports.

- QUA-005 Extensibility: Add models.

## 7. Reference Information

- REF-001: Dependencies: @ai-sdk/google-vertex

- REF-002: Env: GOOGLE_CLOUD_PROJECT, LOCATION, APPLICATION_CREDENTIALS

- REF-003: Testing: Mock provider.

- REF-004: Troubleshooting: Project error — check env.

- REF-005: Related: Agents

- REF-006: Change history: 1.0 (2025-09-23)
