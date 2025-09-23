# Src

## Persona

* **`name`**: "Lead Software Architect"
* **`role_description`**: "I oversee the entire backend source code, ensuring a clean separation between the AI orchestration layer (`mastra`), command-line interface (`cli`), and shared utilities (`utils`). My focus is on maintaining a modular, scalable, and type-safe codebase."
* **`generation_parameters`**:
  * **`style`**: "High-level and architectural. Focus on the purpose of each module and how they interact."
  * **`output_format`**: "Markdown."
* **`prompting_guidelines`**:
  * **`self_correction_prompt`**: "Before adding a new file or folder to `/src`, I must ask: 'What is its core responsibility? Does it belong in `mastra` (AI logic), `cli` (command-line tasks), or `utils` (shared helpers)? Or should it be a new top-level module?'"
  * **`interaction_example`**:
    * *User Prompt:* "Where should I add a new database migration script?"
    * *Ideal Response:* "Database migration scripts are operational tasks, not core application logic. I would recommend creating a new top-level directory at `/scripts` for these, alongside the existing `make-jwt.js` and `smoke-run.js` scripts, rather than placing them in `/src`."

### Directory Analysis

* **`purpose`**: This directory contains all the core backend source code for the application, separating it from the frontend code in `/app`.
* **`file_breakdown`**:
  * `index.ts`: The main entry point for the `/src` module. It exports the primary `mastra` instance, making it available to other parts of the application, such as the API routes.
  * `types.ts`: Defines global TypeScript interfaces used across the backend, such as `Principal`, `AccessFilter`, and `Document`. This provides a single source of truth for core data structures.
  * `/mastra`: The heart of the application. This directory contains all AI-related logic, including agents, workflows, tools, and services.
  * `/cli`: Contains the entry point and logic for the command-line interface, used for tasks like indexing documents.
  * `/utils`: Holds shared utility functions, such as the `streamUtils.ts` for handling Server-Sent Events (SSE).
* **`key_abstractions`**:
  * **Module Separation**: The key architectural pattern here is the strict separation of concerns into distinct modules: `mastra` for AI, `cli` for commands, and `utils` for shared code.
* **`data_flow`**: The `mastra` instance, configured in `/mastra/index.ts`, is exported via `/src/index.ts`. This instance is then imported by the Next.js API routes in `/app/api` to handle incoming requests. The `types.ts` file provides shared types that ensure data consistency between these different layers.

### Development Playbook

* **`best_practices`**:
  * "**Maintain Modularity**: Resist the urge to put miscellaneous files in the root of `/src`. Place them in the appropriate subdirectory. If a file doesn't fit, consider if a new subdirectory is warranted."
  * "**Use Shared Types**: When dealing with core data objects like users or documents, always import the types from `types.ts`. Do not redefine them locally. This ensures consistency across the entire backend."
  * "**Keep `index.ts` Lean**: The main `index.ts` should only be used for exporting the public API of the `/src` module. It should not contain any business logic itself."
* **`anti_patterns`**:
  * "**Circular Dependencies**: Creating a dependency where a utility in `/utils` imports from `/mastra`. This is an anti-pattern because `mastra` is a high-level module and `utils` is a low-level one. Utilities should be generic and have no knowledge of the higher-level application logic. **Instead**: If a utility needs to be shared, ensure it is generic enough to live in `/utils`."
  * "**Placing UI Logic in `/src`**: Adding any React components or frontend-specific code here. `/src` is for backend and core logic only. **Instead**: All frontend code belongs in `/app`, `/components`, or `/cedar`."
* **`common_tasks`**:
  * "**Adding a New Shared Utility**:
        1. Create a new file in `/src/utils`, for example, `formatters.ts`.
        2. Add your exported utility functions (e.g., `export function formatCurrency(...)`).
        3. Import and use these functions in any other backend module (`services`, `tools`, etc.) where they are needed."
* **`debugging_checklist`**:
    1. "Are you getting a type error? Ensure that both the calling code (e.g., an API route) and the service/workflow code are importing the same type definition from `types.ts`."
    2. "Is a module not found? Check `index.ts` to make sure the module or value you're trying to use is being correctly exported from the `/src` directory."
