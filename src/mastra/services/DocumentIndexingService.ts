import * as crypto from 'crypto'
import * as fs from 'fs/promises'

import type { ChunkingResult } from './ChunkingService'
import { ChunkingService } from './ChunkingService'
import type { ProcessingOptions } from './DocumentProcessorService'
import { DocumentProcessorService } from './DocumentProcessorService'
import type { EmbeddingResult } from './EmbeddingService'
import { EmbeddingService } from './EmbeddingService'
import { ValidationService } from './ValidationService'
import type { StorageResult } from './VectorStorageService'
import { VectorStorageService } from './VectorStorageService'
import { RoleService } from './RoleService'
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

export interface IndexingResult {
    docId: string
    status: 'success' | 'failed'
    chunks?: number
    error?: string
}

export class DocumentIndexingService {
    private static readonly processor = new DocumentProcessorService()
    private static readonly chunkingService = new ChunkingService()
    private static readonly embeddingService = new EmbeddingService()
    private static readonly storageService = new VectorStorageService()

    /**
     * @deprecated Use ChunkingService directly for better performance and unlimited chunking
     * Legacy method maintained for backward compatibility - NO LONGER HAS 1000 CHUNK LIMIT
     */

    static chunkText(
        text: string,
        maxChunkSize = 1000,
        overlap = 200
    ): string[] {
        log.warn(
            'DocumentIndexingService.chunkText is deprecated. Use ChunkingService for better performance.'
        )
        // Use the new chunking service with character-based strategy for backward compatibility
        const result: ChunkingResult =
            this.chunkingService.chunkTextCharacterBased(text, {
                maxChunkSize,
                overlap,
                strategy: 'character-based',
            })
        return result.chunks
    }

    static extractSecurityTags(
        classification: string,
        allowedRoles: string[],
        tenant: string
    ): string[] {
        // Validate inputs using ValidationService
        ValidationService.validateEnvironmentVariable('TENANT', tenant)

        if (
            !classification ||
            !['public', 'internal', 'confidential'].includes(classification)
        ) {
            throw new Error(`Invalid classification: ${classification}`)
        }

        if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
            throw new Error('allowedRoles must be a non-empty array')
        }

        const tags: string[] = [`classification:${classification}`]

        // Add explicit role tags first
        allowedRoles.forEach((role) => {
            tags.push(`role:${role}`)
        })

        // Use RoleService to get hierarchical roles
        const roleSet = new Set(allowedRoles)

        // For internal and public documents, add employee access if not department-specific
        if (classification === 'internal' || classification === 'public') {
            const isDepartmentSpecific = allowedRoles.some(
                (role) =>
                    role.includes('.') ||
                    [
                        'admin',
                        'hr.admin',
                        'finance.admin',
                        'engineering.admin',
                    ].includes(role)
            )
            if (!isDepartmentSpecific && !roleSet.has('employee')) {
                tags.push('role:employee')
                log.info(
                    `INDEXING: Auto-added 'employee' role for ${classification} document`
                )
            }
        }

        // For public documents, add public access
        if (classification === 'public' && !roleSet.has('public')) {
            tags.push('role:public')
            log.info(`INDEXING: Auto-added 'public' role for public document`)
        }

        // Add tenant tag
        if (tenant) {
            tags.push(`tenant:${tenant}`)
        }

        // Log the generated tags using RoleService formatting for consistency
        log.info(
            `INDEXING: Generated security tags for ${classification} document:`,
            tags
        )
        return tags
    }

    static async processDocument(
        doc: DocumentInput
    ): Promise<ProcessedDocument> {
        const content: string = await fs.readFile(doc.filePath, 'utf-8')
        const chunks: string[] = this.chunkText(content)
        const securityTags: string[] = this.extractSecurityTags(
            doc.classification,
            doc.allowedRoles,
            doc.tenant
        )
        const versionId: string = crypto.randomBytes(8).toString('hex')
        const timestamp = new Date().toISOString()

        return {
            docId: doc.docId,
            chunks,
            securityTags,
            versionId,
            timestamp,
        }
    }

    /**
     * @deprecated Use EmbeddingService directly for better performance, caching, and batch processing
     * Legacy method maintained for backward compatibility
     */

    static async generateEmbeddings(chunks: string[]): Promise<number[][]> {
        log.warn(
            'DocumentIndexingService.generateEmbeddings is deprecated. Use EmbeddingService for better performance.'
        )
        const result: EmbeddingResult =
            await this.embeddingService.generateEmbeddings(chunks)
        return result.embeddings
    }

    /**
     * @deprecated Use VectorStorageService directly for better batch processing and error handling
     * Legacy method maintained for backward compatibility
     * Now supports unlimited chunks and improved error reporting
     */

    static async storeVectors(
        processedDoc: ProcessedDocument,
        embeddings: number[][],
        vectorStore: unknown,
        indexName: string
    ): Promise<void> {
        log.warn(
            'DocumentIndexingService.storeVectors is deprecated. Use VectorStorageService for better performance.'
        )

        const result: StorageResult = await this.storageService.storeVectors(
            processedDoc.chunks,
            embeddings,
            processedDoc.docId,
            processedDoc.securityTags,
            processedDoc.versionId,
            processedDoc.timestamp,
            vectorStore,
            indexName
        )
        if (!result.success) {
            throw new Error(`Storage failed: ${result.errors.join(', ')}`)
        }
        log.info('DOCUMENT_INDEXING_SERVICE', {
            message: `Successfully stored ${result.totalVectors} chunks for document ${processedDoc.docId}`,
            totalVectors: result.totalVectors,
            docId: processedDoc.docId,
        })
    }

    /**
     * Enhanced document indexing with unlimited chunking and batch processing
     * Now uses the new DocumentProcessorService for better performance and reliability
     */

    static async indexDocument(
        doc: DocumentInput,
        vectorStore: unknown,
        indexName: string,
        options: ProcessingOptions = {
            chunking: { maxChunkSize: 1000, overlap: 200 },
            embedding: { batchSize: 200 },
            storage: { batchSize: 200 },
        }
    ): Promise<IndexingResult> {
        return this.processor.processDocument(
            doc,
            vectorStore,
            indexName,
            options
        )
    }

    /**
     * Process multiple documents with progress tracking and batch optimization
     */

    static async indexDocuments(
        docs: DocumentInput[],
        vectorStore: unknown,
        indexName: string,
        options: ProcessingOptions = {
            chunking: { maxChunkSize: 1000, overlap: 200 },
            embedding: { batchSize: 200 },
            storage: { batchSize: 200 },
        },
        progressCallback?: (progress: unknown) => void
    ): Promise<IndexingResult[]> {
        return this.processor.processDocuments(
            docs,
            vectorStore,
            indexName,
            options,
            progressCallback
        )
    }

    /**
     * Get processing estimates for planning large batch operations
     */

    static async getProcessingEstimate(
        docs: DocumentInput[],
        options: ProcessingOptions = {
            chunking: { maxChunkSize: 1000, overlap: 200 },
            embedding: { batchSize: 200 },
            storage: { batchSize: 200 },
        }
    ): Promise<unknown> {
        return this.processor.getProcessingEstimate(docs, options)
    }
}
