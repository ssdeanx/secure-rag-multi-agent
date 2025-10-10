import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const agentName = searchParams.get('agent') ?? 'all'
        const status = searchParams.get('status') ?? 'all'

        // Mock agent logs
        // TODO: Replace with actual Mastra agent execution logs
        const logs = [
            {
                id: '1',
                agentName: 'orchestrator',
                operation: 'Route query',
                status: 'success' as const,
                duration: 234,
                timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
                input: { query: 'What is the expense policy?' },
                output: { intent: 'policy_query' },
            },
            {
                id: '2',
                agentName: 'security-analyzer',
                operation: 'Validate access',
                status: 'success' as const,
                duration: 156,
                timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
                input: { userId: '1', resource: 'finance-policy.md' },
                output: { allowed: true },
            },
        ]

        let filtered = logs
        if (agentName !== 'all') {
            filtered = filtered.filter((log) => log.agentName === agentName)
        }
        if (status !== 'all') {
            filtered = filtered.filter((log) => log.status === status)
        }

        return NextResponse.json({ logs: filtered })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch agent logs' },
            { status: 500 }
        )
    }
}
