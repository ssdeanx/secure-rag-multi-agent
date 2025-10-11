import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        // Mock policy rules
        // TODO: Replace with actual database query
        const rules = [
            {
                id: '1',
                name: 'Admin Full Access',
                resource: 'documents',
                actions: ['read', 'write', 'delete'],
                roles: ['admin'],
                effect: 'allow' as const,
                priority: 100,
            },
            {
                id: '2',
                name: 'Department Admin Access',
                resource: 'documents',
                actions: ['read', 'write'],
                roles: ['dept_admin'],
                effect: 'allow' as const,
                priority: 90,
            },
            {
                id: '3',
                name: 'Employee Read Access',
                resource: 'documents',
                actions: ['read'],
                roles: ['employee'],
                effect: 'allow' as const,
                priority: 50,
            },
        ]

        return NextResponse.json({ rules })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch policy rules' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const newRule = {
            id: Date.now().toString(),
            ...body,
            createdAt: new Date().toISOString(),
        }

        // TODO: Save to database

        return NextResponse.json(newRule, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create policy rule' },
            { status: 500 }
        )
    }
}
