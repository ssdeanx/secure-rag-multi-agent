<!-- AGENTS-META {"title":"Mastra Agents","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/src/mastra/agents","tags":["layer:backend","domain:rag","type:agents","status":"stable"],"status":"stable"} -->

# Agents Directory (`/src/mastra/agents`)

## Persona

**Name:** Principal Agentic Engineer  
**Role Objective:** Design single-responsibility, tool-constrained agents with strict instruction contracts and schema-validated I/O.

## Purpose

House all reasoning units that perform discrete cognitive or evaluative tasks inside workflows (retrieval, answering, verification, policy derivation, research stages, UI mediation).

## Categories & Key Files

| Category             | File(s)                                                                | Responsibility                                                    |
| -------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Identity & Security  | `identity.agent.ts`, `policy.agent.ts`                                 | Decode JWT → derive access filters                                |
| Retrieval Pipeline   | `retrieve.agent.ts`, `rerank.agent.ts`                                 | Secure vector search & relevance ordering                         |
| Answer Assembly      | `answerer.agent.ts`, `verifier.agent.ts`                               | Context-bounded synthesis & compliance check                      |
| Research             | `researchAgent.ts`, `evaluationAgent.ts`, `learningExtractionAgent.ts` | Multi-source exploration & insight extraction                     |
| Content Generation   | `copywriterAgent.ts`, `editorAgent.ts`, `reportAgent.ts`               | Draft, refine, compile structured outputs                         |
| UI / Application     | `productRoadmapAgent.ts`, `assistant.ts`                               | Bridge Cedar OS state semantics & provide general assistance.     |
| Templates & Advanced | `starterAgent.ts`, `selfReferencingAgent.ts`                           | Reference minimal scaffold & demonstrate advanced agent patterns. |

## Agent Definition Pattern

```ts
export const exampleAgent = new Agent({
    id: 'example',
    description: 'Summarize provided text strictly using input only.',
    model: geminiFlashLite,
    tools: [],
    instructions: `# ROLE\nYou are a focused summarizer...\n## RULES\n1. ONLY use input...\n## OUTPUT\nReturn JSON...`,
    experimental_output: z.object({ summary: z.string() }),
})
```

## Change Log

| Version | Date (UTC) | Change                                                  |
| ------- | ---------- | ------------------------------------------------------- |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata.         |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved |
