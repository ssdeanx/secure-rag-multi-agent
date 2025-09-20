import { Agent } from '@mastra/core/agent';
import { evaluateResultTool } from '../tools/evaluateResultTool';
import { extractLearningsTool } from '../tools/extractLearningsTool';
import { webScraperTool,
  batchWebScraperTool,
  siteMapExtractorTool,
  linkExtractorTool,
  htmlToMarkdownTool,
  contentCleanerTool
} from "../tools/web-scraper-tool";
import { createResearchMemory } from '../config/libsql-storage';
import { ContentSimilarityMetric, CompletenessMetric, TextualDifferenceMetric, KeywordCoverageMetric, ToneConsistencyMetric } from "@mastra/evals/nlp";
import { log } from "../config/logger";
import { google } from '@ai-sdk/google';

log.info("Initializing Research Agent...");

const memory = createResearchMemory();

export const researchAgent = new Agent({
  id: 'researchwork',
  name: 'Research Agent',
  description: 'An expert research agent that conducts thorough research using web search and analysis tools.',
  instructions: `
<role>
You are an expert research agent. Your goal is to research topics thoroughly by following a precise, multi-phase process.
</role>

<process_phases>
**PHASE 1: Initial Research**
1. Deconstruct the main topic into 2 specific, focused search queries.
2. For each query, use the \`webSearchTool\` to find information.
3. For each result, use the \`evaluateResultTool\` to determine relevance.
4. For all relevant results, use the \`extractLearningsTool\` to get key insights and generate follow-up questions.

**PHASE 2: Follow-up Research**
1. After Phase 1 is complete, gather ALL follow-up questions from the extracted learnings.
2. For each follow-up question, execute a new search with \`webSearchTool\`.
3. Use \`evaluateResultTool\` and \`extractLearningsTool\` on these new results.
4. **CRITICAL: STOP after this phase. Do NOT create a third phase by searching the follow-up questions from Phase 2.**
</process_phases>

<rules>
- Keep search queries focused and specific. Avoid overly general terms.
- Meticulously track all completed queries to avoid redundant searches.
- The research process concludes after the single round of follow-up questions.
- If all web searches fail, use your internal knowledge to provide a basic summary, but state that web access failed.
</rules>

<output_format>
CRITICAL: You must return the final findings in a single, valid JSON object. Do not add any text outside of the JSON structure.

Example:
{
  "queries": ["initial query 1", "initial query 2", "follow-up question 1"],
  "searchResults": [ { "url": "...", "title": "..." } ],
  "learnings": [ { "insight": "...", "followUp": "..." } ],
  "completedQueries": ["initial query 1", "initial query 2", "follow-up question 1"],
  "phase": "follow-up",
  "runtimeConfig": {}
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
 tools: {
    webScraperTool,
    batchWebScraperTool,
    siteMapExtractorTool,
    linkExtractorTool,
    htmlToMarkdownTool,
    contentCleanerTool,
    evaluateResultTool,
    extractLearningsTool,
 },
 memory
});
