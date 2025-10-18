import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'
import { mastraClient } from '@/lib/mastra/mastra-client'

/**
 * Get telemetry data from Mastra observability API.
 * Provides detailed performance and usage metrics.
 * Internal endpoint - calls local Mastra server observability APIs.
 * @see https://mastra.ai/en/reference/client-js/telemetry
 */
export async function GET(request: NextRequest) {
    try {
        // Extract query parameters
        const { searchParams } = new URL(request.url)
        const name = searchParams.get('name')
        const scope = searchParams.get('scope')
        const page = parseInt(searchParams.get('page') ?? '1')
        const perPage = parseInt(searchParams.get('perPage') ?? '50')

        // Call Mastra telemetry API with explicit null/empty checks
        const telemetryParams: Record<string, unknown> = { page, perPage }
        if (typeof name === 'string' && name.length > 0) {
            telemetryParams.name = name
        }
        if (typeof scope === 'string' && scope.length > 0) {
            telemetryParams.scope = scope
        }

        const telemetryResponse = await mastraClient.getTelemetry(telemetryParams as Parameters<typeof mastraClient.getTelemetry>[0])

        // Transform telemetry data to component-expected format
        const telemetryResponseData = telemetryResponse as { telemetry?: unknown[]; total?: number }
        const telemetry = (telemetryResponseData?.telemetry ?? []).map((item: unknown) => {
            const itemData = item as {
                id?: string
                name?: string
                scope?: string
                startTime?: string
                endTime?: string
                duration?: number
                attributes?: Record<string, unknown>
            }
            return {
                id: itemData.id,
                name: itemData.name,
                scope: itemData.scope,
                startTime: itemData.startTime,
                endTime: itemData.endTime,
                duration: itemData.duration,
                attributes: itemData.attributes ?? {}
            }
        })

        return NextResponse.json({
            telemetry,
            total: telemetryResponseData?.total ?? telemetry.length,
            page,
            perPage
        })
    } catch (error) {
        // Log error for debugging
        // eslint-disable-next-line no-console
        console.error('Error fetching telemetry data:', error)
        return NextResponse.json(
            { error: 'Failed to fetch telemetry data' },
            { status: 500 }
        )
    }
}
