<!-- AGENTS-META {"title":"Mastra Tools","version":"1.1.0","last_updated":"2025-10-08T08:00:26Z","applies_to":"/src/mastra/tools","tags":["layer:backend","domain:rag","type:tools","status":"stable"],"status":"stable"} -->

# Tools Directory (`/src/mastra/tools`)

## Persona

**Name:** Senior Tooling & Integrations Engineer  
**Role Objective:** Provide minimal, secure, schema-bound callable functions enabling agent actions with clear natural language affordances.

## Purpose

Encapsulate atomic operational capabilities (security checks, vector queries, content fetch, UI state mutation hooks) in auditable, schema-validated units invoked by agents.

## Key Files

| File                                                | Responsibility                    | Notes                                         |
| --------------------------------------------------- | --------------------------------- | --------------------------------------------- |
| `jwt-auth.tool.ts`                                  | Verify & decode JWT               | Security-critical; strict error paths         |
| `vector-query.tool.ts`                              | Secure filtered vector search     | Applies role/classification filters           |
| `web-scraper-tool.ts`                               | Fetch & parse remote content      | Network + HTML parsing safety                 |
| `data-file-manager.ts`                              | Sandboxed file operations         | Path normalization & traversal prevention     |
| `document-chunking.tool.ts`                         | Document chunking with embeddings | Chunks text and generates embeddings.         |
| `graph-rag-query.tool.ts`                           | Graph-based RAG queries           | Traverses relationships for context.          |
| `copywriter-agent-tool.ts` / `editor-agent-tool.ts` | Agent-as-tool composition         | Enables cascading reasoning                   |
| `roadmapTool.ts`                                    | Cedar OS roadmap interactions     | UI state bridging                             |
| `weather-tool.ts`                                   | Example external API call         | Demonstrative pattern                         |
| `evaluateResultTool.ts` / `extractLearningsTool.ts` | Research support tools            | Evaluate search results and extract insights. |
| `starter-agent-tool.ts`                             | Dynamic agent invocation          | Invokes other agents based on context.        |

## Tool Definition Pattern

```ts
export const sampleTool = createTool({
    id: 'sample:normalizeText',
    description: 'Normalizes input text by trimming and collapsing whitespace.',
    inputSchema: z.object({ text: z.string().min(1) }),
    outputSchema: z.object({ normalized: z.string() }),
    execute: async ({ input, tracingContext }) => {
        const start = Date.now()
        const normalized = input.text.replace(/\s+/g, ' ').trim()
        tracingContext?.span?.setAttribute('norm.ms', Date.now() - start)
        return { normalized }
    },
})
```

## Change Log

| Version | Date (UTC) | Change                                                  |
| ------- | ---------- | ------------------------------------------------------- |
| 1.1.0   | 2025-10-08 | Verified content accuracy and updated metadata.         |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved |
