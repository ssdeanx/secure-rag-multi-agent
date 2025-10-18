import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mastraClient } from '@/lib/mastra/mastra-client'

/**
 * Get workflow execution traces from Mastra observability API.
 * Internal endpoint - calls local Mastra server observability APIs.
 * @see https://mastra.ai/en/reference/client-js/observability
 */
export async function GET(request: NextRequest) {
    try {
        // Extract query parameters
        const { searchParams } = new URL(request.url)
        const workflowName = searchParams.get('workflow') ?? 'all'
        const status = searchParams.get('status') ?? 'all'
        const page = parseInt(searchParams.get('page') ?? '1')
        const perPage = parseInt(searchParams.get('perPage') ?? '20')

        // Call Mastra observability API for workflow traces
        const tracesResponse = await mastraClient.getAITraces({
            pagination: { page, perPage },
            filters: {
                spanType: 'workflow' as any, // Mastra span type for workflow executions
                ...(workflowName !== 'all' && { name: workflowName })
            }
        })

        // Transform Mastra trace data to component-expected format
        const traces = (tracesResponse as any)?.traces?.map((trace: any) => {
            const spans = trace.spans || []
            const completedSpans = spans.filter((span: any) => span.endTime)
            const progress = spans.length > 0 ? Math.round((completedSpans.length / spans.length) * 100) : 0

            return {
                id: trace.traceId,
                workflowName: trace.name || 'unknown',
                status: trace.endTime ? 'completed' :
                       trace.spans?.some((span: any) => !span.endTime) ? 'running' : 'failed',
                progress,
                startTime: trace.startTime,
                endTime: trace.endTime || null,
                duration: trace.endTime ?
                    new Date(trace.endTime).getTime() - new Date(trace.startTime).getTime() :
                    Date.now() - new Date(trace.startTime).getTime(),
                steps: spans.map((span: any) => ({
                    name: span.name || 'unknown',
                    status: span.endTime ? 'completed' :
                           span.status === 'error' ? 'failed' : 'running',
                    duration: span.endTime ?
                        new Date(span.endTime).getTime() - new Date(span.startTime).getTime() :
                        null
                }))
            }
        }) || []

        // Apply status filter
        let filtered = traces
        if (status !== 'all') {
            filtered = filtered.filter((trace: any) => trace.status === status)
        }

        return NextResponse.json({
            traces: filtered,
            total: (tracesResponse as any)?.total || filtered.length,
            page,
            perPage
        })
    } catch (error) {
        console.error('Error fetching workflow traces:', error)
        return NextResponse.json(
            { error: 'Failed to fetch workflow traces' },
            { status: 500 }
        )
    }
}
