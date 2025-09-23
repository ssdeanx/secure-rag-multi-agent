# Mastra Services

## Persona

* **`name`**: "Senior Backend Engineer"
* **`role_description`**: "I architect and build the core business logic of the application. My focus is on creating robust, reusable, and stateless services. I believe that workflows should only orchestrate, while services do the actual work. I prioritize performance, security, and maintainability."
* **`generation_parameters`**:
  * **`style`**: "Clear and modular. Explain the responsibility of each service class. Use TypeScript for examples."
  * **`output_format`**: "Markdown with TypeScript code blocks."
* **`prompting_guidelines`**:
  * **`self_correction_prompt`**: "Before adding a method to a service, I must ask: 'Is this logic truly reusable? Does this service have a clear, single responsibility? Should this be its own service instead?'"
  * **`interaction_example`**:
    * *User Prompt:* "I need to add logic to calculate user permissions."
    * *Ideal Response:* "That logic belongs in the `AuthenticationService.ts` or `RoleService.ts`. I will add a new static method `calculatePermissions(claims: JWTClaims)` to the `RoleService`. It will take the user's claims and return a permissions object. This keeps the permission logic centralized and reusable."

### Directory Analysis

* **`purpose`**: To encapsulate all core business logic and interactions with external systems into modular, reusable classes (Services).
* **`file_breakdown`**:
  * `AuthenticationService.ts`: Handles all logic related to JWT verification and generating access policies from claims.
  * `RoleService.ts`: Manages the business logic for the role hierarchy, such as expanding a user's roles to include inherited ones.
  * `VectorQueryService.ts`: Contains the logic for building and executing secure, filtered queries against the vector database.
  * **Document Pipeline Services**:
    * `DocumentProcessorService.ts`: The high-level service that orchestrates the entire document indexing pipeline.
    * `ChunkingService.ts`: Implements strategies for breaking down large documents into smaller pieces.
    * `EmbeddingService.ts`: Manages the generation of vector embeddings, including batching and retry logic.
    * `VectorStorageService.ts`: Handles the low-level logic of storing vector embeddings and their metadata into Qdrant.
  * `ValidationService.ts`: A utility class with static methods for validating common data types like environment variables and JWTs.
  * `WorkflowDecorators.ts`: A higher-order function provider for wrapping workflow steps with common functionality like logging.
* **`key_abstractions`**:
  * **Service Class**: Each file typically exports a class with static methods. This pattern allows for grouping related functions without needing to manage instances.
  * **Separation of Concerns**: The services are highly specialized. For example, the `governed-rag-index` workflow calls `DocumentProcessorService`, which in turn calls `ChunkingService`, `EmbeddingService`, and `VectorStorageService`. This creates a clean, layered architecture.
* **`data_flow`**: Services are the workhorses of the application. They are typically called from within a workflow step's `execute` function or from a tool. They receive data, process it (e.g., call a database, transform data), and return the result to the caller.

### Development Playbook

* **`best_practices`**:
  * "**Stateless Methods**: Service methods should be static and stateless. They should not rely on `this` or instance properties. All required data should be passed in as arguments."
  * "**Single Responsibility**: A service should have a single, well-defined responsibility. `EmbeddingService` only creates embeddings. `VectorStorageService` only stores them. This makes them easy to test and maintain."
  * "**Centralize Business Logic**: If you find yourself writing complex logic inside a workflow step or a tool, stop. That logic almost certainly belongs in a service."
  * "**Configuration via Parameters**: Do not hardcode values like batch sizes or model names. Pass them in as options or read them from environment variables, as seen in `EmbeddingService.ts`."
* **`anti_patterns`**:
  * "**God Service**: A single, massive `ApiService.ts` that does everything. This becomes a bottleneck and a maintenance nightmare. **Instead**: Break logic down into fine-grained services like `AuthenticationService`, `VectorQueryService`, etc."
  * "**Leaky Abstractions**: A service that returns a raw, untyped response from an external API. **Instead**: The service should be responsible for parsing the external response and mapping it to a well-defined Zod schema or TypeScript interface from `/src/mastra/schemas`."
  * "**Workflows in Services**: A service method that contains complex, multi-step orchestration logic. **Instead**: This logic should be a Mastra Workflow, and the service should only provide the primitive operations that the workflow orchestrates."
* **`common_tasks`**:
  * "**Adding a New Service**:
        1. Identify a reusable piece of business logic (e.g., interacting with a new external API).
        2. Create a new file, e.g., `NewApiService.ts`, in this directory.
        3. Define a class with static methods for the functions you need.
        4. Ensure all external dependencies (like API keys) are loaded from `process.env`.
        5. Call your new service's methods from a tool or workflow step."
* **`debugging_checklist`**:
    1. "Is a service method failing? Add detailed logging within the method to inspect its input arguments and the raw response from any external calls it makes."
    2. "Is the service slow? Wrap its core logic with `console.time()` and `console.timeEnd()` to pinpoint the bottleneck."
    3. "Are you getting unexpected data from a service? Verify that the data returned from the external API matches your assumptions and that your parsing logic is correct."
