import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const classification = searchParams.get('classification') || 'all'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')

        // Mock documents
        // TODO: Replace with actual database query from Qdrant/PostgreSQL
        const allDocuments = [
            {
                id: '1',
                filename: 'finance-policy.md',
                title: 'Finance Policy',
                classification: 'internal' as const,
                indexed_at: new Date('2024-01-15').toISOString(),
                chunk_count: 45,
                status: 'indexed' as const,
            },
            {
                id: '2',
                filename: 'hr-confidential.md',
                title: 'HR Confidential',
                classification: 'confidential' as const,
                indexed_at: new Date('2024-01-16').toISOString(),
                chunk_count: 67,
                status: 'indexed' as const,
            },
            {
                id: '3',
                filename: 'engineering-handbook.md',
                title: 'Engineering Handbook',
                classification: 'public' as const,
                indexed_at: new Date('2024-01-17').toISOString(),
                chunk_count: 123,
                status: 'indexed' as const,
            },
        ]

        let filtered = allDocuments
        if (search) {
            filtered = filtered.filter(
                (doc) =>
                    doc.filename.toLowerCase().includes(search.toLowerCase()) ||
                    doc.title.toLowerCase().includes(search.toLowerCase())
            )
        }
        if (classification !== 'all') {
            filtered = filtered.filter((doc) => doc.classification === classification)
        }

        const total = filtered.length
        const start = (page - 1) * limit
        const documents = filtered.slice(start, start + limit)

        return NextResponse.json({
            documents,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch documents' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const classification = formData.get('classification') as string

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // TODO: Save file, index with Mastra workflow
        
        const newDocument = {
            id: Date.now().toString(),
            filename: file.name,
            title: file.name.replace(/\.[^/.]+$/, ''),
            classification,
            indexed_at: new Date().toISOString(),
            chunk_count: 0,
            status: 'processing' as const,
        }

        return NextResponse.json(newDocument, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to upload document' },
            { status: 500 }
        )
    }
}
