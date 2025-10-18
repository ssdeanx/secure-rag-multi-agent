import { NextResponse } from 'next/server'
import { mastraClient } from '@/lib/mastra/mastra-client'

/**
 * Get aggregated monitoring metrics from Mastra observability APIs.
 * Combines data from traces, agents, workflows, and system health.
 * Internal endpoint - calls local Mastra server observability APIs.
 * @see https://mastra.ai/en/reference/client-js/observability
 */
export async function GET() {
    try {
        // Get recent traces for query metrics (last 24 hours)
        const recentTraces = await mastraClient.getAITraces({
            pagination: { page: 1, perPage: 1000 }
        })

        // Get agent status
        const agentsResponse = await mastraClient.getAgents()
        const agentsData = (agentsResponse as { agents?: unknown[] } | null) ?? {}
        const activeAgents = (agentsData as { agents?: unknown[] }).agents?.length ?? 0

        // Get workflow status
        const workflowsResponse = await mastraClient.getWorkflows()
        const workflowsData = (workflowsResponse as { workflows?: unknown[] } | null) ?? {}
        const activeWorkflows = (workflowsData as { workflows?: unknown[] }).workflows?.length ?? 0

        // Filter traces to last 24 hours and calculate metrics
        const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000
        const tracesData = (recentTraces as { traces?: unknown[] } | null) ?? {}
        const traces = ((tracesData as { traces?: unknown[] }).traces ?? [])
            .filter((t: unknown) => {
                const trace = t as { startTime?: string | null; endTime?: string; spanType?: string; name?: string; status?: string }
                return typeof trace.startTime === 'string' && new Date(trace.startTime).getTime() > twentyFourHoursAgo
            })

        const totalQueries = traces.filter((t: unknown) => {
            const trace = t as { spanType?: string; name?: string }
            return trace.spanType === 'query' || (trace.name?.includes?.('query') ?? false)
        }).length

        const completedTraces = traces.filter((t: unknown) => {
            const trace = t as { endTime?: string | null }
            return typeof trace.endTime === 'string'
        })

        const failedTraces = traces.filter((t: unknown) => {
            const trace = t as { status?: string }
            return trace.status === 'error'
        })

        // Calculate response times
        const responseTimes = completedTraces
            .map((t: unknown) => {
                const trace = t as { endTime?: string; startTime?: string }
                if (typeof trace.endTime === 'string' && typeof trace.startTime === 'string') {
                    return new Date(trace.endTime).getTime() - new Date(trace.startTime).getTime()
                }
                return null
            })
            .filter((time: unknown): time is number => time !== null)

        const avgResponseTime = responseTimes.length > 0
            ? Math.round(responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length)
            : 0

        // Calculate success rate
        const successRate = traces.length > 0
            ? Math.round(((traces.length - failedTraces.length) / traces.length) * 100 * 10) / 10
            : 100

        // System health based on error rates and recent activity
        let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy'
        if (successRate < 95) {
            systemHealth = 'warning'
        }
        if (successRate < 90) {
            systemHealth = 'critical'
        }

        const metrics = {
            totalQueries,
            avgResponseTime,
            successRate,
            errorCount: failedTraces.length,
            activeAgents,
            activeWorkflows,
            systemHealth,
            lastUpdated: new Date().toISOString(),
            // Additional metrics from trace analysis
            totalTraces: traces.length,
            completedTraces: completedTraces.length,
            failedTraces: failedTraces.length,
            avgTraceDuration: responseTimes.length > 0 ? avgResponseTime : 0
        }

        return NextResponse.json(metrics)
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching metrics:', error)
        return NextResponse.json(
            { error: 'Failed to fetch metrics' },
            { status: 500 }
        )
    }
}
