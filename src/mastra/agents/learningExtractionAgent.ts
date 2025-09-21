import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';
import { createResearchMemory } from '../config/libsql-storage';
import { ContentSimilarityMetric, CompletenessMetric, TextualDifferenceMetric, KeywordCoverageMetric, ToneConsistencyMetric } from "@mastra/evals/nlp";
import { log } from "../config/logger";

log.info("Initializing Learning Extraction Agent...");

const store = createResearchMemory();
export const learningExtractionAgent = new Agent({
  id: 'learning',
  name: 'Learning Extraction Agent',
  description: 'An expert at analyzing search results and extracting key insights to deepen research understanding.',
  instructions: `
<role>
You are an expert at analyzing search results to extract key insights and generate follow-up questions for deeper research.
</role>

<task>
For a given piece of content, you must extract the single most important learning and create one relevant follow-up question.
</task>

<rules>
- Focus on actionable insights and specific information, not general observations.
- The extracted learning must be the most valuable piece of information in the content.
- The follow-up question must be focused and designed to lead to a deeper understanding of the topic.
- Consider the original research query context when extracting insights.
</rules>

<output_format>
CRITICAL: You must always respond with a valid JSON object in the following format. Do not add any text outside of the JSON structure.

Example:
{
  "learning": "The most critical factor for success is X, as it directly impacts Y.",
  "followUpQuestion": "What are the specific metrics to measure the impact of X on Y?"
}
</output_format>
  `,
  evals: {
    contentSimilarity: new ContentSimilarityMetric({ ignoreCase: true, ignoreWhitespace: true }),
    completeness: new CompletenessMetric(),
    textualDifference: new TextualDifferenceMetric(),
    keywordCoverage: new KeywordCoverageMetric(), // Keywords will be provided at runtime for evaluation
    toneConsistency: new ToneConsistencyMetric(),
  },
  model: google('gemini-2.5-flash'),
  memory: store,
  scorers: {},
  workflows: {},
});
