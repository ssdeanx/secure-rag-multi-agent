import { createGoogleGenerativeAI } from '@ai-sdk/google'

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export const googleAI = google('gemini-2.5-flash-preview-09-2025')
export const googleAIPro = google('gemini-2.5-pro')
export const googleAIFlashLite = google('gemini-2.5-flash-lite-preview-09-2025')
export const googleAIEmbedding = google.textEmbedding('gemini-embedding-001')
