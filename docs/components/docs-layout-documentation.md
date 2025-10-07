---
title: DocsLayout - Technical Documentation
component_path: `components/docs/DocsLayout.tsx`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Documentation / Frontend
tags: [layout, docs, react, navigation, ui]
---

# DocsLayout Documentation

A responsive layout component for documentation pages, featuring a sticky sidebar with collapsible navigation, breadcrumb, and main content area. Built with shadcn/ui primitives for consistent theming and accessibility.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Provide a structured layout for docs with navigation, breadcrumbs, and scrollable content.

- OVR-002: Scope: Renders header (branding, breadcrumb, badges), sidebar (collapsible sections), and main card for children. Handles pathname for active states. Excludes content generation.

- OVR-003: Context: Wraps dynamic docs pages (/docs/\*) to create a consistent, navigable experience.

## 2. Architecture Section

- ARC-001: Design patterns: Layout composition with conditional rendering (lg:grid-cols-4).

- ARC-002: Dependencies:
    - React (usePathname)

    - next/navigation (Link, usePathname)

    - shadcn/ui (Card, Button, Badge, Separator, Collapsible, ScrollArea, HoverCard, Breadcrumb)

    - lucide-react (icons: BookOpen, Play, etc.)

    - cn utils (class merging)

- ARC-003: Interactions: Sticky sidebar; collapsible sections; active link highlighting via pathname.

- ARC-004: Accessibility: Semantic breadcrumb, keyboard-navigable buttons/links.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Docs Page"
        P[DocsPage] --> L[DocsLayout]
        L --> Ch[Children Content]
    end

    subgraph "Layout"
        L --> H[Header: Branding/Breadcrumb/Badges]
        L --> S[Sidebar: Navigation]
        L --> M[Main: Card with ScrollArea]
    end

    subgraph "Navigation"
        S --> Sec[Sections: Getting Started, Core Concepts]
        Sec --> It[Items: Links with Icons]
        It --> Co[Collapsible]
    end

    subgraph "External"
        N[Next.js] --> L
        UI[shadcn/ui] --> L
        LR[lucide-react] --> L
    end

    classDiagram
        class DocsLayout {
            +children: ReactNode
            +render(): JSX.Element
        }
        class SidebarNav {
            +navigation: array
            +pathname: string
        }

        DocsLayout --> SidebarNav
```

## 3. Interface Documentation

- INT-001: Simple props interface.

| Prop       | Purpose      | Type              | Required | Usage Notes      |
| ---------- | ------------ | ----------------- | -------- | ---------------- |
| `children` | Main content | `React.ReactNode` | Yes      | MDX/docs content |

### Prop Types

```tsx
interface DocsLayoutProps {
    children: React.ReactNode
}
```

INT notes:

- INT-003: Internal usePathname for active states; no callbacks.

## 4. Implementation Details

- IMP-001: Grid layout (1-col mobile, 4-col lg+): sidebar (1), main (3). Sticky sidebar.

- IMP-002: Header: HoverCard branding, Breadcrumb from pathname, badges.

- IMP-003: Sidebar: ScrollArea with collapsible sections; active via pathname match.

- IMP-004: Main: Card with padded ScrollArea for content.

Edge cases and considerations:

- Empty pathname: Defaults to 'Overview'.

- Deep paths: Breadcrumb handles multi-segment slugs.

## 5. Usage Examples

### Basic Usage (in docs page)

```tsx
import { DocsLayout } from '@/components/docs/DocsLayout'

export default function DocsPage({ children }) {
    return <DocsLayout>{children}</DocsLayout>
}
```

### With Dynamic Content

```tsx
// app/docs/[slug]/page.tsx
import { DocsLayout } from '@/components/docs/DocsLayout'

export default function SlugPage({ params, children }) {
    return (
        <DocsLayout>
            {/* MDX content */}
            <h1>{params.slug}</h1>
            {children}
        </DocsLayout>
    )
}
```

Best practices:

- Wrap MDX content directly.

- Customize navigation array for site sections.

## 6. Quality Attributes

- QUA-001 Security: Client-side; no data handling. Links use Next.js for safe navigation.

- QUA-002 Performance: Lightweight; usePathname efficient. ScrollArea virtualizes long content.

- QUA-003 Reliability: Handles missing paths gracefully.

- QUA-004 Maintainability: navigation array externalizable; primitives reusable.

- QUA-005 Extensibility: Add sections/items; customize icons/colors.

## 7. Reference Information

- REF-001: Dependencies: next (^14), shadcn/ui, lucide-react (^0.300)

- REF-002: Configuration: navigation array defines structure.

- REF-003: Testing: Snapshot layout; test active states.

- REF-004: Troubleshooting: No active links — verify pathname.

- REF-005: Related: app/docs/[...slug]/page.tsx (usage)

- REF-006: Change history: 1.0 (2025-09-23)
