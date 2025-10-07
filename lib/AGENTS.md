<!-- AGENTS-META {"title":"Shared Frontend Library","version":"1.1.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/lib","tags":["layer:frontend","domain:shared","type:utilities","status:stable"],"status":"stable"} -->

# Library Directory (`/lib`)

## Directory Purpose

Provides browser-safe shared utilities, lightweight client helpers, auth/JWT helpers, and MDX plugin definitions consumed across frontend routes and higher-level components.

## Scope

### In-Scope

- Stateless utility functions (`utils.ts`)
- JWT demo utility generation & helpers (`jwt-utils.ts`)
- Auth/session helpers (`auth.ts`)
- MDX transformer/plugin definitions (`mdx-plugins.*`)
- Thin client initializers (Mastra client subfolder)

### Out-of-Scope

- Backend service logic (belongs in `src/mastra/services`)
- React hooks (should live in `/hooks`)
- Heavy state management or workflow orchestration

## Key Files

| File             | Role                          | Notes                                                        |
| ---------------- | ----------------------------- | ------------------------------------------------------------ |
| `utils.ts`       | Class name & misc utils       | Exports `cn` combinator                                      |
| `jwt-utils.ts`   | Demo token generators         | Creates role-scoped JWTs for UI demos                        |
| `auth.ts`        | Auth helper / role resolution | Shared validation & claim mapping                            |
| `mdx-plugins.ts` | MDX config (TS)               | Type-safe plugin export                                      |
| `mdx-plugins.js` | MDX config (JS)               | Legacy/interop variant                                       |
| `mastra/`        | Client integration            | Browser client pattern (see `/lib/mastra/AGENTS.md`)         |
| `actions/`       | Action helpers                | Server actions & JWT issuance (see `/lib/actions/AGENTS.md`) |

## Responsibilities

- Centralize pure browser-compatible helpers
- Enable consistent MDX transformation pipeline
- Support demo JWT generation while isolating secrets server side

## Non-Responsibilities

- Direct DOM manipulation side-effects (leave to components)
- Server-only secrets or environment initialization
- Business logic for retrieval or policy enforcement

## Integration Points

| Consumer         | Usage                                     |
| ---------------- | ----------------------------------------- |
| `/components`    | Uses `cn`, jwt generation for `AuthPanel` |
| `/app/api`       | May import `auth.ts` for token utilities  |
| `/docs`          | MDX plugins enrich doc rendering          |
| Agents/Workflows | Indirectly via exported helpers when safe |

## Common Tasks

1. Add Utility Function
    - Append export in `utils.ts`
    - Keep pure & side-effect free
2. Extend JWT Demo Logic
    - Add role case in `jwt-utils.ts`
    - Ensure claims match policy expectations
3. Add MDX Plugin
    - Modify `mdx-plugins.ts` adding remark/rehype entry
    - Validate build compiles MDX with new transform

## Testing & QA

- Unit test pure utilities with Vitest
- Snapshot complex MDX transformation output when applicable
- Validate JWT structure using `atob` decode in local dev

## Security Notes

- Never embed actual production secrets; demo tokens only
- Keep cryptographic or signing logic server-side if expanded

## Change Log

| Version | Date (UTC) | Change                                                        |
| ------- | ---------- | ------------------------------------------------------------- |
| 1.1.0   | 2025-09-24 | Added cross-links to `/lib/mastra` and `/lib/actions` subdocs |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved       |

## Legacy Content (Preserved)

> Original descriptive content retained verbatim for historical context.

```markdown
# Lib

## Persona

- **`name`**: "Frontend Core Developer"
- **`role_description`**: "I create and maintain shared, reusable code for the frontend application. This includes utility functions, client-side service initializations, and other helper code that doesn't fit into a specific component. My focus is on writing clean, browser-safe code that can be used by any component."
- **`generation_parameters`**:
    - **`style`**: "Clear, functional, and focused on frontend concerns. Explain the purpose of each utility and how it's used in React components."
    - **`output_format`**: "Markdown with TypeScript/TSX code blocks."
- **`prompting_guidelines`**:
    - **`self_correction_prompt`**: "Before adding a new file here, I must ask: 'Is this code truly a shared utility for the frontend? Does it have any backend/Node.js-specific dependencies? If so, it belongs in `/src/utils` instead. Is this a React hook? If so, it belongs in `/hooks`.'"
    - **`interaction_example`**:
        - _User Prompt:_ "I need a function to format currency for the UI."
        - _Ideal Response:_ "Understood. I will add a `formatCurrency` function to `lib/utils.ts`. It will take a number and return a formatted string (e.g., '$1,234.56'). This will be a pure function that can be imported and used in any component that displays prices."

### Directory Analysis

- **`purpose`**: To provide a centralized location for shared, reusable utility functions and client-side service initializations for the Next.js frontend.
- **`file_breakdown`**:
    - `utils.ts`: The main utility file, which exports the `cn` function. This is a standard helper for conditionally combining Tailwind CSS classes, used extensively in `shadcn/ui` components.
    - `jwt-utils.ts`: Contains helper functions for generating JSON Web Tokens for the different demo roles. This is a client-side utility used by the `AuthPanel.tsx` component to create tokens for testing.
    - `/mastra/mastra-client.ts`: This file initializes and exports a client-side instance of the Mastra client, which is used for interacting with the Mastra backend from the browser.
- **`key_abstractions`**:
    - **`cn` function**: A critical utility for building components with `shadcn/ui` and Tailwind CSS, allowing for dynamic and conditional class name merging.
    - **Client-Side Services**: The `mastra-client.ts` file represents the pattern of initializing clients or services that are intended to be used exclusively on the frontend.
- **`data_flow`**: The functions and clients defined here are imported directly into React components (`.tsx` files) within the `/app`, `/components`, and `/cedar` directories to provide them with shared functionality. For example, `jwt-utils.ts` is used by `AuthPanel.tsx` to generate tokens, and `utils.ts` (`cn`) is used by almost every UI component for styling.

### Development Playbook

- **`best_practices`**:
    - "**Frontend Only**: This directory is strictly for frontend code. It must not contain any Node.js-specific APIs (like `fs` or `path`) or backend logic. All code here must be compatible with the browser environment."
    - "**Keep Utilities Generic**: Functions in `utils.ts` should be small, pure, and reusable across any component. They should not contain any application-specific business logic."
    - "**Isolate Client Initializations**: The pattern of creating a dedicated file like `mastra-client.ts` for initializing a client-side library is good practice. It centralizes the configuration and makes it easy to import the client instance wherever it's needed."
- **`anti_patterns`**:
    - "**Placing Backend Code Here**: Adding a file that uses Node.js modules like `fs` or `path`. This will cause the Next.js build to fail because that code cannot run in the browser. **Instead**: All backend logic must reside in `/src`."
    - "**Putting React Hooks in `/lib`**: Creating a `useMyHook.ts` file here. **Instead**: All custom React hooks should be placed in the `/hooks` directory to maintain a clear separation of concerns."
- **`common_tasks`**:
    - "**Adding a New Frontend Utility**": 1. Identify a piece of logic that is used in multiple components (e.g., a date formatting function). 2. Add it as an exported function to `lib/utils.ts`. 3. Ensure the function is pure and has no dependencies on Node.js APIs. 4. Import and use the function in your React components."
- **`debugging_checklist`**:
    1. "Are you getting a build error like 'Module not found: Can't resolve 'fs''? You have likely placed backend code in `/lib` by mistake. Move it to `/src/utils` or a service."
    2. "Is a utility function not working as expected? Since these should be pure functions, they are easy to test. Add a `console.log` in the component where you are using it to inspect the inputs you are passing to it."
    3. "Is the `cn` function producing unexpected class names? `console.log` the arguments you are passing to it. Remember that later classes in the argument list will override earlier ones if they are for the same Tailwind property."
```
