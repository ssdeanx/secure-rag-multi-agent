import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')

    if (!code) {
        redirect('/login?error=missing_code')
    }

    try {
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Failed to exchange code:', error)
            redirect('/login?error=auth_failed')
        }

        redirect('/')
    } catch (error) {
        console.error('OAuth callback error:', error)
        redirect('/login?error=auth_failed')
    }
}
