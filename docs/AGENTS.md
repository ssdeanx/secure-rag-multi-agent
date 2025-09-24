<!-- AGENTS-META {"title":"Documentation System","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/docs","tags":["layer:docs","domain:docs","type:content","status:stable"],"status":"stable"} -->

# Documentation Directory (`/docs`)

## Directory Purpose
Houses user-facing and internal technical documentation (Markdown / MDX) describing architecture, security, APIs, roles, quick start, and thematic guidance. Rendered by Next.js routes under `app/docs` (and/or MDX pipeline) to support onboarding and agent comprehension.

## Scope

### In-Scope

- Authoritative architectural & security descriptions
- API reference pages for key endpoints
- Role demo explanations (RBAC & classification)
- Quick start and index landing docs
- MD / MDX source content consumed by documentation UI

### Out-of-Scope

- Live code examples beyond illustrative snippets maintained elsewhere
- Agent/workflow source (lives in `src/mastra`)
- Component implementation docs (see `/components`)

## Key Files

| File | Role | Notes |
|------|------|-------|
| `architecture.md` / `.mdx` | System architecture overview | Diagrams + high-level flows |
| `security.md` / `.mdx` | Security model & RBAC | Data classification + enforcement |
| `api-reference.md` / `.mdx` | Endpoint docs | Chat / Index APIs + parameters |
| `demo-roles.md` / `.mdx` | Role explanations | Sample JWT roles for demos |
| `quick-start.md` / `.mdx` | Fast setup guide | Mirrors root instructions with brevity |
| `index.md` / `.mdx` | Landing documentation index | Entry point for docs UI |
| `mastra.mdx` | Mastra integration notes | Orchestration & agents summary |
| `onboarding-cedar-mastra.mdx` | Cedar + Mastra onboarding | Cross-product narrative |
| `theme-choices.md` | Styling/theming rationale | UI design decisions |
| `kilocode-headers.md` | Header guidance | Formatting conventions |

## Responsibilities

- Provide single source of truth for platform concepts
- Offer stable anchors for internal linking from code comments
- Support AI agent ingestion for contextual reasoning

## Non-Responsibilities

- Executable configuration (handled in code / env files)
- Dynamic runtime logs or metrics
- Legal or compliance policy documents (external)

## Integration Points

| Consumer | Interaction |
|----------|-------------|
| `app/docs` | Renders markdown/MDX content into UI |
| `mdx-plugins.ts` (in `lib`) | Adds custom remark/rehype transforms |
| Agents / RAG indexing | Content optionally ingested into vector store |
| Root README / AGENTS.md | Cross-links into deeper sections |

## Common Tasks

1. Add New Doc Page
   - Create `new-topic.md` (or `.mdx` if interactive components needed)
   - Add frontmatter if MDX pipeline expects (title, description)
   - Link from `index.md` and update any navigation components
2. Convert Markdown -> MDX
   - Rename file extension
   - Replace fenced code with MDX-aware components as needed
3. Update Architecture Diagram
   - Edit mermaid block in `architecture.mdx`
   - Ensure diagram remains legible in dark/light themes

## Authoring Guidelines

- Prefer imperative present tense ("Run", "Install")
- Keep line width manageable (< 120 chars) for diffs
- Use relative links (`../src/mastra/agents`) not absolute

## Testing & QA

- Run local dev server and verify MDX builds without warnings
- Check for broken relative links (build output / console)
- Validate diagrams render (Mermaid component) and adapt accessible contrast

## Security & Compliance Notes

- Avoid embedding secret names or actual keys
- Redact internal-only infrastructure details not required for dev setup

## Change Log

| Version | Date (UTC) | Change |
|---------|------------|--------|
| 1.0.0 | 2025-09-24 | Standardized template applied; legacy content preserved |

## Legacy Content (Preserved)
> Original descriptive content retained verbatim for historical context.

```markdown
### Persona: Technical Writer

### Purpose

This directory contains the project's user-facing and developer documentation in Markdown format. These files provide detailed information about the system's architecture, security model, and API.

### Content Overview

- **`architecture.md`**: A detailed document explaining the system's architecture, likely with more depth than the `README.md`.
- **`security.md`**: Describes the security features, role-based access control (RBAC), and data classification system.
- **`api-reference.md`**: Provides detailed documentation for the project's API endpoints (`/api/chat`, `/api/index`).
- **`demo-roles.md`**: Explains the different user roles available for demonstrating the application's security features.
- **`quick-start.md` & `index.md`**: General documentation and getting-started guides.

### Best Practices

- **Keep Documentation Updated:** When you make changes to the architecture, security model, or API, you *must* update the corresponding files in this directory.
- **Clear and Concise:** Write documentation that is easy to understand for both technical and non-technical audiences.
- **Use Mermaid for Diagrams:** As seen in the `README.md`, Mermaid is the preferred tool for creating diagrams. Use it to illustrate complex concepts in the architecture and workflow documents.
- **Link Between Documents:** When referencing another section of the documentation, use relative links to create a cohesive and navigable documentation suite.
```