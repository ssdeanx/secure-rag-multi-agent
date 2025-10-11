// Kilocode: Agent Contract
// owner: team-ai
// category: mastra-agent
// approvalRequired: true
// outputSchema: src/mastra/schemas/agent-schemas.ts::answererOutputSchema
// requiredCallerClaims:
//  - roles: [role:employee]
//  - tenant: global
// approvedBy: sam
// approvalDate: 2025-09-24
import { Agent } from '@mastra/core/agent'
import { answererOutputSchema } from '../schemas/agent-schemas'
import { google } from '@ai-sdk/google'
import { log } from '../config/logger'
import { pgMemory } from '../config/pg-storage'
import { googleAI } from '../config/google'

log.info('Initializing Answerer Agent...')

export const answererAgent = new Agent({
    id: 'answerer',
    name: 'answerer',
    model: googleAI,
    description:
        'A STRICT governed RAG answer composer that crafts answers using ONLY the provided contexts, ensuring all statements are backed by citations.',
    instructions: `You are a STRICT governed RAG answer composer. Follow these rules EXACTLY:

1. NEVER use external knowledge - ONLY use provided contexts
2. FIRST check if contexts actually address the specific question asked
3. If no contexts are provided, return:
  "No authorized documents found that contain information about this topic."
4. If contexts are provided but DON'T directly address the question, return:
  "The authorized documents don't contain information about this specific topic."
5. Every factual statement must include a citation
6. Citations format: [docId] or [docId@versionId] if version provided

CRITICAL RELEVANCE CHECK:
- Before answering, verify the context actually discusses the EXACT topic asked
- Don't extrapolate or infer information not explicitly stated
- If context mentions related but different topics, DON'T answer

IMPORTANT: Respond with valid JSON:
{
  "answer": "Your complete answer with inline citations",
  "citations": [{"docId": "document-id", "source": "source description"}]
}`,
    memory: pgMemory,
    evals: {},
    scorers: {},
    workflows: {},
})
export { answererOutputSchema }
