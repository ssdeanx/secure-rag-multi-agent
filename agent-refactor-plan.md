# Agent & Workflow Refactor Plan

This plan outlines the steps to audit and refactor all Mastra agents and workflows to ensure they align with the centralized schemas, role hierarchy, and service architecture.

## Phase 1: Discovery and Analysis

1.  **List all agents and workflows:** Identify every `*.agent.ts` and `*.workflow.ts` file to define the scope of the refactor.
2.  **Analyze Core Contracts:** Deeply review the following files to establish the ground truth for the system's architecture:
    - `@src/mastra/schemas/agent-schemas.ts` (Data shapes)
    - `@src/mastra/config/role-hierarchy.ts` (RBAC rules)
    - `@src/mastra/services/RoleService.ts` (RBAC implementation)
    - `@src/mastra/policy/acl.yaml` (Document permissions)
    - `@src/mastra/services/**` (All business logic)

## Phase 2: Agent-by-Agent Audit & Refactor

For each agent identified in Phase 1, perform the following:

1.  **Output Schema Validation:**
    - Verify the agent's `experimental_output` uses the correct, centralized schema from `agent-schemas.ts`.
    - If an inline schema is found, replace it with a reference to the central schema.
    - If the schema is missing or incorrect, add or fix it.

2.  **Instruction & Prompt Review:**
    - Ensure the agent's `instructions` are strict, clear, and align with its single responsibility.
    - For security-sensitive agents (`identity`, `policy`, `retrieve`, `answerer`), confirm that prompts enforce security constraints (e.g., "NEVER use external knowledge").

3.  **Tool and Service Usage:**
    - Review the tools the agent uses.
    - Trace the tool's logic to the service(s) it calls.
    - Confirm that the data passed between the tool and service aligns with the defined schemas.

## Phase 3: Workflow Integrity Check

For each workflow, perform the following:

1.  **Step-by-Step Schema Validation:**
    - Analyze the chain of steps in the workflow.
    - Verify that the `outputSchema` of each step matches the `inputSchema` of the subsequent step.

2.  **Data Flow Analysis:**
    - Ensure that security context (claims, access filters) is correctly propagated through the entire workflow, especially in `governed-rag-answer.workflow.ts`.

## Phase 4: Implementation & Verification

1.  **Apply Changes:** Execute the necessary code modifications using the `replace` tool.
2.  **Run Verification:** Execute the project's test suite (`npm test`) to confirm that the changes have not introduced any regressions.
