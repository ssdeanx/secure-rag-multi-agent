/**
 * SerpAPI News and Trends Tools
 *
 * Provides Google News, News Lite, Trends, and Autocomplete tools using the SerpAPI service.
 * These tools enable agents to find current news, analyze trends, and get search suggestions.
 *
 * @module serpapi-news-trends-tool
 */

import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { getJson } from 'serpapi'
import { log } from '../config/logger'
import { AISpanType } from '@mastra/core/ai-tracing'
import { validateSerpApiKey } from './serpapi-config'

/**
 * Input schema for Google News
 */
const googleNewsInputSchema = z.object({
    query: z.string().min(1).describe('The news search query'),
    location: z.string().optional().describe('Location for regional news'),
    timeRange: z
        .enum(['hour', 'day', 'week', 'month', 'year'])
        .optional()
        .describe('Time range filter for news articles'),
    topic: z
        .enum(['world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'])
        .optional()
        .describe('News category filter'),
    sortBy: z.enum(['relevance', 'date']).default('relevance').describe('Sort order for results'),
    numResults: z.number().int().min(1).max(100).default(10).describe('Number of results to return'),
})

/**
 * Output schema for Google News
 */
const googleNewsOutputSchema = z.object({
    newsArticles: z
        .array(
            z.object({
                title: z.string(),
                link: z.string().url(),
                source: z.string(),
                date: z.string(),
                snippet: z.string(),
                thumbnail: z.string().url().optional(),
            })
        )
        .describe('Array of news articles'),
    totalResults: z.number().optional().describe('Total number of results available'),
})

/**
 * Google News Tool
 *
 * Searches Google News for current news articles with filtering options.
 * Provides time-based filtering, topic categories, and source information.
 */
export const googleNewsTool = createTool({
    id: 'google-news',
    description:
        'Search Google News for current news articles. Filter by time range (hour, day, week, month, year), topic (world, business, technology, etc.), and sort by relevance or date. Returns article title, source, date, and snippet.',
    inputSchema: googleNewsInputSchema,
    outputSchema: googleNewsOutputSchema,
    execute: async ({ context, tracingContext }) => {
        validateSerpApiKey()

        const newsSpan = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.TOOL_CALL,
            name: 'google-news-tool',
            input: {
                query: context.query,
                timeRange: context.timeRange,
                topic: context.topic,
            },
        })

        log.info('Executing Google News search', { query: context.query })

        try {
            const params: Record<string, string | number> = {
                engine: 'google_news',
                q: context.query,
                num: context.numResults,
            }

            if (typeof context.location === 'string' && context.location.length > 0) {
                params.gl = context.location
            }
            if (context.timeRange) {
                params.tbs = `qdr:${context.timeRange.charAt(0)}`
            }
            if (context.topic) {
                params.topic = context.topic
            }
            if (context.sortBy === 'date') {
                params.sort = 'date'
            }

            const response = await getJson(params)

            const newsArticles =
                response.news_results?.map(
                    (article: {
                        title: string
                        link: string
                        source: { name: string }
                        date: string
                        snippet?: string
                        thumbnail?: string
                    }) => ({
                        title: article.title,
                        link: article.link,
                        source: article.source?.name ?? 'Unknown',
                        date: article.date,
                        snippet: article.snippet ?? '',
                        thumbnail: article.thumbnail,
                    })
                ) ?? []

            const result = {
                newsArticles,
                totalResults: response.search_information?.total_results,
            }

            newsSpan?.end({ output: result })
            log.info('Google News search completed', {
                query: context.query,
                resultCount: newsArticles.length,
            })

            return result
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            newsSpan?.end({ metadata: { error: errorMessage } })
            log.error('Google News search failed', { query: context.query, error: errorMessage })
            throw new Error(`Google News search failed: ${errorMessage}`)
        }
    },
})

/**
 * Google News Lite Tool
 *
 * Lightweight version of Google News search optimized for speed.
 * Returns fewer details but faster response times.
 */
export const googleNewsLiteTool = createTool({
    id: 'google-news-lite',
    description:
        'Lightweight Google News search optimized for speed. Returns basic news article information (title, source, link) with faster response times. Best when speed is more important than comprehensive details.',
    inputSchema: googleNewsInputSchema.omit({ timeRange: true, topic: true, sortBy: true }),
    outputSchema: z.object({
        newsArticles: z
            .array(
                z.object({
                    title: z.string(),
                    link: z.string().url(),
                    source: z.string(),
                })
            )
            .describe('Array of news articles with minimal details'),
    }),
    execute: async ({ context, tracingContext }) => {
        validateSerpApiKey()

        const newsLiteSpan = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.TOOL_CALL,
            name: 'google-news-lite-tool',
            input: { query: context.query },
        })

        log.info('Executing Google News Lite search', { query: context.query })

        try {
            const params: Record<string, string | number> = {
                engine: 'google_news',
                q: context.query,
                num: context.numResults,
            }

            const response = await getJson(params)

            const newsArticles =
                response.news_results?.map(
                    (article: { title: string; link: string; source: { name: string } }) => ({
                        title: article.title,
                        link: article.link,
                        source: article.source?.name ?? 'Unknown',
                    })
                ) ?? []

            const result = { newsArticles }

            newsLiteSpan?.end({ output: result })
            log.info('Google News Lite search completed', { query: context.query, resultCount: newsArticles.length })

            return result
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            newsLiteSpan?.end({ metadata: { error: errorMessage } })
            log.error('Google News Lite search failed', { query: context.query, error: errorMessage })
            throw new Error(`Google News Lite search failed: ${errorMessage}`)
        }
    },
})

/**
 * Input schema for Google Trends
 */
const googleTrendsInputSchema = z.object({
    query: z.string().min(1).describe('The search term to analyze trends for'),
    location: z.string().default('US').describe('Country code (e.g., "US", "GB", "FR")'),
    timeRange: z
        .enum(['now-1-H', 'now-4-H', 'now-1-d', 'now-7-d', 'today-1-m', 'today-3-m', 'today-12-m', 'today-5-y'])
        .default('today-12-m')
        .describe('Time period for trend analysis'),
    category: z.number().int().optional().describe('Category ID for filtering trends'),
})

/**
 * Output schema for Google Trends
 */
const googleTrendsOutputSchema = z.object({
    interestOverTime: z
        .array(
            z.object({
                timestamp: z.string(),
                value: z.number(),
            })
        )
        .describe('Interest values over time'),
    relatedQueries: z.array(z.string()).optional().describe('Related search queries'),
    relatedTopics: z.array(z.string()).optional().describe('Related topics'),
    averageInterest: z.number().optional().describe('Average interest level over the period'),
})

/**
 * Google Trends Tool
 *
 * Analyzes search trends and interest over time for specific queries.
 * Useful for understanding topic popularity and discovering related queries.
 */
export const googleTrendsTool = createTool({
    id: 'google-trends',
    description:
        'Analyze search trends and interest over time for specific topics. Returns interest data over time, related queries, and related topics. Use to understand topic popularity, discover trending related searches, and analyze search patterns over different time periods.',
    inputSchema: googleTrendsInputSchema,
    outputSchema: googleTrendsOutputSchema,
    execute: async ({ context, tracingContext }) => {
        validateSerpApiKey()

        const trendsSpan = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.TOOL_CALL,
            name: 'google-trends-tool',
            input: {
                query: context.query,
                timeRange: context.timeRange,
            },
        })

        log.info('Executing Google Trends search', { query: context.query })

        try {
            const params: Record<string, string | number> = {
                engine: 'google_trends',
                q: context.query,
                data_type: 'TIMESERIES',
                geo: context.location,
                date: context.timeRange,
            }

            if (typeof context.category === 'number') {
                params.cat = context.category
            }

            const response = await getJson(params)

            const interestOverTime =
                response.interest_over_time?.timeline_data?.map(
                    (point: { timestamp: string; values: Array<{ value: number }> }) => ({
                        timestamp: point.timestamp,
                        value: point.values?.[0]?.value ?? 0,
                    })
                ) ?? []

            const relatedQueries = response.related_queries?.rising?.map((q: { query: string }) => q.query)

            const relatedTopics = response.related_topics?.rising?.map((t: { topic: string }) => t.topic)

            const averageInterest =
                interestOverTime.length > 0
                    ? interestOverTime.reduce((sum: number, item: { value: number }) => sum + item.value, 0) /
                      interestOverTime.length
                    : undefined

            const result = {
                interestOverTime,
                relatedQueries,
                relatedTopics,
                averageInterest,
            }

            trendsSpan?.end({ output: result })
            log.info('Google Trends search completed', { query: context.query, dataPoints: interestOverTime.length })

            return result
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            trendsSpan?.end({ metadata: { error: errorMessage } })
            log.error('Google Trends search failed', { query: context.query, error: errorMessage })
            throw new Error(`Google Trends search failed: ${errorMessage}`)
        }
    },
})

/**
 * Input schema for Google Autocomplete
 */
const googleAutocompleteInputSchema = z.object({
    query: z.string().min(1).describe('The partial search query to get suggestions for'),
    location: z.string().optional().describe('Location for localized suggestions'),
})

/**
 * Output schema for Google Autocomplete
 */
const googleAutocompleteOutputSchema = z.object({
    suggestions: z.array(z.string()).describe('Array of autocomplete suggestions'),
})

/**
 * Google Autocomplete Tool
 *
 * Provides search query suggestions based on partial input.
 * Useful for discovering related search terms and query variations.
 */
export const googleAutocompleteTool = createTool({
    id: 'google-autocomplete',
    description:
        'Get Google search suggestions for partial queries. Returns an array of autocomplete suggestions that users commonly search for. Useful for discovering related search terms, query variations, and popular searches.',
    inputSchema: googleAutocompleteInputSchema,
    outputSchema: googleAutocompleteOutputSchema,
    execute: async ({ context, tracingContext }) => {
        validateSerpApiKey()

        const autocompleteSpan = tracingContext?.currentSpan?.createChildSpan({
            type: AISpanType.TOOL_CALL,
            name: 'google-autocomplete-tool',
            input: { query: context.query },
        })

        log.info('Executing Google Autocomplete search', { query: context.query })

        try {
            const params: Record<string, string> = {
                engine: 'google_autocomplete',
                q: context.query,
            }

            if (typeof context.location === 'string' && context.location.length > 0) {
                params.gl = context.location
            }

            const response = await getJson(params)

            const suggestions = response.suggestions?.map((s: { value: string }) => s.value) ?? []

            const result = { suggestions }

            autocompleteSpan?.end({ output: result })
            log.info('Google Autocomplete completed', { query: context.query, suggestionCount: suggestions.length })

            return result
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            autocompleteSpan?.end({ metadata: { error: errorMessage } })
            log.error('Google Autocomplete failed', { query: context.query, error: errorMessage })
            throw new Error(`Google Autocomplete failed: ${errorMessage}`)
        }
    },
})
