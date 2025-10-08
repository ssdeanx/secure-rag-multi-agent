<!-- AGENTS-META {"title":"Shared Frontend Library","version":"1.2.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/lib","tags":["layer:frontend","domain:shared","type:utilities","status:stable"],"status":"stable"} -->

# Library Directory (`/lib`)

## Directory Purpose

Provides browser-safe shared utilities, lightweight client helpers, auth/JWT helpers, and MDX plugin definitions consumed across frontend routes and higher-level components.

## Scope

### In-Scope

- Stateless utility functions (`utils.ts`)
- JWT demo utility generation & helpers (`jwt-utils.ts`)
- Auth/session helpers (`auth.ts`)
- MDX transformer/plugin definitions (`mdx-plugins.*`)
- Blog post parsing and retrieval (`blog.ts`)
- Metadata generation for pages (`metadata.ts`)
- Thin client initializers (Mastra client subfolder)

### Out-of-Scope

- Backend service logic (belongs in `src/mastra/services`)
- React hooks (should live in `/hooks`)
- Heavy state management or workflow orchestration

## Key Files

| File             | Role                          | Notes                                                        |
| ---------------- | ----------------------------- | ------------------------------------------------------------ |
| `utils.ts`       | Class name & misc utils       | Exports `cn` combinator for Tailwind CSS class merging.      |
| `jwt-utils.ts`   | Demo token generators         | Creates role-scoped JWTs for UI demos.                       |
| `auth.ts`        | Auth helper / role resolution | Contains Supabase client and auth token retrieval logic.     |
| `blog.ts`        | Blog Post Utilities           | Functions for reading and parsing blog posts from the filesystem. |
| `metadata.ts`    | Metadata Helpers              | Functions for building Next.js metadata for pages.           |
| `mdx-plugins.ts` | MDX config (TS)               | Type-safe remark and rehype plugin exports for MDX processing. |
| `mdx-plugins.js` | MDX config (JS)               | Legacy/interop variant for MDX configuration.                |
| `mastra/`        | Client integration            | Browser client pattern (see `/lib/mastra/AGENTS.md`).        |
| `actions/`       | Action helpers                | Server actions & JWT issuance (see `/lib/actions/AGENTS.md`).|

## Change Log

| Version | Date (UTC) | Change                                                        |
| ------- | ---------- | ------------------------------------------------------------- |
| 1.2.0   | 2025-10-08 | Synchronized file list and descriptions with actual source code. |
| 1.1.0   | 2025-09-24 | Added cross-links to `/lib/mastra` and `/lib/actions` subdocs |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved       |