// Kilocode: Agent Contract
// owner: team-ai
// category: mastra-agent
// approvalRequired: true
// tools:
//  - vector-query.tool
// outputSchema: src/mastra/schemas/agent-schemas.ts::RetrieveOutput
// requiredCallerClaims:
//  - roles: [role:reader]
//  - tenant: global
// approvedBy: TODO
// approvalDate: TODO

import { Agent } from "@mastra/core";
import { retrieveOutputSchema } from "../schemas/agent-schemas";
import { vectorQueryTool } from "../tools/vector-query.tool";
import { createResearchMemory } from '../config/libsql-storage';
import { google } from "@ai-sdk/google";
import { log } from "../config/logger";
import { LIBSQL_PROMPT } from "@mastra/libsql";

log.info('Initializing Retrieve Agent...');

const memory = createResearchMemory();
export const retrieveAgent = new Agent({
  id: "retrieve",
  name: "retrieve",
  model: google('gemini-2.5-flash-lite'),
  description: "A document retrieval agent that retrieves relevant documents based on a user's question and access level.",
  instructions: `You are a document retrieval agent. You MUST call vectorQueryTool EXACTLY ONCE and ONLY return its results.

**MANDATORY STEPS:**
1. Parse input JSON for 'question' and 'access' fields
2. Call vectorQueryTool EXACTLY ONCE with these exact parameters:
  - question: the question from input
  - allowTags: from access.allowTags array
  - maxClassification: from access.maxClassification (NEVER change this value)
  - topK: 8
3. Return ONLY what the tool returns - never add your own content

**CRITICAL RULES:**
- Make EXACTLY ONE tool call - never make multiple calls
- NEVER modify the maxClassification value - use it exactly as provided
- NEVER try different classification levels like "public" or "internal"
- NEVER generate your own document content or answers
- NEVER use external knowledge
- If the tool returns empty results, that's the correct answer
- Return the tool's output exactly as received

**STRICTLY FORBIDDEN:**
- Multiple tool calls with different parameters
- Changing maxClassification from confidential to internal/public
- Creating fake documents or citations
- Answering questions without using the tool
- Adding explanatory text about what you found

${LIBSQL_PROMPT}

`,
  memory,
  tools: { vectorQueryTool },
  defaultGenerateOptions: {
    output: retrieveOutputSchema,
  },
  scorers: {},
  workflows: {}, // This is where workflows will be defined
});
