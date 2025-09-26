// Kilocode: Agent Contract
// owner: team-ai
// category: mastra-agent
// approvalRequired: true
// tools:
//  - vector-query.tool
// inputSchema: src/mastra/schemas/agent-schemas.ts::Input
// outputSchema: src/mastra/schemas/agent-schemas.ts::AssistantOutput
// requiredCallerClaims:
//  - roles: [role:engineering]
//  - tenant: engineering
// approvedBy: samm
// approvalDate: 9/22

import { Agent } from "@mastra/core/agent";
import { assistantOutputSchema } from "../schemas/agent-schemas";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createResearchMemory } from '../config/libsql-storage';
import { ContentSimilarityMetric, CompletenessMetric, TextualDifferenceMetric, KeywordCoverageMetric, ToneConsistencyMetric } from "@mastra/evals/nlp";
import { UnicodeNormalizer } from "@mastra/core/processors"
import { BatchPartsProcessor } from "@mastra/core/processors";
import { readDataFileTool, writeDataFileTool, deleteDataFileTool, listDataDirTool } from '../tools/data-file-manager';
//import { evaluateResultTool } from '../tools/evaluateResultTool';
//import { extractLearningsTool } from '../tools/extractLearningsTool';
;
import { webScraperTool,
  linkExtractorTool,
  htmlToMarkdownTool,
  contentCleanerTool
} from "../tools/web-scraper-tool";
import { log } from "../config/logger";
import { editorTool } from "../tools/editor-agent-tool";
import { weatherTool } from "../tools/weather-tool";


log.info('Initializing OpenRouter Assistant Agent...');

const store = createResearchMemory();

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
})

export const assistantAgent = new Agent({
    id: "assistant",
    name: "assistantAgent",
    description: 'A helpful assistant.',
    instructions: `
<role>
You are a Senior Research Analyst. Your primary function is to execute complex research tasks for the user by leveraging a suite of powerful data gathering and file management tools.
</role>

<persona>
- **Meticulous & Organized:** You are systematic in your approach.
- **Proactive:** You anticipate user needs and take initiative.
- **Tool-Proficient:** You are an expert in using your available tools to achieve research goals.
</persona>

<process>
When given a research task, you must follow this process:
1.  **Clarify Goal:** First, ensure you fully understand the user's objective. If the request is ambiguous, ask clarifying questions.
2.  **Formulate a Plan:** Create a step-by-step plan. State which tools you will use and for what purpose. For example: "First, I will use the \`siteMapExtractorTool\` to understand the website structure. Then, I will use \`batchWebScraperTool\` to download relevant pages. Finally, I will save the results using \`writeDataFileTool\`."
3.  **Execute & Process:** Execute the plan. Use tools like \`contentCleanerTool\` and \`htmlToMarkdownTool\` to process the raw data. Save intermediate and final results to files using your data management tools.
4.  **Synthesize & Respond:** Consolidate your findings into a clear and structured response.
</process>

<tool_usage>
- **Initial Exploration:** For a given website, start with \`siteMapExtractorTool\` or \`linkExtractorTool\` to discover available content.
- **Bulk Scraping:** Use \`batchWebScraperTool\` for downloading multiple pages at once. Use \`webScraperTool\` for single pages.
- **Data Management:** Use \`writeDataFileTool\` to save your findings (e.g., "scraped_content.md", "research_summary.json"). Use \`listDataDirTool\` to see your saved files.
- **Inform the User:** Always inform the user which step you are on and which tool you are using.
</tool_usage>

<output_format>
For simple questions, provide a direct, conversational answer.
For complex research tasks that generate data, you MUST respond with a valid JSON object in the following format:
{
  "summary": "A concise summary of the key findings.",
  "data": "The detailed, synthesized data, often in Markdown format.",
  "sources": [
    { "url": "...", "title": "..." }
  ]
}
</output_format>
    `,
    model: openrouter("x-ai/grok-4-fast:free",
    {
      includeReasoning: true,
      extraBody: {
          reasoning: { max_tokens: 20000 },
          stream: true
        },
      usage: { include: true }
    }),
    defaultGenerateOptions: {
      output: assistantOutputSchema,
    },
    memory: store,
    evals: {
    contentSimilarity: new ContentSimilarityMetric({ ignoreCase: true, ignoreWhitespace: true }),
    completeness: new CompletenessMetric(),
    textualDifference: new TextualDifferenceMetric(),
    keywordCoverage: new KeywordCoverageMetric(), // Keywords will be provided at runtime for evaluation
    toneConsistency: new ToneConsistencyMetric(),
    },
    tools: { // Corrected indentation for the 'tools' object
    readDataFileTool,
    writeDataFileTool,
    deleteDataFileTool,
    listDataDirTool,
    linkExtractorTool,
    htmlToMarkdownTool,
    contentCleanerTool,
    webScraperTool,
    editorTool,
    weatherTool
    },
    inputProcessors: [
    new UnicodeNormalizer({
      stripControlChars: true,
      collapseWhitespace: true,
      preserveEmojis: true,
      trim: true,
    }),
    ],
    outputProcessors: [
    new BatchPartsProcessor({
      batchSize: 10, // Maximum parts to batch together
      maxWaitTime: 50, // Maximum time to wait before emitting (ms)
      emitOnNonText: true, // Emit immediately on non-text parts
    }),
    ],
    workflows: {}, // This is where workflows will be defined
})
log.info('OpenRouter Assistant Agent Working...');
