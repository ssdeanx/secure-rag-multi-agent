import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const role = searchParams.get('role') || 'all'
        const status = searchParams.get('status') || 'all'

        // Mock users
        // TODO: Replace with actual database query
        const allUsers = [
            {
                id: '1',
                name: 'John Doe',
                email: 'john.doe@example.com',
                role: 'admin' as const,
                status: 'active' as const,
                lastLogin: new Date().toISOString(),
                createdAt: new Date('2024-01-01').toISOString(),
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                role: 'dept_admin' as const,
                status: 'active' as const,
                lastLogin: new Date(
                    Date.now() - 1000 * 60 * 60 * 2
                ).toISOString(),
                createdAt: new Date('2024-01-15').toISOString(),
            },
            {
                id: '3',
                name: 'Bob Wilson',
                email: 'bob.wilson@example.com',
                role: 'employee' as const,
                status: 'suspended' as const,
                lastLogin: new Date(
                    Date.now() - 1000 * 60 * 60 * 48
                ).toISOString(),
                createdAt: new Date('2024-02-01').toISOString(),
            },
        ]

        let filtered = allUsers
        if (search) {
            filtered = filtered.filter(
                (user) =>
                    user.name.toLowerCase().includes(search.toLowerCase()) ||
                    user.email.toLowerCase().includes(search.toLowerCase())
            )
        }
        if (role !== 'all') {
            filtered = filtered.filter((user) => user.role === role)
        }
        if (status !== 'all') {
            filtered = filtered.filter((user) => user.status === status)
        }

        return NextResponse.json(filtered)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        )
    }
}
