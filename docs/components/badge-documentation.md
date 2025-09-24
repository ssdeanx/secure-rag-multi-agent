---
title: Badge - Technical Documentation
component_path: `cedar/badge.tsx`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Cedar UI
tags: [ui, badge, cva, documentation]
---

# Badge Documentation

Small presentational badge component with variants powered by `class-variance-authority` (CVA). Supports rendering as a `span` or as a child element via `asChild` (Radix Slot).

## 1. Purpose

- Provide compact labeled badges for statuses, counts, or labels with theming variants.

## 2. Interface

- Props: extends `React.ComponentProps<'span'>` and CVA `VariantProps`.

| Prop | Purpose | Type | Default |
|------|---------|------|---------|
| `variant` | Visual variant (default, secondary, destructive, outline) | `string` (CVA) | `default` |
| `asChild` | Render underlying element as provided child (Radix Slot) | `boolean` | `false` |

## 3. Implementation notes

- Uses `cva` to define utility-class-based styling and responsive states.
- Use `asChild` when wrapping a link or button to preserve styling while delegating element semantics.

## 4. Usage Examples

```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge asChild><a href="/docs">Docs</a></Badge>
```

## 5. Change history

- 1.0 (2025-09-23) - Initial documentation
