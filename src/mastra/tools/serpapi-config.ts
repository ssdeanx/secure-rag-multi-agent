/**
 * SerpAPI Configuration Module
 *
 * Provides shared configuration and validation utilities for SerpAPI tools.
 * Manages API key validation, timeouts, and common parameter interfaces.
 *
 * @module serpapi-config
 */

import { config } from 'serpapi'

/**
 * Configure SerpAPI with API key and timeout
 */
config.api_key = process.env.SERPAPI_API_KEY ?? null
config.timeout = 60000 // 60 second timeout

/**
 * Common SerpAPI parameter interfaces
 */
export interface CommonSerpApiParams {
    /** Location for geographically-targeted results (e.g., "Austin, Texas") */
    location?: string
    /** Language code (e.g., "en", "es", "fr") */
    language?: string
    /** Device type for result formatting */
    device?: 'desktop' | 'mobile' | 'tablet'
}

/**
 * Validates that the SerpAPI key is configured
 *
 * @throws {Error} If SERPAPI_API_KEY environment variable is not set
 */
export function validateSerpApiKey(): void {
    const apiKey = process.env.SERPAPI_API_KEY
    if (typeof apiKey !== 'string' || apiKey.trim() === '') {
        throw new Error(
            'SERPAPI_API_KEY environment variable is required. Get your API key from https://serpapi.com/manage-api-key'
        )
    }
}

/**
 * Time range options for news and trends queries
 */
export type TimeRange =
    | 'hour'
    | 'day'
    | 'week'
    | 'month'
    | 'year'
    | 'now-1-H'
    | 'now-4-H'
    | 'now-1-d'
    | 'now-7-d'
    | 'today-1-m'
    | 'today-3-m'
    | 'today-12-m'
    | 'today-5-y'

/**
 * Sort options for various searches
 */
export type SortBy = 'relevance' | 'date' | 'rating' | 'price-asc' | 'price-desc'

/**
 * News topic categories
 */
export type NewsTopic =
    | 'world'
    | 'nation'
    | 'business'
    | 'technology'
    | 'entertainment'
    | 'sports'
    | 'science'
    | 'health'

/**
 * Item condition for marketplace searches
 */
export type ItemCondition = 'new' | 'used' | 'refurbished'

/**
 * Price range filter for marketplace searches
 */
export type PriceRange = '$' | '$$' | '$$$' | '$$$$'

/**
 * Exports configuration object for access in other tools
 */
export const serpApiConfig = {
    apiKey: process.env.SERPAPI_API_KEY,
    timeout: config.timeout,
}
