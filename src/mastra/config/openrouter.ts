import { createOpenRouter } from '@openrouter/ai-sdk-provider'

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
})

export const openGrokAI = openrouter('x-ai/grok-4-fast:free', {
    includeReasoning: true,
    extraBody: {
        reasoning: { max_tokens: 20000 },
        stream: true,
    },
    usage: { include: true },
})

export default openrouter
