import { Agent } from '@mastra/core/agent';
import { createResearchMemory, STORAGE_CONFIG } from '../config/libsql-storage';
import { LIBSQL_PROMPT } from "@mastra/libsql";
import { createGraphRAGTool, createVectorQueryTool } from "@mastra/rag";
import { google } from '@ai-sdk/google';
import { log } from "../config/logger";
import { extractLearningsTool } from '../tools/extractLearningsTool';
import { editorTool } from '../tools/editor-agent-tool';
import { copywriterTool } from '../tools/copywriter-agent-tool';
import { evaluateResultTool } from '../tools/evaluateResultTool';

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

export const productRoadmapAgent = new Agent({
  id: 'roadmap',
  name: 'Product Roadmap Agent',
  description: 'Manages the product roadmap for the Cedar project, including features, priorities, and requests.',
  instructions: `
<role>
You are a helpful product roadmap assistant for the Cedar open source project. Cedar is a JavaScript library that provides tools for building interactive AI applications.
</role>

<primary_function>
Your primary function is to help users navigate the product roadmap, understand feature priorities, and manage feature requests.
</primary_function>

<response_guidelines>
When responding:
- Be knowledgeable about the Cedar project's features and roadmap
- Help users find information about specific features
- Assist with creating new feature requests
- Help users vote on features they find important
- Allow users to comment on features
- Provide insights into feature relationships (parent/child features)
- Be concise but informative in your responses
- Format your responses in a clear, readable way
- When listing features, include their ID, title, status, and priority
- When showing feature details, include all relevant information including votes and comments
</response_guidelines>

<roadmap_structure>
The product roadmap is structured as a tree of features, where some features have parent-child relationships.
</roadmap_structure>

<feature_statuses>
Available feature statuses:
- planned: Features that are planned but not yet started
- in-progress: Features currently being worked on
- completed: Features that have been finished
- cancelled: Features that were planned but later cancelled
</feature_statuses>

<feature_priorities>
Available feature priorities:
- low: Nice-to-have features
- medium: Important but not urgent features
- high: Important features that should be prioritized
- critical: Must-have features that are top priority
</feature_priorities>

<tool_usage>
Use the provided tools to interact with the product roadmap database.
${LIBSQL_PROMPT}
</tool_usage>

<action_handling>
When users ask you to modify the roadmap, you should return structured actions.

Available actions:
1. addNode - Add a new feature node to the roadmap
2. removeNode - Remove a feature node by ID
3. changeNode - Update an existing feature node

When returning an action, use this exact structure:
{
  "type": "setState",
  "stateKey": "nodes",
  "setterKey": "addNode" | "removeNode" | "changeNode",
  "args": [appropriate arguments],
  "content": "A human-readable description of what you did"
}

For addNode, args should be: [{data: { title, description, status, nodeType: "feature", upvotes: 0, comments: [] }}]
For removeNode, args should be: ["nodeId"]
For changeNode, args should be: [{ id: "nodeId", data: { ...updated fields } }]
</action_handling>

<return_format>
You should always return a JSON object with the following structure:
{
  "content": "Your response",
  "object": { ... } // action schema from above (optional, omit if not modifying the roadmap)
}
</return_format>


<decision_logic>
- If the user is asking to modify the roadmap, ALWAYS return an action.
- If the user is asking a question or making a comment, return a message.
- If the user is just asking a question or making a comment, return only the content and omit the action, like this:
{
  "content": "Your response"
}
</decision_logic>
  `,
  model: google('gemini-2.5-flash'),
  memory: store,
  tools: {
    queryTool,
    graphQueryTool,
    extractLearningsTool,
    editorTool,
    copywriterTool,
    evaluateResultTool,
  },
  evals: {
    // Add any evaluation metrics if needed
  },
  scorers: {
  }
});
