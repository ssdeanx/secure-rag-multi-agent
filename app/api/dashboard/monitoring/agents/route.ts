import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mastraClient } from '@/lib/mastra/mastra-client'

/**
 * Get agent execution logs from Mastra observability API.
 * Internal endpoint - calls local Mastra server observability APIs.
 * @see https://mastra.ai/en/reference/client-js/observability
 */
export async function GET(request: NextRequest) {
    try {
        // Extract query parameters
        const { searchParams } = new URL(request.url)
        const agentName = searchParams.get('agent') ?? 'all'
        const status = searchParams.get('status') ?? 'all'
        const page = parseInt(searchParams.get('page') ?? '1')
        const perPage = parseInt(searchParams.get('perPage') ?? '20')

        // Call Mastra observability API for agent traces
        const tracesResponse = await mastraClient.getAITraces({
            pagination: { page, perPage },
            filters: {
                spanType: 'agent' as any, // Mastra span type for agent executions
                ...(agentName !== 'all' && { name: agentName })
            }
        })

        // Transform Mastra trace data to component-expected format
        const logs = (tracesResponse as any)?.traces?.map((trace: any) => ({
            id: trace.traceId,
            agentName: trace.name || 'unknown',
            operation: trace.spans?.[0]?.name || 'unknown',
            status: trace.spans?.[0]?.status === 'error' ? 'error' :
                   trace.spans?.[0]?.status === 'completed' ? 'success' : 'running',
            duration: trace.endTime ?
                new Date(trace.endTime).getTime() - new Date(trace.startTime).getTime() :
                Date.now() - new Date(trace.startTime).getTime(),
            timestamp: trace.startTime,
            input: trace.spans?.[0]?.input || {},
            output: trace.spans?.[0]?.output || {}
        })) || []

        // Apply status filter
        let filtered = logs
        if (status !== 'all') {
            filtered = filtered.filter((log: any) => log.status === status)
        }

        return NextResponse.json({
            logs: filtered,
            total: (tracesResponse as any)?.total || filtered.length,
            page,
            perPage
        })
    } catch (error) {
        console.error('Error fetching agent logs:', error)
        return NextResponse.json(
            { error: 'Failed to fetch agent logs' },
            { status: 500 }
        )
    }
}
