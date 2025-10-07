// Kilocode: Tool Approval
// owner: team-data
// justification: authorized vector queries with       const store = mastra!.getVector("pgVector");

// Use environment variable or default for similarity thresholdrvice enforcement
// allowedDomains:
//  -
// allowedDataPaths:
//  -
// sideEffects:
//  - network: true
//  - write: false
// inputSchema: src/mastra/schemas/tool-schemas.ts::VectorQueryInput
// outputSchema: src/mastra/schemas/tool-schemas.ts::VectorQueryOutput
// approvedBy: sam
// approvalDate: 9/22
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { AISpanType } from '@mastra/core/ai-tracing'
import { ValidationService } from '../services/ValidationService'
import { VectorQueryService } from '../services/VectorQueryService'
import { log } from '../config/logger'
import type { RuntimeContext } from '@mastra/core/runtime-context'

// Define the expected shape of the runtime context for this tool
export interface VectorQueryContext {
    accessFilter: {
        allowTags: string[]
        maxClassification: 'public' | 'internal' | 'confidential'
    }
}

// In-memory counter to track tool calls per request
const toolCallCounters = new Map<string, number>()

export const vectorQueryTool = createTool({
    id: 'vector-query',
    description:
        'PgVector query with allowTags + classification filter from the runtime context',
    inputSchema: z.object({
        question: z.string(),
        topK: z.number(),
    }),
    outputSchema: z.object({
        contexts: z.array(
            z.object({
                text: z.string(),
                docId: z.string(),
                versionId: z.string(),
                source: z.string(),
                score: z.number(),
                securityTags: z.array(z.string()),
                classification: z.enum(['public', 'internal', 'confidential']),
            })
        ),
    }),
    execute: async ({ context, runtimeContext, mastra, tracingContext }) => {
        const accessFilter = (
            runtimeContext as RuntimeContext<VectorQueryContext>
        ).get('accessFilter')
        if (!accessFilter) {
            throw new Error('Access filter not found in runtime context')
        }
        const { allowTags, maxClassification } = accessFilter

        // Create a span for tracing
        const span = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.TOOL_CALL,
            name: 'vector-query-tool',
            input: {
                questionLength: context.question.length,
                allowTagsCount: allowTags.length,
                maxClassification,
                topK: context.topK,
            },
        })
        try {
            // Extract request ID from context (may come from agent input)
            let requestId: string
            try {
                // Try to extract requestId if it was passed through the agent
                const contextStr = JSON.stringify(context)
                const requestIdMatch = /REQ-\d+-\w+/.exec(contextStr)
                if (requestIdMatch) {
                    requestId = requestIdMatch[0]
                } else {
                    requestId = `TOOL-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
                }
            } catch (e) {
                // Log the parsing error and fallback to generating our own request ID
                log.warn(
                    'Failed to extract requestId from context, generating fallback requestId',
                    { error: e }
                )
                requestId = `TOOL-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
            }

            // Track and log tool call count
            const currentCount = (toolCallCounters.get(requestId) ?? 0) + 1
            toolCallCounters.set(requestId, currentCount)

            log.info(
                `[${requestId}] 🔧 VECTOR QUERY TOOL CALL #${currentCount}`,
                { context }
            )

            ValidationService.validateEnvironmentVariable(
                'DATABASE_URL',
                process.env.DATABASE_URL
            )
            ValidationService.validateMastraInstance(mastra)

            const store = mastra!.getVector('pgVector')
            ValidationService.validateVectorStore(store)

            const indexName = 'governed_rag'
            const { question, topK = 8 } = context
            // Use environment variable or default for similarity threshold
            const minSimilarity = parseFloat(
                process.env.VECTOR_SIMILARITY_THRESHOLD ?? '0.4'
            )
            log.info('🔧 Extracted parameters', {
                question,
                allowTags,
                maxClassification,
                topK,
                minSimilarity,
            })

            const results = await VectorQueryService.query(
                { question, allowTags, maxClassification, topK, minSimilarity },
                store,
                indexName
            )

            log.info(
                `[${requestId}] ✅ VECTOR QUERY TOOL CALL #${currentCount} COMPLETED - Found ${results.length} results`
            )

            // End tracing span with success
            span?.end({
                output: {
                    success: true,
                    resultCount: results.length,
                    topK: context.topK,
                },
            })

            // Clean up counter if this seems to be the final call (after a short delay to account for any immediate retries)
            setTimeout(() => {
                const finalCount = toolCallCounters.get(requestId) ?? 0
                log.debug(
                    `[${requestId}] 📊 FINAL TOOL CALL COUNT: ${finalCount}`
                )
                toolCallCounters.delete(requestId)
            }, 5000)

            return { contexts: results }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error'

            // Record error in tracing span
            span?.error({
                error: error instanceof Error ? error : new Error(errorMessage),
                metadata: { operation: 'vector-query', topK: context.topK },
            })

            if (error instanceof Error) {
                throw new Error(`Vector query failed: ${error.message}`)
            }
            throw new Error('Vector query failed: Unknown error')
        }
    },
})
