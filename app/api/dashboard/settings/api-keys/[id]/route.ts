import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // TODO: Delete API key from database

        return NextResponse.json({
            message: 'API key revoked successfully',
        })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to revoke API key' },
            { status: 500 }
        )
    }
}
