// Re-export pgVector and utilities from pg-storage.ts
import { pgVector, generateEmbeddings as pgGenerateEmbeddings } from './pg-storage';
import { log } from "./logger";
import { AISpanType } from '@mastra/core/ai-tracing';

// Use PgVector instead of Qdrant
const vectorStore = pgVector;

/**
 * Initialize the PgVector store index with production settings.
 * Call this during application bootstrap.
 */
export async function initVectorStore() {
  try {
    await vectorStore.createIndex({
      indexName: 'governed_rag',
      dimension: 1568, // Gemini embedding dimension
      metric: 'cosine',
    });
    log.info('PgVector index initialized successfully', { indexName: 'governed_rag', dimension: 1568 });
  } catch (error) {
    log.error('Failed to initialize PgVector store index', {
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
    if (dimension !== 1568) {
      log.warn('Vector dimension does not match expected dimension', {
        expected: 1568,
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

    if (queryVector.length !== 1568) {
      log.warn('Query vector dimension does not match expected dimension', {
        expected: 1568,
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

        const result = await vectorStore.upsert({
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

        const result = await vectorStore.query({
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
      const indexes = await vectorStore.listIndexes();
      log.info('PgVector store health check passed', { indexCount: indexes.length });
      return true;
    } catch (error) {
      log.error('PgVector store health check failed', {
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
      const stats = await vectorStore.describeIndex({ indexName });
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

// Re-export generateEmbeddings from pg-storage.ts
export const generateEmbeddings = pgGenerateEmbeddings;

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

// Database-specific configuration for PgVector
export const pgVectorConfig = {
  // Connection settings inherited from pg-storage.ts
  connection: {
    connectionString: process.env.SUPABASE ?? process.env.DATABASE_URL,
    schemaName: process.env.DB_SCHEMA ?? 'public',
  },

  // Index settings
  index: {
    dimension: 1568, // Gemini embedding dimension
    metric: 'cosine' as const,
  },

  // Query optimization settings
  query: {
    defaultTopK: 10,
    maxTopK: 100,
    scoreThreshold: 0.0,
    enableFiltering: true,
    minScore: parseFloat(process.env.PG_MIN_SCORE ?? '0.7'),
    ef: parseInt(process.env.PG_EF ?? '200'),
    probes: parseInt(process.env.PG_PROBES ?? '10'),
  },

  // Performance settings
  performance: {
    batchSize: 100,
    maxConcurrentRequests: 10,
  }
};

// Export PgVector instance (backward compatible naming)
export { vectorStore as qdrantVector, pgVector };

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
