import { Agent } from '@mastra/core/agent'
import { MCPClient } from '@mastra/mcp'
import { log } from '../config/logger'
import { pgMemory } from '../config/pg-storage'
import { googleAI } from '../config/google'

// Define runtime context for this agent
export interface McpAgentContext {
    userId?: string
}

log.info('Initializing Multi-tool Agent...')

// configure MCP with user-specific settings
const mcp = new MCPClient({
    servers: {
        chromedev: {
            command: 'npx',
            args: ['chrome-devtools-mcp@latest'],
            env: {},
            timeout: 20000, // Server-specific timeout
        },
        cedar: {
            url: new URL('https://mcpwithcedar-production.up.railway.app/jsonrpc'),
            requestInit: {
                headers: {
                },
            },
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
    evals: {},
    scorers: {},
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
