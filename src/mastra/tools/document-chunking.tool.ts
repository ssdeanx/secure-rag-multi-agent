import { MDocument } from '@mastra/rag'
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { AISpanType } from '@mastra/core/ai-tracing'
import { pgVector } from '../config/pg-storage'
import {
    logStepStart,
    logStepEnd,
    logError,
    logToolExecution,
} from '../config/logger'
import { embedMany } from 'ai'
import type { ExtractParams } from '@mastra/rag'
import { google } from '@ai-sdk/google'

// Define runtime context for this tool
export interface DocumentChunkingContext {
    userId?: string
    chunkStrategy?: string
}

/**
 * Input schema for custom document chunking tool with embeddings and storage
 */
const CustomDocumentChunkingInputSchema = z.object({
    documentContent: z.string().min(1, 'Document content cannot be empty'),
    documentMetadata: z.record(z.string(), z.unknown()).optional().default({}),
    chunkingStrategy: z
        .enum([
            'recursive',
            'character',
            'token',
            'markdown',
            'semantic-markdown',
            'html',
            'json',
            'latex',
            'sentence',
        ])
        .default('recursive'),
    chunkSize: z.number().min(50).max(4000).default(512),
    chunkOverlap: z.number().min(0).max(500).default(50),
    chunkSeparator: z.string().default('\n'),
    indexName: z.string().default('governed_rag'),
    generateEmbeddings: z.boolean().default(true),
})

/**
 * Output schema for custom document chunking tool
 */
const CustomDocumentChunkingOutputSchema = z.object({
    success: z.boolean(),
    chunkCount: z.number(),
    totalTextLength: z.number(),
    chunks: z.array(
        z.object({
            id: z.string(),
            text: z.string(),
            metadata: z.record(z.string(), z.unknown()),
            embeddingGenerated: z.boolean(),
        })
    ),
    processingTimeMs: z.number(),
    error: z.string().optional(),
})

/**
 * Input schema for Mastra chunker tool with metadata extraction
 */
const MastraDocumentChunkingInputSchema = z.object({
    documentContent: z.string().min(1, 'Document content cannot be empty'),
    documentMetadata: z.record(z.string(), z.unknown()).optional().default({}),
    chunkingStrategy: z
        .enum([
            'recursive',
            'character',
            'token',
            'markdown',
            'semantic-markdown',
            'html',
            'json',
            'latex',
            'sentence',
        ])
        .default('recursive'),
    chunkSize: z.number().min(50).max(4000).default(512),
    chunkOverlap: z.number().min(0).max(500).default(50),
    chunkSeparator: z.string().default('\n'),
    // ExtractParams for metadata extraction
    extractTitle: z.boolean().default(false),
    extractSummary: z.boolean().default(false),
    extractKeywords: z.boolean().default(false),
    extractQuestions: z.boolean().default(false),
})

/**
 * Output schema for Mastra chunker tool
 */
const MastraDocumentChunkingOutputSchema = z.object({
    success: z.boolean(),
    chunkCount: z.number(),
    totalTextLength: z.number(),
    chunks: z.array(
        z.object({
            text: z.string(),
            metadata: z.record(z.string(), z.unknown()),
        })
    ),
    processingTimeMs: z.number(),
    error: z.string().optional(),
})

/**
 * Mastra Chunker Tool with Metadata Extraction
 *
 * Uses MDocument.chunk() with ExtractParams for comprehensive document processing
 * including title extraction, summarization, keyword extraction, and question generation.
 *
 * Features:
 * - LLM-powered metadata extraction (titles, summaries, keywords, questions)
 * - Configurable extraction options
 * - Multiple chunking strategies
 * - Comprehensive error handling and logging
 * - Performance monitoring and metrics
 *
 * Use this tool when you need advanced document processing with metadata extraction.
 */
export const mastraChunker = createTool({
    id: 'mastra-chunker',
    description: `
Mastra Document Chunker Tool with Metadata Extraction

This tool processes document content using MDocument.chunk() with advanced metadata extraction:

Features:
- LLM-powered metadata extraction:
  * Title extraction with hierarchical document structure
  * Summary generation for each chunk
  * Keyword extraction for semantic search
  * Question generation for conversational retrieval
- Multiple chunking strategies (recursive, character, token, markdown, etc.)
- Configurable extraction options
- Comprehensive error handling and logging
- Performance monitoring and metrics

Use this tool when you need advanced document processing with metadata extraction.
  `,
    inputSchema: MastraDocumentChunkingInputSchema,
    outputSchema: MastraDocumentChunkingOutputSchema,
    execute: async ({ context, tracingContext }) => {
        const startTime = Date.now()
        logToolExecution('mastra-chunker', { input: context })

        // Create a span for tracing
        const span = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.LLM_CHUNK,
            name: 'mastra-chunker-tool',
            input: {
                documentLength: context.documentContent.length,
                chunkingStrategy: context.chunkingStrategy,
                chunkSize: context.chunkSize,
                extractTitle: context.extractTitle,
                extractSummary: context.extractSummary,
                extractKeywords: context.extractKeywords,
                extractQuestions: context.extractQuestions,
            },
        })

        try {
            // Create MDocument from input
            const document = new MDocument({
                docs: [
                    {
                        text: context.documentContent,
                        metadata: {
                            ...context.documentMetadata,
                            chunkingStrategy: context.chunkingStrategy,
                            chunkSize: context.chunkSize,
                            chunkOverlap: context.chunkOverlap,
                            processedAt: new Date().toISOString(),
                            source: 'mastra-chunker',
                        },
                    },
                ],
                type: 'document',
            })

            // Build chunking parameters with ExtractParams
            const buildChunkParams = (
                strategy: string,
                maxSize: number,
                overlap: number,
                extract: ExtractParams
            ) => {
                const baseParams = {
                    maxSize,
                    overlap,
                    extract,
                }

                switch (strategy) {
                    case 'recursive':
                        return {
                            strategy: 'recursive' as const,
                            ...baseParams,
                            separators: ['\n\n', '\n', ' '],
                        }
                    case 'character':
                        return {
                            strategy: 'character' as const,
                            ...baseParams,
                            separator: '\n',
                            isSeparatorRegex: false,
                        }
                    case 'markdown':
                        return {
                            strategy: 'markdown' as const,
                            ...baseParams,
                            headers: [
                                ['#', 'title'],
                                ['##', 'section'],
                            ] as Array<[string, string]>,
                        }
                    case 'html':
                        return {
                            strategy: 'html' as const,
                            ...baseParams,
                            headers: [
                                ['h1', 'title'],
                                ['h2', 'section'],
                            ] as Array<[string, string]>,
                        }
                    case 'json':
                        return {
                            strategy: 'json' as const,
                            ...baseParams,
                        }
                    case 'latex':
                        return {
                            strategy: 'latex' as const,
                            ...baseParams,
                        }
                    case 'sentence':
                        return {
                            strategy: 'sentence' as const,
                            ...baseParams,
                            minSize: 50,
                            sentenceEnders: ['.'],
                        }
                    case 'token':
                        return {
                            strategy: 'token' as const,
                            ...baseParams,
                        }
                    case 'semantic-markdown':
                        return {
                            strategy: 'semantic-markdown' as const,
                            ...baseParams,
                            joinThreshold: 500,
                        }
                    default:
                        // Fallback to recursive
                        return {
                            strategy: 'recursive' as const,
                            ...baseParams,
                            separators: ['\n\n', '\n', ' '],
                        }
                }
            }

            // Build ExtractParams based on user preferences
            const extractParams: ExtractParams = {}
            if (context.extractTitle) {
                extractParams.title = true
            }
            if (context.extractSummary) {
                extractParams.summary = true
            }
            if (context.extractKeywords) {
                extractParams.keywords = true
            }
            if (context.extractQuestions) {
                extractParams.questions = true
            }

            // Execute chunking with metadata extraction
            const chunkingStartTime = Date.now()
            const chunkParams = buildChunkParams(
                context.chunkingStrategy,
                context.chunkSize,
                context.chunkOverlap,
                extractParams
            )
            const chunks = await document.chunk(chunkParams)
            const chunkingTime = Date.now() - chunkingStartTime

            logStepStart('mastra-chunking-completed', {
                chunkCount: chunks.length,
                chunkingTimeMs: chunkingTime,
                strategy: context.chunkingStrategy,
                extractOptions: Object.keys(extractParams),
            })

            // Prepare output chunks
            const outputChunks = chunks.map((chunk, index) => ({
                text: chunk.text ?? '',
                metadata: {
                    ...chunk.metadata,
                    chunkIndex: index,
                    totalChunks: chunks.length,
                    documentId: `doc_${Date.now()}_${index}`,
                    chunkingStrategy: context.chunkingStrategy,
                    chunkSize: context.chunkSize,
                    chunkOverlap: context.chunkOverlap,
                },
            }))

            const totalProcessingTime = Date.now() - startTime

            const output = {
                success: true,
                chunkCount: chunks.length,
                totalTextLength: context.documentContent.length,
                chunks: outputChunks,
                processingTimeMs: totalProcessingTime,
            }

            logStepEnd('mastra-chunker', output, totalProcessingTime)

            // End tracing span with success
            span?.end({
                output: {
                    success: true,
                    chunkCount: chunks.length,
                    processingTimeMs: totalProcessingTime,
                    chunkingStrategy: context.chunkingStrategy,
                },
            })

            return output
        } catch (error) {
            const processingTime = Date.now() - startTime
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred'

            logError('mastra-chunker', error, {
                context,
                processingTimeMs: processingTime,
            })

            // Record error in tracing span
            span?.error({
                error: error instanceof Error ? error : new Error(errorMessage),
                metadata: {
                    operation: 'mastra-chunker',
                    chunkingStrategy: context.chunkingStrategy,
                    processingTimeMs: processingTime,
                },
            })

            return {
                success: false,
                chunkCount: 0,
                totalTextLength: context.documentContent.length,
                chunks: [],
                processingTimeMs: processingTime,
                error: errorMessage,
            }
        }
    },
})

/**
 * MDocument Chunker Tool with PgVector Integration
 *
 * This tool processes document content by:
 * 1. Creating chunks using MDocument.chunk() method with configurable strategies
 * 2. Generating embeddings for each chunk using Gemini embedding model
 * 3. Storing chunks and embeddings in PgVector for efficient similarity search
 *
 * Features:
 * - Multiple chunking strategies with customizable parameters
 * - Automatic embedding generation (1568 dimensions)
 * - PgVector storage with metadata support
 * - Comprehensive error handling and logging
 * - Performance monitoring and metrics
 *
 * Use this tool when you need to process documents for RAG applications,
 * content indexing, or semantic search capabilities.
 */
export const mdocumentChunker = createTool({
    id: 'mdocument-chunker',
    description: `
Custom Document Chunking Tool with PgVector Integration

This tool processes document content by:
1. Creating chunks using configurable strategies (recursive, character, token, markdown, etc.)
2. Generating embeddings for each chunk using Gemini embedding model
3. Storing chunks and embeddings in PgVector for efficient similarity search

Features:
- Multiple chunking strategies with customizable parameters
- Automatic embedding generation (1568 dimensions)
- PgVector storage with metadata support
- Comprehensive error handling and logging
- Performance monitoring and metrics

Use this tool when you need to process documents for RAG applications,
content indexing, or semantic search capabilities.
  `,
    inputSchema: CustomDocumentChunkingInputSchema,
    outputSchema: CustomDocumentChunkingOutputSchema,
    execute: async ({ context, tracingContext }) => {
        const startTime = Date.now()
        logToolExecution('mdocument-chunker', { input: context })

        // Create a span for tracing
        const span = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.LLM_CHUNK,
            name: 'mdocument-chunker-tool',
            input: {
                documentLength: context.documentContent.length,
                chunkingStrategy: context.chunkingStrategy,
                chunkSize: context.chunkSize,
                generateEmbeddings: context.generateEmbeddings,
                indexName: 'governed_rag',
            },
        })

        try {
            // Create MDocument from input
            const document = new MDocument({
                docs: [
                    {
                        text: context.documentContent,
                        metadata: {
                            ...context.documentMetadata,
                            chunkingStrategy: context.chunkingStrategy,
                            chunkSize: context.chunkSize,
                            chunkOverlap: context.chunkOverlap,
                            processedAt: new Date().toISOString(),
                            source: 'mdocument-chunker',
                        },
                    },
                ],
                type: 'document',
            })

            // Build chunking parameters based on strategy
            const buildChunkParams = (
                strategy: string,
                maxSize: number,
                overlap: number
            ) => {
                const baseParams = {
                    maxSize,
                    overlap,
                }

                switch (strategy) {
                    case 'recursive':
                        return {
                            strategy: 'recursive' as const,
                            ...baseParams,
                            separators: ['\n\n', '\n', ' '], // Removed 'as const' to make it mutable string[]
                        }
                    case 'character':
                        return {
                            strategy: 'character' as const,
                            ...baseParams,
                            separator: '\n',
                            isSeparatorRegex: false,
                        }
                    case 'markdown':
                        return {
                            strategy: 'markdown' as const,
                            ...baseParams,
                            sections: [
                                ['#', 'title'],
                                ['##', 'section'],
                            ] as Array<[string, string]>,
                        }
                    case 'html':
                        return {
                            strategy: 'html' as const,
                            ...baseParams,
                            sections: [
                                ['h1', 'title'],
                                ['h2', 'section'],
                            ] as Array<[string, string]>,
                        }
                    case 'json':
                        return {
                            strategy: 'json' as const,
                            ...baseParams,
                        }
                    case 'latex':
                        return {
                            strategy: 'latex' as const,
                            ...baseParams,
                        }
                    case 'sentence':
                        return {
                            strategy: 'sentence' as const,
                            ...baseParams,
                            minSize: 50,
                            sentenceEnders: ['.'], // Removed 'as const' to make it mutable string[]
                        }
                    case 'token':
                        return {
                            strategy: 'token' as const,
                            ...baseParams,
                        }
                    case 'semantic-markdown':
                        return {
                            strategy: 'semantic-markdown' as const,
                            joinThreshold: 500,
                        }
                    default:
                        // Fallback to recursive
                        return {
                            strategy: 'recursive' as const,
                            ...baseParams,
                            separators: ['\n\n', '\n', ' '], // Removed 'as const' to make it mutable string[]
                        }
                }
            }

            // Execute chunking using MDocument.chunk() method
            const chunkingStartTime = Date.now()
            const chunkParams = buildChunkParams(
                context.chunkingStrategy,
                context.chunkSize,
                context.chunkOverlap
            )
            const chunks = await document.chunk(chunkParams)
            const chunkingTime = Date.now() - chunkingStartTime

            logStepStart('custom-chunking-completed', {
                chunkCount: chunks.length,
                chunkingTimeMs: chunkingTime,
                strategy: context.chunkingStrategy,
            })

            // Prepare chunks for embedding and storage
            const chunksForProcessing = chunks.map((chunk, index) => ({
                text: chunk.text,
                metadata: {
                    ...chunk.metadata,
                    chunkIndex: index,
                    totalChunks: chunks.length,
                    documentId: `doc_${Date.now()}_${index}`,
                    chunkingStrategy: context.chunkingStrategy,
                    chunkSize: context.chunkSize,
                    chunkOverlap: context.chunkOverlap,
                },
                id: `chunk_${Date.now()}_${index}`,
            }))

            let embeddingGenerated = false
            let embeddings: number[][] = []

            // Generate embeddings if requested
            if (context.generateEmbeddings && chunksForProcessing.length > 0) {
                const embeddingStartTime = Date.now()
                const result = await embedMany({
                    values: chunksForProcessing.map((chunk) => chunk.text),
                    model: google.textEmbedding('gemini-embedding-001'),
                    maxRetries: 3,
                    abortSignal: new AbortController().signal,
                })
                embeddings = result.embeddings
                embeddingGenerated = true

                const embeddingTime = Date.now() - embeddingStartTime
                logStepStart('embeddings-generated', {
                    embeddingCount: embeddings.length,
                    embeddingTimeMs: embeddingTime,
                    dimension: embeddings[0]?.length || 0,
                })
            }

            // Store chunks in PgVector if embeddings were generated
            if (embeddingGenerated && embeddings.length > 0) {
                const storageStartTime = Date.now()

                // Store vectors with metadata
                await pgVector.upsert({
                    indexName: 'governed_rag',
                    vectors: embeddings,
                    metadata: chunksForProcessing.map(
                        (chunk) => chunk.metadata
                    ),
                    ids: chunksForProcessing.map((chunk) => chunk.id),
                })

                const storageTime = Date.now() - storageStartTime
                logStepStart('vectors-stored', {
                    indexName: 'governed_rag',
                    vectorCount: embeddings.length,
                    storageTimeMs: storageTime,
                })
            }

            const totalProcessingTime = Date.now() - startTime

            // Prepare output
            const output = {
                success: true,
                chunkCount: chunks.length,
                totalTextLength: context.documentContent.length,
                chunks: chunksForProcessing.map((chunk) => ({
                    id: chunk.id,
                    text: chunk.text,
                    metadata: chunk.metadata,
                    embeddingGenerated,
                })),
                processingTimeMs: totalProcessingTime,
            }

            logStepEnd('mdocument-chunker', output, totalProcessingTime)

            // End tracing span with success
            span?.end({
                output: {
                    success: true,
                    chunkCount: chunksForProcessing.length,
                    processingTimeMs: totalProcessingTime,
                    embeddingsGenerated: embeddingGenerated,
                    chunkingStrategy: context.chunkingStrategy,
                },
            })

            return output
        } catch (error) {
            const processingTime = Date.now() - startTime
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred'

            logError('mdocument-chunker', error, {
                context,
                processingTimeMs: processingTime,
            })

            // Record error in tracing span
            span?.error({
                error: error instanceof Error ? error : new Error(errorMessage),
                metadata: {
                    operation: 'mdocument-chunker',
                    chunkingStrategy: context.chunkingStrategy,
                    generateEmbeddings: context.generateEmbeddings,
                    processingTimeMs: processingTime,
                },
            })

            return {
                success: false,
                chunkCount: 0,
                totalTextLength: context.documentContent.length,
                chunks: [],
                processingTimeMs: processingTime,
                error: errorMessage,
            }
        }
    },
})
