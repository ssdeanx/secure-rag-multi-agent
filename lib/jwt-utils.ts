import { SignJWT } from 'jose'

const DEFAULT = 60
interface TokenClaims {
    sub: string
    roles: string[]
    tenant: string
    stepUp?: boolean
}

export async function generateDemoToken(claims: TokenClaims): Promise<string> {
    const secret: Uint8Array = new TextEncoder().encode(
        process.env.JWT_SECRET ??
            process.env.NEXT_PUBLIC_JWT_SECRET ??
            'dev-secret'
    )

    const jwt: string = await new SignJWT({
        ...claims,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 2 * DEFAULT * 60, // 2 hours
    })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secret)

    return jwt
}

export const DEMO_TOKENS = {
    finance: async () =>
        generateDemoToken({
            sub: 'finance.user@acme.com',
            roles: ['finance.viewer'],
            tenant: 'acme',
        }),
    engineering: async () =>
        generateDemoToken({
            sub: 'eng.admin@acme.com',
            roles: ['engineering.admin'],
            tenant: 'acme',
        }),
    hr: async () =>
        generateDemoToken({
            sub: 'hr.admin@acme.com',
            roles: ['hr.admin'],
            tenant: 'acme',
            stepUp: true,
        }),
    executive: async () =>
        generateDemoToken({
            sub: 'executive@acme.com',
            roles: ['finance.admin', 'engineering.viewer', 'hr.viewer'],
            tenant: 'acme',
        }),
}
