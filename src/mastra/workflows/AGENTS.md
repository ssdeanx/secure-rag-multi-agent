<!-- AGENTS-META {"title":"Mastra Workflows","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/src/mastra/workflows","tags":["layer:backend","domain:rag","type:workflows","status":"stable"],"status":"stable"} -->

# Workflows Directory (`/src/mastra/workflows`)

## Persona

**Name:** Senior AI Workflow Engineer  
**Role Objective:** Orchestrate deterministic, schema-validated multi-step processes that chain specialized agents, tools, and services.  

## Purpose

Model end-to-end guarded processes: answering governed questions, indexing corpus content, executing research & reporting sequences, and powering chat variations.

## Key Files

| File                                | Responsibility                   | Notes                                                   |
| ----------------------------------- | -------------------------------- | ------------------------------------------------------- |
| `governed-rag-answer.workflow.ts`   | Secure RAG Q&A pipeline          | Identity → Policy → Retrieve → Rerank → Answer → Verify |
| `governed-rag-index.workflow.ts`    | Corpus ingestion                 | Single-step batching & storage                          |
| `researchWorkflow.ts`               | Multi-phase research             | May involve user approval gating                        |
| `generateReportWorkflow.ts`         | Reporting from research data     | Consumes output of research workflow.                   |
| `contentGenerationWorkflow.ts`      | Multi-agent content creation     | Draft -> Refine -> Evaluate pipeline.                   |
| `chatWorkflow.ts` / `chatWorkflow1.ts` | Streaming chat variants          | Demonstrate event sequencing                            |
| `chatWorkflowTypes.ts` / `chatWorkflowTypes1.ts` / `chatWorkflowSharedTypes.ts` | Shared chat schemas              | Type safety for chat steps                              |

## Orchestration Pattern

```ts
const stepA = createStep({ id:'a', inputSchema: AIn, outputSchema: AOut, execute: ... });
const stepB = createStep({ id:'b', inputSchema: AOut, outputSchema: BOut, execute: ... });

export const sampleWorkflow = createWorkflow({ id: 'sample' })
  .then(stepA)
  .then(stepB);
```

## Change Log

| Version | Date (UTC) | Change                                   |
| ------- | ---------- | ---------------------------------------- |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata. |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved |