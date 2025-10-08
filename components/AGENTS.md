<!-- AGENTS-META {"title":"Application Components","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/components","tags":["layer:frontend","domain:ui","type:components","status":"stable"],"status":"stable"} -->

# Components Directory (`/components`)

## Directory Purpose

This directory contains high-level, application-specific React components that compose the major UI surfaces of the application, such as chat, authentication, and layout. These components are built by composing smaller, reusable primitives from the `/components/ui` directory and are primarily used in the `app` directory to build pages.

## Scope

### In-Scope

-   Feature-level components like `ChatInterface.tsx` and `AuthPanel.tsx`.
-   Layout and structural components like `TopNavigation.tsx`, `Footer.tsx`, and `ClientRoot.tsx`.
-   Theming components like `ThemeProvider.tsx` and `ThemeToggle.tsx`.
-   Visualization components for security and application state.

### Out-of-Scope

-   Core business logic (which resides in `/src/mastra`).
-   Low-level, generic UI primitives (which belong in `/components/ui`).
-   React hooks (which belong in `/hooks`).

## Key Files

| File | Role | Notes |
| --- | --- | --- |
| `ClientRoot.tsx` | Root Client Layout | Wraps the application with client-side providers like `ThemeProvider` and includes the `TopNavigation`. |
| `TopNavigation.tsx` | Main Navigation Bar | The primary header for the application, containing links to different pages and the theme toggle. |
| `Footer.tsx` | Site Footer | The footer component with links to documentation, external resources, and legal information. |
| `ChatInterface.tsx` | Chat UI | The main interface for user interaction with the RAG agent, handling message display and input. |
| `AuthPanel.tsx` | Authentication Demo UI | A panel that allows users to generate demo JWTs for different roles to test the RBAC system. |
| `IndexingPanel.tsx` | Document Indexing UI | A panel for triggering the backend document indexing process via the `/api/index` endpoint. |
| `LoggedInAlert.tsx` | Session Status Display | An alert that shows the currently logged-in user's role and provides a sign-out button. |
| `SecurityIndicator.tsx` | Security Context Visualizer | Displays the user's current access level (e.g., Internal, Confidential) based on their role. |
| `UserMenu.tsx` | User Dropdown Menu | A dropdown in the navigation bar for user-specific actions like signing out. |
| `ThemeProvider.tsx` | Theme Context Provider | Wraps the `next-themes` provider to enable light and dark mode across the application. |
| `ThemeToggle.tsx` | Theme Switch UI | The UI component (a switch) for toggling between light and dark themes. |
| `FeatureCard.tsx` | Reusable Feature Card | A styled card component for highlighting application features, used on landing pages. |
| `Mermaid.tsx` | Diagram Renderer | A client component that uses the Mermaid.js library to render diagrams from text. |
| `RouteAnnouncer.tsx` | Accessibility Helper | A component that announces route changes to screen readers for better accessibility. |

## Subdirectories

-   `/ui`: Contains low-level, `shadcn/ui`-based primitive components like `Button`, `Card`, etc.
-   `/landing`, `/about`, `/blog`, `/contact`, `/login`: Contain components that are specific to those pages or sections of the application.

## Change Log

| Version | Date (UTC) | Change |
| --- | --- | --- |
| 1.1.0 | 2025-10-08 | Rewrote and synchronized the file list and descriptions with the actual source code. |
| 1.0.0 | 2025-09-24 | Initial standardized documentation. |