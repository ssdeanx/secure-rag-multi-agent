// TypeScript type definitions for Mastra client responses
// These types ensure type safety across the application when using Mastra APIs

// Logs API Types
export interface MastraLog {
    id: string
    level: 'debug' | 'info' | 'warn' | 'error'
    message: string
    timestamp: string
    metadata?: Record<string, unknown>
    transportId?: string
}

export interface MastraRunLog extends MastraLog {
    runId: string
}

export interface GetLogsParams {
    transportId?: string
}

export interface GetLogForRunParams {
    runId: string
    transportId?: string
}

// Use the actual return types from Mastra client
export type GetLogsResponse = unknown // Mastra client returns this type

// Telemetry API Types
export interface MastraTelemetryTrace {
    id: string
    name: string
    scope?: string
    startTime: string
    endTime?: string
    duration?: number
    attributes?: Record<string, unknown>
}

export interface GetTelemetryParams {
    name?: string
    scope?: string
    page?: number
    perPage?: number
    attribute?: Record<string, unknown>
}

export type GetTelemetryResponse = unknown // Mastra client returns this type

// Observability API Types
export interface AITrace {
    traceId: string
    name: string
    startTime: string
    endTime?: string
    spans: AISpan[]
    metadata?: Record<string, unknown>
}

export interface AISpan {
    spanId: string
    traceId: string
    parentSpanId?: string
    name: string
    type: string
    startTime: string
    endTime?: string
    input?: unknown
    output?: unknown
    attributes?: Record<string, unknown>
}

export interface AITraceFilters {
    name?: string
    spanType?: string
    entityId?: string
    entityType?: string
}

export interface PaginationParams {
    page?: number
    perPage?: number
    dateRange?: {
        start: Date
        end: Date
    }
}

export type GetAITracesResponse = unknown // Mastra client returns this type

export interface ScoreResponse {
    status: string
    message: string
}

export type GetScoresResponse = unknown // Mastra client returns this type

// Agent/Workflow/Tool Types
export type GetAgentResponse = unknown // Mastra client returns this type
export type GetWorkflowResponse = unknown // Mastra client returns this type
export type GetToolResponse = unknown // Mastra client returns this type

// Simplified types for our application use
export interface MastraAgent {
    id: string
    name: string
    description?: string
    status: 'active' | 'inactive' | 'error'
}

export interface MastraWorkflow {
    id: string
    name: string
    description?: string
    steps: Array<{
        id: string
        name: string
        type: string
    }>
}

export interface MastraTool {
    id: string
    name: string
    description?: string
    schema?: Record<string, unknown>
}

export interface MastraVector {
    id: string
    name: string
    dimensions: number
    count: number
}

// Error Types
export class MastraClientError extends Error {
    public statusCode?: number
    public details?: unknown

    constructor(message: string, cause?: unknown, statusCode?: number) {
        super(message)
        this.name = 'MastraClientError'
        this.cause = cause
        this.statusCode = statusCode
        if (cause instanceof Error) {
            this.details = cause.message
        } else {
            this.details = cause
        }
    }
}
