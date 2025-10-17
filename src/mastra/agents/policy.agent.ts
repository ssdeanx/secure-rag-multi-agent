import { Agent } from '@mastra/core/agent'

import { policyOutputSchema } from '../schemas/agent-schemas'
import { google } from '@ai-sdk/google'
import { log } from '../config/logger'
import { pgMemory } from '../config/pg-storage'
import { responseQualityScorer, taskCompletionScorer } from './custom-scorers'

// Define runtime context for this agent
export interface PolicyAgentContext {
    tier: 'free' | 'pro' | 'enterprise'
    userId: string
}

log.info('Initializing Policy Agent...')

export const policyAgent = new Agent({
    id: 'policy',
    name: 'policy',
    model: ({ runtimeContext }) => {
        const tier = runtimeContext.get('tier')
        if (tier === 'enterprise') {
            return google('gemini-2.5-flash-preview-09-2025')
        } else if (tier === 'pro') {
            return google('gemini-2.5-flash-lite-preview-09-2025')
        }
        return google('gemini-2.5-flash-lite-preview-09-2025')
    },
    description:
        'A policy enforcement agent that generates access filters based on user claims.',
    instructions: ({ runtimeContext }) => {
        const tier = runtimeContext.get('tier')
        const userId = runtimeContext.get('userId')
        let tierInstructions = ''
        if (tier === 'free') {
            tierInstructions = '\n- Free tier: Basic policy enforcement only.'
        } else if (tier === 'pro') {
            tierInstructions = '\n- Pro tier: Enhanced policy enforcement with advanced filtering.'
        } else {
            tierInstructions = '\n- Enterprise tier: Full policy enforcement with all features enabled.'
        }
        return `You are a policy enforcement agent for user ${userId}. Given user claims, generate access filters.
        Rules:
        1. Extract roles from claims and create "role:<role>" tags for each
        2. If tenant is provided, add "tenant:<tenant>" tag
        3. Determine maximum classification based on roles and stepUp status:
            - stepUp == true: Allow up to "confidential"
            - HR roles (hr.admin, hr.viewer): Allow up to "confidential"
            - Other sensitive roles without stepUp: Cap at "internal"
            - No sensitive roles: Cap at "public"
        4. Never invent roles or tenants not present in the claims
        5. Always output valid JSON matching the schema
        ${tierInstructions}

        Examples:
        - Finance user: {"roles": ["finance.viewer"], "tenant": "acme", "stepUp": false} → {"allowTags": ["role:finance.viewer", "tenant:acme"], "maxClassification": "internal"}
        - Step-up user: {"roles": ["engineering.admin"], "tenant": "acme", "stepUp": true} → {"allowTags": ["role:engineering.admin", "tenant:acme"], "maxClassification": "confidential"}
        - HR user: {"roles": ["hr.viewer"], "tenant": "acme", "stepUp": false} → {"allowTags": ["role:hr.viewer", "tenant:acme"], "maxClassification": "confidential"}
        `
    },
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
export { policyOutputSchema }
// --- IGNORE ---
// defaultGenerateOptions: {
//   output: policyOutputSchema,
// },
// --- IGNORE ---
