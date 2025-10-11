import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // TODO: Delete policy rule from database

        return NextResponse.json({
            message: 'Policy rule deleted successfully',
        })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete policy rule' },
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

        // TODO: Update policy rule in database

        return NextResponse.json({
            message: 'Policy rule updated successfully',
            rule: { id, ...body },
        })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update policy rule' },
            { status: 500 }
        )
    }
}
