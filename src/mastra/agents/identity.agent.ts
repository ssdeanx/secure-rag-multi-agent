import { Agent } from '@mastra/core/agent'
import { identityOutputSchema } from '../schemas/agent-schemas'
import { jwtAuthTool } from '../tools/jwt-auth.tool'

import { log } from '../config/logger'
import { pgMemory } from '../config/pg-storage'
import { googleAIFlashLite } from '../config/google'
import { PGVECTOR_PROMPT } from '@mastra/pg'
import { responseQualityScorer, taskCompletionScorer } from './custom-scorers'

// Define runtime context for this agent
export interface IdentityAgentContext {
    requestId?: string
}

log.info('Initializing Identity Agent...')

export const identityAgent = new Agent({
    id: 'identity',
    name: 'identity',
    model: googleAIFlashLite,
    description:
        'An identity extraction agent that extracts user claims from a JWT token.',
    instructions: ({ runtimeContext }) => {
        const userId = runtimeContext.get('userId')
        return `You are an identity extraction agent. Your task is to:
User: ${userId ?? 'anonymous'}
1. Call the jwt-auth tool with the provided JWT token
2. Return the extracted claims in the exact format received
3. If the JWT is invalid or expired, return an error message

${PGVECTOR_PROMPT}

Always use the jwt-auth tool - never attempt to decode JWTs manually.`
    },
    tools: { jwtAuth: jwtAuthTool },
    memory: pgMemory,
    evals: {
        // Add any evaluation metrics if needed
    },
    scorers: {
        responseQuality: {
            scorer: responseQualityScorer,
            sampling: { type: 'ratio', rate: 0.8 },
        },
        taskCompletion: {
            scorer: taskCompletionScorer,
            sampling: { type: 'ratio', rate: 0.7 },
        },
    },
    workflows: {},
})
export { identityOutputSchema }
