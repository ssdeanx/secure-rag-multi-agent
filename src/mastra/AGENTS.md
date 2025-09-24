<!-- AGENTS-META {"title":"Mastra Core Orchestration","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/src/mastra","tags":["layer:backend","domain:rag","type:ai-core","status:stable"],"status":"stable"} -->

# Mastra Core (`/src/mastra`)

## Persona
**Name:** Lead AI Architect  
**Role Objective:** Ensure modular, observable, and policy-governed orchestration of agents, workflows, tools, services, and schemas.  
**Prompt Guidance Template:**

```text
You are the {persona_role} ensuring {responsibility_summary}.
Constraints:
1. MUST register every agent/workflow/tool/service centrally in index.ts.
2. MUST keep single Mastra instance (no duplicates).
3. MUST validate data with schemas before cross-boundary passage.
4. MUST preserve one-tool-call-per-agent execution policy.
Forbidden:
- Business logic inside agents (belongs in services/tools).
- Direct DB or vector calls from workflows (delegate to services/tools).
- Unregistered components used ad-hoc.
Return only the minimal diff for proposed changes.
```

Where:

- `{persona_role}` = "Lead AI Architect"
- `{responsibility_summary}` = "scalable, governed orchestration of RAG components"

## Purpose
Central nervous system that binds AI reasoning units (agents) with operational processes (workflows), callable functions (tools), domain logic (services), structural data contracts (schemas), and security policy (policy) into a single governed runtime.

## Structure Overview

| Path | Responsibility | Notes |
|------|----------------|-------|
| `index.ts` | Create & export configured Mastra instance | Registration hub |
| `apiRegistry.ts` | Expose workflow HTTP endpoints | Bridges to App Router |
| `ai-tracing.ts` | Observability / Langfuse exporter setup | Conditional on env vars |
| `agents/` | Single-responsibility reasoning entities | One tool call policy |
| `workflows/` | Multi-step orchestration logic | Use createStep pattern |
| `tools/` | Safe, side-effectful operations | Input/output schemas enforced |
| `services/` | Reusable domain logic (pure/impure) | Called by tools & workflows |
| `schemas/` | Zod data contracts | Mirror TypeScript interfaces |
| `config/` | External service & model configuration | Qdrant, embeddings, models |
| `policy/` | ACL / security rules | Role & classification gating |

## Execution Flow (Typical Chat Request)

1. API route invokes workflow (e.g., `governed-rag-answer`).
2. Workflow steps: auth/identity → retrieval → synthesis → answer assembly.
3. Agents invoked sequentially; each issues exactly one tool call.
4. Tools call services (vector search, filtering, citation building).
5. Schemas validate intermediate artifacts.
6. Tracing exporter records spans & timing.

## Registration Pattern

```ts
// index.ts (excerpt)
import { someAgent } from './agents/some.agent';
import { governedRagAnswer } from './workflows/governed-rag-answer.workflow';

export const mastra = new Mastra({
  agents: [someAgent, /* ... */],
  workflows: [governedRagAnswer, /* ... */],
  tools: [/* tool instances */],
  services: [/* services */]
});
```

Checklist before adding new component:

| Item | Verified? |
|------|----------|
| File placed in correct subdirectory | ✅ |
| Input/Output schemas defined | ✅ |
| Registered in `index.ts` | ✅ |
| Added to `apiRegistry.ts` if externally callable | ✅ |
| Tracing spans auto-captured (or instrumented manually) | ✅ |

## Best Practices

1. Keep agents “thinking” only – no side-effects outside tool invocation.
2. Use services to unify domain logic & reduce duplication.
3. Prefer small workflow steps with explicit input/output schemas.
4. Centralize model selection logic in config (avoid scattering providers).
5. Enforce consistent naming: `*.agent.ts`, `*.workflow.ts`, `*.tool.ts`.

## Anti-Patterns

- Embedding retrieval logic directly in agents.
- Skipping schema validation for intermediate objects.
- Creating multiple vector client instances across tools/services.
- Silent catch blocks swallowing errors (breaks observability).

## Common Tasks

| Task | Steps |
|------|-------|
| Add new agent | Create `*.agent.ts` → define prompt & tool usage → register in `index.ts` |
| Add new workflow | Create `*.workflow.ts` using `createStep` pattern → register → expose if needed |
| Add tool | Implement `*.tool.ts` with zod schema → register → reference in agent tool list |
| Add service | Implement pure logic → unit test → inject into tools/workflows |
| Add schema | Define Zod in `schemas/` → export & align TS interfaces |

## Error Strategy

| Layer | Pattern |
|-------|---------|
| Agents | Throw structured errors (type + message) for upstream handling |
| Workflows | Wrap steps with try/catch → enrich context (step id) |
| Tools | Validate inputs; return fail-fast errors |
| Services | Minimize throwing; return typed results + error field |

## Security & Governance

- Policy-driven access filters integrated prior to vector search.
- Role & classification propagation through workflow context.
- Audit/log each workflow invocation (future extension hooking tracing exporter).

## Observability

- Tracing exporter attaches spans per workflow step & agent call.
- Add custom annotations for long-running tool calls (e.g., vector search latency).
- Avoid verbose logs in hot code paths (prefer structured spans).

## Performance Considerations

- Single Mastra instance avoids redundant client creation.
- Batch embedding operations where feasible (indexing workflow).
- Keep synchronous CPU in agents minimal; shift heavy lifting to services.

## Pitfalls

- Missing registration → component silently unused.
- Overloaded agents with multi-responsibility prompts (split them).
- Schemas drifting from TypeScript types (needs periodic audit).
- Tool performing multiple conceptual actions (violates single-call predictability).

## Change Log

| Version | Date (UTC) | Change |
|---------|------------|--------|
| 1.0.0 | 2025-09-24 | Standardized template applied; legacy content preserved |

## Legacy Content (Preserved)

```markdown
<-- Begin Legacy -->
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
<-- End Legacy -->
```
