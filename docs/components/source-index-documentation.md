---
title: Source Index - Technical Documentation
component_path: `src/index.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra / Backend
tags: [index, exports, barrel, typescript, documentation]
---

# Source Index Documentation

Barrel export file for the Mastra source directory. Provides a single entry point for importing core Mastra functionality and type definitions.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide centralized exports for the Mastra source directory.

- OVR-002: Scope includes re-exporting Mastra runtime and core types. It deliberately excludes application-specific exports.

- OVR-003: Context: Used as the main entry point for importing Mastra functionality from the source directory.

## 2. Architecture Section

- ARC-001: Design patterns: Barrel export pattern. Single file that re-exports from multiple modules.

- ARC-002: Dependencies:

  - `./mastra/index`: Mastra runtime exports
  - `./types`: Core type definitions

- ARC-003: Interactions: Pure re-exports with no additional logic.

- ARC-004: Visual/behavioral decisions: Uses wildcard exports for complete module re-export.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Source Index"
        SI[src/index.ts] --> MI[./mastra/index]
        SI --> T[./types]
    end

    subgraph "Re-exported Modules"
        MI --> MR[Mastra Runtime]
        MI --> MA[Mastra Agents]
        MI --> MW[Mastra Workflows]
        T --> CT[Core Types]
    end

    classDiagram
        class SourceIndex {
            +export * from './mastra/index'
            +export * from './types'
        }
```

## 3. Interface Documentation

- INT-001: Re-exports all public APIs from dependent modules.

| Export | Source | Purpose | Usage Notes |
|--------|--------|---------|-------------|
| `*` | `./mastra/index` | Mastra runtime, agents, workflows | Complete Mastra API |
| `*` | `./types` | Core type definitions | TypeScript interfaces |

## 4. Implementation Details

- IMP-001: Uses TypeScript namespace merging for clean imports.
- IMP-002: No runtime code; pure compile-time exports.
- IMP-003: Wildcard exports ensure all public APIs are available.

Corner cases and considerations:

- Import resolution depends on module resolution configuration.
- Tree shaking may not work with wildcard exports.

## 5. Usage Examples

### Importing from source index

```ts
import { Mastra, Agent, createWorkflow } from '@/src';
// or
import * as Mastra from '@/src';
```

### Type imports

```ts
import type { Principal, AccessFilter } from '@/src';
```

## 6. Quality Attributes

- QUA-001 Security: No security implications; pure exports.
- QUA-002 Performance: Zero runtime overhead.
- QUA-003 Reliability: Simple re-exports with no failure points.
- QUA-004 Maintainability: Single file to update for new exports.
- QUA-005 Extensibility: Easy to add new module re-exports.

## 7. Reference Information

- REF-001: Dependencies (approximate):
  - `./mastra/index`
  - `./types`

- REF-002: Configuration
  - No configuration required.

- REF-003: Testing guidelines
  - Import resolution testing.
  - Type checking of re-exports.

- REF-004: Troubleshooting
  - Import errors indicate missing dependencies.
  - Update exports when adding new modules.

- REF-005: Related docs
  - `src/mastra/index.ts` - Mastra runtime exports
  - `src/types.ts` - Core type definitions

- REF-006: Change history
  - 1.0 (2025-09-23) - Initial documentation generated