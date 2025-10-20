import { CouchbaseVector } from '@mastra/couchbase';
import { createVectorQueryTool, createGraphRAGTool } from '@mastra/rag';
import { google } from '@ai-sdk/google';
import { embedMany } from 'ai';
import { log } from '../logger';

/**
 * Couchbase-compatible filter format for vector queries
 * Based on Couchbase N1QL query syntax
 *
 * Couchbase-specific features:
 * - Full N1QL query language support for metadata filtering
 * - Supports complex SQL-like queries with JOINs, aggregations, and subqueries
 * - Metadata fields are stored as JSON and can be queried with full SQL syntax
 * - Supports geospatial queries and full-text search
 */
export interface CouchbaseMetadataFilter {
  [key: string]: string | number | boolean | CouchbaseMetadataFilter | CouchbaseMetadataFilter[] | Array<string | number | boolean> | undefined;
}

/**
 * Raw Couchbase filter format expected by the library
 * Using Record<string, unknown> for compatibility with @mastra/couchbase types
 */
export type CouchbaseRawFilter = Record<string, unknown>;

/**
 * Couchbase configuration for the Governed RAG system
 * Uses Couchbase Server for vector storage and similarity search
 */

// Configuration constants
const COUCHBASE_CONFIG = {
  connectionString: process.env.COUCHBASE_CONNECTION_STRING,
  username: process.env.COUCHBASE_USERNAME,
  password: process.env.COUCHBASE_PASSWORD,
  bucketName: process.env.COUCHBASE_BUCKET,
  scopeName: process.env.COUCHBASE_SCOPE,
  collectionName: process.env.COUCHBASE_COLLECTION,
  indexName: "governed-rag",
  // Google Gemini gemini-embedding-001 supports flexible dimensions: 128-3072
  // Recommended: 768, 1536, 3072
  embeddingDimension: parseInt(process.env.COUCHBASE_EMBEDDING_DIMENSION ?? "1536"),
  embeddingModel: google.textEmbedding("gemini-embedding-001"),
} as const;

/**
 * Initialize Couchbase store with proper configuration
 */
const couchbaseStore = new CouchbaseVector({
  connectionString: COUCHBASE_CONFIG.connectionString!,
  username: COUCHBASE_CONFIG.username!,
  password: COUCHBASE_CONFIG.password!,
  bucketName: COUCHBASE_CONFIG.bucketName!,
  scopeName: COUCHBASE_CONFIG.scopeName!,
  collectionName: COUCHBASE_CONFIG.collectionName!,
});

/**
 * Create and configure the vector index
 */
export async function initializeVectorIndex(): Promise<void> {
  try {
    await couchbaseStore.createIndex({
      indexName: COUCHBASE_CONFIG.indexName,
      dimension: COUCHBASE_CONFIG.embeddingDimension,
    });

    log.info("Vector index created", {
      indexName: COUCHBASE_CONFIG.indexName,
      dimension: COUCHBASE_CONFIG.embeddingDimension,
      bucket: COUCHBASE_CONFIG.bucketName,
      scope: COUCHBASE_CONFIG.scopeName,
      collection: COUCHBASE_CONFIG.collectionName
    });
  } catch (error: unknown) {
    // Index might already exist, which is fine
    const errorObj = error as { code?: string; message?: string };
    if ((errorObj.message?.includes('already exists') ?? false) || errorObj.code === 'index_already_exists') {
      log.info("Vector index already exists", { indexName: COUCHBASE_CONFIG.indexName });
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
      model: COUCHBASE_CONFIG.embeddingModel,
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
    const ids = await couchbaseStore.upsert({
      indexName: COUCHBASE_CONFIG.indexName,
      vectors: embeddings,
      metadata,
    });

    log.info("Document embeddings stored", {
      indexName: COUCHBASE_CONFIG.indexName,
      vectorsCount: embeddings.length
    });

    return ids;
  } catch (error) {
    log.error("Failed to store document embeddings", { error: String(error) });
    throw error;
  }
}

/**
 * Transform CouchbaseMetadataFilter to CouchbaseRawFilter for library compatibility
 */
export function transformToCouchbaseFilter(filter: CouchbaseMetadataFilter): CouchbaseRawFilter {
  return filter as CouchbaseRawFilter;
}

/**
 * Validate Couchbase filter structure
 */
export function validateCouchbaseFilter(filter: CouchbaseMetadataFilter): boolean {
  try {
    // Basic validation - ensure filter is a plain object
    if (typeof filter !== 'object' || filter === null || Array.isArray(filter)) {
      return false;
    }

    // Transform and check if it's valid for Couchbase
    const rawFilter = transformToCouchbaseFilter(filter);
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
    filter?: CouchbaseMetadataFilter;
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
      model: COUCHBASE_CONFIG.embeddingModel,
    });

    // Query similar vectors
    // Note: Filter parameter omitted due to complex Couchbase filter type requirements
    // TODO: Implement proper filter support when Couchbase library types are clearer
    const results = await couchbaseStore.query({
      indexName: COUCHBASE_CONFIG.indexName,
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
 * Couchbase vector query tool for semantic search
 */
export const couchbaseQueryTool = createVectorQueryTool({
  id: 'couchbase-vector-query',
  description:
    'Couchbase similarity search for semantic content retrieval and question answering.',
  // Supported vector store and index options
  vectorStoreName: 'couchbaseStore',
  indexName: COUCHBASE_CONFIG.indexName,
  model: COUCHBASE_CONFIG.embeddingModel,
  // Supported database configuration for Couchbase
  databaseConfig: {
    couchbase: {
      minScore: parseFloat(process.env.COUCHBASE_MIN_SCORE ?? '0.7'),
      // Couchbase specific parameters
      maxResults: parseInt(process.env.COUCHBASE_MAX_RESULTS ?? '100'),
    },
  },
  includeVectors: true,
  // Advanced filtering
  enableFilter: true,
  includeSources: true,
});

/**
 * Couchbase graph RAG tool for enhanced retrieval
 */
export const couchbaseGraphTool = createGraphRAGTool({
  id: 'couchbase-graph-rag',
  description:
    'Couchbase graph-based retrieval augmented generation for complex queries and multi-hop reasoning.',
  // Supported vector store and index options
  vectorStoreName: 'couchbaseStore',
  indexName: COUCHBASE_CONFIG.indexName,
  model: COUCHBASE_CONFIG.embeddingModel,
  // Supported graph options for Couchbase
  graphOptions: {
    dimension: COUCHBASE_CONFIG.embeddingDimension,
    threshold: parseFloat(process.env.COUCHBASE_GRAPH_THRESHOLD ?? '0.7'),
    randomWalkSteps: parseInt(process.env.COUCHBASE_GRAPH_RANDOM_WALK_STEPS ?? '10'),
    restartProb: parseFloat(process.env.COUCHBASE_GRAPH_RESTART_PROB ?? '0.15'),
  },
  includeSources: true,
  // Filtering and ranking
  enableFilter: true,
});

// Export configuration for external use
export { COUCHBASE_CONFIG };
