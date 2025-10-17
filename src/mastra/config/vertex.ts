import { createVertex } from '@ai-sdk/google-vertex'
import { modelRegistry, ModelProvider, ModelCapability } from './model-registry'
import { logError } from './logger'

const project = process.env.GOOGLE_CLOUD_PROJECT
const location = process.env.GOOGLE_CLOUD_LOCATION ?? 'us-central1'
const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS

if (!project || project.trim() === '') {
    throw new Error('GOOGLE_CLOUD_PROJECT is required for Vertex configuration')
}

const vertex = createVertex({
    project,
    location,
    ...(keyFile !== null ? { googleAuthOptions: { keyFile } } : {}),
})

export const vertexAIPro = vertex('gemini-2.5-pro')
export const vertexAIFlash = vertex('gemini-2.5-flash-preview-09-2025')
export const vertexAIFlashLite = vertex('gemini-2.5-flash-lite-preview-09-2025')
//export const vertexAIClaude = vertex('gemini-2.5-flash-lite-preview-09-2025')

// Register provider and models if GCP project present
try {
    modelRegistry.registerProvider({
        provider: ModelProvider.VERTEX,
        apiKeyEnvVar: 'GOOGLE_CLOUD_PROJECT',
        description:
            'Requires GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_LOCATION, and optionally GOOGLE_APPLICATION_CREDENTIALS',
    })

    modelRegistry.registerModel(
        {
            id: 'gemini-2.5-pro',
            name: 'Vertex Gemini 2.5 Pro',
            provider: ModelProvider.VERTEX,
            capabilities: [ModelCapability.TEXT, ModelCapability.REASONING],
            contextWindow: 1000000,
            costTier: 'medium',
            maxTokens: 65000,
            supportsStreaming: true,
        },
        vertexAIPro
    )

    modelRegistry.registerModel(
        {
            id: 'gemini-2.5-flash-preview-09-2025',
            name: 'Vertex Gemini 2.5 Flash',
            provider: ModelProvider.VERTEX,
            capabilities: [ModelCapability.TEXT],
            contextWindow: 1000000,
            costTier: 'low',
            maxTokens: 65000,
            supportsStreaming: true,
        },
        vertexAIFlash
    )

    modelRegistry.registerModel(
        {
            id: 'gemini-2.5-flash-lite-preview-09-2025',
            name: 'Vertex Gemini 2.5 Flash Lite',
            provider: ModelProvider.VERTEX,
            capabilities: [ModelCapability.TEXT],
            contextWindow: 1000000,
            costTier: 'free',
            maxTokens: 64000,
            supportsStreaming: true,
        },
        vertexAIFlashLite
    )
} catch (err) {
    logError('vertex.config.register', err)
}

export default vertex
