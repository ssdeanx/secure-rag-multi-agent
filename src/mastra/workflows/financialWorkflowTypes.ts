// ---------------------------------------------
// Financial Workflow Types
// Type definitions for advanced financial analysis with Cedar OS integration
// Based on existing frontend financial state interfaces
// ---------------------------------------------

import { z } from 'zod'

// ==========================================
// Frontend-Compatible Financial Types
// ==========================================

// Match existing frontend interfaces
export interface StockData {
    id: string
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
    volume: number
    marketCap?: number
    peRatio?: number
    dividendYield?: number
    analystRating?: string
    updatedAt: string
}

export interface CryptoData {
    id: string
    symbol: string
    name: string
    price: number
    change24h: number
    changePercent24h: number
    volume24h: number
    marketCap?: number
    rank?: number
    dominance?: number
    updatedAt: string
}

export interface ForexData {
    pair: string
    rate: number
    change: number
    changePercent: number
    lastUpdated: string
}

export interface CommodityData {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
    unit: string
    lastUpdated: string
}

export interface FinancialStateData {
    watchlist: string[]
    stocks: Record<string, StockData>
    crypto: Record<string, CryptoData>
}

// ==========================================
// Financial Workflow Input/Output Types
// ==========================================

// Main workflow input schema - enhanced for Cedar integration
export const FinancialWorkflowInputSchema = z.object({
    query: z.string().min(1).describe('Financial analysis question or request'),
    jwt: z.string().min(1).describe('Authentication token'),
    analysisType: z.enum(['quick', 'comprehensive', 'portfolio', 'comparison']).default('comprehensive').describe('Type of financial analysis'),
    assetTypes: z.array(z.enum(['stock', 'crypto', 'forex', 'commodity'])).default(['stock', 'crypto']).describe('Asset types to analyze'),
    symbols: z.array(z.string()).min(1).describe('Financial symbols to analyze'),
    riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']).default('moderate').describe('Risk tolerance level'),
    timeHorizon: z.enum(['short', 'medium', 'long']).default('medium').describe('Investment time horizon'),
    cedarContext: z.object({
        watchlist: z.array(z.string()).optional().describe('User watchlist symbols'),
        stocks: z.record(z.string(), z.any()).optional().describe('Current stock data'),
        crypto: z.record(z.string(), z.any()).optional().describe('Current crypto data'),
        preferences: z.object({
            currency: z.string().default('USD'),
            notifications: z.boolean().default(true),
            autoRefresh: z.boolean().default(true),
        }).optional().describe('User financial preferences'),
    }).optional().describe('Financial-specific Cedar context'),
})

// Main workflow output schema
export const FinancialWorkflowOutputSchema = z.object({
    analysisSummary: z.object({
        query: z.string(),
        analysisType: z.string(),
        riskTolerance: z.string(),
        timeHorizon: z.string(),
        confidence: z.number().min(0).max(1),
        timestamp: z.string(),
        recommendations: z.array(z.string()),
    }),
    marketData: z.object({
        stocks: z.array(z.object({
            symbol: z.string(),
            name: z.string(),
            price: z.number(),
            change: z.number(),
            changePercent: z.number(),
            volume: z.number(),
            marketCap: z.number().optional(),
            peRatio: z.number().optional(),
            dividendYield: z.number().optional(),
            analystRating: z.string().optional(),
        })),
        crypto: z.array(z.object({
            symbol: z.string(),
            name: z.string(),
            price: z.number(),
            change24h: z.number(),
            changePercent24h: z.number(),
            volume24h: z.number(),
            marketCap: z.number().optional(),
            rank: z.number().optional(),
            dominance: z.number().optional(),
        })),
        forex: z.array(z.object({
            pair: z.string(),
            rate: z.number(),
            change: z.number(),
            changePercent: z.number(),
        })).optional(),
    }),
    technicalAnalysis: z.object({
        indicators: z.record(z.string(), z.any()),
        patterns: z.array(z.string()),
        supportResistance: z.object({
            support: z.array(z.number()),
            resistance: z.array(z.number()),
        }),
        trend: z.enum(['bullish', 'bearish', 'neutral']),
        momentum: z.number(),
    }),
    fundamentalAnalysis: z.object({
        valuation: z.object({
            fairValue: z.number().optional(),
            upside: z.number().optional(),
            downside: z.number().optional(),
        }),
        growth: z.object({
            revenueGrowth: z.number().optional(),
            earningsGrowth: z.number().optional(),
            bookValueGrowth: z.number().optional(),
        }),
        financialHealth: z.object({
            debtToEquity: z.number().optional(),
            currentRatio: z.number().optional(),
            roe: z.number().optional(),
            roa: z.number().optional(),
        }),
    }).optional(),
    recommendations: z.array(z.object({
        symbol: z.string(),
        action: z.enum(['strong_buy', 'buy', 'hold', 'sell', 'strong_sell']),
        confidence: z.number().min(0).max(1),
        reasoning: z.string(),
        priceTarget: z.number().optional(),
        timeHorizon: z.string(),
    })),
    risks: z.array(z.object({
        category: z.string(),
        description: z.string(),
        probability: z.enum(['low', 'medium', 'high']),
        impact: z.enum(['low', 'medium', 'high']),
        mitigation: z.string().optional(),
    })),
    opportunities: z.array(z.object({
        category: z.string(),
        description: z.string(),
        potential: z.enum(['low', 'medium', 'high']),
        timeframe: z.string(),
        requirements: z.array(z.string()).optional(),
    })),
    cedarActions: z.array(z.object({
        action: z.string(),
        parameters: z.record(z.string(), z.any()),
        description: z.string(),
    })).optional(),
})

// ==========================================
// Financial Query Analysis Types
// ==========================================

export const FinancialQueryAnalysisSchema = z.object({
    intent: z.enum(['analysis', 'comparison', 'portfolio', 'education', 'alert', 'trade']),
    primaryAsset: z.string(),
    secondaryAssets: z.array(z.string()),
    analysisScope: z.enum(['technical', 'fundamental', 'both']),
    complexity: z.enum(['simple', 'moderate', 'complex', 'expert']),
    requiredData: z.array(z.string()),
    riskConsiderations: z.array(z.string()),
    educationalNeeds: z.array(z.string()),
})

// ==========================================
// Financial Orchestration Strategy Types
// ==========================================

export const FinancialOrchestrationStrategySchema = z.object({
    complexity: z.enum(['simple', 'moderate', 'complex', 'expert']),
    requiredAgents: z.array(z.string()),
    parallelExecution: z.boolean(),
    qualityThreshold: z.number().min(0).max(1),
    humanInterventionRequired: z.boolean(),
    estimatedDuration: z.string(),
    communicationProtocol: z.string(),
    dataSources: z.array(z.string()),
    riskAssessment: z.enum(['conservative', 'balanced', 'aggressive']),
})

// ==========================================
// Financial Source Collection Types
// ==========================================

export const FinancialSourceCollectionSchema = z.object({
    marketData: z.array(z.object({
        symbol: z.string(),
        source: z.string(),
        timestamp: z.string(),
        data: z.record(z.string(), z.any()),
    })),
    newsArticles: z.array(z.object({
        title: z.string(),
        source: z.string(),
        url: z.string(),
        publishedAt: z.string(),
        relevanceScore: z.number(),
        sentiment: z.enum(['positive', 'neutral', 'negative']),
    })),
    analystReports: z.array(z.object({
        title: z.string(),
        analyst: z.string(),
        firm: z.string(),
        rating: z.string(),
        priceTarget: z.number(),
        date: z.string(),
    })),
})

// ==========================================
// Financial Learning Types
// ==========================================

export const FinancialLearningSchema = z.object({
    learnings: z.array(z.object({
        content: z.string(),
        category: z.enum(['technical', 'fundamental', 'market', 'risk', 'strategy']),
        importance: z.enum(['high', 'medium', 'low']),
        source: z.string(),
        applicability: z.string(),
        timestamp: z.string(),
    })),
    insights: z.array(z.object({
        insight: z.string(),
        confidence: z.number().min(0).max(1),
        marketImpact: z.enum(['low', 'medium', 'high']),
        timeHorizon: z.string(),
    })),
})

// ==========================================
// Financial Quality Assessment Types
// ==========================================

export const FinancialQualityAssessmentSchema = z.object({
    dataQuality: z.object({
        completeness: z.number().min(0).max(1),
        accuracy: z.number().min(0).max(1),
        timeliness: z.number().min(0).max(1),
        reliability: z.number().min(0).max(1),
    }),
    analysisQuality: z.object({
        technicalDepth: z.number().min(0).max(1),
        fundamentalCoverage: z.number().min(0).max(1),
        riskAssessment: z.number().min(0).max(1),
        recommendationClarity: z.number().min(0).max(1),
    }),
    overallScore: z.number().min(0).max(1),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    recommendations: z.array(z.string()),
    confidence: z.number().min(0).max(1),
})

// ==========================================
// Type Exports
// ==========================================

export type FinancialWorkflowInput = z.infer<typeof FinancialWorkflowInputSchema>
export type FinancialWorkflowOutput = z.infer<typeof FinancialWorkflowOutputSchema>
export type FinancialQueryAnalysis = z.infer<typeof FinancialQueryAnalysisSchema>
export type FinancialOrchestrationStrategy = z.infer<typeof FinancialOrchestrationStrategySchema>
export type FinancialSourceCollection = z.infer<typeof FinancialSourceCollectionSchema>
export type FinancialLearning = z.infer<typeof FinancialLearningSchema>
export type FinancialQualityAssessment = z.infer<typeof FinancialQualityAssessmentSchema>
