<!-- AGENTS-META {"title":"Next.js App Router","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/app","tags":["layer:frontend","domain:ui","type:routes","status:stable"],"status":"stable"} -->

# App Directory (`/app`)

## Persona

**Name:** `{app_persona_name}` = "Application Surface Engineer"  
**Role:** "I structure routes, layouts, and composition boundaries so that domain logic, security, and orchestration remain in dedicated layers (services, workflows, agents)."  
**Focus Areas:**

1. Maintain predictable route tree & layout contracts.
2. Optimize server vs client component boundaries for performance.
3. Keep global providers minimal & purposeful.
4. Delegate heavy logic out of rendering layer.

**MUST:**

- Prefer server components unless interactivity required.
- Localize `'use client'` to smallest leaf needing it.
- Keep API-bound side effects in route handlers only.
- Ensure added pages documented in navigation where appropriate.

**FORBIDDEN:**

- Embedding workflow orchestration in page components.
- Direct vector / DB access from UI.
- Spreading auth/token parsing across components (centralize).
- Adding large client libs to root layout without justification.

## Directory Purpose

Root Next.js App Router surface: defines routes, layouts, global styles, and mounts high-level application components (chat, auth, indexing, documentation, cedar showcase).

## Scope

### In-Scope

- Route definitions via nested folders and `page.tsx` files
- Global HTML and theming (`layout.tsx`, `globals.css`)
- Integration points to API route handlers under `/app/api`
- Mounting UI feature panels (`ChatInterface`, `AuthPanel`, `IndexingPanel`)

### Out-of-Scope

- Low-level UI primitives (live in `components/ui`)
- Backend logic (in `src/mastra` or `src/services`)
- Vector / RAG orchestration (handled by Mastra workflows)

## Key Files

| File                | Role                            | Notes                                                  |
| ------------------- | ------------------------------- | ------------------------------------------------------ |
| `page.tsx`          | Home route composition          | Renders chat + auth + indexing panels                  |
| `layout.tsx`        | Root layout wrapper             | Provides `<html>` / `<body>` structure + ThemeProvider |
| `global.css`        | Global styles & Tailwind layers | Dark/light theme tokens                                |
| `about/page.tsx`    | Static marketing/info page      | Basic static route                                     |
| `demo-rag/page.tsx` | Demo specific view              | Showcase scenario                                      |
| `docs/`             | Documentation UI routes         | Renders MD/MDX content                                 |
| `cedar-os/`         | Cedar OS showcase               | Roadmap visualization integration                      |
| `api/`              | API route handlers              | Bridges frontend -> Mastra workflows                   |
| `login/`            | Auth flow demo                  | JWT / roles simulation                                 |

## Responsibilities

- Provide stable route structure and layout skeleton
- Enforce global theming & CSS variable definitions
- Mount application-level UI panels
- Delegate heavy logic to services / workflows

## Non-Responsibilities

- Business logic & security enforcement (Mastra workflows/services)
- Agent/tool definitions (`src/mastra`)
- JWT parsing / validation (handled in `lib/auth.ts` & agents)

## Integration Points

| External Directory | Interaction                                 |
| ------------------ | ------------------------------------------- |
| `/components`      | Imports composed & primitive UI components  |
| `/src/mastra`      | API routes trigger workflows / agents       |
| `/lib`             | Auth helpers & JWT utilities                |
| `/docs`            | MDX content surfaced via docs routes        |
| `/corpus`          | Source documents feeding retrieval pipeline |

## Common Tasks

1. Add New Page Route:
    - `mkdir app/new-feature && $EDITOR app/new-feature/page.tsx`
    - Export default component (server by default)
    - Add `'use client'` only if using state/effects
2. Add Section Layout:
    - Create `app/section/layout.tsx`
    - Wrap `{children}` with nav / providers
3. Add API Route:
    - `app/api/task/route.ts` with `export async function POST(req: NextRequest)`
    - Call from components using `fetch('/api/task', { method: 'POST', body: ... })`

## Testing & QA

- Use Playwright to smoke test primary pages
- Validate streaming from `/api/chat` after layout changes
- Run `npm run test:integration` for API route + workflow bridging

## Security Notes

- Keep secret logic in route handlers only
- Never expose raw JWT claims directly to client state without filtering

## Performance Considerations

- Favor server components to minimize bundle size
- Avoid large client dependencies in `layout.tsx`

## Known Pitfalls

- Missing default export in `page.tsx` -> runtime error
- Unnecessary `'use client'` increases bundle size

## Change Log

| Version | Date (UTC) | Change                                                  |
| ------- | ---------- | ------------------------------------------------------- |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved |

## Legacy Content (Preserved)

> Original descriptive content retained verbatim for historical context.

### (Legacy) Persona: Senior Frontend Engineer (Next.js)

#### Purpose

This is the root of the Next.js application, responsible for defining page routes, global styles, and the overall application layout. It follows the conventions of the Next.js App Router.

#### File Overview (Legacy)

- `page.tsx`: Main entry with `ChatInterface`, `AuthPanel`.
- `layout.tsx`: Root HTML + ThemeProvider wrapper.
- `globals.css`: Global CSS/Tailwind layers.
- `/api`: Serverless backend endpoints.
- `/cedar`: Cedar OS product roadmap showcase.
- `/docs`: Documentation UI route cluster.

#### (Legacy) Best Practices

- Routing via subdirectories with `page.tsx`.
- Global styles in `globals.css`.
- Section layouts via nested `layout.tsx`.
- Prefer server data fetching.
