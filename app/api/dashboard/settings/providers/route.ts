import { NextResponse } from 'next/server'

/**
 * GET /api/dashboard/settings/providers
 * Retrieve all configured providers and their status
 * Response: Array of providers with configuration status
 */
export async function GET() {
    try {
        const cfg = await import('@/src/mastra/config')
        const { modelRegistry } = cfg

        const providers = modelRegistry.getAllProviders()

        const payload = providers.map((p) => ({
            provider: p.provider,
            description: p.description,
            configured: p.isConfigured,
            modelCount: p.modelCount,
            status: p.isConfigured ? 'ready' : 'missing-credentials',
        }))

        return NextResponse.json(payload, {
            status: 200,
            headers: { 'Cache-Control': 'public, max-age=300' },
        })
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching providers:', error)
        return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
    }
}
