<!-- AGENTS-META {"title":"Cedar UI Components","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/cedar","tags":["layer:frontend","domain:ui","type:components","status":"stable"],"status":"stable"} -->

# Cedar Component Layer (`/cedar`)

## Persona

**Name:** Senior UI/UX Engineer (AI Interfaces)
**Role Objective:** Deliver composable, state-safe, ReactFlow-driven UI primitives that integrate cleanly with Cedar OS agent context.

## Purpose

This directory contains the core UI components for the interactive "Cedar OS" product roadmap showcase. It provides a `ReactFlow`-based canvas, custom node types for representing features, and other UI elements necessary for building a rich, AI-powered interface. These components are consumed by the integration layer in `/app/cedar-os`.

## Scope

### In-Scope

-   The main `ReactFlow` canvas orchestration (`RoadmapCanvas.tsx`).
-   Definitions for custom, interactive node components (`FeatureNode.tsx`, `RoadmapNode.tsx`).
-   A UI for visualizing AI-analyzed relationships between nodes (`SmartRelationshipRoadmap.tsx`).
-   A hook for providing initial static data for the roadmap demo (`useRoadmapData.ts`).
-   UI primitive components like `Badge`, `Button`, and `DropdownMenu` that are styled for this specific showcase.

### Out-of-Scope

-   The logic for connecting the UI state to the AI agent (which lives in `/app/cedar-os`).
-   The backend services that power features like the smart relationship analysis.

## Key Files

| File | Responsibility | Notes |
| --- | --- | --- |
| `RoadmapCanvas.tsx` | The main ReactFlow canvas. | Manages the state of nodes and edges and orchestrates the overall roadmap UI. |
| `FeatureNode.tsx` | The primary, feature-rich custom node. | Provides inline editing, status changes, upvoting, comments, and resizing. This is the main node type used in the canvas. |
| `SmartRelationshipRoadmap.tsx` | AI Relationship Visualizer | A UI that displays AI-analyzed relationships (e.g., dependencies, blockers) between selected roadmap nodes. |
| `useRoadmapData.ts` | Provides Initial Data | A hook that returns the static, initial set of nodes and edges for the roadmap demo. |
| `ChatModeSelector.tsx` | UI for Switching Chat Modes | A simple component that allows the user to toggle between different Cedar OS chat interfaces. |
| `RoadmapNode.tsx` | A simpler custom node. | An alternative, less feature-rich custom node. `FeatureNode` is the one primarily used. |
| `badge.tsx`, `button.tsx`, `dropdown-menu.tsx` | UI Primitives | Local, styled versions of common UI components used within the roadmap showcase. |

## Data Flow

1.  The `useRoadmapData` hook provides the initial set of nodes and edges.
2.  `RoadmapCanvas.tsx` takes this initial data and manages it using `ReactFlow`'s state hooks (`useNodesState`, `useEdgesState`).
3.  User interactions within a `FeatureNode` (like editing text or upvoting) trigger state updates within the `RoadmapCanvas`.
4.  The state of the canvas (e.g., the currently selected nodes) is then passed up to the integration layer in `/app/cedar-os`, where it is exposed to the Cedar OS agent.

## Change Log

| Version | Date (UTC) | Change |
| --- | --- | --- |
| 1.1.0 | 2025-10-08 | Rewrote documentation to be more specific and accurate, including details on all components like `SmartRelationshipRoadmap.tsx`. |
| 1.0.0 | 2025-09-24 | Initial standardized documentation. |