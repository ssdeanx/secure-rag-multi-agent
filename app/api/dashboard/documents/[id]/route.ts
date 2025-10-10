import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Mock document details
        // TODO: Replace with actual database query
        const document = {
            id,
            filename: 'finance-policy.md',
            title: 'Finance Policy',
            classification: 'internal',
            indexed_at: new Date('2024-01-15').toISOString(),
            chunk_count: 45,
            status: 'indexed',
            size: 15234,
            hash: 'abc123def456',
            metadata: {
                author: 'Finance Team',
                version: '2.1',
                department: 'Finance',
            },
        }

        return NextResponse.json(document)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch document details' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // TODO: Delete document from database and vector store

        return NextResponse.json({
            message: 'Document deleted successfully',
        })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete document' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()

        // TODO: Update document classification
        
        return NextResponse.json({
            message: 'Document updated successfully',
            document: { id, ...body },
        })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update document' },
            { status: 500 }
        )
    }
}
