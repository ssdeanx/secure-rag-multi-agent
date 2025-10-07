/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { extractLearningsTool } from '../extractLearningsTool'

// Mock external dependencies
vi.mock('../config/logger', () => ({
    log: {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
    },
}))

describe('Extract Learnings Tool', () => {
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

    describe('successful learning extraction', () => {
        it('should extract learnings successfully with complete response', async () => {
            const mockResponse = {
                object: {
                    learning:
                        'Machine learning models require careful validation to ensure accuracy and reliability.',
                    followUpQuestions: [
                        'What validation techniques are most effective for different model types?',
                    ],
                },
            }
            mockAgent.generate.mockResolvedValue(mockResponse)

            const result = (await (extractLearningsTool as any).execute({
                context: {
                    query: 'machine learning validation',
                    result: {
                        title: 'Model Validation Best Practices',
                        url: 'https://example.com/ml-validation',
                        content: 'Machine learning models need validation...',
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })) as { learning: string; followUpQuestions: string[] }

            expect(result).toEqual({
                learning:
                    'Machine learning models require careful validation to ensure accuracy and reliability.',
                followUpQuestions: [
                    'What validation techniques are most effective for different model types?',
                ],
            })

            expect(mockMastra.getAgent).toHaveBeenCalledWith(
                'learningExtractionAgent'
            )
            expect(mockAgent.generate).toHaveBeenCalledWith(
                [
                    {
                        role: 'user',
                        content: expect.stringContaining(
                            'The user is researching "machine learning validation"'
                        ),
                    },
                ],
                {
                    experimental_output: expect.any(Object),
                }
            )
        })

        it('should handle content truncation for long content', async () => {
            const longContent = 'A'.repeat(10000) // Content longer than 8000 chars
            const mockResponse = {
                object: {
                    learning: 'Long content was processed successfully.',
                    followUpQuestions: ['How to handle very long documents?'],
                },
            }
            mockAgent.generate.mockResolvedValue(mockResponse)

            const result = (await (extractLearningsTool as any).execute({
                context: {
                    query: 'long document processing',
                    result: {
                        title: 'Long Document Processing',
                        url: 'https://example.com/long-doc',
                        content: longContent,
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })) as { learning: string; followUpQuestions: string[] }

            expect(result.learning).toBe(
                'Long content was processed successfully.'
            )
            expect(result.followUpQuestions).toEqual([
                'How to handle very long documents?',
            ])

            // Verify content was truncated in the prompt
            const generateCall = mockAgent.generate.mock.calls[0][0][0].content
            expect(generateCall).toContain('Content: AAAAAA...') // Should be truncated
        })

        it('should extract learnings with empty follow-up questions', async () => {
            const mockResponse = {
                object: {
                    learning:
                        'This is a complete and comprehensive learning that needs no further questions.',
                    followUpQuestions: [],
                },
            }
            mockAgent.generate.mockResolvedValue(mockResponse)

            const result = (await (extractLearningsTool as any).execute({
                context: {
                    query: 'complete research topic',
                    result: {
                        title: 'Complete Research Topic',
                        url: 'https://example.com/complete',
                        content: 'This topic is fully explored...',
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })) as { learning: string; followUpQuestions: string[] }

            expect(result).toEqual({
                learning:
                    'This is a complete and comprehensive learning that needs no further questions.',
                followUpQuestions: [],
            })
        })

        it('should handle special characters in content', async () => {
            const specialContent =
                'Content with special chars: éñüñ, 中文, русский, 🚀, and symbols: @#$%^&*()'
            const mockResponse = {
                object: {
                    learning:
                        'Special characters are handled correctly in processing.',
                    followUpQuestions: [
                        'How do different encodings affect processing?',
                    ],
                },
            }
            mockAgent.generate.mockResolvedValue(mockResponse)

            const result = (await (extractLearningsTool as any).execute({
                context: {
                    query: 'special character handling',
                    result: {
                        title: 'Special Character Processing',
                        url: 'https://example.com/special-chars',
                        content: specialContent,
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })) as { learning: string; followUpQuestions: string[] }

            expect(result.learning).toBe(
                'Special characters are handled correctly in processing.'
            )
            expect(result.followUpQuestions).toEqual([
                'How do different encodings affect processing?',
            ])
        })
    })

    describe('error handling', () => {
        it('should handle missing mastra instance', async () => {
            const result = (await (extractLearningsTool as any).execute({
                context: {
                    query: 'test query',
                    result: {
                        title: 'Test Title',
                        url: 'https://example.com',
                        content: 'Test content',
                    },
                },
                mastra: undefined as any,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })) as { learning: string; followUpQuestions: string[] }

            expect(result).toEqual({
                learning:
                    'Error extracting information: Mastra instance not found',
                followUpQuestions: [],
            })
        })

        it('should handle missing learningExtractionAgent', async () => {
            mockMastra.getAgent.mockReturnValue(null)

            const result = (await (extractLearningsTool as any).execute({
                context: {
                    query: 'test query',
                    result: {
                        title: 'Test Title',
                        url: 'https://example.com',
                        content: 'Test content',
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })) as { learning: string; followUpQuestions: string[] }

            expect(result).toEqual({
                learning:
                    'Error extracting information: learningExtractionAgent not found on mastra instance',
                followUpQuestions: [],
            })
        })

        it('should handle agent generation errors', async () => {
            const error = new Error('Agent failed to extract learnings')
            mockAgent.generate.mockRejectedValue(error)

            const result = (await (extractLearningsTool as any).execute({
                context: {
                    query: 'failing query',
                    result: {
                        title: 'Failing Title',
                        url: 'https://example.com/fail',
                        content: 'Failing content',
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })) as { learning: string; followUpQuestions: string[] }

            expect(result).toEqual({
                learning:
                    'Error extracting information: Agent failed to extract learnings',
                followUpQuestions: [],
            })
        })

        it('should handle non-Error exceptions', async () => {
            mockAgent.generate.mockRejectedValue('String error message')

            const result = (await (extractLearningsTool as any).execute({
                context: {
                    query: 'error query',
                    result: {
                        title: 'Error Title',
                        url: 'https://example.com/error',
                        content: 'Error content',
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })) as { learning: string; followUpQuestions: string[] }

            expect(result).toEqual({
                learning: 'Error extracting information: Unknown error',
                followUpQuestions: [],
            })
        })
    })

    describe('tracing', () => {
        it('should create and end tracing spans correctly', async () => {
            const mockResponse = {
                object: {
                    learning: 'Traced learning extraction',
                    followUpQuestions: ['What is the next step?'],
                },
            }
            mockAgent.generate.mockResolvedValue(mockResponse)

            await (extractLearningsTool as any).execute({
                context: {
                    query: 'tracing test query',
                    result: {
                        title: 'Tracing Test',
                        url: 'https://example.com/trace',
                        content:
                            'Content for tracing test with specific length',
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(
                mockTracingContext.currentSpan.createChildSpan
            ).toHaveBeenCalledWith({
                type: expect.any(String),
                name: 'extract_learnings',
                input: {
                    query: 'tracing test query',
                    url: 'https://example.com/trace',
                    contentLength: 47, // 'Content for tracing test with specific length'.length
                },
            })

            expect(mockSpan.end).toHaveBeenCalledWith({
                output: {
                    learningLength: 25, // 'Traced learning extraction'.length
                    followUpQuestionsCount: 1,
                },
            })
        })

        it('should handle tracing on error', async () => {
            const error = new Error('Extraction failed')
            mockAgent.generate.mockRejectedValue(error)

            await (extractLearningsTool as any).execute({
                context: {
                    query: 'error query',
                    result: {
                        title: 'Error Title',
                        url: 'https://example.com/error',
                        content: 'Error content',
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(mockSpan.end).toHaveBeenCalledWith({
                metadata: {
                    error: 'Extraction failed',
                },
            })
        })

        it('should handle tracing with null response object', async () => {
            const mockResponse = {
                object: null,
            }
            mockAgent.generate.mockResolvedValue(mockResponse)

            await (extractLearningsTool as any).execute({
                context: {
                    query: 'null response query',
                    result: {
                        title: 'Null Response',
                        url: 'https://example.com/null',
                        content: 'Content for null response',
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(mockSpan.end).toHaveBeenCalledWith({
                output: {
                    learningLength: 0,
                    followUpQuestionsCount: 0,
                },
            })
        })
    })

    describe('input validation', () => {
        it('should handle empty content', async () => {
            const mockResponse = {
                object: {
                    learning: 'Empty content was processed.',
                    followUpQuestions: ['What happens with empty content?'],
                },
            }
            mockAgent.generate.mockResolvedValue(mockResponse)

            const result = (await (extractLearningsTool as any).execute({
                context: {
                    query: 'empty content query',
                    result: {
                        title: 'Empty Content Test',
                        url: 'https://example.com/empty',
                        content: '',
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })) as { learning: string; followUpQuestions: string[] }

            expect(result.learning).toBe('Empty content was processed.')
            expect(result.followUpQuestions).toEqual([
                'What happens with empty content?',
            ])
        })

        it('should handle very short content', async () => {
            const mockResponse = {
                object: {
                    learning: 'Short content processed successfully.',
                    followUpQuestions: [],
                },
            }
            mockAgent.generate.mockResolvedValue(mockResponse)

            const result = (await (extractLearningsTool as any).execute({
                context: {
                    query: 'short content query',
                    result: {
                        title: 'Short Content',
                        url: 'https://example.com/short',
                        content: 'Hi',
                    },
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })) as { learning: string; followUpQuestions: string[] }

            expect(result.learning).toBe(
                'Short content processed successfully.'
            )
            expect(result.followUpQuestions).toEqual([])
        })
    })
})
