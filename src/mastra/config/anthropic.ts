import { createAnthropic } from '@ai-sdk/anthropic'
import { modelRegistry, ModelProvider, ModelCapability } from './model-registry'
import { logError } from './logger'

const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

// Expose new Anthropic model instances (Claude 4 / 4.5 and Haiku 4.5)
export const anthropicClaude4 = anthropic('claude-4')
export const anthropicClaude45 = anthropic('claude-4-5')
export const anthropicHaiku45 = anthropic('haiku-4-5')

try {
    modelRegistry.registerProvider({
        provider: ModelProvider.ANTHROPIC,
        apiKeyEnvVar: 'ANTHROPIC_API_KEY',
    })

    // Claude 4
    modelRegistry.registerModel(
        {
            id: 'claude-4',
            name: 'Claude 4',
            provider: ModelProvider.ANTHROPIC,
            capabilities: [ModelCapability.TEXT, ModelCapability.REASONING],
            contextWindow: 200000,
            costTier: 'high',
            maxTokens: 64000,
            supportsStreaming: true,
        },
        anthropicClaude4
    )

    // Claude 4.5
    modelRegistry.registerModel(
        {
            id: 'claude-4-5',
            name: 'Claude 4.5',
            provider: ModelProvider.ANTHROPIC,
            capabilities: [ModelCapability.TEXT, ModelCapability.REASONING],
            contextWindow: 1000000,
            costTier: 'high',
            maxTokens: 64000,
            supportsStreaming: true,
        },
        anthropicClaude45
    )

    // Haiku 4.5
    modelRegistry.registerModel(
        {
            id: 'haiku-4-5',
            name: 'Haiku 4.5',
            provider: ModelProvider.ANTHROPIC,
            capabilities: [ModelCapability.TEXT],
            contextWindow: 200000,
            costTier: 'low',
            maxTokens: 16384,
            supportsStreaming: true,
        },
        anthropicHaiku45
    )
} catch (err) {
    logError('anthropic.config.register', err)
}

export default anthropic


