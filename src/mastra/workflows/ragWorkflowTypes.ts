// ---------------------------------------------
// RAG Workflow Types
// Type definitions specific to RAG Cedar integration workflows
// Based on app/protected/rag/state.ts and Cedar OS patterns
// ---------------------------------------------

import { z } from 'zod'

// ==========================================
// RAG Workflow Input/Output Types
// ==========================================

// Main workflow input schema
export const RagWorkflowInputSchema = z.object({
    prompt: z.string().min(1).describe('User query to process'),
    jwt: z.string().min(1).describe('Authentication token'),
    cedarContext: z.object({
        documents: z.array(z.object({
            id: z.string(),
            title: z.string(),
            classification: z.enum(['public', 'internal', 'confidential']),
            department: z.string(),
            tags: z.array(z.string()),
        })).optional(),
        policies: z.array(z.object({
            id: z.string(),
            role: z.string(),
            allowedClassifications: z.array(z.string()),
            allowedDepartments: z.array(z.string()),
        })).optional(),
        retrievals: z.array(z.object({
            id: z.string(),
            query: z.string(),
            documentCount: z.number(),
            timestamp: z.string(),
            userRole: z.string(),
        })).optional(),
    }).optional().describe('RAG-specific Cedar context'),
})

// Main workflow output schema
export const RagWorkflowOutputSchema = z.object({
    verifiedAnswer: z.object({
        ok: z.boolean(),
        reason: z.string(),
        answer: z.string(),
    }),
    message: z.string(),
    success: z.boolean(),
})

// ==========================================
// Internal Workflow Step Types
// ==========================================

// Access control filter
export const RagAccessFilterSchema = z.object({
    allowTags: z.array(z.string()),
    maxClassification: z.enum(['public', 'internal', 'confidential']),
})

// Document context from retrieval
export const RagDocumentContextSchema = z.object({
    text: z.string(),
    docId: z.string(),
    versionId: z.string(),
    source: z.string(),
    score: z.number(),
    securityTags: z.array(z.string()),
    classification: z.enum(['public', 'internal', 'confidential']),
})

// Generated answer with citations
export const RagAnswerSchema = z.object({
    answer: z.string(),
    citations: z.array(z.object({
        docId: z.string(),
        source: z.string(),
    })),
})

// Verification result
export const RagVerificationResultSchema = z.object({
    ok: z.boolean(),
    reason: z.string(),
    answer: z.string(),
})

// ==========================================
// Type Exports for Runtime Usage
// ==========================================

export type RagWorkflowInput = z.infer<typeof RagWorkflowInputSchema>
export type RagWorkflowOutput = z.infer<typeof RagWorkflowOutputSchema>
export type RagAccessFilter = z.infer<typeof RagAccessFilterSchema>
export type RagDocumentContext = z.infer<typeof RagDocumentContextSchema>
export type RagAnswer = z.infer<typeof RagAnswerSchema>
export type RagVerificationResult = z.infer<typeof RagVerificationResultSchema>
