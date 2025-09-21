import { createGeminiProvider } from 'ai-sdk-provider-gemini-cli';

const gemini = createGeminiProvider({
  authType: 'oauth-personal',  // or 'api-key'
//  apiKey: process.env.GEMINI_API_KEY ?? '',  // if using api-key auth
  cacheDir: '~/.gemini/oauth_creds.json', // Directory to store cached tokens
});


export default gemini;