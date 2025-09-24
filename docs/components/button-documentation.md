---
title: Button - Technical Documentation
component_path: `cedar/button.tsx`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Cedar UI
tags: [ui, button, cva, documentation]
---

# Button Documentation

Re-usable Button primitive using `class-variance-authority` for variant and size composition. Supports rendering as a native `button` or delegating to a child element via Radix `Slot` (`asChild`).

## 1. Purpose

- Provide consistent visual button styles across the application with theme variants and sizes.

## 2. Variants & Sizes

- Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`.

- Sizes: `default`, `sm`, `lg`, `icon`.

## 3. Interface & Props

- Props extend `React.ComponentProps<'button'>` and include CVA variant props plus `asChild?: boolean`.

Example usage:

```tsx
<Button size="lg">Primary</Button>
<Button variant="outline" asChild><a href="/docs">Docs</a></Button>
```

## 4. Implementation Details

- Uses `cva` to centralize class variants and `cn` helper to merge classes.

- `asChild` allows wrapping an anchor or router link while applying button styling and preserving semantics.

## 5. Accessibility

- Ensure `type` and `aria-*` attributes are provided as needed when used within forms or as interactive controls.

## 6. Change history

- 1.0 (2025-09-23) - Initial documentation
