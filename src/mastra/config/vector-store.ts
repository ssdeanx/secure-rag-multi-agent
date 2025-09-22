import { QdrantVector } from '@mastra/qdrant'
import { embedMany } from "ai";
import { google } from "@ai-sdk/google";
import { log } from "./logger";
import { AISpanType, AITracingEventType } from '@mastra/core/ai-tracing';

// Production-grade QdrantVector configuration
const qVector = new QdrantVector({
  url: process.env.QDRANT_URL ?? 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY ?? '',
  https: process.env.QDRANT_HTTPS === 'true', // Enable TLS when explicitly set
})

/**
 * Initialize the Qdrant vector store index with production settings.
 * Call this during application bootstrap.
 */
export async function initVectorStore() {
  try {
    await qVector.createIndex({
      indexName: 'governed_rag',
      dimension: 3072,
      metric: 'cosine',
    });
  } catch (error) {
    log.error('Failed to initialize Qdrant vector store index', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

// Production utility functions
export class VectorStoreUtils {
  private static tracingEnabled = process.env.AI_TRACING_ENABLED === 'true';
  private static retryAttempts = parseInt(process.env.VECTOR_STORE_RETRY_ATTEMPTS ?? '3');
  private static retryDelay = parseInt(process.env.VECTOR_STORE_RETRY_DELAY ?? '1000');

  /**
   * Generic retry wrapper with exponential backoff
   */
  private static async withRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    context: Record<string, any> = {}
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === this.retryAttempts) {
          log.error(`Operation ${operationName} failed after ${this.retryAttempts} attempts`, {
            ...context,
            attempt,
            error: lastError.message
          });
          break;
        }

        const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        log.warn(`Operation ${operationName} failed, retrying in ${delay}ms`, {
          ...context,
          attempt,
          error: lastError.message
        });

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Validate upsert input parameters
   */
  private static validateUpsertInput(
    vectors: number[][],
    metadata: Array<Record<string, any>>,
    ids?: string[]
  ): void {
    if (vectors.length === 0) {
      throw new Error('Vectors array cannot be empty');
    }

    if (vectors.length !== metadata.length) {
      throw new Error(`Vectors length (${vectors.length}) must match metadata length (${metadata.length})`);
    }

    if (ids && ids.length !== vectors.length) {
      throw new Error(`IDs length (${ids.length}) must match vectors length (${vectors.length})`);
    }

    // Validate vector dimensions
    const dimension = vectors[0].length;
    for (let i = 1; i < vectors.length; i++) {
      if (vectors[i].length !== dimension) {
        throw new Error(`All vectors must have the same dimension. Expected ${dimension}, got ${vectors[i].length} at index ${i}`);
      }
    }

    // Validate dimension matches expected
    if (dimension !== 3072) {
      log.warn('Vector dimension does not match expected dimension', {
        expected: 3072,
        actual: dimension
      });
    }
  }

  /**
   * Validate query input parameters
   */
  private static validateQueryInput(
    queryVector: number[],
    options: {
      topK?: number;
      filter?: Record<string, any>;
      includeVector?: boolean;
      scoreThreshold?: number;
    }
  ): void {
    if (queryVector === null || queryVector.length === 0) {
      throw new Error('Query vector cannot be empty');
    }

    if (queryVector.length !== 3072) {
      log.warn('Query vector dimension does not match expected dimension', {
        expected: 3072,
        actual: queryVector.length
      });
    }

    const topK = options.topK ?? 10;
    if (topK <= 0 || topK > 1000) {
      throw new Error('topK must be between 1 and 1000');
    }

    if (options.scoreThreshold !== undefined && (options.scoreThreshold < 0 || options.scoreThreshold > 1)) {
      throw new Error('scoreThreshold must be between 0 and 1');
    }
  }

  /**
   * Create a typed vector store error
   */
  private static createVectorStoreError(
    code: string,
    message: string,
    context: Record<string, any> = {}
  ): VectorStoreError {
    return new VectorStoreError(code, message, context);
  }

  /**
   * Enhanced upsert with tracing and error handling
   */
  static async upsertWithTracing(
    indexName: string,
    vectors: number[][],
    metadata: Array<Record<string, any>>,
    ids?: string[]
  ) {
    return this.withRetry(async () => {
      const span = this.tracingEnabled ? this.createTracingSpan(AISpanType.GENERIC, {
        indexName,
        vectorCount: vectors.length,
        operation: 'upsert'
      }) : null;

      try {
        this.validateUpsertInput(vectors, metadata, ids);

        log.info('Starting vector upsert operation', {
          indexName,
          vectorCount: vectors.length,
          hasIds: !!ids,
          tracingEnabled: this.tracingEnabled
        });

        const result = await qVector.upsert({
          indexName,
          vectors,
          metadata,
          ids
        });

        log.info('Vector upsert completed successfully', {
          indexName,
          vectorCount: vectors.length,
          result: 'success'
        });

        if (span) {
          span.end({
            output: { vectorCount: vectors.length, success: true },
            metadata: {
              indexName,
              operation: 'upsert',
              vectorCount: vectors.length,
              hasIds: !!ids
            }
          });
        }

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        log.error('Vector upsert failed', {
          indexName,
          vectorCount: vectors.length,
          error: errorMessage
        });

        if (span) {
          span.error({
            error: error instanceof Error ? error : new Error(errorMessage),
            metadata: { indexName, operation: 'upsert', vectorCount: vectors.length }
          });
        }

        throw this.createVectorStoreError('UPSERT_FAILED', errorMessage, { indexName, vectorCount: vectors.length });
      }
    }, 'upsert', { indexName });
  }

  /**
   * Enhanced query with tracing and performance metrics
   */
  static async queryWithTracing(
    indexName: string,
    queryVector: number[],
    options: {
      topK?: number;
      filter?: Record<string, any>;
      includeVector?: boolean;
      scoreThreshold?: number;
    } = {}
  ) {
    return this.withRetry(async () => {
      const span = this.tracingEnabled ? this.createTracingSpan(AISpanType.GENERIC, {
        indexName,
        topK: options.topK ?? 10,
        hasFilter: !!options.filter,
        operation: 'query'
      }) : null;

      const startTime = Date.now();

      try {
        this.validateQueryInput(queryVector, options);

        log.info('Starting vector query operation', {
          indexName,
          topK: options.topK ?? 10,
          hasFilter: !!options.filter,
          includeVector: options.includeVector ?? false,
          tracingEnabled: this.tracingEnabled
        });

        const result = await qVector.query({
          indexName,
          queryVector,
          topK: options.topK || 10,
          filter: options.filter,
          includeVector: options.includeVector || false
        });

        const duration = Date.now() - startTime;
        const filteredResults = (options.scoreThreshold !== null)
          ? result.filter(r => r.score >= options.scoreThreshold!)
          : result;

        log.info('Vector query completed successfully', {
          indexName,
          resultCount: result.length,
          filteredCount: filteredResults.length,
          duration,
          avgScore: result.length > 0 ? result.reduce((sum, r) => sum + r.score, 0) / result.length : 0
        });

        if (span) {
          span.end({
            output: {
              resultCount: result.length,
              filteredCount: filteredResults.length,
              duration,
              avgScore: result.length > 0 ? result.reduce((sum, r) => sum + r.score, 0) / result.length : 0
            },
            metadata: {
              indexName,
              operation: 'query',
              topK: options.topK ?? 10,
              hasFilter: !!options.filter,
              includeVector: options.includeVector ?? false,
              scoreThreshold: options.scoreThreshold
            }
          });
        }

        return filteredResults;
      } catch (error) {
        const duration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : String(error);

        log.error('Vector query failed', {
          indexName,
          topK: options.topK ?? 10,
          duration,
          error: errorMessage
        });

        if (span) {
          span.error({
            error: error instanceof Error ? error : new Error(errorMessage),
            metadata: {
              indexName,
              operation: 'query',
              topK: options.topK ?? 10,
              duration
            }
          });
        }

        throw this.createVectorStoreError('QUERY_FAILED', errorMessage, {
          indexName,
          topK: options.topK ?? 10,
          duration
        });
      }
    }, 'query', { indexName });
  }

  /**
   * Create a tracing span for vector operations
   */
  private static createTracingSpan(type: AISpanType, initialMetadata: Record<string, any>) {
    // This would integrate with the actual tracing system
    // For now, we'll create a mock span structure
    return {
      end: (result: any) => {
        log.info('Tracing span ended', { type, result });
      },
      error: (error: any) => {
        log.error('Tracing span error', { type, error });
      }
    };
  }

  /**
   * Batch upsert utility for large datasets
   */
  static async batchUpsert(
    indexName: string,
    vectors: number[][],
    metadata: Array<Record<string, any>>,
    batchSize = 100,
    ids?: string[]
  ) {
    const batches = [];
    for (let i = 0; i < vectors.length; i += batchSize) {
      batches.push({
        vectors: vectors.slice(i, i + batchSize),
        metadata: metadata.slice(i, i + batchSize),
        ids: ids?.slice(i, i + batchSize),
      });
    }

    log.info('Starting batch upsert', {
      indexName,
      totalVectors: vectors.length,
      batchSize,
      batchCount: batches.length
    });

    const results = [];
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      log.info(`Processing batch ${i + 1}/${batches.length}`, {
        indexName,
        batchSize: batch.vectors.length
      });

      const result = await this.upsertWithTracing(
        indexName,
        batch.vectors,
        batch.metadata,
        batch.ids
      );
      results.push(result);
    }

    log.info('Batch upsert completed', {
      indexName,
      totalBatches: batches.length,
      totalVectors: vectors.length
    });

    return results;
  }

  /**
   * Health check for vector store
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const indexes = await qVector.listIndexes();
      log.info('Vector store health check passed', { indexCount: indexes.length });
      return true;
    } catch (error) {
      log.error('Vector store health check failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  }

  /**
   * Get index statistics
   */
  static async getIndexStats(indexName: string) {
    try {
      const stats = await qVector.describeIndex({ indexName });
      log.info('Retrieved index statistics', { indexName, stats });
      return stats;
    } catch (error) {
      log.error('Failed to get index statistics', {
        indexName,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}

/**
 * Custom error class for vector store operations
 */
class VectorStoreError extends Error {
  code: string;
  context: Record<string, any>;

  constructor(code: string, message: string, context: Record<string, any> = {}) {
    super(message);
    this.code = code;
    this.context = context;
    this.name = 'VectorStoreError';
  }
}

// Production-grade embedding generation with Gemini
export async function generateEmbeddings(chunks: Array<{ text: string; metadata?: any; id?: string }>) {
  if (!chunks.length) {
    log.warn("No chunks provided for embedding generation");
    return { embeddings: [] };
  }

  const startTime = Date.now();
  log.info("Starting embedding generation with Gemini", {
    chunkCount: chunks.length,
    totalTextLength: chunks.reduce((sum, chunk) => sum + (chunk.text?.length ?? 0), 0),
    model: 'gemini-embedding-001'
  });

  try {
    const { embeddings } = await embedMany({
      values: chunks.map(chunk => chunk.text),
      model: google.textEmbedding('gemini-embedding-001'),
      maxRetries: parseInt(process.env.EMBEDDING_MAX_RETRIES ?? '3'),
      abortSignal: new AbortController().signal,
    });

    const processingTime = Date.now() - startTime;
    log.info("Gemini embeddings generated successfully", {
      embeddingCount: embeddings.length,
      embeddingDimension: embeddings[0]?.length || 0,
      processingTimeMs: processingTime,
      model: 'gemini-embedding-001',
    });

    return { embeddings };

  } catch (error) {
    const processingTime = Date.now() - startTime;
    log.error("Gemini embedding generation failed", {
      error: error instanceof Error ? error.message : 'Unknown error',
      chunkCount: chunks.length,
      processingTimeMs: processingTime,
      model: 'gemini-embedding-001',
    });

    throw error;
  }
}

// Enhanced upsert with automatic embedding generation
export async function upsertWithEmbeddings(
  indexName: string,
  chunks: Array<{ text: string; metadata?: any; id?: string }>,
  options: {
    batchSize?: number;
    generateIds?: boolean;
  } = {}
) {
  const { embeddings } = await generateEmbeddings(chunks);

  // Prepare metadata and IDs
  const metadata = chunks.map((chunk, i) => ({
    ...chunk.metadata,
    text: chunk.text,
    id: chunk.id ?? ((options.generateIds ?? false) ? `chunk-${Date.now()}-${i}` : undefined),
    createdAt: new Date().toISOString(),
    version: "1.0",
  }));

  const ids = (options.generateIds ?? false)
    ? metadata.map(m => m.id!)
    : chunks.map(c => c.id ?? undefined);

  // Use batch upsert for better performance
  return VectorStoreUtils.batchUpsert(
    indexName,
    embeddings,
    metadata,
    options.batchSize ?? 100,
    ids
  );
}

// Database-specific configuration for Qdrant
export const qdrantConfig = {
  // Connection settings
  connection: {
    url: process.env.QDRANT_URL ?? 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY ?? '',
    https: process.env.QDRANT_HTTPS === 'true',
    timeout: parseInt(process.env.QDRANT_TIMEOUT ?? '30000'), // 30 seconds
    retryAttempts: parseInt(process.env.QDRANT_RETRY_ATTEMPTS ?? '3'),
  },

  // Index settings
  index: {
    dimension: 3072,
    metric: 'cosine' as const,
    vectorsConfig: {
      onDisk: true,
    },
    optimizersConfig: {
      defaultSegmentNumber: 2,
      maxSegmentSize: 20000,
      memmapThreshold: 10000,
      indexingThreshold: 10000,
    },
    hnswConfig: {
      m: 16,
      efConstruct: 100,
      fullScanThreshold: 10000,
      maxIndexingThreads: 0,
    },
    quantizationConfig: {
      scalar: {
        type: 'int8' as const,
        quantile: 0.99,
        alwaysRam: false,
      }
    }
  },

  // Query optimization settings
  query: {
    defaultTopK: 10,
    maxTopK: 100,
    scoreThreshold: 0.0,
    enableFiltering: true,
    enableHybridSearch: false,
  },

  // Performance settings
  performance: {
    batchSize: 100,
    maxConcurrentRequests: 10,
    enableCompression: true,
    enableCaching: false,
  }
};

// Export enhanced vector store instance
export { qVector as qdrantVector };

// Basic index for common queries
//await store.createIndex({
//  name: 'idx_threads_resource',
//  table: 'mastra_threads',
//  columns: ['resourceId'],
//  method: 'btree', // '"gin" | "btree" | "hash" | "gist" | "spgist" | "brin" | undefined'
//  unique: true,
//  where: 'resourceId IS NOT NULL',
//  storage: { fillfactor: 90 },
//  concurrent: true,
//  opclass: 'resource_id_ops'
//});

// Composite index with sort order for filtering + sorting
//await store.createIndex({
//  name: 'idx_messages_composite',
//  table: 'mastra_messages',
//  columns: ['thread_id', 'createdAt DESC'],
//  unique: true,
//  method: 'gist',
//  where: 'thread_id IS NOT NULL',
//  storage: { fillfactor: 90 },
//  concurrent: true,
//  opclass: 'timestamp_ops'
//});

//await pgVector.createIndex({
//  indexName: "agentMemoryIndex",
//  dimension: 1536,
//  metric: 'cosine', // or 'euclidean', 'dotproduct'
//  buildIndex: true,
//});

// Store embeddings with rich metadata for better organization and filtering
//await qVector.upsert({
//  indexName: "governed_rag",
//  vectors: embeddings,
//  metadata: chunks.map((chunk, i) => ({
//    // Basic content
//    text: chunk.text,
//    id: chunk.id ?? `chunk-${i}`, // generate fallback id when chunk has no id

//    // Document organization
//    source: chunk.metadata?.source,
//    category: chunk.metadata?.category,

    // Temporal metadata
//    createdAt: new Date().toISOString(),
//    version: "1.0",

    // Custom fields
//    language: chunk.metadata?.language,
//    author: chunk.metadata?.author,
//    confidenceScore: chunk.metadata?.score,
//    sparseVector: chunk.metadata?.sparseVector,
//  })),
//  sparseVectors: chunks.map((chunk) => chunk.metadata?.sparseVector), // Optional sparse vectors
//});

