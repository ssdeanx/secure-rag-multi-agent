/**
 * RateLimitingService
 *
 * Provides rate limiting and throttling capabilities based on subscription tiers.
 * Implements token bucket algorithm for API request rate limiting.
 */

import { type SubscriptionTier, getTierQuota } from '../config/role-hierarchy'
import { log } from '../config/logger'

interface RateLimitBucket {
    tokens: number
    lastRefill: Date
    tier: SubscriptionTier
}

export interface RateLimitResult {
    allowed: boolean
    remaining: number
    resetAt: Date
    retryAfter?: number
}

export class RateLimitingService {
    private buckets: Map<string, RateLimitBucket> = new Map()
    private refillIntervalMs = 60000 // 1 minute

    /**
     * Check rate limit for a tenant/user
     */
    async checkRateLimit(
        identifier: string,
        tier: SubscriptionTier
    ): Promise<RateLimitResult> {
        const bucket = this.getBucket(identifier, tier)
        const quota = getTierQuota(tier)

        // Refill tokens if needed
        this.refillTokens(bucket, tier)

        // Check if request is allowed
        const allowed = bucket.tokens > 0

        if (allowed) {
            bucket.tokens -= 1
        }

        const resetAt = new Date(
            bucket.lastRefill.getTime() + this.refillIntervalMs
        )
        const retryAfter = allowed
            ? undefined
            : Math.ceil((resetAt.getTime() - Date.now()) / 1000)

        log.debug('Rate limit check', {
            identifier,
            tier,
            allowed,
            remaining: bucket.tokens,
            resetAt,
        })

        return {
            allowed,
            remaining: bucket.tokens,
            resetAt,
            retryAfter,
        }
    }

    /**
     * Consume tokens from the rate limit bucket
     */
    async consumeTokens(
        identifier: string,
        tier: SubscriptionTier,
        count = 1
    ): Promise<RateLimitResult> {
        const bucket = this.getBucket(identifier, tier)
        this.refillTokens(bucket, tier)

        const allowed = bucket.tokens >= count

        if (allowed) {
            bucket.tokens -= count
        }

        const resetAt = new Date(
            bucket.lastRefill.getTime() + this.refillIntervalMs
        )

        return {
            allowed,
            remaining: bucket.tokens,
            resetAt,
            retryAfter: allowed
                ? undefined
                : Math.ceil((resetAt.getTime() - Date.now()) / 1000),
        }
    }

    /**
     * Get or create rate limit bucket
     */
    private getBucket(
        identifier: string,
        tier: SubscriptionTier
    ): RateLimitBucket {
        if (!this.buckets.has(identifier)) {
            const quota = getTierQuota(tier)
            const tokensPerMinute = this.calculateTokensPerMinute(
                quota.maxApiRequestsPerDay
            )

            this.buckets.set(identifier, {
                tokens: tokensPerMinute,
                lastRefill: new Date(),
                tier,
            })
        }

        return this.buckets.get(identifier)!
    }

    /**
     * Refill tokens based on elapsed time
     */
    private refillTokens(
        bucket: RateLimitBucket,
        tier: SubscriptionTier
    ): void {
        const now = new Date()
        const elapsed = now.getTime() - bucket.lastRefill.getTime()

        if (elapsed < this.refillIntervalMs) {
            return
        }

        const quota = getTierQuota(tier)
        const tokensPerMinute = this.calculateTokensPerMinute(
            quota.maxApiRequestsPerDay
        )

        // Full refill after interval
        bucket.tokens = tokensPerMinute
        bucket.lastRefill = now
        bucket.tier = tier

        log.debug('Rate limit bucket refilled', {
            tier,
            tokens: bucket.tokens,
        })
    }

    /**
     * Calculate tokens per minute from daily quota
     */
    private calculateTokensPerMinute(dailyQuota: number): number {
        if (dailyQuota === -1) {
            return 10000 // Large number for unlimited tiers
        }
        // Distribute daily quota evenly across minutes, with some burst capacity
        return Math.max(10, Math.floor((dailyQuota / (24 * 60)) * 2))
    }

    /**
     * Reset rate limit for a specific identifier (admin function)
     */
    resetRateLimit(identifier: string): void {
        this.buckets.delete(identifier)
        log.info('Rate limit reset', { identifier })
    }

    /**
     * Get current rate limit status without consuming tokens
     */
    async getRateLimitStatus(
        identifier: string,
        tier: SubscriptionTier
    ): Promise<RateLimitResult> {
        const bucket = this.getBucket(identifier, tier)
        this.refillTokens(bucket, tier)

        const resetAt = new Date(
            bucket.lastRefill.getTime() + this.refillIntervalMs
        )

        return {
            allowed: bucket.tokens > 0,
            remaining: bucket.tokens,
            resetAt,
        }
    }
}

// Singleton instance
export const rateLimitingService = new RateLimitingService()
