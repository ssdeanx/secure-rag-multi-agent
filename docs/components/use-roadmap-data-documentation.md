---
title: useRoadmapData - Technical Documentation
component_path: `cedar/useRoadmapData.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Cedar Roadmap / Frontend
tags: [hook, roadmap, reactflow, data]
---

# useRoadmapData Documentation

Lightweight hook that provides initial `nodes` and `edges` arrays for a React Flow roadmap canvas. It's intended as sample/demo data and can be replaced by a data-backed source (API or store) in production.

## 1. Component Overview

- OVR-001: Provide memoized initial nodes and edges for `ReactFlow` usage.

- OVR-002: Scope: returns `{ nodes, edges }` where nodes are typed as `Node<FeatureNodeData>` and edges are `Edge[]`.

## 2. Implementation Details

- IMP-001: Uses `useMemo` to return `initialNodes` and `initialEdges`. This prevents re-creation across renders.

- IMP-002: `initialNodes` sample includes features like `User Authentication`, `Dashboard UI`, `Dark Mode`, each formatted as `FeatureNodeData` used by `FeatureNode`.

## 3. Data Shape

- `Node<FeatureNodeData>` fields include: `id`, `type` (e.g., `featureNode`), `position`, and `data` where `data` contains:
  - `title`, `description`, `status`, `upvotes`, `comments` (array of `{id,author,text,timestamp}`), optional `nodeType`.

- `Edge` sample fields: `id`, `source`, `target`, `type`, `animated`, `label`.

## 4. Usage Example

```ts
import { useRoadmapData } from './useRoadmapData';

function RoadmapContainer() {
  const { nodes, edges } = useRoadmapData();
  return <ReactFlow nodes={nodes} edges={edges} />;
}
```

## 5. Extensibility

- Replace `initialNodes`/`initialEdges` with data from an API, local storage, or a shared state (e.g., Zustand) to enable persistence and collaboration.

## 6. Quality Attributes

- QUA-001 Performance: `useMemo` prevents unnecessary re-instantiation of arrays.
- QUA-002 Maintainability: Keep the `FeatureNodeData` type in sync with `FeatureNode` component.

## 7. Change history

- 1.0 (2025-09-23) - Initial documentation
