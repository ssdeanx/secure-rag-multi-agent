// Kilocode: Tool Approval
// owner: team-operations
// justification: authorized operations process analysis with tier-based access
// allowedDomains:
//  - operations
//  - vendor
//  - incident
// allowedDataPaths:
//  - /corpus/operations-*.md
//  - /corpus/vendor-*.md
//  - /corpus/security-incident-*.md
// sideEffects:
//  - network: true
//  - write: false
// inputSchema: src/mastra/schemas/tool-schemas.ts::ProcessAnalysisInput
// outputSchema: src/mastra/schemas/tool-schemas.ts::ProcessAnalysisOutput
// approvedBy: TODO
// approvalDate: TODO
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { AISpanType } from '@mastra/core/ai-tracing'
import { VectorQueryService } from '../services/VectorQueryService'
import { log } from '../config/logger'
import type { RuntimeContext } from '@mastra/core/runtime-context'

export interface ProcessAnalysisContext {
    accessFilter: {
        allowTags: string[]
        maxClassification: 'internal' | 'confidential'
    }
    tier: 'pro' | 'enterprise'
    userId: string
}

export const processAnalysisTool = createTool({
    id: 'process-analysis',
    description:
        'Analyze operational processes, vendor management, and incident response procedures',
    inputSchema: z.object({
        question: z.string(),
        processArea: z.enum(['operations', 'vendor', 'incident', 'workflow', 'general']),
        topK: z.number().default(8),
    }),
    outputSchema: z.object({
        processes: z.array(
            z.object({
                text: z.string(),
                docId: z.string(),
                versionId: z.string(),
                source: z.string(),
                score: z.number(),
                securityTags: z.array(z.string()),
                classification: z.enum(['internal', 'confidential']),
                processArea: z.string(),
            })
        ),
    }),
    execute: async ({ context, runtimeContext, mastra, tracingContext }) => {
        const accessFilter = (
            runtimeContext as RuntimeContext<ProcessAnalysisContext>
        ).get('accessFilter')
        if (!accessFilter) {
            throw new Error('Access filter not found in runtime context')
        }
        const { allowTags, maxClassification } = accessFilter

        const tier = (
            runtimeContext as RuntimeContext<ProcessAnalysisContext>
        ).get('tier')
        const userId = (
            runtimeContext as RuntimeContext<ProcessAnalysisContext>
        ).get('userId')
        if (!tier || !userId) {
            throw new Error('Tier and userId required in runtime context')
        }

        const span = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.TOOL_CALL,
            name: 'process-analysis-tool',
            input: {
                questionLength: context.question.length,
                processArea: context.processArea,
                tier,
                allowTagsCount: allowTags.length,
                maxClassification,
                topK: context.topK,
            },
        })

        try {
            log.info(`[process-analysis] Starting process analysis: ${context.processArea}`)

            const store = mastra!.getVector('pgVector')
            const vectorQueryService = new VectorQueryService(store)

            const queryWithContext = `${context.question} (process area: ${context.processArea})`

            const results = await vectorQueryService.queryWithAccessControl(
                queryWithContext,
                context.topK,
                allowTags,
                maxClassification,
                userId
            )

            const processes = results.map((r) => ({
                ...r,
                processArea: context.processArea,
            }))

            span?.addEvent('process_analysis_complete', {
                processesCount: processes.length,
                processArea: context.processArea,
            })
            span?.end({ output: { processesCount: processes.length } })

            log.info(
                `[process-analysis] Process analysis complete: ${processes.length} processes found`
            )

            return { processes }
        } catch (error) {
            log.error('[process-analysis] Error:', error)
            span?.end({ error })
            throw error
        }
    },
})