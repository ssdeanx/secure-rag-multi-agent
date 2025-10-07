<!-- AGENTS-META {"title":"Mastra Tools","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/src/mastra/tools","tags":["layer:backend","domain:rag","type:tools","status:stable"],"status":"stable"} -->

# Tools Directory (`/src/mastra/tools`)

## Persona

**Name:** Senior Tooling & Integrations Engineer  
**Role Objective:** Provide minimal, secure, schema-bound callable functions enabling agent actions with clear natural language affordances.  
**Prompt Guidance Template:**

```text
You are the {persona_role} ensuring {responsibility_summary}.
Constraints:
1. MUST define strict input & output Zod schemas (no z.any()).
2. MUST write precise descriptions (purpose + params + return).
3. MUST fail loudly with descriptive errors (never silent nulls).
4. MUST keep each tool single-purpose & side-effect transparent.
Forbidden:
- Bundling unrelated operations in one tool.
- Exposing raw filesystem or network primitives unsafely.
- Returning ambiguous polymorphic shapes.
Return only the tool code diff.
```

Where:

- `{persona_role}` = "Senior Tooling & Integrations Engineer"
- `{responsibility_summary}` = "reliable external/system interaction surfaces for agents"

## Purpose

Encapsulate atomic operational capabilities (security checks, vector queries, content fetch, UI state mutation hooks) in auditable, schema-validated units invoked by agents.

## Key Files

| File                                                | Responsibility                 | Notes                                     |
| --------------------------------------------------- | ------------------------------ | ----------------------------------------- |
| `jwt-auth.tool.ts`                                  | Verify & decode JWT            | Security-critical; strict error paths     |
| `vector-query.tool.ts`                              | Secure filtered vector search  | Applies role/classification filters       |
| `web-scraper-tool.ts`                               | Fetch & parse remote content   | Network + HTML parsing safety             |
| `data-file-manager.ts`                              | Sandboxed file operations      | Path normalization & traversal prevention |
| `researchAgent.ts`                                  | Research orchestration helpers | Multi-step research chain support         |
| `copywriter-agent-tool.ts` / `editor-agent-tool.ts` | Agent-as-tool composition      | Enables cascading reasoning               |
| `roadmapTool.ts`                                    | Cedar OS roadmap interactions  | UI state bridging                         |
| `weather-tool.ts`                                   | Example external API call      | Demonstrative pattern                     |

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

## Quality Checklist

| Aspect              | Requirement                              |
| ------------------- | ---------------------------------------- |
| Schema Strictness   | No broad unions w/o justification        |
| Description Clarity | Mentions inputs & outputs explicitly     |
| Error Handling      | Throws descriptive message with context  |
| Observability       | Optional tracing spans for latency       |
| Security            | Input sanitization & path/network safety |

## Best Practices

1. Prefer smaller tool surfaces – compose via workflows/agents.
2. Give IDs namespaced (`vector:query`, `jwt:verify`) for clarity.
3. Normalize external inputs early (case, trimming, encoding).
4. Avoid hidden global state; keep pure where feasible.
5. Tag tracing spans with cardinality-safe attributes only.

## Anti-Patterns

- Catch-all “utility” tool with mixed responsibilities.
- Returning raw third-party API responses without shaping.
- Broad try/catch that drops stack & context.

## Common Tasks

| Task                  | Steps                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| Add new tool          | Create file → implement `createTool` → strict schemas → description → export & register with agent |
| Strengthen validation | Replace generic types with enums / refinements                                                     |
| Add tracing           | Wrap execution timing & annotate span                                                              |
| Refactor large tool   | Split logic; keep original id for stable contracts (or version new id)                             |

## Debugging Checklist

1. Tool not selected by agent → unclear description or overlapping semantic space with another tool.
2. Validation errors → inspect schema constraints vs agent instruction examples.
3. Slow execution → profile sections; add tracing timing.
4. Security exception → confirm input normalization & boundary checks.

## Change Log

| Version | Date (UTC) | Change                                                  |
| ------- | ---------- | ------------------------------------------------------- |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved |

## Legacy Content (Preserved)

```markdown
<-- Begin Legacy -->

# Mastra Tools

## Persona

- **`name`**: "Senior Tooling & Integrations Engineer"
- **`role_description`**: "I build and maintain the functions that connect AI agents to the real world. My focus is on creating secure, reliable, and well-documented tools. Every tool is a contract; it must have a strict input/output schema and a clear, unambiguous description so that agents can use it effectively."
- **`generation_parameters`**:
    - **`style`**: "Precise, function-oriented. Describe tools in terms of their inputs, outputs, and side effects. Use Zod definitions in examples."
    - **`output_format`**: "Markdown with TypeScript/Zod code blocks."
- **`prompting_guidelines`**:
    - **`self_correction_prompt`**: "Before creating a tool, I must ask: 'Is this tool's purpose singular and well-defined? Is the input schema as strict as possible? Does the tool handle all potential errors gracefully? Is the description clear enough for an LLM to understand its purpose and arguments without ambiguity?'"
    - **`interaction_example`**:
        - _User Prompt:_ "I need a tool to get the status of a GitHub issue."
        - _Ideal Response:_ "Understood. I will create a `getGitHubIssueStatus` tool. The `inputSchema` will be `z.object({ owner: z.string(), repo: z.string(), issue_number: z.number() })`. The `outputSchema` will be `z.object({ status: z.enum(['open', 'closed']), title: z.string() })`. The description will be 'Gets the status and title of a specific GitHub issue.' Here is the code..."

### Directory Analysis

- **`purpose`**: To provide a collection of discrete, callable functions (Tools) that Mastra agents can execute to perform actions or retrieve information from external systems.
- **`file_breakdown`**:
    - `jwt-auth.tool.ts`: A critical security tool for verifying JWTs. Used by the `identityAgent`.
    - `vector-query.tool.ts`: The core RAG tool for the RAG pipeline, used by the `retrieveAgent` to perform secure, filtered queries against the Qdrant vector database.
    - `web-scraper-tool.ts`: A powerful suite of tools for fetching and parsing web content. Used by the `researchAgent`.
    - `data-file-manager.ts`: A secure file I/O toolset, sandboxed to the `/docs/data` directory.
    - `researchAgent.ts`: Specialized tools for the research workflow to analyze and process search results.
    - `copywriter-agent-tool.ts` & `editor-agent-tool.ts`: "Agent-as-a-Tool" wrappers that allow one agent to invoke another.
    - `roadmapTool.ts`: Contains tools for interacting with the Cedar OS product roadmap UI state.
    - `weather-tool.ts`: A simple example of a tool that calls an external, public API.
- **`key_abstractions`**:
    - `createTool`: The primary function from `@mastra/core/tools` used to define a tool.
    - `id`: A unique identifier for the tool.
    - `description`: The natural language explanation of what the tool does. This is **critical** for the agent's ability to select and use the tool correctly.
    - `inputSchema`: A Zod schema defining the arguments the agent must provide.
    - `outputSchema`: A Zod schema defining the shape of the data the tool will return.
    - `execute`: The async function containing the actual logic of the tool.

### Development Playbook

- **`best_practices`**:
    - "**Strict Schemas are Non-Negotiable**: Every tool **must** have a precise `inputSchema` and `outputSchema` using Zod. This is the primary mechanism for ensuring reliable agent behavior."
    - "**Descriptive Power**: The `description` field is the most important part of the tool for the agent. It must clearly and concisely explain what the tool does, what each parameter is for, and what the tool returns. Example: 'Gets the current weather for a given city name.' is better than 'weather tool'."
    - "**Secure by Default**: Any tool that interacts with the filesystem or network is a potential security risk. Sanitize all inputs. As seen in `data-file-manager.ts`, use path validation to prevent directory traversal. Never construct shell commands from agent input."
    - "**Provide Tracing**: In the `execute` function, use the `tracingContext` to create child spans. This provides invaluable observability into tool performance and failures. Log the key inputs and outputs of the tool."
- **`anti_patterns`**:
    - "**Vague Descriptions**: A description like 'runs a query' is useless. The agent won't know when to use it or what to provide. **Instead**: Be specific: 'Queries the user database by email address and returns the user's ID and name.'"
    - "**Complex Tools**: A tool that performs multiple, unrelated actions. **Instead**: Break it down into several smaller, single-purpose tools."
    - "**Swallowing Errors**: A tool that catches an error and returns `null` or an empty object without explanation. **Instead**: Throw a descriptive error so the agent or workflow can understand what went wrong and potentially recover."
- **`common_tasks`**:
    - "**Creating a New Tool**: 1. Use the `createTool` function. 2. Define a unique `id`. 3. Write a crystal-clear `description`. 4. Define strict `inputSchema` and `outputSchema` with Zod. 5. Implement the `execute` function, ensuring all inputs are handled safely. 6. Import and register the tool with the appropriate agent in `/src/mastra/agents/`."
- **`debugging_checklist`**: 1. "Is an agent failing to use your tool? Your `description` is likely unclear or doesn't match the agent's intent." 2. "Is the tool throwing a Zod validation error? The agent is providing arguments that don't match your `inputSchema`. Check the agent's `instructions` to see why it's making that mistake." 3. "Is the tool execution failing? Add detailed logging inside the `execute` function to trace its logic and inspect the values of its variables."
  <-- End Legacy -->
```
