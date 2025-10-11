import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, role } = body

        // TODO: Send invitation email
        // TODO: Create pending user record

        const invitation = {
            id: Date.now().toString(),
            email,
            role,
            status: 'sent' as const,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days
            createdAt: new Date().toISOString(),
        }

        return NextResponse.json(invitation, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to send invitation' },
            { status: 500 }
        )
    }
}
