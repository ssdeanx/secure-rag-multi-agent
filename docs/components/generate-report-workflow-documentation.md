---
title: GenerateReportWorkflow - Technical Documentation
component_path: `src/mastra/workflows/generateReportWorkflow.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra Reporting / Backend
tags: [workflow, mastra, report, research, documentation]
---

# GenerateReportWorkflow Documentation

Mastra workflow for report generation: Runs researchWorkflow in doWhile until approved, then processes results with reportAgent. Supports iterative refinement.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Automate report creation from user-guided research.

- OVR-002: Scope: Composes researchWorkflow + processResearchResultStep; doWhile on !approved. Excludes research details.

- OVR-003: Context: Higher-level workflow for end-to-end research-to-report.

## 2. Architecture Section

- ARC-001: Design patterns: Composite workflow with loop and conditional.

- ARC-002: Dependencies:
    - @mastra/core (createWorkflow, createStep, doWhile, then)

    - zod (schemas)

    - Local: researchWorkflow, reportAgent, logger

- ARC-003: Interactions: Loops research until approved; generates report if true.

- ARC-004: Commit: .commit() finalizes chain.

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    GRW[GenerateReportWorkflow] --> DW[doWhile(researchWorkflow, !approved)]
    DW --> PRS[processResearchResultStep]
    PRS --> RA[reportAgent.generate]

    subgraph "Loop Condition"
        LC[approved from research] --> DW
    end

    subgraph "Input/Output"
        In[] --> GRW
        GRW --> Out[{report?: string, completed: bool}]
    end

    subgraph "External"
        M[Mastra] --> GRW
        L[Logger] --> PRS
    end

    classDiagram
        class GenerateReportWorkflow {
            +steps: [researchWorkflow, processStep]
            +doWhile(step, condition): Workflow
            +then(step): Workflow
            +commit(): void
        }
        class ProcessStep {
            +execute(input): {report?, completed}
        }

        GenerateReportWorkflow --> ProcessStep
```

## 3. Interface Documentation

- INT-001: Empty input; bool/completed output.

| Output      | Fields    | Notes                       |
| ----------- | --------- | --------------------------- |
| `report`    | `string?` | Generated if approved       |
| `completed` | `bool`    | True if report or !approved |

INT notes:

- INT-003: Inherits research schemas.

## 4. Implementation Details

- IMP-001: processResearchResultStep: Checks approved/data; if yes, agent.generate with research JSON; catch errors.

- IMP-002: Chain: doWhile research until approved, then process, commit.

- IMP-003: Logging: Info for generation.

- IMP-004: Agent: reportAgent with user prompt including researchData.

Edge cases and considerations:

- !approved: completed=false, no report.

- Agent error: completed=false.

## 5. Usage Examples

### Run Workflow

```ts
const result = await generateReportWorkflow.execute({})
// Loops: research → approve (suspend) → repeat until y
// Then generates report
```

### Step Logic

```ts
if (!inputData.approved || !inputData.researchData) {
    return { completed: false }
}
// Agent call...
```

Best practices:

- Use in UI with suspend handling.

- Limit loops to prevent infinite.

## 6. Quality Attributes

- QUA-001 Security: Research scoped; report from approved data.

- QUA-002 Performance: Loop controlled by user.

- QUA-003 Reliability: Error catch in process.

- QUA-004 Maintainability: Composes research.

- QUA-005 Extensibility: Add format step.

## 7. Reference Information

- REF-001: Dependencies: @mastra/core, zod

- REF-002: Agent: reportAgent

- REF-003: Testing: Mock research/agent.

- REF-004: Troubleshooting: Loop stuck — check condition.

- REF-005: Related: researchWorkflow.ts

- REF-006: Change history: 1.0 (2025-09-23)
