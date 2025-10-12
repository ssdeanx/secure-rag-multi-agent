'use client'

import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'

/**
 * Hook to fetch and manage the current user session
 *
 * This hook fetches the session from the /api/auth/session endpoint
 * and provides the session data along with loading and error states.
 *
 * @returns Session data, loading state, and error state
 */
export function useSession() {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        async function fetchSession() {
            try {
                setLoading(true)
                const response = await fetch('/api/auth/session')

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch session: ${response.statusText}`
                    )
                }

                const data = await response.json()

                if (data.session) {
                    setSession(data.session)
                } else {
                    setSession(null)
                }
            } catch (err) {
                setError(
                    err instanceof Error ? err : new Error('Unknown error')
                )
                setSession(null)
            } finally {
                setLoading(false)
            }
        }

        fetchSession()
    }, [])

    return { session, loading, error }
}
