import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Mock document chunks
        // TODO: Replace with actual vector store query
        const chunks = [
            {
                id: '1',
                text: 'All expense reports exceeding $500 require manager approval.',
                chunk_index: 0,
                score: 0.95,
            },
            {
                id: '2',
                text: 'Department budgets must be reviewed quarterly.',
                chunk_index: 1,
                score: 0.92,
            },
            {
                id: '3',
                text: 'Travel expenses require pre-authorization for amounts over $1000.',
                chunk_index: 2,
                score: 0.89,
            },
        ]

        return NextResponse.json({ chunks })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch document chunks' },
            { status: 500 }
        )
    }
}
