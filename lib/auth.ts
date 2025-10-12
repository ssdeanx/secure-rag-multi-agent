import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Session } from '@supabase/supabase-js'

const SUPABASE_URL =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY =
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ''

/**
 * Create a Supabase client for server-side use (API routes, server components, server actions)
 * Uses cookies for session management
 */
export async function createSupabaseServerClient() {
    const cookieStore = await cookies()

    return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
            getAll() {
                return cookieStore.getAll().map((cookie) => ({
                    name: cookie.name,
                    value: cookie.value,
                }))
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    cookieStore.set({ name, value, ...options })
                })
            },
        },
    })
}

/**
 * Set session cookie from a Supabase session
 * @param cookieStore - Next.js cookies store
 * @param session - Supabase session object
 */
export async function setSessionCookie(
    cookieStore: Awaited<ReturnType<typeof cookies>>,
    session: Session
) {
    const maxAge = 60 * 60 * 24 * 7 // 7 days

    cookieStore.set('sb-access-token', session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge,
        path: '/',
    })

    cookieStore.set('sb-refresh-token', session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge,
        path: '/',
    })
}

/**
 * Clear session cookies
 * @param cookieStore - Next.js cookies store
 */
export async function clearSessionCookie(
    cookieStore: Awaited<ReturnType<typeof cookies>>
) {
    cookieStore.delete('sb-access-token')
    cookieStore.delete('sb-refresh-token')
}

/**
 * Get session from cookie store
 * @param cookieStore - Next.js cookies store
 * @returns Session object or null
 */
export async function getSessionFromCookie(
    cookieStore: Awaited<ReturnType<typeof cookies>>
): Promise<Session | null> {
    const accessToken = cookieStore.get('sb-access-token')?.value ?? ''
    const refreshToken = cookieStore.get('sb-refresh-token')?.value ?? ''

    if (accessToken === '' || refreshToken === '') {
        return null
    }

    // Create a minimal session object
    // The actual validation will happen in the session.ts getServerSession function
    return {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 0,
        expires_at: 0,
        token_type: 'bearer',
        user: null as unknown as Session['user'], // Will be populated by getServerSession
    }
}

/**
 * Legacy function for backward compatibility with backend services
 * Get a Supabase auth token by signing in with email/password
 * This is used by backend services that need to authenticate with Supabase
 */
export async function getSupabaseAuthToken(): Promise<string | undefined> {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    const authTokenResponse = await supabase.auth.signInWithPassword({
        email: process.env.USER_EMAIL ?? '',
        password: process.env.USER_PASSWORD ?? '',
    })

    if (authTokenResponse.error) {
        return undefined
    }

    return authTokenResponse.data.session?.access_token
}
