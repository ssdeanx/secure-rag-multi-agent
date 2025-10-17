import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { modelRegistry, ModelProvider, ModelCapability } from './model-registry'
import { logError } from './logger'

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export const googleAI = google('gemini-2.5-flash-preview-09-2025')
export const googleAIPro = google('gemini-2.5-pro')
export const googleAIFlashLite = google('gemini-2.5-flash-lite-preview-09-2025')
export const googleAIEmbedding = google.textEmbedding('gemini-embedding-001')

// Register provider and models (non-blocking)
try {
    modelRegistry.registerProvider({
        provider: ModelProvider.GOOGLE,
        apiKeyEnvVar: 'GOOGLE_GENERATIVE_AI_API_KEY',
    })

    modelRegistry.registerModel(
        {
            id: 'gemini-2.5-flash-preview-09-2025',
            name: 'Gemini 2.5 Flash',
            provider: ModelProvider.GOOGLE,
            capabilities: [ModelCapability.TEXT, ModelCapability.REASONING, ModelCapability.VISION],
            contextWindow: 1048576, // 1MB
            costTier: 'low',
            maxTokens: 65536,
            supportsStreaming: true,
        },
        googleAI
    )

    modelRegistry.registerModel(
        {
            id: 'gemini-2.5-pro',
            name: 'Gemini 2.5 Pro',
            provider: ModelProvider.GOOGLE,
            capabilities: [ModelCapability.TEXT, ModelCapability.REASONING, ModelCapability.VISION],
            contextWindow: 1048576, // 1MB
            costTier: 'medium',
            maxTokens: 65536,
            supportsStreaming: true,
        },
        googleAIPro
    )

    modelRegistry.registerModel(
        {
            id: 'gemini-2.5-flash-lite-preview-09-2025',
            name: 'Gemini 2.5 Flash Lite',
            provider: ModelProvider.GOOGLE,
            capabilities: [ModelCapability.TEXT, ModelCapability.REASONING, ModelCapability.VISION],
            contextWindow: 1048576, // 1MB
            costTier: 'free',
            maxTokens: 64000,
            supportsStreaming: true,
        },
        googleAIFlashLite
    )

    modelRegistry.registerModel(
        {
            id: 'gemini-embedding-001',
            name: 'Gemini Embedding 001',
            provider: ModelProvider.GOOGLE,
            capabilities: [ModelCapability.EMBEDDING],
            contextWindow: 2048,
            costTier: 'free',
            maxTokens: 2048,
            supportsStreaming: true,
        },
        googleAIEmbedding
    )
} catch (err) {
    logError('google.config.register', err)
}
