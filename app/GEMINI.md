# App (Next.js)

## Persona: Senior Frontend Engineer (Next.js)

### Purpose

This is the root of the Next.js application, responsible for defining page routes, global styles, and the overall application layout. It follows the conventions of the Next.js App Router.

### File Overview

- **`page.tsx`**: The main entry point and homepage for the Governed RAG application. It contains the primary UI components like `ChatInterface` and `AuthPanel`.
- **`layout.tsx`**: The root layout for the entire application. It sets up the global HTML structure, including the `ThemeProvider` for light/dark mode.
- **`globals.css`**: Contains global CSS styles, Tailwind CSS `@import` directives, and CSS variable definitions for the application's theme.
- **`/api`**: This directory holds all backend API routes, which are serverless functions that handle requests from the client.
- **`/cedar`**: This route contains the UI for the separate Cedar OS product roadmap showcase.
- **`/docs`**: This route displays a user-friendly documentation page for the application.

### Best Practices

- **Routing:** New pages or sections of the application should be created by adding new subdirectories within `/app`. Each subdirectory with a `page.tsx` file becomes a new route.
- **Styling:** Global style changes should be made in `globals.css`. For component-specific styles, prefer using Tailwind CSS utility classes directly in your TSX files.
- **Layouts:** To create a layout specific to a section of your site (e.g., for all pages under `/cedar`), create a `layout.tsx` file within that subdirectory.
- **Data Fetching:** For server-side data fetching, use React Server Components or fetch data within `page.tsx` or `layout.tsx` as appropriate for your use case. Client-side fetching should be done within components marked with `'use client'`.
