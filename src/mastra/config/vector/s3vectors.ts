import { S3Vectors } from "@mastra/s3vectors";
import { createVectorQueryTool, createGraphRAGTool } from "@mastra/rag";
import { google } from '@ai-sdk/google';
import { embedMany } from 'ai';
import { log } from '../logger';

/**
 * S3Vectors-compatible filter format for vector queries
 * Based on MongoDB/Sift query syntax as documented for S3Vectors
 *
 * S3Vectors-specific limitations:
 * - Equality values must be primitives (string/number/boolean)
 * - $in/$nin require non-empty arrays of primitives
 * - Implicit AND is canonicalized ({a:1,b:2} → {$and:[{a:1},{b:2}]})
 * - Logical operators must contain field conditions, use non-empty arrays, appear only at root or within other logical operators
 * - $exists requires a boolean value
 * - Keys listed in nonFilterableMetadataKeys are stored but not filterable
 * - Each metadata key name limited to 63 characters
 * - Total metadata per vector: Up to 40 KB (filterable + non-filterable)
 * - Total metadata keys per vector: Up to 10
 * - Filterable metadata per vector: Up to 2 KB
 * - Non-filterable metadata keys per vector index: Up to 10
 */
export interface S3VectorsMetadataFilter {
  [key: string]: string | number | boolean | S3VectorsMetadataFilter | S3VectorsMetadataFilter[] | Array<string | number | boolean> | undefined;
}

/**
 * Raw S3Vectors filter format expected by the library
 * Using Record<string, unknown> for compatibility with @mastra/s3vectors types
 */
export type S3VectorsRawFilter = Record<string, unknown>;

/**
 * S3Vectors configuration for the Governed RAG system
 * Uses Amazon S3 Vectors (Preview) for vector storage and similarity search
 */

// Configuration constants
const S3_VECTORS_CONFIG = {
  bucketName: process.env.S3_VECTORS_BUCKET_NAME ?? "governed-rag-vectors",
  region: process.env.AWS_REGION ?? "us-east-1",
  indexName: "governed-rag",
  // Google Gemini gemini-embedding-001 supports flexible dimensions: 128-3072
  // Recommended: 768, 1536, 3072
  embeddingDimension: parseInt(process.env.S3_EMBEDDING_DIMENSION ?? "1536"),
  embeddingModel: google.textEmbedding("gemini-embedding-001"),
} as const;

/**
 * Initialize S3Vectors store with proper configuration
 */
const s3store = new S3Vectors({
  vectorBucketName: S3_VECTORS_CONFIG.bucketName,
  clientConfig: {
    region: S3_VECTORS_CONFIG.region,
  },
  // Mark content fields as non-filterable for better performance
  nonFilterableMetadataKeys: ["content", "text"],
});

/**
 * Create and configure the vector index
 */
export async function initializeVectorIndex(): Promise<void> {
  try {
    await s3store.createIndex({
      indexName: S3_VECTORS_CONFIG.indexName,
      dimension: S3_VECTORS_CONFIG.embeddingDimension,
      metric: "cosine", // S3 Vectors supports cosine and euclidean
    });

    log.info("Vector index created", {
      indexName: S3_VECTORS_CONFIG.indexName,
      dimension: S3_VECTORS_CONFIG.embeddingDimension
    });
  } catch (error: unknown) {
    // Index might already exist, which is fine
    const errorObj = error as { code?: string };
    if (errorObj.code === 'index_already_exists') {
      log.info("Vector index already exists", { indexName: S3_VECTORS_CONFIG.indexName });
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
      model: S3_VECTORS_CONFIG.embeddingModel,
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
      createdAt: new Date(),
    }));

    // Upsert vectors with metadata
    const ids = await s3store.upsert({
      indexName: S3_VECTORS_CONFIG.indexName,
      vectors: embeddings,
      metadata,
    });

    log.info("Document embeddings stored", {
      indexName: S3_VECTORS_CONFIG.indexName,
      vectorsCount: embeddings.length
    });

    return ids;
  } catch (error) {
    log.error("Failed to store document embeddings", { error: String(error) });
    throw error;
  }
}

/**
 * Query similar documents with metadata filtering
 */
export async function querySimilarDocuments(
  queryText: string,
  options: {
    topK?: number;
    filter?: S3VectorsMetadataFilter;
    includeVector?: boolean;
  } = {}
): Promise<Array<{
  id: string;
  score: number;
  metadata: Record<string, unknown>;
  vector?: number[];
}>> {
  try {
    // Generate embedding for the query
    const { embeddings: [queryEmbedding] } = await embedMany({
      values: [queryText],
      model: S3_VECTORS_CONFIG.embeddingModel,
    });

    // Query the vector store
    // Note: S3Vectors TypeScript types require $or at root, but docs show MongoDB syntax works
    // Using any casting due to incorrect library types - follows upstashMemory.ts pattern
    const results = await s3store.query({
      indexName: S3_VECTORS_CONFIG.indexName,
      queryVector: queryEmbedding,
      topK: options.topK ?? 10,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filter: options.filter as any,
      includeVector: options.includeVector ?? false,
    });

    log.info("Vector query completed", {
      indexName: S3_VECTORS_CONFIG.indexName,
      resultsCount: results.length,
      topK: options.topK ?? 10
    });

    // Ensure metadata is always defined
    return results.map(result => ({
      ...result,
      metadata: result.metadata ?? {}
    }));
  } catch (error) {
    log.error("Failed to query similar documents", { error: String(error) });
    throw error;
  }
}

/**
 * Clean up resources
 */
export async function disconnectVectorStore(): Promise<void> {
  try {
    await s3store.disconnect();
    log.info("S3Vectors store disconnected");
  } catch (error) {
    log.error("Failed to disconnect vector store", { error: String(error) });
    throw error;
  }
}

// Graph-based RAG tool using S3Vectors
export const s3GraphTool = createGraphRAGTool({
  id: 's3-graph-rag',
  description:
    'Graph-based retrieval augmented generation using Amazon S3 Vectors for advanced semantic search and context retrieval.',
  // Supported vector store and index options
  vectorStoreName: 's3store',
  indexName: S3_VECTORS_CONFIG.indexName,
  model: S3_VECTORS_CONFIG.embeddingModel,
  // Supported graph options for S3Vectors
  graphOptions: {
    dimension: S3_VECTORS_CONFIG.embeddingDimension,
    threshold: parseFloat(process.env.S3_GRAPH_THRESHOLD ?? '0.7'),
    randomWalkSteps: parseInt(process.env.S3_GRAPH_RANDOM_WALK_STEPS ?? '10'),
    restartProb: parseFloat(process.env.S3_GRAPH_RESTART_PROB ?? '0.15'),
  },
  includeSources: true,
  // Filtering and ranking
  enableFilter: true,
});

// S3Vectors query tool for semantic search
export const s3QueryTool = createVectorQueryTool({
  id: 's3-vector-query',
  description:
    'Amazon S3 Vectors similarity search for semantic content retrieval and question answering.',
  // Supported vector store and index options
  vectorStoreName: 's3store',
  indexName: S3_VECTORS_CONFIG.indexName,
  model: S3_VECTORS_CONFIG.embeddingModel,
  // Supported database configuration for S3Vectors
  databaseConfig: {
    s3Vectors: {
      minScore: parseFloat(process.env.S3_MIN_SCORE ?? '0.7'),
      // S3Vectors specific parameters
      maxResults: parseInt(process.env.S3_MAX_RESULTS ?? '100'),
    },
  },
  includeVectors: true,
  // Advanced filtering
  enableFilter: true,
  includeSources: true,
});

/**
 * Transform S3Vectors metadata filter to raw filter format
 * Handles any necessary conversions between our interface and library expectations
 */
export function transformToS3VectorsFilter(filter: S3VectorsMetadataFilter): S3VectorsRawFilter {
  // For now, just return as-is since the library types are incorrect
  // In the future, this could handle conversions if needed
  return filter as S3VectorsRawFilter;
}

/**
 * Validate S3Vectors metadata filter according to documented constraints
 */
export function validateS3VectorsFilter(filter: S3VectorsMetadataFilter): S3VectorsMetadataFilter {
  // Basic validation - could be expanded based on S3Vectors constraints
  if (filter === null || typeof filter !== 'object') {
    throw new Error('Filter must be a valid object');
  }

  // Check for oversized metadata keys (63 char limit)
  for (const key of Object.keys(filter)) {
    if (key.length > 63) {
      throw new Error(`Metadata key "${key}" exceeds 63 character limit`);
    }
  }

  return filter;
}

// Export configuration for external use
export { S3_VECTORS_CONFIG };
