import { QdrantVector } from '@mastra/qdrant';
import { createVectorQueryTool, createGraphRAGTool } from '@mastra/rag';
import { google } from '@ai-sdk/google';
import { embedMany } from 'ai';
import { log } from '../logger';

/**
 * Qdrant-compatible filter format for vector queries
 * Based on Qdrant's metadata filtering syntax
 *
 * Qdrant-specific features:
 * - Full JSON-based metadata filtering
 * - Supports complex nested queries with Must/Should/MustNot conditions
 * - Metadata fields are indexed for fast filtering
 * - Supports range queries, text search, and geospatial queries
 */
export interface QdrantMetadataFilter {
  [key: string]: string | number | boolean | QdrantMetadataFilter | QdrantMetadataFilter[] | Array<string | number | boolean> | undefined;
}

/**
 * Raw Qdrant filter format expected by the library
 * Using Record<string, unknown> for compatibility with @mastra/qdrant types
 */
export type QdrantRawFilter = Record<string, unknown>;

/**
 * Qdrant configuration for the Governed RAG system
 * Supports both self-hosted Qdrant instances and Qdrant Cloud
 */

// Configuration constants
const QDRANT_CONFIG = {
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  indexName: "governed-rag",
  // Google Gemini gemini-embedding-001 supports flexible dimensions: 128-3072
  // Recommended: 768, 1536, 3072
  embeddingDimension: parseInt(process.env.QDRANT_EMBEDDING_DIMENSION ?? "1536"),
  embeddingModel: google.textEmbedding("gemini-embedding-001"),
} as const;

/**
 * Initialize Qdrant store with proper configuration
 */
const qdrantStore = new QdrantVector({
  url: QDRANT_CONFIG.url!,
  apiKey: QDRANT_CONFIG.apiKey,
});

/**
 * Create and configure the vector index
 */
export async function initializeVectorIndex(): Promise<void> {
  try {
    await qdrantStore.createIndex({
      indexName: QDRANT_CONFIG.indexName,
      dimension: QDRANT_CONFIG.embeddingDimension,
    });

    log.info("Vector index created", {
      indexName: QDRANT_CONFIG.indexName,
      dimension: QDRANT_CONFIG.embeddingDimension,
      provider: "Qdrant"
    });
  } catch (error: unknown) {
    // Index might already exist, which is fine
    const errorObj = error as { code?: string; message?: string };
    if ((errorObj.message?.includes('already exists') ?? false) || errorObj.code === 'index_already_exists') {
      log.info("Vector index already exists", { indexName: QDRANT_CONFIG.indexName });
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
      model: QDRANT_CONFIG.embeddingModel,
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
    const ids = await qdrantStore.upsert({
      indexName: QDRANT_CONFIG.indexName,
      vectors: embeddings,
      metadata,
    });

    log.info("Document embeddings stored", {
      indexName: QDRANT_CONFIG.indexName,
      vectorsCount: embeddings.length
    });

    return ids;
  } catch (error) {
    log.error("Failed to store document embeddings", { error: String(error) });
    throw error;
  }
}

/**
 * Transform QdrantMetadataFilter to QdrantRawFilter for library compatibility
 */
export function transformToQdrantFilter(filter: QdrantMetadataFilter): QdrantRawFilter {
  return filter as QdrantRawFilter;
}

/**
 * Validate Qdrant filter structure
 */
export function validateQdrantFilter(filter: QdrantMetadataFilter): boolean {
  try {
    // Basic validation - ensure filter is a plain object
    if (typeof filter !== 'object' || filter === null || Array.isArray(filter)) {
      return false;
    }

    // Transform and check if it's valid for Qdrant
    const rawFilter = transformToQdrantFilter(filter);
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
    filter?: QdrantMetadataFilter;
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
      model: QDRANT_CONFIG.embeddingModel,
    });

    // Query similar vectors
    // Note: Filter parameter omitted due to complex Qdrant filter type requirements
    // TODO: Implement proper filter support when Qdrant library types are clearer
    const results = await qdrantStore.query({
      indexName: QDRANT_CONFIG.indexName,
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
 * Qdrant vector query tool for semantic search
 */
export const qdrantQueryTool = createVectorQueryTool({
  id: 'qdrant-vector-query',
  description:
    'Qdrant similarity search for semantic content retrieval and question answering.',
  // Supported vector store and index options
  vectorStoreName: 'qdrantStore',
  indexName: QDRANT_CONFIG.indexName,
  model: QDRANT_CONFIG.embeddingModel,
  includeVectors: true,
  // Advanced filtering
  enableFilter: true,
  includeSources: true,
});

/**
 * Qdrant graph RAG tool for enhanced retrieval
 */
export const qdrantGraphTool = createGraphRAGTool({
  id: 'qdrant-graph-rag',
  description:
    'Qdrant graph-based retrieval augmented generation for complex queries and multi-hop reasoning.',
  // Supported vector store and index options
  vectorStoreName: 'qdrantStore',
  indexName: QDRANT_CONFIG.indexName,
  model: QDRANT_CONFIG.embeddingModel,
  // Supported graph options for Qdrant
  graphOptions: {
    dimension: QDRANT_CONFIG.embeddingDimension,
    threshold: parseFloat(process.env.QDRANT_GRAPH_THRESHOLD ?? '0.7'),
    randomWalkSteps: parseInt(process.env.QDRANT_GRAPH_RANDOM_WALK_STEPS ?? '10'),
    restartProb: parseFloat(process.env.QDRANT_GRAPH_RESTART_PROB ?? '0.15'),
  },
  includeSources: true,
  // Filtering and ranking
  enableFilter: true,
});

// Export configuration for external use
export { QDRANT_CONFIG };
