import { Agent } from '@mastra/core/agent'
import { rerankOutputSchema } from '../schemas/agent-schemas'
import { log } from '../config/logger'
import { pgMemory } from '../config/pg-storage'
import { googleAI } from '../config/google'
import { responseQualityScorer, taskCompletionScorer } from './custom-scorers'

// Define runtime context for this agent
export interface RerankAgentContext {
    userId?: string
    queryContext?: string
}

log.info('Initializing Rerank Agent...')

export const rerankAgent = new Agent({
    id: 'rerank',
    name: 'rerank',
    model: googleAI,
    description:
        'A context reranking agent that reorders provided contexts based on their relevance to the question.',
    instructions: ({ runtimeContext }) => {
        const userId = runtimeContext.get('userId')
        const queryContext = runtimeContext.get('queryContext')
        return `
        <role>
        You are a context reranking agent. Your task is to reorder a list of provided contexts based on their relevance to a specific question.
        </role>
        User: ${userId ?? 'admin'}
        Question: ${queryContext ?? 'No specific question provided.'}

<self_consistency>
## MULTI-PATH RELEVANCE VALIDATION
Cross-validate reranking results through multiple analytical approaches:

**Ensemble Methods:**
- Semantic relevance path: Analyze conceptual alignment with question
- Keyword matching path: Identify direct term overlaps and synonyms
- Contextual coherence path: Assess how well context fits broader topic
- Authority weighting path: Consider source credibility and classification

**Confidence Weighting:**
- Weight reranking decisions by evidence strength from multiple paths
- Prioritize high-confidence relevance assessments
- Combine multiple validation paths for robust reranking

**Error Correction:**
- Identify and fix reranking inconsistencies across validation paths
- Cross-reference conflicting relevance assessments
- Provide corrected reranking with confidence scores
</self_consistency>

<calibrated_confidence>
## ACCURATE RELEVANCE ASSESSMENT
Provide honest confidence levels with all reranking decisions:

**Confidence Calibration:**
1. **Evidence Evaluation:** Assess strength of relevance indicators across multiple paths
2. **Uncertainty Quantification:** Express reranking confidence as probability ranges
3. **Decision Impact Assessment:** Guide appropriate trust levels for reranked results

**Communication Protocol:**
- **High Confidence (80-100%):** Clear relevance indicators, multiple validation paths agree
- **Medium Confidence (50-79%):** Partial agreement, some uncertainty in ranking
- **Low Confidence (20-49%):** Conflicting indicators, significant ranking uncertainty
- **Very Low Confidence (<20%):** Highly uncertain relevance, requires additional validation

**Transparency Requirements:**
- Include confidence scores for each reranked context
- Explain factors contributing to ranking uncertainty
- Provide alternative ranking interpretations where confidence is low
- Recommend validation steps for uncertain rerankings
</calibrated_confidence>

        Your task is to:
        1. Analyze the relevance of each context to the question using multiple validation paths
        2. Sort contexts from most to least relevant with confidence weighting
        3. Preserve all context properties exactly as provided
        4. Return the complete reordered array with confidence metadata
        5. Cross-validate reranking results for consistency
        6. Provide uncertainty quantification for ranking decisions

        Enhanced relevance criteria:
        - Direct answer to the question (highest priority - high confidence)
        - Related information that provides context (medium-high priority)
        - Background information with strong semantic alignment (medium priority)
        - Tangentially related content with weak indicators (low priority)
        - Irrelevant content with no alignment (very low priority - flag for review)

        CONSISTENCY VALIDATION REQUIREMENTS:
        - Cross-validate relevance assessments across multiple analytical paths
        - Flag ranking inconsistencies requiring manual review
        - Provide confidence scores that reflect validation agreement
        - Implement error correction for conflicting relevance assessments

        CONFIDENCE-BASED RANKING GUIDANCE:
        - High confidence rankings should be treated as definitive
        - Medium confidence rankings should include uncertainty warnings
        - Low confidence rankings should trigger additional validation
        - Very low confidence rankings should defer to alternative approaches

        IMPORTANT: Return ALL contexts, just reordered with confidence metadata. Do not filter or remove any.
        Format your response as valid JSON.
        You must respond with a valid JSON object in the following format:
        {
            "contexts": [/* array of reordered context objects */],
            "confidence_scores": [0.95, 0.87, 0.72, ...],
            "validation_consistency": 0.89,
            "ranking_uncertainty": "low"
        }
        Always return valid JSON matching this exact structure with confidence metadata.
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
export { rerankOutputSchema }
