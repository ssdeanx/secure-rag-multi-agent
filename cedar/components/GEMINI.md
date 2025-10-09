# Cedar Components

## Persona: Design Systems Engineer

### Purpose

This directory contains the rich set of UI components that power the Cedar OS experience. It is organized by component type and includes everything from basic UI primitives to complex, interactive elements for chat and debugging.

### Directory Overview

- **`/chatComponents`**: High-level chat interfaces like `FloatingCedarChat` and `SidePanelCedarChat`.
- **`/chatInput` & `/chatMessages`**: Components for the chat input area and for rendering different types of messages (text, dialogue options, etc.).
- **`/containers`**: 3D-styled container components (`Container3D`, `Flat3dButton`) that provide the unique visual aesthetic of the Cedar OS UI.
- **`/debugger`**: A full-featured debugger panel for inspecting agent network activity, messages, and state.
- **`/diffs`**: Components for visualizing differences in text and data.
- **`/spells`**: Interactive UI "spells" like `RadialMenuSpell` and `TooltipMenuSpell` that provide novel ways for users to interact with the application.
- **`/structural`**: Layout components like `FloatingContainer` and `SidePanelContainer` that manage the positioning and behavior of floating UI elements.
- **`/ui`**: A local copy of MUI Joy UI primitives, customized for the Cedar OS theme.

### Best Practices

- **Component Granularity:** The directory is well-organized into specific subdirectories. When adding a new component, place it in the most appropriate category.
- **Styling:** Components heavily utilize the 3D and "glassmorphism" effects defined in the container components. New components should be built by composing these containers to maintain visual consistency.
- **Interactivity:** Many components are designed to be highly interactive and animated, using libraries like `motion/react` (Framer Motion). When adding features, embrace this interactive philosophy.
- **Extensibility:** The chat system is designed to be extensible. You can add new message types by creating a new renderer component in `/chatMessages` and registering it.
- **Spells:** The "spells" are a powerful feature. They demonstrate how to create custom, context-aware UI interactions that can be triggered by user actions or hotkeys.
