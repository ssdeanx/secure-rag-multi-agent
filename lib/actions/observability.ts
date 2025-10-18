'use server'

import { createServerMastraClient } from '@/lib/mastra/mastra-client'
import { cookies } from 'next/headers'

/**
 * Get observability data from Mastra.
 * @param type - Type of data to retrieve ('logs', 'telemetry', 'traces', 'scores')
 * @param params - Parameters for the request
 * @returns Observability data or error response
 */
export async function getObservabilityData(
    type: 'logs' | 'telemetry' | 'traces' | 'scores',
    params: Record<string, unknown> = {}
) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        if (typeof token !== 'string' || token.length === 0) {
            return { success: false, error: 'No authentication token found' }
        }

        const client = createServerMastraClient(token)

        let data: unknown
        switch (type) {
            case 'logs':
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data = await (client as any).getLogs(params)
                break
            case 'telemetry':
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data = await (client as any).getTelemetry(params)
                break
            case 'traces':
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data = await (client as any).getAITraces(params)
                break
            case 'scores':
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data = await (client as any).getScoresBySpan(params)
                break
            default:
                return { success: false, error: 'Invalid data type requested' }
        }

        return { success: true, data }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        return {
            success: false,
            error: errorMessage
        }
    }
}

/**
 * Score traces using a specified scorer.
 * @param scorerName - Name of the scorer to use
 * @param targets - Array of trace targets to score
 * @returns Scoring results or error response
 */
export async function scoreTraces(
    scorerName: string,
    targets: Array<{ traceId: string; spanId?: string }>
) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        if (typeof token !== 'string' || token.length === 0) {
            return { success: false, error: 'No authentication token found' }
        }

        const client = createServerMastraClient(token)
        const result = await client.score({ scorerName, targets })

        return { success: true, data: result }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        return {
            success: false,
            error: errorMessage
        }
    }
}
