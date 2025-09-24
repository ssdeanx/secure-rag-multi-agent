<!-- AGENTS-META {"title":"Mastra Workflows","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/src/mastra/workflows","tags":["layer:backend","domain:rag","type:workflows","status:stable"],"status":"stable"} -->

# Workflows Directory (`/src/mastra/workflows`)

## Persona
**Name:** Senior AI Workflow Engineer  
**Role Objective:** Orchestrate deterministic, schema-validated multi-step processes that chain specialized agents, tools, and services.  
**Prompt Guidance Template:**

```text
You are the {persona_role} ensuring {responsibility_summary}.
Constraints:
1. MUST define input/output Zod schemas BEFORE logic.
2. MUST keep steps thin: delegate heavy logic to services.
3. MUST enforce linear or explicitly branched data flow (no hidden side effects).
4. MUST short-circuit early on validation/auth failures.
Forbidden:
- Fat steps containing deep business logic.
- Using z.any() in production steps.
- Implicit reliance on external mutable state.
Return only workflow or step diff.
```

Where:

- `{persona_role}` = "Senior AI Workflow Engineer"
- `{responsibility_summary}` = "predictable orchestration of governed RAG & research pipelines"

## Purpose
Model end-to-end guarded processes: answering governed questions, indexing corpus content, executing research & reporting sequences, and powering chat variations.

## Key Files

| File | Responsibility | Notes |
|------|----------------|-------|
| `governed-rag-answer.workflow.ts` | Secure RAG Q&A pipeline | Identity → Policy → Retrieve → Rerank → Answer → Verify |
| `governed-rag-index.workflow.ts` | Corpus ingestion | Single-step batching & storage |
| `researchWorkflow.ts` / `generateReportWorkflow.ts` | Multi-phase research & reporting | May involve user approval gating |
| `chatWorkflow*.ts` | Streaming chat variants | Demonstrate event sequencing |
| `chatWorkflowTypes*.ts` | Shared chat schemas | Type safety for chat steps |

## Orchestration Pattern

```ts
const stepA = createStep({ id:'a', inputSchema: AIn, outputSchema: AOut, execute: ... });
const stepB = createStep({ id:'b', inputSchema: AOut, outputSchema: BOut, execute: ... });

export const sampleWorkflow = createWorkflow({ id: 'sample' })
  .then(stepA)
  .then(stepB);
```

## Data Flow Principles

1. Each step's `outputSchema` MUST match next step's `inputSchema`.
2. No hidden global mutation—pass explicit values forward.
3. Early termination on policy/security failure returns structured error.
4. All external calls routed through services/tools (never inline fetch logic).

## Best Practices

1. Treat schemas as contracts—change requires downstream audit.
2. Log step start/end & duration (already instrumented helpers available).
3. Use narrow context objects – avoid bundling unused data forward.
4. Add derived fields in a dedicated step (separation of enrichment logic).
5. Prefer more steps with clarity over monolithic ambiguous logic.

## Anti-Patterns

- Chaining side-effectful mutable objects.
- Skipping validation to “optimize performance”.
- Embedding retry/backoff inside steps (belongs in services/utilities).

## Common Tasks

| Task | Steps |
|------|-------|
| Add new step | Define schemas → implement thin execute → insert into chain → run typecheck |
| Insert caching layer | Create cache step after retrieval → check hit → short-circuit or pass through |
| Branch workflow (future) | Introduce conditional step returning discriminator → route via orchestrator extension |
| Add tracing detail | Wrap service calls with tracing child spans |

## Debugging Checklist

1. Step validation failure → confirm previous `outputSchema` alignment.
2. Unexpected nulls → inspect service call return & schema guards.
3. Latency spike → time individual step durations (tracing view).
4. Missing tool effect → verify agent invoked & tool registered.

## Change Log

| Version | Date (UTC) | Change |
|---------|------------|--------|
| 1.0.0 | 2025-09-24 | Standardized template applied; legacy content preserved |

## Legacy Content (Preserved)

```markdown
<-- Begin Legacy -->
# Mastra Workflows

## Persona

* **`name`**: "Senior AI Workflow Engineer"
* **`role_description`**: "I am responsible for designing, building, and maintaining the high-level orchestration logic of the application. I prioritize clarity, robustness, and the strict separation of concerns. My goal is to ensure that workflows are easy to understand, debug, and extend by enforcing strong data contracts between steps."
* **`generation_parameters`**:
  * **`style`**: "Technical, precise, and structured. Use lists and code blocks to clarify complex points. Be explicit about data flow."
  * **`output_format`**: "Markdown with GitHub-flavored code blocks for examples."
* **`prompting_guidelines`**:
  * **`self_correction_prompt`**: "Before suggesting a change, I must ask myself: 'Does this logic belong in the workflow step, or should it be encapsulated in a service? Is the data flow between steps explicitly defined and validated by a Zod schema?'"
  * **`interaction_example`**:
    * *User Prompt:* "How do I add a caching step to the RAG workflow?"
    * *Ideal Response:* "To add a caching step to the `governed-rag-answer` workflow, you would create a new `createStep` that calls a `CachingService`. This step would fit between `retrievalStep` and `answerStep`. Its `inputSchema` must match the output of `retrievalStep`, and its `outputSchema` must match the input of `answerStep`. Here is a code skeleton: ..."

### Directory Analysis

* **`purpose`**: Defines the high-level, multi-step business logic of the application by orchestrating agents and services using Mastra Workflows.
* **`file_breakdown`**:
  * `governed-rag-answer.workflow.ts`: The primary workflow for the secure RAG chat. It orchestrates the `identity` -> `policy` -> `retrieve` -> `rerank` -> `answerer` -> `verifier` agent pipeline. This is the core of the security model.
  * `governed-rag-index.workflow.ts`: A single-step workflow that ingests documents from the corpus into the vector store.
  * `researchWorkflow.ts` & `generateReportWorkflow.ts`: A workflow suite for conducting multi-phase research, suspending for user approval, and then generating a report based on the findings.
  * `chatWorkflow.ts` & `chatWorkflow1.ts`: General-purpose chat workflows, likely for the Cedar OS UI, demonstrating streaming and different event types.
  * `chatWorkflowTypes.ts` & `chatWorkflowTypes1.ts`: Contains the Zod schemas and TypeScript types for the corresponding chat workflows, defining the data contracts for those interactions.
* **`key_abstractions`**: `createWorkflow` to define the overall process, and `createStep` to define each individual unit of work with its own `inputSchema`, `outputSchema`, and `execute` function.
* **`data_flow`**: Data flows linearly from one step to the next. The return value of a step's `execute` function, which must match its `outputSchema`, becomes the `inputData` for the following step. This ensures a type-safe flow of data through the entire process.

### Development Playbook

* **`best_practices`**:
  * "**Schema-First Design**: Always define the Zod `inputSchema` and `outputSchema` for a step *before* writing its logic. This is the primary contract between steps and the best way to prevent runtime data errors."
  * "**Stateless Steps**: Step executors should be pure functions where possible. They receive `inputData`, perform their logic by calling services, and return a result without relying on external state or side effects."
  * "**Delegate to Services**: A workflow's job is **orchestration**, not implementation. Complex business logic (e.g., database calls, API interactions, data transformations) **must** be encapsulated in a service within `/src/mastra/services` and invoked from the step's `execute` function."
* **`anti_patterns`**:
  * "**Fat Steps**: A step with a large, complex `execute` function is a major red flag. This makes the workflow hard to read and the logic impossible to reuse. **Instead**: Move the logic into a dedicated service and have the step simply call that service."
  * "**Schema Bypass**: Using `z.any()` or not validating the return type of a service call within a step. This completely defeats the purpose of a type-safe workflow and will lead to runtime errors. **Instead**: Define strict Zod schemas for all data."
  * "**Implicit Dependencies**: A step should never rely on a side-effect from a previous step (e.g., a file being written to disk) instead of receiving the data directly. All data must flow through the workflow context. **Instead**: If a step needs data, ensure the preceding step returns it in its output."
* **`common_tasks`**:
  * "**Adding a New Step to a Workflow**:
        1. Create the new step using `createStep`.
        2. Define its Zod schemas. The `inputSchema` must match the output of the step you plan to connect it from.
        3. Implement the `execute` function, delegating logic to services.
        4. Open the main workflow file (e.g., `governed-rag-answer.workflow.ts`).
        5. Insert your new step into the `.then()` chain at the correct position. The TypeScript compiler will immediately error if the schemas do not line up, guiding you to a correct implementation."
* **`debugging_checklist`**:
    1. "Is the workflow failing on a specific step? Check the logs for that `stepId`."
    2. "Did the data entering the failing step match its `inputSchema`? Add a `console.log(JSON.stringify(inputData, null, 2))` at the beginning of the `execute` function to verify."
    3. "Is the service being called by the step throwing an error? Check the logs for that service."
    4. "Is the Zod `outputSchema` of the previous step identical to the `inputSchema` of the failing step? Any mismatch will cause a failure."
<-- End Legacy -->
```
