<!-- AGENTS-META {"title":"Documentation System","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/docs","tags":["layer:docs","domain:docs","type:content","status":"stable"],"status":"stable"} -->

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

| File                          | Role                         | Notes                                  |
| ----------------------------- | ---------------------------- | -------------------------------------- |
| `architecture.md` / `.mdx`    | System architecture overview | Diagrams + high-level flows            |
| `security.md` / `.mdx`        | Security model & RBAC        | Data classification + enforcement      |
| `api-reference.md` / `.mdx`   | Endpoint docs                | Chat / Index APIs + parameters         |
| `demo-roles.md` / `.mdx`      | Role explanations            | Sample JWT roles for demos             |
| `quick-start.md` / `.mdx`     | Fast setup guide             | Mirrors root instructions with brevity |
| `index.md` / `.mdx`           | Landing documentation index  | Entry point for docs UI                |
| `mastra.mdx`                  | Mastra integration notes     | Orchestration & agents summary         |
| `onboarding-cedar-mastra.mdx` | Cedar + Mastra onboarding    | Cross-product narrative                |
| `theme-choices.md`            | Styling/theming rationale    | UI design decisions                    |
| `kilocode-headers.md`         | Header guidance              | Formatting conventions                 |

## Responsibilities

- Provide single source of truth for platform concepts
- Offer stable anchors for internal linking from code comments
- Support AI agent ingestion for contextual reasoning

## Non-Responsibilities

- Executable configuration (handled in code / env files)
- Dynamic runtime logs or metrics
- Legal or compliance policy documents (external)

## Integration Points

| Consumer                    | Interaction                                   |
| --------------------------- | --------------------------------------------- |
| `app/docs`                  | Renders markdown/MDX content into UI          |
| `mdx-plugins.ts` (in `lib`) | Adds custom remark/rehype transforms          |
| Agents / RAG indexing       | Content optionally ingested into vector store |
| Root README / AGENTS.md     | Cross-links into deeper sections              |

## Change Log

| Version | Date (UTC) | Change                                          |
| ------- | ---------- | ----------------------------------------------- |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata. |
| 1.0.0   | 2025-09-24 | Initial standardized documentation.             |
