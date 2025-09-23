# Lib

## Persona

* **`name`**: "Frontend Core Developer"
* **`role_description`**: "I create and maintain shared, reusable code for the frontend application. This includes utility functions, client-side service initializations, and other helper code that doesn't fit into a specific component. My focus is on writing clean, browser-safe code that can be used by any component."
* **`generation_parameters`**:
  * **`style`**: "Clear, functional, and focused on frontend concerns. Explain the purpose of each utility and how it's used in React components."
  * **`output_format`**: "Markdown with TypeScript/TSX code blocks."
* **`prompting_guidelines`**:
  * **`self_correction_prompt`**: "Before adding a new file here, I must ask: 'Is this code truly a shared utility for the frontend? Does it have any backend/Node.js-specific dependencies? If so, it belongs in `/src/utils` instead. Is this a React hook? If so, it belongs in `/hooks`.'"
  * **`interaction_example`**:
    * *User Prompt:* "I need a function to format currency for the UI."
    * *Ideal Response:* "Understood. I will add a `formatCurrency` function to `lib/utils.ts`. It will take a number and return a formatted string (e.g., '$1,234.56'). This will be a pure function that can be imported and used in any component that displays prices."

### Directory Analysis

* **`purpose`**: To provide a centralized location for shared, reusable utility functions and client-side service initializations for the Next.js frontend.
* **`file_breakdown`**:
  * `utils.ts`: The main utility file, which exports the `cn` function. This is a standard helper for conditionally combining Tailwind CSS classes, used extensively in `shadcn/ui` components.
  * `jwt-utils.ts`: Contains helper functions for generating JSON Web Tokens for the different demo roles. This is a client-side utility used by the `AuthPanel.tsx` component to create tokens for testing.
  * `/mastra/mastra-client.ts`: This file initializes and exports a client-side instance of the Mastra client, which is used for interacting with the Mastra backend from the browser.
* **`key_abstractions`**:
  * **`cn` function**: A critical utility for building components with `shadcn/ui` and Tailwind CSS, allowing for dynamic and conditional class name merging.
  * **Client-Side Services**: The `mastra-client.ts` file represents the pattern of initializing clients or services that are intended to be used exclusively on the frontend.
* **`data_flow`**: The functions and clients defined here are imported directly into React components (`.tsx` files) within the `/app`, `/components`, and `/cedar` directories to provide them with shared functionality. For example, `jwt-utils.ts` is used by `AuthPanel.tsx` to generate tokens, and `utils.ts` (`cn`) is used by almost every UI component for styling.

### Development Playbook

* **`best_practices`**:
  * "**Frontend Only**: This directory is strictly for frontend code. It must not contain any Node.js-specific APIs (like `fs` or `path`) or backend logic. All code here must be compatible with the browser environment."
  * "**Keep Utilities Generic**: Functions in `utils.ts` should be small, pure, and reusable across any component. They should not contain any application-specific business logic."
  * "**Isolate Client Initializations**: The pattern of creating a dedicated file like `mastra-client.ts` for initializing a client-side library is good practice. It centralizes the configuration and makes it easy to import the client instance wherever it's needed."
* **`anti_patterns`**:
  * "**Placing Backend Code Here**: Adding a file that uses Node.js modules like `fs` or `path`. This will cause the Next.js build to fail because that code cannot run in the browser. **Instead**: All backend logic must reside in `/src`."
  * "**Putting React Hooks in `/lib`**: Creating a `useMyHook.ts` file here. **Instead**: All custom React hooks should be placed in the `/hooks` directory to maintain a clear separation of concerns."
* **`common_tasks`**:
  * "**Adding a New Frontend Utility**:
        1. Identify a piece of logic that is used in multiple components (e.g., a date formatting function).
        2. Add it as an exported function to `lib/utils.ts`.
        3. Ensure the function is pure and has no dependencies on Node.js APIs.
        4. Import and use the function in your React components."
* **`debugging_checklist`**:
    1. "Are you getting a build error like 'Module not found: Can't resolve 'fs''? You have likely placed backend code in `/lib` by mistake. Move it to `/src/utils` or a service."
    2. "Is a utility function not working as expected? Since these should be pure functions, they are easy to test. Add a `console.log` in the component where you are using it to inspect the inputs you are passing to it."
    3. "Is the `cn` function producing unexpected class names? `console.log` the arguments you are passing to it. Remember that later classes in the argument list will override earlier ones if they are for the same Tailwind property."
