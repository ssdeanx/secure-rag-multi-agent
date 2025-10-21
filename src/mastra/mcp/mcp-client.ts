import { MCPClient } from "@mastra/mcp";

const smithry = process.env.SMITHERY_API_KEY
const smithryProfile = process.env.SMITHERY_PROFILE
const neo4jPassword = process.env.NEO4J_PASSWORD
const neo4jUsername = process.env.NEO4J_USERNAME
const neo4jUri = process.env.NEO4J_URI
const NEO4J_DATABASE = process.env.NEO4J_DATABASE ?? "neo4j"

export const mcpTools = new MCPClient({
  id: "mcp-client",
  servers: {
    wikipedia: {
      command: "npx",
      args: ["-y", "wikipedia-mcp"]
    },
    chromedevtools: {
			command: "npx",
			args: ["-y", "chrome-devtools-mcp@latest"],
		},
    neo4jagentmemory: {
			command: "npx",
			args: [
				"@knowall-ai/mcp-neo4j-agent-memory"
			],
			env: {
				"NEO4J_URI": `${neo4jUri}`,
				"NEO4J_USERNAME": `${neo4jUsername}`,
				"NEO4J_PASSWORD": `${neo4jPassword}`,
				"NEO4J_DATABASE": `${NEO4J_DATABASE}`
			}
		},
    googleSheets: {
      url: new URL("https://mcp.composio.dev/googlesheets/[private-url-path]"),
      sessionId: "google_sheets_session",
      reconnectionOptions: {
              maxReconnectionDelay: 10000,
              initialReconnectionDelay: 1000,
              reconnectionDelayGrowFactor: 1.3,
              maxRetries: 5,
            },
    },
    gh_grep: {
			url: new URL("https://mcp.grep.app"),
      sessionId: "gh_grep_session",
      reconnectionOptions: {
              maxReconnectionDelay: 10000,
              initialReconnectionDelay: 1000,
              reconnectionDelayGrowFactor: 1.3,
              maxRetries: 5,
            },
		},
    docfork: {
            url: new URL(`https://server.smithery.ai/@docfork/mcp/mcp?api_key=${smithry}&profile=${smithryProfile}`),
            requestInit: {headers: {},},
            sessionId: "docfork_session",
            reconnectionOptions: {
              maxReconnectionDelay: 10000,
              initialReconnectionDelay: 1000,
              reconnectionDelayGrowFactor: 1.3,
              maxRetries: 5,
            },
    },
  }
});

// MCPClient with Ampersand MCP Server using stdio transport
//export const mcp = new MCPClient({
 ////   servers: {
   //   "@amp-labs/mcp-server": {
   //     command: "npx",
    //    args: [
     //     "-y",
     //     "@amp-labs/mcp-server@latest",
     //     "--transport",
     //     "stdio",
     //     "--project",
     //     process.env.AMPERSAND_PROJECT_ID,
     //     "--integrationName",
     //     process.env.AMPERSAND_INTEGRATION_NAME,
     //     "--groupRef",
     //     process.env.AMPERSAND_GROUP_REF, // optional
     //   ],
     //   env: {
     //     AMPERSAND_API_KEY: process.env.AMPERSAND_API_KEY,
     //   },
     // },
  //  },
//});
