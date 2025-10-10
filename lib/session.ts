import { createSupabaseServerClient, getSessionFromCookie } from '@/lib/auth'
import { cookies } from 'next/headers'
import type { Session } from '@supabase/supabase-js'

/**
 * Get the current user session from server context
 * Use this in server components, API routes, and server actions
 * @returns The session object with user data if valid, null otherwise
 */
export async function getServerSession(): Promise<Session | null> {
    try {
        const cookieStore = await cookies()
        const session = await getSessionFromCookie(cookieStore)

        if (!session) {
            return null
        }

        // Verify the session is still valid with Supabase
        const supabase = await createSupabaseServerClient()
        const { data: { session: validSession }, error } = await supabase.auth.getSession()

        if (error !== null || !validSession) {
            return null
        }

        return validSession
    } catch {
        return null
    }
}

/**
 * Require a valid session or throw an error
 * Use this to protect server components and API routes
 * @returns The session object
 * @throws Error if no valid session exists
 */
export async function requireServerSession(): Promise<Session> {
    const session = await getServerSession()

    if (!session) {
        throw new Error('Authentication required')
    }

    return session
}

/**
 * Get the Supabase access token from the current session
 * Use this when making authenticated API calls to the Mastra backend
 * @returns The access token if session is valid, null otherwise
 */
export async function getSupabaseAccessToken(): Promise<string | null> {
    const session = await getServerSession()
    return session?.access_token ?? null
}
