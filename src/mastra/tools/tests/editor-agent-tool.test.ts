/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { editorTool } from '../editor-agent-tool'

// Mock external dependencies
vi.mock('../config/logger', () => ({
    log: {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
    },
}))

describe('Editor Agent Tool', () => {
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

    describe('successful content editing', () => {
        it('should edit blog content successfully with minimal parameters', async () => {
            const mockResponse = {
                editedContent:
                    'This is an improved blog post with better structure and clarity.',
                contentType: 'blog',
                changes: ['Improved sentence structure', 'Enhanced clarity'],
                suggestions: ['Consider adding more examples'],
            }
            mockAgent.generate.mockResolvedValue({
                text: JSON.stringify(mockResponse),
            })

            const result = await editorTool.execute({
                context: {
                    content: 'This is a blog post that needs editing.',
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual({
                editedContent:
                    'This is an improved blog post with better structure and clarity.',
                contentType: 'blog',
                changes: ['Improved sentence structure', 'Enhanced clarity'],
                suggestions: ['Consider adding more examples'],
            })

            expect(mockMastra.getAgent).toHaveBeenCalledWith('editorAgent')
            expect(mockAgent.generate).toHaveBeenCalledWith(
                'Edit the following content:\n\nThis is a blog post that needs editing.'
            )
        })

        it('should edit technical content with all parameters', async () => {
            const mockResponse = {
                editedContent:
                    'This technical documentation has been improved with clearer explanations.',
                contentType: 'technical',
                changes: ['Added code examples', 'Clarified technical terms'],
                suggestions: ['Add API reference links'],
            }
            mockAgent.generate.mockResolvedValue({
                text: JSON.stringify(mockResponse),
            })

            const result = await editorTool.execute({
                context: {
                    content: 'Technical content to edit',
                    contentType: 'technical',
                    instructions: 'Focus on clarity and add examples',
                    tone: 'technical',
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual({
                editedContent:
                    'This technical documentation has been improved with clearer explanations.',
                contentType: 'technical',
                changes: ['Added code examples', 'Clarified technical terms'],
                suggestions: ['Add API reference links'],
            })

            expect(mockAgent.generate).toHaveBeenCalledWith(
                'Edit the following content (content type: technical) with a technical tone. Additional instructions: Focus on clarity and add examples:\n\nTechnical content to edit'
            )
        })

        it('should edit business content', async () => {
            const mockResponse = {
                editedContent:
                    'This business proposal has been professionally edited.',
                contentType: 'business',
                changes: ['Improved professional tone', 'Enhanced structure'],
                suggestions: [],
            }
            mockAgent.generate.mockResolvedValue({
                text: JSON.stringify(mockResponse),
            })

            const result = await editorTool.execute({
                context: {
                    content: 'Business content',
                    contentType: 'business',
                    tone: 'professional',
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result.contentType).toBe('business')
            expect(result.changes).toContain('Improved professional tone')
        })

        it('should handle non-JSON response with fallback parsing', async () => {
            const plainTextResponse =
                'This is the edited content without JSON structure.'
            mockAgent.generate.mockResolvedValue({ text: plainTextResponse })

            const result = await editorTool.execute({
                context: {
                    content: 'Content to edit',
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual({
                editedContent:
                    'This is the edited content without JSON structure.',
                contentType: 'general',
                changes: ['Content edited and improved'],
                suggestions: [],
            })
        })

        it('should handle JSON response with missing fields', async () => {
            const incompleteResponse = {
                editedContent: 'Edited content',
                // missing contentType, changes, suggestions
            }
            mockAgent.generate.mockResolvedValue({
                text: JSON.stringify(incompleteResponse),
            })

            const result = await editorTool.execute({
                context: {
                    content: 'Original content',
                    contentType: 'creative',
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result).toEqual({
                editedContent: 'Edited content',
                contentType: 'creative', // uses provided contentType
                changes: ['Content edited and improved'], // fallback
                suggestions: [], // fallback
            })
        })

        it('should handle JSON response with alternative field names', async () => {
            const alternativeResponse = {
                copy: 'Alternative field name for content', // instead of editedContent
                contentType: 'blog',
                changes: ['Used alternative field'],
                suggestions: ['Consider standardizing field names'],
            }
            mockAgent.generate.mockResolvedValue({
                text: JSON.stringify(alternativeResponse),
            })

            const result = await editorTool.execute({
                context: {
                    content: 'Original content',
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(result.editedContent).toBe(
                'Alternative field name for content'
            )
            expect(result.contentType).toBe('blog')
        })
    })

    describe('error handling', () => {
        it('should handle agent generation errors', async () => {
            const error = new Error('Agent failed to edit content')
            mockAgent.generate.mockRejectedValue(error)

            await expect(
                editorTool.execute({
                    context: { content: 'failing content' },
                    mastra: mockMastra,
                    runtimeContext: mockRuntimeContext,
                    tracingContext: mockTracingContext,
                })
            ).rejects.toThrow('Agent failed to edit content')
        })

        it('should handle non-Error exceptions', async () => {
            mockAgent.generate.mockRejectedValue('String error')

            await expect(
                editorTool.execute({
                    context: { content: 'error content' },
                    mastra: mockMastra,
                    runtimeContext: mockRuntimeContext,
                    tracingContext: mockTracingContext,
                })
            ).rejects.toThrow('Failed to edit content: Unknown error')
        })
    })

    describe('tracing', () => {
        it('should create and end tracing spans correctly', async () => {
            const mockResponse = {
                editedContent: 'Traced edit',
                contentType: 'blog',
                changes: ['Tracing test'],
                suggestions: [],
            }
            mockAgent.generate.mockResolvedValue({
                text: JSON.stringify(mockResponse),
            })

            await editorTool.execute({
                context: {
                    content: 'Content for tracing',
                    contentType: 'blog',
                    instructions: 'Test tracing',
                    tone: 'engaging',
                },
                mastra: mockMastra,
                runtimeContext: mockRuntimeContext,
                tracingContext: mockTracingContext,
            })

            expect(
                mockTracingContext.currentSpan.createChildSpan
            ).toHaveBeenCalledWith({
                type: expect.any(String),
                name: 'editor-agent-tool',
                input: {
                    contentType: 'blog',
                    contentLength: 19, // 'Content for tracing'.length
                    hasInstructions: true,
                    tone: 'engaging',
                },
            })

            expect(mockSpan.end).toHaveBeenCalledWith({
                output: {
                    success: true,
                    outputLength: 11, // 'Traced edit'.length
                    changesCount: 1,
                    contentType: 'blog',
                },
            })
        })

        it('should handle tracing on error', async () => {
            const error = new Error('Edit failed')
            mockAgent.generate.mockRejectedValue(error)

            await expect(
                editorTool.execute({
                    context: { content: 'error content' },
                    mastra: mockMastra,
                    runtimeContext: mockRuntimeContext,
                    tracingContext: mockTracingContext,
                })
            ).rejects.toThrow()

            expect(mockSpan.end).toHaveBeenCalledWith({
                metadata: {
                    success: false,
                    error: 'Edit failed',
                },
            })
        })
    })
})
