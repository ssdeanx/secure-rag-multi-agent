---
title: ResearchWorkflow - Technical Documentation
component_path: `src/mastra/workflows/researchWorkflow.ts`
version: 1.0
date_created: 2025-09-23
last_updated: 2025-09-23
owner: Mastra Research / Backend
tags: [workflow, mastra, research, agent, documentation]
---

# ResearchWorkflow Documentation

Mastra workflow for interactive research: get query → agent research → user approval. Supports suspend/resume for human-in-loop; uses researchAgent for two-phase process.

## 1. Component Overview

### Purpose/Responsibility

- OVR-001: Guide users through research with agent assistance and approval gates.

- OVR-002: Scope: 3 steps (getUserQuery, research, approval) with suspend for input. Outputs approved data/summary. Excludes tool details.

- OVR-003: Context: Part of generateReportWorkflow; enables iterative research.

## 2. Architecture Section

- ARC-001: Design patterns: Human-in-loop workflow with suspend/resume.

- ARC-002: Dependencies:

  - @mastra/core (createWorkflow, createStep)

  - zod (schemas)

  - Local: researchAgent, logger

- ARC-003: Interactions: Suspends for query/approval; agent.generate with maxSteps/output schema.

- ARC-004: Phases: Prompt for 2-phase research (initial queries → follow-ups).

### Component Structure and Dependencies Diagram

```mermaid
graph TD
    subgraph "Workflow"
        RW[ResearchWorkflow] --> GU[getUserQueryStep]
        GU --> Res[researchStep]
        Res --> App[approvalStep]
    end

    subgraph "Suspend/Resume"
        GU --> Sus1[suspend for query]
        App --> Sus2[suspend for approval]
    end

    subgraph "Agent"
        Res --> RA[researchAgent.generate]
        RA --> Out[JSON: queries, learnings, phase]
    end

    subgraph "Input/Output"
        In[] --> RW
        RW --> Out[approved: bool, researchData]
    end

    subgraph "External"
        M[Mastra] --> RW
        L[Logger] --> Res
    end

    classDiagram
        class ResearchWorkflow {
            +steps: Step[]
            +inputSchema: ZodObject
            +outputSchema: ZodObject
        }
        class QueryStep {
            +suspend(message): Promise<void>
            +resumeData?: any
        }

        ResearchWorkflow --> QueryStep
```

## 3. Interface Documentation

- INT-001: Schemas for steps.

| Step | Input | Output | Notes |
|------|-------|--------|-------|
| getUserQuery | `{}` | `{query: string}` | Suspends with prompt |
| research | `{query}` | `{researchData, summary}` | Agent call; JSON output |
| approval | `{researchData, summary}` | `{approved: bool, researchData}` | Suspends for y/n |

Overall: `{}` → `{approved: bool, researchData}`

INT notes:

- INT-003: Suspend schemas for messages.

## 4. Implementation Details

- IMP-001: getUserQuery: Suspends 'What to research?'; resumes with query.

- IMP-002: research: Agent prompt for 2-phase JSON (queries, results, learnings); summary string.

- IMP-003: approval: Suspends summary + 'Sufficient? [y/n]'; resumes approved bool.

- IMP-004: Error: Catch in research; return error data.

Edge cases and considerations:

- No resume: Defaults false/empty.

- Agent fail: Error in data/summary.

## 5. Usage Examples

### Workflow Run

```ts
const result = await researchWorkflow.execute({});
// Suspends; resume with {query: 'AI ethics'}
// Suspends approval; resume {approved: true}
```

### Agent Prompt in Research

```ts
const prompt = `Research "${query}": Phase 1 initial queries, Phase 2 follow-ups. JSON: queries, searchResults, learnings...`;
```

Best practices:

- Use in doWhile for iteration.

- Validate JSON output.

## 6. Quality Attributes

- QUA-001 Security: User input validated; agent scoped.

- QUA-002 Performance: Agent maxSteps=15 limits.

- QUA-003 Reliability: Suspend handles pauses.

- QUA-004 Maintainability: Clear steps.

- QUA-005 Extensibility: Add steps (e.g., refine).

## 7. Reference Information

- REF-001: Dependencies: @mastra/core, zod

- REF-002: Agent: researchAgent

- REF-003: Testing: Mock suspend/agent.

- REF-004: Troubleshooting: No resume — check input.

- REF-005: Related: generateReportWorkflow.ts

- REF-006: Change history: 1.0 (2025-09-23)
