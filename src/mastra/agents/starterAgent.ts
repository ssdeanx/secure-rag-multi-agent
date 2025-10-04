import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { starterOutputSchema } from "../schemas/agent-schemas";
import { log } from "../config/logger";
import { starterAgentTool } from '../tools/starter-agent-tool';
import gemini from '../config/gemini-cli';
import { editorTool } from '../tools/editor-agent-tool';
import { weatherTool } from '../tools/weather-tool';
import { BatchPartsProcessor, UnicodeNormalizer } from '@mastra/core/processors';
import { CompletenessMetric, ContentSimilarityMetric, KeywordCoverageMetric, TextualDifferenceMetric, ToneConsistencyMetric } from '@mastra/evals/nlp';

log.info('Initializing Starter Agent...');

/**
 * Example starter agent for Cedar-OS + Mastra applications
 *
 * This agent serves as a basic template that you can customize
 * for your specific use case. Update the instructions below to
 * define your agent's behavior and capabilities.
 */
export const starterAgent = new Agent({
  id: 'starter',
  name: 'Starter Agent',
  description: 'A basic starter agent that assists users with general questions and tasks.',
  instructions: `
<role>
You are a helpful AI assistant. Your primary function is to assist users with their questions and tasks.
</role>

<primary_function>
Your primary function is to help users navigate the product roadmap, understand feature priorities, and manage feature requests.
</primary_function>

<response_guidelines>
When responding:
- Be helpful, accurate, and concise
- Format your responses in a clear, readable way
- Use the tools available to you when appropriate
</response_guidelines>

<response_format>
You will respond in a JSON format with the following fields:
{
  "content": "The response to the user's question or task"
}
</response_format>
  `,
  model: gemini('gemini-2.5-pro', {
  temperature: 0.7, // Controls randomness (0-2)
  maxOutputTokens: 65536, // Maximum output tokens (defaults to 65536)
  topP: 0.95, // Nucleus sampling threshold
  }),
  tools: {weatherTool},

  scorers: {},
  workflows: {},
  evals: {
      contentSimilarity: new ContentSimilarityMetric({ ignoreCase: true, ignoreWhitespace: true }),
      completeness: new CompletenessMetric(),
      textualDifference: new TextualDifferenceMetric(),
      keywordCoverage: new KeywordCoverageMetric(), // Keywords will be provided at runtime for evaluation
      toneConsistency: new ToneConsistencyMetric(),
  },
  inputProcessors: [
      new UnicodeNormalizer({
        stripControlChars: true,
        collapseWhitespace: true,
        preserveEmojis: true,
        trim: true,
      }),
  ],
});
export { starterOutputSchema };