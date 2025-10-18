import { Agent } from '@mastra/core/agent'
import { MCPClient } from '@mastra/mcp'
import { log } from '../config/logger'
import { pgMemory } from '../config/pg-storage'
import { googleAI } from '../config/google'
import { responseQualityScorer, taskCompletionScorer } from './custom-scorers'

// Define runtime context for this agent
export interface McpAgentContext {
    userId?: string
}

log.info('Initializing Multi-tool Agent...')
const smithry = process.env.SMITHERY_API_KEY
const smithryProfile = process.env.SMITHERY_PROFILE


// configure MCP with user-specific settings
export const mcp = new MCPClient({
    servers: {
        a2agateway: {
            command: 'uvx',
            args: ['mcp-a2a-gateway'],
            env: {
                "MCP_TRANSPORT": "stdio",
                "MCP_DATA_DIR": "/home/sam/00-mastra/deep-research/docs/a2a_gateway/"
            },
            timeout: 30000, // Server-specific timeout
        },
        docfork: {
            url: new URL(`https://server.smithery.ai/@docfork/mcp/mcp?api_key=${smithry}&profile=${smithryProfile}`),
            requestInit: {headers: {},},
        },
    },
})
// create an agent that uses MCP tools
export const mcpAgent = new Agent({
    id: 'mcp',
    name: 'mcpAgent',
    description: 'An agent that uses multiple tools via MCP.',
    instructions: ({ runtimeContext }) => {
        const userId = runtimeContext.get('userId')
        return `You help users check stocks and weather.
User: ${userId ?? 'admin'}`
    },
    model: googleAI,
    memory: pgMemory,
    tools: async () => {
        return await mcp.getTools()
    },
    scorers: {
        responseQuality: {
            scorer: responseQualityScorer,
            sampling: { type: 'ratio', rate: 0.8 },
        },
        taskCompletion: {
            scorer: taskCompletionScorer,
            sampling: { type: 'ratio', rate: 0.7 },
        },
    },
    workflows: {},
})

// Pass all toolsets to stream() or generate()
// This is optional; if omitted, the agent will use all available toolsets
// The toolsets can also be passed to generate()
const response = await mcpAgent.stream(
    'How is AAPL doing and what is the weather?',
    {
        toolsets: await mcp.getToolsets(),
    }
)
