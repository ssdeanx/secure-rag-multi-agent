import * as crypto from 'crypto'

import * as fs from 'fs/promises'

import type { ChunkingOptions } from './ChunkingService'
import { ChunkingService } from './ChunkingService'
import type { EmbeddingOptions } from './EmbeddingService'
import { EmbeddingService } from './EmbeddingService'
import { ValidationService } from './ValidationService'
import type { StorageOptions } from './VectorStorageService'
import { VectorStorageService } from './VectorStorageService'
import { log } from '../config/logger'

export interface DocumentInput {
    filePath: string
    docId: string
    classification: 'public' | 'internal' | 'confidential'
    allowedRoles: string[]
    tenant: string
    source?: string
}

export interface ProcessedDocument {
    docId: string
    chunks: string[]
    securityTags: string[]
    versionId: string
    timestamp: string
}

export interface ProcessingOptions {
    chunking?: ChunkingOptions
    embedding?: EmbeddingOptions
    storage?: StorageOptions
}

export interface IndexingResult {
    docId: string
    status: 'success' | 'failed'
    chunks?: number
    batches?: number
    error?: string
    processingTime?: number
    warnings?: string[]
}

export interface ProcessingProgress {
    stage:
        | 'reading'
        | 'chunking'
        | 'embedding'
        | 'storing'
        | 'completed'
        | 'failed'
    progress: number // 0-100
    message: string
    details?: unknown
}

export class DocumentProcessorService {
    private readonly chunkingService: ChunkingService
    private readonly embeddingService: EmbeddingService
    private readonly storageService: VectorStorageService

    constructor(options: ProcessingOptions = {}) {
        this.chunkingService = new ChunkingService()
        this.embeddingService = new EmbeddingService(options.embedding)
        this.storageService = new VectorStorageService(options.storage)
    }

    /**
     * Process a single document through the complete pipeline
     */

    async processDocument(
        doc: DocumentInput,
        vectorStore: unknown,
        indexName: string,
        options: ProcessingOptions = {}
    ): Promise<IndexingResult> {
        const startTime = Date.now()
        const warnings: string[] = []

        try {
            log.info('DOCUMENT_PROCESSOR_SERVICE', {
                message: `Starting document processing pipeline for: ${doc.docId}`,
                docId: doc.docId,
            })

            // Stage 1: Read and validate document
            const content = await this.readDocument(doc)

            // Stage 2: Chunk the document with optimal sizing
            const finalChunkingOptions: ChunkingOptions =
                options.chunking ??
                this.chunkingService.getOptimalChunkSize(content.length)
            const chunkingResult = await this.chunkingService.chunkText(
                content,
                finalChunkingOptions
            )
            // Structured logging: provide meta as Record<string, any>
            log.info('DOCUMENT_PROCESSOR_SERVICE', {
                message: `Document chunked: ${chunkingResult.totalChunks} chunks using ${chunkingResult.method} (doc length: ${content.length} chars)`,
                totalChunks: chunkingResult.totalChunks,
                method: chunkingResult.method,
                docLength: content.length,
            })

            // Add warning for very large documents
            if (chunkingResult.totalChunks > 5000) {
                const warning = `Large document with ${chunkingResult.totalChunks} chunks - processing may take significant time`
                warnings.push(warning)
                log.warn('DOCUMENT_PROCESSOR_SERVICE', {
                    message: warning,
                    docId: doc.docId,
                    totalChunks: chunkingResult.totalChunks,
                })
            }

            // Stage 3: Generate embeddings
            const embeddingResult =
                await this.embeddingService.generateEmbeddings(
                    chunkingResult.chunks
                )
            // Use structured logging to satisfy the logger's (message, meta) typing:
            log.info('DOCUMENT_PROCESSOR_SERVICE', {
                message: `Embeddings generated: ${embeddingResult.embeddings.length} embeddings, ${embeddingResult.batchesProcessed} batches`,
                embeddings: embeddingResult.embeddings.length,
                batchesProcessed: embeddingResult.batchesProcessed,
            })

            // Stage 4: Delete existing vectors for this document
            const deleteResult = await this.storageService.deleteVectorsByDocId(
                doc.docId,
                vectorStore,
                indexName
            )
            log.info('DOCUMENT_PROCESSOR_SERVICE', {
                message: `Cleaned up ${deleteResult.deleted} existing vectors for ${doc.docId}`,
                deleted: deleteResult.deleted,
                docId: doc.docId,
            })
            if (deleteResult.deleted > 0) {
                // Repeat of cleanup notification with structured meta for tooling
                log.info('DOCUMENT_PROCESSOR_SERVICE', {
                    message: `Cleaned up ${deleteResult.deleted} existing vectors for ${doc.docId}`,
                    deleted: deleteResult.deleted,
                    docId: doc.docId,
                })
            }

            // Stage 5: Prepare security metadata
            const securityTags: string[] = this.extractSecurityTags(
                doc.classification,
                doc.allowedRoles,
                doc.tenant
            )
            const versionId: string = crypto.randomBytes(8).toString('hex')
            const timestamp = new Date().toISOString()

            // Stage 6: Store vectors
            const storageResult = await this.storageService.storeVectors(
                chunkingResult.chunks,
                embeddingResult.embeddings,
                doc.docId,
                securityTags,
                versionId,
                timestamp,
                vectorStore,
                indexName,
                options.storage
            )

            if (!storageResult.success) {
                const errorMsg = `Partial storage failure: ${storageResult.errors.join(', ')}`
                if (storageResult.totalVectors === 0) {
                    throw new Error(errorMsg)
                }
            }

            const processingTime: number = Date.now() - startTime
            // Use structured logging (message + meta) to satisfy logger typings
            log.info('DOCUMENT_PROCESSOR_SERVICE', {
                message: `Document processing completed for ${doc.docId} in ${processingTime}ms`,
                docId: doc.docId,
                processingTime,
            })

            return {
                docId: doc.docId,
                status: 'success',
                chunks: chunkingResult.totalChunks,
                batches: storageResult.batchesProcessed,
                processingTime,
                warnings: warnings.length > 0 ? warnings : undefined,
            }
        } catch (error) {
            const processingTime: number = Date.now() - startTime
            // Structured error logging: ensure meta is Record<string, any>
            log.error('DOCUMENT_PROCESSOR_SERVICE', {
                message: `Error processing document ${doc.docId}`,
                docId: doc.docId,
                error: DocumentProcessorService.serializeError(error),
            })

            return {
                docId: doc.docId,
                status: 'failed',
                error: error instanceof Error ? error.message : String(error),
                processingTime,
                warnings: warnings.length > 0 ? warnings : undefined,
            }
        }
    }

    /**
     * Process multiple documents with progress tracking
     */

    async processDocuments(
        docs: DocumentInput[],
        vectorStore: unknown,
        indexName: string,
        options: ProcessingOptions,
        progressCallback?: (progress: ProcessingProgress) => void
    ): Promise<IndexingResult[]> {
        const results: IndexingResult[] = []

        log.info('DOCUMENT_PROCESSOR_SERVICE', {
            message: `Starting batch processing of ${docs.length} documents`,
            totalDocs: docs.length,
        })

        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i]
            const progress = Math.round((i / docs.length) * 100)

            if (progressCallback) {
                progressCallback({
                    stage: 'reading',
                    progress,
                    message: `Processing document ${i + 1}/${docs.length}: ${doc.docId}`,
                    details: { currentDoc: doc.docId, totalDocs: docs.length },
                })
            }

            const result: IndexingResult = await this.processDocument(
                doc,
                vectorStore,
                indexName,
                {}
            )
            results.push(result)

            // Log batch progress
            if ((i + 1) % 10 === 0 || i === docs.length - 1) {
                const completed: number = i + 1
                const successful = results.filter(
                    (r) => r.status === 'success'
                ).length
                log.info('DOCUMENT_PROCESSOR_SERVICE', {
                    message: `Batch progress: ${completed}/${docs.length} processed, ${successful} successful`,
                    completed,
                    totalDocs: docs.length,
                    successful,
                })
            }
        }

        if (progressCallback) {
            progressCallback({
                stage: 'completed',
                progress: 100,
                message: `Completed processing ${docs.length} documents`,
                details: { results },
            })
        }

        return results
    }

    /**
     * Read and validate document content
     */

    private async readDocument(doc: DocumentInput): Promise<string> {
        try {
            const content: string = await fs.readFile(doc.filePath, 'utf-8')

            if (content?.trim().length === 0) {
                throw new Error(`Document is empty: ${doc.filePath}`)
            }

            // Validate content isn't too small to be meaningful
            if (content.length < 50) {
                log.warn('DOCUMENT_PROCESSOR_SERVICE', {
                    message: `Very small document (${content.length} chars)`,
                    docId: doc.docId,
                    charCount: content.length,
                })
            }

            return content
        } catch (error) {
            if (
                error instanceof Error &&
                (error as NodeJS.ErrnoException).code === 'ENOENT'
            ) {
                throw new Error(`Document file not found: ${doc.filePath}`)
            }
            throw error
        }
    }

    /**
     * Extract security tags for document classification
     */

    private extractSecurityTags(
        classification: string,
        allowedRoles: string[],
        tenant: string
    ): string[] {
        const tags: string[] = [`classification:${classification}`]

        allowedRoles.forEach((role: string) => {
            tags.push(`role:${role}`)
        })

        if (tenant) {
            tags.push(`tenant:${tenant}`)
        }

        return tags
    }

    /**
     * Get processing estimates for a set of documents
     */

    async getProcessingEstimate(
        docs: DocumentInput[],
        options: ProcessingOptions = {}
    ): Promise<{
        estimatedChunks: number
        estimatedBatches: number
        estimatedTimeMinutes: number
        memoryEstimateMB: number
        recommendations: string[]
    }> {
        // Structured log for estimate run
        log.info('DOCUMENT_PROCESSOR_SERVICE', {
            message: `Analyzing ${docs.length} documents for processing estimates`,
            totalDocs: docs.length,
            sampleSize: Math.min(5, docs.length),
        })

        let totalSize = 0
        const recommendations: string[] = []

        // Sample some documents to estimate average size
        const sampleSize = Math.min(5, docs.length)
        const sampledDocs = docs.slice(0, sampleSize)

        for (const doc of sampledDocs) {
            try {
                const content: string = await this.readDocument(doc)
                totalSize += content.length
            } catch (error) {
                recommendations.push(
                    `Document ${doc.docId} may have issues: ${error instanceof Error ? error.message : String(error)}`
                )
            }
        }

        const avgDocSize: number = totalSize / sampledDocs.length
        const totalEstimatedSize: number = avgDocSize * docs.length
        const EMBEDDING_DIMENSION = 3072 // text-embedding-3-large (3072 dimensions)

        // Get optimal chunking settings
        const optimalChunking =
            this.chunkingService.getOptimalChunkSize(avgDocSize)
        const tokenSize: number = optimalChunking.tokenSize ?? 65000 // Default to 8196 if not specified

        // Estimate chunks (rough approximation)
        const estimatedChunks = Math.ceil(totalEstimatedSize / (tokenSize * 4)) // 4 chars per token approx
        // Estimate embedding batches
        const embeddingBatchSize: number = options.embedding?.batchSize ?? 100
        const estimatedEmbeddingBatches = Math.ceil(
            estimatedChunks / embeddingBatchSize
        )

        // Estimate storage batches
        const storageBatchSize: number = options.storage?.batchSize ?? 100
        const estimatedStorageBatches = Math.ceil(
            estimatedChunks / storageBatchSize
        )

        const totalBatches = estimatedEmbeddingBatches + estimatedStorageBatches
        // Estimate time (very rough - ~2 seconds per batch)
        const estimatedTimeMinutes = Math.ceil((totalBatches * 2) / 60)

        // Estimate memory usage
        const embeddingDimension = EMBEDDING_DIMENSION
        const memoryEstimateMB = Math.ceil(
            (estimatedChunks * embeddingDimension * 4) / (1024 * 1024)
        )

        // Generate recommendations
        if (estimatedChunks > 10000) {
            recommendations.push(
                'Very large batch - consider processing in smaller groups'
            )
        }

        if (memoryEstimateMB > 500) {
            recommendations.push(
                'High memory usage expected - use smaller batch sizes (adjusted for 3072-dimension embeddings)'
            )
        }

        if (estimatedTimeMinutes > 60) {
            recommendations.push(
                'Long processing time expected - consider parallel processing'
            )
        }

        return {
            estimatedChunks,
            estimatedBatches: totalBatches,
            estimatedTimeMinutes,
            memoryEstimateMB,
            recommendations,
        }
    }

    /**
     * Safely convert an unknown value into a plain object suitable for structured logging.
     * Always returns a Record<string, any> to satisfy logger typings and avoid leaking internal objects.
     */
    private static serializeError(err: unknown): Record<string, any> {
        if (err instanceof Error) {
            return {
                name: err.name,
                message: err.message,
                stack: err.stack,
            }
        }

        if (typeof err === 'string') {
            return { message: err }
        }

        if (typeof err === 'object' && err !== null) {
            try {
                // Cast safely to a plain object copy to avoid prototype issues
                return Object.assign({}, err as Record<string, any>)
            } catch {
                return { value: String(err) }
            }
        }

        return { value: String(err) }
    }
}
