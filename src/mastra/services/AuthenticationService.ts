import { jwtVerify } from "jose";

import { ValidationService } from "./ValidationService";
import { RoleService } from "./RoleService";

export interface JWTClaims {
  sub: string;
  roles: string[];
  tenant?: string;
  stepUp?: boolean;
  exp?: number;
  iat?: number;
}

export interface AccessFilter {
  allowTags: string[];
  maxClassification: "public" | "internal" | "confidential";
}

export class AuthenticationService {
  static async verifyJWT(token: string): Promise<JWTClaims> {
    ValidationService.validateJWTToken(token);
    const jwtSecret: string = ValidationService.validateEnvironmentVariable("JWT_SECRET", process.env.JWT_SECRET);

    const secret: Uint8Array = new TextEncoder().encode(jwtSecret);

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      clockTolerance: 5,
    });

    const now = Math.floor(Date.now() / 1000);
    ValidationService.validateTokenExpiry(payload.exp, now);
    ValidationService.validateTokenNotBefore(payload.nbf, now);

    return {
      sub: String(payload.sub ?? "unknown"),
      roles: Array.isArray(payload.roles) ? payload.roles : [],
      tenant: payload.tenant ? String(payload.tenant) : process.env.TENANT,
      stepUp: Boolean(payload.stepUp),
      exp: payload.exp ? Number(payload.exp) : undefined,
      iat: payload.iat ? Number(payload.iat) : undefined,
    };
  }

  static generateAccessPolicy(claims: JWTClaims): AccessFilter {
    // Use role hierarchy to expand user's access
    const accessInfo = RoleService.generateAccessTags(claims.roles, claims.tenant);

    console.log('AUTH_SERVICE: Generating access policy with hierarchy:');
    console.log(`  - Original roles: [${claims.roles.join(', ')}]`);
    console.log(`  - Expanded roles: [${accessInfo.expandedRoles.join(', ')}]`);
    console.log(`  - StepUp: ${claims.stepUp}`);

    // Determine maximum classification based on stepUp status and role hierarchy
    let maxClassification: "public" | "internal" | "confidential";

    if (claims.stepUp === true) {
      // stepUp == true: Allow up to "confidential"
      maxClassification = "confidential";
    } else if (claims.roles.length > 0) {
      // stepUp != true but has roles: Cap at "internal"
      maxClassification = "internal";
    } else {
      // No roles: Cap at "public"
      maxClassification = "public";
    }

    console.log(`  - Max classification: ${maxClassification}`);
    console.log(`  - Allow tags: [${accessInfo.allowTags.join(', ')}]`);

    return {
      allowTags: accessInfo.allowTags,
      maxClassification
    };
  }

  static async authenticateAndAuthorize(token: string): Promise<{
    claims: JWTClaims;
    accessFilter: AccessFilter;
  }> {
    const claims: JWTClaims = await this.verifyJWT(token);
    const accessFilter: AccessFilter = this.generateAccessPolicy(claims);

    return {
      claims,
      accessFilter
    };
  }
}
