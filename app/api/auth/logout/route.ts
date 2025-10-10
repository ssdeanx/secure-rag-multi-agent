import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

export async function POST() {
    await supabase.auth.signOut()
    return NextResponse.json({ success: true }, { status: 200 })
}
