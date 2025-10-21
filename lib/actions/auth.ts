'use server'

/**
 * DEMO JWT GENERATION - FOR RBAC DEMONSTRATION ONLY
 *
 * This file generates demo JWTs for testing role-based access control.
 * It is NOT used for actual user authentication.
 *
 * Real user authentication uses Supabase (see /lib/auth.ts)
 *
 * Used by:
 * - /src/mastra/tools/jwt-auth.tool.ts (backend RBAC validation)
 * - /app/protected/demo-rag/page.tsx (demo UI for testing RBAC)
 */

import { SignJWT } from 'jose'

export async function generateDemoJWTForRBAC(roleId: string) {
    const secret = new TextEncoder().encode(
        process.env.JWT_SECRET ?? 'dev-secret'
    )

    const roleMap = {
        finance: { roles: ['finance.viewer'], stepUp: false },
        engineering: { roles: ['engineering.admin'], stepUp: false },
        hr: { roles: ['hr.admin'], stepUp: true },
        executive: {
            roles: ['finance.admin', 'engineering.viewer', 'hr.viewer'],
            stepUp: false,
        },
    }

    if (!(roleId in roleMap)) {
        throw new Error('Invalid role')
    }

    const role = roleMap[roleId as keyof typeof roleMap]

    return await new SignJWT({
        sub: `demo-user-${roleId}@example.com`,
        roles: ['employee', ...role.roles],
        tenant: 'acme',
        stepUp: role.stepUp,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secret)
}
