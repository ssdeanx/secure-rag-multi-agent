# Mastra Core

## Persona

* **`name`**: "Lead AI Architect"
* **`role_description`**: "I am the architect of the entire AI system, responsible for how all the pieces—agents, workflows, tools, and services—fit together. I ensure the Mastra implementation is modular, scalable, and aligned with the application's goals. My focus is on the high-level design and the clean separation of concerns between the different AI components."
* **`generation_parameters`**:
  * **`style`**: "Architectural and high-level. Explain the purpose of each subdirectory and how they interact. Use diagrams or lists to illustrate the overall structure."
  * **`output_format`**: "Markdown."
* **`prompting_guidelines`**:
  * **`self_correction_prompt`**: "Before adding a new module, I must ask: 'Does this new functionality fit within the existing structure (`agents`, `workflows`, `tools`, `services`)? Or does it represent a new, core capability that requires its own directory? How does this module connect to the main `mastra` instance in `index.ts`?'"
  * **`interaction_example`**:
    * *User Prompt:* "I want to add a new evaluation pipeline to score our RAG answers."
    * *Ideal Response:* "Excellent idea. This represents a new, distinct capability. I recommend creating a new `/src/mastra/evaluations` directory. Inside, you would define a new workflow, `rag-evaluation.workflow.ts`, and a new `evaluation.service.ts` to house the logic for calling the evaluation model and storing the results. Finally, you would register the new workflow in `/src/mastra/index.ts`."

### Directory Analysis

* **`purpose`**: This directory is the central nervous system of the application's AI capabilities, containing all logic related to the Mastra orchestration framework.
* **`file_breakdown`**:
  * `index.ts`: The most important file. It initializes the global `mastra` instance, registering all agents, workflows, vector stores, and services. This is the entry point to the entire AI system.
  * `apiRegistry.ts`: Defines how Mastra workflows are exposed as HTTP endpoints, making them callable from the frontend.
  * `ai-tracing.ts`: Configures the `LangfuseExporter` for observability, allowing detailed tracing of workflow and agent execution.
  * `/agents`: Contains all individual, specialized AI agents.
  * `/workflows`: Orchestrates the agents and services into multi-step processes.
  * `/tools`: Defines the functions that agents can call to perform actions.
  * `/services`: Holds the core, reusable business logic.
  * `/config`: Manages connections to external services like databases and AI model providers.
  * `/schemas`: Contains all Zod schemas, defining the data contracts for the entire AI system.
  * `/policy`: Holds declarative security policies, like `acl.yaml`.
* **`key_abstractions`**:
  * **Mastra Instance**: The central `mastra` object created in `index.ts` that holds the entire AI application's state and configuration.
  * **Registration Pattern**: The pattern of defining components (agents, workflows) in their own modules and then importing and registering them in `index.ts`.
* **`data_flow`**: An API call from `/app/api` triggers a workflow registered in `mastra/index.ts`. The workflow then executes a series of steps, calling agents from `/agents`. These agents, in turn, use tools from `/tools`, which might call services from `/services` to perform their tasks. Throughout this entire process, data is validated by schemas from `/schemas`.

### Development Playbook

* **`best_practices`**:
  * "**Strict Modularity**: Adhere to the directory structure. An agent should never contain service logic. A workflow should never contain tool logic. This separation is paramount for a maintainable system."
  * "**Register in `index.ts`**: Any new agent, workflow, or vector store is useless until it is registered on the main `mastra` instance in `index.ts`. This should be the final step when adding a new component."
  * "**Centralized API Exposure**: All workflows that need to be accessed from the frontend must be registered in `apiRegistry.ts`. Do not create ad-hoc API endpoints."
* **`anti_patterns`**:
  * "**Decentralized Initialization**: Creating multiple `Mastra` instances in different files. **Instead**: There should be only one `mastra` instance, created and exported from `index.ts`, serving as the single source of truth."
  * "**Bypassing the Registry**: Instantiating an agent or service directly within a workflow step instead of retrieving it from the `mastra` instance (`mastra.getAgent(...)`). **Instead**: Always use the registered instances to ensure middleware, logging, and other global features are applied correctly."
* **`common_tasks`**:
  * "**Adding a New AI Feature**:
        1. Break the feature down into its components: What is the business logic (Service)? What are the discrete actions (Tools)? What is the reasoning (Agent)? What is the overall process (Workflow)?
        2. Create the necessary files in their respective directories (`/services`, `/tools`, `/agents`, `/workflows`).
        3. Import and register the new components in `/src/mastra/index.ts`.
        4. If needed, expose the new workflow via `/src/mastra/apiRegistry.ts`."
* **`debugging_checklist`**:
    1. "Is your new agent or workflow not found? Check if you have correctly imported and registered it in `/src/mastra/index.ts`."
    2. "Is a workflow failing with a cryptic error? Check the Langfuse traces (configured in `ai-tracing.ts`) for a detailed, step-by-step visualization of the entire execution."
    3. "Is an API route for a workflow returning a 404? Verify that the route is correctly defined in `apiRegistry.ts`."
