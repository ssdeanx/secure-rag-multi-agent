import { registerApiRoute } from '@mastra/core/server'
import type { ChatOutput } from './workflows/chatWorkflow'
import { ChatInputSchema, chatWorkflow } from './workflows/chatWorkflow'
import { contentGenerationWorkflow } from './workflows/contentGenerationWorkflow'
import { contentGenerationInputSchema } from './schemas/agent-schemas'
import { zodToJsonSchema } from 'zod-to-json-schema'
import {
    createSSEStream,
    streamProgressUpdate,
    streamJSONEvent,
} from '../utils/streamUtils'
import { log } from './config/logger'

// Helper function to convert Zod schema to OpenAPI schema
function toOpenApiSchema(schema: Parameters<typeof zodToJsonSchema>[0]) {
    return zodToJsonSchema(schema) as Record<string, unknown>
}

/**
 * API routes for the Mastra backend
 *
 * These routes handle chat interactions between the Cedar-OS frontend
 * and your Mastra agents. The chat UI will automatically use these endpoints.
 *
 * - /chat: Standard request-response chat endpoint
 * - /chat/stream: Server-sent events (SSE) endpoint for streaming responses
 */
export const apiRoutes = [
    registerApiRoute('/chat', {
        method: 'POST',
        openapi: {
            requestBody: {
                content: {
                    'application/json': {
                        schema: toOpenApiSchema(ChatInputSchema),
                    },
                },
            },
        },
        handler: async (c) => {
            try {
                const body = await c.req.json()
                const { prompt, temperature, maxTokens, systemPrompt } =
                    ChatInputSchema.parse(body)

                const run = await chatWorkflow.createRunAsync()
                const result = await run.start({
                    inputData: {
                        currentDate: new Date().toISOString(),
                        prompt,
                        temperature,
                        maxTokens,
                        systemPrompt,
                    },
                })

                if (result.status === 'success') {
                    // TODO: Add any response transformation or logging here
                    log.info('Sending response', { response: result.result })
                    return c.json<ChatOutput>(result.result)
                }

                // TODO: Handle other workflow statuses if needed
                throw new Error('Workflow did not complete successfully')
            } catch (error) {
                log.error('Chat API error', {
                    error:
                        error instanceof Error ? error.message : String(error),
                })
                return c.json(
                    {
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Internal error',
                    },
                    500
                )
            }
        },
    }),
    registerApiRoute('/chat/stream', {
        method: 'POST',
        openapi: {
            requestBody: {
                content: {
                    'application/json': {
                        schema: toOpenApiSchema(ChatInputSchema),
                    },
                },
            },
        },
        handler: async (c) => {
            try {
                const body = await c.req.json()
                const { prompt, temperature, maxTokens, systemPrompt } =
                    ChatInputSchema.parse(body)

                return createSSEStream(async (controller) => {
                    const run = await chatWorkflow.createRunAsync()
                    const result = await run.start({
                        inputData: {
                            currentDate: new Date().toISOString(),
                            prompt,
                            temperature,
                            maxTokens,
                            systemPrompt,
                            streamController: controller,
                        },
                    })

                    if (result.status !== 'success') {
                        // TODO: Handle workflow errors appropriately
                        log.error(`Workflow failed: ${result.status}`)
                    }
                })
            } catch (error) {
                log.error('Chat stream API error', {
                    error:
                        error instanceof Error ? error.message : String(error),
                })
                return c.json(
                    {
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Internal error',
                    },
                    500
                )
            }
        },
    }),

    // Content Generation Workflow Routes
    registerApiRoute('/content/generate', {
        method: 'POST',
        openapi: {
            requestBody: {
                content: {
                    'application/json': {
                        schema: toOpenApiSchema(contentGenerationInputSchema),
                    },
                },
            },
        },
        handler: async (c) => {
            try {
                const body = await c.req.json()
                const inputData = contentGenerationInputSchema.parse(body)

                const run = await contentGenerationWorkflow.createRunAsync()
                const result = await run.start({ inputData })

                if (result.status === 'success') {
                    log.info('Content generation completed', {
                        contentType: inputData.contentType,
                    })
                    return c.json(result.result)
                }

                throw new Error(`Workflow failed with status: ${result.status}`)
            } catch (error) {
                log.error('Content generation API error', {
                    error:
                        error instanceof Error ? error.message : String(error),
                })
                return c.json(
                    {
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Internal error',
                    },
                    500
                )
            }
        },
    }),

    registerApiRoute('/content/generate/stream', {
        method: 'POST',
        openapi: {
            requestBody: {
                content: {
                    'application/json': {
                        schema: toOpenApiSchema(contentGenerationInputSchema),
                    },
                },
            },
        },
        handler: async (c) => {
            try {
                const body = await c.req.json()
                const inputData = contentGenerationInputSchema.parse(body)

                return createSSEStream(async (controller) => {
                    // Send initial progress update
                    streamProgressUpdate(
                        controller,
                        'Starting content generation...',
                        'in_progress'
                    )

                    const run = await contentGenerationWorkflow.createRunAsync()

                    // Use standard workflow execution (not streamVNext for now)
                    streamProgressUpdate(
                        controller,
                        'Validating request...',
                        'in_progress'
                    )
                    const result = await run.start({ inputData })

                    if (result.status === 'success') {
                        log.info('Content generation stream completed', {
                            contentType: inputData.contentType,
                        })

                        // Stream the final result as JSON
                        streamJSONEvent(controller, {
                            type: 'content_generation_complete',
                            data: result.result,
                        })

                        streamProgressUpdate(
                            controller,
                            'Content generation complete',
                            'complete'
                        )
                    } else {
                        throw new Error(
                            `Workflow failed with status: ${result.status}`
                        )
                    }
                })
            } catch (error) {
                log.error('Content generation stream API error', {
                    error:
                        error instanceof Error ? error.message : String(error),
                })
                return c.json(
                    {
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Internal error',
                    },
                    500
                )
            }
        },
    }),
]
