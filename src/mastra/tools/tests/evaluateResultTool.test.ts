/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { evaluateResultTool } from '../evaluateResultTool'

// Mock external dependencies
vi.mock('../config/logger', () => ({
    log: {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
    },
}))

describe('Evaluate Result Tool', () => {
    const mockRuntimeContext = {} as any
    let mockSpan: any
    const mockTracingContext = {
        currentSpan: {
            createChildSpan: vi.fn().mockImplementation(() => {
                mockSpan = { end: vi.fn() }
                return mockSpan
            }),
        },
    } as any

    let mockAgent: any
    let mockMastra: any

    beforeEach(() => {
        vi.clearAllMocks()
        mockSpan = undefined

        // Reset the mock implementation after clearing
        mockTracingContext.currentSpan.createChildSpan.mockImplementation(
            () => {
                mockSpan = { end: vi.fn() }
                return mockSpan
            }
        )

        // Mock the agent
        mockAgent = {
            generate: vi.fn(),
        }

        // Mock mastra
        mockMastra = {
            getAgent: vi.fn().mockReturnValue(mockAgent),
        }
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('successful evaluation', () => {
        it('should evaluate result as relevant', async () => {
            const mockResponse = {
                object: {
                    isRelevant: true,
                    reason: 'This result directly addresses the query about machine learning algorithms',
                },
            }
            mockAgent.generate.mockResolvedValue(mockResponse)

            const result = await (evaluateResultTool as any).execute({
                context: {
                    query: 'What are the best machine learning algorithms?',
                    result: {
                        title: 'Top 10 Machine Learning Algorithms',
                        url: 'https://example.com/ml-algorithms',
                        content:
                            'This article covers the most important machine learning algorithms including...',
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual({
                isRelevant: true,
                reason: 'This result directly addresses the query about machine learning algorithms',
            })

            expect(mockMastra.getAgent).toHaveBeenCalledWith('evaluationAgent')
            expect(mockAgent.generate).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        role: 'user',
                        content: expect.stringContaining(
                            'Evaluate whether this search result is relevant'
                        ),
                    }),
                ]),
                expect.objectContaining({
                    experimental_output: expect.any(Object),
                })
            )
        })

        it('should evaluate result as not relevant', async () => {
            const mockResponse = {
                object: {
                    isRelevant: false,
                    reason: 'This result is about cooking recipes, not programming tutorials',
                },
            }
            mockAgent.generate.mockResolvedValue(mockResponse)

            const result = await (evaluateResultTool as any).execute({
                context: {
                    query: 'JavaScript programming tutorials',
                    result: {
                        title: 'Delicious Chocolate Chip Cookie Recipe',
                        url: 'https://example.com/cookies',
                        content:
                            'Learn how to bake the perfect chocolate chip cookies...',
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual({
                isRelevant: false,
                reason: 'This result is about cooking recipes, not programming tutorials',
            })
        })

        it('should handle evaluation with existing URLs', async () => {
            const mockResponse = {
                object: {
                    isRelevant: true,
                    reason: 'This is a new relevant result',
                },
            }
            mockAgent.generate.mockResolvedValue(mockResponse)

            const result = await (evaluateResultTool as any).execute({
                context: {
                    query: 'React best practices',
                    result: {
                        title: 'React Performance Tips',
                        url: 'https://example.com/react-tips',
                        content: 'Optimizing React applications...',
                    },
                    existingUrls: [
                        'https://example.com/old-article',
                        'https://example.com/another-old',
                    ],
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result.isRelevant).toBe(true)
            expect(mockAgent.generate).toHaveBeenCalled()
        })
    })

    describe('URL filtering', () => {
        it('should return false for already processed URL', async () => {
            const result = await (evaluateResultTool as any).execute({
                context: {
                    query: 'Test query',
                    result: {
                        title: 'Test Title',
                        url: 'https://example.com/duplicate',
                        content: 'Test content',
                    },
                    existingUrls: [
                        'https://example.com/old',
                        'https://example.com/duplicate',
                    ],
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual({
                isRelevant: false,
                reason: 'URL already processed',
            })

            expect(mockAgent.generate).not.toHaveBeenCalled()
            expect(mockSpan.end).toHaveBeenCalledWith({
                output: { isRelevant: false, reason: 'URL already processed' },
            })
        })

        it('should proceed with evaluation when no existing URLs provided', async () => {
            const mockResponse = {
                object: {
                    isRelevant: true,
                    reason: 'First time seeing this URL',
                },
            }
            mockAgent.generate.mockResolvedValue(mockResponse)

            const result = await (evaluateResultTool as any).execute({
                context: {
                    query: 'Test query',
                    result: {
                        title: 'Test Title',
                        url: 'https://example.com/new',
                        content: 'Test content',
                    },
                    // existingUrls not provided
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result.isRelevant).toBe(true)
            expect(mockAgent.generate).toHaveBeenCalled()
        })
    })

    describe('error handling', () => {
        it('should handle agent generation errors', async () => {
            const error = new Error('Agent evaluation failed')
            mockAgent.generate.mockRejectedValue(error)

            const result = await (evaluateResultTool as any).execute({
                context: {
                    query: 'Test query',
                    result: {
                        title: 'Test Title',
                        url: 'https://example.com/test',
                        content: 'Test content',
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual({
                isRelevant: false,
                reason: 'Error in evaluation',
            })

            expect(mockSpan.end).toHaveBeenCalledWith({
                metadata: { error: 'Agent evaluation failed' },
            })
        })

        it('should handle non-Error exceptions', async () => {
            mockAgent.generate.mockRejectedValue('String error message')

            const result = await (evaluateResultTool as any).execute({
                context: {
                    query: 'Test query',
                    result: {
                        title: 'Test Title',
                        url: 'https://example.com/test',
                        content: 'Test content',
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual({
                isRelevant: false,
                reason: 'Error in evaluation',
            })

            expect(mockSpan.end).toHaveBeenCalledWith({
                metadata: { error: 'String error message' },
            })
        })

        it('should handle mastra not available', async () => {
            const result = await (evaluateResultTool as any).execute({
                context: {
                    query: 'Test query',
                    result: {
                        title: 'Test Title',
                        url: 'https://example.com/test',
                        content: 'Test content',
                    },
                },
                mastra: null as any, // mastra not available
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual({
                isRelevant: false,
                reason: 'Internal error: mastra not available',
            })

            expect(mockSpan.end).toHaveBeenCalledWith({
                metadata: { error: 'Mastra instance is not available' },
            })
        })
    })

    describe('tracing', () => {
        it('should create and end tracing spans correctly', async () => {
            const mockResponse = {
                object: {
                    isRelevant: true,
                    reason: 'Relevant result found',
                },
            }
            mockAgent.generate.mockResolvedValue(mockResponse)

            await (evaluateResultTool as any).execute({
                context: {
                    query: 'Machine learning algorithms',
                    result: {
                        title: 'ML Algorithms Guide',
                        url: 'https://example.com/ml-guide',
                        content: 'Comprehensive guide to ML algorithms...',
                    },
                    existingUrls: [
                        'https://example.com/old1',
                        'https://example.com/old2',
                    ],
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(
                mockTracingContext.currentSpan.createChildSpan
            ).toHaveBeenCalledWith({
                type: expect.any(String),
                name: 'evaluate_result',
                input: {
                    query: 'Machine learning algorithms',
                    url: 'https://example.com/ml-guide',
                    existingUrlsCount: 2,
                },
            })

            expect(mockSpan.end).toHaveBeenCalledWith({
                output: {
                    isRelevant: true,
                    reason: 'Relevant result found',
                },
            })
        })

        it('should handle tracing on error', async () => {
            const error = new Error('Evaluation error')
            mockAgent.generate.mockRejectedValue(error)

            await (evaluateResultTool as any).execute({
                context: {
                    query: 'Test query',
                    result: {
                        title: 'Test Title',
                        url: 'https://example.com/test',
                        content: 'Test content',
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(mockSpan.end).toHaveBeenCalledWith({
                metadata: { error: 'Evaluation error' },
            })
        })
    })
})
