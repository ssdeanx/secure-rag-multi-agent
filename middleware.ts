import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware to handle Supabase session refresh
 * This ensures that the user's session is always up to date
 */
export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll().map(cookie => ({
                        name: cookie.name,
                        value: cookie.value,
                    }))
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                },
            },
        }
    )

    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession()

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
