
cd /home/sam/mastra-governed-rag/src/mastra/tools && \
cat > sales-data-analysis.tool.ts << 'EOF'
// Kilocode: Tool Approval
// owner: team-business
// justification: authorized sales data analysis with tier-based access control
// allowedDomains:
//  - sales
//  - customer-success
//  - marketing
// allowedDataPaths:
//  - /corpus/sales-*.md
//  - /corpus/customer-success-*.md
//  - /corpus/marketing-*.md
// sideEffects:
//  - network: true
//  - write: false
// inputSchema: src/mastra/schemas/tool-schemas.ts::SalesDataAnalysisInput
// outputSchema: src/mastra/schemas/tool-schemas.ts::SalesDataAnalysisOutput
// approvedBy: TODO
// approvalDate: TODO
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { AISpanType } from '@mastra/core/ai-tracing'
import { VectorQueryService } from '../services/VectorQueryService'
import { log } from '../config/logger'
import type { RuntimeContext } from '@mastra/core/runtime-context'

export interface SalesDataAnalysisContext {
    accessFilter: {
        allowTags: string[]
        maxClassification: 'internal' | 'confidential'
    }
    tier: 'pro' | 'enterprise'
    userId: string
}

export const salesDataAnalysisTool = createTool({
    id: 'sales-data-analysis',
    description:
        'Analyze sales playbooks, commission structures, and customer success metrics with tier-based access control',
    inputSchema: z.object({
        question: z.string(),
        analysisType: z.enum(['playbook', 'commission', 'customer-success', 'competitive', 'general']),
        topK: z.number().default(8),
    }),
    outputSchema: z.object({
        insights: z.array(
            z.object({
                text: z.string(),
                docId: z.string(),
                versionId: z.string(),
                source: z.string(),
                score: z.number(),
                securityTags: z.array(z.string()),
                classification: z.enum(['internal', 'confidential']),
                analysisType: z.string(),
            })
        ),
    }),
    execute: async ({ context, runtimeContext, mastra, tracingContext }) => {
        const accessFilter = (
            runtimeContext as RuntimeContext<SalesDataAnalysisContext>
        ).get('accessFilter')
        if (!accessFilter) {
            throw new Error('Access filter not found in runtime context')
        }
        const { allowTags, maxClassification } = accessFilter

        const tier = (
            runtimeContext as RuntimeContext<SalesDataAnalysisContext>
        ).get('tier')
        const userId = (
            runtimeContext as RuntimeContext<SalesDataAnalysisContext>
        ).get('userId')
        if (!tier || !userId) {
            throw new Error('Tier and userId required in runtime context')
        }

        // Pro tier cannot access confidential commission structures
        if (tier === 'pro' && context.analysisType === 'commission') {
            return {
                insights: [],
            }
        }

        const span = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.TOOL_CALL,
            name: 'sales-data-analysis-tool',
            input: {
                questionLength: context.question.length,
                analysisType: context.analysisType,
                tier,
                allowTagsCount: allowTags.length,
                maxClassification,
                topK: context.topK,
            },
        })

        try {
            log.info(`[sales-data-analysis] Starting sales analysis: ${context.analysisType}`)

            const store = mastra!.getVector('pgVector')
            const vectorQueryService = new VectorQueryService(store)

            const queryWithContext = `${context.question} (analysis type: ${context.analysisType})`

            const results = await vectorQueryService.queryWithAccessControl(
                queryWithContext,
                context.topK,
                allowTags,
                maxClassification,
                userId
            )

            const insights = results.map((r) => ({
                ...r,
                analysisType: context.analysisType,
            }))

            span?.addEvent('analysis_complete', {
                insightsCount: insights.length,
                analysisType: context.analysisType,
            })
            span?.end({ output: { insightsCount: insights.length } })

            log.info(
                `[sales-data-analysis] Analysis complete: ${insights.length} insights found`
            )

            return { insights }
        } catch (error) {
            log.error('[sales-data-analysis] Error:', error)
            span?.end({ error })
            throw error
        }
    },
})
