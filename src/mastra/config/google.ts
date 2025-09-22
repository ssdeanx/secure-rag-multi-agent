import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
  // custom settings
});

export const googleAIPro = google('gemini-2.5-pro',
);
export const googleAI = google('gemini-2.5-flash');
export const googleAIFlashLite = google('gemini-2.5-flash-lite' );
export const googleAIEmbedding = google('gemini-embedding-001');


