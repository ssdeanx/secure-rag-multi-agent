<!-- AGENTS-META {"title":"Application Components","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/components","tags":["layer:frontend","domain:ui","type:components","status:stable"],"status":"stable"} -->

# Components Directory (`/components`)

## Directory Purpose

High-level application-specific React components composing major UI surfaces (chat, auth, indexing, layout, navigation, theme, user controls). These are composed from primitives living under `/components/ui` and are mounted mainly within `app/page.tsx` and other route entries.

## Scope

### In-Scope

- Feature-level / layout-level components (panels, navigation, thematic wrappers)
- Role & security visualization components (e.g. `SecurityIndicator`)
- Composition of primitives from `/components/ui`
- Presentation logic + lightweight state

### Out-Of-Scope

- Business logic / retrieval orchestration (lives in `src/mastra` services/workflows)
- Low-level UI primitives (`/components/ui`)
- React hooks (should be in `/hooks`)
- Direct JWT decoding (handled in `lib/auth.ts` or agents)

## Key Files

| File                    | Role                             | Notes                                 |
| ----------------------- | -------------------------------- | ------------------------------------- |
| `ChatInterface.tsx`     | Chat interaction surface         | Streams governed RAG answers          |
| `AuthPanel.tsx`         | Demo auth & role token panel     | Generates role-scoped JWTs            |
| `IndexingPanel.tsx`     | Trigger document indexing        | Calls indexing workflow API           |
| `AppSidebar.tsx`        | Shell navigation/sidebar         | Houses navigation & structural layout |
| `TopNavigation.tsx`     | Top bar navigation               | Brand, theme toggle, user menu        |
| `Footer.tsx`            | Site footer                      | Lightweight, static links             |
| `SecurityIndicator.tsx` | Displays security context        | Visualizes role / classification      |
| `ThemeProvider.tsx`     | Theme context provider           | Light/dark mode + system preference   |
| `ThemeToggle.tsx`       | Toggle button                    | Switches theme via context            |
| `UserMenu.tsx`          | User role & session actions      | Dropdown with role & actions          |
| `FeatureCard.tsx`       | Marketing/feature highlight card | Used on landing/demo sections         |
| `Mermaid.tsx`           | Mermaid diagram renderer         | Renders diagrams in docs/marketing    |
| `LoggedInAlert.tsx`     | Session status UI                | Shows active role/JWT presence        |

## Responsibilities

- Compose cohesive UI flows from primitives
- Provide consistent layout/state boundaries for feature surfaces
- Enforce minimal presentational logic & pass through events/data
- Enable accessibility & responsive layout patterns

## Non-Responsibilities

- Persistent domain state management (handled upstream or services)
- Direct vector retrieval or workflow invocation (done via API layer)
- Security decision making (visualization only here)

## Integration Points

| Target           | Interaction                                         |
| ---------------- | --------------------------------------------------- |
| `/app`           | Mounted inside route pages (home, demos)            |
| `/components/ui` | Provides primitives (buttons, cards, inputs)        |
| `/lib`           | Imports helper utilities (class merging, jwt utils) |
| `/app/api`       | Components call fetch endpoints (chat, index)       |
| `/src/mastra`    | Indirect via API routes triggering workflows        |

## Common Tasks

1. Create New Feature Panel
    - Create `NewPanel.tsx` in `/components`
    - Compose primitives from `/components/ui`
    - Keep internal state local; fetch via API endpoints
2. Add Layout Element
    - Modify `AppSidebar.tsx` or `TopNavigation.tsx`
    - Avoid embedding business logic; pass props/callbacks
3. Extend Chat Interface
    - Add UI affordance (e.g., history view) inside `ChatInterface`
    - Keep streaming logic intact; hook before rendering segments

## Testing & QA

- Use React Testing Library + Vitest for component render & interaction
- Snapshot critical layout components (sidebar, top navigation)
- Mock network for chat/indexing calls in tests

## Performance Considerations

- Defer large dynamic imports (e.g., diagram libs) using `next/dynamic`
- Avoid excessive client state; prefer server-rendered defaults

## Known Pitfalls

- Mixing primitive and composite responsibilities in same file
- Adding heavy dependencies directly (extract to dynamic or util)
- Over-fetching in multiple sibling components (centralize if needed)

## Change Log

| Version | Date (UTC) | Change                                                              |
| ------- | ---------- | ------------------------------------------------------------------- |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy descriptive content preserved |

## Legacy Content (Preserved)

> Original descriptive content retained verbatim for historical context.

```markdown
# Components: High-Level Application Components

## Persona

- **`name`**: "Lead Frontend Developer"
- **`role_description`**: "I own the high-level component architecture for the main RAG application. My focus is on composing complex features from simple, reusable UI primitives. I ensure the main application layout is robust, responsive, and provides a seamless user experience."
- **`generation_parameters`**:
    - **`style`**: "Component-centric. Describe components by their responsibility and props. Emphasize composition over inheritance."
    - **`output_format`**: "Markdown with TSX code blocks."
- **`prompting_guidelines`**:
    - **`self_correction_prompt`**: "Before creating a new component here, I must ask: 'Is this component truly specific to the main RAG application layout? Or is it a generic, reusable primitive that belongs in `/components/ui`?'"
    - **`interaction_example`**:
        - _User Prompt:_ "The user menu needs a 'Settings' option."
        - _Ideal Response:_ "Understood. I will modify the `UserMenu.tsx` component. I will add a new `<DropdownMenuItem>` for 'Settings' within the existing `DropdownMenuContent`. This will require passing a new `onSettingsClick` callback prop from the parent page (`app/page.tsx`)."

### Directory Analysis

- **`purpose`**: To contain the high-level, application-specific React components that structure the main Governed RAG application.
- **`file_breakdown`**:
    - `ChatInterface.tsx`: The primary component for user-AI interaction. It manages the state of the chat conversation.
    - `AuthPanel.tsx`: A UI panel for demonstrating the RBAC system by allowing users to generate JWTs for different user roles.
    - `IndexingPanel.tsx`: The UI for triggering the document indexing process.
    - **Layout Components**: `AppSidebar.tsx`, `TopNavigation.tsx`, and `Footer.tsx` work together to create the main application shell.
    - **Theme & User Components**: `ThemeProvider.tsx`, `ThemeToggle.tsx`, and `UserMenu.tsx` provide theme-switching capabilities and user-related UI elements.
- **`key_abstractions`**:
    - **Composition**: These components are not UI primitives themselves but are composed of smaller primitives from the `/components/ui` directory (e.g., `Button`, `Card`).
    - **Stateful Components**: Components like `ChatInterface.tsx` and `AuthPanel.tsx` manage their own state using React hooks (`useState`, `useEffect`).
- **`data_flow`**: These components are assembled in `app/page.tsx`. They interact with the backend by making API calls to the routes in `/app/api` (e.g., `ChatInterface` calls `/api/chat`). They receive data via props and manage their internal state.

### Development Playbook

- **`best_practices`**:
    - "**Compose, Don't Create Primitives**: When building a new feature component here (e.g., `SearchHistoryPanel.tsx`), build it by composing elements from `/components/ui`. Do not reinvent the button."
    - "**Prop-Driven Configuration**: Components should be configurable via props. For example, `UserMenu` receives the `currentRole` and an `onSignOut` function as props, making it reusable and decoupled from the global state."
    - "**Clear Naming**: Component names should clearly reflect their function (e.g., `SecurityIndicator`)."
- **`anti_patterns`**:
    - "**Monolithic Components**: Creating a single, massive component that handles chat, auth, and indexing all at once. **Instead**: Keep these concerns separate as they are now (`ChatInterface`, `AuthPanel`, `IndexingPanel`)."
    - "**Styling Primitives Here**: Adding a new, styled version of a button in this directory. **Instead**: If a new button variant is needed, modify the `buttonVariants` in `/components/ui/button.tsx`."
- **`common_tasks`**:
    - "**Adding a New Panel to the UI**: 1. Create your new component file (e.g., `MyPanel.tsx`) in this directory. 2. Build the component's UI using primitives from `/components/ui`. 3. Add the necessary state management within the component using React hooks. 4. Import and render `MyPanel.tsx` within the main layout in `app/page.tsx`."
- **`debugging_checklist`**:
    1. "Is a component not rendering correctly? Check its parent component (`app/page.tsx`) to ensure it's being imported and rendered with the correct props."
    2. "Is an interaction failing? Check the browser's developer console for React errors and inspect the component's state using React DevTools."
    3. "Is an API call from a component failing? Check the 'Network' tab in your browser's developer tools to inspect the request payload and the server's response. Also, check the server-side logs for errors in the corresponding API route."
```
