// ---------------------------------------------
// RAG Chat Workflow for Cedar OS Integration
// Wraps Governed RAG pipeline for Cedar OS compatibility
// ---------------------------------------------

import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { logStepStart, logStepEnd, logError } from '../config/logger'
import { AuthenticationService } from '../services/AuthenticationService'
import { retrieveAgent } from '../agents/retrieve.agent'
import { rerankAgent } from '../agents/rerank.agent'
import { answererAgent } from '../agents/answerer.agent'
import { verifierAgent } from '../agents/verifier.agent'
import {
    RagWorkflowInputSchema,
    RagAccessFilterSchema,
    RagDocumentContextSchema,
    RagAnswerSchema,
    RagVerificationResultSchema,
} from './ragWorkflowTypes'

// ---------------------------------------------
// Cedar OS Integration Types for RAG Workflow
// Based on app/protected/rag/state.ts and context.ts
// ---------------------------------------------

// ---------------------------------------------
// RAG Chat Workflow for Cedar OS Integration
// Uses dedicated RAG workflow types from ragWorkflowTypes.ts
// ---------------------------------------------

export const RagChatInputSchema = RagWorkflowInputSchema

// Step 1: Build Context
const buildContextStep = createStep({
    id: 'rag-build-context',
    description: 'Extract question and JWT from Cedar input',
    inputSchema: RagChatInputSchema,
    outputSchema: z.object({
        jwt: z.string(),
        question: z.string(),
        cedarContext: z.unknown().optional(),
    }),
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('rag-build-context', { hasPrompt: !!inputData.prompt })

        try {
            const { jwt, prompt } = inputData
            const question = prompt?.trim()
            if (!question) {
                throw new Error('Question cannot be empty')
            }

            if (!jwt) {
                throw new Error('JWT token is required')
            }

            const output = {
                jwt,
                question,
                cedarContext: inputData.cedarContext,
            }

            logStepEnd('rag-build-context', { questionLength: question.length }, Date.now() - startTime)
            return output
        } catch (error) {
            logError('rag-build-context', error, { prompt: inputData.prompt })
            throw error
        }
    },
})

// Step 2: Authenticate & Authorize
const authenticationStep = createStep({
    id: 'rag-authentication',
    description: 'Verify JWT token and generate access policy',
    inputSchema: z.object({
        jwt: z.string(),
        question: z.string(),
        cedarContext: z.unknown().optional(),
    }),
    outputSchema: z.object({
        accessFilter: RagAccessFilterSchema,
        question: z.string(),
        cedarContext: z.unknown().optional(),
    }),
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('rag-authentication', { hasJwt: !!inputData.jwt })

        try {
            const { accessFilter } = await AuthenticationService.authenticateAndAuthorize(inputData.jwt)
            const validatedFilter = RagAccessFilterSchema.parse(accessFilter)

            const output = {
                accessFilter: validatedFilter,
                question: inputData.question,
                cedarContext: inputData.cedarContext,
            }

            logStepEnd(
                'rag-authentication',
                {
                    allowTags: validatedFilter.allowTags,
                    maxClassification: validatedFilter.maxClassification,
                },
                Date.now() - startTime
            )

            return output
        } catch (error) {
            logError('rag-authentication', error, { question: inputData.question })
            throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    },
})

// Step 3: Retrieve & Rerank
const retrievalStep = createStep({
    id: 'rag-retrieval-rerank',
    description: 'Retrieve documents with security filters and rerank by relevance',
    inputSchema: z.object({
        accessFilter: RagAccessFilterSchema,
        question: z.string(),
        cedarContext: z.unknown().optional(),
    }),
    outputSchema: z.object({
        contexts: z.array(RagDocumentContextSchema),
        question: z.string(),
        cedarContext: z.unknown().optional(),
    }),
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('rag-retrieval-rerank', {
            accessFilter: inputData.accessFilter.allowTags,
            question: inputData.question.substring(0, 50),
        })

        try {
            // Retrieve documents
            const retrieveResult = await retrieveAgent.generate(
                JSON.stringify({
                    question: inputData.question,
                    access: inputData.accessFilter,
                }),
                { toolChoice: 'required' }
            )

            // Parse contexts from tool results
            const contexts = retrieveResult.toolResults?.[0]?.payload?.result?.contexts ?? []
            if (!Array.isArray(contexts) || contexts.length === 0) {
                throw new Error('No documents found matching query and access permissions')
            }

            // Rerank if more than 3 documents
            let finalContexts = contexts
            if (contexts.length > 3) {
                const rerankResult = await rerankAgent.generate(
                    JSON.stringify({
                        question: inputData.question,
                        contexts,
                    })
                )
                finalContexts = rerankResult.toolResults?.[0]?.payload?.result?.contexts ?? contexts
            }

            logStepEnd(
                'rag-retrieval-rerank',
                {
                    retrievedCount: contexts.length,
                    finalCount: finalContexts.length,
                },
                Date.now() - startTime
            )

            return {
                contexts: finalContexts,
                question: inputData.question,
                cedarContext: inputData.cedarContext,
            }
        } catch (error) {
            logError('rag-retrieval-rerank', error, {
                question: inputData.question,
                accessFilter: inputData.accessFilter,
            })
            throw error
        }
    },
})

// Step 4: Generate Answer
const answerStep = createStep({
    id: 'rag-answer',
    description: 'Generate answer from retrieved documents',
    inputSchema: z.object({
        contexts: z.array(RagDocumentContextSchema),
        question: z.string(),
        cedarContext: z.unknown().optional(),
    }),
    outputSchema: z.object({
        answer: RagAnswerSchema,
        cedarContext: z.unknown().optional(),
    }),
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('rag-answer', {
            contextCount: inputData.contexts.length,
        })

        try {
            const answererResult = await answererAgent.generate(
                JSON.stringify({
                    question: inputData.question,
                    contexts: inputData.contexts,
                })
            )

            const answer = RagAnswerSchema.parse(
                answererResult.toolResults?.[0]?.payload?.result ?? { answer: answererResult.text, citations: [] }
            )

            logStepEnd(
                'rag-answer',
                {
                    answerLength: answer.answer.length,
                    citationCount: answer.citations.length,
                },
                Date.now() - startTime
            )

            return {
                answer,
                cedarContext: inputData.cedarContext,
            }
        } catch (error) {
            logError('rag-answer', error, {
                question: inputData.question,
                contextCount: inputData.contexts.length,
            })
            throw error
        }
    },
})

// Step 5: Verify Answer
const verifyStep = createStep({
    id: 'rag-verify',
    description: 'Verify answer compliance and accuracy',
    inputSchema: z.object({
        answer: RagAnswerSchema,
        cedarContext: z.unknown().optional(),
    }),
    outputSchema: z.object({
        verifiedAnswer: RagVerificationResultSchema,
        message: z.string(),
        success: z.boolean(),
    }),
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('rag-verify', {
            answerLength: inputData.answer.answer.length,
        })

        try {
            const verifierResult = await verifierAgent.generate(JSON.stringify({ answer: inputData.answer }))

            const verified = RagVerificationResultSchema.parse(
                verifierResult.toolResults?.[0]?.payload?.result ?? { ok: true, reason: '', answer: inputData.answer.answer }
            )

            logStepEnd(
                'rag-verify',
                {
                    verificationOk: verified.ok,
                    reason: verified.reason,
                },
                Date.now() - startTime
            )

            return {
                verifiedAnswer: verified,
                message: verified.ok ? 'RAG query completed successfully' : `Verification concern: ${verified.reason}`,
                success: verified.ok,
            }
        } catch (error) {
            logError('rag-verify', error, {
                answerLength: inputData.answer.answer.length,
            })
            throw error
        }
    },
})

// Create the RAG Chat Workflow
export const ragChatWorkflow = createWorkflow({
    id: 'rag-chat-workflow',
    inputSchema: RagChatInputSchema,
    outputSchema: z.object({
        verifiedAnswer: RagVerificationResultSchema,
        message: z.string(),
        success: z.boolean(),
    }),
})
    .then(buildContextStep)
    .then(authenticationStep)
    .then(retrievalStep)
    .then(answerStep)
    .then(verifyStep)

ragChatWorkflow.commit()
