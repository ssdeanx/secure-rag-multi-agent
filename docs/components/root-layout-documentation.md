---
title: RootLayout - Technical Documentation
component_path: `app/layout.tsx`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Frontend / UI Team
tags: [layout, nextjs, react, documentation]
---

# RootLayout Documentation

Application root layout for Next.js app. Provides global HTML structure, font loading, theme provider, and the top navigation. This file defines `metadata` and `viewport` exported constants used by Next.js and composes the application shell.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Establish global HTML structure, load site fonts, provide theme context and render persistent UI chrome (TopNavigation).

- OVR-002: Scope includes global CSS import, font setup (Google Inter), theme provider configuration, metadata and viewport exports for Next.js. Excludes page-specific content which is rendered in `children`.

- OVR-003: Context: used by Next.js as the root layout for the app directory. This layout wraps all pages and should remain lightweight and stable.

## 2. Architecture Section

- ARC-001: Design patterns: Composition - the layout composes UI primitives (`ThemeProvider`, `TopNavigation`) and acts as a stable shell.

- ARC-002: Dependencies:
    - Next.js `Metadata` and `Viewport` types and conventions

    - next/font/google for optimized font loading (`Inter`)

    - `ThemeProvider` component (project-local)

    - `TopNavigation` component (project-local)

    - `cn` utility for className composition

- ARC-003: Interactions: Exports `metadata` and `viewport` for Next.js to use. Renders children inside a `<main>` placed under the TopNavigation.

- ARC-004: Decisions: `suppressHydrationWarning` is set to reduce hydration mismatches when client-surface rendering behavior differs. The component applies `inter.className` plus theme-related CSS classes on the `body`.

### Component Structure Diagram

```mermaid
graph TD
    RootLayout --> ThemeProvider
    RootLayout --> TopNavigation
    RootLayout --> Main[Main Content]

    classDiagram
      class RootLayout {
        +metadata: Metadata
        +viewport: Viewport
      }
```

## 3. Interface Documentation

| Export / Prop | Purpose                                | Type              | Notes                               |
| ------------- | -------------------------------------- | ----------------- | ----------------------------------- |
| `metadata`    | Application metadata used by Next.js   | `Metadata`        | Title, description and SEO fields.  |
| `viewport`    | Viewport configuration used by Next.js | `Viewport`        | Theme color and color scheme hints. |
| `children`    | Page content                           | `React.ReactNode` | Rendered inside `<main>`            |

## 4. Implementation Details

- IMP-001: `Inter` font loaded via `next/font/google` for optimized delivery and zero CLS.

- IMP-002: `ThemeProvider` is configured with `attribute="class"` and `defaultTheme="system"` to enable system-theme detection and CSS class toggling.

- IMP-003: `suppressHydrationWarning` is applied to the `html` element to reduce hydration noise when theme toggles on client initialization.

Edge cases:

- If `ThemeProvider` requires client-side rendering internals, ensure it is safe to use with server-rendered content and does not cause flash-of-unstyled content (FOUC). The layout is intentionally minimal to reduce these risks.

## 5. Usage Examples

This file is a Next.js `app` layout; it's automatically used by the framework when present at `app/layout.tsx`.

## 6. Quality Attributes

- QUA-001 Security: No sensitive data is present. Keep metadata free of secrets.
- QUA-002 Performance: Font loaded via `next/font` is optimized. Keep heavy initializations out of the layout to improve first paint.
- QUA-003 Reliability: Stable composition; avoid adding per-page logic here.
- QUA-004 Maintainability: Centralized site metadata and theme configuration.

## 7. Reference Information

- REF-001: Related components
    - `components/TopNavigation.tsx`
    - `components/ThemeProvider.tsx`

- REF-002: Testing
    - Validate rendering of layout and presence of TopNavigation in integration tests.

- REF-003: Change history
    - 1.0 (2025-09-23) - Initial documentation
