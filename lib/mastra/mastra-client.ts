import { MastraClient } from '@mastra/client-js'
import type {
    GetLogsParams,
    GetLogForRunParams,
    GetTelemetryParams,
    PaginationParams,
} from './types'
import { MastraClientError } from './types'

export function getMastraBaseUrl(): string {
    return (
        process.env.MASTRA_URL ??
        process.env.NEXT_PUBLIC_MASTRA_URL ??
        'http://localhost:4111'
    )
}

export async function createAuthenticatedMastraClient(): Promise<MastraClient | null> {
    const response = await fetch('/api/auth/session')
    const data: { session?: { access_token?: string } } = await response.json()

    const accessToken = data.session?.access_token ?? ''
    if (accessToken === '') {
        return null
    }

    return new MastraClient({
        baseUrl: getMastraBaseUrl(),
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
}

/**
 * Create a server-side authenticated Mastra client for use in API routes.
 * @param token - JWT token for authentication
 * @returns Authenticated MastraClient instance
 * @see https://mastra.ai/en/reference/client-js/mastra-client
 */
export function createServerMastraClient(token: string): MastraClient {
    return new MastraClient({
        baseUrl: getMastraBaseUrl(),
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const mastraClient = new MastraClient({
    baseUrl: getMastraBaseUrl(),
})

// Logs API wrapper methods
// @see https://mastra.ai/en/reference/client-js/logs

/**
 * Fetch system logs from Mastra.
 * @param params - Optional parameters for filtering logs
 * @returns Logs response from Mastra
 * @throws MastraClientError if the request fails
 */
export async function getLogs(params?: GetLogsParams): Promise<unknown> {
    try {
        const client = await createAuthenticatedMastraClient()
        if (!client) {
            throw new Error('Failed to create authenticated client')
        }
        // Ensure transportId is always a string for the upstream client type.
        const safeParams = params
            ? { ...params, transportId: params.transportId ?? '' }
            : {}
        return await client.getLogs(safeParams as Parameters<typeof client.getLogs>[0])
    } catch (error) {
        throw new MastraClientError('Failed to fetch logs', error)
    }
}

/**
 * Fetch logs for a specific run.
 * @param params - Parameters including runId and optional transportId
 * @returns Run logs response from Mastra
 * @throws MastraClientError if the request fails
 */
export async function getLogForRun(params: GetLogForRunParams): Promise<unknown> {
    try {
        const client = await createAuthenticatedMastraClient()
        if (!client) {
            throw new Error('Failed to create authenticated client')
        }
        // Ensure transportId is always a string for the upstream client type.
        const safeParams = { ...params, transportId: params.transportId ?? '' }
        return await client.getLogForRun(safeParams as Parameters<typeof client.getLogForRun>[0])
    } catch (error) {
        throw new MastraClientError('Failed to fetch run logs', error)
    }
}

// Telemetry API wrapper methods
// @see https://mastra.ai/en/reference/client-js/telemetry

/**
 * Retrieve telemetry traces with optional filters and pagination.
 * @param params - Optional parameters for filtering and pagination
 * @returns Telemetry response from Mastra
 * @throws MastraClientError if the request fails
 */
export async function getTelemetry(params?: GetTelemetryParams): Promise<unknown> {
    try {
        const client = await createAuthenticatedMastraClient()
        if (!client) {
            throw new Error('Failed to create authenticated client')
        }
        // Convert unknown type attribute values to strings for Mastra client compatibility
        if (params?.attribute) {
            const stringAttributes: Record<string, string> = {}
            for (const [key, value] of Object.entries(params.attribute)) {
                stringAttributes[key] = String(value)
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return await client.getTelemetry({ ...params, attribute: stringAttributes } as any)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return await client.getTelemetry(params as any)
    } catch (error) {
        throw new MastraClientError('Failed to fetch telemetry', error)
    }
}

// Observability API wrapper methods
// @see https://mastra.ai/en/reference/client-js/observability

/**
 * Get a specific AI trace by ID.
 * @param traceId - The ID of the trace to retrieve
 * @returns AI trace data
 * @throws MastraClientError if the request fails
 */
export async function getAITrace(traceId: string): Promise<unknown> {
    try {
        const client = await createAuthenticatedMastraClient()
        if (!client) {
            throw new Error('Failed to create authenticated client')
        }
        return await client.getAITrace(traceId)
    } catch (error) {
        throw new MastraClientError('Failed to fetch AI trace', error)
    }
}

/**
 * Get paginated AI traces with optional filters.
 * @param options - Pagination and filter options
 * @returns AI traces response from Mastra
 * @throws MastraClientError if the request fails
 */
export async function getAITraces(options: {
    pagination?: PaginationParams
    filters?: { name?: string; spanType?: string; entityId?: string; entityType?: 'agent' | 'workflow' }
}): Promise<unknown> {
    try {
        const client = await createAuthenticatedMastraClient()
        if (!client) {
            throw new Error('Failed to create authenticated client')
        }
        // Build safe params that match Mastra client signature
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const safeOptions: any = {}
        if (options.pagination) {
            safeOptions.page = options.pagination.page
            safeOptions.perPage = options.pagination.perPage
        }
        if (options.filters) {
            if (typeof options.filters.name === 'string' && options.filters.name.length > 0) {
                safeOptions.name = options.filters.name
            }
            if (typeof options.filters.spanType === 'string' && options.filters.spanType.length > 0) {
                safeOptions.spanType = options.filters.spanType
            }
            if (typeof options.filters.entityId === 'string' && options.filters.entityId.length > 0) {
                safeOptions.entityId = options.filters.entityId
            }
            if (options.filters.entityType) {
                safeOptions.entityType = options.filters.entityType
            }
        }
        return await client.getAITraces(safeOptions)
    } catch (error) {
        throw new MastraClientError('Failed to fetch AI traces', error)
    }
}

/**
 * Run scorers on specified traces and spans.
 * @param params - Scorer name and target traces/spans
 * @returns Scoring response from Mastra
 * @throws MastraClientError if the request fails
 */
export async function score(params: {
    scorerName: string
    targets: Array<{ traceId: string; spanId?: string }>
}): Promise<unknown> {
    try {
        const client = await createAuthenticatedMastraClient()
        if (!client) {
            throw new Error('Failed to create authenticated client')
        }
        return await client.score(params)
    } catch (error) {
        throw new MastraClientError('Failed to run scorer', error)
    }
}

/**
 * Get scores for a specific span.
 * @param params - Trace ID, span ID, and pagination options
 * @returns Scores response from Mastra
 * @throws MastraClientError if the request fails
 */
export async function getScoresBySpan(params: {
    traceId: string
    spanId: string
    page?: number
    perPage?: number
}): Promise<unknown> {
    try {
        const client = await createAuthenticatedMastraClient()
        if (!client) {
            throw new Error('Failed to create authenticated client')
        }
        return await client.getScoresBySpan(params)
    } catch (error) {
        throw new MastraClientError('Failed to fetch span scores', error)
    }
}

// Agents API wrapper methods
// @see https://mastra.ai/en/reference/client-js/agents

/**
 * List all available agents.
 * @returns Agents response from Mastra
 * @throws MastraClientError if the request fails
 */
export async function getAgents(): Promise<unknown> {
    try {
        const client = await createAuthenticatedMastraClient()
        if (!client) {
            throw new Error('Failed to create authenticated client')
        }
        return await client.getAgents()
    } catch (error) {
        throw new MastraClientError('Failed to fetch agents', error)
    }
}

/**
 * Get details for a specific agent.
 * @param agentId - The ID of the agent to retrieve
 * @returns Agent details from Mastra
 * @throws MastraClientError if the request fails
 */
export async function getAgent(agentId: string): Promise<unknown> {
    try {
        const client = await createAuthenticatedMastraClient()
        if (!client) {
            throw new Error('Failed to create authenticated client')
        }
        return await client.getAgent(agentId)
    } catch (error) {
        throw new MastraClientError('Failed to fetch agent', error)
    }
}

// Workflows API wrapper methods
// @see https://mastra.ai/en/reference/client-js/workflows

/**
 * List all available workflows.
 * @returns Workflows response from Mastra
 * @throws MastraClientError if the request fails
 */
export async function getWorkflows(): Promise<unknown> {
    try {
        const client = await createAuthenticatedMastraClient()
        if (!client) {
            throw new Error('Failed to create authenticated client')
        }
        return await client.getWorkflows()
    } catch (error) {
        throw new MastraClientError('Failed to fetch workflows', error)
    }
}

/**
 * Get details for a specific workflow.
 * @param workflowId - The ID of the workflow to retrieve
 * @returns Workflow details from Mastra
 * @throws MastraClientError if the request fails
 */
export async function getWorkflow(workflowId: string): Promise<unknown> {
    try {
        const client = await createAuthenticatedMastraClient()
        if (!client) {
            throw new Error('Failed to create authenticated client')
        }
        return await client.getWorkflow(workflowId)
    } catch (error) {
        throw new MastraClientError('Failed to fetch workflow', error)
    }
}

// Tools API wrapper methods
// @see https://mastra.ai/en/reference/client-js/tools

/**
 * List all available tools.
 * @returns Tools response from Mastra
 * @throws MastraClientError if the request fails
 */
export async function getTools(): Promise<unknown> {
    try {
        const client = await createAuthenticatedMastraClient()
        if (!client) {
            throw new Error('Failed to create authenticated client')
        }
        return await client.getTools()
    } catch (error) {
        throw new MastraClientError('Failed to fetch tools', error)
    }
}

// Vectors API wrapper methods
// @see https://mastra.ai/en/reference/client-js/vectors

/**
 * List all available vector stores.
 * @returns Vector stores response from Mastra
 * @throws MastraClientError if the request fails
 */
export async function getVectors(): Promise<unknown> {
    try {
        const client = await createAuthenticatedMastraClient()
        if (!client) {
            throw new Error('Failed to create authenticated client')
        }
        // Note: getVector method may require parameters in current Mastra version
        // This is a placeholder until the API is clarified
        return await client.getVector('default')
    } catch (error) {
        throw new MastraClientError('Failed to fetch vectors', error)
    }
}
