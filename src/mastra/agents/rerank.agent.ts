import { Agent } from '@mastra/core/agent'
import { rerankOutputSchema } from '../schemas/agent-schemas'
import { google } from '@ai-sdk/google'
import { log } from '../config/logger'
import { pgMemory } from '../config/pg-storage'
import { googleAI } from '../config/google'

log.info('Initializing Rerank Agent...')

export const rerankAgent = new Agent({
    id: 'rerank',
    name: 'rerank',
    model: googleAI,
    description:
        'A context reranking agent that reorders provided contexts based on their relevance to the question.',
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

Always return valid JSON matching this exact structure.`,
    memory: pgMemory,
    evals: {
        // Add any evaluation metrics if needed
    },
    scorers: {},
    workflows: {},
})
export { rerankOutputSchema }
