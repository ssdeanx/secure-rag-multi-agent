import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * GET /api/auth/callback/github
 * Handles GitHub OAuth callback, exchanges code for token, and creates session
 */
export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const oauthError = url.searchParams.get('error')

    // Handle OAuth errors
    if (oauthError !== null) {
        console.error('GitHub OAuth error:', oauthError)
        redirect('/login?error=oauth_error')
    }

    if (!code || !state) {
        console.error('Missing code or state in OAuth callback')
        redirect('/login?error=missing_params')
    }

    // Verify state parameter for CSRF protection
    const cookieStore = await cookies()
    const storedState = cookieStore.get('oauth_state')?.value

    if (state !== storedState) {
        console.error('State mismatch in OAuth callback')
        redirect('/login?error=invalid_state')
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch(
            'https://github.com/login/oauth/access_token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
                    redirect_uri:
                        'http://localhost:3000/api/auth/callback/github',
                }),
            }
        )

        if (!tokenResponse.ok) {
            throw new Error(`Token exchange failed: ${tokenResponse.status}`)
        }

        const tokenData = await tokenResponse.json()

        if ('error' in tokenData) {
            throw new Error(`Token exchange error: ${tokenData.error}`)
        }

        // For demo purposes, we'll generate a demo token based on GitHub info
        // In a real application, you would use the user data for proper authentication
        const { generateDemoJWT } = await import('@/lib/actions/auth')
        const demoToken = await generateDemoJWT('engineering') // Default role for OAuth users

        // Set session cookie
        cookieStore.set('demo_jwt', demoToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        // Clean up OAuth state cookie
        cookieStore.set('oauth_state', '', {
            httpOnly: true,
            path: '/',
            maxAge: 0,
        })

        // Redirect to home page
        redirect('/')
    } catch (error) {
        console.error('OAuth callback error:', error)
        redirect('/login?error=auth_failed')
    }
}
