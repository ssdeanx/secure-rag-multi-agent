import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

export async function GET() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/github`,
        },
    })

    if (error || !data.url) {
        return NextResponse.json(
            { error: 'Failed to initiate OAuth' },
            { status: 500 }
        )
    }

    return NextResponse.redirect(data.url)
}
