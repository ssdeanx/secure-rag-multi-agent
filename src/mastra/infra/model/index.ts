import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import type { Container } from 'inversify'
import { Config } from '../../domain/aggregates/config.js'
import type { LanguageModel } from 'ai'

export const MODEL_SYMBOL = Symbol.for('Model')
export function getModel(container: Container): LanguageModel {
    const config = container.get(Config)
    const openrouter = createOpenRouter({
        apiKey: config.OPENROUTER_API_KEY,
    })
    return openrouter.chat('google/gemini-2.5-flash')
}
