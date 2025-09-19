# Src Utils

## Persona

* **`name`**: "Core Library Developer"
* **`role_description`**: "I create generic, reusable helper functions and utilities that can be used across the entire backend. My code must be highly reliable, performant, and have zero dependencies on higher-level application logic like agents or workflows."
* **`generation_parameters`**:
  * **`style`**: "Clean, functional, and well-documented. Explain the purpose of each utility function and its parameters."
  * **`output_format`**: "Markdown with TypeScript code blocks."
* **`prompting_guidelines`**:
  * **`self_correction_prompt`**: "Before creating a new utility, I must ask: 'Is this function truly generic? Does it have any dependencies on the `mastra` or `app` modules? Could this be used in a completely different project? If not, it doesn't belong in `/utils`.'"
  * **`interaction_example`**:
    * *User Prompt:* "I need a function to format dates."
    * *Ideal Response:* "Certainly. I will create a new file, `src/utils/dateUtils.ts`, and add an exported function `formatDate(date: Date): string`. This function will have no external dependencies and can be imported into any service or module that needs date formatting."

### Directory Analysis

* **`purpose`**: To provide a collection of generic, reusable helper functions that are not specific to any single part of the application.
* **`file_breakdown`**:
  * `streamUtils.ts`: "Contains helper functions specifically for creating and managing Server-Sent Event (SSE) streams. These functions (`createSSEStream`, `streamJSONEvent`, `handleTextStream`) are used by the API routes in `/app/api` to stream responses to the client."
* **`key_abstractions`**:
  * **`ReadableStreamDefaultController`**: The low-level web API that these utility functions wrap, abstracting away the complexity of manual encoding and stream management.
  * SSE Formatting: The utilities correctly handle the `data: {...}

` formatting required for the Server-Sent Events protocol, ensuring compatibility with frontend clients.

* **`data_flow`**: The functions in this directory are pure, low-level utilities. They are imported and used by higher-level modules that require their specific functionality. For example, the `POST` handler in `/app/api/chat/route.ts` imports `createSSEStream` and `streamJSONEvent` to manage its response to the client.

### Development Playbook

* **`best_practices`**:
  * "**Keep it Generic**: Utilities in this folder should be pure and have no knowledge of Mastra, agents, or specific application workflows. They should be simple, focused, and reusable in any context."
  * "**No Side Effects**: A utility function should take inputs and return outputs. It should not modify global state, write to a database, or have other side effects."
  * "**Export Functions, Not Classes**: For simple utilities, prefer exporting standalone functions over creating classes with static methods. This makes them easier to import, use, and test."
* **`anti_patterns`**:
  * "**Importing from High-Level Modules**: A utility in `/src/utils` that `import`s anything from `/src/mastra` or `/app`. This creates a circular dependency and breaks the layered architecture of the application. **Instead**: If a function needs application-specific context, it's not a utility and belongs in a service in `/src/mastra/services`."
  * "**Domain-Specific Logic**: Adding a function like `calculateRAGPermissions` to this directory. This is highly specific business logic that depends on the application's domain. **Instead**: This logic belongs in a dedicated service like `RoleService.ts`."
* **`common_tasks`**:
  * "**Adding a New Utility Function**:
        1. Determine if the function is truly generic.
        2. Add the exported function to an existing relevant file (e.g., date helpers in `dateUtils.ts`) or create a new file for a new category of utility (e.g., `stringUtils.ts`).
        3. Ensure the function is pure and has no application-specific dependencies.
        4. Add unit tests for the new utility in the `/tests` directory to ensure it is reliable."
* **`debugging_checklist`**:
    1. "Is a utility function behaving unexpectedly? Since utilities are pure, they are easy to test. Write a unit test in Vitest that calls the function with specific inputs and asserts that the output is what you expect."
    2. "Is there a 'module not found' error when using a utility? Check that the function is correctly `export`ed from its file and that the `import` path in the consuming file is correct."
