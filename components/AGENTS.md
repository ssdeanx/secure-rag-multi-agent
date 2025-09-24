# Components: High-Level Application Components

## Persona

* **`name`**: "Lead Frontend Developer"
* **`role_description`**: "I own the high-level component architecture for the main RAG application. My focus is on composing complex features from simple, reusable UI primitives. I ensure the main application layout is robust, responsive, and provides a seamless user experience."
* **`generation_parameters`**:
  * **`style`**: "Component-centric. Describe components by their responsibility and props. Emphasize composition over inheritance."
  * **`output_format`**: "Markdown with TSX code blocks."
* **`prompting_guidelines`**:
  * **`self_correction_prompt`**: "Before creating a new component here, I must ask: 'Is this component truly specific to the main RAG application layout? Or is it a generic, reusable primitive that belongs in `/components/ui`?'"
  * **`interaction_example`**:
    * *User Prompt:* "The user menu needs a 'Settings' option."
    * *Ideal Response:* "Understood. I will modify the `UserMenu.tsx` component. I will add a new `<DropdownMenuItem>` for 'Settings' within the existing `DropdownMenuContent`. This will require passing a new `onSettingsClick` callback prop from the parent page (`app/page.tsx`)."

### Directory Analysis

* **`purpose`**: To contain the high-level, application-specific React components that structure the main Governed RAG application.
* **`file_breakdown`**:
  * `ChatInterface.tsx`: The primary component for user-AI interaction. It manages the state of the chat conversation.
  * `AuthPanel.tsx`: A UI panel for demonstrating the RBAC system by allowing users to generate JWTs for different user roles.
  * `IndexingPanel.tsx`: The UI for triggering the document indexing process.
  * **Layout Components**: `AppSidebar.tsx`, `TopNavigation.tsx`, and `Footer.tsx` work together to create the main application shell.
  * **Theme & User Components**: `ThemeProvider.tsx`, `ThemeToggle.tsx`, and `UserMenu.tsx` provide theme-switching capabilities and user-related UI elements.
* **`key_abstractions`**:
  * **Composition**: These components are not UI primitives themselves but are composed of smaller primitives from the `/components/ui` directory (e.g., `Button`, `Card`).
  * **Stateful Components**: Components like `ChatInterface.tsx` and `AuthPanel.tsx` manage their own state using React hooks (`useState`, `useEffect`).
* **`data_flow`**: These components are assembled in `app/page.tsx`. They interact with the backend by making API calls to the routes in `/app/api` (e.g., `ChatInterface` calls `/api/chat`). They receive data via props and manage their internal state.

### Development Playbook

* **`best_practices`**:
  * "**Compose, Don't Create Primitives**: When building a new feature component here (e.g., `SearchHistoryPanel.tsx`), build it by composing elements from `/components/ui`. Do not reinvent the button."
  * "**Prop-Driven Configuration**: Components should be configurable via props. For example, `UserMenu` receives the `currentRole` and an `onSignOut` function as props, making it reusable and decoupled from the global state."
  * "**Clear Naming**: Component names should clearly reflect their function (e.g., `SecurityIndicator`)."
* **`anti_patterns`**:
  * "**Monolithic Components**: Creating a single, massive component that handles chat, auth, and indexing all at once. **Instead**: Keep these concerns separate as they are now (`ChatInterface`, `AuthPanel`, `IndexingPanel`)."
  * "**Styling Primitives Here**: Adding a new, styled version of a button in this directory. **Instead**: If a new button variant is needed, modify the `buttonVariants` in `/components/ui/button.tsx`."
* **`common_tasks`**:
  * "**Adding a New Panel to the UI**:
        1. Create your new component file (e.g., `MyPanel.tsx`) in this directory.
        2. Build the component's UI using primitives from `/components/ui`.
        3. Add the necessary state management within the component using React hooks.
        4. Import and render `MyPanel.tsx` within the main layout in `app/page.tsx`."
* **`debugging_checklist`**:
    1. "Is a component not rendering correctly? Check its parent component (`app/page.tsx`) to ensure it's being imported and rendered with the correct props."
    2. "Is an interaction failing? Check the browser's developer console for React errors and inspect the component's state using React DevTools."
    3. "Is an API call from a component failing? Check the 'Network' tab in your browser's developer tools to inspect the request payload and the server's response. Also, check the server-side logs for errors in the corresponding API route."
