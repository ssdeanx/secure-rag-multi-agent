// Kilocode: Tool Approval
// owner: team-legal
// justification: authorized compliance checking with enterprise-only access
// allowedDomains:
//  - legal
//  - compliance
//  - security
// allowedDataPaths:
//  - /corpus/legal-*.md
//  - /corpus/compliance-*.md
//  - /corpus/intellectual-property-*.md
//  - /corpus/security-incident-*.md
// sideEffects:
//  - network: true
//  - write: false
// inputSchema: src/mastra/schemas/tool-schemas.ts::ComplianceCheckInput
// outputSchema: src/mastra/schemas/tool-schemas.ts::ComplianceCheckOutput
// approvedBy: TODO
// approvalDate: TODO
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { AISpanType } from '@mastra/core/ai-tracing'
import { VectorQueryService } from '../services/VectorQueryService'
import { log } from '../config/logger'
import type { RuntimeContext } from '@mastra/core/runtime-context'

export interface ComplianceCheckContext {
    accessFilter: {
        allowTags: string[]
        maxClassification: 'confidential'
    }
    tier: 'enterprise'
    userId: string
}

export const complianceCheckTool = createTool({
    id: 'compliance-check',
    description:
        'Check compliance policies, legal contracts, and regulatory requirements (Enterprise only)',
    inputSchema: z.object({
        question: z.string(),
        complianceArea: z.enum(['contracts', 'regulatory', 'ip', 'security', 'general']),
        topK: z.number().default(8),
    }),
    outputSchema: z.object({
        policies: z.array(
            z.object({
                text: z.string(),
                docId: z.string(),
                versionId: z.string(),
                source: z.string(),
                score: z.number(),
                securityTags: z.array(z.string()),
                classification: z.literal('confidential'),
                complianceArea: z.string(),
            })
        ),
    }),
    execute: async ({ context, runtimeContext, mastra, tracingContext }) => {
        const accessFilter = (
            runtimeContext as RuntimeContext<ComplianceCheckContext>
        ).get('accessFilter')
        if (!accessFilter) {
            throw new Error('Access filter not found in runtime context')
        }
        const { allowTags, maxClassification } = accessFilter

        const tier = (
            runtimeContext as RuntimeContext<ComplianceCheckContext>
        ).get('tier')
        const userId = (
            runtimeContext as RuntimeContext<ComplianceCheckContext>
        ).get('userId')
        if (!tier || !userId) {
            throw new Error('Tier and userId required in runtime context')
        }

        // Compliance check is Enterprise-only
        if (tier !== 'enterprise') {
            throw new Error('Compliance check requires Enterprise tier')
        }

        const span = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.TOOL_CALL,
            name: 'compliance-check-tool',
            input: {
                questionLength: context.question.length,
                complianceArea: context.complianceArea,
                tier,
                allowTagsCount: allowTags.length,
                maxClassification,
                topK: context.topK,
            },
        })

        try {
            log.info(`[compliance-check] Starting compliance check: ${context.complianceArea}`)

            const store = mastra!.getVector('pgVector')
            const vectorQueryService = new VectorQueryService(store)

            const queryWithContext = `${context.question} (compliance area: ${context.complianceArea})`

            const results = await vectorQueryService.queryWithAccessControl(
                queryWithContext,
                context.topK,
                allowTags,
                maxClassification,
                userId
            )

            const policies = results.map((r) => ({
                ...r,
                classification: 'confidential' as const,
                complianceArea: context.complianceArea,
            }))

            span?.addEvent('compliance_check_complete', {
                policiesCount: policies.length,
                complianceArea: context.complianceArea,
            })
            span?.end({ output: { policiesCount: policies.length } })

            log.info(
                `[compliance-check] Compliance check complete: ${policies.length} policies found`
            )

            return { policies }
        } catch (error) {
            log.error('[compliance-check] Error:', error)
            span?.end({ error })
            throw error
        }
    },
})