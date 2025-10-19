import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { modelRegistry, ModelProvider, ModelCapability } from './model-registry'
import { logError } from './logger'

export const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})
// Gemini 2.5 Flash model for general-purpose applications
/*
 * googleAI: Main Gemini 2.5 Flash model for general-purpose applications
    * When to use: This model is suitable for a wide range of tasks including text generation, reasoning, and vision-related applications. It offers a good balance between performance and cost, making it ideal for most standard use cases.
    * Why use: Choose this model when you need reliable performance for diverse applications without the higher costs associated with premium models.
 */
export const googleAI = google('gemini-2.5-flash-preview-09-2025')
// Gemini 2.5 Pro model for higher-performance applications
/*
 * googleAIPro: Gemini 2.5 Pro model for higher-performance applications
    * When to use: This model is designed for applications that require enhanced reasoning capabilities, more complex text generation, and advanced vision tasks. It is ideal for scenarios where quality and depth of response are critical.
    * Why use: Opt for this model when your application demands superior performance and can benefit from the advanced features it offers, despite the higher associated costs.
 */
export const googleAIPro = google('gemini-2.5-pro')
// Gemini 2.5 Flash Lite model for free-tier applications
/*
 * googleAIFlashLite: Gemini 2.5 Flash Lite model for free-tier applications
    * When to use: This model is suitable for applications with basic text generation and reasoning needs, especially when operating under budget constraints or within a free-tier usage plan.
    * Why use: Select this model when you need to minimize costs while still leveraging the capabilities of the Gemini series for simpler tasks.
 */
export const googleAIFlashLite = google('gemini-2.5-flash-lite-preview-09-2025')
// Gemini Embedding 001 model for generating text embeddings
/*
 * googleAIEmbedding: Gemini Embedding 001 model for generating text embeddings
    * When to use: This model is ideal for tasks that require the conversion of text into high-dimensional vector representations, such as semantic search, clustering, and recommendation systems.
    * Why use: Utilize this model when you need efficient and effective text embeddings to enhance the performance of applications involving natural language understanding and information retrieval.
 */
export const googleAIEmbedding = google.textEmbedding('gemini-embedding-001')
// Gemini Computer Use model for tasks requiring higher accuracy and reliability
/*
 * googleAIComputerUse: Gemini Computer Use model for tasks requiring higher accuracy and reliability
    * When to use: This model is tailored for applications that demand precise and dependable outputs, such as critical decision-making systems, technical content generation, and scenarios where accuracy is paramount.
    * Why use: Choose this model when the quality and reliability of the generated content are crucial to your application's success, even if it comes with increased computational costs.
 */
export const googleAIComputerUse = google('gemini-2.5-computer-use-preview-10-2025')
// Gemini Nano Banana model for low-cost image generation
/*
 * googleAINanoBanana: Gemini Nano Banana model for low-cost image generation
    * When to use: This model is optimized for generating images at a lower cost, making it suitable for applications where budget constraints are a priority, and high-resolution images are not essential.
    * Why use: Opt for this model when you need to produce images affordably, especially for applications like social media content, basic visualizations, or scenarios where image quality can be compromised for cost savings.
 */
export const googleAINanoBanana = google('gemini-2.5-flash-image')

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

    modelRegistry.registerModel(
        {
            id: 'gemini-2.5-computer-use-preview-10-2025',
            name: 'Gemini 2.5 Computer Use',
            provider: ModelProvider.GOOGLE,
            capabilities: [ModelCapability.TEXT, ModelCapability.REASONING, ModelCapability.VISION],
            contextWindow: 1048576, // 1MB
            costTier: 'high',
            maxTokens: 65536,
            supportsStreaming: true,
        },
        googleAIComputerUse
    )

    modelRegistry.registerModel(
        {
            id: 'gemini-2.5-flash-image',
            name: 'Gemini 2.5 Flash Image',
            provider: ModelProvider.GOOGLE,
            capabilities: [ModelCapability.IMAGE_GENERATION, ModelCapability.VISION, ModelCapability.TEXT],
            contextWindow: 32000, // 32k tokens
            costTier: 'low',
            maxTokens: 8192,
            supportsStreaming: true,
        },
        googleAINanoBanana
    )
} catch (err) {
    logError('google.config.register', err)
}
