import { ChromaVector } from '@mastra/chroma';
import { createVectorQueryTool, createGraphRAGTool } from '@mastra/rag';
import { google } from '@ai-sdk/google';
import { embedMany } from 'ai';
import { log } from '../logger';

/**
 * ChromaDB-compatible filter format for vector queries
 * Based on ChromaDB's metadata filtering syntax
 *
 * ChromaDB-specific limitations:
 * - Metadata values must be strings, numbers, or booleans
 * - Logical operators: $and, $or
 * - Comparison operators: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin
 * - Text search: $contains, $not_contains
 */
export interface ChromaMetadataFilter {
  [key: string]: string | number | boolean | ChromaMetadataFilter | ChromaMetadataFilter[] | Array<string | number | boolean> | undefined;
}

/**
 * Raw ChromaDB filter format expected by the library
 * Using Record<string, unknown> for compatibility with @mastra/chroma types
 */
export type ChromaRawFilter = Record<string, unknown>;

/**
 * ChromaDB configuration for the Governed RAG system
 * Supports both local ChromaDB instances and Chroma Cloud
 */

// Configuration constants
const CHROMA_CONFIG = {
  // For Chroma Cloud
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
  // For local ChromaDB
  url: process.env.CHROMA_URL,
  indexName: "governed-rag",
  // Google Gemini gemini-embedding-001 supports flexible dimensions: 128-3072
  // Recommended: 768, 1536, 3072
  embeddingDimension: parseInt(process.env.CHROMA_EMBEDDING_DIMENSION ?? "1536"),
  embeddingModel: google.textEmbedding("gemini-embedding-001"),
} as const;

/**
 * Initialize ChromaDB store with proper configuration
 */
const chromaStore = new ChromaVector(
  (CHROMA_CONFIG.apiKey !== null && CHROMA_CONFIG.apiKey !== undefined && CHROMA_CONFIG.apiKey.trim() !== "") &&
  (CHROMA_CONFIG.tenant !== null && CHROMA_CONFIG.tenant !== undefined && CHROMA_CONFIG.tenant.trim() !== "") &&
  (CHROMA_CONFIG.database !== null && CHROMA_CONFIG.database !== undefined && CHROMA_CONFIG.database.trim() !== "")
    ? {
        apiKey: CHROMA_CONFIG.apiKey,
        tenant: CHROMA_CONFIG.tenant,
        database: CHROMA_CONFIG.database,
      }
    : undefined
);

/**
 * Create and configure the vector index
 */
export async function initializeVectorIndex(): Promise<void> {
  try {
    await chromaStore.createIndex({
      indexName: CHROMA_CONFIG.indexName,
      dimension: CHROMA_CONFIG.embeddingDimension,
    });

    log.info("Vector index created", {
      indexName: CHROMA_CONFIG.indexName,
      dimension: CHROMA_CONFIG.embeddingDimension,
      provider: (CHROMA_CONFIG.apiKey?.trim() ?? "") !== "" ? "Chroma Cloud" : "Local ChromaDB"
    });
  } catch (error: unknown) {
    // Index might already exist, which is fine
    const errorObj = error as { code?: string; message?: string };
    if ((errorObj.message?.includes('already exists') ?? false) || errorObj.code === 'index_already_exists') {
      log.info("Vector index already exists", { indexName: CHROMA_CONFIG.indexName });
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
      model: CHROMA_CONFIG.embeddingModel,
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
    const ids = await chromaStore.upsert({
      indexName: CHROMA_CONFIG.indexName,
      vectors: embeddings,
      metadata,
    });

    log.info("Document embeddings stored", {
      indexName: CHROMA_CONFIG.indexName,
      vectorsCount: embeddings.length
    });

    return ids;
  } catch (error) {
    log.error("Failed to store document embeddings", { error: String(error) });
    throw error;
  }
}

/**
 * Transform ChromaMetadataFilter to ChromaRawFilter for library compatibility
 */
export function transformToChromaFilter(filter: ChromaMetadataFilter): ChromaRawFilter {
  return filter as ChromaRawFilter;
}

/**
 * Validate ChromaDB filter structure
 */
export function validateChromaFilter(filter: ChromaMetadataFilter): boolean {
  try {
    // Basic validation - ensure filter is a plain object
    if (typeof filter !== 'object' || filter === null || Array.isArray(filter)) {
      return false;
    }

    // Transform and check if it's valid for ChromaDB
    const rawFilter = transformToChromaFilter(filter);
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
    filter?: ChromaMetadataFilter;
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
      model: CHROMA_CONFIG.embeddingModel,
    });

    // Query similar vectors
    // Note: Filter parameter omitted due to complex ChromaDB filter type requirements
    // TODO: Implement proper filter support when ChromaDB library types are clearer
    const results = await chromaStore.query({
      indexName: CHROMA_CONFIG.indexName,
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
 * ChromaDB vector query tool for semantic search
 */
export const chromaQueryTool = createVectorQueryTool({
  id: 'chroma-vector-query',
  description:
    'ChromaDB similarity search for semantic content retrieval and question answering.',
  // Supported vector store and index options
  vectorStoreName: 'chromaStore',
  indexName: CHROMA_CONFIG.indexName,
  model: CHROMA_CONFIG.embeddingModel,
  // Supported database configuration for ChromaDB
  databaseConfig: {
    chromaDb: {
      minScore: parseFloat(process.env.CHROMA_MIN_SCORE ?? '0.7'),
      // ChromaDB specific parameters
      maxResults: parseInt(process.env.CHROMA_MAX_RESULTS ?? '100'),
    },
  },
  includeVectors: true,
  // Advanced filtering
  enableFilter: true,
  includeSources: true,
});

/**
 * ChromaDB graph RAG tool for enhanced retrieval
 */
export const chromaGraphTool = createGraphRAGTool({
  id: 'chroma-graph-rag',
  description:
    'ChromaDB graph-based retrieval augmented generation for complex queries and multi-hop reasoning.',
  // Supported vector store and index options
  vectorStoreName: 'chromaStore',
  indexName: CHROMA_CONFIG.indexName,
  model: CHROMA_CONFIG.embeddingModel,
  // Supported graph options for ChromaDB
  graphOptions: {
    dimension: CHROMA_CONFIG.embeddingDimension,
    threshold: parseFloat(process.env.CHROMA_GRAPH_THRESHOLD ?? '0.7'),
    randomWalkSteps: parseInt(process.env.CHROMA_GRAPH_RANDOM_WALK_STEPS ?? '10'),
    restartProb: parseFloat(process.env.CHROMA_GRAPH_RESTART_PROB ?? '0.15'),
  },
  includeSources: true,
  // Filtering and ranking
  enableFilter: true,
});

// Export configuration for external use
export { CHROMA_CONFIG };
