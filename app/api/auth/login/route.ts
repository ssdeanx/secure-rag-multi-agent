import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ session: data.session }, { status: 200 })
}
