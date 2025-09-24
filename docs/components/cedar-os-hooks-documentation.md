---
title: useCedarRoadmap - Technical Documentation
component_path: `app/cedar-os/hooks.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Cedar OS / Frontend
tags: [hook, cedar-os, composition, react, documentation]
---

# useCedarRoadmap Documentation

A composite React hook that orchestrates Cedar OS integration for the roadmap application. It combines state registration, mention providers, and context subscriptions to enable AI-agent interactions with the React Flow-based roadmap canvas.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide a single entry point for all Cedar OS features in the roadmap UI, simplifying integration.

- OVR-002: Scope: Composes three sub-hooks (useRoadmapState, useRoadmapMentions, useRoadmapContext). Handles state exposure to agents, @mentions, and context subscriptions. Excludes core roadmap logic (nodes/edges management).

- OVR-003: Context: Used in Cedar OS page to bridge React state (nodes, edges) with AI agents, allowing conversational manipulation of the roadmap (e.g., "Add a new auth feature").

## 2. Architecture Section

- ARC-001: Design patterns: Hook composition/facade pattern. Encapsulates multiple concerns into a unified interface.

- ARC-002: Dependencies:

  - React (hook definition)

  - reactflow (Node, Edge types)

  - cedar-os (useCedarState, useRegisterState, useStateBasedMentionProvider, useSubscribeStateToAgentContext)

  - Local sub-hooks: useRoadmapState, useRoadmapMentions, useRoadmapContext

- ARC-003: Interactions: Delegates to sub-hooks; no direct agent calls. Enables reactive updates where state changes propagate to agent context and mentions.

- ARC-004: Decisions: Centralizes Cedar integration to avoid hook call scattering. Sub-hooks handle specifics, keeping composition clean.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Cedar OS Page"
        P[CedarOSPage] --> U[useCedarRoadmap]
    end

    subgraph "Composition"
        U --> S[useRoadmapState]
        U --> M[useRoadmapMentions]
        U --> C[useRoadmapContext]
    end

    subgraph "Cedar OS"
        S --> CO[useCedarState/useRegisterState]
        M --> CO
        C --> CO[useSubscribeStateToAgentContext]
        CO --> A[AI Agent]
    end

    subgraph "State/UI"
        R[RoadmapCanvas] --> S
        R --> U
    end

    subgraph "External"
        RF[reactflow] --> S
        CE[cedar-os] --> U
    end

    classDiagram
        class useCedarRoadmap {
            +useRoadmapState(nodes, setNodes, edges, setEdges): void
            +useRoadmapMentions(): void
            +useRoadmapContext(): void
        }
        class CedarOS {
            <<external>>
            +useRegisterState(): void
            +useStateBasedMentionProvider(): void
            +useSubscribeStateToAgentContext(): void
        }

        useCedarRoadmap --> CedarOS
```

## 3. Interface Documentation

- INT-001: Public interface: Hook with roadmap state props.

| Parameter | Purpose | Type | Required | Usage Notes |
|-----------|---------|------|----------|-------------|
| `nodes` | Current roadmap nodes | `Node<FeatureNodeData>[]` | Yes | Passed from React Flow state |
| `setNodes` | Setter for nodes | `React.Dispatch<React.SetStateAction<Node<FeatureNodeData>[]>>` | Yes | React Flow setter |
| `edges` | Current roadmap edges | `Edge[]` | Yes | Passed from React Flow state |
| `setEdges` | Setter for edges | `React.Dispatch<React.SetStateAction<Edge[]>>` | Yes | React Flow setter |

### Hook Usage

```tsx
import { useNodesState, useEdgesState } from 'reactflow';
import { useCedarRoadmap } from './hooks';

function RoadmapContainer() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useCedarRoadmap(nodes, setNodes, edges, setEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    />
  );
}
```

INT notes:

- INT-003: No return value; side-effect hook. Requires CedarProvider ancestor.

## 4. Implementation Details

- IMP-001: Simple composition: Calls three sub-hooks unconditionally. useRoadmapState handles registration/setters; others manage mentions/context.

- IMP-002: Initialization: Relies on React Flow state passed as params. No internal state.

- IMP-003: Key logic: Delegation—each sub-hook performs its role (state exposure, mentions, subscriptions).

- IMP-004: Performance: Minimal overhead; sub-hooks handle their efficiency. Called once per component render cycle.

Edge cases and considerations:

- If React Flow state is empty, sub-hooks handle gracefully (empty arrays).

- Hook must be called inside Cedar context; otherwise, sub-hooks throw.

## 5. Usage Examples

### Basic Usage (in page component)

```tsx
import { useCedarRoadmap } from './hooks';
import { useNodesState, useEdgesState } from 'reactflow';
import { initialNodes, initialEdges } from './useRoadmapData';

export default function CedarOSPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useCedarRoadmap(nodes, setNodes, edges, setEdges);

  return <RoadmapCanvas nodes={nodes} edges={edges} /* ... */ />;
}
```

### Interaction Sequence (mermaid)

```mermaid
sequenceDiagram
    participant P as CedarOSPage
    participant H as useCedarRoadmap
    participant S as useRoadmapState
    participant M as useRoadmapMentions
    participant C as useRoadmapContext
    participant A as AI Agent

    P->>H: Call hook with state setters
    H->>S: Register nodes/edges state
    H->>M: Setup @mention providers
    H->>C: Subscribe to agent context
    Note over S,M,C: Reactive subscriptions active
    P->>A: User chats (e.g., "@auth add dependency")
    A-->>P: Agent uses context/mentions for response
```

### Advanced Usage (with error boundary)

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function CedarRoadmapWithErrorHandling() {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  return (
    <ErrorBoundary fallback={<div>Cedar integration error</div>}>
      <useCedarRoadmap nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />
      {/* Canvas */}
    </ErrorBoundary>
  );
}
```

Best practices:

- Call after React Flow state hooks for fresh params.

- Wrap in ErrorBoundary for production robustness.

- Co-locate with other Cedar hooks in component.

## 6. Quality Attributes

- QUA-001 Security: Exposes only public state (nodes/edges); no auth in hook. Ensure parent handles user data securely.

- QUA-002 Performance: O(1) composition; sub-hooks scale with state size. Avoid in render-heavy loops.

- QUA-003 Reliability: Depends on sub-hooks; test integration end-to-end. Handles missing Cedar context via errors.

- QUA-004 Maintainability: Facade simplifies usage; sub-hooks isolate concerns for easy updates.

- QUA-005 Extensibility: Add new sub-hooks (e.g., useRoadmapAnalytics) by including in composition.

## 7. Reference Information

- REF-001: Dependencies:

  - react (^18) - composition runtime

  - reactflow (^11) - state types

  - cedar-os (latest) - core features

- REF-002: Configuration: Requires CedarProvider. Params from React Flow useNodesState/useEdgesState.

- REF-003: Testing guidelines:

  - Unit: Mock sub-hooks; verify calls with params.

  - Integration: Render with mock state; assert agent context updates.

- REF-004: Troubleshooting

  - Issue: "No Cedar context" — Ensure CedarProvider wraps component tree.

  - Issue: State not propagating — Verify params are up-to-date from React Flow.

- REF-005: Related docs

  - `app/cedar-os/state.ts` (useRoadmapState)

  - `app/cedar-os/mentions.ts` (useRoadmapMentions)

  - `app/cedar-os/context.ts` (useRoadmapContext)

- REF-006: Change history

  - 1.0 (2025-09-23) - Initial documentation
