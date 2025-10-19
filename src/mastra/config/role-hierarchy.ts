/**
 * Role Hierarchy Configuration
 *
 * Defines the hierarchical relationships between roles where higher-level roles
 * automatically inherit access permissions from lower-level roles.
 *
 * Structure: { role: [inherited_roles...] }
 * - Each role inherits access from all roles listed in its array
 * - Higher privilege roles should include lower privilege roles
 * - 'public' is the base level accessible to everyone
 */

export interface RoleHierarchy {
    [role: string]: string[]
}

export const ROLE_HIERARCHY: RoleHierarchy = {
    // Super admin - access to everything
    admin: [
        'hr.admin',
        'hr.viewer',
        'finance.admin',
        'finance.viewer',
        'engineering.admin',
        'engineering.viewer',
        'employee',
        'reader',
        'public',
    ],

    // Department admin roles - full access to their department + general access
    'hr.admin': ['hr.viewer', 'employee', 'reader', 'public'],
    'finance.admin': ['finance.viewer', 'employee', 'reader', 'public'],
    'engineering.admin': ['engineering.viewer', 'employee', 'reader', 'public'],

    // Department viewer roles - read access to their department + general access
    'hr.viewer': ['employee', 'reader', 'public'],
    'finance.viewer': ['employee', 'reader', 'public'],
    'engineering.viewer': ['employee', 'reader', 'public'],

    // Added reader role (inherits employee + public)
    reader: ['employee', 'public'],

    // Base employee role - access to general company documents
    employee: ['public'],

    // Public role - no additional inheritance (base level)
    public: [],

    // Tier-aligned roles for SaaS subscription model
    free_user: ['public'],
    pro_user: ['free_user', 'employee', 'public'],
    pro_viewer: ['pro_user', 'free_user', 'public'],
    pro_dept_viewer: ['pro_viewer', 'pro_user', 'free_user', 'public'],
    enterprise_user: ['pro_user', 'pro_viewer', 'free_user', 'employee', 'public'],
    enterprise_dept_admin: ['pro_dept_viewer', 'hr.viewer', 'finance.viewer', 'engineering.viewer', 'enterprise_user', 'pro_user', 'employee', 'public'],
    enterprise_admin: ['enterprise_dept_admin', 'hr.admin', 'finance.admin', 'engineering.admin', 'enterprise_user', 'pro_user', 'employee', 'reader', 'public'],
}

/**
 * Role privilege levels for sorting and comparison
 * Higher numbers indicate higher privilege levels
 */
export const ROLE_LEVELS: Record<string, number> = {
    // Legacy roles
    admin: 100,
    'hr.admin': 80,
    'finance.admin': 80,
    'engineering.admin': 80,
    'hr.viewer': 60,
    'finance.viewer': 60,
    'engineering.viewer': 60,
    employee: 40,
    reader: 35,
    public: 10,
    anonymous: 10,
    // Tier-aligned roles
    free_user: 15,
    pro_user: 50,
    pro_viewer: 55,
    pro_dept_viewer: 58,
    enterprise_user: 75,
    enterprise_dept_admin: 85,
    enterprise_admin: 100,
}

/**
 * Get the privilege level of a role
 */
export function getRoleLevel(role: string): number {
    return ROLE_LEVELS[role] || 0
}

/**
 * Check if a role exists in the hierarchy
 */
export function isValidRole(role: string): boolean {
    return role in ROLE_HIERARCHY
}

/**
 * Get all roles that inherit from a specific role
 * @param targetRole The role to find inheritors for
 * @returns Array of roles that can access the target role
 */
export function getInheritorRoles(targetRole: string): string[] {
    const inheritors: string[] = []

    for (const [role, inheritedRoles] of Object.entries(ROLE_HIERARCHY)) {
        if (inheritedRoles.includes(targetRole) || role === targetRole) {
            inheritors.push(role)
        }
    }

    return inheritors.sort((a, b) => getRoleLevel(b) - getRoleLevel(a))
}

/**
 * Subscription Tier Configuration
 * Defines quotas and feature access for each tier
 */
export type SubscriptionTier = 'free' | 'pro' | 'enterprise'

export interface TierQuota {
    maxDocuments: number // -1 = unlimited
    maxApiRequestsPerDay: number
    maxUsersPerTenant: number
    features: string[]
    supportLevel: 'community' | 'email' | 'priority' | 'phone_24x7'
    customIntegrations: boolean
    advancedAnalytics: boolean
    whiteLabel: boolean
    onPremise: boolean
}

export const TIER_QUOTAS: Record<SubscriptionTier, TierQuota> = {
    free: {
        maxDocuments: 500,
        maxApiRequestsPerDay: 50,
        maxUsersPerTenant: 1,
        features: ['basic-rag', 'basic-search', 'public-docs'],
        supportLevel: 'community',
        customIntegrations: false,
        advancedAnalytics: false,
        whiteLabel: false,
        onPremise: false,
    },
    pro: {
        maxDocuments: 50000,
        maxApiRequestsPerDay: 10000,
        maxUsersPerTenant: -1, // unlimited
        features: [
            'basic-rag',
            'basic-search',
            'advanced-search',
            'public-docs',
            'internal-docs',
            'ai-insights',
            'advanced-analytics',
            'custom-integrations',
            'api-access',
            'priority-support',
        ],
        supportLevel: 'priority',
        customIntegrations: true,
        advancedAnalytics: true,
        whiteLabel: false,
        onPremise: false,
    },
    enterprise: {
        maxDocuments: -1, // unlimited
        maxApiRequestsPerDay: -1, // unlimited
        maxUsersPerTenant: -1, // unlimited
        features: [
            'basic-rag',
            'basic-search',
            'advanced-search',
            'public-docs',
            'internal-docs',
            'confidential-docs',
            'ai-insights',
            'advanced-analytics',
            'custom-workflows',
            'custom-integrations',
            'api-access',
            'white-label',
            'on-premise',
            'phone-support',
            'dedicated-account-manager',
        ],
        supportLevel: 'phone_24x7',
        customIntegrations: true,
        advancedAnalytics: true,
        whiteLabel: true,
        onPremise: true,
    },
}

/**
 * Get quota configuration for a tier
 */
export function getTierQuota(tier: SubscriptionTier): TierQuota {
    return TIER_QUOTAS[tier]
}

/**
 * Check if a feature is available in a tier
 */
export function isTierFeatureEnabled(
    tier: SubscriptionTier,
    feature: string
): boolean {
    return TIER_QUOTAS[tier].features.includes(feature)
}

/**
 * Get the minimum tier required for a classification level
 */
export function getMinimumTierForClassification(
    classification: 'public' | 'internal' | 'confidential'
): SubscriptionTier {
    switch (classification) {
        case 'public':
            return 'free'
        case 'internal':
            return 'pro'
        case 'confidential':
            return 'enterprise'
        default:
            return 'free'
    }
}

/**
 * Get all roles available in a subscription tier
 */
export function getRolesByTier(tier: SubscriptionTier): string[] {
    switch (tier) {
        case 'free':
            return ['free_user', 'public']
        case 'pro':
            return ['pro_user', 'pro_viewer', 'pro_dept_viewer', 'free_user', 'employee', 'reader', 'public']
        case 'enterprise':
            return ['enterprise_admin', 'enterprise_dept_admin', 'enterprise_user', 'admin', 'hr.admin', 'finance.admin', 'engineering.admin', 'pro_user', 'pro_viewer', 'employee', 'reader', 'public']
        default:
            return ['public']
    }
}

/**
 * Get the minimum tier required for a role
 */
export function getTierForRole(role: string): SubscriptionTier {
    if (role === 'public') {
        return 'free'
    }
    if (role === 'free_user') {
        return 'free'
    }
    if (role.startsWith('pro_') || role === 'employee' || role === 'reader') {
        return 'pro'
    }
    if (role.startsWith('enterprise_') || role === 'admin' || role.endsWith('.admin') || role.endsWith('.viewer')) {
        return 'enterprise'
    }
    return 'free'
}

/**
 * Check if a role can access a specific tier
 */
export function canRoleAccessTier(role: string, tier: SubscriptionTier): boolean {
    const roleLevel = getRoleLevel(role)
    const tierRoles = getRolesByTier(tier)

    // Check if role is directly in tier or has sufficient privilege level
    if (tierRoles.includes(role)) {
        return true
    }

    // Check based on role level
    switch (tier) {
        case 'free':
            return roleLevel >= 10
        case 'pro':
            return roleLevel >= 50
        case 'enterprise':
            return roleLevel >= 75
        default:
            return false
    }
}
