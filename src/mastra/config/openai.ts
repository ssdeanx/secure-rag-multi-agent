import { createOpenAI } from '@ai-sdk/openai'
import type { CostTier } from './model-registry';
import { modelRegistry, ModelProvider, ModelCapability } from './model-registry'
import { logError } from './logger'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// OpenAI configuration from environment variables
export const openAIConfig: { apiKey: string; baseURL: string; model: string } =
    {
        apiKey: process.env.OPENAI_API_KEY ?? '',
        baseURL: process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1',
        model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
    }

// Create the OpenAI provider with configuration
export const openAIProvider = createOpenAI({
    apiKey: openAIConfig.apiKey,
    baseURL: openAIConfig.baseURL,
    // Add timeout configurations for reasoning model processing
    headers: {
        'X-Request-Timeout': '600000', // 600 seconds (10 minutes) per call
    },
    fetch: (url: string | URL | RequestInfo, options?: RequestInit) => {
        // Add custom fetch with extended timeout for reasoning models
        const controller: AbortController = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 600000) // 600 seconds (10 minutes)

        return fetch(url, {
            ...options,
            signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId))
    },
})

// Export the configured model with timeout settings
export const openAIModel = openAIProvider(openAIConfig.model)

// Separate OpenAI configuration for embeddings (uses real OpenAI API)
export const openAIEmbeddingConfig: { apiKey: string; baseURL: string } = {
    apiKey:
        process.env.OPENAI_EMBEDDING_API_KEY ??
        process.env.OPENAI_API_KEY ??
        '',
    baseURL:
        process.env.OPENAI_EMBEDDING_BASE_URL ?? 'https://api.openai.com/v1',
}

// Create a separate OpenAI provider specifically for embeddings
export const openAIEmbeddingProvider = createOpenAI({
    apiKey: openAIEmbeddingConfig.apiKey,
    baseURL: openAIEmbeddingConfig.baseURL,
})

// Register provider and configured models
try {
    modelRegistry.registerProvider({
        provider: ModelProvider.OPENAI,
        apiKeyEnvVar: 'OPENAI_API_KEY',
        baseUrlEnvVar: 'OPENAI_BASE_URL',
    })

    // Register the configured model
    const configuredModel = openAIConfig.model
    const mapping: Record<string, {
        name: string
        capabilities: ModelCapability[]
        contextWindow: number
        costTier: CostTier
        maxTokens: number
        supportsStreaming?: boolean
    }> = {
        // OpenAI: include reasoning-focused models (per user request)
        'o3': {
            name: 'o3',
            capabilities: [ModelCapability.TEXT, ModelCapability.REASONING],
            contextWindow: 256000,
            costTier: 'high',
            maxTokens: 32768,
            supportsStreaming: true,
        },
        'o4-mini': {
            name: 'o4-mini',
            capabilities: [ModelCapability.TEXT],
            contextWindow: 128000,
            costTier: 'low',
            maxTokens: 16384,
            supportsStreaming: true,
        },
        'gpt-4.5': {
            name: 'GPT-4.5',
            capabilities: [ModelCapability.TEXT, ModelCapability.VISION, ModelCapability.REASONING],
            contextWindow: 262144,
            costTier: 'medium',
            maxTokens: 65536,
            supportsStreaming: true,
        },
        'o1-preview': {
            name: 'O1 Preview',
            capabilities: [ModelCapability.TEXT, ModelCapability.REASONING],
            contextWindow: 128000,
            costTier: 'high',
            maxTokens: 32768,
            supportsStreaming: true,
        },
    }

    const keys = Object.keys(mapping)
    const meta = mapping[configuredModel] ?? mapping[keys[0]]
    modelRegistry.registerModel(
        {
            id: configuredModel,
            name: meta.name,
            provider: ModelProvider.OPENAI,
            capabilities: meta.capabilities,
            contextWindow: meta.contextWindow,
            costTier: meta.costTier,
            maxTokens: meta.maxTokens,
            supportsStreaming: meta.supportsStreaming ?? false,
            description: `OpenAI model ${configuredModel} (configured via OPENAI_MODEL)`,
        },
        openAIModel
    )

    // Embedding model
    modelRegistry.registerModel(
        {
            id: 'text-embedding-3-small',
            name: 'Text Embedding 3 Small',
            provider: ModelProvider.OPENAI,
            capabilities: [ModelCapability.EMBEDDING],
            contextWindow: 8191,
            costTier: 'low',
            maxTokens: 8191,
        },
        openAIEmbeddingProvider
    )
} catch (err) {
    logError('openai.config.register', err)
}
