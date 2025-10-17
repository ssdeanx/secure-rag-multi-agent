# Model Registry System

This module provides a centralized, environment-aware registry of AI models and provider configuration used across Mastra.

Overview
- `model-registry.ts` exports `modelRegistry` singleton and type-safe metadata used by API routes and UI.
- Provider config files (e.g. `google.ts`, `openai.ts`) continue to export model instances as before and **also** register metadata on module load.

Usage
```ts
import { modelRegistry } from './model-registry'
const models = modelRegistry.getAvailableModels({ provider: 'google' })
```

Environment
- Google: `GOOGLE_GENERATIVE_AI_API_KEY`
- OpenAI: `OPENAI_API_KEY`, `OPENAI_BASE_URL` (optional)
- Anthropic: `ANTHROPIC_API_KEY`
- OpenRouter: `OPENROUTER_API_KEY`
- Vertex: `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`, `GOOGLE_APPLICATION_CREDENTIALS` (optional)
- Gemini CLI: `GOOGLE_GENERATIVE_AI_API_KEY` or OAuth via `GEMINI_OAUTH_CACHE`

Adding models
1. Add or update model creation in the provider file (e.g., `google.ts`).
2. Call `modelRegistry.registerModel(metadata, instance)` after creating instances.

Backward compatibility
- Existing named exports are preserved. Registration is non-blocking and wrapped in try/catch to avoid affecting current behavior.


