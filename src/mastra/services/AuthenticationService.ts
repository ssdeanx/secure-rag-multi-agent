import { jwtVerify } from 'jose'

import { ValidationService } from './ValidationService'
import { RoleService } from './RoleService'
import { log } from '../config/logger'

export interface JWTClaims {
    sub: string
    roles: string[]
    tenant?: string
    stepUp?: boolean
    exp?: number
    iat?: number
}

export interface AccessFilter {
    allowTags: string[]
    maxClassification: 'public' | 'internal' | 'confidential'
}

export class AuthenticationService {
    static async verifyJWT(token: string): Promise<JWTClaims> {
        ValidationService.validateJWTToken(token)
        const jwtSecret: string = ValidationService.validateEnvironmentVariable(
            'JWT_SECRET',
            process.env.JWT_SECRET
        )

        const secret: Uint8Array = new TextEncoder().encode(jwtSecret)

        const { payload } = await jwtVerify(token, secret, {
            algorithms: ['HS256'],
            clockTolerance: 5,
        })

        // Cast payload to a safe record to avoid implicit 'any' usage in conditionals
        const payloadRecord = payload as Record<string, unknown>
        // Explicitly check for undefined/null to satisfy lint rules that forbid
        // using an 'any' value directly in a conditional.
        const tenantResult =
            payloadRecord.tenant !== undefined && payloadRecord.tenant !== null
                ? String(payloadRecord.tenant)
                : process.env.TENANT

        const now = Math.floor(Date.now() / 1000)
        ValidationService.validateTokenExpiry(payload.exp, now)
        ValidationService.validateTokenNotBefore(payload.nbf, now)

        // Convert numeric claims with explicit nullish checks and NaN/Infinity protection
        let expNum: number | undefined = undefined
        if (payloadRecord.exp !== undefined && payloadRecord.exp !== null) {
            const candidate = Number(payloadRecord.exp)
            expNum = Number.isFinite(candidate) ? candidate : undefined
        }

        let iatNum: number | undefined = undefined
        if (payloadRecord.iat !== undefined && payloadRecord.iat !== null) {
            const candidate = Number(payloadRecord.iat)
            iatNum = Number.isFinite(candidate) ? candidate : undefined
        }

        return {
            sub: String(payload.sub ?? 'unknown'),
            roles: Array.isArray(payload.roles) ? payload.roles : [],
            tenant: tenantResult,
            stepUp: Boolean(payload.stepUp),
            exp: expNum,
            iat: iatNum,
        }
    }

    static generateAccessPolicy(claims: JWTClaims): AccessFilter {
        // Use role hierarchy to expand user's access
        const accessInfo = RoleService.generateAccessTags(
            claims.roles,
            claims.tenant
        )

        log.info('AUTH_SERVICE: Generating access policy with hierarchy:')
        log.info(`  - Original roles: [${claims.roles.join(', ')}]`)
        log.info(`  - Expanded roles: [${accessInfo.expandedRoles.join(', ')}]`)
        log.info(`  - StepUp: ${claims.stepUp}`)

        // Determine maximum classification based on stepUp status and role hierarchy
        let maxClassification: 'public' | 'internal' | 'confidential'

        if (claims.stepUp === true) {
            // stepUp == true: Allow up to "confidential"
            maxClassification = 'confidential'
        } else if (claims.roles.length > 0) {
            // stepUp != true but has roles: Cap at "internal"
            maxClassification = 'internal'
        } else {
            // No roles: Cap at "public"
            maxClassification = 'public'
        }

        log.info(`  - Max classification: ${maxClassification}`)
        log.info(`  - Allow tags: [${accessInfo.allowTags.join(', ')}]`)

        return {
            allowTags: accessInfo.allowTags,
            maxClassification,
        }
    }

    static async authenticateAndAuthorize(token: string): Promise<{
        claims: JWTClaims
        accessFilter: AccessFilter
    }> {
        const claims: JWTClaims = await this.verifyJWT(token)
        const accessFilter: AccessFilter = this.generateAccessPolicy(claims)

        return {
            claims,
            accessFilter,
        }
    }
}
