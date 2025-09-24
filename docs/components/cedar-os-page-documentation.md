---
title: Cedar OS Page - Technical Documentation
component_path: `app/cedar-os/page.tsx`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Frontend / Cedar OS
tags: [page, cedar, roadmap, chat, ui, documentation]
---

# Cedar OS Page Documentation

Client-side Next.js page that integrates the interactive roadmap canvas with Cedar OS chat components. Provides a collaborative environment for roadmap management and AI-assisted conversation with multiple chat UI modes.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide the main Cedar OS interface combining roadmap visualization and AI chat.

- OVR-002: Scope includes Mastra client initialization, chat mode selection, roadmap canvas rendering, and conditional chat UI layouts. It deliberately excludes detailed roadmap or chat logic (handled by child components).

- OVR-003: Context: Standalone page at `/cedar-os` for interactive product roadmap exploration and AI collaboration.

## 2. Architecture Section

- ARC-001: Design patterns: Client component composition with state-driven UI modes.

- ARC-002: Dependencies:

  - Roadmap components: `RoadmapCanvas`
  - Chat components: `CedarCaptionChat`, `FloatingCedarChat`, `SidePanelCedarChat`
  - UI controls: `ChatModeSelector`
  - Mastra client: `createMastraClient`

- ARC-003: Interactions: Initializes Mastra client on mount, allows mode switching, renders different layouts based on chat mode.

- ARC-004: Visual/behavioral decisions: Three chat modes (caption, floating, sidepanel) with different layouts. Mastra initialization sends roadmap context.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Page Layout"
        COP[CedarOSPage] --> CMS[ChatModeSelector]
        COP --> RC[RoadmapCanvas]
        COP --> CC[CedarCaptionChat]
        COP --> FC[FloatingCedarChat]
        COP --> SPC[SidePanelCedarChat]
    end

    subgraph "Mastra Integration"
        COP --> CMC[createMastraClient]
    end

    classDiagram
        class CedarOSPage {
            +client: MastraClient
            +chatMode: ChatMode
            +renderContent(): JSX.Element
            +render(): JSX.Element
        }
```

## 3. Interface Documentation

- INT-001: Component props and state.

| Property | Purpose | Type | Usage Notes |
|----------|---------|------|-------------|
| `chatMode` | Current chat UI mode | `'caption' \| 'floating' \| 'sidepanel'` | Controls layout and chat component |
| `client` | Mastra client instance | `MastraClient` | For agent communication |

### Chat Modes

- **caption**: Caption-style chat in sidebar
- **floating**: Floating chat window overlay
- **sidepanel**: Full side panel chat wrapping content

## 4. Implementation Details

- IMP-001: Client component with `'use client'` directive for interactivity.
- IMP-002: Mastra client initialization with optional context sending.
- IMP-003: Conditional rendering based on chat mode state.
- IMP-004: Side panel mode wraps entire content, others show sidebar layout.

Corner cases and considerations:

- Mastra client.chat may not exist; guarded with typeof check.
- @ts-ignore for TypeScript compatibility with optional client methods.
- Error handling for Mastra initialization failures.

## 5. Usage Examples

### Page access

This is a Next.js page component; accessed via `/cedar-os` route.

### Mode switching

```tsx
// User clicks mode selector
<ChatModeSelector currentMode={chatMode} onModeChange={setChatMode} />
```

### Mastra integration

```tsx
// On mount, send roadmap context
useEffect(() => {
  if (client.chat) {
    await client.chat({ 
      message: 'Initialize roadmap context',
      context: { type: 'roadmap_init' }
    });
  }
}, [client]);
```

## 6. Quality Attributes

- QUA-001 Security: Mastra client initialized securely, no sensitive data exposure.
- QUA-002 Performance: Lazy Mastra calls, conditional rendering.
- QUA-003 Reliability: Error handling for optional Mastra features.
- QUA-004 Maintainability: Clear mode separation, composable components.
- QUA-005 Extensibility: Easy to add new chat modes or components.

## 7. Reference Information

- REF-001: Dependencies (approximate):
  - react (^18.0.0)
  - next (^14.0.0)
  - @mastra/client (^1.0.0)

- REF-002: Configuration
  - Requires Mastra server running
  - Environment variables for Mastra client

- REF-003: Testing guidelines
  - Test mode switching and layout changes.
  - Mock Mastra client for initialization.

- REF-004: Troubleshooting
  - Issue: Mastra errors — check server connection.
  - Issue: Layout issues — verify chat component imports.

- REF-005: Related docs
  - `cedar/RoadmapCanvas.tsx`
  - `cedar/ChatModeSelector.tsx`
  - Chat component documentations

- REF-006: Change history
  - 1.0 (2025-09-23) - Initial documentation generated
