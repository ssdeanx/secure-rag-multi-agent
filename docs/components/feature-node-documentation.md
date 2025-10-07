---
title: FeatureNode - Technical Documentation
component_path: `cedar/FeatureNode.tsx`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Cedar Roadmap
tags: [reactflow, node, feature, roadmap, documentation]
---

# FeatureNode Documentation

Custom React Flow node used in the roadmap canvas. Supports rich presentation including status badges, inline editing, comments, upvotes, resizing, and handle labeling. This component is intentionally feature-rich to facilitate design-time and runtime editing of roadmap nodes.

## 1. Component Overview

- OVR-001: Visualize a roadmap feature with metadata and interactive affordances (edit, upvote, comments, change status/type, resizing).

- OVR-002: Scope: rendering and local interactions for a single node. Persistence and sync should be handled by the parent canvas/hooks (e.g., `useCedarRoadmap`).

- OVR-003: Context: used as a `nodeType` in `RoadmapCanvas` and rendered by `reactflow`.

## 2. Public Types & Data

- `FeatureNodeData` (core data shape):
    - `title: string`
    - `description: string`
    - `upvotes: number`
    - `comments: Comment[]` ({id, author, text, timestamp?})
    - `status: 'done'|'planned'|'backlog'|'in progress'`
    - `nodeType?: NodeType` (feature/bug/improvement/component/etc.)
    - optional layout fields: `width`, `height`, `packageVersion`, `diff`

## 3. Component Responsibilities & Behavior

- Inline editing: toggles editable fields for title and description and commits changes to node data.
- Resizing: allows the node to be resized; syncs size back to ReactFlow nodes to persist layout.
- Status/type changes: dropdown menus allow changing `status` and `nodeType`.
- Comments and upvotes: UI to add comments and increment upvotes; comments stored in `data.comments`.
- Handles: exposes connection handles (inputs/outputs) with optional double-click to set labels.

## 4. Integration Points

- The parent canvas should handle persistence and synchronization (e.g., `useCedarRoadmap` in `RoadmapCanvas`).
- Ensure `FeatureNodeData` shape matches schema `FeatureNodeDataSchema` (zod) when persisting or deserializing.

## 5. Performance & Quality

- Large nodes with markdown rendering (`react-markdown`) may impact performance when many nodes are visible — consider lazy rendering or virtualization.
- Keep expensive operations (e.g., DOM measurement during resize) debounced and avoid frequent setState calls.

## 6. Testing

- Unit tests: verify inline edit commit logic, resizing state changes, status/type change actions, and comment addition.

## 7. Extensibility

- To add new node metadata, extend `FeatureNodeData` and update the Zod schema and UI.

## 8. Change history

- 1.0 (2025-09-23) - Initial documentation summary
