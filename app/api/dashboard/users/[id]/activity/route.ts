import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Mock activity log
        // TODO: Replace with actual database query
        const activities = [
            {
                id: '1',
                userId: id,
                eventType: 'login' as const,
                description: 'User logged in',
                timestamp: new Date().toISOString(),
                metadata: { ip: '192.168.1.100' },
            },
            {
                id: '2',
                userId: id,
                eventType: 'query' as const,
                description: 'Searched for "expense policy"',
                timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
                metadata: { query: 'expense policy' },
            },
            {
                id: '3',
                userId: id,
                eventType: 'document_access' as const,
                description: 'Accessed finance-policy.md',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                metadata: { documentId: '1' },
            },
        ]

        return NextResponse.json({ activities })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch activity log' },
            { status: 500 }
        )
    }
}
