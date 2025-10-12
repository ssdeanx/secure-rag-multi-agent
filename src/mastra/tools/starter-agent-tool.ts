import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { log } from '../config/logger'
import { AISpanType } from '@mastra/core/ai-tracing'

// Define runtime context for this tool
export interface StarterAgentToolContext {
    userId?: string
    sessionId?: string
}

log.info('Initializing Starter Agent Tool...')

export const starterAgentTool = createTool({
    id: 'starter-agent',
    description:
        'Dynamically invokes any available agent based on context and requirements. This tool can call research agents, content creation agents, editing agents, or any other agent in the system.',
    inputSchema: z.object({
        agentType: z
            .enum([
                'research',
                'copywriter',
                'editor',
                'assistant',
                'productRoadmap',
            ])
            .describe('The type of agent to invoke'),
        task: z.string().describe('The specific task or request for the agent'),
        context: z
            .string()
            .optional()
            .describe('Additional context or background information'),
        parameters: z
            .any()
            .optional()
            .describe('Additional parameters specific to the agent type'),
        expectedOutput: z
            .string()
            .optional()
            .describe('Description of expected output format or structure'),
    }),
    outputSchema: z.object({
        agentCalled: z
            .string()
            .describe('The name of the agent that was invoked'),
        result: z.string().describe('The result from the agent'),
        success: z.boolean().describe('Whether the agent call was successful'),
        metadata: z
            .any()
            .optional()
            .describe('Additional metadata about the agent call'),
    }),
    execute: async ({ context, mastra, tracingContext }) => {
        const {
            agentType,
            task,
            context: additionalContext,
            parameters = {},
            expectedOutput,
        } = context

        // Map agent types to actual agent IDs
        const agentMapping: Record<string, string> = {
            research: 'researchAgent',
            copywriter: 'copywriterAgent',
            editor: 'editorAgent',
            assistant: 'assistantAgent',
            productRoadmap: 'productRoadmapAgent',
        }

        // Create a span for tracing
        const span = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.TOOL_CALL,
            name: 'starter-agent-tool',
            input: {
                agentType,
                taskLength: task.length,
                hasContext: !!additionalContext,
                hasParameters: Object.keys(parameters).length > 0,
                expectedOutput: expectedOutput ?? 'standard',
            },
        })

        try {
            const agentId = agentMapping[agentType]
            if (!agentId) {
                throw new Error(`Unknown agent type: ${agentType}`)
            }

            const agent = mastra!.getAgent(agentId)
            if (!agent) {
                throw new Error(`Agent not found: ${agentId}`)
            }

            // Build the prompt based on agent type and context
            let prompt = task

            if (additionalContext) {
                prompt += `\n\nContext: ${additionalContext}`
            }

            if (expectedOutput) {
                prompt += `\n\nExpected output: ${expectedOutput}`
            }

            // Add agent-specific instructions
            switch (agentType) {
                case 'research':
                    prompt = `Conduct research on: ${prompt}`
                    break
                case 'copywriter':
                    prompt = `Create content for: ${prompt}`
                    break
                case 'editor':
                    prompt = `Edit and improve: ${prompt}`
                    break
                case 'productRoadmap':
                    prompt = `Work on product roadmap for: ${prompt}`
                    break
                case 'assistant':
                    prompt = `Assist with: ${prompt}`
                    break
                default:
                    // Defensive fallback for any unexpected agent types
                    prompt = `Perform task: ${prompt}`
                    break
            }

            // Add any additional parameters to the prompt
            if (Object.keys(parameters).length > 0) {
                prompt += `\n\nAdditional parameters: ${JSON.stringify(parameters)}`
            }

            log.info(
                `Invoking agent: ${agentId} for task: ${task.substring(0, 100)}...`
            )

            const result = await agent.generate(prompt)

            span?.end({
                output: {
                    success: true,
                    agentCalled: agentId,
                    resultLength: result.text.length,
                    agentType,
                },
            })

            return {
                agentCalled: agentId,
                result: result.text,
                success: true,
                metadata: {
                    agentType,
                    taskLength: task.length,
                    resultLength: result.text.length,
                    timestamp: new Date().toISOString(),
                },
            }
        } catch (error) {
            const errorMsg =
                error instanceof Error ? error.message : 'Unknown error'
            log.error('Starter agent tool error:', {
                error: errorMsg,
                agentType,
                task: task.substring(0, 100),
            })

            span?.end({
                metadata: {
                    success: false,
                    error: errorMsg,
                    agentType,
                    taskPreview: task.substring(0, 100),
                },
            })

            return {
                agentCalled: agentMapping[agentType] || 'unknown',
                result: `Error: ${errorMsg}`,
                success: false,
                metadata: {
                    error: errorMsg,
                    agentType,
                    timestamp: new Date().toISOString(),
                },
            }
        }
    },
})
