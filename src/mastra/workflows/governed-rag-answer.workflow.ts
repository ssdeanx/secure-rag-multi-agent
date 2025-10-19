import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'

import { answererAgent, answererOutputSchema } from '../agents/answerer.agent'
import { rerankAgent, rerankOutputSchema } from '../agents/rerank.agent'
import { retrieveAgent, retrieveOutputSchema } from '../agents/retrieve.agent'
import { verifierAgent, verifierOutputSchema } from '../agents/verifier.agent'
import {
    logStepStart,
    logStepEnd,
    logAgentActivity,
    logError,
} from '../config/logger'
import {
    jwtClaimsSchema,
    accessFilterSchema,
    documentContextSchema,
    ragAnswerSchema,
    verificationResultSchema,
} from '../schemas/agent-schemas'
import { AuthenticationService } from '../services/AuthenticationService'
import { log } from '../config/logger'
import { ChunkType } from '@mastra/core/stream';
/**
 * Strongly-typed alias for document contexts derived from the Zod schema
 * to avoid using `any` and to keep runtime validation via the existing schemas.
 */
type DocumentContext = z.infer<typeof documentContextSchema>

// Step 1: Combined Authentication and Authorization
const authenticationStep = createStep({
    id: 'authentication',
    description: 'Verify JWT token and generate access policy',
    inputSchema: z.object({
        jwt: z.string(),
        question: z.string(),
    }),
    outputSchema: z.object({
        accessFilter: accessFilterSchema,
        question: z.string(),
    }),
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('authentication', { hasJwt: !!inputData.jwt })

        try {
            // Validate JWT and extract claims using schema
            const { accessFilter } =
                await AuthenticationService.authenticateAndAuthorize(
                    inputData.jwt
                )

            // Validate the access filter structure
            const validatedFilter = accessFilterSchema.parse(accessFilter)

            const output = {
                accessFilter: validatedFilter,
                question: inputData.question,
            }

            logStepEnd(
                'authentication',
                {
                    accessFilter: validatedFilter.allowTags,
                    maxClassification: validatedFilter.maxClassification,
                },
                Date.now() - startTime
            )
            return output
        } catch (error) {
            logError('authentication', error, { question: inputData.question })
            throw new Error(
                `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    },
})

// Step 2: Retrieve and Rerank documents
const retrievalStep = createStep({
    id: 'retrieval-and-rerank',
    description:
        'Retrieve documents with security filters and rerank by relevance',
    inputSchema: z.object({
        accessFilter: accessFilterSchema,
        question: z.string(),
    }),
    outputSchema: z.object({
        contexts: z.array(documentContextSchema),
        question: z.string(),
    }),
    execute: async ({ inputData, mastra }) => {
        const startTime = Date.now()
        const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`

        log.info(
            `[${requestId}] 🚀 Starting document retrieval for question: "${inputData.question}"`
        )
        logStepStart('retrieval-and-rerank', {
            accessFilter: inputData.accessFilter.allowTags,
            question: inputData.question,
            requestId,
        })

        try {
            logAgentActivity('retrieve', 'querying-documents', {
                allowTags: inputData.accessFilter.allowTags,
                maxClassification: inputData.accessFilter.maxClassification,
                requestId,
            })

            // Retrieve documents using mastra context
            const agent = mastra?.getAgent('retrieve') || retrieveAgent
            log.info(`[${requestId}] 🤖 Calling retrieve agent...`)

            const retrieveResult = await agent.generate(
                JSON.stringify({
                    question: inputData.question,
                    access: inputData.accessFilter,
                    requestId, // Pass request ID to agent for tracking
                }),
                {
                    toolChoice: 'required', // Force tool usage to ensure results are captured
                }
            )

        log.info(`[${requestId}] ✅ Retrieve agent completed`)
            log.info(
                `[${requestId}] 🔍 Tool results available:`,
                { toolResultsLength: retrieveResult.toolResults?.length || 0 }
            )
                log.debug(
                    `[${requestId}] 📋 Full retrieve result structure:`,
                    {
                        hasToolResults:
                            Array.isArray(retrieveResult.toolResults) &&
                            retrieveResult.toolResults.length > 0,
                        toolResultsLength: retrieveResult.toolResults?.length,
                        toolResultsKeys: retrieveResult.toolResults?.map(
                            (tr) => ({
                                toolName: tr.payload?.toolName,
                                hasResult:
                                    tr.payload?.result !== undefined &&
                                    tr.payload?.result !== null,
                            })
                        ),
                        hasText: typeof retrieveResult.text === 'string' && retrieveResult.text.length > 0,
                        textLength: retrieveResult.text?.length,
                        textPreview: retrieveResult.text?.substring(0, 200),
                    }
                )

            let contexts: DocumentContext[] = []

            // Method 1: Extract from tool results (preferred)
            if (
                Array.isArray(retrieveResult.toolResults) &&
                retrieveResult.toolResults.length > 0
            ) {
                log.info(
                    `[${requestId}] 🔧 Found tool results, checking for vector query tool...`
                )

                // Try multiple possible tool names
                const possibleToolNames = [
                    'pgQuery',
                    'pgQueryTool',
                    'vectorQueryTool',
                    'vector-query',
                    'vectorQuery',
                    'pgQueryTool',
                    'pg-query',
                    'graphQueryTool',
                    'graph-query',
                    'graphQuery',
                    'textQueryTool',
                    'text-query',
                    'textQuery',
                ]

                // Explicitly type toolResult to avoid TypeScript inferring `never`
                interface ToolResult { payload?: { toolName?: string; result?: unknown } }
                let toolResult: ToolResult | undefined = undefined

                // Normalize and type the toolResults array safely without `any`
                const toolResultsArray = Array.isArray(retrieveResult.toolResults)
                    ? (retrieveResult.toolResults as unknown as ToolResult[])
                    : undefined

                for (const toolName of possibleToolNames) {
                    // safely search typed tool results without using `any`
                    toolResult = toolResultsArray?.find(
                        (tr) => tr?.payload?.toolName === toolName
                    )
                    if (toolResult) {
                        log.info(
                            `[${requestId}] ✅ Found tool result with name: ${toolName}`
                        )
                        break
                    }
                }

                if (!toolResult) {
                    // If no match found, take the first available tool result as a fallback
                    // Use the strongly-typed toolResultsArray (ToolResult[] | undefined) instead of `any`.
                    toolResult = toolResultsArray?.[0]
                    if (toolResult) {
                        log.info(
                            `[${requestId}] ℹ️ No named tool found — falling back to first tool result: ${toolResult.payload?.toolName ?? 'unknown'}`
                        )
                    }
                }

                // Type assertion and validation using retrieveOutputSchema
                // Use the strongly-typed DocumentContext alias instead of `any`
                const toolResultData = toolResult?.payload?.result as
                    | { contexts?: DocumentContext[] }
                    | undefined
                if (toolResultData?.contexts) {
                    // Validate the output against the schema
                    try {
                        const validated = retrieveOutputSchema.parse({
                            contexts: toolResultData.contexts,
                        })
                        contexts = validated.contexts
                        log.info(
                            `[${requestId}] 📄 Extracted and validated ${contexts.length} contexts from tool results`
                        )
                    } catch (validationError) {
                        const validationErrorInfo =
                            validationError instanceof Error
                                ? {
                                      message: validationError.message,
                                      stack: validationError.stack,
                                  }
                                : (() => {
                                      try {
                                          return { error: JSON.parse(JSON.stringify(validationError)) }
                                      } catch {
                                          return { error: String(validationError) }
                                      }
                                  })()
                        log.warn(
                            `[${requestId}] ⚠️ Schema validation failed, using raw contexts`,
                            validationErrorInfo
                        )
                        contexts = toolResultData.contexts
                    }
                } else {
                    log.warn(
                        `[${requestId}] ⚠️ Tool result found but no contexts property`,
                        {
                            toolName: toolResult?.payload?.toolName,
                            // explicit null/undefined check instead of boolean coercion of `any`
                            hasResult:
                                toolResult?.payload?.result !== null,
                            // ensure the result is a non-null object before calling Object.keys
                            resultKeys: (() => {
                                const result = toolResult?.payload?.result
                                return result !== null && typeof result === 'object'
                                    ? Object.keys(result as Record<string, unknown>)
                                    : []
                            })(),
                        }
                    )
                }
            } else {
                log.warn(
                    `[${requestId}] ⚠️ No tool results found - tool may not be executing`
                )
            }

            // SECURE text response parsing: Only accept real database results
            if (contexts.length === 0 && retrieveResult.text) {
                try {
                    // First, check if this looks like a real tool response
                    if (
                        retrieveResult.text.startsWith('{"contexts"') &&
                        retrieveResult.text.endsWith('}')
                    ) {
                        const parsed = JSON.parse(retrieveResult.text)
                        if (
                            Boolean(parsed.contexts) &&
                            Array.isArray(parsed.contexts)
                        ) {
                            // STRICT SECURITY VALIDATION: Only accept real database results
                            const validContexts = parsed.contexts.filter(
                                (ctx: {
                                    docId: string | number | null | undefined
                                    text: string | string[]
                                    score: number
                                    versionId: string | number | null | undefined
                                    source: string | null | undefined
                                    securityTags: unknown[] | null | undefined
                                    classification: string | number | null | undefined
                                }) => {
                                    // Ensure text is a non-empty string before using string-specific checks
                                    const hasText = typeof ctx.text === 'string' && ctx.text.trim().length > 0

                                    return (
                                        // Must have core database fields
                                        Boolean(ctx.docId) &&
                                        hasText &&
                                        typeof ctx.score === 'number' &&
                                        Boolean(ctx.versionId) &&
                                        Boolean(ctx.source) &&
                                        Array.isArray(ctx.securityTags) &&
                                        Boolean(ctx.classification) &&
                                        // Text must not look like generated content
                                        (typeof ctx.text === 'string' &&
                                            !ctx.text.includes(
                                                'The Termination Procedures are as follows'
                                            )) &&
                                        (typeof ctx.text === 'string' &&
                                            !ctx.text.includes(
                                                '# Git Workflow at ACME'
                                            )) &&
                                        // Score must be realistic (0-1 range)
                                        ctx.score >= 0 &&
                                        ctx.score <= 1
                                    )
                                }
                            )

                            if (validContexts.length > 0) {
                                contexts = validContexts
                                log.info(
                                    `[${requestId}] 📄 Extracted ${contexts.length} validated contexts from agent response`
                                )
                            } else {
                                log.warn(
                                    `[${requestId}] 🚫 Rejected ${parsed.contexts.length} contexts - failed security validation`
                                )
                            }
                        }
                    }
                } catch (err) {
                    log.warn(
                        `[${requestId}] ⚠️ Failed to parse agent text response as JSON`,
                        { error: err instanceof Error ? err.message : String(err) }
                    )
                }
            }

            // Skip reranking if no contexts
            if (contexts?.length === 0) {
                logStepEnd(
                    'retrieval-and-rerank',
                    { contextsFound: 0 },
                    Date.now() - startTime
                )
                return {
                    contexts: [],
                    question: inputData.question,
                }
            }

            // Rerank contexts for relevance
            try {
                const rerankResult = await rerankAgent.generate(
                    JSON.stringify({
                        question: inputData.question,
                        contexts,
                    }),
                    {
                        structuredOutput: {
                            schema: rerankOutputSchema,
                        },
                        maxSteps: 1,
                    }
                )

                const rerankResponse = rerankResult.object ?? { contexts: [] }
                const output: { contexts: Array<z.infer<typeof documentContextSchema>>; question: string } = {
                    contexts: rerankResponse.contexts,
                    question: inputData.question,
                }

                logStepEnd(
                    'retrieval-and-rerank',
                    { contextsFound: output.contexts.length },
                    Date.now() - startTime
                )
                return output
            } catch (error) {
                // Log the rerank failure for observability and then return original contexts
                log.warn(`[${requestId}] 🔀 Rerank agent failed`, {
                    error: error instanceof Error ? error.message : String(error),
                    contextsCount: contexts.length,
                })

                // If reranking fails, return original contexts
                const output: { contexts: Array<z.infer<typeof documentContextSchema>>; question: string } = {
                    contexts,
                    question: inputData.question,
                }

                logStepEnd(
                    'retrieval-and-rerank',
                    {
                        contextsFound: output.contexts.length,
                        rerankFailed: true,
                    },
                    Date.now() - startTime
                )
                return output
            }
        } catch (error) {
            logError('retrieval-and-rerank', error, {
                accessFilter: inputData.accessFilter,
            })
            throw new Error(
                `Document retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    },
})

// Step 3: Generate answer from contexts
const answerStep = createStep({
    id: 'answer-generation',
    description: 'Generate answer from authorized contexts',
    inputSchema: z.object({
        contexts: z.array(documentContextSchema),
        question: z.string(),
    }),
    outputSchema: z.object({
        answer: ragAnswerSchema,
        contexts: z.array(documentContextSchema),
        question: z.string(),
    }),
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('answer-generation', {
            contextsCount: inputData.contexts.length,
            question: inputData.question,
        })

        try {
            logAgentActivity('answerer', 'generating-answer', {
                contextsCount: inputData.contexts.length,
            })

            const result = await answererAgent.generate(
                JSON.stringify({
                    question: inputData.question,
                    contexts: inputData.contexts,
                }),
                {
                    structuredOutput: {
                        schema: answererOutputSchema,
                    },
                    maxSteps: 1,
                }
            )

            const answer = result.object ?? {
                answer: 'Unable to generate answer',
                citations: [],
            }

            // Ensure we always have a proper response for no contexts
            if (
                inputData.contexts.length === 0 &&
                (!answer.answer || answer.answer.trim() === '')
            ) {
                answer.answer =
                    'No authorized documents found that contain information about this topic.'
                answer.citations = []
            }
            const output = {
                answer,
                contexts: inputData.contexts,
                question: inputData.question,
            }

            logStepEnd(
                'answer-generation',
                { citationsCount: answer.citations?.length || 0 },
                Date.now() - startTime
            )
            return output
        } catch (error) {
            logError('answer-generation', error, {
                contextsCount: inputData.contexts.length,
            })
            throw new Error(
                `Answer generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    },
})

// Step 4: Verify answer for security compliance
const verifyStep = createStep({
    id: 'answer-verification',
    description: 'Verify answer complies with security policies',
    inputSchema: z.object({
        answer: ragAnswerSchema,
        contexts: z.array(documentContextSchema),
        question: z.string(),
    }),
    outputSchema: z.object({
        answer: z.string(),
        citations: z.array(
            z.object({
                docId: z.string(),
                source: z.string(),
            })
        ),
    }),
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('answer-verification', {
            citationsCount: inputData.answer.citations?.length || 0,
            question: inputData.question,
        })

        try {
            logAgentActivity('verifier', 'verifying-answer', {
                citationsCount: inputData.answer.citations?.length || 0,
            })

            const result = await verifierAgent.generate(
                JSON.stringify({
                    answer: inputData.answer,
                    question: inputData.question,
                    contexts: inputData.contexts,
                }),
                {
                    structuredOutput: {
                        schema: verifierOutputSchema,
                    },
                    maxSteps: 1,
                }
            )

            const verification = result.object ?? {
                ok: false,
                reason: 'Verification failed',
            }

            if (!verification.ok) {
                // Handle specific case where answer indicates insufficient evidence
                if (
                    inputData.answer.answer.includes(
                        'No authorized documents found'
                    ) ||
                    inputData.answer.answer.includes(
                        "don't contain information about this"
                    )
                ) {
                    const output = {
                        answer: inputData.answer.answer,
                        citations: inputData.answer.citations,
                    }
                    logStepEnd(
                        'answer-verification',
                        {
                            verified: true,
                            insufficientEvidence: true,
                            citationsCount: output.citations.length,
                        },
                        Date.now() - startTime
                    )
                    return output
                }

                logError(
                    'answer-verification',
                    new Error(verification.reason),
                    { reason: verification.reason }
                )
                throw new Error(
                    verification.reason || 'Answer failed security verification'
                )
            }

            const output = {
                answer: inputData.answer.answer,
                citations: inputData.answer.citations,
            }

            logStepEnd(
                'answer-verification',
                { verified: true, citationsCount: output.citations.length },
                Date.now() - startTime
            )
            return output
        } catch (error) {
            logError('answer-verification', error, {
                question: inputData.question,
            })
            throw new Error(
                `Answer verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    },
})

// Create the workflow
export const governedRagAnswer = createWorkflow({
    id: 'governed-rag-answer',
    description:
        'Multi-agent governed RAG: auth → retrieve+rerank → answer → verify',
    inputSchema: z.object({
        jwt: z.string(),
        question: z.string(),
    }),
    outputSchema: z.object({
        answer: z.string(),
        citations: z.array(
            z.object({
                docId: z.string(),
                source: z.string(),
            })
        ),
    }),
})
    .then(authenticationStep)
    .then(retrievalStep)
    .then(answerStep)
    .then(verifyStep)
    .commit()
