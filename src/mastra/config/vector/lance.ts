import { LanceVectorStore, LanceStorage } from "@mastra/lance";
import { createVectorQueryTool, createGraphRAGTool } from "@mastra/rag";
import { google } from '@ai-sdk/google';
import { embedMany } from 'ai';
import { log } from '../logger';
import { Memory } from '@mastra/memory';
import { TokenLimiter } from '@mastra/memory/processors';
import { maskStreamTags } from '@mastra/core';

/**
 * LanceDB Vector configuration for the Governed RAG system
 * Uses LanceDB for vector storage and similarity search
 */

// Configuration constants
const LANCE_CONFIG = {
  dbPath: process.env.LANCE_DB_PATH ?? '/tmp/lance_db',
  tableName: process.env.LANCE_TABLE_NAME ?? 'governed_rag',
  // Google Gemini gemini-embedding-001 supports flexible dimensions: 128-3072
  // Recommended: 768, 1536, 3072
  embeddingDimension: parseInt(process.env.LANCE_EMBEDDING_DIMENSION ?? "1536"),
  embeddingModel: google.textEmbedding("gemini-embedding-001"),
} as const;

/**
 * Initialize LanceDB Vector store with proper configuration
 */
let lanceStore: LanceVectorStore;

/**
 * Initialize the LanceDB store
 */
export async function initializeLanceStore(): Promise<void> {
  lanceStore ??= await LanceVectorStore.create(LANCE_CONFIG.dbPath);
}

/**
 * LanceDB-compatible filter format for vector queries
 * Supports Sift query syntax for metadata filtering
 *
 * LanceDB-specific features:
 * - Supports advanced filtering with nested conditions
 * - Payload (metadata) fields must be explicitly indexed for filtering
 * - Efficient handling of geo-spatial queries
 * - Special handling for null and empty values
 * - Vector-specific filtering capabilities
 * - Datetime values must be in RFC 3339 format
 */
export interface LanceMetadataFilter {
  [key: string]: string | number | boolean | LanceMetadataFilter | LanceMetadataFilter[] | Array<string | number | boolean> | undefined;
}

/**
 * Raw LanceDB filter format expected by the library
 * Using Record<string, unknown> for compatibility with @mastra/lance types
 */
export type LanceRawFilter = Record<string, unknown>;

/**
 * Create and configure the vector index
 */
export async function initializeVectorIndex(): Promise<void> {
  try {
    await initializeLanceStore();

    await lanceStore.createIndex({
      tableName: LANCE_CONFIG.tableName,
      indexName: LANCE_CONFIG.tableName,
      dimension: LANCE_CONFIG.embeddingDimension,
      metric: "cosine", // LanceDB supports cosine, euclidean, and dotproduct
    });

    log.info("Vector index created", {
      tableName: LANCE_CONFIG.tableName,
      dimension: LANCE_CONFIG.embeddingDimension
    });
  } catch (error: unknown) {
    // Index might already exist, which is fine
    const errorObj = error as { message?: string };
    const isAlreadyExists = errorObj.message?.includes('already exists') ?? false;
    if (isAlreadyExists) {
      log.info("Vector index already exists", { tableName: LANCE_CONFIG.tableName });
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
      model: LANCE_CONFIG.embeddingModel,
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
    await initializeLanceStore();

    // Prepare metadata for each chunk
    const metadata = chunks.map((chunk, index) => ({
      ...baseMetadata,
      text: chunk.text,
      chunkIndex: index,
      createdAt: new Date(),
      ...chunk.metadata,
    }));

    // Upsert vectors with metadata
    const ids = await lanceStore.upsert({
      tableName: LANCE_CONFIG.tableName,
      indexName: LANCE_CONFIG.tableName,
      vectors: embeddings,
      metadata,
    });

    log.info("Document embeddings stored", {
      tableName: LANCE_CONFIG.tableName,
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
    filter?: LanceMetadataFilter;
    includeVector?: boolean;
  } = {}
): Promise<Array<{
  id: string;
  score: number;
  metadata: Record<string, unknown>;
  vector?: number[];
}>> {
  try {
    await initializeLanceStore();

    // Generate embedding for the query
    const { embeddings: [queryEmbedding] } = await embedMany({
      values: [queryText],
      model: LANCE_CONFIG.embeddingModel,
    });

    // Query the vector store
    const results = await lanceStore.query({
      tableName: LANCE_CONFIG.tableName,
      indexName: LANCE_CONFIG.tableName,
      queryVector: queryEmbedding,
      topK: options.topK ?? 10,
      filter: options.filter,
      includeVector: options.includeVector ?? false,
    });

    log.info("Vector query completed", {
      tableName: LANCE_CONFIG.tableName,
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
    // LanceDB doesn't have a disconnect method, but we can clean up the reference
    lanceStore = undefined!;
    log.info("LanceDB Vector store disconnected");
  } catch (error) {
    log.error("Failed to disconnect vector store", { error: String(error) });
    throw error;
  }
}

// Graph-based RAG tool using LanceDB
export const lanceGraphTool = createGraphRAGTool({
  id: 'lance-graph-rag',
  description:
    'Graph-based retrieval augmented generation using LanceDB for advanced semantic search and context retrieval.',
  // Supported vector store and index options
  vectorStoreName: 'lanceStore',
  indexName: LANCE_CONFIG.tableName,
  model: LANCE_CONFIG.embeddingModel,
  // Supported graph options for LanceDB
  graphOptions: {
    dimension: LANCE_CONFIG.embeddingDimension,
    threshold: parseFloat(process.env.LANCE_GRAPH_THRESHOLD ?? '0.7'),
    randomWalkSteps: parseInt(process.env.LANCE_GRAPH_RANDOM_WALK_STEPS ?? '10'),
    restartProb: parseFloat(process.env.LANCE_GRAPH_RESTART_PROB ?? '0.15'),
  },
  includeSources: true,
  // Filtering and ranking
  enableFilter: true,
});

// LanceDB query tool for semantic search
export const lanceQueryTool = createVectorQueryTool({
  id: 'lance-vector-query',
  description:
    'LanceDB similarity search for semantic content retrieval and question answering.',
  // Supported vector store and index options
  vectorStoreName: 'lanceStore',
  indexName: LANCE_CONFIG.tableName,
  model: LANCE_CONFIG.embeddingModel,
  // Supported database configuration for LanceDB
  databaseConfig: {
    lanceDb: {
      minScore: parseFloat(process.env.LANCE_MIN_SCORE ?? '0.7'),
      // LanceDB specific parameters
      maxResults: parseInt(process.env.LANCE_MAX_RESULTS ?? '100'),
    },
  },
  includeVectors: true,
  // Advanced filtering
  enableFilter: true,
  includeSources: true,
});

/**
 * Transform LanceDB metadata filter to raw filter format
 * Handles any necessary conversions between our interface and library expectations
 */
export function transformToLanceFilter(filter: LanceMetadataFilter): LanceRawFilter {
  // For LanceDB, the filter format is already compatible
  // This function can be expanded if any transformations are needed
  return filter as LanceRawFilter;
}

/**
 * Validate LanceDB metadata filter according to documented constraints
 */
export function validateLanceFilter(filter: LanceMetadataFilter): LanceMetadataFilter {
  // Basic validation - LanceDB has specific requirements for indexed fields
  if (filter === null || typeof filter !== 'object') {
    throw new Error('Filter must be a valid object');
  }

  return filter;
}

/**
 * LanceDB Storage configuration for the Governed RAG system
 * Uses LanceDB for both vector operations and persistent storage
 */

// LanceDB Storage configuration constants
const LANCE_STORAGE_CONFIG = {
  // Storage database configuration
  storageName: process.env.LANCE_STORAGE_NAME ?? 'governed-rag-storage',
  dbUri: process.env.LANCE_DB_URI ?? '/tmp/lance_storage_db',
  // Storage options
  storageOptions: {
    timeout: process.env.LANCE_STORAGE_TIMEOUT ?? '60s',
  },
  // Table prefix for environment isolation
  tablePrefix: process.env.LANCE_STORAGE_TABLE_PREFIX ?? 'dev_',
} as const;

/**
 * Initialize LanceDB storage with proper configuration
 */
let lanceStorage: LanceStorage | null = null;

export async function initializeLanceStorage(): Promise<void> {
  try {
    // Initialize LanceDB storage
    lanceStorage = await LanceStorage.create(
      LANCE_STORAGE_CONFIG.storageName,
      LANCE_STORAGE_CONFIG.dbUri,
      {
        storageOptions: LANCE_STORAGE_CONFIG.storageOptions,
      }
    );

    log.info('LanceDB storage initialized successfully', {
      storageName: LANCE_STORAGE_CONFIG.storageName,
      dbUri: LANCE_STORAGE_CONFIG.dbUri,
      tablePrefix: LANCE_STORAGE_CONFIG.tablePrefix
    });
  } catch (error) {
    log.error('Failed to initialize LanceDB storage', { error: String(error) });
    throw error;
  }
}

/**
 * Get or initialize the LanceDB storage instance
 */
export async function getLanceStorage(): Promise<LanceStorage> {
  if (lanceStorage === null) {
    await initializeLanceStorage();
  }
  return lanceStorage!;
}

/**
 * LanceDB Memory instance configured with comprehensive settings
 * Note: Ensure initializeLanceStorage() and initializeLanceStore() are called before using
 */
export const lanceMemory = new Memory({
  storage: lanceStorage!,
  vector: lanceStore!,
  embedder: google.textEmbedding('gemini-embedding-001'),
  options: {
    // Message management
    lastMessages: parseInt(process.env.LANCE_MEMORY_LAST_MESSAGES ?? '500'),
    // Advanced semantic recall with LanceDB configuration
    semanticRecall: {
      topK: parseInt(process.env.LANCE_SEMANTIC_TOP_K ?? '5'),
      messageRange: {
        before: parseInt(process.env.LANCE_SEMANTIC_RANGE_BEFORE ?? '3'),
        after: parseInt(process.env.LANCE_SEMANTIC_RANGE_AFTER ?? '2'),
      },
      scope: 'resource', // 'resource' | 'thread'
      // LanceDB-specific index configuration
      indexConfig: {}
    },
    // Enhanced working memory with supported template
    workingMemory: {
      enabled: true,
      scope: 'resource', // 'resource' | 'thread'
      version: 'vnext', // Enable the improved/experimental tool
      template: `# User Profile & Context
      ## Personal Information
      - **Name**: [To be learned]
      - **Role/Title**: [To be learned]
      - **Organization**: [To be learned]
      - **Location**: [To be learned]
      - **Time Zone**: [To be learned]

      ## Communication Preferences
      - **Preferred Communication Style**: [To be learned]
      - **Response Length Preference**: [To be learned]
      - **Technical Level**: [To be learned]

      ## Current Context
      - **Active Projects**: [To be learned]
      - **Current Goals**: [To be learned]
      - **Recent Activities**: [To be learned]
      - **Pain Points**: [To be learned]

      ## Long-term Memory
      - **Key Achievements**: [To be learned]
      - **Important Relationships**: [To be learned]
      - **Recurring Patterns**: [To be learned]
      - **Preferences & Habits**: [To be learned]

      ## Session Notes
      - **Today's Focus**: [To be learned]
      - **Outstanding Questions**: [To be learned]
      - **Action Items**: [To be learned]
      - **Follow-ups Needed**: [To be learned]
      `,
    },
    // Thread management with supported options
    threads: {
      generateTitle: process.env.LANCE_THREAD_GENERATE_TITLE !== 'false',
    },
  },
  processors: [new TokenLimiter(1048576)],
});

log.info('LanceDB Memory configured with comprehensive settings', {
  storageName: LANCE_STORAGE_CONFIG.storageName,
  dbUri: LANCE_STORAGE_CONFIG.dbUri,
  memoryOptions: {
    lastMessages: parseInt(process.env.LANCE_MEMORY_LAST_MESSAGES ?? '500'),
    semanticRecall: {
      topK: parseInt(process.env.LANCE_SEMANTIC_TOP_K ?? '5'),
    },
    workingMemory: {
      enabled: true,
      version: 'vnext',
    },
  },
});

/**
 * Utility function to create a masked stream for sensitive data
 * This properly uses maskStreamTags to mask content between XML tags in streams
 */
export function createMaskedStream(
  inputStream: AsyncIterable<string>,
  sensitiveTags: string[] = ['password', 'secret', 'token', 'key']
): AsyncIterable<string> {
  // Chain multiple maskStreamTags calls for different sensitive tags
  let maskedStream = inputStream;
  for (const tag of sensitiveTags) {
    maskedStream = maskStreamTags(maskedStream, tag);
  }
  return maskedStream;
}

/**
 * Utility function to mask sensitive data in message content for logging
 */
export function maskSensitiveMessageData(
  content: string,
  sensitiveFields: string[] = ['password', 'secret', 'token', 'key', 'apiKey']
): string {
  let maskedContent = content;

  // Mask sensitive fields in JSON-like structures
  for (const field of sensitiveFields) {
    // Match field:"value" or field: "value" or "field": "value" patterns
    const regex = new RegExp(`("${field}"\\s*:\\s*)"[^"]*"`, 'gi');
    maskedContent = maskedContent.replace(regex, `$1"[MASKED]"`);
  }

  return maskedContent;
}

/**
 * Generate embeddings for text content using LanceDB configuration
 */
export async function generateEmbeddings(
  texts: string[],
  options: {
    model?: string;
    dimensions?: number;
  } = {}
): Promise<number[][]> {
  try {
    const model = options.model ?? LANCE_CONFIG.embeddingModel;
    const { embeddings } = await embedMany({
      values: texts,
      model,
    });

    log.info('Embeddings generated successfully', {
      textCount: texts.length,
      embeddingDimension: embeddings[0]?.length,
      model: options.model ?? 'gemini-embedding-001'
    });

    return embeddings;
  } catch (error) {
    log.error('Failed to generate embeddings', { error: String(error) });
    throw error;
  }
}

/**
 * Check LanceDB database health and connectivity
 */
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  details: Record<string, unknown>;
  timestamp: string;
}> {
  try {
    await initializeLanceStore();

    // Basic connectivity check - try to access the store
    const isConnected = lanceStore !== null;

    // Check if we can perform basic operations
    let canQuery = false;
    try {
      // Try a simple query to test functionality
      await lanceStore.query({
        tableName: LANCE_CONFIG.tableName,
        indexName: LANCE_CONFIG.tableName,
        queryVector: new Array(LANCE_CONFIG.embeddingDimension).fill(0),
        topK: 1,
      });
      canQuery = true;
    } catch (queryError) {
      // Table might not exist yet, which is fine
      if (String(queryError).includes('not found') || String(queryError).includes('does not exist')) {
        canQuery = true; // Expected for new databases
      }
    }

    const healthStatus = isConnected && canQuery ? 'healthy' : 'unhealthy';

    const details = {
      dbPath: LANCE_CONFIG.dbPath,
      tableName: LANCE_CONFIG.tableName,
      embeddingDimension: LANCE_CONFIG.embeddingDimension,
      isConnected,
      canQuery,
      storageInitialized: lanceStorage !== null,
    };

    log.info('LanceDB health check completed', {
      status: healthStatus,
      ...details
    });

    return {
      status: healthStatus,
      details,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    log.error('LanceDB health check failed', { error: String(error) });
    return {
      status: 'unhealthy',
      details: { error: String(error) },
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Initialize LanceDB database schema and tables
 */
export async function initializeDatabase(): Promise<void> {
  try {
    log.info('Initializing LanceDB database', {
      dbPath: LANCE_CONFIG.dbPath,
      tableName: LANCE_CONFIG.tableName
    });

    // Initialize both vector and storage
    await initializeLanceStore();
    await initializeLanceStorage();

    // Create vector index if it doesn't exist
    await initializeVectorIndex();

    log.info('LanceDB database initialized successfully');
  } catch (error) {
    log.error('Failed to initialize LanceDB database', { error: String(error) });
    throw error;
  }
}

/**
 * Shutdown LanceDB database connections
 */
export async function shutdownDatabase(): Promise<void> {
  try {
    log.info('Shutting down LanceDB database connections');

    // Disconnect vector store
    await disconnectVectorStore();

    // Clear storage reference
    lanceStorage = null;

    log.info('LanceDB database connections shut down successfully');
  } catch (error) {
    log.error('Failed to shutdown LanceDB database', { error: String(error) });
    throw error;
  }
}

/**
 * Format storage messages for LanceDB-specific requirements
 */
export function formatStorageMessages(
  messages: Array<{
    id: string;
    content: string;
    role: string;
    createdAt?: Date;
    metadata?: Record<string, unknown>;
  }>
): Array<{
  id: string;
  content: string;
  role: string;
  createdAt: Date;
  metadata: Record<string, unknown>;
}> {
  return messages.map(message => ({
    id: message.id,
    content: maskSensitiveMessageData(message.content),
    role: message.role,
    createdAt: message.createdAt ?? new Date(),
    metadata: message.metadata ?? {},
  }));
}

/**
 * Perform storage operations with LanceDB-specific error handling and tracing
 */
export async function performStorageOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  metadata: Record<string, unknown> = {}
): Promise<T> {
  const startTime = Date.now();

  try {
    log.info(`Starting LanceDB storage operation: ${operationName}`, metadata);

    const result = await operation();

    const duration = Date.now() - startTime;
    log.info(`LanceDB storage operation completed: ${operationName}`, {
      ...metadata,
      duration,
      success: true
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    log.error(`LanceDB storage operation failed: ${operationName}`, {
      ...metadata,
      duration,
      error: String(error),
      success: false
    });
    throw error;
  }
}

// Export configuration for external use
export { LANCE_CONFIG, LANCE_STORAGE_CONFIG };
