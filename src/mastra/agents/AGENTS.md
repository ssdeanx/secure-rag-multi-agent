<!-- AGENTS-META {"title":"Mastra Agents","version":"1.0.0","last_updated":"2025-09-24T22:52:25Z","applies_to":"/src/mastra/agents","tags":["layer:backend","domain:rag","type:agents","status:stable"],"status":"stable"} -->

# Agents Directory (`/src/mastra/agents`)

## Persona

**Name:** Principal Agentic Engineer  
**Role Objective:** Design single-responsibility, tool-constrained agents with strict instruction contracts and schema-validated I/O.  
**Prompt Guidance Template:**

```text
You are the {persona_role} ensuring {responsibility_summary}.
Constraints:
1. MUST give each agent ONE clear purpose.
2. MUST specify explicit numbered RULES with MANDATORY/FORBIDDEN blocks.
3. MUST attach minimal tool list (only those required).
4. MUST define input/output Zod schemas (experimental_output enforced).
Forbidden:
- Multi-purpose “god” agents.
- Hidden side-effects or silent failure swallowing.
- External knowledge usage beyond provided context.
Return only the agent diff or file skeleton.
```

Where:

- `{persona_role}` = "Principal Agentic Engineer"
- `{responsibility_summary}` = "predictable, secure, schema-bound agent definitions"

## Purpose

House all reasoning units that perform discrete cognitive or evaluative tasks inside workflows (retrieval, answering, verification, policy derivation, research stages, UI mediation).

## Categories & Key Files

| Category            | File(s)                                                                | Responsibility                                |
| ------------------- | ---------------------------------------------------------------------- | --------------------------------------------- |
| Identity & Security | `identity.agent.ts`, `policy.agent.ts`                                 | Decode JWT → derive access filters            |
| Retrieval Pipeline  | `retrieve.agent.ts`, `rerank.agent.ts`                                 | Secure vector search & relevance ordering     |
| Answer Assembly     | `answerer.agent.ts`, `verifier.agent.ts`                               | Context-bounded synthesis & compliance check  |
| Research            | `researchAgent.ts`, `evaluationAgent.ts`, `learningExtractionAgent.ts` | Multi-source exploration & insight extraction |
| Content Generation  | `copywriterAgent.ts`, `editorAgent.ts`, `reportAgent.ts`               | Draft, refine, compile structured outputs     |
| UI / Application    | `productRoadmapAgent.ts`                                               | Bridge Cedar OS state semantics               |
| Templates           | `starterAgent.ts`                                                      | Reference minimal scaffold                    |

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

Checklist:

| Item                  | Requirement                  |
| --------------------- | ---------------------------- |
| Single Responsibility | Clear & documented           |
| Tool Minimization     | No unused tools present      |
| Strict Instructions   | Numbered + forbidden section |
| Structured Output     | Zod schema enforced          |
| Registration          | Added in `mastra/index.ts`   |

## Best Practices

1. Use ALL CAPS for critical compliance directives (e.g., “DO NOT FABRICATE”).
2. Provide negative examples to reduce hallucination risk.
3. Keep prompts deterministic—avoid vague adjectives.
4. Keep tool IDs descriptive and consistent with functions.
5. Fail fast: throw structured errors when preconditions unmet.

## Anti-Patterns

- Overloading answerer with retrieval logic.
- Allowing agent to determine its own tool list dynamically.
- Large unstructured paragraphs in instructions (hard to audit).

## Common Tasks

| Task                    | Steps                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| Add new agent           | Define schema → create `*.agent.ts` → write instructions → minimal tools → register         |
| Add tool to agent       | Verify necessity → import tool → append to config → update instructions referencing tool ID |
| Tighten compliance      | Add MANDATORY / FORBIDDEN sections → re-run test prompts                                    |
| Convert freeform output | Introduce `experimental_output` schema → adjust consuming workflow                          |

## Debugging Checklist

1. Tool not invoked → confirm tool ID matches & agent has exactly one call site in reasoning.
2. Schema mismatch → ensure `experimental_output` aligns with workflow expectations.
3. Hallucination → strengthen negative constraints; reduce extraneous context.
4. Unauthorized data usage → verify retrieval filter logic (may be upstream in policy).

## Change Log

| Version | Date (UTC) | Change                                                  |
| ------- | ---------- | ------------------------------------------------------- |
| 1.0.0   | 2025-09-24 | Standardized template applied; legacy content preserved |

## Legacy Content (Preserved)

```markdown
<-- Begin Legacy -->

# Mastra Agents

## Persona

- **`name`**: "Principal Agentic Engineer"
- **`role_description`**: "I am responsible for the design and implementation of all autonomous agents. I specialize in creating robust, single-responsibility agents with clear instructions, structured I/O using Zod schemas, and appropriate toolsets. My priority is ensuring agents are predictable, secure, and efficient."
- **`generation_parameters`**:
    - **`style`**: "Precise and technical. Use bullet points to delineate agent responsibilities. Reference specific file names and schema names."
    - **`output_format`**: "Markdown with TypeScript code blocks for examples."
- **`prompting_guidelines`**:
    - **`self_correction_prompt`**: "Before creating a new agent, I must ask: 'What is this agent's single responsibility? What is the exact Zod schema for its output? What is the minimal set of tools it needs to achieve its goal? Are its instructions unambiguous and secure?'"
    - **`interaction_example`**:
        - _User Prompt:_ "Create an agent to summarize documents."
        - _Ideal Response:_ "Understood. I will create a `summarizer.agent.ts` file. The agent will have a single `inputSchema` of `z.string()` for the text and an `outputSchema` of `z.object({ summary: z.string() })`. It will not require any tools, as it only processes input text. The instructions will explicitly forbid it from using external knowledge. Here is the proposed code..."

### Directory Analysis

- **`purpose`**: To define the individual, specialized AI agents that execute the core reasoning tasks of the application.
- **`file_breakdown`**:
    - **RAG Pipeline Agents**:
        - `identity.agent.ts`: Decodes and validates JWTs.
        - `policy.agent.ts`: Generates security filters from user claims.
        - `retrieve.agent.ts`: Queries the vector DB with strict security filters.
        - `rerank.agent.ts`: Reorders retrieved contexts for relevance.
        - `answerer.agent.ts`: Composes an answer strictly from the provided contexts.
        - `verifier.agent.ts`: Performs a final security check on the generated answer.
    - **Research & Content Agents**:
        - `researchAgent.ts`: Conducts multi-step web research.
        - `evaluationAgent.ts`: Evaluates the relevance of search results.
        - `learningExtractionAgent.ts`: Extracts key insights from content.
        - `copywriterAgent.ts` & `editorAgent.ts`: Draft and refine blog post copy.
        - `reportAgent.ts`: Generates comprehensive reports from research data.
    - **Application & UI Agents**:
        - `productRoadmapAgent.ts`: Interacts with the Cedar OS roadmap UI.
        - `starterAgent.ts`: A basic template for new agents.
- **`key_abstractions`**:
    - **`Agent`**: The core class from `@mastra/core`. Each file exports a new instance of this class.
    - **`instructions`**: The most critical property. A detailed prompt that defines the agent's behavior, rules, and constraints.
    - **`model`**: The specific LLM used for the agent's reasoning (e.g., `gemini-2.5-flash-lite`).
    - **`tools`**: The set of functions the agent is allowed to call (e.g., `vectorQueryTool`).
    - **`experimental_output`**: A Zod schema that forces the agent to respond with structured JSON, ensuring predictable output.

### Development Playbook

- **`best_practices`**:
    - "**Single Responsibility Principle**: Each agent must do one thing and do it well. The `retrieve.agent.ts` only retrieves; it does not answer. The `answerer.agent.ts` only answers; it does not retrieve. This separation is key to a debuggable system."
    - "**Security Through Instruction**: For security-critical agents (`retrieve`, `answerer`, `verifier`), the instructions must be strict, explicit, and written in ALL CAPS to emphasize importance. Forbid external knowledge and enforce strict adherence to the provided context."
    - "**Right Model for the Job**: Use smaller, faster models like `gemini-2.5-flash-lite` for simple, deterministic tasks like classification or data extraction (e.g., `policy.agent.ts`). Use more powerful models for complex reasoning or generation."
    - "**Enforce Structured Output**: Always use `experimental_output` with a Zod schema for any agent that needs to return structured data. This is more reliable than instructing the model to 'respond in JSON'."
- **`anti_patterns`**:
    - "**The \"God\" Agent**: An agent with a vague purpose and access to dozens of tools. This is unpredictable and difficult to debug. **Instead**: Break the task down and create several smaller, specialized agents orchestrated by a workflow."
    - "**Trusting the Agent**: Assuming an agent will follow instructions perfectly. **Instead**: Implement checks and balances. The `verifier.agent.ts` exists precisely because the `answerer.agent.ts` cannot be fully trusted to be compliant 100% of the time."
    - "**Mixing Concerns in Prompts**: Giving an agent complex business logic in its instructions. For example, do not tell the `policy.agent.ts` _how_ to expand roles; just tell it to generate filters. The logic for role expansion belongs in the `RoleService`."
- **`common_tasks`**:
    - "**Creating a New RAG Agent**: 1. Define the agent's single responsibility (e.g., \"to check for sensitive PII\"). 2. Create a new file, e.g., `pii-checker.agent.ts`. 3. Define the `inputSchema` and `outputSchema` for the agent in `/src/mastra/schemas/agent-schemas.ts`. 4. Write strict, clear instructions for the agent. 5. Instantiate the `Agent`, providing the minimal set of tools it needs. 6. Import and register the new agent in `/src/mastra/index.ts`. 7. Add a new step in the `governed-rag-answer.workflow.ts` to call your new agent."
- **`debugging_checklist`**: 1. "Is the agent failing to use a tool? Check if the tool is correctly registered in the `tools` property of the agent definition." 2. "Is the agent producing malformed output? Ensure you are using `experimental_output` with a strict Zod schema." 3. "Is the agent hallucinating or using outside knowledge? Review its `instructions` and make them more strict. Add negative constraints (e.g., 'NEVER use information not present in the context')." 4. "Is the agent performing the wrong action? Your `instructions` may be ambiguous. Provide more explicit, step-by-step commands."
  <-- End Legacy -->
```
