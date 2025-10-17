import { Memory } from '@mastra/memory'
import { embedMany } from 'ai'

import { log } from '../config/logger'
import { generateEmbeddings as pgGenerateEmbeddings } from '../config/pg-storage'
import { google } from '@ai-sdk/google'
import { googleAIEmbedding } from '../config/google'

const MAX_RETRIES = 3

export interface EmbeddingBatch {
    chunks: string[]
    embeddings: number[][]
    batchIndex: number
    totalBatches: number
}

export interface EmbeddingOptions {
    batchSize?: number
    maxRetries?: number
    model?: string
    useCache?: boolean
}

export interface EmbeddingResult {
    embeddings: number[][]
    chunks: string[]
    totalChunks: number
    batchesProcessed: number
    dimension: number
}

// Add a typed normalized error shape to avoid `any`
interface NormalizedError {
    [key: string]: unknown
    message?: string
    name?: string
    stack?: string
    // allow carrying through other fields safely
}

export class EmbeddingService {
    private readonly memory: Memory
    private readonly defaultOptions: Required<EmbeddingOptions>

    constructor(options: Partial<EmbeddingOptions> = {}) {
        this.defaultOptions = {
            batchSize: 200,
            maxRetries: 3,
            model: process.env.EMBEDDING_MODEL ?? 'gemini-embedding-001',
            useCache: true,
            ...options,
        }

        // Initialize Memory instance for native embedding with caching
        this.memory = new Memory({
            embedder: google.textEmbedding('gemini-embedding-001'),
        })
    }

    /**
     * Generate embeddings using pg-storage optimized implementation
     * This is the recommended method as it uses the shared pg-storage configuration
     */
    async generateEmbeddings(chunks: string[]): Promise<EmbeddingResult> {
        log.info(
            `Using pg-storage generateEmbeddings for ${chunks.length} chunks`,
            { service: 'EMBEDDING_SERVICE', chunkCount: chunks.length }
        )

        const chunkData = chunks.map((text, i) => ({ text, id: `chunk-${i}` }))
        const { embeddings } = await pgGenerateEmbeddings(chunkData)

        const typedEmbeddings = embeddings as number[][]
        const dimension =
            typedEmbeddings.length > 0 ? typedEmbeddings[0].length : 3072 // Updated fallback for text-embedding-3-large

        return {
            embeddings: typedEmbeddings,
            chunks,
            totalChunks: chunks.length,
            batchesProcessed: 1,
            dimension,
        }
    }

    /**
     * Generate embeddings using Mastra's native implementation with caching
     * This method uses Mastra's built-in caching and retry logic
     * @deprecated Use generateEmbeddings() instead which uses pg-storage
     */

    async generateEmbeddingsNative(chunks: string[]): Promise<EmbeddingResult> {
        log.info(
            `Generating embeddings using Mastra native implementation for ${chunks.length} chunks`,
            { service: 'EMBEDDING_SERVICE', chunkCount: chunks.length }
        )

        // Use the standard AI SDK embedMany function since Memory might not be properly configured
        // The Memory instance requires more complex setup that we don't need for just chunking
        const { embeddings } = await embedMany({
            model: google.textEmbedding('gemini-embedding-001'),
            values: chunks,
            maxRetries: this.defaultOptions.maxRetries,
        })

        const typedEmbeddings = embeddings as number[][]
        const dimension =
            typedEmbeddings.length > 0 ? typedEmbeddings[0].length : 0

        return {
            embeddings: typedEmbeddings,
            chunks,
            totalChunks: chunks.length,
            batchesProcessed: 1, // Single batch with AI SDK
            dimension,
        }
    }

    /**
     * Generate embeddings with manual batching for very large documents
     * Useful when you need more control over memory usage
     */

    async generateEmbeddingsBatched(
        chunks: string[],
        options: EmbeddingOptions = {}
    ): Promise<EmbeddingResult> {
        const opts = { ...this.defaultOptions, ...options }
        const { batchSize, maxRetries } = opts
        log.info(
            `Generating embeddings in batches of ${batchSize} for ${chunks.length} chunks`,
            {
                service: 'EMBEDDING_SERVICE',
                batchSize,
                totalChunks: chunks.length,
            }
        )

        const allEmbeddings: number[][] = []
        const batches = this.createBatches(chunks, batchSize)
        let dimension = 0

        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i]
            log.info(
                `Processing batch ${i + 1}/${batches.length} (${batch.length} chunks)`,
                { service: 'EMBEDDING_SERVICE', batchIndex: i + 1 }
            )

            try {
                const { embeddings } = await embedMany({
                    model: google.textEmbedding('gemini-embedding-001'),
                    values: batch,
                    maxRetries,
                })

                const typedEmbeddings = embeddings as number[][]
                allEmbeddings.push(...typedEmbeddings)

                if (!dimension && typedEmbeddings.length > 0) {
                    dimension = typedEmbeddings[0].length
                }

                // Small delay between batches to be respectful to API
                if (i < batches.length - 1) {
                    await new Promise((resolve) => setTimeout(resolve, 100))
                }
            } catch (error) {
                const normalized = this.formatError(error)
                log.error(`Error processing batch ${i + 1}:`, normalized)
                throw new Error(
                    `Failed to process embedding batch ${i + 1}: ${normalized.message ?? String(normalized)}`
                )
            }
        }

        return {
            embeddings: allEmbeddings,
            chunks,
            totalChunks: chunks.length,
            batchesProcessed: batches.length,
            dimension,
        }
    }

    /**
     * Main embedding generation method - uses pg-storage optimized implementation
     * Automatically handles batching and caching
     */
    async generateEmbeddingsLegacy(
        chunks: string[],
        options: EmbeddingOptions = {}
    ): Promise<EmbeddingResult> {
        const opts = { ...this.defaultOptions, ...options }

        // For smaller documents, use native implementation with caching
        // For larger documents, use manual batching for better memory control
        if (chunks.length <= 500 && opts.useCache) {
            return this.generateEmbeddings(chunks)
        } else {
            return this.generateEmbeddingsBatched(chunks, options)
        }
    }

    /**
     * Create batches from chunks array
     */

    private createBatches<T>(array: T[], batchSize: number): T[][] {
        const batches: T[][] = []

        for (let i = 0; i < array.length; i += batchSize) {
            batches.push(array.slice(i, i + batchSize))
        }

        return batches
    }

    // Normalize unknown errors caught from external libraries or runtimes
    private formatError(err: unknown): NormalizedError {
        // Start with an empty normalized error object
        const result: NormalizedError = {}

        if (err instanceof Error) {
            result.message = err.message
            result.name = err.name
            result.stack = err.stack
            return result
        }

        if (typeof err === 'string') {
            result.message = err
            return result
        }

        if (typeof err === 'object' && err !== null) {
            // Copy enumerable properties safely into the normalized shape
            for (const [k, v] of Object.entries(
                err as Record<string, unknown>
            )) {
                result[k] = v
            }
            // Ensure message is a string if present
            if (typeof result.message !== 'string') {
                result.message =
                    result.message !== undefined
                        ? String(result.message)
                        : undefined
            }
            return result
        }

        // Fallback: coerce to string
        result.message = String(err)
        return result
    }

    /**
     * Estimate memory usage for embedding generation
     */

    estimateMemoryUsage(
        chunkCount: number,
        avgChunkSize: number
    ): {
        estimatedMB: number
        recommendation: string
    } {
        // Rough estimates based on typical embedding dimensions and chunk sizes
        const embeddingDimension = 3072 // text-embedding-3-large (3072 dimensions)
        const bytesPerFloat = 4
        const embeddingSize: number = embeddingDimension * bytesPerFloat
        const textSize: number = avgChunkSize * 2 // UTF-16 encoding

        const totalBytes: number = chunkCount * (embeddingSize + textSize)
        const estimatedMB: number = totalBytes / (1024 * 1024)

        let recommendation = 'Use default settings'
        if (estimatedMB > 500) {
            recommendation = 'Consider using smaller batch sizes (50-100)'
        } else if (estimatedMB > 1000) {
            recommendation = 'Use streaming storage and small batches (25-50)'
        }

        return { estimatedMB, recommendation }
    }

    /**
     * Validate chunks before embedding
     */

    validateChunks(chunks?: string[]): void {
        if (!chunks || chunks.length === 0) {
            throw new Error('Chunks array cannot be empty')
        }

        const emptyChunks = chunks.filter(
            (chunk: string) => chunk?.trim().length === 0
        )
        if (emptyChunks.length > 0) {
            throw new Error(`Found ${emptyChunks.length} empty chunks`)
        }

        // Log statistics for large batch
        if (chunks.length > 100) {
            const avgLength: number =
                chunks.reduce((sum: number, chunk) => sum + chunk.length, 0) /
                chunks.length
            const usage: { estimatedMB: number; recommendation: string } =
                this.estimateMemoryUsage(chunks.length, avgLength)
            log.info(
                `Large embedding batch: ${chunks.length} chunks, avg ${Math.round(avgLength)} chars, ~${Math.round(usage.estimatedMB)}MB`
            )
            log.info(`Recommendation: ${usage.recommendation}`, {
                service: 'EMBEDDING_SERVICE',
                recommendation: usage.recommendation,
            })
            log.info(`Recommendation: ${usage.recommendation}`)
        }
    }
}
