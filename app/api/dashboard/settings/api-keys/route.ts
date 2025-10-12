import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function GET(request: NextRequest) {
    try {
        // Mock API keys
        // TODO: Replace with actual database query
        const apiKeys = [
            {
                id: '1',
                name: 'Production Key',
                key: 'mra_prod_****************************',
                createdAt: new Date('2024-01-15').toISOString(),
                lastUsed: new Date().toISOString(),
                status: 'active' as const,
            },
            {
                id: '2',
                name: 'Development Key',
                key: 'mra_dev_*****************************',
                createdAt: new Date('2024-02-01').toISOString(),
                lastUsed: new Date(
                    Date.now() - 1000 * 60 * 60 * 24 * 3
                ).toISOString(),
                status: 'active' as const,
            },
        ]

        return NextResponse.json(apiKeys)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch API keys' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name } = body

        // Generate new API key
        const key = `mra_${randomBytes(32).toString('hex')}`

        const newKey = {
            id: Date.now().toString(),
            name,
            key,
            createdAt: new Date().toISOString(),
            lastUsed: null,
            status: 'active' as const,
        }

        // TODO: Save to database

        return NextResponse.json(newKey, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create API key' },
            { status: 500 }
        )
    }
}
