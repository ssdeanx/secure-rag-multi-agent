import { AstraVector } from '@mastra/astra';
import { createVectorQueryTool, createGraphRAGTool } from '@mastra/rag';
import { google } from '@ai-sdk/google';
import { embedMany } from 'ai';
import { log } from '../logger';

/**
 * AstraDB-compatible filter format for vector queries
 * Based on AstraDB's metadata filtering syntax
 *
 * AstraDB-specific features:
 * - Full JSON-based metadata filtering
 * - Supports complex nested queries
 * - Metadata fields are indexed for fast filtering
 * - Supports range queries, text search, and geospatial queries
 */
export interface AstraMetadataFilter {
  [key: string]: string | number | boolean | AstraMetadataFilter | AstraMetadataFilter[] | Array<string | number | boolean> | undefined;
}

/**
 * Raw AstraDB filter format expected by the library
 * Using Record<string, unknown> for compatibility with @mastra/astra types
 */
export type AstraRawFilter = Record<string, unknown>;

/**
 * AstraDB configuration for the Governed RAG system
 * Uses DataStax AstraDB for vector storage and similarity search
 */

// Configuration constants
const ASTRA_CONFIG = {
  token: process.env.ASTRA_DB_TOKEN,
  endpoint: process.env.ASTRA_DB_ENDPOINT,
  keyspace: process.env.ASTRA_DB_KEYSPACE,
  indexName: "governed-rag",
  // Google Gemini gemini-embedding-001 supports flexible dimensions: 128-3072
  // Recommended: 768, 1536, 3072
  embeddingDimension: parseInt(process.env.ASTRA_EMBEDDING_DIMENSION ?? "1536"),
  embeddingModel: google.textEmbedding("gemini-embedding-001"),
} as const;

/**
 * Initialize AstraDB store with proper configuration
 */
const astraStore = new AstraVector({
  token: ASTRA_CONFIG.token!,
  endpoint: ASTRA_CONFIG.endpoint!,
  keyspace: ASTRA_CONFIG.keyspace!,
});

/**
 * Create and configure the vector index
 */
export async function initializeVectorIndex(): Promise<void> {
  try {
    await astraStore.createIndex({
      indexName: ASTRA_CONFIG.indexName,
      dimension: ASTRA_CONFIG.embeddingDimension,
    });

    log.info("Vector index created", {
      indexName: ASTRA_CONFIG.indexName,
      dimension: ASTRA_CONFIG.embeddingDimension,
      keyspace: ASTRA_CONFIG.keyspace
    });
  } catch (error: unknown) {
    // Index might already exist, which is fine
    const errorObj = error as { code?: string; message?: string };
    if ((errorObj.message?.includes('already exists') ?? false) || errorObj.code === 'index_already_exists') {
      log.info("Vector index already exists", { indexName: ASTRA_CONFIG.indexName });
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
      model: ASTRA_CONFIG.embeddingModel,
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
    const ids = await astraStore.upsert({
      indexName: ASTRA_CONFIG.indexName,
      vectors: embeddings,
      metadata,
    });

    log.info("Document embeddings stored", {
      indexName: ASTRA_CONFIG.indexName,
      vectorsCount: embeddings.length
    });

    return ids;
  } catch (error) {
    log.error("Failed to store document embeddings", { error: String(error) });
    throw error;
  }
}

/**
 * Transform AstraMetadataFilter to AstraRawFilter for library compatibility
 */
export function transformToAstraFilter(filter: AstraMetadataFilter): AstraRawFilter {
  return filter as AstraRawFilter;
}

/**
 * Validate AstraDB filter structure
 */
export function validateAstraFilter(filter: AstraMetadataFilter): boolean {
  try {
    // Basic validation - ensure filter is a plain object
    if (typeof filter !== 'object' || filter === null || Array.isArray(filter)) {
      return false;
    }

    // Transform and check if it's valid for AstraDB
    const rawFilter = transformToAstraFilter(filter);
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
    filter?: AstraMetadataFilter;
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
      model: ASTRA_CONFIG.embeddingModel,
    });

    // Query similar vectors
    // Note: Filter parameter omitted due to complex AstraDB filter type requirements
    // TODO: Implement proper filter support when AstraDB library types are clearer
    const results = await astraStore.query({
      indexName: ASTRA_CONFIG.indexName,
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
 * AstraDB vector query tool for semantic search
 */
export const astraQueryTool = createVectorQueryTool({
  id: 'astra-vector-query',
  description:
    'AstraDB similarity search for semantic content retrieval and question answering.',
  // Supported vector store and index options
  vectorStoreName: 'astraStore',
  indexName: ASTRA_CONFIG.indexName,
  model: ASTRA_CONFIG.embeddingModel,
  // Supported database configuration for AstraDB
  databaseConfig: {
    astraDb: {
      minScore: parseFloat(process.env.ASTRA_MIN_SCORE ?? '0.7'),
      // AstraDB specific parameters
      maxResults: parseInt(process.env.ASTRA_MAX_RESULTS ?? '100'),
    },
  },
  includeVectors: true,
  // Advanced filtering
  enableFilter: true,
  includeSources: true,
});

/**
 * AstraDB graph RAG tool for enhanced retrieval
 */
export const astraGraphTool = createGraphRAGTool({
  id: 'astra-graph-rag',
  description:
    'AstraDB graph-based retrieval augmented generation for complex queries and multi-hop reasoning.',
  // Supported vector store and index options
  vectorStoreName: 'astraStore',
  indexName: ASTRA_CONFIG.indexName,
  model: ASTRA_CONFIG.embeddingModel,
  // Supported graph options for AstraDB
  graphOptions: {
    dimension: ASTRA_CONFIG.embeddingDimension,
    threshold: parseFloat(process.env.ASTRA_GRAPH_THRESHOLD ?? '0.7'),
    randomWalkSteps: parseInt(process.env.ASTRA_GRAPH_RANDOM_WALK_STEPS ?? '10'),
    restartProb: parseFloat(process.env.ASTRA_GRAPH_RESTART_PROB ?? '0.15'),
  },
  includeSources: true,
  // Filtering and ranking
  enableFilter: true,
});

// Export configuration for external use
export { ASTRA_CONFIG };
