import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        // Mock models configuration
        // TODO: Replace with actual database query
        const models = [
            {
                id: 'gemini-2.0-flash-exp',
                name: 'Gemini 2.0 Flash',
                provider: 'Google',
                enabled: true,
                temperature: 0.7,
                maxTokens: 2048,
            },
            {
                id: 'gpt-4-turbo',
                name: 'GPT-4 Turbo',
                provider: 'OpenAI',
                enabled: false,
                temperature: 0.8,
                maxTokens: 4096,
            },
        ]

        return NextResponse.json(models)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch models' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json()

        // TODO: Validate input with Zod schema
        // TODO: Update database

        return NextResponse.json({
            message: 'Model configuration updated successfully',
            model: body,
        })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update model configuration' },
            { status: 500 }
        )
    }
}
