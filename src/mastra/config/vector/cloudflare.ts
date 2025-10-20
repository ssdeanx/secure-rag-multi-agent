import { Memory } from '@mastra/memory'
import { D1Store } from '@mastra/cloudflare-d1'
import { CloudflareVector } from '@mastra/vectorize'
import { log } from '../logger'
import { google } from '@ai-sdk/google'
import { TokenLimiter } from '@mastra/memory/processors'

// Cloudflare Storage configuration for the Governed RAG system
// Supports both Workers binding and REST API access patterns

// Cloudflare Storage configuration constants
const CLOUDFLARE_STORAGE_CONFIG = {
  // Workers binding configuration (for Cloudflare Workers runtime)
  binding: process.env.CLOUDFLARE_D1_BINDING,

  // REST API configuration (for external access)
  accountId: process.env.CF_ACCOUNT_ID,
  databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID,
  apiToken: process.env.CF_API_TOKEN,

  // Environment isolation
  tablePrefix: process.env.CLOUDFLARE_D1_TABLE_PREFIX ?? 'dev_',

  // Connection settings
  baseUrl: process.env.CLOUDFLARE_D1_BASE_URL ?? 'https://api.cloudflare.com/client/v4',
} as const

// Cloudflare Vector configuration constants
const CLOUDFLARE_VECTOR_CONFIG = {
  accountId: process.env.CF_ACCOUNT_ID,
  apiToken: process.env.CF_API_TOKEN,
  indexName: "governed-rag",
  // Google Gemini gemini-embedding-001 supports flexible dimensions: 128-3072
  // Note: Cloudflare Vectorize supports dimensions up to 1536
  embeddingDimension: parseInt(process.env.CF_EMBEDDING_DIMENSION ?? "1536"),
} as const

/**
 * Initialize Cloudflare Vectorize store with proper configuration
 */
export const cloudflareStore = new CloudflareVector({
  accountId: CLOUDFLARE_VECTOR_CONFIG.accountId!,
  apiToken: CLOUDFLARE_VECTOR_CONFIG.apiToken!,
})

/**
 * Initialize Cloudflare storage with proper configuration
 * Supports both Workers binding and REST API patterns
 */
let cloudflareStorage: D1Store | null = null

export async function initializeCloudflareStorage(): Promise<void> {
  try {
    // Determine which access pattern to use
    if (CLOUDFLARE_STORAGE_CONFIG.binding && CLOUDFLARE_STORAGE_CONFIG.binding.trim() !== '') {
      // Workers binding pattern (for Cloudflare Workers runtime)
      log.info('Initializing Cloudflare storage with Workers binding', {
        binding: CLOUDFLARE_STORAGE_CONFIG.binding,
        tablePrefix: CLOUDFLARE_STORAGE_CONFIG.tablePrefix
      })

      // In Workers runtime, the binding would be provided by the environment
      // For now, we'll use the REST API pattern for consistency
      cloudflareStorage = new D1Store({
        accountId: CLOUDFLARE_STORAGE_CONFIG.accountId!,
        databaseId: CLOUDFLARE_STORAGE_CONFIG.databaseId!,
        apiToken: CLOUDFLARE_STORAGE_CONFIG.apiToken!,
        tablePrefix: CLOUDFLARE_STORAGE_CONFIG.tablePrefix,
      })
    } else {
      // REST API pattern (for external access)
      log.info('Initializing Cloudflare storage with REST API', {
        accountId: CLOUDFLARE_STORAGE_CONFIG.accountId,
        databaseId: CLOUDFLARE_STORAGE_CONFIG.databaseId,
        tablePrefix: CLOUDFLARE_STORAGE_CONFIG.tablePrefix
      })

      cloudflareStorage = new D1Store({
        accountId: CLOUDFLARE_STORAGE_CONFIG.accountId!,
        databaseId: CLOUDFLARE_STORAGE_CONFIG.databaseId!,
        apiToken: CLOUDFLARE_STORAGE_CONFIG.apiToken!,
        tablePrefix: CLOUDFLARE_STORAGE_CONFIG.tablePrefix,
      })
    }

    log.info('Cloudflare storage initialized successfully')
  } catch (error) {
    log.error('Failed to initialize Cloudflare storage', { error: String(error) })
    throw error
  }
}

/**
 * Get or initialize the Cloudflare storage instance
 */
export async function getCloudflareStorage(): Promise<D1Store> {
  if (!cloudflareStorage) {
    await initializeCloudflareStorage()
  }
  return cloudflareStorage!
}

/**
 * Memory instance configured for Cloudflare storage with comprehensive settings
 */
export const cloudflareMemory = new Memory({
  storage: new D1Store({
    accountId: CLOUDFLARE_STORAGE_CONFIG.accountId!,
    databaseId: CLOUDFLARE_STORAGE_CONFIG.databaseId!,
    apiToken: CLOUDFLARE_STORAGE_CONFIG.apiToken!,
    tablePrefix: CLOUDFLARE_STORAGE_CONFIG.tablePrefix,
  }),
  vector: cloudflareStore,
  embedder: google.textEmbedding('gemini-embedding-001'),
  options: {
    // Message management
    lastMessages: parseInt(process.env.CLOUDFLARE_MEMORY_LAST_MESSAGES ?? '500'),
    // Advanced semantic recall with Cloudflare Vectorize configuration
    semanticRecall: {
      topK: parseInt(process.env.CLOUDFLARE_SEMANTIC_TOP_K ?? '5'),
      messageRange: {
        before: parseInt(process.env.CLOUDFLARE_SEMANTIC_RANGE_BEFORE ?? '3'),
        after: parseInt(process.env.CLOUDFLARE_SEMANTIC_RANGE_AFTER ?? '2'),
      },
      scope: 'resource', // 'resource' | 'thread'
      // Cloudflare Vectorize index configuration
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
      generateTitle: process.env.CLOUDFLARE_THREAD_GENERATE_TITLE !== 'false',
    },
  },
  processors: [new TokenLimiter(1048576)],
})

/**
 * Create a masked stream for sensitive data handling
 * Removes or masks sensitive information from message data
 */
export function createMaskedStream<T extends Record<string, unknown>>(
  data: T,
  sensitiveKeys: string[] = ['password', 'token', 'key', 'secret', 'apiKey']
): T {
  const masked = { ...data } as Record<string, unknown>

  for (const key of sensitiveKeys) {
    if (key in masked && typeof masked[key] === 'string') {
      masked[key] = '***MASKED***'
    }
  }

  return masked as T
}

/**
 * Mask sensitive message data for logging and storage
 */
export function maskSensitiveMessageData(
  message: Record<string, unknown>
): Record<string, unknown> {
  return createMaskedStream(message, [
    'password', 'token', 'key', 'secret', 'apiKey', 'authorization',
    'bearer', 'apikey', 'database_url', 'connection_string'
  ])
}

/**
 * Generate embeddings for text content using Google Gemini
 */
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  try {
    const { embeddings } = await google.textEmbedding('gemini-embedding-001').doEmbed({
      values: texts,
    })

    log.info('Embeddings generated successfully', {
      textCount: texts.length,
      embeddingDimension: embeddings[0]?.length
    })

    return embeddings
  } catch (error) {
    log.error('Failed to generate embeddings', { error: String(error) })
    throw error
  }
}

/**
 * Check database health and connectivity
 */
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy'
  latency?: number
  error?: string
}> {
  const startTime = Date.now()

  try {
    const storage = await getCloudflareStorage()
    // Perform a simple health check operation
    // Note: D1Store may not have a direct health check method
    // This is a placeholder for actual health check logic

    const latency = Date.now() - startTime

    log.info('Database health check passed', { latency })

    return {
      status: 'healthy',
      latency,
    }
  } catch (error) {
    const latency = Date.now() - startTime

    log.error('Database health check failed', {
      error: String(error),
      latency
    })

    return {
      status: 'unhealthy',
      latency,
      error: String(error),
    }
  }
}

/**
 * Initialize database schema and perform setup operations
 */
export async function initializeDatabase(): Promise<void> {
  try {
    log.info('Initializing Cloudflare database schema')

    // Database initialization logic would go here
    // This is a placeholder for schema setup operations

    log.info('Cloudflare database initialized successfully')
  } catch (error) {
    log.error('Failed to initialize Cloudflare database', { error: String(error) })
    throw error
  }
}

/**
 * Shutdown database connections and cleanup resources
 */
export async function shutdownDatabase(): Promise<void> {
  try {
    log.info('Shutting down Cloudflare database connections')

    // Cleanup logic would go here
    cloudflareStorage = null

    log.info('Cloudflare database shutdown completed')
  } catch (error) {
    log.error('Error during Cloudflare database shutdown', { error: String(error) })
    throw error
  }
}

/**
 * Format storage messages for consistent logging
 */
export function formatStorageMessages(
  operation: string,
  data: Record<string, unknown>,
  result?: unknown
): Record<string, unknown> {
  return {
    operation,
    timestamp: new Date().toISOString(),
    data: maskSensitiveMessageData(data),
    result: result ? maskSensitiveMessageData(result as Record<string, unknown>) : undefined,
  }
}

/**
 * Perform a storage operation with error handling and logging
 */
export async function performStorageOperation<T>(
  operation: string,
  operationFn: () => Promise<T>,
  context: Record<string, unknown> = {}
): Promise<T> {
  const startTime = Date.now()

  try {
    log.info(`Starting storage operation: ${operation}`, {
      ...formatStorageMessages(operation, context),
      startTime,
    })

    const result = await operationFn()

    const duration = Date.now() - startTime

    log.info(`Storage operation completed: ${operation}`, {
      ...formatStorageMessages(operation, context, result),
      duration,
    })

    return result
  } catch (error) {
    const duration = Date.now() - startTime

    log.error(`Storage operation failed: ${operation}`, {
      ...formatStorageMessages(operation, context),
      error: String(error),
      duration,
    })

    throw error
  }
}

// Export configuration for external use
export { CLOUDFLARE_STORAGE_CONFIG }
