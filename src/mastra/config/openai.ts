import { createOpenAI } from '@ai-sdk/openai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// OpenAI configuration from environment variables
export const openAIConfig: { apiKey: string; baseURL: string; model: string; } = {
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
};

// Create the OpenAI provider with configuration
export const openAIProvider = createOpenAI({
  apiKey: openAIConfig.apiKey,
  baseURL: openAIConfig.baseURL,
  // Add timeout configurations for reasoning model processing
  headers: {
    'X-Request-Timeout': '600000', // 600 seconds (10 minutes) per call
  },
  fetch: (url: string | URL | RequestInfo, options?: RequestInit) => {
    // Add custom fetch with extended timeout for reasoning models
    const controller: AbortController = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000); // 600 seconds (10 minutes)

    return fetch(url, {
      ...options,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
  },
});

// Export the configured model with timeout settings
export const openAIModel = openAIProvider(openAIConfig.model, {
  // Additional model-specific configurations for reasoning
  structuredOutputs: true,
  reasoningEffort: 'medium', // Adjust based on your model's capabilities
  // Other model-specific configurations...
});

// Separate OpenAI configuration for embeddings (uses real OpenAI API)
export const openAIEmbeddingConfig: { apiKey: string; baseURL: string; } = {
  apiKey: process.env.OPENAI_EMBEDDING_API_KEY || process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_EMBEDDING_BASE_URL || 'https://api.openai.com/v1',
};

// Create a separate OpenAI provider specifically for embeddings
export const openAIEmbeddingProvider = createOpenAI({
  apiKey: openAIEmbeddingConfig.apiKey,
  baseURL: openAIEmbeddingConfig.baseURL,
});