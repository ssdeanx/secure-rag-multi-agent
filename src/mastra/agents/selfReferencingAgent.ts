import { Agent } from "@mastra/core/agent";
import { selfReferencingOutputSchema } from "../schemas/agent-schemas";
import type { MCPServerResourceContent, Resource } from "@mastra/mcp";
import { MCPServer } from "@mastra/mcp";
import { MCPClient } from "@mastra/mcp";
import { google } from '@ai-sdk/google';
import { assistantAgent } from "./assistant";
import { starterAgentTool } from "../tools/starter-agent-tool";
import { contentCleanerTool, htmlToMarkdownTool, linkExtractorTool, siteMapExtractorTool, webScraperTool } from "../tools/web-scraper-tool";
import { editorTool } from "../tools/editor-agent-tool";
import { weatherTool } from "../tools/weather-tool";
import { starterAgent } from "./starterAgent";
import { evaluateResultTool } from "../tools/evaluateResultTool";
import { extractLearningsTool } from "../tools/extractLearningsTool";
import { copywriterTool } from "../tools/copywriter-agent-tool";

const selfReferencingAgent = new Agent({
  id: 'selfReferencing',
  name: "selfReferencingAgent",
  description: "An agent that can use tools from an http MCP server",
  instructions: "You can use remote calculation tools.",
  model: google("gemini-2.5-flash"),
  tools: async () => {
    // Tools resolve when needed, not during initialization
    const mcpClient = new MCPClient({
      servers: {
        myServer: {
          url: new URL("http://localhost:4111/api/mcp/mcpServer/mcp"),
        },
      },
    });
    return await mcpClient.getTools();

  },
  workflows: {},
  scorers: {},
});

// This works because tools resolve after server startup
export const mcp = new MCPServer({
  id: "mcpServer",
  description: "A self-referencing MCP server that hosts an agent capable of using tools from another MCP server.",
  name: "My MCP Server",
  version: "1.0.0",

  agents: {
    selfReferencingAgent, assistantAgent, starterAgent,
  },
  tools: {
    // The tools here are the ones that the MCP server itself provides,
    // not the tools that `myAgent` uses.
    // `starterAgentTool` is an example of a tool that the MCP server could provide.
    starterAgentTool,
    siteMapExtractorTool,
    linkExtractorTool,
    htmlToMarkdownTool,
    contentCleanerTool,
    webScraperTool,
    editorTool,
    copywriterTool,
    evaluateResultTool,
    extractLearningsTool,
    weatherTool
  },
  workflows: {},
  prompts: {
    listPrompts: () => Promise.resolve([]),
  },
  resources: {
    listResources (): Promise<Resource[]> {
      throw new Error("Function not implemented.");
    },
    getResourceContent: async (params: { uri: string; }): Promise<MCPServerResourceContent | MCPServerResourceContent[]> => {
      throw new Error(`Function not implemented for URI: ${params.uri}`);
    }
  }
});

export { selfReferencingAgent, selfReferencingOutputSchema };
