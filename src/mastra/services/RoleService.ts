import { log } from '../config/logger'
import {
    ROLE_HIERARCHY,
    getRoleLevel,
    isValidRole,
    getInheritorRoles,
} from '../config/role-hierarchy'

/**
 * Service for handling role hierarchy and access control logic
 */
export class RoleService {
    /**
     * Expand a list of user roles to include all inherited roles
     * @param userRoles Array of roles assigned to the user
     * @returns Array of all effective roles (including inherited ones)
     */
    static expandRoles(userRoles: string[]): string[] {
        const expandedRoles = new Set<string>()

        // Add all user roles and their inherited roles
        for (const role of userRoles) {
            if (isValidRole(role)) {
                expandedRoles.add(role)

                // Add all roles this role inherits from
                // Use nullish coalescing to avoid treating empty arrays as falsy
                // and to satisfy linters that warn about object values in boolean conditionals.
                const inheritedRoles: string[] = ROLE_HIERARCHY[role] ?? []
                for (const inheritedRole of inheritedRoles) {
                    expandedRoles.add(inheritedRole)
                }
            } else {
                log.warn(
                    `RoleService: Unknown role "${role}" - skipping inheritance`
                )
                expandedRoles.add(role) // Keep unknown roles for backward compatibility
            }
        }

        return Array.from(expandedRoles).sort(
            (a, b) => getRoleLevel(b) - getRoleLevel(a)
        )
    }

    /**
     * Check if a user with given roles can access a resource requiring a specific role
     * @param userRoles Array of roles assigned to the user
     * @param requiredRole Role required to access the resource
     * @returns True if user has access, false otherwise
     */
    static canAccessRole(userRoles: string[], requiredRole: string): boolean {
        const expandedRoles = this.expandRoles(userRoles)
        return expandedRoles.includes(requiredRole)
    }

    /**
     * Check if a user can access a document with given security tags
     * @param userRoles Array of roles assigned to the user
     * @param documentRoleTags Array of role tags on the document (e.g., ['role:hr.admin', 'role:employee'])
     * @returns True if user has access to at least one required role
     */
    static canAccessDocument(
        userRoles: string[],
        documentRoleTags: string[]
    ): boolean {
        if (documentRoleTags.length === 0) {
            // Document has no role restrictions - accessible to everyone
            return true
        }

        const expandedUserRoles = this.expandRoles(userRoles)
        const expandedUserRoleTags = expandedUserRoles.map(
            (role) => `role:${role}`
        )

        // Check if user has any of the required roles
        return documentRoleTags.some((docRoleTag) =>
            expandedUserRoleTags.includes(docRoleTag)
        )
    }

    /**
     * Generate access tags for vector query filtering
     * @param userRoles Array of roles assigned to the user
     * @param tenant User's tenant (optional)
     * @returns Object with allowTags for query filtering
     */
    static generateAccessTags(
        userRoles: string[],
        tenant?: string
    ): {
        allowTags: string[]
        userRoles: string[]
        expandedRoles: string[]
    } {
        const expandedRoles = this.expandRoles(userRoles)
        const roleTags = expandedRoles.map((role) => `role:${role}`)

        const allowTags: string[] = [...roleTags]

        // Add tenant tag if provided - explicit null/empty check to satisfy linters
        if (typeof tenant === 'string') {
            const trimmed = tenant.trim()
            if (trimmed.length > 0) {
                allowTags.push(`tenant:${trimmed}`)
            } else {
                log.warn(
                    'RoleService: Ignoring tenant value because it is an empty string'
                )
            }
        }

        return {
            allowTags,
            userRoles,
            expandedRoles,
        }
    }

    /**
     * Get the highest privilege level among user's roles
     * @param userRoles Array of roles assigned to the user
     * @returns Highest privilege level number
     */
    static getMaxPrivilegeLevel(userRoles: string[]): number {
        let maxLevel = 0
        for (const role of userRoles) {
            const level = getRoleLevel(role)
            if (level > maxLevel) {
                maxLevel = level
            }
        }
        return maxLevel
    }

    /**
     * Get user's effective roles formatted for logging
     * @param userRoles Original user roles
     * @returns Formatted string for logging
     */
    static formatRolesForLogging(userRoles: string[]): string {
        const accessInfo = this.generateAccessTags(userRoles)
        return [
            `Original: [${accessInfo.userRoles.join(', ')}]`,
            `Effective: [${accessInfo.expandedRoles.join(', ')}]`,
            `Max Level: ${this.getMaxPrivilegeLevel(userRoles)}`,
        ].join(' | ')
    }

    /**
     * Validate that all document roles are properly configured
     * @param documentRoles Array of roles assigned to a document
     * @returns Validation result with warnings
     */
    static validateDocumentRoles(documentRoles: string[]): {
        valid: boolean
        warnings: string[]
    } {
        const warnings: string[] = []

        for (const role of documentRoles) {
            if (!isValidRole(role)) {
                warnings.push(`Unknown role: ${role}`)
            }
        }

        return {
            valid: warnings.length === 0,
            warnings,
        }
    }

    /**
     * Get all roles that can access a document with given role requirements
     * @param documentRoles Array of roles that can access the document
     * @returns Array of all roles (including inheritors) that can access the document
     */
    static getDocumentAccessibleRoles(documentRoles: string[]): string[] {
        const accessibleRoles = new Set<string>()

        for (const docRole of documentRoles) {
            // Add the role itself
            accessibleRoles.add(docRole)

            // Add all roles that inherit this role
            const inheritors = getInheritorRoles(docRole)
            for (const inheritor of inheritors) {
                accessibleRoles.add(inheritor)
            }
        }

        return Array.from(accessibleRoles).sort(
            (a, b) => getRoleLevel(b) - getRoleLevel(a)
        )
    }
}
