import { MongoDBVector } from "@mastra/mongodb";
import { createVectorQueryTool, createGraphRAGTool } from "@mastra/rag";
import { google } from '@ai-sdk/google';
import { embedMany } from 'ai';
import { log } from '../logger';

/**
 * MongoDB Vector configuration for the Governed RAG system
 * Uses MongoDB Atlas Vector Search for vector storage and similarity search
 */

// Configuration constants
const MONGODB_CONFIG = {
  uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017',
  dbName: process.env.MONGODB_DATABASE ?? 'mastra_db',
  collectionName: process.env.MONGODB_COLLECTION ?? 'governed_rag',
  // Google Gemini gemini-embedding-001 supports flexible dimensions: 128-3072
  // Recommended: 768, 1536, 3072
  embeddingDimension: parseInt(process.env.MONGODB_EMBEDDING_DIMENSION ?? "1536"),
  embeddingModel: google.textEmbedding("gemini-embedding-001"),
} as const;

/**
 * Initialize MongoDB Vector store with proper configuration
 */
const mongoStore = new MongoDBVector({
  uri: MONGODB_CONFIG.uri,
  dbName: MONGODB_CONFIG.dbName,
});

/**
 * MongoDB-compatible filter format for vector queries
 * Supports full MongoDB/Sift query syntax for metadata filtering
 *
 * MongoDB-specific features:
 * - Full support for MongoDB/Sift query syntax for metadata filters
 * - Supports all standard comparison, array, logical, and element operators
 * - Supports nested fields and arrays in metadata
 * - Filtering can be applied to both metadata and the original document content
 * - No artificial limits on filter size or complexity (subject to MongoDB query limits)
 * - Indexing metadata fields is recommended for optimal performance
 */
export interface MongoDBMetadataFilter {
  [key: string]: string | number | boolean | MongoDBMetadataFilter | MongoDBMetadataFilter[] | Array<string | number | boolean> | undefined;
}

/**
 * Raw MongoDB filter format expected by the library
 * Using Record<string, unknown> for compatibility with @mastra/mongodb types
 */
export type MongoDBRawFilter = Record<string, unknown>;

/**
 * Create and configure the vector index
 */
export async function initializeVectorIndex(): Promise<void> {
  try {
    await mongoStore.createIndex({
      indexName: MONGODB_CONFIG.collectionName,
      dimension: MONGODB_CONFIG.embeddingDimension,
      metric: "cosine", // MongoDB supports cosine, euclidean, and dotProduct
    });

    log.info("Vector index created", {
      collectionName: MONGODB_CONFIG.collectionName,
      dimension: MONGODB_CONFIG.embeddingDimension
    });
  } catch (error: unknown) {
    // Index might already exist, which is fine
    const errorObj = error as { code?: number };
    if (errorObj.code === 11000) { // Duplicate key error
      log.info("Vector index already exists", { collectionName: MONGODB_CONFIG.collectionName });
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
      model: MONGODB_CONFIG.embeddingModel,
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
    metadata?: Record<string, unknown>;
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
      createdAt: new Date(),
      ...chunk.metadata,
    }));

    // Upsert vectors with metadata
    const ids = await mongoStore.upsert({
      indexName: MONGODB_CONFIG.collectionName,
      vectors: embeddings,
      metadata,
    });

    log.info("Document embeddings stored", {
      collectionName: MONGODB_CONFIG.collectionName,
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
    filter?: MongoDBMetadataFilter;
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
      model: MONGODB_CONFIG.embeddingModel,
    });

    // Query the vector store
    const results = await mongoStore.query({
      indexName: MONGODB_CONFIG.collectionName,
      queryVector: queryEmbedding,
      topK: options.topK ?? 10,
      filter: options.filter,
      includeVector: options.includeVector ?? false,
    });

    log.info("Vector query completed", {
      collectionName: MONGODB_CONFIG.collectionName,
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
    await mongoStore.disconnect();
    log.info("MongoDB Vector store disconnected");
  } catch (error) {
    log.error("Failed to disconnect vector store", { error: String(error) });
    throw error;
  }
}

// Graph-based RAG tool using MongoDB Vector
export const mongoGraphTool = createGraphRAGTool({
  id: 'mongo-graph-rag',
  description:
    'Graph-based retrieval augmented generation using MongoDB Vector Search for advanced semantic search and context retrieval.',
  // Supported vector store and index options
  vectorStoreName: 'mongoStore',
  indexName: MONGODB_CONFIG.collectionName,
  model: MONGODB_CONFIG.embeddingModel,
  // Supported graph options for MongoDB
  graphOptions: {
    dimension: MONGODB_CONFIG.embeddingDimension,
    threshold: parseFloat(process.env.MONGO_GRAPH_THRESHOLD ?? '0.7'),
    randomWalkSteps: parseInt(process.env.MONGO_GRAPH_RANDOM_WALK_STEPS ?? '10'),
    restartProb: parseFloat(process.env.MONGO_GRAPH_RESTART_PROB ?? '0.15'),
  },
  includeSources: true,
  // Filtering and ranking
  enableFilter: true,
});

// MongoDB Vector query tool for semantic search
export const mongoQueryTool = createVectorQueryTool({
  id: 'mongo-vector-query',
  description:
    'MongoDB Vector Search similarity search for semantic content retrieval and question answering.',
  // Supported vector store and index options
  vectorStoreName: 'mongoStore',
  indexName: MONGODB_CONFIG.collectionName,
  model: MONGODB_CONFIG.embeddingModel,
  // Supported database configuration for MongoDB
  databaseConfig: {
    mongoDb: {
      minScore: parseFloat(process.env.MONGO_MIN_SCORE ?? '0.7'),
      // MongoDB specific parameters
      maxResults: parseInt(process.env.MONGO_MAX_RESULTS ?? '100'),
    },
  },
  includeVectors: true,
  // Advanced filtering
  enableFilter: true,
  includeSources: true,
});

/**
 * Transform MongoDB metadata filter to raw filter format
 * Handles any necessary conversions between our interface and library expectations
 */
export function transformToMongoDBFilter(filter: MongoDBMetadataFilter): MongoDBRawFilter {
  // For MongoDB, the filter format is already compatible
  // This function can be expanded if any transformations are needed
  return filter as MongoDBRawFilter;
}

/**
 * Validate MongoDB metadata filter according to documented constraints
 */
export function validateMongoDBFilter(filter: MongoDBMetadataFilter): MongoDBMetadataFilter {
  // Basic validation - MongoDB has fewer constraints than S3Vectors
  if (filter === null || typeof filter !== 'object') {
    throw new Error('Filter must be a valid object');
  }

  return filter;
}

// Export configuration for external use
export { MONGODB_CONFIG };
