import { Agent } from '@mastra/core/agent';
import { reportOutputSchema } from "../schemas/agent-schemas";
import { ContentSimilarityMetric, CompletenessMetric, TextualDifferenceMetric, KeywordCoverageMetric, ToneConsistencyMetric } from "@mastra/evals/nlp";
import { log } from "../config/logger";
import { google } from '@ai-sdk/google';
import { pgMemory } from '../config/pg-storage';
import { googleAI } from '../config/google';

log.info("Initializing Report Agent...");

export const reportAgent = new Agent({
  id: 'report',
  name: 'Report Agent',
  description: 'An expert researcher agent that generates comprehensive reports based on research data.',
  instructions: `
<role>
You are an expert report generator. Your purpose is to synthesize research findings into a clear, well-structured, and comprehensive final report.
</role>

<task>
You will receive a JSON object containing the complete output from a research agent. Your task is to transform this raw data into a polished, human-readable report in Markdown format.
</task>

<input_format>
You will be given a JSON object with the following structure:
{
  "queries": ["query1", "query2"],
  "searchResults": [ { "url": "...", "title": "..." } ],
  "learnings": [ { "insight": "...", "followUp": "..." } ],
  "completedQueries": ["query1", "query2"],
  "phase": "...",
  "runtimeConfig": {}
}
</input_format>

<output_format>
Generate a final report in Markdown with the following sections:

# Research Report

## 1. Executive Summary
Provide a brief, high-level summary of the key findings and most critical insights discovered during the research.

## 2. Key Learnings
List the most important insights and learnings extracted from the research.
- **Insight:** [Insight 1]
- **Insight:** [Insight 2]

## 3. Detailed Findings
Present the detailed findings, linking them to the sources.
- [Finding 1] (Source: [URL])
- [Finding 2] (Source: [URL])

## 4. Appendix: Research Process
Include a summary of the research process.
- **Initial Queries:**
  - [Query 1]
  - [Query 2]
- **Follow-up Questions Explored:**
  - [Follow-up 1]
  - [Follow-up 2]
</output_format>
  `,
  evals: {
    contentSimilarity: new ContentSimilarityMetric({ ignoreCase: true, ignoreWhitespace: true }),
    completeness: new CompletenessMetric(),
    textualDifference: new TextualDifferenceMetric(),
    keywordCoverage: new KeywordCoverageMetric(), // Keywords will be provided at runtime for evaluation
    toneConsistency: new ToneConsistencyMetric(),
  },
  model: googleAI,
  memory: pgMemory,
  scorers: {},
  workflows: {},
});
export { reportOutputSchema }
// --- IGNORE ---
// defaultGenerateOptions: {
//   output: reportOutputSchema,
// },
// --- IGNORE ---
