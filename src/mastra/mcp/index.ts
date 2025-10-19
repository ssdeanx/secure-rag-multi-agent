import { MCPServer } from '@mastra/mcp'
import { a2aCoordinatorAgent } from '../agents/a2aCoordinatorAgent'
import type {
  MCPServerResourceContent,
  MCPServerResources,
  Resource,
  ResourceTemplate,
} from "@mastra/mcp";
//import http from "http";
import { log } from '../config/logger';

/**
 * A2A Coordinator MCP Server
 * Represents an MCP server exposing the A2A Coordinator Agent for multi-agent orchestration.
 */
// Resources/resource templates will generally be dynamically fetched.
// FIXME: Use the actual resources needed for the MCP server.
// Configured here as placeholders. @Copilot
// Could be used for workflow definitions, agent metadata, etc. with proper URIs. using json, also agent cards. but this is just an example. we can expand later. with prompts.
const A2AResources: Resource[] = [
  { uri: "file://data/a2a-coordinator-mcp-server.txt", name: "Data File", mimeType: "text/plain" },
  { uri: "file://data/agent-card.json", name: "Another Data File", mimeType: "application/json" },
  { uri: "agents://a2aCoordinator/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "workflows://available", name: "Available Workflows", mimeType: "application/json" },
  { uri: "agents://available", name: "Available Agents", mimeType: "application/json" },
  { uri: "workflows/governed-rag-index/schema", name: "Workflow Schema", mimeType: "application/json" },
  { uri: "workflows/governed-rag-answer/schema", name: "Workflow Schema", mimeType: "application/json" },
  { uri: "workflows/research-workflow/schema", name: "Workflow Schema", mimeType: "application/json" },
  { uri: "workflows/generate-report-workflow/schema", name: "Workflow Schema", mimeType: "application/json" },
  { uri: "workflows/chat-workflow/schema", name: "Workflow Schema", mimeType: "application/json" },
  { uri: "workflows/content-generation/schema", name: "Workflow Schema", mimeType: "application/json" },
  { uri: "agents://retrieve/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://rerank/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://answerer/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://verifier/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://identity/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://policy/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://starter/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://research/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://researcher/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://assistant/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://report/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://copywriter/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://evaluation/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://learning/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://productRoadmap/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://editor/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://cryptoAnalysis/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://stockAnalysis/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "agents://marketEducation/metadata", name: "Agent Metadata", mimeType: "application/json" },
  { uri: "tools://metadata", name: "Tool Metadata", mimeType: "application/json" },
  { uri: "workflows://metadata", name: "Workflow Metadata", mimeType: "application/json" },
  { uri: "prompts://metadata", name: "Prompt Metadata", mimeType: "application/json" },
  { uri: "resources://metadata", name: "Resource Metadata", mimeType: "application/json" },
  { uri: "mcp://metadata", name: "MCP Metadata", mimeType: "application/json" },
  { uri: "protocols://a2a/metadata", name: "Protocol Metadata", mimeType: "application/json" },
  { uri: "agents://a2aCoordinator/protocols", name: "Agent Protocols", mimeType: "application/json" },
  { uri: "agents://a2aCoordinator/tools", name: "Agent Tools", mimeType: "application/json" },
  { uri: "agents://a2aCoordinator/prompts", name: "Agent Prompts", mimeType: "application/json" },
  { uri: "agents://a2aCoordinator/resources", name: "Agent Resources", mimeType: "application/json" },
  { uri: "agents://a2aCoordinator/workflows", name: "Agent Workflows", mimeType: "application/json" },
  { uri: "agents://a2aCoordinator/mcp", name: "Agent MCP", mimeType: "application/json" },
];
const A2AResourceContents: Record<string, MCPServerResourceContent> = {
  "file://data/a2a-coordinator-mcp-server.txt": { text: "This is the content of the a2a-coordinator-mcp-server.txt file. This file is used to store configuration or data specific to the A2A Coordinator MCP server. It can contain various settings, parameters, or initial data required for the server's operation." },
  "file://data/agent-card.json": { text: JSON.stringify({id: 'a2aCoordinator', name: a2aCoordinatorAgent.name, description: 'A2A Coordinator that orchestrates multiple specialized agents in parallel. Routes tasks dynamically, coordinates workflows, and synthesizes results using the A2A protocol.', capabilities: ['parallel-orchestration', 'agent-routing', 'workflow-coordination', 'result-synthesis', 'error-handling', 'task-monitoring', 'research-coordination', 'deep-analysis', 'data-synthesis', 'multi-step-workflows', 'agent-management', 'protocol-compliance', 'Crypto analysis', 'Stock analysis', 'Market education', 'Stock Trading', 'Cryptocurrency Trading', 'Financial Analysis',], availableAgents: ['retrieve', 'rerank', 'answerer', 'verifier', 'identity', 'policy', 'starter', 'research', 'researcher', 'assist', 'assistant', 'report', 'copywriter', 'evaluation', 'learning', 'productRoadmap', 'editor', 'cryptoAnalysis', 'stockAnalysis', 'marketEducation',], version: '1.0.0', protocol: 'A2A',}, null, 2)},
  "agents://a2aCoordinator/metadata": {
    text: JSON.stringify({
      id: 'a2aCoordinator',
      name: a2aCoordinatorAgent.name,
      description: 'A2A Coordinator that orchestrates multiple specialized agents in parallel. Routes tasks dynamically, coordinates workflows, and synthesizes results using the A2A protocol.',
      capabilities: [
        'parallel-orchestration',
        'agent-routing',
        'workflow-coordination',
        'result-synthesis',
        'error-handling',
        'task-monitoring',
        'research-coordination',
        'deep-analysis',
        'data-synthesis',
        'multi-step-workflows',
        'agent-management',
        'protocol-compliance',
        'Crypto analysis',
        'Stock analysis',
        'Market education',
        'Stock Trading',
        'Cryptocurrency Trading',
        'Financial Analysis',
      ],
      availableAgents: [
        'retrieve',
        'rerank',
        'answerer',
        'verifier',
        'identity',
        'policy',
        'starter',
        'research',
        'researcher',
        'assist',
        'assistant',
        'report',
        'copywriter',
        'evaluation',
        'learning',
        'productRoadmap',
        'editor',
        'cryptoAnalysis',
        'stockAnalysis',
        'marketEducation',
      ],
      version: '1.0.0',
      protocol: 'A2A',
    }, null, 2),
  },
  "workflows://available": {
    text: JSON.stringify(
      {
        workflows: [
          {
            id: 'governed-rag-index',
            name: 'Governed RAG Index',
            description: 'Index documents with governance controls',
          },
          {
            id: 'governed-rag-answer',
            name: 'Governed RAG Answer',
            description: 'Answer queries with access controls and verification',
          },
          {
            id: 'research-workflow',
            name: 'Research Workflow',
            description: 'Comprehensive research coordination',
          },
          {
            id: 'generate-report-workflow',
            name: 'Generate Report',
            description: 'Report generation and formatting',
          },
          {
            id: 'chat-workflow',
            name: 'Chat Workflow',
            description: 'Multi-turn chat coordination',
          },
          {
            id: 'content-generation',
            name: 'Content Generation',
            description: 'Content creation workflow',
          },
          {
            id: 'financial-analysis-workflow',
            name: 'Financial Analysis',
            description: 'Financial data analysis workflow',
          },
          {
            id: 'financial-analysis-workflow-v2',
            name: 'Financial Analysis V2',
            description: 'Enhanced financial analysis',
          },
          {
            id: 'financial-analysis-workflow-v3',
            name: 'Financial Analysis V3',
            description: 'Latest financial analysis',
          },
        ],
      },
      null,
      2
    ),
  },
  "agents://available": {
    text: JSON.stringify(
      {
        agents: [
          { id: 'retrieve', name: 'Retrieve', description: 'Document retrieval from knowledge base' },
          { id: 'rerank', name: 'Rerank', description: 'Result ranking and prioritization' },
          { id: 'answerer', name: 'Answerer', description: 'Question answering with governance' },
          { id: 'verifier', name: 'Verifier', description: 'Content verification and validation' },
          { id: 'identity', name: 'Identity', description: 'Identity and user management' },
          { id: 'policy', name: 'Policy', description: 'Policy enforcement and governance' },
          { id: 'starter', name: 'Starter', description: 'Getting started and onboarding' },
          { id: 'research', name: 'Research', description: 'General research tasks' },
          { id: 'researcher', name: 'Researcher', description: 'Research coordination' },
          { id: 'assistant', name: 'Assistant', description: 'General assistance' },
          { id: 'report', name: 'Report', description: 'Report generation and formatting' },
          { id: 'copywriter', name: 'Copywriter', description: 'Content creation and writing' },
          { id: 'research', name: 'Research', description: 'General research tasks' },
          { id: 'researcher', name: 'Researcher', description: 'Research coordination' },
          { id: 'assistant', name: 'Assistant', description: 'General assistance' },
          { id: 'report', name: 'Report', description: 'Report generation and formatting' },
          { id: 'copywriter', name: 'Copywriter', description: 'Content creation and writing' },
          { id: 'evaluation', name: 'Evaluation', description: 'Quality assessment and scoring' },
          { id: 'learning', name: 'Learning', description: 'Knowledge extraction and learning' },
          { id: 'productRoadmap', name: 'Product Roadmap', description: 'Product planning and roadmapping' },
          { id: 'editor', name: 'Editor', description: 'Content editing and refinement' },
          { id: 'cryptoAnalysis', name: 'Crypto Analysis', description: 'Cryptocurrency analysis' },
          { id: 'stockAnalysis', name: 'Stock Analysis', description: 'Stock market analysis' },
          { id: 'marketEducation', name: 'Market Education', description: 'Market education and training' },
        ],
      },
      null,
      2
    ),
  },
  "tools://available": { text: "Tool Metadata content" },
  "workflows/governed-rag-index/schema": { text: "Workflow Schema content" },
  "workflows/governed-rag-answer/schema": { text: "Workflow Schema content" },
  "workflows/research-workflow/schema": { text: "Workflow Schema content" },
  "workflows/generate-report-workflow/schema": { text: "Workflow Schema content" },
  "workflows/chat-workflow/schema": { text: "Workflow Schema content" },
  "workflows/content-generation/schema": { text: "Workflow Schema content" },
  "agents://retrieve/metadata": { text: "Retrieve Agent Metadata content" },
  "agents://rerank/metadata": { text: "Rerank Agent Metadata content" },
  "agents://answerer/metadata": { text: "Answerer Agent Metadata content" },
  "agents://verifier/metadata": { text: "Verifier Agent Metadata content" },
  "agents://identity/metadata": { text: "Identity Agent Metadata content" },
  "agents://policy/metadata": { text: "Policy Agent Metadata content" },
  "agents://starter/metadata": { text: "Starter Agent Metadata content" },
  "agents://research/metadata": { text: "Research Agent Metadata content" },
  "agents://researcher/metadata": { text: "Researcher Agent Metadata content" },
  "agents://assistant/metadata": { text: "Assistant Agent Metadata content" },
  "agents://report/metadata": { text: "Report Agent Metadata content" },
  "agents://copywriter/metadata": { text: "Copywriter Agent Metadata content" },
  "agents://evaluation/metadata": { text: "Evaluation Agent Metadata content" },
  "agents://learning/metadata": { text: "Learning Agent Metadata content" },
  "agents://productRoadmap/metadata": { text: "Product Roadmap Agent Metadata content" },
  "agents://editor/metadata": { text: "Editor Agent Metadata content" },
  "agents://cryptoAnalysis/metadata": { text: "Crypto Analysis Agent Metadata content" },
  "agents://stockAnalysis/metadata": { text: "Stock Analysis Agent Metadata content" },
  "agents://marketEducation/metadata": { text: "Market Education Agent Metadata content" },
  "agents://stockTrading/metadata": { text: "Stock Trading Agent Metadata content" },
  "agents://cryptoTrading/metadata": { text: "Crypto Trading Agent Metadata content" },
  "agents://financialAnalysis/metadata": { text: "Financial Analysis Agent Metadata content" },
  "tools://metadata": { text: "Tool Metadata content" },
  "tools://web-scraper/metadata": { text: "Web Scraper Tool Metadata content" },
  "tools://data-analyzer/metadata": { text: "Data Analyzer Tool Metadata content" },
  "workflows://metadata": { text: "Workflow Metadata content" },
  "prompts://metadata": { text: "Prompt Metadata content" },
  "resources://metadata": { text: "Resource Metadata content" },
  "mcp://metadata": { text: "MCP Metadata content" },
  "protocols://a2a/metadata": { text: "A2A Protocol Metadata content" },
  "agents://a2aCoordinator/protocols": { text: "A2A Coordinator Agent Protocols content" },
};
const myResourceTemplates: ResourceTemplate[] = [
  {
    uriTemplate: "file://data/{id}.txt",
    name: "Data File",
    description: "A file containing data.",
    mimeType: "text/plain",
  },
  {
    uriTemplate: "file://data/{id}.json",
    name: "Data JSON File",
    description: "A JSON file containing data.",
    mimeType: "application/json",
  },
  {
    uriTemplate: "agents://{agentId}/metadata",
    name: "Agent Metadata",
    description: "Metadata for a specific agent",
    mimeType: "application/json",
  },
  {
    uriTemplate: "workflows/{workflowId}/schema",
    name: "Workflow Schema",
    description: "Input/output schema for a workflow",
    mimeType: "application/json",
  },
  {
    uriTemplate: "tools/{toolId}/schema",
    name: "Tool Schema",
    description: "Input/output schema for a tool",
    mimeType: "application/json",
  },
  {
    uriTemplate: "prompts/{promptId}/schema",
    name: "Prompt Schema",
    description: "Input/output schema for a prompt",
    mimeType: "application/json",
  },
  {
    uriTemplate: "resources/{resourceId}/schema",
    name: "Resource Schema",
    description: "Input/output schema for a resource",
    mimeType: "application/json",
  },
  {
    uriTemplate: "mcp/{mcpId}/schema",
    name: "MCP Schema",
    description: "Input/output schema for an MCP",
    mimeType: "application/json",
  },
  {
    uriTemplate: "protocols/{protocolId}/schema",
    name: "Protocol Schema",
    description: "Input/output schema for a protocol",
    mimeType: "application/json",
  },
  {
    uriTemplate: "agents/{agentId}/schema",
    name: "Agent Schema",
    description: "Input/output schema for an agent",
    mimeType: "application/json",
  },
  {
    uriTemplate: "tools/{toolId}/schema",
    name: "Tool Schema",
    description: "Input/output schema for a tool",
    mimeType: "application/json",
  }
];

const myResourceHandlers: MCPServerResources = {
  listResources: async () => A2AResources,
  getResourceContent: async ({ uri }) => {
    if (Object.prototype.hasOwnProperty.call(A2AResourceContents, uri)) {
      return A2AResourceContents[uri];
    }
    throw new Error(`Resource content not found for ${uri}`);
  },
  resourceTemplates: async () => myResourceTemplates,
};
/**
 * A2A Coordinator MCP Server
 *
 * Exposes the a2aCoordinatorAgent as an MCP server with:
 * - Agent card for A2A discovery
 * - Prompts for common coordination tasks
 * - Resources for workflow and agent metadata
 */

// Prompts for common coordination workflows
const coordinationPrompts = [
  {
    name: 'parallel-financial-analysis',
    description: 'Run parallel financial analysis across crypto and stock agents',
    version: '1.0.0',
  },
  {
    name: 'content-pipeline',
    description: 'Content creation pipeline: research → write → edit → evaluate',
    version: '1.0.0',
  },
  {
    name: 'rag-query',
    description: 'Execute RAG query: retrieve → rerank → answer → verify',
    version: '1.0.0',
  },
  {
    name: 'multi-agent-research',
    description: 'Coordinate multi-agent research with knowledge extraction',
    version: '1.0.0',
  },
]

// Resources for agent and workflow metadata
const agentResources = [
  {
    uri: 'agents://a2aCoordinator/metadata',
    name: 'A2A Coordinator Agent Metadata',
    mimeType: 'application/json',
    description: 'Metadata about the A2A Coordinator Agent including capabilities',
  },
  {
    uri: 'workflows://available',
    name: 'Available Workflows',
    mimeType: 'application/json',
    description: 'List of all available workflows for coordination',
  },
  {
    uri: 'agents://available',
    name: 'Available Agents',
    mimeType: 'application/json',
    description: 'List of all available agents for coordination',
  },
]
//const httpServer = http.createServer(async (req, res) => {
//  await a2aCoordinatorMcpServer.startHTTP({
//    url: new URL(req.url ?? '', `http://localhost:6969`),
//    httpPath: `/mcp`,
//    req,
//    res,
//    options: {
//      sessionIdGenerator:  () => `session-${Date.now()}`,
//      enableJsonResponse: true,
//      allowedHosts: ['*'],
//      allowedOrigins: ['http://localhost:3000', 'http://localhost:4111', '*'],
//    },
//  });
//});

//httpServer.listen(6969, () => {
//  log.info(`HTTP server listening on http://localhost:6969`);
//});

export const a2aCoordinatorMcpServer = new MCPServer({
  id: 'a2a-coordinator-mcp',
  name: 'A2A Coordinator MCP Server',
  version: '1.0.0',
  description: 'Exposes the A2A Coordinator Agent for multi-agent orchestration via MCP and A2A protocols',
  repository: {url: 'https://github.com/ssdeanx/secure-rag-multi-agent', source: 'github', id: 'secure-rag-multi-agent'},
  releaseDate: '2025-10-18',
  isLatest: true,
  packageCanonical: 'npm',
  packages: [],
//  remotes: [{url:'http://localhost:6969', transport_type: 'http'}],
  tools: {}, // Tools are auto-generated from agents

  agents: {
    a2aCoordinator: a2aCoordinatorAgent,
  },
  resources: myResourceHandlers,
  prompts: {
    listPrompts: async () => coordinationPrompts,
    getPromptMessages: async ({ name, version, args }) => {
      let prompt = coordinationPrompts.find((p) => p.name === name && p.version === version)

      prompt ??= coordinationPrompts.find((p) => p.name === name);

      if (!prompt) {
        throw new Error(`Prompt "${name}" not found`)
      }

      const promptMessages: Record<
        string,
        Array<{
          role: 'user' | 'assistant'
          content: { type: 'text'; text: string }
        }>
      > = {
        'parallel-financial-analysis': [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Execute parallel financial analysis: Analyze ${args?.ticker ?? 'AAPL'} stock and Bitcoin cryptocurrency in parallel, then synthesize results into a comprehensive report.`,
            },
          },
        ],
        'content-pipeline': [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Execute content pipeline for topic "${args?.topic ?? 'AI Agents'}": Research the topic, create engaging content, edit for quality, and evaluate completeness.`,
            },
          },
        ],
        'rag-query': [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Execute RAG query: "${args?.query ?? 'What are agent capabilities?'}". Retrieve documents, rerank by relevance, generate answer, and verify accuracy.`,
            },
          },
        ],
        'multi-agent-research': [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Coordinate multi-agent research on "${args?.topic ?? 'emerging technologies'}": Research comprehensively, extract key learnings, and generate a detailed report.`,
            },
          },
        ],
      }

      // Use hasOwnProperty to check presence because the index signature types
      // promptMessages[name] as an array (which would be truthy), so a direct
      // boolean check is unreliable for existence.
      if (Object.prototype.hasOwnProperty.call(promptMessages, name)) {
        return promptMessages[name]
      }

      return [
        {
          role: 'user',
          content: { type: 'text', text: `Execute coordination task: ${args?.task ?? 'coordinate agents'}` },
        },
      ]
    },
  },
})
