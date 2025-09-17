import { Agent } from "@mastra/core";
import { z } from "zod";

import { openAIModel } from "../config/openai";
import { documentContextSchema } from "../schemas/agent-schemas";

export const rerankAgent = new Agent({
  id: "rerank",
  name: "rerank",
  model: openAIModel,
  instructions: `You are a context reranking agent. Your task is to:

1. Analyze the relevance of each context to the question
2. Sort contexts from most to least relevant
3. Preserve all context properties exactly as provided
4. Return the complete reordered array

Relevance criteria:
- Direct answer to the question (highest priority)
- Related information that provides context
- Background information (lower priority)
- Tangentially related content (lowest priority)

IMPORTANT: Return ALL contexts, just reordered. Do not filter or remove any.

You must respond with a valid JSON object in the following format:
{
  "contexts": [/* array of reordered context objects */]
}

Always return valid JSON matching this exact structure.`
});

export const rerankOutputSchema = z.object({
  contexts: z.array(documentContextSchema)
});