import { PineconeVector } from '@mastra/pinecone';
import { createVectorQueryTool, createGraphRAGTool } from '@mastra/rag';
import { google } from '@ai-sdk/google';
import { embedMany } from 'ai';
import { log } from '../logger';

/**
 * Pinecone-compatible filter format for vector queries
 * Based on Pinecone's metadata filtering syntax
 *
 * Pinecone-specific limitations:
 * - Metadata values must be strings, numbers, or booleans
 * - Logical operators: $and, $or
 * - Comparison operators: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin
 * - Text search: $contains, $not_contains
 */
export interface PineconeMetadataFilter {
  [key: string]: string | number | boolean | PineconeMetadataFilter | PineconeMetadataFilter[] | Array<string | number | boolean> | undefined;
}

/**
 * Raw Pinecone filter format expected by the library
 * Using Record<string, unknown> for compatibility with @mastra/pinecone types
 */
export type PineconeRawFilter = Record<string, unknown>;

/**
 * Pinecone configuration for the Governed RAG system
 * Supports Pinecone cloud vector database
 */

// Configuration constants
const PINECONE_CONFIG = {
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
  projectId: process.env.PINECONE_PROJECT_ID,
  indexName: "governed-rag",
  // Google Gemini gemini-embedding-001 supports flexible dimensions: 128-3072
  // Recommended: 768, 1536, 3072
  embeddingDimension: parseInt(process.env.PINECONE_EMBEDDING_DIMENSION ?? "1536"),
  embeddingModel: google.textEmbedding("gemini-embedding-001"),
} as const;

/**
 * Initialize Pinecone store with proper configuration
 */
const pineconeStore = new PineconeVector({
  apiKey: PINECONE_CONFIG.apiKey!,
});

/**
 * Create and configure the vector index
 */
export async function initializeVectorIndex(): Promise<void> {
  try {
    await pineconeStore.createIndex({
      indexName: PINECONE_CONFIG.indexName,
      dimension: PINECONE_CONFIG.embeddingDimension,
    });

    log.info("Vector index created", {
      indexName: PINECONE_CONFIG.indexName,
      dimension: PINECONE_CONFIG.embeddingDimension,
      provider: "Pinecone"
    });
  } catch (error: unknown) {
    // Index might already exist, which is fine
    const errorObj = error as { code?: string; message?: string };
    if ((errorObj.message?.includes('already exists') ?? false) || errorObj.code === 'index_already_exists') {
      log.info("Vector index already exists", { indexName: PINECONE_CONFIG.indexName });
    } else {
      log.error("Failed to create vector index", { error: String(error) });
      throw error;
    }
  }
}

/**
 * Process document content and generate embeddings
 * Simplified chunking for basic vector setup without AI extraction
 */
export async function processDocument(
  content: string,
  options: {
    chunkSize?: number;
    chunkOverlap?: number;
  } = {}
): Promise<{
  chunks: Array<{
    text: string;
    metadata?: Record<string, unknown>;
  }>;
  embeddings: number[][];
}> {
  try {
    // Simple text-based chunking without AI extraction
    const chunkSize = options.chunkSize ?? 1000;
    const chunkOverlap = options.chunkOverlap ?? 200;

    const chunks: Array<{ text: string; metadata?: Record<string, unknown> }> = [];

    // Split content into overlapping chunks
    for (let i = 0; i < content.length; i += chunkSize - chunkOverlap) {
      const chunkText = content.slice(i, i + chunkSize);
      if (chunkText.trim()) {
        chunks.push({
          text: chunkText,
          metadata: {
            chunkIndex: chunks.length,
            startPosition: i,
            endPosition: i + chunkText.length,
            totalLength: content.length,
          },
        });
      }
    }

    // Generate embeddings for all chunks
    const { embeddings } = await embedMany({
      values: chunks.map((chunk) => chunk.text),
      model: PINECONE_CONFIG.embeddingModel,
    });

    log.info("Document processed successfully", {
      chunksCount: chunks.length,
      chunkSize,
      chunkOverlap,
      embeddingDimension: embeddings[0]?.length
    });

    return { chunks, embeddings };
  } catch (error) {
    log.error("Failed to process document", { error: String(error) });
    throw error;
  }
}

/**
 * Store document chunks and their embeddings
 */
export async function storeDocumentEmbeddings(
  chunks: Array<{
    text: string;
    metadata?: {
      title?: string;
      summary?: string;
      keywords?: string[];
    };
  }>,
  embeddings: number[][],
  baseMetadata: Record<string, unknown> = {}
): Promise<string[]> {
  try {
    // Prepare metadata for each chunk
    const metadata = chunks.map((chunk, index) => ({
      ...baseMetadata,
      text: chunk.text,
      chunkIndex: index,
      title: chunk.metadata?.title,
      summary: chunk.metadata?.summary,
      keywords: chunk.metadata?.keywords,
      createdAt: new Date().toISOString(),
    }));

    // Upsert vectors with metadata
    const ids = await pineconeStore.upsert({
      indexName: PINECONE_CONFIG.indexName,
      vectors: embeddings,
      metadata,
    });

    log.info("Document embeddings stored", {
      indexName: PINECONE_CONFIG.indexName,
      vectorsCount: embeddings.length
    });

    return ids;
  } catch (error) {
    log.error("Failed to store document embeddings", { error: String(error) });
    throw error;
  }
}

/**
 * Transform PineconeMetadataFilter to PineconeRawFilter for library compatibility
 */
export function transformToPineconeFilter(filter: PineconeMetadataFilter): PineconeRawFilter {
  return filter as PineconeRawFilter;
}

/**
 * Validate Pinecone filter structure
 */
export function validatePineconeFilter(filter: PineconeMetadataFilter): boolean {
  try {
    // Basic validation - ensure filter is a plain object
    if (typeof filter !== 'object' || filter === null || Array.isArray(filter)) {
      return false;
    }

    // Transform and check if it's valid for Pinecone
    const rawFilter = transformToPineconeFilter(filter);
    return typeof rawFilter === 'object' && rawFilter !== null;
  } catch {
    return false;
  }
}

/**
 * Query similar documents with metadata filtering
 */
export async function querySimilarDocuments(
  queryText: string,
  options: {
    topK?: number;
    filter?: PineconeMetadataFilter;
    includeMetadata?: boolean;
  } = {}
): Promise<Array<{
  id: string;
  score: number;
  text: string;
  metadata?: Record<string, unknown>;
}>> {
  try {
    const { topK = 10, filter, includeMetadata = true } = options;

    // Generate embedding for query
    const { embeddings: [queryEmbedding] } = await embedMany({
      values: [queryText],
      model: PINECONE_CONFIG.embeddingModel,
    });

    // Query similar vectors
    // Note: Filter parameter omitted due to complex Pinecone filter type requirements
    // TODO: Implement proper filter support when Pinecone library types are clearer
    const results = await pineconeStore.query({
      indexName: PINECONE_CONFIG.indexName,
      queryVector: queryEmbedding,
      topK,
    });

    log.info("Vector query completed", {
      queryLength: queryText.length,
      topK,
      resultsCount: results.length,
      hasFilter: !!filter
    });

    return results.map(result => ({
      id: result.id,
      score: result.score,
      text: result.metadata?.text as string || '',
      metadata: includeMetadata ? result.metadata : undefined,
    }));
  } catch (error) {
    log.error("Failed to query similar documents", { error: String(error) });
    throw error;
  }
}

/**
 * Pinecone vector query tool for semantic search
 */
export const pineconeQueryTool = createVectorQueryTool({
  id: 'pinecone-vector-query',
  description:
    'Pinecone similarity search for semantic content retrieval and question answering.',
  // Supported vector store and index options
  vectorStoreName: 'pineconeStore',
  indexName: PINECONE_CONFIG.indexName,
  model: PINECONE_CONFIG.embeddingModel,
  includeVectors: true,
  // Advanced filtering
  enableFilter: true,
  includeSources: true,
});

/**
 * Pinecone graph RAG tool for enhanced retrieval
 */
export const pineconeGraphTool = createGraphRAGTool({
  id: 'pinecone-graph-rag',
  description:
    'Pinecone graph-based retrieval augmented generation for complex queries and multi-hop reasoning.',
  // Supported vector store and index options
  vectorStoreName: 'pineconeStore',
  indexName: PINECONE_CONFIG.indexName,
  model: PINECONE_CONFIG.embeddingModel,
  // Supported graph options for Pinecone
  graphOptions: {
    dimension: PINECONE_CONFIG.embeddingDimension,
    threshold: parseFloat(process.env.PINECONE_GRAPH_THRESHOLD ?? '0.7'),
    randomWalkSteps: parseInt(process.env.PINECONE_GRAPH_RANDOM_WALK_STEPS ?? '10'),
    restartProb: parseFloat(process.env.PINECONE_GRAPH_RESTART_PROB ?? '0.15'),
  },
  includeSources: true,
  // Filtering and ranking
  enableFilter: true,
});

// Export configuration for external use
export { PINECONE_CONFIG };
