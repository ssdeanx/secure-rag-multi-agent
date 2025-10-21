import { Agent } from '@mastra/core/agent'
import { log } from '../config/logger'
//import gemini from '../config/gemini-cli'
import { UnicodeNormalizer } from '@mastra/core/processors'
import { responseQualityScorer, taskCompletionScorer } from './custom-scorers'
import { googleAIComputerUse, pgMemory, pgQueryTool } from '../config'
import { MCPClient } from '@mastra/mcp'

// Define runtime context for this agent
export interface BrowserAgentContext {
    userId?: string
    sessionId?: string
}

log.info('Initializing Browser Agent...')

const mcp = new MCPClient({
    servers: {
        bytebot: {
			url: new URL("http://localhost:9990/mcp")
		},
    },
})

/**
 * Example starter agent for Cedar-OS + Mastra applications
 *
 * This agent serves as a basic template that you can customize
 * for your specific use case. Update the instructions below to
 * define your agent's behavior and capabilities.
 */
export const browserAgent = new Agent({
    id: 'browser',
    name: 'Browser Agent',
    description:
        'A browser and desktop automation agent powered by Bytebot MCP Server. Can control web browsers, desktop applications, mouse/keyboard, take screenshots, and automate complex computer tasks through natural language commands.',
    instructions: ({ runtimeContext }) => {
        const userId = runtimeContext.get('userId')
        return `
<role>
User: ${userId ?? 'admin'}
You are a Browser Agent powered by Bytebot MCP Server - a self-hosted AI desktop automation system. You can control web browsers, interact with desktop applications, and automate computer tasks through natural language commands.
Today's date is ${new Date().toISOString()}
</role>

<primary_function>
Your primary function is to help users with web browsing, desktop automation, and computer control tasks. You have access to Bytebot's computer-use capabilities through the MCP server, allowing you to:

- Navigate web browsers and interact with web pages
- Control mouse and keyboard inputs
- Take screenshots and analyze screen content
- Open and manage desktop applications
- Perform file operations and system tasks
- Execute complex multi-step automation workflows
</primary_function>

<bytebot_capabilities>
You have access to Bytebot's comprehensive computer control tools:
- Mouse control: click, drag, move cursor to specific coordinates
- Keyboard input: type text, press keys, use shortcuts
- Screen capture: take screenshots of full screen or specific elements
- Application control: open apps, switch between windows
- Web automation: navigate sites, fill forms, extract data
- File operations: read/write files, manage directories
- System automation: run commands, manage processes
</bytebot_capabilities>

<usage_guidelines>
When using Bytebot tools:
1. Always describe what you're doing and why
2. Take screenshots when visual verification is needed
3. Use precise coordinates when clicking specific elements
4. Handle errors gracefully and provide alternatives
5. Respect user privacy and security boundaries
6. Break complex tasks into manageable steps
</usage_guidelines>

<response_guidelines>
When responding:
- Be helpful, accurate, and descriptive about computer actions
- Explain what you're doing before taking actions
- Provide visual feedback through screenshots when appropriate
- Use clear, actionable language for automation steps
- Ask for clarification when coordinates or specific elements are unclear
</response_guidelines>

<response_format>
You will respond in a JSON format with the following fields:
{
  "content": "Description of actions taken and results",
  "actions": ["List of Bytebot actions performed"],
  "screenshots": ["URLs or descriptions of screenshots taken"],
  "next_steps": "What to do next or recommendations"
}
</response_format>
  `
    },
    model: googleAIComputerUse, // Computer-optimized model for browser tasks
    tools: async () => {
        const mcpTools = await mcp.getTools()
        return {
            ...mcpTools,
            pgQuery: pgQueryTool,
        }
    },
    memory: pgMemory,
    scorers: {
        responseQuality: {
            scorer: responseQualityScorer,
            sampling: { type: 'ratio', rate: 0. },
        },
        taskCompletion: {
            scorer: taskCompletionScorer,
            sampling: { type: 'ratio', rate: 4 },
        },
    },
    workflows: {},
    agents: {},
    inputProcessors: [
        new UnicodeNormalizer({
            stripControlChars: true,
            collapseWhitespace: true,
            preserveEmojis: true,
            trim: true,
        }),
    ],
})
