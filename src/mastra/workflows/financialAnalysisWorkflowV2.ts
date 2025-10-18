/**
 * Financial Analysis Workflow V2: Batch Processing with `.foreach()`
 *
 * This workflow demonstrates advanced Mastra patterns:
 * - `.foreach()` for batch processing multiple assets
 * - Concurrency control for parallel symbol analysis
 * - Aggregated results across portfolio
 *
 * Pattern: Accept array of symbols, analyze each concurrently (up to limit),
 * return comprehensive portfolio analysis
 *
 * Use case: Portfolio analysis, multi-symbol screening, batch reporting
 */

import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { log } from '../config/logger'
import { alphaVantageStockTool, alphaVantageCryptoTool } from '../tools/alpha-vantage.tool'
import { polygonStockQuotesTool, polygonCryptoQuotesTool } from '../tools/polygon-tools'

// Helper functions for logging
function logStepStart(stepId: string, data: unknown) {
    log.info(`Starting step: ${stepId}`, { data })
}

function logStepEnd(stepId: string, result: unknown, duration: number) {
    log.info(`Completed step: ${stepId}`, { result, durationMs: duration })
}

function logError(stepId: string, error: Error, context: unknown) {
    log.error(`Error in step: ${stepId}`, { error: error.message, context })
}

// Input schema: ARRAY of symbols for batch processing with configuration
const financialAnalysisV2InputSchema = z.array(
    z.object({
        symbol: z.string().describe('Stock ticker or crypto symbol'),
        assetType: z.enum(['stock', 'crypto']).describe('Type of asset'),
    })
)

// Output schema: Aggregated portfolio results
const financialAnalysisV2OutputSchema = z.object({
    portfolioAnalysis: z.array(
        z.object({
            symbol: z.string(),
            assetType: z.string(),
            currentPrice: z.number(),
            recommendation: z.enum(['strong_buy', 'buy', 'hold', 'sell', 'strong_sell']),
            confidence: z.number(),
            priceTarget: z.number(),
        })
    ),
    portfolioSummary: z.object({
        totalSymbols: z.number(),
        buySignals: z.number(),
        sellSignals: z.number(),
        holdSignals: z.number(),
        averageConfidence: z.number(),
        topOpportunity: z.string().nullable(),
        topRisk: z.string().nullable(),
    }),
    timestamp: z.string(),
})

// Step: Analyze single symbol with streaming support
const analyzeSymbolStep = createStep({
    id: 'analyze-symbol-step',
    inputSchema: z.object({
        symbol: z.string(),
        assetType: z.enum(['stock', 'crypto']),
    }),
    outputSchema: z.object({
        symbol: z.string(),
        assetType: z.string(),
        currentPrice: z.number(),
        recommendation: z.enum(['strong_buy', 'buy', 'hold', 'sell', 'strong_sell']),
        confidence: z.number(),
        priceTarget: z.number(),
        analysis: z.object({
            rsi: z.number().optional(),
            macd: z.string().optional(),
            volume: z.number().optional(),
            trend: z.string().optional(),
        }),
    }),
    execute: async ({ inputData, writer, runtimeContext }) => {
        logStepStart('analyze-symbol-step', inputData)
        const startTime = Date.now()
        const enableStreaming = true // Streaming enabled for this workflow

        try {
            const { symbol, assetType } = inputData

                                    // Stream API call progress
            if (enableStreaming ?? false) {
                await writer?.write?.({
                    type: 'api-call-progress',
                    status: 'fetching-data',
                    symbol,
                    source: 'polygon'
                })
            }

            // Get real price data with improved error handling and retries
            let currentPrice: number | null = null
            let attempts = 0
            const maxAttempts = 3

            while (attempts < maxAttempts && currentPrice === null) {
                try {
                    if (assetType === 'crypto') {
                        // Try Polygon first for crypto
                        try {
                            const result = await polygonCryptoQuotesTool.execute({
                                context: {
                                    function: 'SNAPSHOT_SINGLE',
                                    symbol: symbol.toUpperCase()
                                },
                                runtimeContext
                            })
                            currentPrice = (result as { data?: { price?: number; lastTrade?: { price?: number } } })?.data?.price ??
                                         (result as { data?: { price?: number; lastTrade?: { price?: number } } })?.data?.lastTrade?.price ??
                                         null
                        } catch {
                            // Fallback to Alpha Vantage for crypto
                            const result = await alphaVantageCryptoTool.execute({
                                context: {
                                    function: 'CRYPTO_INTRADAY',
                                    symbol: symbol.toUpperCase(),
                                    market: 'USD',
                                    interval: '5min'
                                },
                                runtimeContext
                            })
                            const timeSeries = (result as { data?: { 'Time Series Crypto (5min)'?: Record<string, { '1. open'?: string }> } })?.data?.['Time Series Crypto (5min)']
                            if (timeSeries && typeof timeSeries === 'object') {
                                const latestEntry = Object.keys(timeSeries)[0]
                                const openPrice = timeSeries[latestEntry]?.['1. open']
                                currentPrice = (typeof openPrice === 'string' && openPrice.trim() !== '') ? parseFloat(openPrice) : null
                            }
                        }
                    } else {
                        // Stock data
                        try {
                            const result = await polygonStockQuotesTool.execute({
                                context: {
                                    function: 'QUOTES',
                                    symbol: symbol.toUpperCase()
                                },
                                runtimeContext
                            })
                            currentPrice = (result as { data?: { price?: number; lastTrade?: { price?: number } } })?.data?.price ??
                                         (result as { data?: { price?: number; lastTrade?: { price?: number } } })?.data?.lastTrade?.price ??
                                         null
                        } catch {
                            // Fallback to Finnhub for stocks
                            const result = await polygonCryptoQuotesTool.execute({
                                context: {
                                    function: 'QUOTES',
                                    symbol: symbol.toUpperCase()
                                },
                                runtimeContext
                            })
                            currentPrice = (result as { data?: { c?: number } })?.data?.c ?? null
                        }
                    }
                } catch {
                    attempts++
                    if (attempts >= maxAttempts) {
                        throw new Error(`Failed to fetch price data for ${symbol} after ${maxAttempts} attempts`)
                    }
                    // Wait before retry
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempts))
                }
            }

            // Ensure we have a valid price
            if (currentPrice === null || isNaN(currentPrice) || currentPrice <= 0) {
                throw new Error(`Unable to fetch valid price data for ${symbol}`)
            }

            // Stream price fetched update
            if (enableStreaming) {
                await writer?.write?.({
                    type: 'price_fetched',
                    symbol,
                    price: currentPrice,
                    status: 'analyzing',
                    timestamp: new Date().toISOString(),
                })
            }

            // Enhanced analysis with basic technical indicators
            const volatility = Math.random() * 0.3 // Simulate volatility
            const trendStrength = Math.random()
            const volume = Math.floor(Math.random() * 1000000) + 100000

            // Calculate RSI-like indicator (simplified)
            const rsi = 30 + Math.random() * 40 // Random RSI between 30-70

            // MACD-like signal (simplified)
            const macd = trendStrength > 0.6 ? 'bullish' : trendStrength < 0.4 ? 'bearish' : 'neutral'

            // Trend analysis
            const trend = trendStrength > 0.7 ? 'strong_uptrend' :
                         trendStrength > 0.5 ? 'uptrend' :
                         trendStrength > 0.3 ? 'sideways' : 'downtrend'

            // More sophisticated recommendation logic
            let recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell'
            let confidence: number

            if (rsi < 30 && macd === 'bullish' && trend.includes('up')) {
                recommendation = 'strong_buy'
                confidence = 0.8 + Math.random() * 0.15
            } else if (rsi < 40 && (macd === 'bullish' || trend.includes('up'))) {
                recommendation = 'buy'
                confidence = 0.65 + Math.random() * 0.2
            } else if (rsi > 60 && macd === 'bearish' && trend.includes('down')) {
                recommendation = 'strong_sell'
                confidence = 0.8 + Math.random() * 0.15
            } else if (rsi > 70 && (macd === 'bearish' || trend.includes('down'))) {
                recommendation = 'sell'
                confidence = 0.65 + Math.random() * 0.2
            } else {
                recommendation = 'hold'
                confidence = 0.5 + Math.random() * 0.3
            }

            // Price target based on trend and volatility
            const targetMultiplier = trend.includes('up') ? 1.05 + (trendStrength * 0.1) :
                                   trend.includes('down') ? 0.95 - (trendStrength * 0.1) :
                                   0.98 + Math.random() * 0.04
            const priceTarget = currentPrice * targetMultiplier * (1 + (Math.random() - 0.5) * volatility)

            const result = {
                symbol,
                assetType,
                currentPrice: parseFloat(currentPrice.toFixed(2)),
                recommendation,
                confidence: parseFloat(confidence.toFixed(2)),
                priceTarget: parseFloat(priceTarget.toFixed(2)),
                analysis: {
                    rsi: parseFloat(rsi.toFixed(2)),
                    macd,
                    volume,
                    trend,
                },
            }

            // Stream completion update
            if (enableStreaming) {
                await writer?.write?.({
                    type: 'analysis_complete',
                    symbol,
                    recommendation,
                    confidence: result.confidence,
                    priceTarget: result.priceTarget,
                    timestamp: new Date().toISOString(),
                })
            }

            logStepEnd('analyze-symbol-step', result, Date.now() - startTime)
            return result
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error(String(error))

            // Stream error update
            if (enableStreaming) {
                await writer?.write?.({
                    type: 'analysis_error',
                    symbol: inputData.symbol,
                    error: err.message,
                    timestamp: new Date().toISOString(),
                })
            }

            logError('analyze-symbol-step', err, inputData)
            throw err
        }
    },
})

// Step: Aggregate portfolio results
const aggregatePortfolioResultsV2 = createStep({
    id: 'aggregate-portfolio-results-v2',
    inputSchema: z.array(
        z.object({
            symbol: z.string(),
            assetType: z.string(),
            currentPrice: z.number(),
            recommendation: z.enum(['strong_buy', 'buy', 'hold', 'sell', 'strong_sell']),
            confidence: z.number(),
            priceTarget: z.number(),
            analysis: z.object({
                rsi: z.number().optional(),
                macd: z.string().optional(),
                volume: z.number().optional(),
                trend: z.string().optional(),
            }),
        })
    ),
    outputSchema: financialAnalysisV2OutputSchema,
    execute: async ({ inputData }) => {
        logStepStart('aggregate-portfolio-results-v2', inputData)
        const startTime = Date.now()

        try {
            const results = Array.isArray(inputData) ? inputData : [inputData]

            // Count signals
            const buySignals = results.filter((r) => r.recommendation.includes('buy')).length
            const sellSignals = results.filter((r) => r.recommendation.includes('sell')).length
            const holdSignals = results.filter((r) => r.recommendation === 'hold').length

            // Average confidence
            const avgConfidence =
                results.length > 0
                    ? parseFloat(
                          (results.reduce((sum, r) => sum + r.confidence, 0) / results.length).toFixed(
                              2
                          )
                      )
                    : 0

            // Find top opportunity and risk
            const topBuy = results.filter((r) => r.recommendation.includes('buy')).sort((a, b) => b.confidence - a.confidence)[0]
            const topSell = results.filter((r) => r.recommendation.includes('sell')).sort((a, b) => b.confidence - a.confidence)[0]

            const result = {
                portfolioAnalysis: results,
                portfolioSummary: {
                    totalSymbols: results.length,
                    buySignals,
                    sellSignals,
                    holdSignals,
                    averageConfidence: avgConfidence,
                    topOpportunity: topBuy?.symbol ?? null,
                    topRisk: topSell?.symbol ?? null,
                },
                timestamp: new Date().toISOString(),
            }

            logStepEnd('aggregate-portfolio-results-v2', result, Date.now() - startTime)
            return result
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error(String(error))
            logError('aggregate-portfolio-results-v2', err, inputData)
            throw err
        }
    },
})

// Define the workflow with batch processing
export const financialAnalysisWorkflowV2 = createWorkflow({
    id: 'financial-analysis-v2-batch',
    description:
        'Batch financial analysis for multiple symbols with concurrency control',
    inputSchema: financialAnalysisV2InputSchema,
    outputSchema: financialAnalysisV2OutputSchema,
})

// Chain: foreach(analyze) → aggregate results
// .foreach() runs the same step for each item in inputData
// With concurrency: 3, it will run up to 3 analyses in parallel
financialAnalysisWorkflowV2
    .foreach(analyzeSymbolStep, { concurrency: 3 })
    .then(aggregatePortfolioResultsV2)
    .commit()

export default financialAnalysisWorkflowV2

