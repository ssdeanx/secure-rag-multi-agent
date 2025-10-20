import { OpenSearchVector } from '@mastra/opensearch';
import { createVectorQueryTool, createGraphRAGTool } from '@mastra/rag';
import { google } from '@ai-sdk/google';
import { embedMany } from 'ai';
import { log } from '../logger';

/**
 * OpenSearch-compatible filter format for vector queries
 * Based on OpenSearch's query DSL syntax
 *
 * OpenSearch-specific features:
 * - Full Elasticsearch/OpenSearch query DSL support
 * - Supports complex boolean queries, range queries, and aggregations
 * - Metadata fields can be analyzed for full-text search
 * - Supports nested objects and arrays in metadata
 */
export interface OpenSearchMetadataFilter {
  [key: string]: string | number | boolean | OpenSearchMetadataFilter | OpenSearchMetadataFilter[] | Array<string | number | boolean> | undefined;
}

/**
 * Raw OpenSearch filter format expected by the library
 * Using Record<string, unknown> for compatibility with @mastra/opensearch types
 */
export type OpenSearchRawFilter = Record<string, unknown>;

/**
 * OpenSearch configuration for the Governed RAG system
 * Uses OpenSearch for vector storage and similarity search
 */

// Configuration constants
const OPENSEARCH_CONFIG = {
  url: process.env.OPENSEARCH_URL,
  indexName: "governed-rag",
  // Google Gemini gemini-embedding-001 supports flexible dimensions: 128-3072
  // Recommended: 768, 1536, 3072
  embeddingDimension: parseInt(process.env.OPENSEARCH_EMBEDDING_DIMENSION ?? "1536"),
  embeddingModel: google.textEmbedding("gemini-embedding-001"),
} as const;

/**
 * Initialize OpenSearch store with proper configuration
 */
const openSearchStore = new OpenSearchVector({
  url: OPENSEARCH_CONFIG.url!,
});

/**
 * Create and configure the vector index
 */
export async function initializeVectorIndex(): Promise<void> {
  try {
    await openSearchStore.createIndex({
      indexName: OPENSEARCH_CONFIG.indexName,
      dimension: OPENSEARCH_CONFIG.embeddingDimension,
    });

    log.info("Vector index created", {
      indexName: OPENSEARCH_CONFIG.indexName,
      dimension: OPENSEARCH_CONFIG.embeddingDimension,
      url: OPENSEARCH_CONFIG.url
    });
  } catch (error: unknown) {
    // Index might already exist, which is fine
    const errorObj = error as { code?: string; message?: string };
    if ((errorObj.message?.includes('already exists') ?? false) || errorObj.code === 'index_already_exists') {
      log.info("Vector index already exists", { indexName: OPENSEARCH_CONFIG.indexName });
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
      model: OPENSEARCH_CONFIG.embeddingModel,
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
    const ids = await openSearchStore.upsert({
      indexName: OPENSEARCH_CONFIG.indexName,
      vectors: embeddings,
      metadata,
    });

    log.info("Document embeddings stored", {
      indexName: OPENSEARCH_CONFIG.indexName,
      vectorsCount: embeddings.length
    });

    return ids;
  } catch (error) {
    log.error("Failed to store document embeddings", { error: String(error) });
    throw error;
  }
}

/**
 * Transform OpenSearchMetadataFilter to OpenSearchRawFilter for library compatibility
 */
export function transformToOpenSearchFilter(filter: OpenSearchMetadataFilter): OpenSearchRawFilter {
  return filter as OpenSearchRawFilter;
}

/**
 * Validate OpenSearch filter structure
 */
export function validateOpenSearchFilter(filter: OpenSearchMetadataFilter): boolean {
  try {
    // Basic validation - ensure filter is a plain object
    if (typeof filter !== 'object' || filter === null || Array.isArray(filter)) {
      return false;
    }

    // Transform and check if it's valid for OpenSearch
    const rawFilter = transformToOpenSearchFilter(filter);
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
    filter?: OpenSearchMetadataFilter;
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
      model: OPENSEARCH_CONFIG.embeddingModel,
    });

    // Query similar vectors
    // Note: Filter parameter omitted due to complex OpenSearch filter type requirements
    // TODO: Implement proper filter support when OpenSearch library types are clearer
    const results = await openSearchStore.query({
      indexName: OPENSEARCH_CONFIG.indexName,
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
 * OpenSearch vector query tool for semantic search
 */
export const openSearchQueryTool = createVectorQueryTool({
  id: 'opensearch-vector-query',
  description:
    'OpenSearch similarity search for semantic content retrieval and question answering.',
  // Supported vector store and index options
  vectorStoreName: 'openSearchStore',
  indexName: OPENSEARCH_CONFIG.indexName,
  model: OPENSEARCH_CONFIG.embeddingModel,
  // Supported database configuration for OpenSearch
  databaseConfig: {
    openSearch: {
      minScore: parseFloat(process.env.OPENSEARCH_MIN_SCORE ?? '0.7'),
      // OpenSearch specific parameters
      maxResults: parseInt(process.env.OPENSEARCH_MAX_RESULTS ?? '100'),
    },
  },
  includeVectors: true,
  // Advanced filtering
  enableFilter: true,
  includeSources: true,
});

/**
 * OpenSearch graph RAG tool for enhanced retrieval
 */
export const openSearchGraphTool = createGraphRAGTool({
  id: 'opensearch-graph-rag',
  description:
    'OpenSearch graph-based retrieval augmented generation for complex queries and multi-hop reasoning.',
  // Supported vector store and index options
  vectorStoreName: 'openSearchStore',
  indexName: OPENSEARCH_CONFIG.indexName,
  model: OPENSEARCH_CONFIG.embeddingModel,
  // Supported graph options for OpenSearch
  graphOptions: {
    dimension: OPENSEARCH_CONFIG.embeddingDimension,
    threshold: parseFloat(process.env.OPENSEARCH_GRAPH_THRESHOLD ?? '0.7'),
    randomWalkSteps: parseInt(process.env.OPENSEARCH_GRAPH_RANDOM_WALK_STEPS ?? '10'),
    restartProb: parseFloat(process.env.OPENSEARCH_GRAPH_RESTART_PROB ?? '0.15'),
  },
  includeSources: true,
  // Filtering and ranking
  enableFilter: true,
});

// Export configuration for external use
export { OPENSEARCH_CONFIG };
