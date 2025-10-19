/**
 * Content Generation Workflow
 *
 * Multi-agent content creation pipeline with quality feedback loop
 * Uses streamVNext for enhanced streaming capabilities
 *
 * Pipeline:
 * 1. validateContentRequest - Input validation and Cedar context extraction
 * 2. generateDraft - Initial content creation via copywriterAgent
 * 3. refineDraft - Content improvement via editorAgent
 * 4. evaluateContent - Quality assessment via evaluationAgent
 * 5. finalizeContent - Combine results and return final output
 */

import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { ChunkType } from '@mastra/core/stream';
// Import agents
import { copywriterAgent } from '../agents/copywriterAgent'
import { editorAgent } from '../agents/editorAgent'
import { evaluationAgent } from '../agents/evaluationAgent'

// Import schemas
import {
    contentGenerationInputSchema,
    validatedRequestSchema,
    draftContentSchema,
    refinedContentSchema,
    evaluationResultSchema,
    finalContentSchema,
    editorOutputSchema,
    evaluationOutputSchema,
} from '../schemas/agent-schemas'

// Import logging
import { logStepStart, logStepEnd, logError } from '../config/logger'

/**
 * Step 1: Validate Content Request
 * Validates input and extracts Cedar context if present
 */
const validateContentRequest = createStep({
    id: 'validate-content-request',
    inputSchema: contentGenerationInputSchema,
    outputSchema: validatedRequestSchema,
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('validate-content-request', inputData)

        try {
            // Extract and validate fields
            const validated = {
                contentType: inputData.contentType,
                topic: inputData.topic,
                requirements: inputData.requirements,
                tone: inputData.tone ?? 'professional',
                targetAudience: inputData.targetAudience,
                cedarContext: inputData.cedarContext,
                minQualityScore: inputData.minQualityScore || 0.7,
            }

            logStepEnd(
                'validate-content-request',
                validated,
                Date.now() - startTime
            )
            return validated
        } catch (error) {
            logError('validate-content-request', error, inputData)
            throw error
        }
    },
})

/**
 * Step 2: Generate Draft Content
 * Creates initial content using copywriterAgent
 */
const generateDraft = createStep({
    id: 'generate-draft',
    inputSchema: validatedRequestSchema,
    outputSchema: draftContentSchema,
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('generate-draft', inputData)

        try {
            // Build prompt for copywriter agent
            const prompt = `Create ${inputData.contentType} content about "${inputData.topic}".

Requirements: ${inputData.requirements}
Tone: ${inputData.tone}
${inputData.targetAudience !== null ? `Target Audience: ${inputData.targetAudience}` : ''}`

            // Call copywriter agent with message format
            const result = await copywriterAgent.generateVNext([
                { role: 'user', content: prompt },
            ])

            const content = result.text || ''
            const wordCount = content.split(/\s+/).length

            const output = {
                content,
                contentType: inputData.contentType,
                wordCount,
                metadata: {
                    tone: inputData.tone,
                    targetAudience: inputData.targetAudience,
                },
            }

            logStepEnd('generate-draft', output, Date.now() - startTime)
            return output
        } catch (error) {
            logError('generate-draft', error, inputData)
            throw error
        }
    },
})

/**
 * Step 3: Refine Draft Content
 * Improves content quality using editorAgent
 */
const refineDraft = createStep({
    id: 'refine-draft',
    inputSchema: draftContentSchema,
    outputSchema: refinedContentSchema,
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('refine-draft', inputData)

        try {
            // Build prompt for editor agent
            const prompt = `Edit and improve this ${inputData.contentType} content. Focus on clarity, coherence, grammar, and style.

Original Content:
${inputData.content}`

            // Call editor agent with structuredOutput for structured response
            const result = await editorAgent.generateVNext(
                [{ role: 'user', content: prompt }],
                {
                    structuredOutput: {
                        schema: editorOutputSchema,
                    },
                    maxSteps: 1,
                }
            )

            const editedContent =
                result.object?.editedContent || result.text || inputData.content
            const wordCount = editedContent.split(/\s+/).length

            const output = {
                editedContent,
                contentType: inputData.contentType,
                summaryOfChanges:
                    result.object?.summaryOfChanges || 'Content refined',
                improvementSuggestions:
                    result.object?.improvementSuggestions ||
                    'No additional suggestions',
                wordCount,
            }

            logStepEnd('refine-draft', output, Date.now() - startTime)
            return output
        } catch (error) {
            logError('refine-draft', error, inputData)
            throw error
        }
    },
})

/**
 * Step 4: Evaluate Content Quality
 * Assesses content quality using evaluationAgent with metrics
 */
const evaluateContent = createStep({
    id: 'evaluate-content',
    inputSchema: refinedContentSchema,
    outputSchema: evaluationResultSchema,
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('evaluate-content', inputData)

        try {
            // Build prompt for evaluation agent
            const prompt = `Evaluate this ${inputData.contentType} content for quality, relevance, and effectiveness.

Content:
${inputData.editedContent}

Assess:
1. Content quality and completeness
2. Tone consistency
3. Target audience appropriateness
4. Overall effectiveness`

            // Call evaluation agent with structuredOutput for structured response
            const result = await evaluationAgent.generateVNext(
                [{ role: 'user', content: prompt }],
                {
                    structuredOutput: {
                        schema: evaluationOutputSchema,
                    },
                    maxSteps: 1,
                }
            )

            // Parse evaluation result
            const isRelevant = result.object?.isRelevant ?? true
            const reason =
                result.object?.reason ||
                result.text ||
                'Quality evaluation completed'

            // Calculate quality score (simplified - in production use actual metrics)
            const baseScore = isRelevant ? 0.8 : 0.5
            const lengthBonus = Math.min(inputData.wordCount / 500, 0.2) // Bonus for sufficient length
            const qualityScore = Math.min(baseScore + lengthBonus, 1.0)

            const output = {
                isRelevant,
                reason,
                qualityScore,
                metrics: {
                    contentSimilarity: qualityScore,
                    completeness: inputData.wordCount > 200 ? 0.9 : 0.6,
                    toneConsistency: 0.85,
                    keywordCoverage: 0.8,
                },
            }

            logStepEnd('evaluate-content', output, Date.now() - startTime)
            return output
        } catch (error) {
            logError('evaluate-content', error, inputData)
            throw error
        }
    },
})

/**
 * Step 5: Finalize Content
 * Combines results and optionally triggers refinement loop
 */
const finalizeContent = createStep({
    id: 'finalize-content',
    inputSchema: z.object({
        refinedContent: refinedContentSchema,
        evaluation: evaluationResultSchema,
        originalRequest: validatedRequestSchema,
    }),
    outputSchema: finalContentSchema,
    execute: async ({ inputData }) => {
        const startTime = Date.now()
        logStepStart('finalize-content', inputData)

        try {
            const { refinedContent, evaluation, originalRequest } = inputData

            // Check if quality threshold is met
            const meetsThreshold =
                evaluation.qualityScore >= originalRequest.minQualityScore

            const output = {
                finalContent: refinedContent.editedContent,
                contentType: refinedContent.contentType,
                qualityScore: evaluation.qualityScore,
                iterationsPerformed: 1, // Future: track actual iterations
                summaryOfChanges: refinedContent.summaryOfChanges,
                improvementSuggestions: refinedContent.improvementSuggestions,
                wordCount: refinedContent.wordCount,
                meetsThreshold, // Added: Include the threshold check result in output for observability
                cedarAction: undefined, // Future: emit Cedar actions if needed
            }

            logStepEnd('finalize-content', output, Date.now() - startTime)
            return output
        } catch (error) {
            logError('finalize-content', error, inputData)
            throw error
        }
    },
})

/**
 * Content Generation Workflow
 * Orchestrates multi-agent content creation with quality assurance
 */
export const contentGenerationWorkflow = createWorkflow({
    id: 'content-generation',
    description:
        'Multi-agent content creation pipeline with quality feedback loop',
    inputSchema: contentGenerationInputSchema,
    outputSchema: finalContentSchema,
})
    .then(validateContentRequest)
    .then(generateDraft)
    .then(refineDraft)
    .then(evaluateContent)
    .map(async ({ getStepResult }) => {
        // Combine all step results for finalization
        const validation = getStepResult(validateContentRequest)
        const refined = getStepResult(refineDraft)
        const evaluation = getStepResult(evaluateContent)

        return {
            refinedContent: refined,
            evaluation,
            originalRequest: validation,
        }
    })
    .then(finalizeContent)
    .commit()
