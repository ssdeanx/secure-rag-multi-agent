import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mastraClient } from '@/lib/mastra/mastra-client'

/**
 * Get system logs from Mastra observability API.
 * Provides access to application logs and error tracking.
 * Internal endpoint - calls local Mastra server observability APIs.
 * @see https://mastra.ai/en/reference/client-js/logs
 */
export async function GET(request: NextRequest) {
    try {
        // Extract query parameters
        const { searchParams } = new URL(request.url)
        const transportId = searchParams.get('transportId')
        const level = searchParams.get('level')
        const page = parseInt(searchParams.get('page') ?? '1')
        const perPage = parseInt(searchParams.get('perPage') ?? '50')

        // Call Mastra logs API (no pagination support in current API)
        const logsResponse = transportId !== null && transportId !== undefined && transportId !== ''
            ? await mastraClient.getLogs({ transportId })
            : (await mastraClient.getLogs({ transportId: '' })) as unknown

        // Transform logs data to component-expected format and filter by level if specified
        const logsResponseData = logsResponse as { logs?: unknown[]; total?: number }
        let logs = (logsResponseData?.logs ?? []).map((item: unknown) => {
            const itemData = item as {
                id?: string
                level?: string
                message?: string
                timestamp?: string
                metadata?: Record<string, unknown>
                transportId?: string
            }
            return {
                id: itemData.id,
                level: itemData.level,
                message: itemData.message,
                timestamp: itemData.timestamp,
                metadata: itemData.metadata ?? {},
                transportId: itemData.transportId
            }
        })

        // Filter by level if specified
        if (level !== null && level !== undefined && level !== 'all') {
            logs = logs.filter((log: { level?: string }) => log.level === level)
        }

        // Apply pagination to results
        const startIndex = (page - 1) * perPage
        const endIndex = startIndex + perPage
        const paginatedLogs = logs.slice(startIndex, endIndex)

        return NextResponse.json({
            logs: paginatedLogs,
            total: logs.length,
            page,
            perPage
        })
    } catch (error) {
        // Log error for debugging
        // eslint-disable-next-line no-console
        console.error('Error fetching logs:', error)
        return NextResponse.json(
            { error: 'Failed to fetch logs' },
            { status: 500 }
        )
    }
}
