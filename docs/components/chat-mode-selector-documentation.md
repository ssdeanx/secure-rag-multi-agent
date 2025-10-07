---
title: ChatModeSelector - Technical Documentation
component_path: `cedar/ChatModeSelector.tsx`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Cedar UI
tags: [component, chat, ui]
---

# ChatModeSelector Documentation

Small UI control that allows switching between three chat presentation modes: caption, floating, and side panel. It is a pure presentational component that delegates mode changes to the parent via a callback.

## 1. Component Overview

- OVR-001: Provide a small overlay control for selecting chat display mode.

- OVR-002: Scope: render icons/labels for each mode and call back on selection. No internal state except rendering.

- OVR-003: Context: typically rendered inside pages that include chat (e.g., `/cedar-os`).

## 2. Interface Documentation

| Prop           | Purpose                                   | Type                                      | Required |
| -------------- | ----------------------------------------- | ----------------------------------------- | -------- |
| `currentMode`  | Current selected chat mode                | one of `caption`, `floating`, `sidepanel` | Yes      |
| `onModeChange` | Callback invoked when user selects a mode | `(mode: ChatMode) => void`                | Yes      |

## 3. Implementation Details

- Uses `lucide-react` icons and simple button list. Applies visual active state when `currentMode === mode.id`.

## 4. Usage Example

```tsx
<ChatModeSelector currentMode={chatMode} onModeChange={setChatMode} />
```

## 5. Quality Attributes

- QUA-001 Accessibility: Buttons have `title` attributes; consider adding `aria-pressed` and `role="tab"` semantics if making keyboard-focused.
- QUA-002 Extensibility: Add more modes by expanding the `modes` array and handling new mode layouts in parent component.

## 6. Change history

- 1.0 (2025-09-23) - Initial documentation
