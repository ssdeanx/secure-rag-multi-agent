<!-- AGENTS-META {"title":"Cedar UI Components","version":"1.2.0","last_updated":"2025-10-09T00:00:00Z","applies_to":"/cedar","tags":["layer:frontend","domain:ui","type:components","status":"stable"],"status":"stable"} -->

# Cedar Component Layer (`/cedar`)

## Persona

**Name:** Senior UI/UX Engineer (AI Interfaces)
**Role Objective:** Deliver composable, state-safe, ReactFlow-driven UI primitives that integrate cleanly with Cedar OS agent context.

## Purpose

This directory contains the core UI components for the interactive "Cedar OS" product roadmap showcase. It provides a `ReactFlow`-based canvas, custom node types for representing features, and other UI elements necessary for building a rich, AI-powered interface. These components are consumed by the integration layer in `/app/cedar-os`.

The `/cedar/components` subdirectory contains an extensive collection of specialized UI components organized by functionality, providing the building blocks for advanced AI-powered interfaces with 3D effects, interactive chat systems, debugging tools, and novel interaction patterns.

## Scope

### In-Scope

- The main `ReactFlow` canvas orchestration (`RoadmapCanvas.tsx`).
- Definitions for custom, interactive node components (`FeatureNode.tsx`, `RoadmapNode.tsx`).
- A UI for visualizing AI-analyzed relationships between nodes (`SmartRelationshipRoadmap.tsx`).
- A hook for providing initial static data for the roadmap demo (`useRoadmapData.ts`).
- UI primitive components like `Badge`, `Button`, and `DropdownMenu` that are styled for this specific showcase.

### Out-of-Scope

- The logic for connecting the UI state to the AI agent (which lives in `/app/cedar-os`).
- The backend services that power features like the smart relationship analysis.

## Key Files

| File                                           | Responsibility                         | Notes                                                                                                                     |
| ---------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `RoadmapCanvas.tsx`                            | The main ReactFlow canvas.             | Manages the state of nodes and edges and orchestrates the overall roadmap UI.                                             |
| `FeatureNode.tsx`                              | The primary, feature-rich custom node. | Provides inline editing, status changes, upvoting, comments, and resizing. This is the main node type used in the canvas. |
| `SmartRelationshipRoadmap.tsx`                 | AI Relationship Visualizer             | A UI that displays AI-analyzed relationships (e.g., dependencies, blockers) between selected roadmap nodes.               |
| `useRoadmapData.ts`                            | Provides Initial Data                  | A hook that returns the static, initial set of nodes and edges for the roadmap demo.                                      |
| `ChatModeSelector.tsx`                         | UI for Switching Chat Modes            | A simple component that allows the user to toggle between different Cedar OS chat interfaces.                             |
| `RoadmapNode.tsx`                              | A simpler custom node.                 | An alternative, less feature-rich custom node. `FeatureNode` is the one primarily used.                                   |
| `badge.tsx`, `button.tsx`, `dropdown-menu.tsx` | UI Primitives                          | Local, styled versions of common UI components used within the roadmap showcase.                                          |

## Components Subdirectory (`/cedar/components`)

The `/cedar/components` directory contains a comprehensive collection of specialized UI components organized by functionality, providing the foundation for advanced AI-powered interfaces.

### Directory Structure

| Subdirectory      | Component Count | Purpose                                    |
| ----------------- | --------------- | ------------------------------------------ |
| `chatComponents/` | 4               | Core chat interface implementations        |
| `chatInput/`      | 7               | Input controls and context indicators      |
| `chatMessages/`   | 10              | Message rendering and display components   |
| `containers/`     | 5               | Layout containers with 3D effects          |
| `debugger/`       | 6               | Development and debugging interfaces       |
| `diffs/`          | 2               | Text diff visualization components         |
| `inputs/`         | 1               | Specialized input controls                 |
| `ornaments/`      | 4               | Visual effect and decoration components    |
| `spells/`         | 5               | Novel interaction patterns and UI "spells" |
| `structural/`     | 2               | Layout and positioning components          |
| `text/`           | 3               | Text animation and effect components       |
| `threads/`        | 1               | Chat thread management                     |
| `ui/`             | 6               | UI primitives and controls                 |
| `voice/`          | 1               | Voice interaction indicators               |

### Key Component Categories

#### Chat Components (`chatComponents/`)

- **CedarCaptionChat.tsx**: Caption-based chat interface
- **EmbeddedCedarChat.tsx**: Embedded chat widget
- **FloatingCedarChat.tsx**: Floating chat overlay
- **SidePanelCedarChat.tsx**: Side panel chat interface

#### Chat Input (`chatInput/`)

- **ChatInput.tsx**: Main chat input component with CSS styling
- **ContextBadgeRow.tsx**: Context indicator badges
- **FloatingChatInput.tsx**: Floating input overlay
- **HumanInTheLoopIndicator.tsx**: Human intervention indicators

#### Chat Messages (`chatMessages/`)

- **ChatBubbles.tsx**: Bubble-style message display
- **ChatRenderer.tsx**: Main message rendering engine
- **MarkdownRenderer.tsx**: Markdown content rendering
- **StreamingText.tsx**: Real-time text streaming
- **TodoList.tsx**: Interactive todo list messages
- **MultipleChoice.tsx**: Multiple choice interaction
- **Storyline.tsx**: Narrative storyline display

#### Containers (`containers/`)

- **Container3D.tsx**: 3D perspective containers
- **GlassyPaneContainer.tsx**: Glassmorphism effect containers
- **Flat3dContainer.tsx**: Flat 3D-style containers
- **Container3DButton.tsx**: 3D-styled buttons
- **Flat3dButton.tsx**: Flat 3D buttons

#### Debugger (`debugger/`)

- **DebuggerPanel.tsx**: Main debugging interface
- **MessagesTab.tsx**: Message inspection tab
- **NetworkTab.tsx**: Network monitoring tab
- **StatesTab.tsx**: State inspection tab
- **CollapsibleSection.tsx**: Collapsible debug sections

#### Spells (`spells/`)

- **RadialMenuSpell.tsx**: Radial context menu
- **TooltipMenuSpell.tsx**: Tooltip-based menus
- **QuestioningSpell.tsx**: Question interaction patterns
- **RangeSliderSpell.tsx**: Range slider interactions
- **SliderSpell.tsx**: Slider-based controls

#### Text Effects (`text/`)

- **TypewriterText.tsx**: Typewriter animation effects
- **ShimmerText.tsx**: Shimmer animation effects
- **PhantomText.tsx**: Phantom/placeholder text

#### UI Primitives (`ui/`)

- **button.tsx**: Custom button components
- **command.tsx**: Command palette components
- **dialog.tsx**: Dialog/modal components
- **dropdown-menu.tsx**: Dropdown menu components
- **tabs.tsx**: Tab navigation components
- **KeyboardShortcut.tsx**: Keyboard shortcut display

### Design Philosophy

The Cedar components follow a consistent design philosophy:

- **3D Effects**: Extensive use of glassmorphism, gradients, and 3D transformations
- **Interactivity**: Highly interactive components with smooth animations
- **AI Integration**: Components designed to work seamlessly with AI agents
- **Modularity**: Composable architecture allowing flexible combinations
- **Accessibility**: Screen reader support and keyboard navigation
- **Performance**: Optimized rendering with efficient state management

## Data Flow

1.  The `useRoadmapData` hook provides the initial set of nodes and edges.
2.  `RoadmapCanvas.tsx` takes this initial data and manages it using `ReactFlow`'s state hooks (`useNodesState`, `useEdgesState`).
3.  User interactions within a `FeatureNode` (like editing text or upvoting) trigger state updates within the `RoadmapCanvas`.
4.  The state of the canvas (e.g., the currently selected nodes) is then passed up to the integration layer in `/app/cedar-os`, where it is exposed to the Cedar OS agent.

## Change Log

| Version | Date (UTC) | Change                                                                                                                           |
| ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1.2.0   | 2025-10-09 | Added comprehensive documentation for /cedar/components subdirectory structure and all component categories.                     |
| 1.1.0   | 2025-10-08 | Rewrote documentation to be more specific and accurate, including details on all components like `SmartRelationshipRoadmap.tsx`. |
| 1.0.0   | 2025-09-24 | Initial standardized documentation.                                                                                              |
