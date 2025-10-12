import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

export async function GET() {
    const {
        data: { session },
        error,
    } = await supabase.auth.getSession()

    if (error || !session) {
        return NextResponse.json({ session: null }, { status: 200 })
    }

    return NextResponse.json({ session }, { status: 200 })
}
