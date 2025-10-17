import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { modelRegistry, ModelProvider, ModelCapability } from './model-registry'
import { logError } from './logger'

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
})

export const openQwenAI = openrouter('qwen/qwen3-coder:free', {
    includeReasoning: true,
    extraBody: {
        reasoning: { max_tokens: 20000 },
        stream: true,
    },
    usage: { include: true },
})

export const openGLMAI = openrouter('z-ai/glm-4.5-air:free', {
    includeReasoning: true,
    extraBody: {
        reasoning: { max_tokens: 20000 },
        stream: true,
    },
    usage: { include: true },
})

export const openAIFree = openrouter('openai/gpt-oss-20b:free', {
    includeReasoning: true,
    extraBody: {
        reasoning: { max_tokens: 20000 },
        stream: true,
    },
    usage: { include: true },
})

// Register provider and model
try {
    modelRegistry.registerProvider({
        provider: ModelProvider.OPENROUTER,
        apiKeyEnvVar: 'OPENROUTER_API_KEY',
    })

    modelRegistry.registerModel(
        {
            id: 'qwen/qwen3-coder:free',
            name: 'Qwen3 Coder (Free)',
            provider: ModelProvider.OPENROUTER,
            capabilities: [ModelCapability.TEXT, ModelCapability.REASONING],
            contextWindow: 262144,
            costTier: 'free',
            maxTokens: 262144,
            supportsStreaming: true,
            description: 'Includes reasoning tokens (max 20000)',
        },
        openQwenAI
    )

    modelRegistry.registerModel(
        {
            id: 'z-ai/glm-4.5-air:free',
            name: 'GLM-4.5-Air (Free)',
            provider: ModelProvider.OPENROUTER,
            capabilities: [ModelCapability.TEXT, ModelCapability.REASONING],
            contextWindow: 131072,
            costTier: 'free',
            maxTokens: 131072,
            supportsStreaming: true,
            description: 'Includes reasoning tokens (max 20000)',
        },
        openGLMAI
    )
} catch (err) {
    logError('openrouter.config.register', err)
}

modelRegistry.registerModel(
    {
        id: 'openai/gpt-oss-20b:free',
        name: 'GPT-OSS-20B (Free)',
        provider: ModelProvider.OPENROUTER,
        capabilities: [ModelCapability.TEXT, ModelCapability.REASONING],
        contextWindow: 131072,
        costTier: 'free',
        maxTokens: 131072,
        supportsStreaming: true,
        description: 'Includes reasoning tokens (max 20000)',
    },
    openAIFree
)

export default openrouter
