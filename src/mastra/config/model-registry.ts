import { logError, log } from './logger'

/**
 * Model registry: central catalog of available models and provider configuration
 * This file is intentionally conservative: registration failures are logged but
 * do not throw so that existing provider exports remain usable.
 */
//No point in this
export enum ModelCapability {
    TEXT = 'text-generation',
    EMBEDDING = 'embedding',
    VISION = 'vision',
    AUDIO = 'audio',
    REASONING = 'reasoning',
    IMAGE_GENERATION = 'image-generation',
}

export enum ModelProvider {
    GOOGLE = 'google',
    OPENAI = 'openai',
    ANTHROPIC = 'anthropic',
    OPENROUTER = 'openrouter',
    VERTEX = 'vertex',
    GEMINI_CLI = 'gemini-cli',
}

export type CostTier = 'free' | 'low' | 'medium' | 'high'

export interface ModelMetadata {
    id: string
    name: string
    provider: ModelProvider
    capabilities: ModelCapability[]
    contextWindow: number
    costTier: CostTier
    maxTokens: number
    supportsStreaming?: boolean
    requiresAuth?: string
    description?: string
}

export interface ProviderConfig {
    provider: ModelProvider
    apiKeyEnvVar?: string
    baseUrlEnvVar?: string
    description?: string
}

// light typing for external model instance; providers return various shapes
export type LanguageModel = unknown

export interface RegisteredModel extends ModelMetadata {
    instance?: LanguageModel
    isAvailable: boolean
}

export class ModelRegistry {
    private static instance: ModelRegistry | null = null
    private models: Map<string, RegisteredModel> = new Map()
    private providers: Map<ModelProvider, ProviderConfig> = new Map()

    private constructor() {}

    static getInstance() {
        ModelRegistry.instance ??= new ModelRegistry();
        return ModelRegistry.instance
    }

    registerProvider(config: ProviderConfig) {
        try {
            this.providers.set(config.provider, config)
            const configured = this.isProviderConfigured(config.provider)
            log.info(`Registered provider ${config.provider}`, { provider: config, configured })
        } catch (err) {
            logError('model-registry.registerProvider', err)
        }
    }

    registerModel(metadata: ModelMetadata, instance?: LanguageModel) {
        try {
            const providerCfg = this.providers.get(metadata.provider)
            // Explicitly handle null/empty env var names. If providerCfg.apiKeyEnvVar is a non-empty string,
            // check the corresponding env var; otherwise assume the model is available (no API key required).
            let isAvailable = true
            if (providerCfg) {
                const apiKeyEnv = providerCfg.apiKeyEnvVar
                if (typeof apiKeyEnv === 'string' && apiKeyEnv !== '') {
                    isAvailable = Boolean(process.env[apiKeyEnv])
                }
            }

            const registered: RegisteredModel = {
                ...metadata,
                instance,
                isAvailable,
            }

            this.models.set(metadata.id, registered)
            log.info(`Registered model ${metadata.id}`, { id: metadata.id, isAvailable })
        } catch (err) {
            logError('model-registry.registerModel', err)
        }
    }

    getModel(modelId: string): RegisteredModel | undefined {
        return this.models.get(modelId)
    }

    getAvailableModels(filters?: { provider?: ModelProvider; capability?: ModelCapability }) {
        const out: RegisteredModel[] = []
        // Cache optional filter values so TypeScript can narrow them safely
        const providerFilter = filters?.provider ?? null
        const capabilityFilter = filters?.capability ?? null
        for (const m of this.models.values()) {
            if (!m.isAvailable) {
                continue
            }
            // explicit null/undefined checks for enum filters to avoid using enums as booleans
            if (providerFilter !== null && m.provider !== providerFilter) {
                continue
            }
            if (capabilityFilter !== null && !m.capabilities.includes(capabilityFilter)) {
                continue
            }
            out.push(m)
        }
        return out
    }

    getAllProviders() {
        const out: Array<ProviderConfig & { isConfigured: boolean; modelCount: number }> = []
        for (const [k, v] of this.providers.entries()) {
            const isConfigured = this.isProviderConfigured(k)
            const modelCount = Array.from(this.models.values()).filter((m) => m.provider === k).length
            out.push({ ...v, isConfigured, modelCount })
        }
        return out
    }

    isProviderConfigured(provider: ModelProvider) {
        const cfg = this.providers.get(provider)
        if (!cfg) {
            return false
        }
        // Treat null/undefined/empty-string apiKeyEnvVar as "no API key required".
        const apiKeyEnv = cfg.apiKeyEnvVar
        if (typeof apiKeyEnv === 'string' && apiKeyEnv !== '') {
            return Boolean(process.env[apiKeyEnv])
        }
        return true
    }

    getModelsByProvider(provider: ModelProvider) {
        return Array.from(this.models.values()).filter((m) => m.provider === provider)
    }

    getDefaultModel(capability?: ModelCapability): RegisteredModel | undefined {
        // simple heuristic: prefer available model with lowest costTier and matching capability
        const candidates = Array.from(this.models.values()).filter((m) => m.isAvailable && (capability === undefined || m.capabilities.includes(capability)))
        if (candidates.length === 0) {
            return undefined
        }
        const rank: Record<CostTier, number> = { free: 0, low: 1, medium: 2, high: 3 }
        candidates.sort((a, b) => rank[a.costTier] - rank[b.costTier])
        return candidates[0]
    }
}

export const modelRegistry = ModelRegistry.getInstance()


