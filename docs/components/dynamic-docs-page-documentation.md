---
title: DynamicDocsPage - Technical Documentation
component_path: `app/docs/[...slug]/page.tsx`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Documentation / Frontend
tags: [page, docs, dynamic, mdx, nextjs]
---

# DynamicDocsPage Documentation

Server-side dynamic page for /docs/\* routes, compiling and rendering MDX/MD files from /docs directory. Supports static params generation for build-time optimization and fallback to 404.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Load and render documentation files based on slug path.

- OVR-002: Scope: generateStaticParams for slugs, file resolution (MDX>MD, index>direct), MDX compilation with plugins, wrap in DocsLayout. Excludes content creation.

- OVR-003: Context: Handles all subpaths under /docs for modular docs site.

## 2. Architecture Section

- ARC-001: Design patterns: Dynamic route with async compilation.

- ARC-002: Dependencies:
    - Next.js (generateStaticParams, notFound)

    - next-mdx-remote (compileMDX)

    - fs/path (file resolution)

    - Local: mdx-plugins, DocsLayout, components (Badge, etc.)

    - lucide-react (icons)

- ARC-003: Interactions: Resolves file paths; compiles; renders via DocsLayout.

- ARC-004: Decisions: Prefers index files; tries MDX then MD; static params for build.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Next.js Route"
        Rt[[...slug]] --> G[generateStaticParams]
        Rt --> D[DynamicDocsPage]
    end

    subgraph "File Resolution"
        D --> Res[Resolve: index.mdx > index.md > slug.mdx > slug.md]
        Res --> F[fs.readFile]
    end

    subgraph "Compilation"
        F --> C[compileMDX with plugins]
        C --> Lay[DocsLayout]
    end

    subgraph "External"
        N[Next.js] --> D
        MDX[next-mdx-remote] --> C
        FS[fs/path] --> Res
    end

    classDiagram
        class DynamicDocsPage {
            +async generateStaticParams(): array
            +async default(params): Promise<JSX>
        }
        class MDXCompiler {
            <<external>>
            +compileMDX(source, options): {content}
        }

        DynamicDocsPage --> MDXCompiler
```

## 3. Interface Documentation

- INT-001: Page component with params.

| Param    | Purpose    | Type                 | Notes                      |
| -------- | ---------- | -------------------- | -------------------------- |
| `params` | Slug array | `{ slug: string[] }` | From Next.js dynamic route |

### Static Params Generation

```ts
export async function generateStaticParams() {
    // Scans /docs for .md/.mdx files
    // Returns [{slug: ['quick-start']}, ...]
}
```

INT notes:

- INT-003: Throws notFound() on missing files.

## 4. Implementation Details

- IMP-001: generateStaticParams: Recursively reads /docs; builds slugs (handles index).

- IMP-002: File resolution: Prioritizes index.mdx/md, then direct slug.mdx/md; root uses index.

- IMP-003: Compilation: compileMDX with remark/rehype plugins; passes components map.

- IMP-004: Rendering: Wraps content in DocsLayout.

Edge cases and considerations:

- No slug: Loads /docs/index.

- Deep slugs: Joins with '/'; resolves accordingly.

- Missing file: notFound().

## 5. Usage Examples

### Route Usage (automatic)

```tsx
// app/docs/[...slug]/page.tsx - This file
// Handles /docs/quick-start, /docs/security/rbac, etc.
```

### Components Map Extension

```tsx
const components = {
    // Existing...
    CustomChart, // Add for docs
}
```

Best practices:

- Keep /docs flat or use index for subdirs.

- Update plugins for new MDX features.

## 6. Quality Attributes

- QUA-001 Security: Server-side compilation; no user input.

- QUA-002 Performance: Static params at build; async compile.

- QUA-003 Reliability: Fallback resolution; notFound on errors.

- QUA-004 Maintainability: Centralized resolution/compilation.

- QUA-005 Extensibility: Add plugins/components easily.

## 7. Reference Information

- REF-001: Dependencies: next-mdx-remote, next (^14)

- REF-002: Configuration: mdxPlugins from lib.

- REF-003: Testing: Mock fs; test resolution/compilation.

- REF-004: Troubleshooting: 404 — check file paths/slugs.

- REF-005: Related: components/docs/DocsLayout.tsx

- REF-006: Change history: 1.0 (2025-09-23)
