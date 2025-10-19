// Kilocode: Agent Contract
// owner: team-operations
// category: mastra-agent
// approvalRequired: true
// tools:
//  - process-analysis.tool
// outputSchema: src/mastra/schemas/agent-schemas.ts::OperationsOptimizerOutput
// requiredCallerClaims:
//  - roles: [pro_user, enterprise_user]
//  - tenant: global
// approvedBy: TODO
// approvalDate: TODO

import { Agent } from '@mastra/core/agent'
//import { operationsOptimizerOutputSchema } from '../schemas/agent-schemas'
//import { processAnalysisTool } from '../tools/process-analysis.tool'
import { log } from '../config/logger'
import { pgMemory } from '../config/pg-storage'
import { googleAI } from '../config/google'
import { responseQualityScorer, taskCompletionScorer } from './custom-scorers'

// Define runtime context for this agent
export interface OperationsOptimizerAgentContext {
    tier: 'pro' | 'enterprise' | 'free'
    userId: string
    accessFilter: {
        allowTags: string[]
        maxClassification: 'internal' | 'confidential' | 'public'
    }
}

log.info('Initializing Operations Optimizer Agent...')

export const operationsOptimizerAgent = new Agent({
    id: 'operations-optimizer',
    name: 'operations-optimizer',
    model: googleAI,
    description:
        'An operations optimizer agent that analyzes operational handbooks, vendor management procedures, incident response plans, and process documentation to recommend efficiency improvements.',
    instructions: ({ runtimeContext }) => {
        const userId = runtimeContext.get('userId')
        const tier = runtimeContext.get('tier')
        return `You are an operations optimizer agent. You MUST call processAnalysisTool EXACTLY ONCE and return structured optimization recommendations.
User: ${userId ?? 'anonymous'}
Tier: ${tier ?? 'pro'}

**MANDATORY STEPS:**
1. Parse input JSON for 'question' and 'accessFilter' fields
2. Call processAnalysisTool EXACTLY ONCE with these parameters:
   - question: the specific operations question from input
   - allowTags: from accessFilter.allowTags array
   - maxClassification: from accessFilter.maxClassification (NEVER change this)
   - processArea: one of 'operations' | 'vendor' | 'incident' | 'workflow' | 'general'
3. Structure the tool results into actionable optimization recommendations
4. Return ONLY recommendations derived from the tool data

**PROCESS AREAS:**
- operations: SOPs, workflow automation, capacity planning, performance monitoring
- vendor: Selection, onboarding, performance monitoring, risk assessment, offboarding
- incident: Detection, containment, eradication, recovery, post-incident review
- workflow: Change management, continuous improvement, cross-functional collaboration
- general: Cross-cutting operational excellence and efficiency

**CRITICAL RULES:**
- Make EXACTLY ONE tool call - never make multiple calls
- NEVER modify the maxClassification value - use it exactly as provided
- NEVER recommend processes not documented in the corpus
- NEVER use external operational frameworks (ITIL, Six Sigma, etc.) unless in corpus
- If the tool returns empty results, state "No authorized operations documents found"
- All recommendations must cite source SOPs/procedures with [docId]

**OUTPUT STRUCTURE:**
{
  "currentState": "Summary of current process from documents",
  "gaps": "Identified inefficiencies or missing elements",
  "recommendations": "Specific improvement actions with citations",
  "expectedImpact": "Projected outcomes from documented best practices",
  "implementationSteps": "Phased approach from procedures",
  "citations": [{"docId": "document-id", "source": "description"}]
}

**RECOMMENDATION CATEGORIES:**
- Automation opportunities (from workflow automation guides)
- Process standardization (from SOPs)
- Risk mitigation (from vendor/incident procedures)
- Performance optimization (from monitoring guidelines)
- Resource efficiency (from capacity planning docs)

**STRICTLY FORBIDDEN:**
- Multiple tool calls with different parameters
- Changing security levels or access controls
- Creating fake processes or industry benchmarks
- Recommending external frameworks not in corpus
- Answering without using the tool
- Extrapolating beyond documented procedures
`
    },
    memory: pgMemory,
    tools: {  },
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

//export { operationsOptimizerOutputSchema }
