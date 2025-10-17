import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import z from 'zod'

export async function GET(request: NextRequest) {
    try {
        // dynamic import at runtime to avoid server/client bundling issues
        const cfg = await import('@/src/mastra/config')
        const modelRegistry = cfg.modelRegistry
        const url = new URL(request.url)
        const provider = url.searchParams.get('provider') ?? undefined
        const capability = url.searchParams.get('capability') ?? undefined
        const available = url.searchParams.get('available')

        let models = modelRegistry.getAvailableModels()

        if (provider) {
            models = models.filter((m) => m.provider === provider)
        }

        if (capability) {
            models = models.filter((m) =>
                Array.isArray(m.capabilities) && m.capabilities.includes(capability)
            );
        }

        if (available === 'true' || available === 'false') {
                models = models.filter((m) => m.isAvailable)
            } else if (available === 'false') {
                models = models.filter((m) => !m.isAvailable)
            }
        }

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
        }))

        return NextResponse.json(payload, {
            status: 200,
            headers: { 'Cache-Control': 'public, max-age=300' },
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 })
    }

export async function PATCH(request: NextRequest) {
    // Ensure config is imported and modelRegistry is available inside PATCH handler
    try {
        // dynamic import at runtime to avoid server/client bundling issues
        const cfg = await import('@/src/mastra/config')
        const modelRegistry = cfg.modelRegistry

        let body
        try {
            body = await request.json()
        } catch (e) {
            return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 })
        }
        const parsed = z.object({
            primaryModel: z.string(),
            fallbackModel: z.string().optional(),
            temperature: z.number().optional(),
            maxTokens: z.number().optional(),
            topP: z.number().optional(),
        }).safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid payload', details: parsed.error.format() }, { status: 400 })
        }


        // Validate primary model exists
        const primary = modelRegistry.getModel(parsed.data.primaryModel)
        if (!primary) {
            return NextResponse.json({ error: 'Primary model not found' }, { status: 404 })
        }

        // TODO: Store configuration in PostgreSQL user_model_preferences table aka Supabase
        const config = z.object({
            userId: z.string().optional(),
            tenantId: z.string().optional(),
            primaryModelId: z.string(),
            fallbackModelId: z.string().optional(),
            temperature: z.number().optional(),
            maxTokens: z.number().optional(),
            topP: z.number().optional(),
        }).parse(body)
        return NextResponse.json({ message: 'Model configuration updated successfully', config })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update model configuration' }, { status: 500 })
    }
}
