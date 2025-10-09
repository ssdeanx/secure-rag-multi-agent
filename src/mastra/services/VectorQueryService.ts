import { embedMany } from 'ai'

import { ValidationService } from './ValidationService'
import { RoleService } from './RoleService'
import { log } from '../config/logger'
import type { PgVector } from '@mastra/pg'
import { google } from '@ai-sdk/google'

export interface QueryInput {
    question: string
    allowTags: string[]
    maxClassification: 'public' | 'internal' | 'confidential'
    topK?: number
    minSimilarity?: number
}

export interface QueryResult {
    text: string
    docId: string
    versionId: string
    source: string
    score: number
    securityTags: string[]
    classification: 'public' | 'internal' | 'confidential'
}

export interface SecurityFilters {
    allowedClasses: string[]
    allowTags: string[]
}

// Define interface for vector store to replace 'any' usage
interface VectorStoreQueryResult {
    score: number
    metadata: {
        text: string
        docId: string
        versionId: string
        source: string
        securityTags: string[]
        classification: string
    }
}

// VectorStore implementations vary between providers (pgvector, qdrant, etc.).
// Provide a narrow, explicit type instead of `any` to satisfy linting rules
// while still describing common operations used by this service.
// Note: we intentionally avoid a strict compile-time interface here so the
// service can work with multiple concrete vector store implementations
// (pgVector, Qdrant, custom adapters). We accept `unknown` at the call-site
// and adapt to the store's expected payload shape at runtime.

function normalizePgVectorResults(raw: unknown): VectorStoreQueryResult[] {
    // Helper to normalize multiple common response shapes into our VectorStoreQueryResult[]
    const mapItem = (item: any): VectorStoreQueryResult => {
        // Score: several libs use "score", "similarity", or "distance" (distance -> convert to similarity if needed)
        let score = 0
        if (typeof item?.score === 'number') {
            score = item.score
        } else if (typeof item?.similarity === 'number') {
            score = item.similarity
        } else if (typeof item?.distance === 'number') {
            // heuristic: if distance in [0, +inf), convert to similarity in [0,1]
            // this is conservative — caller can tune minSimilarity
            const d = item.distance
            score = d >= 1 ? 0 : 1 - d // simplistic fallback
        }

        // Metadata extraction - handle different keys used by store implementations
        const meta = item?.metadata ?? item?.payload ?? item?.doc ?? item

        // Normalize securityTags to string[]
        let securityTags: string[] = []
        if (Array.isArray(meta?.securityTags)) {
            securityTags = meta.securityTags as string[]
        } else if (typeof meta?.securityTags === 'string') {
            securityTags = (meta.securityTags as string)
                .split(',')
                .map((s) => s.trim())
        }

        const classification =
            typeof meta?.classification === 'string'
                ? meta.classification
                : (securityTags
                      .find((t) => t.startsWith('classification:'))
                      ?.split(':')[1] ?? 'public')

        return {
            score: Number(score ?? 0),
            metadata: {
                text: String(meta?.text ?? meta?.content ?? ''),
                docId: String(meta?.docId ?? meta?.id ?? 'unknown'),
                versionId: String(
                    meta?.versionId ?? meta?.version ?? 'unknown'
                ),
                source: String(meta?.source ?? meta?.origin ?? 'unknown'),
                securityTags,
                classification,
            },
        }
    }

    if (Array.isArray(raw)) {
        return raw.map(mapItem)
    }

    // Common wrapper fields
    const arr =
        (raw as any)?.results ??
        (raw as any)?.hits ??
        (raw as any)?.items ??
        (raw as any)?.rows
    if (Array.isArray(arr)) {
        return arr.map(mapItem)
    }

    // If it's an object with numeric keys or single item, attempt to map as single-entry array
    if ((raw as any) && typeof raw === 'object') {
        // try to find nested array values
        for (const k of Object.keys(raw as Record<string, unknown>)) {
            const v = (raw as any)[k]
            if (Array.isArray(v)) {
                return v.map(mapItem)
            }
        }
    }

    // Unknown shape -> return empty
    return []
}

export class VectorQueryService {
    static buildSecurityFilters(
        allowTags: string[],
        maxClassification: 'public' | 'internal' | 'confidential'
    ): SecurityFilters {
        const allowedClasses: string[] = []

        if (
            maxClassification === 'public' ||
            maxClassification === 'internal' ||
            maxClassification === 'confidential'
        ) {
            allowedClasses.push('classification:public')
        }
        if (
            maxClassification === 'internal' ||
            maxClassification === 'confidential'
        ) {
            allowedClasses.push('classification:internal')
        }
        if (maxClassification === 'confidential') {
            allowedClasses.push('classification:confidential')
        }

        return {
            allowedClasses,
            allowTags,
        }
    }

    static async generateQueryEmbedding(question: string): Promise<number[]> {
        const { embeddings } = await embedMany({
            model: google.textEmbedding('gemini-embedding-001'),
            values: [question],
        })
        return embeddings[0] as number[]
    }

    static async searchWithFilters(
        embedding: number[],
        filters: SecurityFilters,
        vectorStore: PgVector,
        indexName: string,
        topK: number,
        minSimilarity = 0.4
    ): Promise<QueryResult[]> {
        log.info('🔍 Applying query filters', { filters })
        log.info('🔍 Classification filters', {
            allowedClasses: filters.allowedClasses,
        })
        log.info('🔍 Role filters', { allowTags: filters.allowTags })

        // Separate role tags from tenant tags for proper filtering
        const userRoleTags = filters.allowTags.filter((tag) =>
            tag.startsWith('role:')
        )
        const userTenantTags = filters.allowTags.filter((tag) =>
            tag.startsWith('tenant:')
        )

        // Extract role names from role tags (remove 'role:' prefix)
        const userRoles = userRoleTags.map((tag) => tag.replace('role:', ''))

        log.info('🔍 HIERARCHICAL ACCESS CONTROL', {
            originalRoles: userRoles,
            roleAccessInfo: RoleService.formatRolesForLogging(userRoles),
            classificationAccess: filters.allowedClasses,
            tenantAccess: userTenantTags,
        })

        // Build proper Qdrant filter with correct security logic
        const qdrantFilter: {
            must: Array<{ key: string; match: { any: string[] } }>
        } = {
            must: [
                // MUST match allowed classification level
                {
                    key: 'securityTags',
                    match: {
                        any: filters.allowedClasses,
                    },
                },
            ],
        }

        // HIERARCHICAL ROLE-BASED ACCESS CONTROL
        // Use role hierarchy to expand user's effective roles
        if (userRoles.length > 0) {
            const accessInfo = RoleService.generateAccessTags(userRoles)
            const effectiveRoleTags = accessInfo.expandedRoles.map(
                (role) => `role:${role}`
            )

            log.info('🔍 EXPANDED ROLE ACCESS', {
                originalRoles: userRoles,
                effectiveRoles: accessInfo.expandedRoles,
                queryTags: effectiveRoleTags,
            })

            // Documents must have at least ONE role that the user can access (including inherited roles)
            qdrantFilter.must.push({
                key: 'securityTags',
                match: {
                    any: effectiveRoleTags,
                },
            })
        } else {
            // If user has no roles, they can only access documents marked as public
            log.info('🔍 User has no roles - restricting to public-only access')
            qdrantFilter.must.push({
                key: 'securityTags',
                match: {
                    any: ['role:public'],
                },
            })
        }

        // Add tenant filtering as additional requirement
        if (userTenantTags.length > 0) {
            qdrantFilter.must.push({
                key: 'securityTags',
                match: {
                    any: userTenantTags,
                },
            })
        }

        log.info('🔍 Query configuration', {
            qdrantFilter,
            minSimilarity,
        })

        // For this project we only support PgVector. Call the PgVector query
        // with the shaped payload PgVector expects.
        let results: VectorStoreQueryResult[] = []

        try {
            const raw: unknown = await (
                vectorStore as unknown as { query: Function }
            ).query({
                indexName,
                queryVector: embedding,
                topK,
                filter: qdrantFilter,
                includeVector: false,
            })
            results = normalizePgVectorResults(raw)
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            log.error('PgVector query failed', { message })
            throw new Error('Vector store query failed: ' + message)
        }

        log.info(
            `🔍 Query returned ${results?.length ?? 0} results before similarity filtering`
        )

        if (results.length === 0) {
            log.info(
                '🔍 Access Control Summary - No accessible documents found (properly restricted)',
                {
                    userRoles: userRoleTags,
                    userTenant: userTenantTags,
                    maxClassification: filters.allowedClasses,
                }
            )
            return []
        }

        // Apply similarity threshold filtering
        const similarityFilteredResults = results.filter(
            (r: VectorStoreQueryResult) => {
                const score = r.score ?? 0
                log.debug(
                    `🔍 Document ${r.metadata?.docId}: score=${score.toFixed(3)}, threshold=${minSimilarity}, ${score >= minSimilarity ? 'KEEP' : 'FILTER_OUT'}`
                )
                return score >= minSimilarity
            }
        )

        log.info(
            `🔍 After similarity filtering (>=${minSimilarity}): ${similarityFilteredResults.length}/${results.length} documents kept`
        )

        if (similarityFilteredResults.length === 0) {
            log.info(
                '🔍 Relevance Control Summary - No relevant documents found',
                {
                    securityPassed: results.length,
                    similarityThreshold: minSimilarity,
                    highestScore: Math.max(
                        ...results.map(
                            (r: VectorStoreQueryResult) => r.score ?? 0
                        )
                    ).toFixed(3),
                }
            )
            return []
        }

        // Get user's expanded roles for validation
        const accessInfo =
            userRoles.length > 0
                ? RoleService.generateAccessTags(userRoles)
                : { expandedRoles: [] }

        // Log successful access control summary
        log.info('🔍 ACCESS CONTROL VALIDATION (with hierarchy)', {
            documentsRetrieved: similarityFilteredResults.length,
            userEffectiveRoles: accessInfo.expandedRoles,
            userTenant: userTenantTags,
        })

        return similarityFilteredResults.map(
            (r: VectorStoreQueryResult, index: number) => {
                let securityTags: string[] = []

                if (Array.isArray(r.metadata?.securityTags)) {
                    securityTags = r.metadata.securityTags
                } else if (typeof r.metadata?.securityTags === 'string') {
                    securityTags = (r.metadata.securityTags as string)
                        .split(',')
                        .map((tag: string) => tag.trim())
                }

                // Extract document roles and validate user access using hierarchy
                const docRoles = securityTags
                    .filter((tag) => tag.startsWith('role:'))
                    .map((tag) => tag.replace('role:', ''))
                const docClassification = securityTags.find((tag) =>
                    tag.startsWith('classification:')
                )
                const hasValidRoleAccess = RoleService.canAccessDocument(
                    userRoles,
                    securityTags.filter((tag) => tag.startsWith('role:'))
                )

                log.debug(
                    `🔍 HIERARCHICAL ACCESS CHECK - Doc ${index + 1} (${r.metadata?.docId})`,
                    {
                        documentRoles: docRoles,
                        classification: docClassification,
                        userAccess: hasValidRoleAccess ? 'GRANTED' : 'DENIED',
                        score: r.score,
                    }
                )

                // Enhanced security validation using role hierarchy
                if (!hasValidRoleAccess && docRoles.length > 0) {
                    log.warn(
                        `⚠️ SECURITY WARNING: Document ${r.metadata?.docId} was retrieved but user lacks access!`,
                        {
                            documentRequiredRoles: docRoles,
                            userEffectiveRoles: accessInfo.expandedRoles,
                        }
                    )

                    // Additional debugging - show what roles could access this document
                    const accessibleRoles =
                        RoleService.getDocumentAccessibleRoles(docRoles)
                    log.warn(
                        `Roles that CAN access this doc: [${accessibleRoles.join(', ')}]`
                    )
                }

                return {
                    text: String(r.metadata?.text ?? ''),
                    docId: String(r.metadata?.docId ?? 'unknown'),
                    versionId: r.metadata?.versionId
                        ? String(r.metadata.versionId)
                        : 'unknown',
                    source: r.metadata?.source
                        ? String(r.metadata.source)
                        : 'unknown',
                    score: r.score ?? 0,
                    securityTags,
                    classification:
                        (r.metadata?.classification as
                            | 'public'
                            | 'internal'
                            | 'confidential') || 'public',
                }
            }
        )
    }

    static async query(
        input: QueryInput,
        vectorStore: PgVector,
        indexName: string
    ): Promise<QueryResult[]> {
        ValidationService.validateQuestion(input.question)
        ValidationService.validateAccessTags(input.allowTags)
        ValidationService.validateVectorStore(vectorStore)

        const filters: SecurityFilters = this.buildSecurityFilters(
            input.allowTags,
            input.maxClassification
        )
        const embedding = await this.generateQueryEmbedding(input.question)

        return await this.searchWithFilters(
            embedding,
            filters,
            vectorStore,
            indexName,
            input.topK ?? 8,
            input.minSimilarity ?? 0.4
        )
    }
}
