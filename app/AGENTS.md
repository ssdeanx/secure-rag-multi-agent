<!-- AGENTS-META {"title":"Next.js App Router","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/app","tags":["layer:frontend","domain:ui","type:routes","status:stable"],"status":"stable"} -->

# App Directory (`/app`)

## Persona

**Name:** `{app_persona_name}` = "Application Surface Engineer"
**Role:** "I structure routes, layouts, and composition boundaries so that domain logic, security, and orchestration remain in dedicated layers (services, workflows, agents)."
**Focus Areas:**
1. Maintain predictable route tree & layout contracts.
2. Optimize server vs client component boundaries for performance.
3. Keep global providers minimal & purposeful.
4. Delegate heavy logic out of rendering layer.

## Directory Purpose

This directory is the root of the Next.js App Router. It defines the application's URL structure, contains the root layout and global styles, and specifies the top-level pages and error boundaries for the application.

## Scope

### In-Scope

-   Route definitions via nested folders and `page.tsx` files.
-   Global HTML structure, metadata, and theme providers (`layout.tsx`).
-   Global styling and Tailwind CSS configuration (`global.css`).
-   Top-level error handling (`error.tsx`) and not-found pages (`not-found.tsx`).
-   Mounting the primary application content, such as the main landing page.

### Out-of-Scope

-   Low-level UI primitives (which belong in `/components/ui`).
-   Backend business logic and AI orchestration (which live in `/src/mastra`).
-   Specific feature components (which are composed in `/components`).

## Key Files & Directories

| File / Directory | Role | Notes |
| --- | --- | --- |
| `page.tsx` | Main Landing Page | Renders the marketing homepage, composing components from `/components/landing`. |
| `layout.tsx` | Root Layout | Defines the `<html>` and `<body>` structure, loads global CSS, and wraps content in `ClientRoot`. |
| `global.css` | Global Styles | Contains `@import` for Tailwind CSS and other global style definitions and fallbacks. |
| `error.tsx` | Global Error Boundary | Catches and handles unexpected errors for the entire application segment. |
| `not-found.tsx` | Not Found Page | Renders the UI for 404 errors when a route is not matched. |
| `api/` | API Routes | Contains all backend route handlers that bridge the frontend to Mastra workflows. |
| `cedar-os/` | Cedar OS Showcase | Contains the interactive product roadmap and AI integration showcase. |
| `docs/` | Documentation Routes | Directory for rendering technical and user documentation. |
| `login/` | Authentication Pages | Contains UI components and logic for user login and session management. |
| `blog/` | Blog Pages | Contains pages for rendering blog posts. |

## Change Log

| Version | Date (UTC) | Change |
| --- | --- | --- |
| 1.1.0 | 2025-10-08 | Synchronized file list and descriptions with actual source code. |
| 1.0.0 | 2025-09-24 | Initial standardized documentation. |