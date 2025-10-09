import type { NextRequest } from 'next/server'

/**
 * GET /api/auth/github
 * Initiates GitHub OAuth login flow by redirecting to GitHub
 */
export async function GET(req: NextRequest) {
    const clientId = process.env.GITHUB_CLIENT_ID
    if (!clientId) {
        return new Response(
            JSON.stringify({ error: 'GitHub OAuth not configured' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }

    const redirectUri = 'http://localhost:3000/api/auth/callback/github'
    const scope = 'read:user,user:email'
    const state = crypto.randomUUID() // Generate a random state for CSRF protection

    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize')
    githubAuthUrl.searchParams.set('client_id', clientId)
    githubAuthUrl.searchParams.set('redirect_uri', redirectUri)
    githubAuthUrl.searchParams.set('scope', scope)
    githubAuthUrl.searchParams.set('state', state)

    // Store state in a cookie for verification later
    const response = new Response(null, { status: 302 })
    response.headers.set('Location', githubAuthUrl.toString())
    response.headers.set(
        'Set-Cookie',
        `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`
    )

    return response
}
