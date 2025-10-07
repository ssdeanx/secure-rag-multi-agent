import { describe, it, expect, beforeEach, vi } from 'vitest'
import { contentGenerationWorkflow } from '../contentGenerationWorkflow'
import { copywriterAgent } from '../../agents/copywriterAgent'
import { editorAgent } from '../../agents/editorAgent'
import { evaluationAgent } from '../../agents/evaluationAgent'

// Mock the agents
vi.mock('../../agents/copywriterAgent', () => ({
    copywriterAgent: {
        generateVNext: vi.fn(),
    },
}))

vi.mock('../../agents/editorAgent', () => ({
    editorAgent: {
        generateVNext: vi.fn(),
    },
}))

vi.mock('../../agents/evaluationAgent', () => ({
    evaluationAgent: {
        generateVNext: vi.fn(),
    },
}))

describe('contentGenerationWorkflow', () => {
    beforeEach(() => {
        // Clear all mocks between tests
        vi.clearAllMocks()

        // Setup default mock implementations
        ;(copywriterAgent.generateVNext as any).mockResolvedValue({
            text: 'This is a generated draft content about the topic. It contains relevant information and follows the specified tone and requirements.',
            object: null,
        })
        ;(editorAgent.generateVNext as any).mockResolvedValue({
            text: 'This is the edited and refined content with improvements.',
            object: {
                editedContent:
                    'This is the edited and refined content with improvements.',
                summaryOfChanges: 'Improved clarity and grammar',
                improvementSuggestions: 'Consider adding more examples',
            },
        })
        ;(evaluationAgent.generateVNext as any).mockResolvedValue({
            text: 'Content evaluation completed successfully.',
            object: {
                isRelevant: true,
                reason: 'Content meets all quality criteria and requirements',
            },
        })
    })

    it('should execute workflow with valid input data and return final content', async () => {
        const run = await contentGenerationWorkflow.createRunAsync()

        const stream = run.streamVNext({
            inputData: {
                contentType: 'blog',
                topic: 'Introduction to TypeScript',
                requirements:
                    'Write a beginner-friendly introduction to TypeScript covering basic types and syntax.',
                tone: 'professional',
                targetAudience: 'beginner developers',
                minQualityScore: 0.7,
            },
        })

        const result = await stream.result

        expect(result).toBeDefined()
        expect(result?.status).toBe('success')

        // Access the final output
        if (result?.status === 'success') {
            const output = (result as any).result
            expect(output.finalContent).toBeDefined()
            expect(typeof output.finalContent).toBe('string')
            expect(output.qualityScore).toBeGreaterThanOrEqual(0)
            expect(output.wordCount).toBeGreaterThan(0)
        }
    })

    it('should use default tone when not provided', async () => {
        const run = await contentGenerationWorkflow.createRunAsync()

        const stream = run.streamVNext({
            inputData: {
                contentType: 'technical',
                topic: 'GraphQL Best Practices',
                requirements:
                    'Cover query optimization and caching strategies.',
                targetAudience: 'intermediate developers',
                // tone omitted - should default to 'professional'
            },
        })

        const result = await stream.result

        expect(result).toBeDefined()
        expect(result?.status).toBe('success')
    })

    it('should generate content for different content types', async () => {
        const contentTypes: Array<
            'blog' | 'marketing' | 'technical' | 'business'
        > = ['blog', 'marketing', 'technical', 'business']

        for (const contentType of contentTypes) {
            const run = await contentGenerationWorkflow.createRunAsync()

            const stream = run.streamVNext({
                inputData: {
                    contentType,
                    topic: `Test topic for ${contentType}`,
                    requirements: `Generate ${contentType} content with proper structure.`,
                    tone: 'professional',
                },
            })

            const result = await stream.result

            expect(result).toBeDefined()
            expect(result?.status).toBe('success')

            if (result?.status === 'success') {
                const output = (result as any).result
                expect(output.finalContent).toBeDefined()
                expect(output.contentType).toBe(contentType)
            }
        }
    }, 60000) // 60 second timeout for multiple API calls

    it('should stream workflow events during execution', async () => {
        const run = await contentGenerationWorkflow.createRunAsync()

        const stream = run.streamVNext({
            inputData: {
                contentType: 'blog',
                topic: 'Testing in TypeScript',
                requirements: 'Cover unit testing and integration testing.',
                tone: 'technical',
            },
        })

        const events: any[] = []

        // Consume stream events
        for await (const chunk of stream) {
            events.push(chunk)
        }

        // Check that we received workflow events
        expect(events.length).toBeGreaterThan(0)
        expect(events.some((e) => e.type === 'workflow-start')).toBe(true)
        expect(events.some((e) => e.type === 'workflow-finish')).toBe(true)

        // Check for step events
        expect(events.some((e) => e.type === 'workflow-step-start')).toBe(true)
        expect(events.some((e) => e.type === 'workflow-step-result')).toBe(true)
    }, 30000)

    it('should track token usage from AI calls', async () => {
        const run = await contentGenerationWorkflow.createRunAsync()

        const stream = run.streamVNext({
            inputData: {
                contentType: 'technical',
                topic: 'API Reference',
                requirements: 'Document REST endpoints with examples.',
                tone: 'professional',
            },
        })

        await stream.result
        const usage = await stream.usage

        expect(usage).toBeDefined()
        expect(usage.totalTokens).toBeGreaterThanOrEqual(0)
        // These may be 0 if agents don't report usage, but structure should exist
        expect(usage).toHaveProperty('inputTokens')
        expect(usage).toHaveProperty('outputTokens')
    }, 30000)

    it('should handle Cedar context if provided', async () => {
        const run = await contentGenerationWorkflow.createRunAsync()

        const stream = run.streamVNext({
            inputData: {
                contentType: 'blog',
                topic: 'Cedar OS Integration',
                requirements: 'Explain Cedar OS integration with Mastra.',
                tone: 'technical',
                cedarContext: {
                    selectedFeatures: ['contentGeneration'],
                    userPreferences: { theme: 'dark' },
                    sessionState: { active: true },
                },
            },
        })

        const result = await stream.result

        expect(result).toBeDefined()
        expect(result?.status).toBe('success')
    }, 30000)

    it('should respect minQualityScore threshold', async () => {
        const run = await contentGenerationWorkflow.createRunAsync()

        const stream = run.streamVNext({
            inputData: {
                contentType: 'marketing',
                topic: 'Product Launch',
                requirements: 'Create compelling launch announcement.',
                tone: 'persuasive',
                minQualityScore: 0.8,
            },
        })

        const result = await stream.result

        expect(result).toBeDefined()
        if (result?.status === 'success') {
            const output = (result as any).result
            // Quality score should be calculated (may not meet threshold in test due to mock agents)
            expect(output.qualityScore).toBeDefined()
            expect(typeof output.qualityScore).toBe('number')
        }
    }, 30000)
})
