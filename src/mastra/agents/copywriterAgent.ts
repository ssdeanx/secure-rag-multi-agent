
import { Agent } from "@mastra/core/agent";
//import { createGemini25Provider } from "../config/googleProvider";
import { createResearchMemory, STORAGE_CONFIG } from '../config/libsql-storage';
import { webScraperTool,
//  batchWebScraperTool,
//  siteMapExtractorTool,
//  linkExtractorTool,
  htmlToMarkdownTool,
  contentCleanerTool
} from "../tools/web-scraper-tool";
import { google } from '@ai-sdk/google';
import { LIBSQL_PROMPT } from "@mastra/libsql";
import { createGraphRAGTool, createVectorQueryTool } from "@mastra/rag";
import { log } from "../config/logger";

log.info('Initializing Copywriter Agent...');

const store = createResearchMemory();

const queryTool = createVectorQueryTool({
  vectorStoreName:  "vectorStore",
  indexName: STORAGE_CONFIG.VECTOR_INDEXES.RESEARCH_DOCUMENTS, // Use research documents index
  model: google.textEmbedding("gemini-embedding-001"),
  enableFilter: true,
  description: "Search for semantically similar content in the LibSQL vector store using embeddings. Supports filtering, ranking, and context retrieval."
});

const graphQueryTool = createGraphRAGTool({
  vectorStoreName:  "vectorStore",
  indexName: STORAGE_CONFIG.VECTOR_INDEXES.RESEARCH_DOCUMENTS, // Use research documents index
  model: google.textEmbedding("gemini-embedding-001"),
  graphOptions: {
    threshold: 0.7,
    dimension: 3072, // Default for gemini-embedding-001
    randomWalkSteps: 15,
    restartProb: 0.3
  },
  enableFilter: true,
  description: "Graph-based search for semantically similar content in the LibSQL vector store using embeddings. Supports filtering, ranking, and context retrieval."
});

export const copywriterAgent = new Agent({
  id: "copywriter",
  name: "copywriter-agent",
  description: 'An expert copywriter agent that creates engaging, high-quality content across multiple formats including blog posts, marketing copy, social media content, technical writing, and business communications.',
  instructions: `
You are an expert copywriter agent specializing in creating engaging, high-quality content across multiple formats and purposes.

<task>
Your goal is to create compelling content based on the specified type and requirements. This includes conducting research, structuring the content appropriately, writing the body, and ensuring it is polished and ready for its intended purpose.
</task>

<content_types>
- **blog**: Well-structured, informative blog posts with engaging narratives
- **marketing**: Persuasive copy for campaigns, product descriptions, landing pages
- **social**: Concise, engaging content for social media platforms
- **technical**: Clear, accurate documentation, tutorials, and technical explanations
- **business**: Professional communications, emails, reports, and presentations
- **creative**: Storytelling, articles, and narrative-driven content
- **general**: Versatile content for various purposes and audiences
</content_types>

<content_approaches>
For each content type, adapt your approach:

**Blog Content:**
- Engaging hooks and compelling narratives
- Well-structured with clear headings and sections
- SEO-friendly while maintaining readability
- Call-to-action elements

**Marketing Copy:**
- Persuasive language focused on benefits
- Clear value propositions
- Compelling calls-to-action
- Target audience awareness

**Social Media Content:**
- Concise and attention-grabbing
- Platform-appropriate formatting
- Hashtags and engagement elements
- Shareable and relatable

**Technical Writing:**
- Clear, precise explanations
- Step-by-step instructions where applicable
- Accurate terminology and concepts
- Accessible to target audience level

**Business Communications:**
- Professional and polished tone
- Clear objectives and outcomes
- Appropriate formality level
- Action-oriented language

**Creative Content:**
- Engaging storytelling elements
- Vivid and descriptive language
- Emotional resonance
- Narrative flow
</content_approaches>

<rules>
- Adapt your writing style and structure based on the content type
- Use the provided tools to gather up-to-date information and ensure factual accuracy
- All content must be original and free from plagiarism
- Write in a clear, concise, and engaging style appropriate for the content type
- Maintain a consistent tone and voice throughout the content
- Today's date is ${new Date().toISOString()}
- Consider the target audience and purpose when crafting content
</rules>

<tool_usage>
- Use the \`webScraperTool\` to gather initial information and context from URLs
- Use the \`queryTool\` to search for relevant information within the existing knowledge base
- Use the \`contentCleanerTool\` and \`htmlToMarkdownTool\` to process and format scraped web content
${LIBSQL_PROMPT}
</tool_usage>

<output_format>
Produce the final content in well-formatted Markdown with appropriate structure for the content type.
Include relevant metadata such as title, summary, and key points when applicable.
</output_format>
  `,
  model: google('gemini-2.5-flash'),
  memory: store,
  tools: {
    webScraperTool,
    queryTool,
    graphQueryTool,
//    batchWebScraperTool,
 //   siteMapExtractorTool,
//    linkExtractorTool,
    htmlToMarkdownTool,
    contentCleanerTool,
  },
  scorers: {},
  workflows: {},
});
