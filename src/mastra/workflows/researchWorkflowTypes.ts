// ---------------------------------------------
// Research Workflow Types
// Type definitions specific to research Cedar integration workflows
// Based on app/protected/research/state.ts and research agent capabilities
// ---------------------------------------------

import { z } from 'zod'

// ==========================================
// Research Workflow Input/Output Types
// ==========================================

// Main workflow input schema
export const ResearchWorkflowInputSchema = z.object({
    query: z.string().min(1).describe('Research question or topic to investigate'),
    jwt: z.string().min(1).describe('Authentication token'),
    researchDepth: z.enum(['shallow', 'moderate', 'deep']).default('moderate').describe('Depth of research analysis'),
    sourceTypes: z.array(z.enum(['academic', 'web', 'news', 'financial', 'all'])).default(['all']).describe('Types of sources to search'),
    cedarContext: z.object({
        papers: z.array(z.object({
            id: z.string(),
            title: z.string(),
            authors: z.array(z.string()),
            abstract: z.string(),
            url: z.string(),
            publishedDate: z.string(),
            source: z.enum(['arxiv', 'scholar', 'web']),
        })).optional().describe('Existing research papers in user library'),
        sources: z.array(z.object({
            id: z.string(),
            title: z.string(),
            url: z.string(),
            content: z.string(),
            sourceType: z.enum(['web', 'pdf', 'article']),
            addedAt: z.string(),
        })).optional().describe('Collected research sources'),
        learnings: z.array(z.object({
            id: z.string(),
            content: z.string(),
            source: z.string(),
            category: z.string(),
            importance: z.enum(['high', 'medium', 'low']),
            addedAt: z.string(),
        })).optional().describe('Extracted learnings from previous research'),
    }).optional().describe('Research-specific Cedar context'),
})

// Main workflow output schema
export const ResearchWorkflowOutputSchema = z.object({
    researchSummary: z.object({
        topic: z.string(),
        keyFindings: z.array(z.string()),
        confidence: z.number().min(0).max(1),
        sourcesAnalyzed: z.number(),
    }),
    papers: z.array(z.object({
        id: z.string(),
        title: z.string(),
        authors: z.array(z.string()),
        relevance: z.number().min(0).max(1),
        url: z.string(),
    })),
    sources: z.array(z.object({
        id: z.string(),
        title: z.string(),
        url: z.string(),
        sourceType: z.enum(['web', 'pdf', 'article']),
        credibility: z.number().min(0).max(1),
    })),
    learnings: z.array(z.object({
        content: z.string(),
        category: z.string(),
        importance: z.enum(['high', 'medium', 'low']),
        source: z.string(),
    })),
    message: z.string(),
    success: z.boolean(),
})

// ==========================================
// Internal Workflow Step Types
// ==========================================

// Research query analysis
export const ResearchQueryAnalysisSchema = z.object({
    topic: z.string(),
    subTopics: z.array(z.string()),
    researchStrategy: z.enum(['academic_focused', 'web_comprehensive', 'news_current', 'financial_analysis', 'multi_source']),
    estimatedComplexity: z.enum(['low', 'medium', 'high']),
    requiredSources: z.array(z.string()),
})

// Source collection results
export const ResearchSourceCollectionSchema = z.object({
    academicPapers: z.array(z.object({
        title: z.string(),
        authors: z.array(z.string()),
        abstract: z.string(),
        url: z.string(),
        relevanceScore: z.number().min(0).max(1),
        source: z.enum(['arxiv', 'scholar']),
    })),
    webSources: z.array(z.object({
        title: z.string(),
        url: z.string(),
        content: z.string(),
        credibilityScore: z.number().min(0).max(1),
        sourceType: z.enum(['article', 'blog', 'report']),
    })),
    newsArticles: z.array(z.object({
        title: z.string(),
        url: z.string(),
        summary: z.string(),
        publishedDate: z.string(),
        relevanceScore: z.number().min(0).max(1),
    })),
    financialData: z.array(z.object({
        symbol: z.string(),
        dataType: z.enum(['quotes', 'fundamentals', 'analysis']),
        relevanceScore: z.number().min(0).max(1),
        source: z.string(),
    })),
})

// Analysis and synthesis results
export const ResearchAnalysisSchema = z.object({
    keyFindings: z.array(z.object({
        finding: z.string(),
        confidence: z.number().min(0).max(1),
        supportingSources: z.array(z.string()),
        category: z.string(),
    })),
    patterns: z.array(z.object({
        pattern: z.string(),
        frequency: z.number(),
        significance: z.enum(['high', 'medium', 'low']),
    })),
    contradictions: z.array(z.object({
        issue: z.string(),
        sources: z.array(z.string()),
        resolution: z.string().optional(),
    })),
    gaps: z.array(z.string()),
})

// Learning extraction results
export const ResearchLearningSchema = z.object({
    learnings: z.array(z.object({
        content: z.string(),
        category: z.string(),
        importance: z.enum(['high', 'medium', 'low']),
        source: z.string(),
        applicability: z.string(),
    })),
    insights: z.array(z.object({
        insight: z.string(),
        confidence: z.number().min(0).max(1),
        broaderImplications: z.string().optional(),
    })),
})

// ==========================================
// Type Exports for Runtime Usage
// ==========================================

export type ResearchWorkflowInput = z.infer<typeof ResearchWorkflowInputSchema>
export type ResearchWorkflowOutput = z.infer<typeof ResearchWorkflowOutputSchema>
export type ResearchQueryAnalysis = z.infer<typeof ResearchQueryAnalysisSchema>
export type ResearchSourceCollection = z.infer<typeof ResearchSourceCollectionSchema>
export type ResearchAnalysis = z.infer<typeof ResearchAnalysisSchema>
export type ResearchLearning = z.infer<typeof ResearchLearningSchema>
