---
title: RoadmapCanvas - Technical Documentation
component_path: `cedar/RoadmapCanvas.tsx`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Cedar Roadmap
tags: [reactflow, canvas, roadmap, documentation]
---

# RoadmapCanvas Documentation

React Flow-based canvas that renders roadmap `nodes` and `edges` and provides interactions such as connecting nodes, selecting nodes, and responsive controls.

## 1. Component Overview

- OVR-001: Render interactive roadmap with drag/drop, connectors, and selection handling.

- OVR-002: Scope: uses `useRoadmapData()` for initial data, exposes node/edge editing, and synchronizes selected nodes to shared Cedar state.

- OVR-003: Context: used inside `/cedar-os` page to visualize feature roadmap.

## 2. Architecture & Dependencies

- ARC-001: Built on `reactflow` and project-specific node types (`roadmapNodeTypes`).

- ARC-002: Dependencies:
  - reactflow (React Flow core, Controls, Background, hooks)
  - `roadmapNodeTypes` (custom node renderers)
  - `useRoadmapData` (initial data)
  - `useCedarRoadmap` (custom hook for syncing canvas state)
  - `useCedarState` (shared app state for selected nodes)

## 3. Implementation Details

- IMP-001: State management: uses `useNodesState`/`useEdgesState` to track nodes/edges locally.
- IMP-002: `handleNodesChange` cleans up edges when nodes are removed to avoid orphaned edges.
- IMP-003: `onConnect` adds a new edge with `simplebezier` type and arrow marker.
- IMP-004: Selection events are captured with `useOnSelectionChange` and persisted to Cedar state via `setSelectedNodes`.

## 4. Usage Example

```tsx
<RoadmapCanvas />
```

Considerations:

- Persisting changes: integrate server sync or storage in `useCedarRoadmap` hook to persist node/edge updates.
- Large graphs: enable virtualization or reduce node complexity to maintain performance.

## 5. Testing

- Test node addition, connection, deletion workflow and edge cleanup. Mock `useRoadmapData` for deterministic inputs.

## 6. Change history

- 1.0 (2025-09-23) - Initial documentation
