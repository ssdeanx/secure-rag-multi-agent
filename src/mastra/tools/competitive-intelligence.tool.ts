// Kilocode: Tool Approval
// owner: team-product
// justification: authorized competitive intelligence with tier-based access
// allowedDomains:
//  - sales
//  - marketing
//  - product
// allowedDataPaths:
//  - /corpus/sales-playbook.md
//  - /corpus/marketing-strategy.md
//  - /corpus/product-*.md
// sideEffects:
//  - network: true
//  - write: false
// inputSchema: src/mastra/schemas/tool-schemas.ts::CompetitiveIntelligenceInput
// outputSchema: src/mastra/schemas/tool-schemas.ts::CompetitiveIntelligenceOutput
// approvedBy: TODO
// approvalDate: TODO
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { AISpanType } from '@mastra/core/ai-tracing'
import { VectorQueryService } from '../services/VectorQueryService'

import { log } from '../config/logger'
import type { RuntimeContext } from '@mastra/core/runtime-context'

export interface CompetitiveIntelligenceContext {
    accessFilter: {
        allowTags: string[]
        maxClassification: 'internal' | 'confidential'
    }
    tier: 'pro' | 'enterprise'
    userId: string
}

export const competitiveIntelligenceTool = createTool({
    id: 'competitive-intelligence',
    description:
        'Analyze competitive positioning, market gaps, and differentiation strategies',
    inputSchema: z.object({
        question: z.string(),
        competitorName: z.string().optional(),
        topK: z.number().default(8),
    }),
    outputSchema: z.object({
        intelligence: z.array(
            z.object({
                text: z.string(),
                docId: z.string(),
                versionId: z.string(),
                source: z.string(),
                score: z.number(),
                securityTags: z.array(z.string()),
                classification: z.enum(['internal', 'confidential']),
            })
        ),
    }),
    execute: async ({ context, runtimeContext, mastra, tracingContext }) => {
        const accessFilter = (
            runtimeContext as RuntimeContext<CompetitiveIntelligenceContext>
        ).get('accessFilter')
        if (!accessFilter) {
            throw new Error('Access filter not found in runtime context')
        }
        const { allowTags, maxClassification } = accessFilter

        const tier = (
            runtimeContext as RuntimeContext<CompetitiveIntelligenceContext>
        ).get('tier')
        const userId = (
            runtimeContext as RuntimeContext<CompetitiveIntelligenceContext>
        ).get('userId')
        if (!tier || !userId) {
            throw new Error('Tier and userId required in runtime context')
        }

        const span = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.TOOL_CALL,
            name: 'competitive-intelligence-tool',
            input: {
                questionLength: context.question.length,
                competitorName: context.competitorName,
                tier,
                allowTagsCount: allowTags.length,
                maxClassification,
                topK: context.topK,
            },
        })

        try {
            log.info(`[competitive-intelligence] Starting competitive analysis`)

            const vectorQueryService = new VectorQueryService()

            const queryWithContext = context.competitorName
                ? `${context.question} (competitor: ${context.competitorName})`
                : context.question

            // Define a narrow local type for the VectorQueryService surface we rely on.
            interface VectorQueryServiceType {
                queryWithAccessControl?: (
                    vectorStore: unknown,
                    query: string,
                    topK?: number,
                    allowTags?: string[],
                    maxClassification?: 'internal' | 'confidential',
                    userId?: string
                ) => Promise<unknown[]>
                query?: (
                    vectorStore: unknown,
                    query: string,
                    options?: { topK?: number }
                ) => Promise<unknown[] | { results?: unknown[] }>
            }

            // Use unknown-based typed alias instead of `any`
            const vqs = vectorQueryService as unknown as VectorQueryServiceType

            // Support VectorQueryService implementations that may not expose queryWithAccessControl:
            // - If queryWithAccessControl exists, call it.
            // - Otherwise, try a generic `query` method and apply basic access filtering client-side.
            let results: unknown[] = []
            if (typeof vqs.queryWithAccessControl === 'function') {
                results = await vqs.queryWithAccessControl(
                    mastra!.getVector('pgVector'),
                    queryWithContext,
                    context.topK,
                    allowTags,
                    maxClassification,
                    userId
                )
            } else if (typeof vqs.query === 'function') {
                // Fallback: call basic query and apply simple access control filtering if possible.
                const raw = await vqs.query(mastra!.getVector('pgVector'), queryWithContext, { topK: context.topK })
                results = Array.isArray(raw) ? raw : (raw as { results?: unknown[] })?.results ?? []
                // Client-side filter using expected metadata fields when present.
                results = (results || []).filter((r: unknown) => {
                    const entry = r as Record<string, unknown>
                    const tagsRaw = entry.securityTags
                    const tags: string[] = Array.isArray(tagsRaw) ? (tagsRaw as unknown[]).map(String) : []
                    const classification = String(entry.classification ?? 'internal')
                    const allowedByTag = allowTags.length === 0 || tags.some((t) => allowTags.includes(t))
                    const allowedByClass = classification === 'internal' || maxClassification === 'confidential'
                    return allowedByTag && allowedByClass
                })
            } else {
                throw new Error(
                    'VectorQueryService does not expose queryWithAccessControl or query; update the service or adapt the call site'
                )
            }

            interface RawVectorResult {
                text?: unknown
                docId?: unknown
                versionId?: unknown
                source?: unknown
                score?: unknown
                securityTags?: unknown[]
                classification?: unknown
            }

            interface IntelligenceItem {
                text: string
                docId: string
                versionId: string
                source: string
                score: number
                securityTags: string[]
                classification: 'internal' | 'confidential'
            }

            const intelligence: IntelligenceItem[] = (results as RawVectorResult[]).map((r: RawVectorResult) => {
                const classification: 'internal' | 'confidential' =
                    String(r?.classification) === 'confidential' ? 'confidential' : 'internal'

                const item: IntelligenceItem = {
                    text: String(r?.text ?? ''),
                    docId: String(r?.docId ?? ''),
                    versionId: String(r?.versionId ?? ''),
                    source: String(r?.source ?? ''),
                    score: Number(r?.score ?? 0),
                    securityTags: Array.isArray(r?.securityTags) ? r.securityTags.map(String) : [],
                    classification,
                }

                return item
            })

            // Add DeanMachines.com positioning context
            const deanmachinesContext = {
                business: 'deanmachines.com',
                positioning: 'AI-first, ultra-lean SaaS for governed RAG',
                pricing: {
                    starter: 49,
                    professional: 299,
                    enterprise: 1499,
                },
                advantages: [
                    'Near-zero operating costs (AI-powered)',
                    'Role-based security built-in',
                    'Multi-agent orchestration',
                    'Fair pricing (no $10K+ setup fees)',
                    'Solo founder speed (ship daily)',
                ],
            }

            // Competitive analysis complete
            const spanAny = span as { addEvent?: (name: string, data: Record<string, unknown>) => void }
            spanAny?.addEvent?.('competitive_analysis_complete', {
                intelligenceCount: intelligence.length,
                competitorName: context.competitorName,
                deanmachinesAdvantages: deanmachinesContext.advantages.length,
            })
            span?.end({
                output: {
                    intelligenceCount: intelligence.length,
                    businessContext: 'deanmachines.com',
                }
            })

            return { intelligence }
        } catch (error) {
            const errorSpan = span as { addEvent?: (name: string, data: Record<string, unknown>) => void }
            errorSpan?.addEvent?.('competitive_analysis_error', { message: String(error) })
            span?.end()
            throw error
        }
    },
})

// VectorQueryService implementation is provided by ../services/VectorQueryService.
// The tool uses the imported VectorQueryService at the top of this file to avoid duplicate declarations.
