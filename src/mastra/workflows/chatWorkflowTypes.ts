import { z } from 'zod'

// Define schemas for Cedar OS state management and agentic actions
// Based on Cedar documentation: https://docs.cedarcopilot.com/state-access/agentic-actions

// Cedar State Node Schema (matches Cedar's expected structure)
const CedarNodeDataSchema = z.object({
    title: z.string().describe('Feature or item title'),
    description: z.string().describe('Detailed description'),
    status: z
        .enum(['done', 'planned', 'backlog', 'in progress'])
        .default('planned')
        .describe('Current development status'),
    nodeType: z.literal('feature').default('feature').describe('Type of node'),
    upvotes: z.number().default(0).describe('Number of upvotes'),
    comments: z
        .array(
            z.object({
                id: z.string(),
                author: z.string(),
                text: z.string(),
            })
        )
        .default([])
        .describe('User comments'),
})

const CedarNodeSchema = z.object({
    id: z.string().optional().describe('Unique node identifier'),
    position: z
        .object({
            x: z.number(),
            y: z.number(),
        })
        .optional()
        .describe('Node position in UI'),
    data: CedarNodeDataSchema.describe('Node data payload'),
})

// Cedar Agentic Actions - SetState Response (matches Cedar's expected structure)
// Based on: https://docs.cedarcopilot.com/type-safety/typing-agent-responses#setstateresponse
const SetStateActionSchema = z.object({
    type: z.literal('setState').describe('Action type for state manipulation'),
    stateKey: z.string().describe('Key of the state to modify'),
    setterKey: z
        .string()
        .describe('Name of the state setter function to execute'),
    args: z.any().describe('Arguments to pass to the state setter'), // Single object parameter per Cedar v0.1.11+
})

// Cedar Agentic Actions - FrontendTool Response (matches Cedar's expected structure)
// Based on: https://docs.cedarcopilot.com/type-safety/typing-agent-responses#frontendtoolresponse
const FrontendToolActionSchema = z.object({
    type: z
        .literal('frontendTool')
        .describe('Action type for frontend tool execution'),
    toolName: z
        .string()
        .describe('Name of the registered frontend tool to execute'),
    args: z.any().describe('Arguments to pass to the frontend tool'),
})

// Union of all Cedar action responses
export const CedarActionResponseSchema = z.union([
    SetStateActionSchema,
    FrontendToolActionSchema,
])

// Cedar LLM Response interface (matches Cedar's expected structure)
// Based on: https://docs.cedarcopilot.com/type-safety/typing-agent-responses#basic-llm-responses
export const CedarLLMResponseSchema = z.object({
    content: z.string().describe("The agent's text response"),
    usage: z
        .object({
            promptTokens: z.number().describe('Tokens used in the prompt'),
            completionTokens: z
                .number()
                .describe('Tokens used in the completion'),
            totalTokens: z.number().describe('Total tokens used'),
        })
        .optional()
        .describe('Token usage information'),
    metadata: z
        .record(z.string(), z.unknown())
        .optional()
        .describe('Additional metadata'),
    object: CedarActionResponseSchema.optional().describe(
        'Structured action response'
    ),
})

// Cedar Agent Request typing (matches Cedar's MastraParams pattern)
// Based on: https://docs.cedarcopilot.com/type-safety/typing-agent-requests
export const CedarChatInputSchema = z.object({
    prompt: z.string().describe('User input prompt'),
    temperature: z.number().optional().describe('LLM temperature setting'),
    maxTokens: z.number().optional().describe('Maximum tokens to generate'),
    systemPrompt: z.string().optional().describe('System prompt override'),

    // Memory linkage (Cedar custom fields)
    resourceId: z.string().optional().describe('Memory resource identifier'),
    threadId: z.string().optional().describe('Memory thread identifier'),

    // Stream controller for real-time responses
    streamController: z.any().optional().describe('Streaming controller'),

    // Structured output configuration
    output: z
        .any()
        .optional()
        .describe('Output schema for structured responses'),

    // Cedar OS Context (state subscriptions and mentions)
    cedarContext: z
        .object({
            // Current state data
            nodes: z
                .array(
                    z.object({
                        id: z.string(),
                        title: z.string(),
                        description: z.string(),
                        status: z.string(),
                        type: z.string(),
                        upvotes: z.number(),
                        commentCount: z.number(),
                    })
                )
                .describe('Current roadmap/feature nodes'),

            selectedNodes: z
                .array(
                    z.object({
                        id: z.string(),
                        title: z.string(),
                        description: z.string(),
                        status: z.string(),
                        type: z.string(),
                        upvotes: z.number(),
                        commentCount: z.number(),
                    })
                )
                .describe('User-selected nodes'),

            currentDate: z.string().describe('Current date context'),

            // Cedar system fields (automatically added by Cedar)
            frontendTools: z
                .record(z.string(), z.unknown())
                .optional()
                .describe('Available frontend tools'),
            stateSetters: z
                .record(z.string(), z.unknown())
                .optional()
                .describe('Available state setters'),
            schemas: z
                .record(z.string(), z.unknown())
                .optional()
                .describe('Zod schemas for validation'),
        })
        .optional()
        .describe('Cedar OS context and state access'),
})

// Type exports for TypeScript usage
export type CedarNodeData = z.infer<typeof CedarNodeDataSchema>
export type CedarNode = z.infer<typeof CedarNodeSchema>
export type SetStateAction = z.infer<typeof SetStateActionSchema>
export type FrontendToolAction = z.infer<typeof FrontendToolActionSchema>
export type CedarActionResponse = z.infer<typeof CedarActionResponseSchema>
export type CedarLLMResponse = z.infer<typeof CedarLLMResponseSchema>
export type CedarChatInput = z.infer<typeof CedarChatInputSchema>

// Legacy exports for backward compatibility
export const FeatureNodeDataSchema = CedarNodeDataSchema
export const NodeSchema = CedarNodeSchema
export const AddNodeActionSchema = SetStateActionSchema.extend({
    setterKey: z.literal('addNode'),
})
export const RemoveNodeActionSchema = SetStateActionSchema.extend({
    setterKey: z.literal('removeNode'),
})
export const ChangeNodeActionSchema = SetStateActionSchema.extend({
    setterKey: z.literal('changeNode'),
})
export const ActionResponseSchema = CedarActionResponseSchema
export const ExecuteFunctionResponseSchema = CedarLLMResponseSchema
