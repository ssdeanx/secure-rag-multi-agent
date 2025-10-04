import { createGeminiProvider } from 'ai-sdk-provider-gemini-cli';


const useApiKey = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NODE_ENV === 'production';
const gemini = createGeminiProvider({
  authType: useApiKey ? 'api-key' : 'oauth-personal', // Use OAuth in dev, production use API
  apiKey: useApiKey ? process.env.GOOGLE_GENERATIVE_AI_API_KEY : undefined, // Provide API key if using API key auth
  cacheDir: process.env.GEMINI_OAUTH_CACHE, // directory to store cached tokens
});

export const geminiAI = gemini('gemini-2.5-pro',
  {}
);
export const geminiAIFlash = gemini('gemini-2.5-flash',
{}
);
export const geminiAIFlashLite = gemini('gemini-2.5-flash-lite',
  {}
);

export const geminiAIFlashimg = gemini('gemini-2.5-flash-image-preview',
  {}
);

export const geminiAIv = gemini('gemini-2.5-flash-preview-native-audio-dialog',
  {}
);

export const geminiAIv2 = gemini('gemini-2.5-flash-preview-tts',
  {}
);

export const geminiAIv3 = gemini('gemini-2.5-flash-exp-native-audio-thinking-dialog',
  {}
);

export default gemini;
