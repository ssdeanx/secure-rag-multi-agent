import { createGeminiProvider } from 'ai-sdk-provider-gemini-cli'
import { modelRegistry, ModelProvider, ModelCapability } from './model-registry'
import { logError } from './logger'
import os from 'os'

const useApiKey =
    (process.env.GOOGLE_GENERATIVE_AI_API_KEY !== undefined) ||
    process.env.NODE_ENV === 'production'
const gemini = createGeminiProvider({
    authType: useApiKey ? 'api-key' : 'oauth-personal', // Use OAuth in dev, production use API key
    apiKey: useApiKey ? process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? '' : undefined, // Provide API key if using API key auth
    cacheDir: process.env.GEMINI_OAUTH_CACHE ?? os.homedir() + '/.gemini/oauth-cache', // directory to store cached tokens
})

export const geminiAI = gemini('gemini-2.5-pro', {
    contextWindow: 1048576, // 1MB
    maxTokens: 65536,
    supportsStreaming: true,
    thinkingBudget: -1,
    showThoughts: true,
    codeexecution: true,
    structuredOutput: true,
    functionCalling: true,
    urlContext: true
});
export const geminiAIFlash = gemini('gemini-2.5-flash', {
    contextWindow: 1048576, // 1MB
    maxTokens: 65536,
    supportsStreaming: true,
    thinkingBudget: -1,
    codeexecution: true,
    showThoughts: true,
    structuredOutput: true,
    grounding: true,
    functionCalling: true,
    urlContext: true
});
export const geminiAIFlashLite = gemini('gemini-2.5-flash-lite', {
    contextWindow: 1048576, // 1MB
    maxTokens: 64000,
    supportsStreaming: true,
    thinkingBudget: -1,
    showThoughts: true,
    //codeexecution: true,
    structuredOutput: true,
    grounding: true,
    //functionCalling: true,
    urlContext: true
})

export const geminiAIFlashimg = gemini('gemini-2.5-flash-image-preview', {
    maxTokens: 8192,
    supportsStreaming: true,
})

export const geminiAIv = gemini(
    'gemini-2.5-flash-preview-native-audio-dialog',
    {
        maxTokens: 8192,
        supportsStreaming: true,
})

export const geminiAIv2 = gemini('gemini-2.5-flash-preview-tts', {
    maxTokens: 8192,
    supportsStreaming: true,
})

export const geminiAIv3 = gemini(
    'gemini-2.5-flash-exp-native-audio-thinking-dialog',
    {
        maxTokens: 8192,
        supportsStreaming: true,
})

// Register provider and models
try {
    modelRegistry.registerProvider({
        provider: ModelProvider.GEMINI_CLI,
        apiKeyEnvVar: 'GOOGLE_GENERATIVE_AI_API_KEY',
        description: 'Supports OAuth in dev (GEMINI_OAUTH_CACHE), API key in production',
    })

    modelRegistry.registerModel(
        {
            id: 'gemini-2.5-pro',
            name: 'Gemini CLI 2.5 Pro',
            provider: ModelProvider.GEMINI_CLI,
            capabilities: [ModelCapability.TEXT, ModelCapability.REASONING],
            contextWindow: 1000000,
            costTier: 'medium',
            maxTokens: 65000,
            requiresAuth: 'oauth-personal',
            supportsStreaming: true,
        },
        geminiAI
    )

    modelRegistry.registerModel(
        {
            id: 'gemini-2.5-flash',
            name: 'Gemini CLI 2.5 Flash',
            provider: ModelProvider.GEMINI_CLI,
            capabilities: [ModelCapability.TEXT],
            contextWindow: 1000000,
            costTier: 'low',
            maxTokens: 65000,
            supportsStreaming: true,
        },
        geminiAIFlash
    )

    modelRegistry.registerModel(
        {
            id: 'gemini-2.5-flash-lite',
            name: 'Gemini CLI 2.5 Flash Lite',
            provider: ModelProvider.GEMINI_CLI,
            capabilities: [ModelCapability.TEXT],
            contextWindow: 1000000,
            costTier: 'free',
            maxTokens: 64000,
            supportsStreaming: true,
        },
        geminiAIFlashLite
    )

    modelRegistry.registerModel(
        {
            id: 'gemini-2.5-flash-image-preview',
            name: 'Gemini CLI Flash Image',
            provider: ModelProvider.GEMINI_CLI,
            capabilities: [ModelCapability.TEXT, ModelCapability.VISION],
            contextWindow: 32000,
            costTier: 'low',
            maxTokens: 8192,
            supportsStreaming: true,
        },
        geminiAIFlashimg
    )

    modelRegistry.registerModel(
        {
            id: 'gemini-2.5-flash-preview-native-audio-dialog',
            name: 'Gemini CLI Audio Dialog',
            provider: ModelProvider.GEMINI_CLI,
            capabilities: [ModelCapability.TEXT, ModelCapability.AUDIO],
            contextWindow: 32000,
            costTier: 'medium',
            maxTokens: 8192,
            supportsStreaming: true,
        },
        geminiAIv
    )

    modelRegistry.registerModel(
        {
            id: 'gemini-2.5-flash-preview-tts',
            name: 'Gemini CLI TTS',
            provider: ModelProvider.GEMINI_CLI,
            capabilities: [ModelCapability.TEXT, ModelCapability.AUDIO],
            contextWindow: 32000,
            costTier: 'medium',
            maxTokens: 8192,
            supportsStreaming: true,
        },
        geminiAIv2
    )

    modelRegistry.registerModel(
        {
            id: 'gemini-2.5-flash-exp-native-audio-thinking-dialog',
            name: 'Gemini CLI Audio Thinking',
            provider: ModelProvider.GEMINI_CLI,
            capabilities: [ModelCapability.TEXT, ModelCapability.AUDIO, ModelCapability.REASONING],
            contextWindow: 32000,
            costTier: 'medium',
            maxTokens: 8192,
            supportsStreaming: true,
        },
        geminiAIv3
    )
} catch (err) {
    logError('gemini-cli.config.register', err)
}

export default gemini
