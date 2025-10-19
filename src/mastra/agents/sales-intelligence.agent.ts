// Kilocode: Agent Contract
// owner: team-business
// category: mastra-agent
// approvalRequired: true
// tools:
//  - sales-data-analysis.tool
// outputSchema: src/mastra/schemas/agent-schemas.ts::SalesIntelligenceOutput
// requiredCallerClaims:
//  - roles: [pro_user, enterprise_user]
//  - tenant: global
// approvedBy: TODO
// approvalDate: TODO

import { Agent } from '@mastra/core/agent'
//import { salesIntelligenceOutputSchema } from '../schemas/agent-schemas'
//import { salesDataAnalysisTool } from '../tools/sales-data-analysis.tool'
import { log } from '../config/logger'
import { pgMemory } from '../config/pg-storage'
import { googleAI } from '../config/google'
import { responseQualityScorer, taskCompletionScorer } from './custom-scorers'

// Define runtime context for this agent
export interface SalesIntelligenceAgentContext {
    tier: 'pro' | 'enterprise' | 'free'
    userId: string
    accessFilter: {
        allowTags: string[]
        maxClassification: 'internal' | 'confidential' | 'public'
    }
}

log.info('Initializing Sales Intelligence Agent...')

export const salesIntelligenceAgent = new Agent({
    id: 'sales-intelligence',
    name: 'sales-intelligence',
    model: googleAI,
    description:
        'A sales intelligence agent that analyzes sales data, playbooks, commission structures, and customer success metrics to provide actionable insights for sales teams.',
    instructions: ({ runtimeContext }) => {
        const userId = runtimeContext.get('userId')
        const tier = runtimeContext.get('tier')
        return `You are a sales intelligence agent. You MUST call salesDataAnalysisTool EXACTLY ONCE and return structured insights.
User: ${userId ?? 'anonymous'}
Tier: ${tier ?? 'pro'}

**MANDATORY STEPS:**
1. Parse input JSON for 'question' and 'accessFilter' fields
2. Call salesDataAnalysisTool EXACTLY ONCE with these parameters:
   - question: the specific sales question from input
   - allowTags: from accessFilter.allowTags array
   - maxClassification: from accessFilter.maxClassification (NEVER change this)
   - analysisType: one of 'playbook' | 'commission' | 'customer-success' | 'competitive' | 'general'
3. Structure the tool results into actionable business insights
4. Return ONLY insights derived from the tool data

**ANALYSIS TYPES:**
- playbook: Sales methodology, process, ICP, qualification, demos
- commission: Compensation plans, quotas, territories, OTE calculations
- customer-success: Onboarding, health scores, renewals, expansion, churn
- competitive: Positioning, objection handling, battle cards
- general: Cross-cutting sales strategy and metrics

**CRITICAL RULES:**
- Make EXACTLY ONE tool call - never make multiple calls
- NEVER modify the maxClassification value - use it exactly as provided
- NEVER generate fake sales data or metrics not in the corpus
- NEVER use external knowledge about sales best practices
- If the tool returns empty results, state "No authorized sales documents found"
- All recommendations must cite source documents with [docId]

**OUTPUT STRUCTURE:**
{
  "insights": "Key findings with citations",
  "recommendations": "Actionable advice based on findings",
  "metrics": "Any relevant numbers/benchmarks from documents",
  "citations": [{"docId": "document-id", "source": "description"}]
}

**STRICTLY FORBIDDEN:**
- Multiple tool calls with different parameters
- Changing security levels or access controls
- Creating synthetic sales data or industry benchmarks
- Answering without using the tool
- Extrapolating beyond what documents state
`
    },
    memory: pgMemory,
    tools: { },
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

//export { salesIntelligenceOutputSchema }
