/**
 * TierManagementService
 *
 * Manages subscription tier validation, quota enforcement, and usage tracking.
 * Integrates with the pricing model (Free/Pro/Enterprise) to control feature access
 * and resource limits.
 */

import {
    type SubscriptionTier,
    getTierQuota,
    isTierFeatureEnabled,
    getMinimumTierForClassification,
} from '../config/role-hierarchy'
import { log } from '../config/logger'

export interface UsageStats {
    tenant: string
    tier: SubscriptionTier
    documentsIndexed: number
    apiRequestsToday: number
    totalUsers: number
    lastReset: Date
    quotaExceeded?: boolean
}

export interface TierValidationResult {
    allowed: boolean
    tier: SubscriptionTier
    reason?: string
    upgradeRequired?: boolean
    currentUsage?: UsageStats
}

export class TierManagementService {
    private usageCache: Map<string, UsageStats> = new Map()
    private dailyResetHour = 0 // Reset at midnight UTC

    /**
     * Validate if an operation is allowed based on tier quotas
     */
    async validateTierAccess(
        tenant: string,
        tier: SubscriptionTier,
        operationType: 'document' | 'api_request' | 'user'
    ): Promise<TierValidationResult> {
        const quota = getTierQuota(tier)
        const usage = await this.getUsageStats(tenant, tier)

        // Check if daily reset is needed
        if (this.needsDailyReset(usage.lastReset)) {
            await this.resetDailyUsage(tenant)
            usage.apiRequestsToday = 0
        }

        let allowed = true
        let reason: string | undefined
        let upgradeRequired = false

        switch (operationType) {
            case 'document':
                if (
                    quota.maxDocuments !== -1 &&
                    usage.documentsIndexed >= quota.maxDocuments
                ) {
                    allowed = false
                    reason = `Document limit reached (${usage.documentsIndexed}/${quota.maxDocuments}). Upgrade to index more documents.`
                    upgradeRequired = true
                }
                break

            case 'api_request':
                if (
                    quota.maxApiRequestsPerDay !== -1 &&
                    usage.apiRequestsToday >= quota.maxApiRequestsPerDay
                ) {
                    allowed = false
                    reason = `Daily API request limit reached (${usage.apiRequestsToday}/${quota.maxApiRequestsPerDay}). Resets at midnight UTC.`
                    upgradeRequired = tier !== 'enterprise'
                }
                break

            case 'user':
                if (
                    quota.maxUsersPerTenant !== -1 &&
                    usage.totalUsers >= quota.maxUsersPerTenant
                ) {
                    allowed = false
                    reason = `User limit reached (${usage.totalUsers}/${quota.maxUsersPerTenant}). Upgrade to add more users.`
                    upgradeRequired = true
                }
                break
        }

        return {
            allowed,
            tier,
            reason,
            upgradeRequired,
            currentUsage: usage,
        }
    }

    /**
     * Check if a feature is available for a tier
     */
    validateFeatureAccess(
        tier: SubscriptionTier,
        feature: string
    ): TierValidationResult {
        const allowed = isTierFeatureEnabled(tier, feature)

        return {
            allowed,
            tier,
            reason: allowed
                ? undefined
                : `Feature '${feature}' is not available in ${tier} tier`,
            upgradeRequired: !allowed,
        }
    }

    /**
     * Validate tier access for a specific classification level
     */
    validateClassificationAccess(
        tier: SubscriptionTier,
        classification: 'public' | 'internal' | 'confidential'
    ): TierValidationResult {
        const minimumTier = getMinimumTierForClassification(classification)
        const tierLevels = { free: 1, pro: 2, enterprise: 3 }
        const allowed = tierLevels[tier] >= tierLevels[minimumTier]

        return {
            allowed,
            tier,
            reason: allowed
                ? undefined
                : `${classification} documents require ${minimumTier} tier or higher`,
            upgradeRequired: !allowed,
        }
    }

    /**
     * Increment usage counters
     */
    async incrementUsage(
        tenant: string,
        tier: SubscriptionTier,
        type: 'document' | 'api_request' | 'user',
        amount = 1
    ): Promise<UsageStats> {
        const usage = await this.getUsageStats(tenant, tier)

        switch (type) {
            case 'document':
                usage.documentsIndexed += amount
                break
            case 'api_request':
                usage.apiRequestsToday += amount
                break
            case 'user':
                usage.totalUsers += amount
                break
        }

        this.usageCache.set(tenant, usage)

        // In production, persist to database
        await this.persistUsageStats(usage)

        log.info(`Usage incremented for ${tenant}: ${type} +${amount}`, {
            tenant,
            tier,
            usage,
        })

        return usage
    }

    /**
     * Get current usage stats for a tenant
     */
    async getUsageStats(
        tenant: string,
        tier: SubscriptionTier
    ): Promise<UsageStats> {
        // Check cache first
        if (this.usageCache.has(tenant)) {
            return this.usageCache.get(tenant)!
        }

        // In production, load from database
        const usage: UsageStats = await this.loadUsageStats(tenant, tier)

        this.usageCache.set(tenant, usage)
        return usage
    }

    /**
     * Reset daily usage counters
     */
    private async resetDailyUsage(tenant: string): Promise<void> {
        const usage = this.usageCache.get(tenant)
        if (usage) {
            usage.apiRequestsToday = 0
            usage.lastReset = new Date()
            await this.persistUsageStats(usage)
        }
    }

    /**
     * Check if daily reset is needed
     */
    private needsDailyReset(lastReset: Date): boolean {
        const now = new Date()
        const resetTime = new Date(now)
        resetTime.setUTCHours(this.dailyResetHour, 0, 0, 0)

        if (now < resetTime) {
            resetTime.setDate(resetTime.getDate() - 1)
        }

        return lastReset < resetTime
    }

    /**
     * Load usage stats from persistent storage
     * TODO: Implement database integration
     */
    private async loadUsageStats(
        tenant: string,
        tier: SubscriptionTier
    ): Promise<UsageStats> {
        // Mock implementation - replace with database query
        return {
            tenant,
            tier,
            documentsIndexed: 0,
            apiRequestsToday: 0,
            totalUsers: 1,
            lastReset: new Date(),
        }
    }

    /**
     * Persist usage stats to storage
     * TODO: Implement database integration
     */
    private async persistUsageStats(usage: UsageStats): Promise<void> {
        // Mock implementation - replace with database update
        log.debug('Persisting usage stats', { usage })
    }

    /**
     * Get usage percentage for quota limits
     */
    getUsagePercentage(usage: UsageStats): {
        documents: number
        apiRequests: number
        users: number
    } {
        const quota = getTierQuota(usage.tier)

        return {
            documents:
                quota.maxDocuments === -1
                    ? 0
                    : (usage.documentsIndexed / quota.maxDocuments) * 100,
            apiRequests:
                quota.maxApiRequestsPerDay === -1
                    ? 0
                    : (usage.apiRequestsToday / quota.maxApiRequestsPerDay) *
                      100,
            users:
                quota.maxUsersPerTenant === -1
                    ? 0
                    : (usage.totalUsers / quota.maxUsersPerTenant) * 100,
        }
    }

    /**
     * Check if any quota is near limit (>80%)
     */
    isNearQuotaLimit(usage: UsageStats): boolean {
        const percentages = this.getUsagePercentage(usage)
        return Object.values(percentages).some((pct) => pct > 80)
    }
}

// Singleton instance
export const tierManagementService = new TierManagementService()
