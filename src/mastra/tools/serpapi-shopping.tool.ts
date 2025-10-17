/**
 * SerpAPI Shopping Tools
 *
 * Provides shopping platform search tools for Amazon, Walmart, eBay, and Home Depot.
 *
 * @module serpapi-shopping-tool
 */

import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { getJson } from 'serpapi'
import { log } from '../config/logger'
import { AISpanType } from '@mastra/core/ai-tracing'
import { validateSerpApiKey } from './serpapi-config'

// Amazon Search Tool
const amazonSearchInputSchema = z.object({
    query: z.string().min(1).describe('Product search query'),
    sortBy: z.enum(['relevance', 'price-asc', 'price-desc', 'rating']).default('relevance').describe('Sort order'),
    minPrice: z.number().positive().optional().describe('Minimum price filter'),
    maxPrice: z.number().positive().optional().describe('Maximum price filter'),
    primeOnly: z.boolean().default(false).describe('Show only Prime eligible products'),
    numResults: z.number().int().min(1).max(50).default(10).describe('Number of results'),
})

const amazonSearchOutputSchema = z.object({
    products: z.array(
        z.object({
            title: z.string(),
            asin: z.string(),
            link: z.string().url(),
            price: z.number().optional(),
            rating: z.number().optional(),
            reviewCount: z.number().optional(),
            thumbnail: z.string().url().optional(),
            isPrime: z.boolean().optional(),
        })
    ),
})

export const amazonSearchTool = createTool({
    id: 'amazon-search',
    description:
        'Search Amazon for products. Filter by price range, sort by relevance/price/rating, and show only Prime eligible items. Returns product title, ASIN, price, rating, review count, and Prime status.',
    inputSchema: amazonSearchInputSchema,
    outputSchema: amazonSearchOutputSchema,
    execute: async ({ context, tracingContext }) => {
        validateSerpApiKey()

        const amazonSpan = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.TOOL_CALL,
            name: 'amazon-search-tool',
            input: { query: context.query, sortBy: context.sortBy },
        })

        log.info('Executing Amazon search', { query: context.query })

        try {
            const params: Record<string, string | number | boolean> = {
                engine: 'amazon',
                query: context.query,
                num: context.numResults,
            }

            if (context.sortBy !== 'relevance') {
                const sortMap: Record<string, string> = {
                    'price-asc': 'price-asc-rank',
                    'price-desc': 'price-desc-rank',
                    rating: 'review-rank',
                }
                const sortValue = sortMap[context.sortBy]
                if (sortValue) {
                    params.sort_by = sortValue
                }
            }

            if (typeof context.minPrice === 'number') {
                params.min_price = context.minPrice
            }
            if (typeof context.maxPrice === 'number') {
                params.max_price = context.maxPrice
            }
            if (context.primeOnly) {
                params.prime = 'true'
            }

            const response = await getJson(params)

            const products =
                response.search_results?.map(
                    (product: {
                        title: string
                        asin: string
                        link: string
                        price?: { value: number }
                        rating?: number
                        reviews_count?: number
                        thumbnail?: string
                        is_prime?: boolean
                    }) => ({
                        title: product.title,
                        asin: product.asin,
                        link: product.link,
                        price: product.price?.value,
                        rating: product.rating,
                        reviewCount: product.reviews_count,
                        thumbnail: product.thumbnail,
                        isPrime: product.is_prime,
                    })
                ) ?? []

            const result = { products }

            amazonSpan?.end({ output: { productCount: products.length } })
            log.info('Amazon search completed', { query: context.query, productCount: products.length })

            return result
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            amazonSpan?.end({ metadata: { error: errorMessage } })
            log.error('Amazon search failed', { query: context.query, error: errorMessage })
            throw new Error(`Amazon search failed: ${errorMessage}`)
        }
    },
})

// Walmart Search Tool
const walmartSearchInputSchema = z.object({
    query: z.string().min(1).describe('Product search query'),
    sortBy: z.enum(['relevance', 'price-asc', 'price-desc', 'rating']).default('relevance').describe('Sort order'),
    minPrice: z.number().positive().optional().describe('Minimum price'),
    maxPrice: z.number().positive().optional().describe('Maximum price'),
    numResults: z.number().int().min(1).max(50).default(10).describe('Number of results'),
})

const walmartSearchOutputSchema = z.object({
    products: z.array(
        z.object({
            title: z.string(),
            productId: z.string(),
            link: z.string().url(),
            price: z.number().optional(),
            rating: z.number().optional(),
            thumbnail: z.string().url().optional(),
        })
    ),
})

export const walmartSearchTool = createTool({
    id: 'walmart-search',
    description:
        'Search Walmart for products. Filter by price range and sort by relevance, price, or rating. Returns product information including title, price, rating, and links.',
    inputSchema: walmartSearchInputSchema,
    outputSchema: walmartSearchOutputSchema,
    execute: async ({ context, tracingContext }) => {
        validateSerpApiKey()

        const walmartSpan = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.TOOL_CALL,
            name: 'walmart-search-tool',
            input: { query: context.query },
        })

        log.info('Executing Walmart search', { query: context.query })

        try {
            const params: Record<string, string | number> = {
                engine: 'walmart',
                query: context.query,
                num: context.numResults,
            }

            if (context.sortBy !== 'relevance') {
                params.sort = context.sortBy
            }
            if (typeof context.minPrice === 'number') {
                params.min_price = context.minPrice
            }
            if (typeof context.maxPrice === 'number') {
                params.max_price = context.maxPrice
            }

            const response = await getJson(params)

            const products =
                response.organic_results?.map(
                    (product: {
                        title: string
                        product_id: string
                        link: string
                        primary_offer?: { offer_price?: number }
                        rating?: number
                        thumbnail?: string
                    }) => ({
                        title: product.title,
                        productId: product.product_id,
                        link: product.link,
                        price: product.primary_offer?.offer_price,
                        rating: product.rating,
                        thumbnail: product.thumbnail,
                    })
                ) ?? []

            const result = { products }

            walmartSpan?.end({ output: { productCount: products.length } })
            log.info('Walmart search completed', { query: context.query, productCount: products.length })

            return result
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            walmartSpan?.end({ metadata: { error: errorMessage } })
            log.error('Walmart search failed', { query: context.query, error: errorMessage })
            throw new Error(`Walmart search failed: ${errorMessage}`)
        }
    },
})

// eBay Search Tool
const ebaySearchInputSchema = z.object({
    query: z.string().min(1).describe('Product search query'),
    condition: z.enum(['new', 'used', 'refurbished']).optional().describe('Item condition'),
    sortBy: z.enum(['relevance', 'price-asc', 'price-desc']).default('relevance').describe('Sort order'),
    buyNowOnly: z.boolean().default(false).describe('Show only Buy It Now items'),
    numResults: z.number().int().min(1).max(50).default(10).describe('Number of results'),
})

const ebaySearchOutputSchema = z.object({
    products: z.array(
        z.object({
            title: z.string(),
            itemId: z.string(),
            link: z.string().url(),
            price: z.number().optional(),
            condition: z.string().optional(),
            bids: z.number().optional(),
            timeLeft: z.string().optional(),
            thumbnail: z.string().url().optional(),
        })
    ),
})

export const ebaySearchTool = createTool({
    id: 'ebay-search',
    description:
        'Search eBay for products and listings. Filter by condition (new/used/refurbished), show only Buy It Now items, and sort by relevance or price. Returns item details including price, bids, time left, and condition.',
    inputSchema: ebaySearchInputSchema,
    outputSchema: ebaySearchOutputSchema,
    execute: async ({ context, tracingContext }) => {
        validateSerpApiKey()

        const ebaySpan = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.TOOL_CALL,
            name: 'ebay-search-tool',
            input: { query: context.query, condition: context.condition },
        })

        log.info('Executing eBay search', { query: context.query })

        try {
            const params: Record<string, string | number | boolean> = {
                engine: 'ebay',
                _nkw: context.query,
                num: context.numResults,
            }

            if (context.condition) {
                params.LH_ItemCondition = context.condition === 'new' ? '1000' : context.condition === 'used' ? '3000' : '2000'
            }
            if (context.sortBy !== 'relevance') {
                params._sop = context.sortBy === 'price-asc' ? '15' : '16'
            }
            if (context.buyNowOnly) {
                params.LH_BIN = '1'
            }

            const response = await getJson(params)

            const products =
                response.organic_results?.map(
                    (product: {
                        title: string
                        item_id: string
                        link: string
                        price?: { value: number }
                        condition?: string
                        bids?: number
                        time_left?: string
                        thumbnail?: string
                    }) => ({
                        title: product.title,
                        itemId: product.item_id,
                        link: product.link,
                        price: product.price?.value,
                        condition: product.condition,
                        bids: product.bids,
                        timeLeft: product.time_left,
                        thumbnail: product.thumbnail,
                    })
                ) ?? []

            const result = { products }

            ebaySpan?.end({ output: { productCount: products.length } })
            log.info('eBay search completed', { query: context.query, productCount: products.length })

            return result
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            ebaySpan?.end({ metadata: { error: errorMessage } })
            log.error('eBay search failed', { query: context.query, error: errorMessage })
            throw new Error(`eBay search failed: ${errorMessage}`)
        }
    },
})

// Home Depot Search Tool
const homeDepotSearchInputSchema = z.object({
    query: z.string().min(1).describe('Product search query'),
    sortBy: z.enum(['relevance', 'price-asc', 'price-desc', 'rating']).default('relevance').describe('Sort order'),
    inStockOnly: z.boolean().default(false).describe('Show only in-stock items'),
    numResults: z.number().int().min(1).max(50).default(10).describe('Number of results'),
})

const homeDepotSearchOutputSchema = z.object({
    products: z.array(
        z.object({
            title: z.string(),
            productId: z.string(),
            link: z.string().url(),
            price: z.number().optional(),
            rating: z.number().optional(),
            availability: z.string().optional(),
            thumbnail: z.string().url().optional(),
        })
    ),
})

export const homeDepotSearchTool = createTool({
    id: 'home-depot-search',
    description:
        'Search Home Depot for home improvement products. Filter by in-stock availability and sort by relevance, price, or rating. Returns product details including price, rating, availability, and links.',
    inputSchema: homeDepotSearchInputSchema,
    outputSchema: homeDepotSearchOutputSchema,
    execute: async ({ context, tracingContext }) => {
        validateSerpApiKey()

        const homeDepotSpan = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.TOOL_CALL,
            name: 'home-depot-search-tool',
            input: { query: context.query },
        })

        log.info('Executing Home Depot search', { query: context.query })

        try {
            const params: Record<string, string | number | boolean> = {
                engine: 'home_depot',
                q: context.query,
                num: context.numResults,
            }

            if (context.sortBy !== 'relevance') {
                params.sort_by = context.sortBy
            }
            if (context.inStockOnly) {
                params.in_stock = 'true'
            }

            const response = await getJson(params)

            const products =
                response.products?.map(
                    (product: {
                        title: string
                        product_id: string
                        link: string
                        price?: number
                        rating?: number
                        availability?: string
                        thumbnail?: string
                    }) => ({
                        title: product.title,
                        productId: product.product_id,
                        link: product.link,
                        price: product.price,
                        rating: product.rating,
                        availability: product.availability,
                        thumbnail: product.thumbnail,
                    })
                ) ?? []

            const result = { products }

            homeDepotSpan?.end({ output: { productCount: products.length } })
            log.info('Home Depot search completed', { query: context.query, productCount: products.length })

            return result
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            homeDepotSpan?.end({ metadata: { error: errorMessage } })
            log.error('Home Depot search failed', { query: context.query, error: errorMessage })
            throw new Error(`Home Depot search failed: ${errorMessage}`)
        }
    },
})
