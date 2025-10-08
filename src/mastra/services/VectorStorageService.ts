import { log, logProgress } from '../config/logger'
import { pgVector } from '../config/pg-storage'

export interface VectorMetadata {
    [key: string]: unknown
    text: string
    docId: string
    chunkIndex: number
    securityTags: string[] // Changed to string array for proper Qdrant filtering
    versionId: string
    timestamp: string
}

export interface StorageBatch {
    vectors: number[][]
    metadata: VectorMetadata[]
    batchIndex: number
    totalBatches: number
}

export interface StorageOptions {
    batchSize?: number
    maxRetries?: number
    retryDelay?: number
}

export interface StorageResult {
    totalVectors: number
    batchesProcessed: number
    errors: string[]
    success: boolean
}

export class VectorStorageService {
    private readonly defaultOptions: Required<StorageOptions>

    constructor(options: Partial<StorageOptions> = {}) {
        this.defaultOptions = {
            batchSize: 200,
            maxRetries: 3,
            retryDelay: 1000,
            ...options,
        }
    }

    /**
     * Store vectors in batches to prevent memory issues and handle failures gracefully
     */

    async storeVectorsBatched(
        chunks: string[],
        embeddings: number[][],
        docId: string,
        securityTags: string[],
        versionId: string,
        timestamp: string,
        vectorStore: unknown,
        indexName: string,
        options: StorageOptions = {}
    ): Promise<StorageResult> {
        const opts = { ...this.defaultOptions, ...options }
        const { batchSize } = opts

        if (chunks.length !== embeddings.length) {
            throw new Error(
                `Chunks and embeddings length mismatch: ${chunks.length} vs ${embeddings.length}`
            )
        }

        log.info(
            `Storing ${embeddings.length} vectors in batches of ${batchSize}`
        )

        // Create metadata for all vectors
        const metadata = this.createMetadata(
            chunks,
            docId,
            securityTags,
            versionId,
            timestamp
        )

        // Create batches
        const batches = this.createStorageBatches(
            embeddings,
            metadata,
            batchSize
        )

        const errors: string[] = []
        let successfulBatches = 0

        for (let i = 0; i < batches.length; i++) {
            logProgress(`Processing batch ${i + 1}`, i + 1, batches.length)

            try {
                await this.storeSingleBatch(
                    batches[i],
                    vectorStore,
                    indexName,
                    opts
                )
                successfulBatches++
                log.info(
                    `Successfully stored batch ${i + 1} of ${batches.length}`
                )
                // Small delay between batches to prevent overwhelming the vector store
                if (i < batches.length - 1) {
                    await new Promise((resolve) => setTimeout(resolve, 100))
                }
            } catch (error) {
                const errorMsg = `Failed to store batch ${i + 1}: ${error instanceof Error ? error.message : String(error)}`
                log.error(errorMsg)
                errors.push(errorMsg)
            }
        }

        const totalVectors =
            successfulBatches * batchSize +
            (batches.length > successfulBatches
                ? batches[batches.length - 1].vectors.length
                : 0)

        return {
            totalVectors,
            batchesProcessed: successfulBatches,
            errors,
            success: errors.length === 0,
        }
    }

    /**
     * Store all vectors at once (for smaller documents)
     */

    async storeVectorsAll(
        chunks: string[],
        embeddings: number[][],
        docId: string,
        securityTags: string[],
        versionId: string,
        timestamp: string,
        vectorStore: unknown,
        indexName?: string
    ): Promise<StorageResult> {
        log.info(`Storing ${embeddings.length} vectors as single batch`)

        try {
            // Use deterministic ids for each chunk so vectors can be referenced/overwritten later
            const ids = chunks.map((_: unknown, i: number) =>
                this.generateVectorId(docId, i)
            )
            const metadata = this.createMetadata(
                chunks,
                docId,
                securityTags,
                versionId,
                timestamp
            )

            log.info(`Upserting ${embeddings.length} vectors for ${docId}`, {
                idsCount: ids.length,
            })

            // Prefer the provided vectorStore if it exposes an upsert API,
            // otherwise fall back to pgVector (pg-storage).
            const targetIndex = indexName ?? 'governed_rag'

            if (hasUpsert(vectorStore)) {
                await vectorStore.upsert({
                    indexName: targetIndex,
                    ids,
                    vectors: embeddings,
                    metadata,
                })
            } else if (hasUpsert(pgVector)) {
                const result = await pgVector.upsert({
                    indexName: targetIndex,
                    ids,
                    vectors: embeddings,
                    metadata,
                })

                log.info(
                    `Successfully stored ${embeddings.length} chunks for document ${docId} to ${result}`
                )
            } else {
                const msg =
                    'No supported upsert API found on provided vector store or pgVector fallback'
                log.error(msg)
                throw new Error(msg)
            }

            // Keep return consistent when using a custom vector store
            return {
                success: true,
                totalVectors: embeddings.length,
                batchesProcessed: 1,
                errors: [],
            }
        } catch (error) {
            const errorMsg = `Failed to store vectors: ${error instanceof Error ? error.message : String(error)}`
            log.error(errorMsg)

            return {
                totalVectors: 0,
                batchesProcessed: 0,
                errors: [errorMsg],
                success: false,
            }
        }
    }

    /**
     * Main storage method - automatically selects best strategy based on size
     */

    async storeVectors(
        chunks: string[],
        embeddings: number[][],
        docId: string,
        securityTags: string[],
        versionId: string,
        timestamp: string,
        vectorStore: unknown,
        indexName: string,
        options: StorageOptions = {}
    ): Promise<StorageResult> {
        // For smaller documents, store all at once
        // For larger documents, use batching
        if (embeddings.length <= 500) {
            // pass indexName through so storeVectorsAll can use it when calling the target store
            return this.storeVectorsAll(
                chunks,
                embeddings,
                docId,
                securityTags,
                versionId,
                timestamp,
                vectorStore,
                indexName
            )
        } else {
            return this.storeVectorsBatched(
                chunks,
                embeddings,
                docId,
                securityTags,
                versionId,
                timestamp,
                vectorStore,
                indexName,
                options
            )
        }
    }

    /**
     * Store a single batch with retry logic
     */

    private async storeSingleBatch(
        batch: StorageBatch,
        vectorStore: unknown,
        indexName: string,
        options: StorageOptions = {}
    ): Promise<void> {
        log.info(
            `Processing batch ${batch.batchIndex}: ${batch.vectors.length} vectors`
        )
        const { maxRetries, retryDelay } = {
            ...this.defaultOptions,
            ...options,
        }
        let lastError: Error | null = null

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Prefer provided vector store if it supports upsert, otherwise fallback to pgVector
                if (hasUpsert(vectorStore)) {
                    await vectorStore.upsert({
                        indexName,
                        vectors: batch.vectors,
                        metadata: batch.metadata,
                    })
                    return // Success
                }

                if (hasUpsert(pgVector)) {
                    await pgVector.upsert({
                        indexName,
                        vectors: batch.vectors,
                        metadata: batch.metadata,
                    })
                    return // Success
                }

                // No upsert API found — raise immediately
                throw new Error(
                    'No supported upsert API available on provided vector store or pgVector'
                )
            } catch (error) {
                lastError =
                    error instanceof Error ? error : new Error(String(error))

                if (attempt < maxRetries) {
                    log.warn(
                        `Batch ${batch.batchIndex} attempt ${attempt} failed, retrying in ${retryDelay}ms: ${lastError.message}`
                    )
                    await new Promise((resolve) =>
                        setTimeout(resolve, retryDelay)
                    )
                }
            }
        }

        throw lastError ?? new Error('Unknown error during batch storage')
    }

    /**
     * Generate deterministic ID for a vector based on docId and chunk index
     */

    private generateVectorId(docId: string, chunkIndex: number): string {
        return `${docId}_chunk_${chunkIndex}`
    }

    /**
     * Delete all existing vectors for a specific document
     * Note: Mastra QdrantVector doesn't support individual vector deletion,
     * so we skip this step. Upsert will naturally overwrite existing vectors.
     */

    async deleteVectorsByDocId(
        docId: string,
        vectorStore: unknown,
        indexName: string
    ): Promise<{ deleted: number; success: boolean; error?: string }> {
        // Try to use the provided vector store to remove vectors for the docId.
        // Support a few common API shapes: deleteByFilter, delete(ids), or query+delete.
        const targetIndex =
            indexName ?? process.env.QDRANT_COLLECTION ?? 'governed_rag'
        try {
            if (hasDeleteByFilter(vectorStore)) {
                await vectorStore.deleteByFilter({
                    indexName: targetIndex,
                    filter: {
                        must: [
                            {
                                key: 'docId',
                                match: { any: [docId] },
                            },
                        ],
                    },
                })
                return { deleted: -1, success: true } // -1 indicates unknown count but success
            }

            if (hasQueryAndDelete(vectorStore)) {
                const results = await vectorStore.query({
                    indexName: targetIndex,
                    filter: {
                        must: [
                            {
                                key: 'docId',
                                match: { any: [docId] },
                            },
                        ],
                    },
                    topK: 100000,
                    includeVector: false,
                })

                const ids = (results ?? [])
                    .map((r: { id: string }) => r.id)
                    .filter(Boolean)
                if (ids.length > 0) {
                    await vectorStore.delete({
                        indexName: targetIndex,
                        ids,
                    })
                    return { deleted: ids.length, success: true }
                }
                return { deleted: 0, success: true }
            }

            if (hasDeleteByFilter(pgVector)) {
                await pgVector.deleteByFilter({
                    indexName: targetIndex,
                    filter: {
                        must: [
                            {
                                key: 'docId',
                                match: { any: [docId] },
                            },
                        ],
                    },
                })
                return { deleted: -1, success: true }
            }

            // Nothing to do - log and return success (no-op)
            log.info(
                `🗑️ Skipping vector deletion for ${docId} - no supported deletion API found on provided store`
            )
            return { deleted: 0, success: true }
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error)
            log.error(`Failed to delete vectors for ${docId}: ${msg}`)
            return { deleted: 0, success: false, error: msg }
        }
    }

    /**
     * Create metadata objects for all chunks
     */

    private createMetadata(
        chunks: string[],
        docId: string,
        securityTags: string[],
        versionId: string,
        timestamp: string
    ): VectorMetadata[] {
        return chunks.map((chunk: string, i: number) => ({
            text: chunk,
            docId,
            chunkIndex: i,
            securityTags, // Store as array for proper Qdrant filtering
            versionId,
            timestamp,
        }))
    }

    /**
     * Create storage batches from vectors and metadata
     */

    private createStorageBatches(
        vectors: number[][],
        metadata: VectorMetadata[],
        batchSize: number
    ): StorageBatch[] {
        const batches: StorageBatch[] = []
        const totalBatches = Math.ceil(vectors.length / batchSize)

        for (let i = 0; i < vectors.length; i += batchSize) {
            const batchVectors = vectors.slice(i, i + batchSize)
            const batchMetadata = metadata.slice(i, i + batchSize)

            batches.push({
                vectors: batchVectors,
                metadata: batchMetadata,
                batchIndex: Math.floor(i / batchSize) + 1,
                totalBatches,
            })
        }

        return batches
    }

    /**
     * Validate storage inputs
     */

    validateStorageInputs(
        chunks: string[],
        embeddings: number[][],
        docId: string,
        securityTags: string[],
        versionId: string,
        timestamp: string
    ): void {
        if (chunks.length === 0) {
            throw new Error('Chunks array cannot be empty')
        }

        if (embeddings.length === 0) {
            throw new Error('Embeddings array cannot be empty')
        }

        if (chunks.length !== embeddings.length) {
            throw new Error(
                `Chunks and embeddings length mismatch: ${chunks.length} vs ${embeddings.length}`
            )
        }

        if (!docId || docId.trim().length === 0) {
            throw new Error('Document ID cannot be empty')
        }

        if (!versionId || versionId.trim().length === 0) {
            throw new Error('Version ID cannot be empty')
        }

        if (!timestamp || timestamp.trim().length === 0) {
            throw new Error('Timestamp cannot be empty')
        }

        if (securityTags.length === 0) {
            throw new Error('Security tags cannot be empty')
        }
    }

    /**
     * Estimate storage operation complexity
     */

    estimateStorageComplexity(
        vectorCount: number,
        batchSize: number = this.defaultOptions.batchSize
    ): {
        batches: number
        estimatedTimeMinutes: number
        recommendation: string
    } {
        const batches = Math.ceil(vectorCount / batchSize)

        // Rough estimate: ~1-2 seconds per batch including delays
        const estimatedTimeMinutes: number = (batches * 1.5) / 60

        let recommendation = 'Use default settings'
        if (batches > 50) {
            recommendation =
                'Consider increasing batch size to 200-500 for better performance'
        } else if (batches > 100) {
            recommendation =
                'Use larger batch sizes (500+) and consider parallel processing'
        }

        return {
            batches,
            estimatedTimeMinutes: Math.ceil(estimatedTimeMinutes * 10) / 10, // Round to 1 decimal
            recommendation,
        }
    }
}

function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null
}

function hasUpsert(v: unknown): v is { upsert: Function } {
    return isObject(v) && typeof v['upsert'] === 'function'
}

function hasDeleteByFilter(v: unknown): v is { deleteByFilter: Function } {
    return isObject(v) && typeof v['deleteByFilter'] === 'function'
}

function hasQueryAndDelete(v: unknown): v is {
    query: Function
    delete: Function
} {
    return (
        isObject(v) &&
        typeof v['query'] === 'function' &&
        typeof v['delete'] === 'function'
    )
}
