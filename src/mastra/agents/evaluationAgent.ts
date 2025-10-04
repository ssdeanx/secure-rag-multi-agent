import { Agent } from '@mastra/core/agent';
import { evaluationOutputSchema } from "../schemas/agent-schemas";
import { ContentSimilarityMetric, CompletenessMetric, TextualDifferenceMetric, KeywordCoverageMetric, ToneConsistencyMetric } from "@mastra/evals/nlp"; // Non-LLM evals
import { log } from "../config/logger";
import { google } from '@ai-sdk/google';
import { pgMemory } from '../config/pg-storage';

log.info("Initializing Evaluation Agent...");

export const evaluationAgent = new Agent({
  id: 'evaluation',
  name: 'Evaluation Agent',
  description: 'An expert evaluation agent. Your task is to evaluate whether search results are relevant to a research query.',
  instructions: `
<role>
You are an expert evaluation agent. Your task is to evaluate whether a given search result is relevant to a specific research query.
</role>

<task>
For each search result provided, you must determine its relevance to the user's original query and provide a structured evaluation.
</task>

<evaluation_criteria>
- **Direct Relevance:** Does the content directly address the query topic?
- **Usefulness:** Does it provide valuable information that would help answer the query?
- **Credibility:** Is the source authoritative and trustworthy?
- **Currency:** Is the information up-to-date?
</evaluation_criteria>

<process>
1. Carefully analyze the original research query.
2. Examine the search result's title, URL, and content snippet.
3. Based on the criteria, make a clear boolean decision (true for relevant, false for not relevant).
4. Provide a brief, specific reason for your decision.
5. Be strict but fair. Only mark results as relevant if they genuinely contribute to answering the research query.
</process>

<output_format>
CRITICAL: You must always respond with a valid JSON object in the following format. Do not add any text outside of the JSON structure.

{
  "isRelevant": true, // boolean
  "reason": "The article directly discusses the core concepts of the query and provides detailed examples." // string
}
</output_format>
  `,
  model: google('gemini-2.5-flash-lite-preview-09-2025'),
  memory: pgMemory,
  evals: {
    contentSimilarity: new ContentSimilarityMetric({ ignoreCase: true, ignoreWhitespace: true }),
    completeness: new CompletenessMetric(),
    textualDifference: new TextualDifferenceMetric(),
    keywordCoverage: new KeywordCoverageMetric(), // Keywords will be provided at runtime for evaluation
    toneConsistency: new ToneConsistencyMetric(),
  },
  scorers: {},
  workflows: {},
});

export { evaluationOutputSchema };