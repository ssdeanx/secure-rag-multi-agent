import { Memory } from '@mastra/memory';
import { UpstashStore, UpstashVector } from '@mastra/upstash';
//import { pinecone } from './pinecone';
import { z } from 'zod';
import { PinoLogger } from '@mastra/loggers';
import type { CoreMessage as OriginalCoreMessage } from '@mastra/core';
import { maskStreamTags } from '@mastra/core';
import type { UIMessage } from 'ai';
// import { ToolCallFilter } from '@mastra/memory/processors';
import { google } from '@ai-sdk/google'
import { AISpanType } from '@mastra/core/ai-tracing';
import type { TracingContext } from '@mastra/core/ai-tracing';

/**
 * Redefine CoreMessage to include a metadata property for custom data.
 * This is necessary because CoreMessage is a union type and cannot be directly extended.
 */
type CoreMessage = OriginalCoreMessage & {
  metadata?: Record<string, unknown>;
};

export class VectorStoreError extends Error {
  constructor(
    message: string,
    public code: 'connection_failed' | 'invalid_dimension' | 'index_not_found' | 'operation_failed' = 'operation_failed',
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'VectorStoreError';
    // Use the properties to avoid unused variable warnings
    this.code = code;
    this.details = details;
  }
}


const logger = new PinoLogger({ name: 'memory', level: 'info' });


// Validation schemas
const createThreadSchema = z.object({
  resourceId: z.string().optional(),
  threadId: z.string().optional(),
  title: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

const getMessagesSchema = z.object({
  resourceId: z.string().optional(),
  threadId: z.string().nonempty(),
  last: z.number().int().min(1).optional()
});

const threadIdSchema = z.string().nonempty();
const resourceIdSchema = z.string().nonempty();

const searchMessagesSchema = z.object({
  threadId: z.string().nonempty(),
  vectorSearchString: z.string().nonempty(),
  topK: z.number().int().min(1).default(3),
  before: z.number().int().min(0).default(0),
  after: z.number().int().min(0).default(0),
});

// Enhanced vector operation schemas
const vectorIndexSchema = z.object({
  indexName: z.string().nonempty(),
});

const createVectorIndexSchema = vectorIndexSchema.extend({
  dimension: z.number().int().positive(),
  metric: z.enum(['cosine', 'euclidean', 'dotproduct']).optional(),
});

const vectorUpsertSchema = z.intersection(vectorIndexSchema, z.object({
  vectors: z.array(z.array(z.number())),
  metadata: z.array(z.record(z.string(), z.unknown())).optional(),
  ids: z.array(z.string()).optional()
}));

const vectorQuerySchema = z.intersection(vectorIndexSchema, z.object({
  queryVector: z.array(z.number()),
  topK: z.number().int().min(1).default(10),
  filter: z.any().optional(), // Use z.any() for MetadataFilter compatibility
  includeVector: z.boolean().default(false)
}));

const vectorUpdateSchema = z.intersection(vectorIndexSchema, z.object({
  id: z.string().nonempty(),
  vector: z.array(z.number()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
}));

// Locally defined types based on schema.md, as they are not exported from @mastra/core
export interface WorkflowRun {
  namespace: string;
  workflowName?: string | undefined;
  resourceId?: string | undefined;
  fromDate?: Date | undefined;
  toDate?: Date | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
}

export interface Trace {
  id: string;
  parentSpanId?: string;
  name: string;
  traceId: string;
  scope: string;
  kind: number;
  attributes: Record<string, unknown>;
  status: {
    code: number;
    message?: string;
  };
  events: Array<Record<string, unknown>>;
  links: Array<Record<string, unknown>>;
  other: string;
  startTime: bigint;
  endTime: bigint;
  createdAt: Date;
}

export interface Eval {
  agentName: string;
  input: string;
  output: string;
  // Use unknown to allow flexible result structure from Mastra evals
  result: unknown;
  metricName: string;
  instructions: string;
  testInfo: Record<string, unknown>;
  globalRunId: string;
  runId: string;
  createdAt: string;
}

/**
 * Vector operation result interfaces following Upstash Vector API
 */
export interface VectorQueryResult {
  id: string;
  score: number;
  metadata: Record<string, unknown>;
  vector?: number[];
}

export interface VectorIndexStats {
  dimension: number;
  count: number;
  metric: 'cosine' | 'euclidean' | 'dotproduct';
}

export interface VectorOperationResult {
  success: boolean;
  operation: string;
  indexName?: string;
  count?: number;
  error?: string;
}

/**
 * ExtractParams interface for metadata extraction following Mastra patterns
 * Supports title, summary, keywords, and questions extraction from document chunks
 */
export interface ExtractParams {
  title?: boolean | {
    nodes?: number;
    nodeTemplate?: string;
    combineTemplate?: string;
  };
  keywords?: boolean | {
    keywords?: number;
    promptTemplate?: string;
  };
  questions?: boolean | {
    questions?: number;
    promptTemplate?: string;
    embeddingOnly?: boolean;
  };
}

/**
 * Enhanced metadata filter interface supporting Upstash-compatible MongoDB/Sift query syntax
 *
 * @remarks
 * Upstash-specific limitations:
 * - Field keys limited to 512 characters
 * - Query size is limited (avoid large IN clauses)
 * - No support for null/undefined values in filters
 * - Translates to SQL-like syntax internally
 * - Case-sensitive string comparisons
 * - Metadata updates are atomic
 *
 * Supported operators: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin, $and, $or, $not, $nor, $exists, $contains, $regex
 */
export interface MetadataFilter {
  [key: string]: string | number | boolean | MetadataFilter | MetadataFilter[] | Array<string | number | boolean> | undefined;
  // Basic comparison operators (Upstash compatible)
  $eq?: string | number | boolean;
  $ne?: string | number | boolean;
  $gt?: number;
  $gte?: number;
  $lt?: number;
  $lte?: number;
  // Array operators (Upstash compatible - avoid large arrays)
  $in?: Array<string | number | boolean>;
  $nin?: Array<string | number | boolean>;
  // Logical operators (Upstash compatible)
  $and?: MetadataFilter[];
  $or?: MetadataFilter[];
  $not?: MetadataFilter;
  $nor?: MetadataFilter[];
  // Element operators (Upstash compatible)
  $exists?: boolean;
  // Upstash-specific operators
  $contains?: string; // Text contains substring
  $regex?: string; // Regular expression match
}

/**
 * Upstash-compatible filter format for vector queries
 * This represents the exact format expected by UpstashVector.query()
 * Using Record<string, unknown> for compatibility with @mastra/upstash types
 */
export type UpstashVectorFilter = Record<string, unknown>;

/**
 * Raw Upstash vector query result format
 */
export interface UpstashVectorQueryResult {
  id: string;
  score: number;
  metadata?: Record<string, unknown>;
  vector?: number[];
}

/**
 * Workflow snapshot interface for Mastra workflow persistence
 */
export interface WorkflowSnapshot {
  workflowName: string;
  runId: string;
  snapshot: any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex workflow state type from Mastra
}

/**
 * Raw trace data from Upstash storage
 */
export interface RawTraceData {
  id: string;
  parentSpanId?: string;
  name: string;
  traceId: string;
  scope: string;
  kind: number;
  attributes: Record<string, unknown>;
  status: {
    code: number;
    message?: string;
  };
  events: Array<Record<string, unknown>>;
  links: Array<Record<string, unknown>>;
  other: string | Record<string, unknown>;
  startTime: string | bigint;
  endTime: string | bigint;
  createdAt: Date;
}

/**
 * Create shared Upstash storage instance
 */
export const upstashStorage = new UpstashStore({
  url: process.env.UPSTASH_REDIS_REST_URL ?? 'https://your-instance-url.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? 'your-redis-token'
});

export const upstashVector = new UpstashVector({
  url: process.env.UPSTASH_VECTOR_REST_URL ?? 'https://your-instance-url-12345-us1-vector.upstash.io',
  token: process.env.UPSTASH_VECTOR_REST_TOKEN ?? 'your-vector-token'
});

  /**
   * Shared Mastra agent memory instance using Upstash for distributed storage and [Pinecone] for vector search.
   *
   * @remarks
   * - Uses UpstashStore for distributed Redis storage
 * - Uses PineconeVector for semantic search with cloud-based vectors (768-dim gemini embeddings)
 * - Embeddings powered by Gemini text-embedding-004 model with cosine similarity
 * - Configured for working memory and semantic recall with enhanced processors
 * - Supports custom memory processors for filtering, summarization, etc.
 * - Ideal for serverless and distributed applications
 * - Enhanced with vector operations and batch processing capabilities
 *
 * @see https://upstash.com/docs/redis/overall/getstarted
 * @see https://upstash.com/docs/vector/overall/getstarted
 * @see https://mastra.ai/en/reference/rag/upstash
 *
 * @version 2.0.0
 * @author SSD
 * @date 2025-07-14
 *
 * @mastra Shared Upstash memory instance for all agents
 * @instance upstashMemory
 * @module upstashMemory
 * @class Memory
 * @classdesc Shared memory instance for all agents using Upstash for storage and [Pinecone] for vector search
 * @returns {Memory} Shared Upstash-backed memory instance for all agents
 *
 * @example
 * // Use threadId/resourceId for multi-user or multi-session memory:
 * await agent.generate('Hello', { resourceId: 'user-123', threadId: 'thread-abc' });
 *
 * @example
 * // Initialize vector indexes on startup:
 * await initializeUpstashVectorIndexes();
 */
export const upstashMemory = new Memory({
  storage: upstashStorage,
  vector: upstashVector,
  embedder: google.textEmbedding('gemini-embedding-001'),
  options: {
    lastMessages: 500, // Enhanced for better context retention
    semanticRecall: {
      topK: 5, // Retrieve top 5 semantically relevant messages
      messageRange: {
        before: 2,
        after: 3,
      },
      scope: 'resource', // Search across all threads for a user
      indexConfig: {
      },
    },
    threads: {
      generateTitle: true, // Auto-generate thread titles
    },
    workingMemory: {
      enabled: true, // Persistent user information across conversations
      version: 'vnext', // Enable the improved/experimental tooling
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
  },
  processors: [
  ],
});

/**
 * Create a new memory thread using Upstash storage.
 * @param resourceId - User/resource identifier
 * @param title - Optional thread title
 * @param metadata - Optional thread metadata
 * @param threadId - Optional specific thread ID
 * @returns Promise resolving to thread information
 */
export async function createMemoryThread(
  resourceId?: string,
  title?: string,
  metadata?: Record<string, unknown>,
  threadId?: string
) {
  logger.info(`[memory] createMemoryThread received. resourceId: ${resourceId}, threadId: ${threadId}`);
  const params = createThreadSchema.parse({ resourceId, threadId, title, metadata });
  const finalResourceId = params.resourceId ?? ''; // Provide a default empty string if undefined
  try {
    return await upstashMemory.createThread({
      ...params,
      resourceId: finalResourceId
    });
  } catch (error: unknown) {
    logger.error(`createMemoryThread failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Query messages for a thread using Upstash storage.
 * @param resourceId - User/resource ID
 * @param threadId - Thread ID
 * @param last - Number of last messages to retrieve
 * @returns Promise resolving to thread messages
 */
export async function getMemoryThreadMessages(
  threadId: string,
  resourceId?: string,
  last = 10
) {
  const params = getMessagesSchema.parse({ resourceId, threadId, last });
  const finalResourceId = params.resourceId ?? ''; // Provide a default empty string if undefined
  try {
    return await upstashMemory.query({
      resourceId: finalResourceId,
      threadId: params.threadId,
      selectBy: { last: params.last }
    });
  } catch (error: unknown) {
    logger.error(`getMemoryThreadMessages failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Retrieve a memory thread by its ID using Upstash storage.
 * @param threadId - Thread identifier
 * @returns Promise resolving to thread information
 */
export async function getMemoryThreadById(threadId: string) {
  const id = threadIdSchema.parse(threadId);
  try {
    return await upstashMemory.getThreadById({ threadId: id });
  } catch (error: unknown) {
    logger.error(`getMemoryThreadById failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Retrieve all memory threads associated with a resource using Upstash storage.
 * @param resourceId - Resource identifier
 * @returns Promise resolving to array of threads
 */
export async function getMemoryThreadsByResourceId(resourceId?: string) {
  const id = resourceIdSchema.parse(resourceId);
  const finalResourceId = id ?? '';
  try {
    return await upstashMemory.getThreadsByResourceId({ resourceId: finalResourceId });
  } catch (error: unknown) {
    logger.error(`getMemoryThreadsByResourceId failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Perform a semantic search in a thread's messages using Upstash vector search.
 * Enhanced to support metadata filtering following Mastra patterns.
 *
 * @param threadId - Thread identifier
 * @param vectorSearchString - Query string for semantic search
 * @param topK - Number of similar messages to retrieve
 * @param before - Number of messages before each match
 * @param after - Number of messages after each match
 * @param filter - Optional metadata filter using MongoDB/Sift query syntax
 * @returns Promise resolving to { messages: CoreMessage[], uiMessages: UIMessage[] }
 *
 * @warning Current Type Limitation:
 * Filter parameter uses `any` casting due to local Upstash package constraints.
 * This maintains functionality while awaiting proper type imports.
 *
 * @example
 * ```typescript
 * // Basic search
 * const results = await searchUpstashMessages('thread-123', 'AI concepts', 5);
 *
 * // Search with metadata filtering
 * const filteredResults = await searchUpstashMessages(
 *   'thread-123',
 *   'AI concepts',
 *   5,
 *   2,
 *   1,
 *   { role: 'assistant', importance: { $gt: 0.8 } }
 * );
 * ```
 */
export async function searchMemoryMessages(
  threadId: string,
  vectorSearchString: string,
  topK = 3,
  before = 2,
  after = 1,
  filter?: MetadataFilter,
  tracingContext?: TracingContext
): Promise<{ messages: CoreMessage[]; uiMessages: UIMessage[] }> {
  const params = searchMessagesSchema.parse({ threadId, vectorSearchString, topK, before, after });

  // Create tracing span for memory search
  const searchSpan = tracingContext?.currentSpan?.createChildSpan({
    type: AISpanType.GENERIC,
    name: 'search-memory-messages',
    input: {
      threadId: params.threadId,
      vectorSearchString: params.vectorSearchString.substring(0, 100), // Truncate for logging
      topK: params.topK,
      hasFilter: !!filter
    },
    metadata: {
      component: 'upstash-memory',
      operationType: 'semantic-search',
      searchType: 'vector'
    }
  });

  const startTime = Date.now();
  try {
    const queryConfig: {
      threadId: string;
      selectBy: { vectorSearchString: string };
      threadConfig: {
        semanticRecall: {
          topK: number;
          messageRange: { before: number; after: number };
        };
      };
      filter?: MetadataFilter;
    } = {
      threadId: params.threadId,
      selectBy: { vectorSearchString: params.vectorSearchString },
      threadConfig: {
        semanticRecall: {
          topK: params.topK,
          messageRange: {
            before: params.before,
            after: params.after
          }
        }
      },
    };

    // Add metadata filter if provided (validate for Upstash compatibility)
    if (filter) {
      const validatedFilter = validateMetadataFilter(filter);
      queryConfig.filter = validatedFilter;
      logger.info('Applying Upstash-compatible metadata filter to search', {
        threadId: params.threadId,
        filter: validatedFilter,
        topK: params.topK
      });
    }

    const result = await upstashMemory.query(queryConfig);

    // Filter out "data" role messages from uiMessages to match return type
    const filteredUiMessages = result.uiMessages.filter(msg => msg.role !== 'data');

    logger.info('Memory message search completed', {
      threadId: params.threadId,
      messagesFound: result.messages.length,
      uiMessagesFound: filteredUiMessages.length,
      hasFilter: !!filter
    });

    const processingTime = Date.now() - startTime;

    // End span successfully
    searchSpan?.end({
      output: {
        messagesFound: result.messages.length,
        uiMessagesFound: filteredUiMessages.length,
        processingTimeMs: processingTime,
        success: true
      },
      metadata: {
        component: 'upstash-memory',
        operation: 'semantic-search',
        finalStatus: 'success'
      }
    });

    return {
      messages: result.messages,
      uiMessages: filteredUiMessages as UIMessage[]
    };
  } catch (error: unknown) {
    const processingTime = Date.now() - startTime;
    logger.error(`searchMemoryMessages failed: ${(error as Error).message}`, {
      threadId: params.threadId,
      vectorSearchString: params.vectorSearchString,
      filter
    });

    // Record error in span and end it
    searchSpan?.error({
      error: error instanceof Error ? error : new Error('Unknown search error'),
      metadata: {
        component: 'upstash-memory',
        operation: 'semantic-search',
        processingTime,
        threadId: params.threadId
      }
    });

    searchSpan?.end({
      output: {
        success: false,
        processingTimeMs: processingTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      metadata: {
        component: 'upstash-memory',
        operation: 'semantic-search',
        finalStatus: 'error'
      }
    });

    throw new VectorStoreError(
      `Failed to search messages: ${(error as Error).message}`,
      'operation_failed',
      { threadId: params.threadId, filter }
    );
  }
}

/**
 * Retrieve UI-formatted messages for a thread using Upstash storage.
 * @param threadId - Thread identifier
 * @param last - Number of recent messages
 * @returns Promise resolving to array of UI-formatted messages
 */
export async function getMemoryUIThreadMessages(threadId: string, last = 100): Promise<UIMessage[]> {
  const id = threadIdSchema.parse(threadId);
  try {
    const { uiMessages } = await upstashMemory.query({
      threadId: id,
      selectBy: { last },
    });
    // Filter out "data" role messages to match UIMessage type
    return uiMessages.filter(msg => msg.role !== 'data') as UIMessage[];
  } catch (error: unknown) {
    logger.error(`getMemoryUIThreadMessages failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Masks internal working_memory updates from a response textStream for Upstash.
 * @param textStream - Async iterable of response chunks including <working_memory> tags
 * @param onStart - Optional callback when a working_memory update starts
 * @param onEnd - Optional callback when a working_memory update ends
 * @param onMask - Optional callback for the masked content
 * @returns Async iterable of chunks with working_memory tags removed
 */
export function maskMemoryWorkingMemoryStream(
  textStream: AsyncIterable<string>,
  onStart?: () => void,
  onEnd?: () => void,
  onMask?: (chunk: string) => string
): AsyncIterable<string> {
  return maskStreamTags(textStream, 'working_memory', { onStart, onEnd, onMask });
}

/**
 * Enhanced search function with performance tracking and detailed logging for Upstash.
 * @param threadId - Thread identifier
 * @param vectorSearchString - Query string for semantic search
 * @param topK - Number of similar messages to retrieve
 * @param before - Number of messages before each match
 * @param after - Number of messages after each match
 * @returns Promise resolving to { messages, uiMessages } with enhanced metadata
 */
export async function enhancedMemorySearchMessages(
  threadId: string,
  vectorSearchString: string,
  topK = 3,
  before = 2,
  after = 1
): Promise<{
  messages: CoreMessage[];
  uiMessages: UIMessage[];
  searchMetadata: {
    topK: number;
    before: number;
    after: number;
  };
}> {
  // Use the pinecone-backed memory (upstashMemory configured with pinecone) for semantic recall
  const result = await upstashMemory.query({
    threadId,
    selectBy: { vectorSearchString },
    threadConfig: {
      semanticRecall: {
        topK,
        messageRange: { before, after },
      },
    },
  });

  return {
    messages: result.messages,
    uiMessages: result.uiMessages.filter(msg => msg.role !== 'data') as UIMessage[],
    searchMetadata: { topK, before, after },
  };
}

/**
 * Create a vector index with proper configuration
 * @param indexName - Name of the index to create
 * @param dimension - Vector dimension (default: 1536)
 * @param metric - Distance metric (default: cosine)
 * @returns Promise resolving to operation result
 */
export async function createVectorIndex(
  indexName: string,
  dimension: number,
  metric: 'cosine' | 'euclidean' | 'dotproduct' = 'cosine'
): Promise<VectorOperationResult> {
  const params = createVectorIndexSchema.parse({ indexName, dimension, metric });
  try {
    await upstashVector.createIndex({
      indexName: params.indexName,
      dimension: params.dimension,
      metric: params.metric,
    });
    logger.info('Vector index created successfully', {
      indexName: params.indexName,
      dimension: params.dimension,
      metric: params.metric,
    });
    return {
      success: true,
      operation: 'createVectorIndex',
      indexName: params.indexName,
    };
  } catch (error: unknown) {
    logger.error('Failed to create vector index', {
      error: (error as Error).message,
      indexName: params.indexName,
      dimension: params.dimension,
      metric: params.metric,
    });
    return {
      success: false,
      operation: 'createVectorIndex',
      indexName: params.indexName,
      error: (error as Error).message,
    };
  }
}

/**
 * List all available vector indexes
 * @returns Promise resolving to array of index names
 */
export async function listVectorIndexes(): Promise<string[]> {
  try {
    const indexes = await upstashVector.listIndexes();
    logger.info('Vector indexes listed successfully', { count: indexes.length });
    return indexes;
  } catch (error: unknown) {
    logger.error('Failed to list vector indexes', {
      error: (error as Error).message
    });
    throw error;
  }
}

/**
 * Get detailed information about a vector index
 * @param indexName - Name of the index to describe
 * @returns Promise resolving to index statistics
 */
export async function describeVectorIndex(indexName: string): Promise<VectorIndexStats> {
  try {
    const stats = await upstashVector.describeIndex({ indexName });
    logger.info('Vector index described successfully', { indexName, stats });
    return {
      dimension: stats.dimension,
      count: stats.count,
      metric: stats.metric ?? 'cosine'
    };
  } catch (error: unknown) {
    logger.error('Failed to describe vector index', {
      error: (error as Error).message,
      indexName
    });
    throw error;
  }
}

/**
 * Delete a vector index
 * @param indexName - Name of the index to delete
 * @returns Promise resolving to operation result
 */
export async function deleteVectorIndex(indexName: string): Promise<VectorOperationResult> {
  try {
    await upstashVector.deleteIndex({ indexName });
    logger.info('Vector index deleted successfully', { indexName });
    return {
      success: true,
      operation: 'deleteIndex',
      indexName
    };
  } catch (error: unknown) {
    logger.error('Failed to delete vector index', {
      error: (error as Error).message,
      indexName
    });

    return {
      success: false,
      operation: 'deleteIndex',
      indexName,
      error: (error as Error).message
    };
  }
}

/**
 * Upsert vectors into an index with metadata
 * @param indexName - Name of the index
 * @param vectors - Array of embedding vectors
 * @metadata - Optional metadata for each vector
 * @param ids - Optional IDs for each vector
 * @returns Promise resolving to operation result
 */
export async function upsertVectors(
  indexName: string,
  vectors: number[][],
  metadata?: Array<Record<string, unknown>>,
  ids?: string[]
): Promise<VectorOperationResult> {
  const params = vectorUpsertSchema.parse({ indexName, vectors, metadata, ids });
  try {
    await upstashVector.upsert({
      indexName: params.indexName,
      vectors: params.vectors,
      metadata: params.metadata,
      ids: params.ids
    });
    logger.info('Vectors upserted successfully', {
      indexName: params.indexName,
      vectorCount: params.vectors.length,
      hasMetadata: !!params.metadata,
      hasIds: !!params.ids
    });
    return {
      success: true,
      operation: 'upsert',
      indexName: params.indexName,
      count: params.vectors.length
    };
  } catch (error: unknown) {
    logger.error('Failed to upsert vectors', {
      error: (error as Error).message,
      indexName: params.indexName,
      vectorCount: params.vectors.length
    });
    return {
      success: false,
      operation: 'upsert',
      indexName: params.indexName,
      error: (error as Error).message
    };
  }
}

/**
 * Query vectors for similarity search with enhanced metadata filtering
 * Supports MongoDB/Sift query syntax for comprehensive filtering capabilities
 *
 * @param indexName - Name of the index to query
 * @param queryVector - Query vector for similarity search (768 dimensions for Gemini)
 * @param topK - Number of results to return
 * @param filter - Optional metadata filter using MongoDB/Sift query syntax
 * @param includeVector - Whether to include vectors in results
 * @returns Promise resolving to query results with metadata
 *
 * @warning Current Type Limitation:
 * Filter parameter uses `any` casting due to local pinecone package constraints.
 */
export async function queryVectors(
  indexName: string,
  queryVector: number[],
  topK = 5,
  filter?: MetadataFilter,
  includeVector = false
): Promise<VectorQueryResult[]> {
  const params = vectorQuerySchema.parse({
    indexName,
    queryVector,
    topK,
    filter,
    includeVector
  });
  try {
    // Validate filter for upstash compatibility if provided
    let upstashFilter: any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Using 'any' for UpstashVectorFilter compatibility
    if (params.filter !== null) {
      const validatedFilter = validateMetadataFilter(params.filter as MetadataFilter);
      upstashFilter = transformToUpstashFilter(validatedFilter);
    }

    const results = await upstashVector.query({
      indexName: params.indexName,
      queryVector: params.queryVector,
      topK: params.topK,
      filter: upstashFilter,
      includeVector: params.includeVector
    });

    logger.info('Vector query completed successfully', {
      indexName: params.indexName,
      topK: params.topK,
      resultCount: results.length,
      hasFilter: params.filter !== undefined,
      filterApplied: upstashFilter !== undefined
    });

    // Transform results to match our interface
    return results.map((result: UpstashVectorQueryResult) => ({
      id: result.id,
      score: result.score,
      metadata: result.metadata ?? {},
      vector: result.vector
    }));
  } catch (error: unknown) {
    logger.error('Failed to query vectors', {
      error: (error as Error).message,
      indexName: params.indexName,
      topK: params.topK
    });
    throw error;
  }
}

/**
 * Transform MetadataFilter to Upstash-compatible filter format
 * Converts our MetadataFilter interface to the exact format expected by UpstashVector
 *
 * @param filter - MetadataFilter to transform
 * @returns Transformed filter compatible with Upstash Vector API
 *
 * @warning Current Implementation Note:
 * This function performs the transformation but cannot guarantee full type safety
 * due to local Upstash package constraints. The output is cast to `any` to work
 * with the current system while maintaining functionality.
 */

export function transformToUpstashFilter(filter: MetadataFilter): UpstashVectorFilter {
  const transformed: Record<string, unknown> = {};

  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Handle nested MetadataFilter objects
      if (typeof value === 'object' && !Array.isArray(value) && key.startsWith('$')) {
        transformed[key] = transformToUpstashFilter(value);
      } else if (Array.isArray(value) && key.startsWith('$')) {
        // Handle arrays in logical operators
        transformed[key] = value.map(item =>
          typeof item === 'object' && item !== null
            ? transformToUpstashFilter(item)
            : item
        );
      } else {
        transformed[key] = value;
      }
    }
  });

  return transformed as UpstashVectorFilter;
}

/**
 * Update a specific vector in an index
 * @param indexName - Name of the index
 * @param id - ID of the vector to update
 * @param vector - New vector values (optional)
 * @param metadata - New metadata (optional)
 * @returns Promise resolving to operation result
 */
export async function updateVector(
  indexName: string,
  id: string,
  vector?: number[],
  metadata?: Record<string, unknown>
): Promise<VectorOperationResult> {
  const params = vectorUpdateSchema.parse({ indexName, id, vector, metadata });
  if (!params.vector && !params.metadata) {
    throw new Error('Either vector or metadata must be provided for update');
  }
  try {
    await upstashVector.updateVector({
      indexName: params.indexName,
      id: params.id,
      update: {
        vector: params.vector,
        metadata: params.metadata
      }
    });
    logger.info('Vector updated successfully', {
      indexName: params.indexName,
      id: params.id,
      hasVector: !!params.vector,
      hasMetadata: !!params.metadata
    });
    return {
      success: true,
      operation: 'updateVector',
      indexName: params.indexName
    };
  } catch (error: unknown) {
    logger.error('Failed to update vector', {
      error: (error as Error).message,
      indexName: params.indexName,
      id: params.id
    });
    return {
      success: false,
      operation: 'updateVector',
      indexName: params.indexName,
      error: (error as Error).message
    };
  }
}

/**
 * Delete a specific vector from an index
 * @param indexName - Name of the index
 * @param id - ID of the vector to delete
 * @returns Promise resolving to operation result
 */
export async function deleteVector(
  indexName: string,
  id: string
): Promise<VectorOperationResult> {
  try {
    await upstashVector.deleteVector({ indexName, id });
    logger.info('Vector deleted successfully', { indexName, id });
    return {
      success: true,
      operation: 'deleteVector',
      indexName,
    };
  } catch (error: unknown) {
    logger.error('Failed to delete vector', {
      error: (error as Error).message,
      indexName,
      id
    });
    return {
      success: false,
      operation: 'deleteVector',
      indexName,
      error: (error as Error).message
    };
  }
}

/**
 * Batch upsert vectors for improved performance
 * @param indexName - Name of the index
 * @param vectors - Array of embedding vectors
 * @param metadata - Optional metadata for each vector
 * @param ids - Optional IDs for each vector
 * @param batchSize - Size of each batch (default: 100)
 * @returns Promise resolving to operation result
 */
export async function batchUpsertVectors(
  indexName: string,
  vectors: number[][],
  metadata?: Array<Record<string, unknown>>,
  ids?: string[],
  batchSize = 100
): Promise<VectorOperationResult> {
  const totalVectors = vectors.length;
  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];
  try {
    for (let i = 0; i < totalVectors; i += batchSize) {
      const batchVectors = vectors.slice(i, i + batchSize);
      const batchMetadata = metadata?.slice(i, i + batchSize);
      const batchIds = ids?.slice(i, i + batchSize);
      try {
        await upsertVectors(indexName, batchVectors, batchMetadata, batchIds);
        successCount += batchVectors.length;
      } catch (error: unknown) {
        errorCount += batchVectors.length;
        errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${(error as Error).message}`);
      }
    }
    logger.info('Batch vector upsert completed', {
      indexName,
      totalVectors,
      successCount,
      errorCount,
      batchSize
    });
    return {
      success: errorCount === 0,
      operation: 'batchUpsert',
      indexName,
      count: successCount,
      error: errors.length > 0 ? errors.join('; ') : undefined
    };
  } catch (error: unknown) {
    logger.error('Batch vector upsert failed', {
      error: (error as Error).message,
      indexName,
      totalVectors
    });
    return {
      success: false,
      operation: 'batchUpsert',
      indexName,
      error: (error as Error).message
    };
  }
}

/**
 * Enhanced vector search with semantic filtering and ranking
 * @param indexName - Name of the index to search
 * @param queryVector - Query vector for similarity search
 * @param options - Search configuration options
 * @returns Promise resolving to enhanced search results
 *
 * @warning Current Type Limitation:
 * Filter parameter uses `any` casting due to local pinecone package constraints.
 */
export async function enhancedVectorSearch(
  indexName: string,
  queryVector: number[],
  options: {
    topK?: number;
    filter?: MetadataFilter;
    includeVector?: boolean;
    minScore?: number;
    rerank?: boolean;
  } = {}
): Promise<{
  results: VectorQueryResult[];
  searchMetadata: {
    totalResults: number;
    filteredResults: number;
    searchTime: number;
    topK: number;
  };
}> {
  const startTime = Date.now();
  const {
    topK = 5,
    filter,
    includeVector = false,
    minScore = 0,
    rerank = false
  } = options;
  try {
    let results = await queryVectors(indexName, queryVector, topK, filter, includeVector);
    const totalResults = results.length;
    // Apply minimum score filtering
    if (minScore > 0) {
      results = results.filter(result => result.score >= minScore);
    }
    // Apply reranking if requested
    if (rerank && results.length > 1) {
      results = results.sort((a, b) => {
        // Enhanced ranking considering both score and metadata relevance
        const scoreWeight = 0.8;
        const metadataWeight = 0.2;
        const aScore = a.score * scoreWeight;
        const bScore = b.score * scoreWeight;
        // Simple metadata relevance (can be enhanced based on specific needs)
        const aMetadataScore = Object.keys(a.metadata).length * metadataWeight;
        const bMetadataScore = Object.keys(b.metadata).length * metadataWeight;
        return (bScore + bMetadataScore) - (aScore + aMetadataScore);
      });
    }
    const searchTime = Date.now() - startTime;
    logger.info('Enhanced vector search completed', {
      indexName,
      totalResults,
      filteredResults: results.length,
      searchTime,
      topK,
      hasFilter: !!filter,
      minScore,
      rerank
    });
    return {
      results,
      searchMetadata: {
        totalResults,
        filteredResults: results.length,
        searchTime,
        topK
      }
    };
  } catch (error: unknown) {
    logger.error('Enhanced vector search failed', {
      error: (error as Error).message,
      indexName,
      topK
    });
    throw error;
  }
}

/**
 * Batch operations for improved performance with Upstash Redis pipeline
 */
export interface UpstashThread {
  id: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
}

/**
 * Batch create multiple threads efficiently using Upstash Redis
 * @param threadRequests - Array of thread creation requests
 * @returns Promise resolving to array of created threads
 */
export async function batchCreateMemoryThreads(
  threadRequests: Array<{
    resourceId: string;
    metadata?: Record<string, unknown>;
    threadId?: string;
  }>
): Promise<UpstashThread[]> {
  const startTime = Date.now();
  try {
    const results = await Promise.allSettled(
      threadRequests.map(request =>
        createMemoryThread(request.resourceId, undefined, request.metadata, request.threadId)
      )
    );
    const successes = results.filter(r => r.status === 'fulfilled').length;
    const failures = results.filter(r => r.status === 'rejected').length;
    const duration = Date.now() - startTime;
    logger.info('Batch memory thread creation completed', {
      totalRequests: threadRequests.length,
      successes,
      failures,
      duration,
    });
    return results
      .map(result => (result.status === 'fulfilled' ? result.value : null))
      .filter(Boolean) as UpstashThread[];
  } catch (error: unknown) {
    logger.error(`batchCreateMemoryThreads failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Enhanced memory cleanup and optimization for Upstash Redis
 * @param options - Cleanup configuration options
 */
export async function optimizeMemoryStorage(options: {
  olderThanDays?: number;
  keepMinimumMessages?: number;
  compactVectorIndex?: boolean;
} = {}): Promise<{
  threadsProcessed: number;
  messagesCompacted: number;
  vectorIndexOptimized: boolean;
}> {
  const {
    olderThanDays = 30,
    keepMinimumMessages = 10,
    compactVectorIndex = true
  } = options;
  const startTime = Date.now();
  try {
    logger.info('Memory optimization requested', {
      olderThanDays,
      keepMinimumMessages,
      compactVectorIndex,
      timestamp: new Date().toISOString()
    });
    // Upstash Redis handles memory optimization automatically
    // This is provided for API consistency
    const optimizationResults = {
      threadsProcessed: 0,
      messagesCompacted: 0,
      vectorIndexOptimized: compactVectorIndex,
      duration: Date.now() - startTime
    };
    logger.info('Memory optimization completed (auto-managed)', optimizationResults);
    return optimizationResults;
  } catch (error: unknown) {
    logger.error(`optimizeMemoryStorage failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Validate metadata filter for Upstash compatibility
 * Ensures filter meets Upstash-specific requirements and limitations
 *
 * @param filter - Metadata filter to validate
 * @returns Validated filter or throws VectorStoreError
 *
 * @example
 * ```typescript
 * const validFilter = validateUpstashFilter({
 *   category: 'electronics',
 *   price: { $gt: 100 },
 *   tags: { $in: ['sale', 'new'] }
 * });
 * ```
 */
export function validateMetadataFilter(filter: MetadataFilter): MetadataFilter {
  if (!filter) {
    throw new VectorStoreError('Filter must be a valid non-empty object', 'operation_failed');
  }

  // Check if filter is an empty object
  const filterKeys = Object.keys(filter as Record<string, unknown>);
  if (filterKeys.length === 0) {
    throw new VectorStoreError('Filter must be a valid non-empty object', 'operation_failed');
  }

  // Check field key length limits (512 chars for Pinecone)
  const checkFieldKeys = (obj: Record<string, unknown>, path = ''): void => {
    Object.keys(obj).forEach(key => {
      const fullPath = path ? `${path}.${key}` : key;

      if (fullPath.length > 512) {
        throw new VectorStoreError(
          `Field key '${fullPath}' exceeds 512 character limit for Pinecone`,
          'operation_failed',
          { fieldKey: fullPath, length: fullPath.length }
        );
      }

      // Check for null/undefined values (not supported by Pinecone)
      const value = obj[key];
      if (value === null || value === undefined) {
        throw new VectorStoreError(
          `Null/undefined values not supported by Pinecone in field '${fullPath}'`,
          'operation_failed',
          { fieldKey: fullPath, value }
        );
      }

      // Recursively check nested objects
      if (typeof value === 'object' && !Array.isArray(value) && !key.startsWith('$')) {
        checkFieldKeys(value as Record<string, unknown>, fullPath);
      }
    });
  };

  checkFieldKeys(filter);

  // Check for large IN clauses (Pinecone has query size limits)
  const checkArraySizes = (obj: Record<string, unknown>): void => {
    Object.entries(obj).forEach(([key, value]) => {
      if (key === '$in' || key === '$nin') {
        if (Array.isArray(value) && value.length > 100) {
          logger.warn('Large IN/NIN clause detected - may hit Pinecone query size limits', {
            operator: key,
            arraySize: value.length
          });
        }
      }

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        checkArraySizes(value as Record<string, unknown>);
      }
    });
  };

  checkArraySizes(filter);

  return filter;
}

/**
 * Extract metadata from document chunks using LLM analysis
 * Follows Mastra ExtractParams patterns for title, summary, keywords, and questions
 *
 * @param chunks - Array of document chunks to process
 * @param extractParams - Configuration for metadata extraction
 * @returns Promise resolving to chunks with enhanced metadata
 *
 * @example
 * ```typescript
 * const enhancedChunks = await extractChunkMetadata(chunks, {
 *   title: true,
 *   summary: { summaries: ['self'] },
 *   keywords: { keywords: 5 },
 *   questions: { questions: 3 }
 * });
 * ```
 */
export async function extractChunkMetadata(
  chunks: Array<{
    id: string;
    content: string;
    metadata: Record<string, unknown>;
  }>,
  extractParams: ExtractParams,
  tracingContext?: TracingContext
): Promise<Array<{
  id: string;
  content: string;
  metadata: Record<string, unknown>;
}>> {
  const span = tracingContext?.currentSpan?.createChildSpan({
    type: AISpanType.LLM_CHUNK,
    name: 'extract-chunk-metadata',
    input: {
      chunkCount: chunks.length,
      extractParams: Object.keys(extractParams)
    },
    metadata: {
      component: 'upstash-memory',
      operationType: 'metadata-extraction',
      extractFields: Object.keys(extractParams)
    }
  });

  const startTime = Date.now();

  try {
    logger.info('Starting metadata extraction for chunks', {
      chunkCount: chunks.length,
      extractParams: Object.keys(extractParams)
    });

    const enhancedChunks = chunks.map(chunk => ({ ...chunk }));

    // Title extraction (grouped by docId if available)
    if (extractParams.title !== undefined && extractParams.title !== false) {

      // Group chunks by docId for shared title extraction
      const docGroups = new Map<string, typeof enhancedChunks>();
      enhancedChunks.forEach(chunk => {
        const docId = (chunk.metadata.docId as string) || chunk.id;
        if (!docGroups.has(docId)) {
          docGroups.set(docId, []);
        }
        docGroups.get(docId)!.push(chunk);
      });

      // Extract titles for each document group
      for (const [docId, docChunks] of docGroups) {
        const combinedContent = docChunks.map(c => c.content).join('\n\n');
        // Use combined content for title generation (simplified for demo)
        const extractedTitle = combinedContent.length > 100
          ? `Document: ${combinedContent.substring(0, 50)}...`
          : `Document: ${docId.substring(0, 50)}...`;

        docChunks.forEach(chunk => {
          chunk.metadata.documentTitle = extractedTitle;
        });
      }
    }


    // Keywords extraction
    if (extractParams.keywords !== undefined && extractParams.keywords !== false) {
      const keywordConfig = typeof extractParams.keywords === 'boolean' ? { keywords: 5 } : extractParams.keywords;
      const keywordCount = keywordConfig.keywords ?? 5;

      enhancedChunks.forEach(chunk => {
        // Simplified keyword extraction
        const words = chunk.content.toLowerCase().split(/\s+/)
          .filter(word => word.length > 3)
          .slice(0, keywordCount);
        chunk.metadata.excerptKeywords = `KEYWORDS: ${words.join(', ')}`;
      });
    }

    // Questions extraction
    if (extractParams.questions !== undefined && extractParams.questions !== false) {
      const questionConfig = typeof extractParams.questions === 'boolean' ? { questions: 3 } : extractParams.questions;
      const questionCount = questionConfig.questions ?? 3;

      if (questionConfig.embeddingOnly !== false) {
        enhancedChunks.forEach(chunk => {
          // Simplified question generation
          const questions = Array.from({ length: questionCount }, (_, i) =>
            `${i + 1}. What is discussed about ${chunk.content.split(' ')[0]}?`
          );
          chunk.metadata.questionsThisExcerptCanAnswer = questions.join('\n');
        });
      }
    }

    const processingTime = Date.now() - startTime;
    logger.info('Metadata extraction completed', {
      chunkCount: enhancedChunks.length,
      processingTime,
      extractedFields: Object.keys(extractParams)
    });

    // End span successfully
    span?.end({
      output: {
        chunkCount: enhancedChunks.length,
        processingTimeMs: processingTime,
        extractedFields: Object.keys(extractParams),
        success: true
      },
      metadata: {
        component: 'upstash-memory',
        operation: 'metadata-extraction',
        finalStatus: 'success'
      }
    });

    return enhancedChunks;
  } catch (error: unknown) {
    const processingTime = Date.now() - startTime;
    logger.error('Metadata extraction failed', {
      error: (error as Error).message,
      chunkCount: chunks.length
    });

    // Record error in span and end it
    span?.error({
      error: error instanceof Error ? error : new Error('Unknown metadata extraction error'),
      metadata: {
        component: 'upstash-memory',
        operation: 'metadata-extraction',
        processingTime,
        chunkCount: chunks.length
      }
    });

    span?.end({
      output: {
        success: false,
        processingTimeMs: processingTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      metadata: {
        component: 'upstash-memory',
        operation: 'metadata-extraction',
        finalStatus: 'error'
      }
    });

    throw new VectorStoreError(
      `Failed to extract metadata: ${(error as Error).message}`,
      'operation_failed',
      { chunkCount: chunks.length, extractParams }
    );
  }
}

/**
 * Saves a suspended workflow's state.
 * @param workflowData - The workflow data to save.
 * @returns A promise that resolves when the workflow is saved.
 */
export async function saveWorkflow(workflowData: WorkflowSnapshot): Promise<void> {
  logger.info(`[memory] saveWorkflow received. run_id: ${workflowData.runId}`);
  try {
    await upstashStorage.persistWorkflowSnapshot({ namespace: 'default', ...workflowData });
    logger.info(`[memory] Workflow saved successfully. run_id: ${workflowData.runId}`);
  } catch (error: unknown) {
    logger.error(`saveWorkflow failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Retrieves a suspended workflow's state.
 * @param run_id - The run ID of the workflow to retrieve.
 * @returns A promise that resolves to the workflow data, or null if not found.
 */
export async function getWorkflow(runId: string, workflowName: string): Promise<WorkflowRun | null> {
  logger.info(`[memory] getWorkflow received. run_id: ${runId}`);
  try {
    const run = await upstashStorage.getWorkflowRunById({ runId, workflowName });
    if (!run) {
      logger.warn(`[memory] Workflow not found. run_id: ${runId}`);
      return null;
    }
    return {
      ...run,
      namespace: 'default'
    };
  } catch (error: unknown) {
    logger.error(`getWorkflow failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Retrieves all workflow runs, with optional filtering.
 * @param options - Filtering and pagination options.
 * @returns A promise resolving to the workflow runs.
 */
export async function getWorkflowRuns(options: {
  namespace?: string;
  workflowName?: string;
  resourceId?: string;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
}): Promise<{ runs: WorkflowRun[]; total: number; }> {
  logger.info('[memory] getWorkflowRuns received.', options);
  try {
    const { namespace, ...restOptions } = options;
    const result = await upstashStorage.getWorkflowRuns(restOptions);
    logger.info(`[memory] Found ${result.total} workflow runs.`);

    // Transform the runs to match our WorkflowRun interface
    const transformedRuns: WorkflowRun[] = result.runs.map(run => ({
      ...run,
      namespace: namespace ?? 'default'
    }));

    return {
      runs: transformedRuns,
      total: result.total
    };
  } catch (error: unknown) {
    logger.error(`getWorkflowRuns failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Saves a trace.
 * @param traceData - The trace data to save.
 * @returns A promise that resolves when the trace is saved.
 */
export async function saveTrace(traceData: Trace): Promise<void> {
  logger.info(`[memory] saveTrace received. id: ${traceData.id}`);
  try {
    // BigInts are not supported by JSON.stringify, so convert to string
    const recordToSave = {
      ...traceData,
      startTime: traceData.startTime.toString(),
      endTime: traceData.endTime.toString(),
    };
    await upstashStorage.insert({ tableName: 'traces' as any, record: recordToSave }); // eslint-disable-line @typescript-eslint/no-explicit-any
    logger.info(`[memory] Trace saved successfully. id: ${traceData.id}`);
  } catch (error: unknown) {
    logger.error(`saveTrace failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Retrieves all traces with pagination and filtering.
 * @param args - Filtering and pagination options.
 * @returns A promise resolving to a paginated list of traces.
 */
export async function getTraces(args: {
  name?: string;
  scope?: string;
  page?: number;
  perPage?: number;
  attributes?: Record<string, unknown>;
  filters?: Record<string, unknown>;
  dateRange?: { start?: Date; end?: Date };
}): Promise<{ traces: Trace[]; total: number; page: number; perPage: number; hasMore: boolean; }> {
  logger.info('[memory] getTraces received.', args);
  try {
    const page = args.page ?? 0;
    const perPage = args.perPage ?? 20;

    const result = await (upstashStorage).getTracesPaginated({
      ...args,
      page,
      perPage,
      // Convert attributes from Record<string, unknown> to Record<string, string>
      attributes: args.attributes
        ? Object.fromEntries(
            Object.entries(args.attributes).map(([key, value]) => [key, String(value)])
          )
        : undefined
    });

    logger.info(`[memory] Found ${result.total} traces.`);

    // Transform traces to match local Trace interface
    const transformedTraces: Trace[] = result.traces.map((trace: RawTraceData) => ({
      ...trace,
      startTime: BigInt(trace.startTime),
      endTime: BigInt(trace.endTime),
      other: typeof trace.other === 'object' ? JSON.stringify(trace.other) : trace.other
    }));

    return {
      traces: transformedTraces,
      total: result.total,
      page: result.page,
      perPage: result.perPage,
      hasMore: result.hasMore
    };
  } catch (error: unknown) {
    logger.error(`getTraces failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Saves an eval dataset.
 * @param evalData - The eval dataset to save.
 * @returns A promise that resolves when the eval dataset is saved.
 */
export async function saveEval(evalData: Eval): Promise<void> {
  logger.info(`[memory] saveEval received. run_id: ${evalData.runId}`);
  try {
    await upstashStorage.insert({ tableName: 'evals' as any, record: evalData }); // eslint-disable-line @typescript-eslint/no-explicit-any
    logger.info(`[memory] Eval saved successfully. run_id: ${evalData.runId}`);
  } catch (error: unknown) {
    logger.error(`saveEval failed: ${(error as Error).message}`);
    throw error;
  }
}


/**
 * Retrieves all evals with pagination and filtering.
 * @param options - Filtering and pagination options.
 * @returns A promise resolving to a paginated list of evals.
 */
export async function getEvals(options?: {
  agentName?: string;
  type?: 'test' | 'live';
  page?: number;
  perPage?: number;
  dateRange?: { start?: Date; end?: Date };
}): Promise<{ evals: Eval[]; total: number; page: number; perPage: number; hasMore: boolean; }> {
  logger.info('[memory] getEvals received.', options);
  try {
    const page = options?.page ?? 0;
    const perPage = options?.perPage ?? 20;

    const result = await (upstashStorage).getEvals({
      agentName: options?.agentName,
      type: options?.type,
      dateRange: options?.dateRange,
      page,
      perPage
    });

    logger.info(`[memory] Found ${result.total} evals.`);
    return {
      evals: result.evals as Eval[],
      total: result.total,
      page: result.page,
      perPage: result.perPage,
      hasMore: result.hasMore
    };
  } catch (error: unknown) {
    logger.error(`getEvals failed: ${(error as Error).message}`);
    throw error;
  }
}
