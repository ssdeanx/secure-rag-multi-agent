---
title: TopNavigation - Technical Documentation
component_path: `components/TopNavigation.tsx`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Frontend / UI Team
tags: [component, react, navigation, header, ui]
---

# TopNavigation Documentation

Top-level navigation header used across the application layout. It provides branded navigation links, theme toggling, and optional child content (e.g., user menu). The component is built to be reusable and accessible, leveraging a Menubar abstraction for structured triggers.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide a sticky top navigation header with site branding and quick links.

- OVR-002: Scope includes rendering navigation links, a theme toggle control, and an optional login link (conditional). It excludes routing logic and auth management beyond displaying a Login trigger when `currentRole` is not set.

- OVR-003: Context: placed in the root layout (`app/layout.tsx`) to appear on every page. It accepts optional child content to render additional controls at the right side of the header.

## 2. Architecture Section

- ARC-001: Design patterns: Presentational container component, composition via children, and use of small UI primitives (Menubar, MenubarMenu, MenubarTrigger).

- ARC-002: Dependencies:
    - React (Function component, JSX)

    - Next.js navigation helpers (`usePathname`, `next/link`) for active-link highlighting

    - Local utilities: `cn` (class name helper)

    - UI primitives: `Menubar`, `MenubarMenu`, `MenubarTrigger` (project's ui/menubar)

    - `ThemeToggle` component

- ARC-003: Interactions: Stateless UI — uses `usePathname()` to determine the active route and style links accordingly. Renders `Login` link when `currentRole` is not provided.

- ARC-004: Accessibility/UX decisions: Uses menubar triggers and link anchors for keyboard navigation and semantic structure. Sticky header with backdrop blur for consistent UX.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph Layout
        L[RootLayout] --> T[TopNavigation]
        L --> MainContent
    end

    subgraph TopNav
        T --> Brand[Brand Link]
        T --> NavLinks[Navigation Links]
        T --> ThemeToggle
        T --> ChildrenArea[Optional Children]
    end

    classDiagram
        class TopNavigation {
            +props: TopNavigationProps
            +render(): JSX.Element
        }

        TopNavigation --> ThemeToggle
        TopNavigation --> Brand
```

## 3. Interface Documentation

- INT-001: Public props and usage patterns.

| Prop          | Purpose                                              | Type                | Required | Usage Notes                            |
| ------------- | ---------------------------------------------------- | ------------------- | -------- | -------------------------------------- |
| `children`    | Extra controls to render at the right side of header | `React.ReactNode`   | No       | Useful for user menus or badges        |
| `currentRole` | Used to determine whether to show Login link         | `string (optional)` | No       | If falsy or empty, Login link is shown |

### Prop Types (excerpt)

```ts
interface TopNavigationProps {
    children?: React.ReactNode
    currentRole?: string
}
```

INT notes:

- INT-003: The component relies on `usePathname()` for active link highlighting. For server-rendered environments ensure the hook is available (component is client-side: `'use client'`).

## 4. Implementation Details

- IMP-001: Behavior: maps an array of navigation link objects to `MenubarMenu` triggers and highlights them when the current path starts with the link href.
- IMP-002: Initialization: none. `TopNavigation` is a client component and uses `usePathname()` so it must be rendered client-side (it contains `'use client'`).
- IMP-003: Key logic: `pathname?.startsWith(link.href)` controls active styling. The brand link uses a special check for root path equality.
- IMP-004: Performance: trivial render cost. Keep navigationLinks list static to avoid re-renders; if dynamic, memoize externally.

Edge cases and considerations:

- If `usePathname()` equals `undefined` during hydration, the active-link styling may mismatch; component already marks `'use client'` to reduce server/client mismatch risk.

## 5. Usage Examples

### Basic usage (in `app/layout.tsx`)

```tsx
import { TopNavigation } from '@/components/TopNavigation'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html>
            <body>
                <TopNavigation />
                <main>{children}</main>
            </body>
        </html>
    )
}
```

### With custom children (user menu)

```tsx
<TopNavigation currentRole={user?.role}>
    <UserMenu />
</TopNavigation>
```

## 6. Quality Attributes

- QUA-001 Security: No sensitive data is rendered. `currentRole` is only used to decide whether to display a Login link — avoid passing sensitive tokens here.
- QUA-002 Performance: Lightweight. If navigation links become dynamic, consider memoization to limit re-renders.
- QUA-003 Reliability: Component is deterministic; errors primarily originate from missing `usePathname` in non-client contexts.
- QUA-004 Maintainability: Small focused file, easy to extend navigation items. Centralize navigationLinks or source from a shared config for consistency.
- QUA-005 Extensibility: To add dropdowns, replace `MenubarTrigger` contents with menu components or wire additional `MenubarMenu` children.

## 7. Reference Information

- REF-001: Dependencies
    - next (Link, usePathname)
    - React
    - ThemeToggle (local component)
    - Menubar UI primitives (project `components/ui/menubar`)

- REF-002: Testing guidelines
    - Render in Jest/React Testing Library as a client component (use RTL's `render` with client environment). Test link presence and active styling by mocking `usePathname`.

- REF-003: Troubleshooting
    - Issue: Active link not highlighted — ensure `usePathname()` returns the expected path and component runs client-side.

- REF-004: Related docs
    - `app/layout.tsx` — root layout that places `TopNavigation` in the application shell

- REF-005: Change history
    - 1.0 (2025-09-23) - Initial documentation
