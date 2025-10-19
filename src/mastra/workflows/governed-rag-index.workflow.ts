import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'

import {
    logError,
    logProgress,
    logStepEnd,
    logStepStart,
} from '../config/logger'

import type { IndexingResult } from '../services/DocumentIndexingService'
import { DocumentIndexingService } from '../services/DocumentIndexingService'
import { pgVector } from '../config/pg-storage'

// Single step that handles all document indexing
const indexDocumentsStep = createStep({
    id: 'index-documents',
    description: 'Index documents with security tags and classifications',
    inputSchema: z.object({
        documents: z.array(
            z.object({
                filePath: z.string(),
                docId: z.string(),
                classification: z.enum(['public', 'internal', 'confidential']),
                allowedRoles: z.array(z.string()),
                tenant: z.string(),
                source: z.string().optional(),
            })
        ),
    }),
    outputSchema: z.object({
        indexed: z.number(),
        failed: z.number(),
        documents: z.array(
            z.object({
                docId: z.string(),
                status: z.string(),
                chunks: z.number().optional(),
                error: z.string().optional(),
            })
        ),
    }),
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        const totalDocs = inputData.documents.length
        logStepStart('index-documents', { totalDocuments: totalDocs })

        try {
            const vectorStore = pgVector
            const indexName: string =
                process.env.QDRANT_COLLECTION ?? 'governed_rag'

            // Ensure the index exists with proper dimension for gemini-embedding-001 (1568)
            // HNSW index type is used automatically to support high-dimensional embeddings
            try {
                await vectorStore.createIndex({
                    indexName,
                    dimension: 1568, // gemini-embedding-001 dimension (1568)
                })
                logProgress(
                    `PgVector index ${indexName} created or already exists with 1568 dimensions`,
                    0,
                    totalDocs
                )
            } catch (createError) {
                logProgress(
                    `Index creation info (may already exist): ${createError instanceof Error ? createError.message : String(createError)}`,
                    0,
                    totalDocs
                )
                // Index might already exist, continue
            }

            const results: {
                indexed: number
                failed: number
                documents: Array<{
                    docId: string
                    status: string
                    error?: string
                    chunks?: number
                }>
            } = {
                indexed: 0,
                failed: 0,
                documents: [],
            }

            for (
                let docIndex = 0;
                docIndex < inputData.documents.length;
                docIndex++
            ) {
                const doc = inputData.documents[docIndex]
                logProgress(
                    `Indexing document ${doc.docId}`,
                    docIndex + 1,
                    totalDocs
                )

                const result: IndexingResult =
                    await DocumentIndexingService.indexDocument(
                        doc,
                        vectorStore,
                        indexName
                    )

                results.documents.push(result)

                if (result.status === 'success') {
                    results.indexed++
                } else {
                    results.failed++
                }
            }

            logStepEnd(
                'index-documents',
                { indexed: results.indexed, failed: results.failed },
                Date.now() - startTime
            )
            return results
        } catch (error) {
            logError('index-documents', error, { totalDocuments: totalDocs })
            throw new Error(
                `Document indexing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    },
})

export const governedRagIndex = createWorkflow({
    id: 'governed-rag-index',
    description: 'Index documents with security tags and classifications',
    inputSchema: z.object({
        documents: z.array(
            z.object({
                filePath: z.string(),
                docId: z.string(),
                classification: z.enum(['public', 'internal', 'confidential']),
                allowedRoles: z.array(z.string()),
                tenant: z.string(),
                source: z.string().optional(),
            })
        ),
    }),
    outputSchema: z.object({
        indexed: z.number(),
        failed: z.number(),
        documents: z.array(
            z.object({
                docId: z.string(),
                status: z.string(),
                chunks: z.number().optional(),
                error: z.string().optional(),
            })
        ),
    }),
})
    .then(indexDocumentsStep)
    .commit()
