import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import z from 'zod'

/**
 * GET /api/dashboard/settings/models
 * Retrieve available models with optional filtering
 * Query params: ?provider=google&capability=text-generation&available=true
 */
export async function GET(request: NextRequest) {
    try {
        const cfg = await import('@/src/mastra/config')
        const { modelRegistry } = cfg

        const url = new URL(request.url)
        const provider = url.searchParams.get('provider')
        const capability = url.searchParams.get('capability')

        let models = modelRegistry.getAvailableModels()

        // Transform to API response format
        const payload = models.map((m) => ({
            id: m.id,
            name: m.name,
            provider: m.provider,
            capabilities: m.capabilities,
            contextWindow: m.contextWindow,
            costTier: m.costTier,
            maxTokens: m.maxTokens,
            supportsStreaming: m.supportsStreaming ?? false,
            isAvailable: m.isAvailable,
            description: m.description,
        }))

        return NextResponse.json(payload, {
            status: 200,
            headers: { 'Cache-Control': 'public, max-age=300' },
        })
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching models:', error)
        return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 })
    }
}

/**
 * PATCH /api/dashboard/settings/models
 * Update model configuration (temperature, max tokens, etc)
 * Request body: { primaryModelId, fallbackModelId?, temperature?, maxTokens?, topP? }
 */
export async function PATCH(request: NextRequest) {
    try {
        const cfg = await import('@/src/mastra/config')
        const { modelRegistry } = cfg

        let body
        try {
            body = await request.json()
        } catch (e) {
            return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 })
        }

        // Validate request body
        const schema = z.object({
            primaryModelId: z.string().min(1, 'Primary model ID is required'),
            fallbackModelId: z.string().optional(),
            temperature: z.number().min(0).max(1).optional(),
            maxTokens: z.number().min(1).optional(),
            topP: z.number().min(0).max(1).optional(),
        })

        const parsed = schema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid payload', details: parsed.error.format() },
                { status: 400 }
            )
        }

        // Validate primary model exists and is available
        const primaryModel = modelRegistry.getModel(parsed.data.primaryModelId)
        if (!primaryModel) {
            return NextResponse.json({ error: 'Primary model not found' }, { status: 404 })
        }

        if (!primaryModel.isAvailable) {
            return NextResponse.json({ error: 'Primary model is not available' }, { status: 400 })
        }

        // TODO: Persist to database (PostgreSQL/Supabase user_model_preferences table)
        // For now, just return the validated config
        const config = {
            primaryModelId: parsed.data.primaryModelId,
            fallbackModelId: parsed.data.fallbackModelId,
            temperature: parsed.data.temperature ?? 0.7,
            maxTokens: parsed.data.maxTokens ?? 2048,
            topP: parsed.data.topP ?? 0.9,
        }

        return NextResponse.json({
            message: 'Model configuration updated successfully (persistence pending)',
            config,
        })
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error updating models:', error)
        return NextResponse.json({ error: 'Failed to update model configuration' }, { status: 500 })
    }
}
