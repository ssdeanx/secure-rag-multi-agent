import { log, logProgress } from '../config/logger';
import { qdrantVector } from '../config/vector-store';

const MAX_MAX_RETRIES = 3;
export interface VectorMetadata {
  text: string;
  docId: string;
  chunkIndex: number;
  securityTags: string[]; // Changed to string array for proper Qdrant filtering
  versionId: string;
  timestamp: string;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  [key: string]: unknown;
}

export interface StorageBatch {
  vectors: number[][];
  metadata: VectorMetadata[];
  batchIndex: number;
  totalBatches: number;
}

export interface StorageOptions {
  batchSize?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export interface StorageResult {
  totalVectors: number;
  batchesProcessed: number;
  errors: string[];
  success: boolean;
}

export class VectorStorageService {
  private readonly defaultOptions: Required<StorageOptions>;

  constructor(options: Partial<StorageOptions> = {}) {
    this.defaultOptions = {
      batchSize: 200,
      maxRetries: 3,
      retryDelay: 1000,
      ...options
    };
  }

  /**
   * Store vectors in batches to prevent memory issues and handle failures gracefully
   */

  async storeVectorsBatched(
    chunks: string[],
    embeddings: number[][],
    docId: string,
    securityTags: string[],
    versionId: string,
    timestamp: string,
    vectorStore: unknown,
    indexName: string,
    options: StorageOptions = {
    }
  ): Promise<StorageResult> {
    const opts = { ...this.defaultOptions, ...options };
    const { batchSize } = opts;

    if (chunks.length !== embeddings.length) {
      throw new Error(`Chunks and embeddings length mismatch: ${chunks.length} vs ${embeddings.length}`);
    }

    log.info(`Storing ${embeddings.length} vectors in batches of ${batchSize}`);

    // Create metadata for all vectors
    const metadata = this.createMetadata(chunks, docId, securityTags, versionId, timestamp);

    // Create batches
    const batches = this.createStorageBatches(embeddings, metadata, batchSize);

    const errors: string[] = [];
    let successfulBatches = 0;

    for (let i = 0; i < batches.length; i++) {
      logProgress(`Processing batch ${i + 1}`, i + 1, batches.length);

      try {
        await this.storeSingleBatch(batches[i], vectorStore, indexName, opts);
        successfulBatches++;
        log.info(`Successfully stored batch ${i + 1} of ${batches.length}`);
        // Small delay between batches to prevent overwhelming the vector store
        if (i < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

      } catch (error) {
        const errorMsg = `Failed to store batch ${i + 1}: ${error instanceof Error ? error.message : String(error)}`;
        log.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    const totalVectors = successfulBatches * batchSize +
      (batches.length > successfulBatches ? batches[batches.length - 1].vectors.length : 0);

    return {
      totalVectors,
      batchesProcessed: successfulBatches,
      errors,
      success: errors.length === 0
    };
  }

  /**
   * Store all vectors at once (for smaller documents)
   */

  async storeVectorsAll(
    chunks: string[],
    embeddings: number[][],
    docId: string,
    securityTags: string[],
    versionId: string,
    timestamp: string,
    vectorStore: unknown
  ): Promise<StorageResult> {
    log.info(`Storing ${embeddings.length} vectors as single batch`);

    try {
      //FIXME
      const ids = chunks.map((_: unknown, i: number) => this.generateVectorId(docId, i));
      const metadata = this.createMetadata(chunks, docId, securityTags, versionId, timestamp);

      log.info(`Upserting ${embeddings.length} vectors for ${docId}`);

      // Store vectors in vector database
      // FIXME
      const result = await qdrantVector.upsert({
        indexName: process.env.QDRANT_COLLECTION ?? 'governed_rag',
        vectors: embeddings,
        metadata
      });

      log.info(`Successfully stored ${embeddings.length} chunks for document ${docId} to ${result}`);

      return {
        success: true,
        totalVectors: embeddings.length,
        batchesProcessed: 1,
        errors: []
      };

    } catch (error) {
      const errorMsg = `Failed to store vectors: ${error instanceof Error ? error.message : String(error)}`;
      log.error(errorMsg);

      return {
        totalVectors: 0,
        batchesProcessed: 0,
        errors: [errorMsg],
        success: false
      };
    }
  }

  /**
   * Main storage method - automatically selects best strategy based on size
   */

  async storeVectors(
    chunks: string[],
    embeddings: number[][],
    docId: string,
    securityTags: string[],
    versionId: string,
    timestamp: string,
    vectorStore: unknown,
    indexName: string,
    options: StorageOptions = {}
  ): Promise<StorageResult> {
    // For smaller documents, store all at once
    // For larger documents, use batching
    if (embeddings.length <= 500) {
      return this.storeVectorsAll(chunks, embeddings, docId, securityTags, versionId, timestamp, vectorStore);
    } else {
      return this.storeVectorsBatched(chunks, embeddings, docId, securityTags, versionId, timestamp, vectorStore, indexName, options);
    }
  }

  /**
   * Store a single batch with retry logic
   */

  private async storeSingleBatch(
    batch: StorageBatch,
    vectorStore: unknown,
    indexName: string,
    options: StorageOptions = {}
  ): Promise<void> {
    log.info(`Processing batch ${batch.batchIndex}: ${batch.vectors.length} vectors`);
    const { maxRetries, retryDelay } = { ...this.defaultOptions, ...options };
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Store batch with proper format
        await (vectorStore as any).upsert({
          indexName,
          vectors: batch.vectors,
          metadata: batch.metadata
        });
        return; // Success

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < maxRetries) {
          log.warn(`Batch ${batch.batchIndex} attempt ${attempt} failed, retrying in ${retryDelay}ms: ${lastError.message}`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    throw lastError ?? new Error('Unknown error during batch storage');
  }

  /**
   * Generate deterministic ID for a vector based on docId and chunk index
   */

  private generateVectorId(docId: string, chunkIndex: number): string {
    return `${docId}_chunk_${chunkIndex}`;
  }

  /**
   * Delete all existing vectors for a specific document
   * Note: Mastra QdrantVector doesn't support individual vector deletion,
   * so we skip this step. Upsert will naturally overwrite existing vectors.
   */

  async deleteVectorsByDocId(
    docId: string,
    vectorStore: unknown,
    indexName: string
  ): Promise<{ deleted: number; success: boolean; error?: string }> {
    // Mastra QdrantVector doesn't support vector deletion by ID
    // Upsert will handle overwriting existing vectors with same metadata
    log.info(`🗑️ Skipping vector deletion for ${docId} (not supported by Mastra QdrantVector)`);
    return { deleted: 0, success: true };
  }

  /**
   * Create metadata objects for all chunks
   */

  private createMetadata(
    chunks: string[],
    docId: string,
    securityTags: string[],
    versionId: string,
    timestamp: string
  ): VectorMetadata[] {
    return chunks.map((chunk: string, i: number) => ({
      text: chunk,
      docId,
      chunkIndex: i,
      securityTags, // Store as array for proper Qdrant filtering
      versionId,
      timestamp
    }));
  }

  /**
   * Create storage batches from vectors and metadata
   */

  private createStorageBatches(
    vectors: number[][],
    metadata: VectorMetadata[],
    batchSize: number
  ): StorageBatch[] {
    const batches: StorageBatch[] = [];
    const totalBatches = Math.ceil(vectors.length / batchSize);

    for (let i = 0; i < vectors.length; i += batchSize) {
      const batchVectors = vectors.slice(i, i + batchSize);
      const batchMetadata = metadata.slice(i, i + batchSize);

      batches.push({
        vectors: batchVectors,
        metadata: batchMetadata,
        batchIndex: Math.floor(i / batchSize) + 1,
        totalBatches
      });
    }

    return batches;
  }

  /**
   * Validate storage inputs
   */

  validateStorageInputs(
    chunks: string[],
    embeddings: number[][],
    docId: string,
    securityTags: string[],
    versionId: string,
    timestamp: string
  ): void {
    if (!chunks || chunks.length === 0) {
      throw new Error('Chunks array cannot be empty');
    }

    if (!embeddings || embeddings.length === 0) {
      throw new Error('Embeddings array cannot be empty');
    }

    if (chunks.length !== embeddings.length) {
      throw new Error(`Chunks and embeddings length mismatch: ${chunks.length} vs ${embeddings.length}`);
    }

    if (!docId || docId.trim().length === 0) {
      throw new Error('Document ID cannot be empty');
    }

    if (!versionId || versionId.trim().length === 0) {
      throw new Error('Version ID cannot be empty');
    }

    if (!timestamp || timestamp.trim().length === 0) {
      throw new Error('Timestamp cannot be empty');
    }

    if (!securityTags || securityTags.length === 0) {
      throw new Error('Security tags cannot be empty');
    }
  }

  /**
   * Estimate storage operation complexity
   */

  estimateStorageComplexity(vectorCount: number, batchSize: number = this.defaultOptions.batchSize): {
    batches: number;
    estimatedTimeMinutes: number;
    recommendation: string;
  } {
    const batches = Math.ceil(vectorCount / batchSize);

    // Rough estimate: ~1-2 seconds per batch including delays
    const estimatedTimeMinutes: number = (batches * 1.5) / 60;

    let recommendation = "Use default settings";
    if (batches > 50) {
      recommendation = "Consider increasing batch size to 200-500 for better performance";
    } else if (batches > 100) {
      recommendation = "Use larger batch sizes (500+) and consider parallel processing";
    }

    return {
      batches,
      estimatedTimeMinutes: Math.ceil(estimatedTimeMinutes * 10) / 10, // Round to 1 decimal
      recommendation
    };
  }
}
