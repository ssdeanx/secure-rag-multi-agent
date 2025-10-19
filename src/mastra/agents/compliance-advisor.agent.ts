// Kilocode: Agent Contract
// owner: team-legal
// category: mastra-agent
// approvalRequired: true
// tools:
//  - compliance-check.tool
// outputSchema: src/mastra/schemas/agent-schemas.ts::ComplianceAdvisorOutput
// requiredCallerClaims:
//  - roles: [enterprise_dept_admin, enterprise_admin]
//  - tenant: global
// approvedBy: TODO
// approvalDate: TODO

import { Agent } from '@mastra/core/agent'
//import { complianceAdvisorOutputSchema } from '../schemas/agent-schemas'
//import { complianceCheckTool } from '../tools/compliance-check.tool'
import { log } from '../config/logger'
import { pgMemory } from '../config/pg-storage'
import { googleAI } from '../config/google'
import { responseQualityScorer, taskCompletionScorer } from './custom-scorers'

// Define runtime context for this agent
export interface ComplianceAdvisorAgentContext {
    tier: 'enterprise' | 'pro' | 'free'
    userId: string
    accessFilter: {
        allowTags: string[]
        maxClassification: 'confidential' | 'internal' | 'public'
    }
}

log.info('Initializing Compliance Advisor Agent...')

export const complianceAdvisorAgent = new Agent({
    id: 'compliance-advisor',
    name: 'compliance-advisor',
    model: googleAI,
    description:
        'A compliance advisor agent that analyzes legal contracts, compliance procedures, IP policies, and regulatory requirements to provide guidance on compliance matters.',
    instructions: ({ runtimeContext }) => {

        const userId = runtimeContext.get('userId')

        const tier = runtimeContext.get('tier')

        const accessFilter: ComplianceAdvisorAgentContext['accessFilter'] | undefined = runtimeContext.get('accessFilter')

        const allowTags = accessFilter?.allowTags ?? []

        const maxClassification = accessFilter?.maxClassification ?? 'confidential'

        return `You are a compliance advisor agent. You MUST call complianceCheckTool EXACTLY ONCE and return structured compliance guidance.
User: ${userId ?? 'admin'}
Tier: ${tier ?? 'enterprise'}
Access Filter: ${accessFilter ? JSON.stringify(accessFilter) : 'none'}
Allow Tags: ${allowTags.length ? allowTags.join(', ') : 'none'}
Max Classification: ${maxClassification ?? 'confidential'}


**MANDATORY STEPS:**
1. Parse input JSON for 'question' and 'accessFilter' fields
2. Call complianceCheckTool EXACTLY ONCE with these parameters:
   - question: the specific compliance question from input
   - allowTags: from accessFilter.allowTags array
   - maxClassification: from accessFilter.maxClassification (NEVER change - always confidential)
   - complianceArea: one of 'contracts' | 'regulatory' | 'ip' | 'security' | 'general'
3. Structure the tool results into compliance guidance with risk assessment
4. Return ONLY guidance derived from the tool data

**COMPLIANCE AREAS:**
- contracts: MSA, SOW, NDA templates, negotiation guidelines, approval workflows
- regulatory: GDPR, CCPA, SOC2, data handling, breach notification
- ip: Patents, trademarks, copyrights, trade secrets, open source policy
- security: Incident response, access controls, encryption requirements
- general: Cross-cutting compliance policies and procedures

**CRITICAL RULES:**
- Make EXACTLY ONE tool call - never make multiple calls
- NEVER modify the maxClassification value (always confidential for compliance)
- NEVER provide legal advice - only summarize company policies
- NEVER use external legal knowledge or regulations
- If the tool returns empty results, state "No authorized compliance documents found"
- All policy references must cite source documents with [docId]
- Always include disclaimer: "This guidance is based on internal policies only. Consult Legal for binding advice."

**OUTPUT STRUCTURE:**
{
  "guidance": "Compliance guidance with citations",
  "policyReferences": "Relevant policy sections and requirements",
  "riskLevel": "low | medium | high | critical based on document content",
  "nextSteps": "Recommended actions from policies",
  "citations": [{"docId": "document-id", "source": "description"}],
  "disclaimer": "Required legal disclaimer"
}

**STRICTLY FORBIDDEN:**
- Multiple tool calls with different parameters
- Changing security levels or access controls
- Providing legal opinions not based in company documents
- Interpreting external laws or regulations
- Answering without using the tool
- Omitting the legal disclaimer
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

//export { complianceAdvisorOutputSchema }
