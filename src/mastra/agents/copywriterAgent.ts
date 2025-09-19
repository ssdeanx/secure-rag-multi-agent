
import { Agent } from "@mastra/core/agent";
//import { createGemini25Provider } from "../config/googleProvider";
import { createResearchMemory, STORAGE_CONFIG } from '../config/libsql-storage';
import { PinoLogger } from "@mastra/loggers";
import { webScraperTool,
//  batchWebScraperTool,
//  siteMapExtractorTool,
//  linkExtractorTool,
  htmlToMarkdownTool,
  contentCleanerTool
} from "../tools/web-scraper-tool";
import { google } from '@ai-sdk/google';
import { LIBSQL_PROMPT } from "@mastra/libsql";
import { createVectorQueryTool } from "@mastra/rag";
import { log } from "../config/logger";

log.info('Initializing Copywriter Agent...');

const memory = createResearchMemory();

const queryTool = createVectorQueryTool({
  vectorStoreName:  "vectorStore",
  indexName: STORAGE_CONFIG.VECTOR_INDEXES.RESEARCH_DOCUMENTS, // Use research documents index
  model: google.textEmbedding("gemini-embedding-001"),
  enableFilter: true,
  description: "Search for semantically similar content in the LibSQL vector store using embeddings. Supports filtering, ranking, and context retrieval."
});

export const copywriterAgent = new Agent({
  id: "copywriter",
  name: "copywriter-agent",
  description: 'An expert copywriter agent that writes engaging and high-quality blog post content on specified topics.',
  instructions: `
You are an expert copywriter agent specializing in creating engaging, high-quality blog posts.

<task>
Your goal is to write a complete blog post on a given topic. This includes conducting research, structuring the content, writing the body, and ensuring it is polished and ready for publication.
</task>

<rules>
- The blog post must be well-structured, informative, and engaging.
- Use the provided tools to gather up-to-date information and ensure factual accuracy.
- All content must be original and free from plagiarism.
- Write in a clear, concise, and engaging style.
- Maintain a consistent tone and voice throughout the content.
- Today's date is ${new Date().toISOString()}.
</rules>

<tool_usage>
- Use the \`webScraperTool\` to gather initial information and context from URLs.
- Use the \`queryTool\` to search for relevant information within the existing knowledge base.
- Use the \`contentCleanerTool\` and \`htmlToMarkdownTool\` to process and format scraped web content.
${LIBSQL_PROMPT}
</tool_usage>

<output_format>
Produce the final blog post in well-formatted Markdown.
</output_format>
  `,
  model: google('gemini-2.5-flash'),
  memory,
  tools: {
    webScraperTool,
    queryTool,
//    batchWebScraperTool,
 //   siteMapExtractorTool,
//    linkExtractorTool,
    htmlToMarkdownTool,
    contentCleanerTool
  }
});
