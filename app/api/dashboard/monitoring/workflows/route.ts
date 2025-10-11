import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const workflowName = searchParams.get('workflow') ?? 'all'
        const status = searchParams.get('status') ?? 'all'

        // Mock workflow traces
        // TODO: Replace with actual Mastra workflow execution traces
        const traces = [
            {
                id: '1',
                workflowName: 'governed-rag-query',
                status: 'completed' as const,
                progress: 100,
                startTime: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
                endTime: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
                duration: 2345,
                steps: [
                    { name: 'security-check', status: 'completed', duration: 234 },
                    { name: 'query-routing', status: 'completed', duration: 345 },
                    { name: 'retrieval', status: 'completed', duration: 1234 },
                    { name: 'answer-generation', status: 'completed', duration: 532 },
                ],
            },
            {
                id: '2',
                workflowName: 'governed-rag-index',
                status: 'running' as const,
                progress: 67,
                startTime: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
                steps: [
                    { name: 'file-parsing', status: 'completed', duration: 1234 },
                    { name: 'classification', status: 'completed', duration: 876 },
                    { name: 'embedding', status: 'running', duration: null },
                    { name: 'storage', status: 'pending', duration: null },
                ],
            },
        ]

        let filtered = traces
        if (workflowName !== 'all') {
            filtered = filtered.filter((trace) => trace.workflowName === workflowName)
        }
        if (status !== 'all') {
            filtered = filtered.filter((trace) => trace.status === status)
        }

        return NextResponse.json({ traces: filtered })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch workflow traces' },
            { status: 500 }
        )
    }
}
