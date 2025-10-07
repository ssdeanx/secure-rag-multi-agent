/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { mastraChunker } from '../document-chunking.tool'

// Mock MDocument
vi.mock('@mastra/rag', () => ({
    MDocument: vi.fn(),
    createGraphRAGTool: vi.fn(),
    createVectorQueryTool: vi.fn(),
}))

// Mock logger
vi.mock('../config/logger', () => ({
    logToolExecution: vi.fn(),
    logStepStart: vi.fn(),
    logStepEnd: vi.fn(),
    logError: vi.fn(),
}))

const mockMDocument = (await import('@mastra/rag')).MDocument as any

describe('mastraChunker', () => {
    it('should validate input schema', async () => {
        // Empty document content should return validation error
        const result = (await mastraChunker.execute({
            context: {
                documentContent: '',
                documentMetadata: {},
                chunkingStrategy: 'recursive',
                chunkSize: 512,
                chunkOverlap: 50,
                chunkSeparator: '\n',
                extractTitle: false,
                extractSummary: false,
                extractKeywords: false,
                extractQuestions: false,
            },
            runtimeContext: {} as any,
            tracingContext: undefined,
        })) as any

        expect(result.error).toBe(true)
        expect(result.message).toContain('Document content cannot be empty')
        expect(result.validationErrors).toBeDefined()
    })

    it('should successfully chunk document with recursive strategy', async () => {
        const mockChunks = [
            {
                text: 'This is chunk 1',
                metadata: { title: 'Test Title' },
            },
            {
                text: 'This is chunk 2',
                metadata: {},
            },
        ]

        const mockDocumentInstance = {
            chunk: vi.fn().mockResolvedValue(mockChunks),
        }

        mockMDocument.mockImplementation(() => mockDocumentInstance)

        const result = await mastraChunker.execute({
            context: {
                documentContent:
                    'This is a test document with multiple sentences. This is the second sentence.',
                documentMetadata: {},
                chunkingStrategy: 'recursive',
                chunkSize: 512,
                chunkOverlap: 50,
                chunkSeparator: '\n',
                extractTitle: true,
                extractSummary: false,
                extractKeywords: false,
                extractQuestions: false,
            },
            runtimeContext: {} as any,
            tracingContext: {
                currentSpan: {
                    createChildSpan: vi.fn().mockReturnValue({
                        end: vi.fn(),
                        error: vi.fn(),
                    }),
                },
            } as any,
        })

        expect(result.success).toBe(true)
        expect(result.chunkCount).toBe(2)
        expect(result.chunks).toHaveLength(2)
        expect(result.chunks[0].text).toBe('This is chunk 1')
        expect(result.chunks[0].metadata.chunkIndex).toBe(0)
        expect(result.chunks[0].metadata.chunkingStrategy).toBe('recursive')
    })

    it('should handle different chunking strategies', async () => {
        const mockChunks = [{ text: 'Chunk content', metadata: {} }]
        const mockDocumentInstance = {
            chunk: vi.fn().mockResolvedValue(mockChunks),
        }

        mockMDocument.mockImplementation(() => mockDocumentInstance)

        const strategies = [
            'character',
            'token',
            'markdown',
            'semantic-markdown',
            'html',
            'json',
            'latex',
            'sentence',
        ]

        for (const strategy of strategies) {
            const result = await mastraChunker.execute({
                context: {
                    documentContent: 'Test content',
                    documentMetadata: {},
                    chunkingStrategy: strategy as any,
                    chunkSize: 512,
                    chunkOverlap: 50,
                    chunkSeparator: '\n',
                    extractTitle: false,
                    extractSummary: false,
                    extractKeywords: false,
                    extractQuestions: false,
                },
                runtimeContext: {} as any,
                tracingContext: undefined,
            })

            expect(result.success).toBe(true)
            expect(mockDocumentInstance.chunk).toHaveBeenCalledWith(
                expect.objectContaining({
                    strategy: strategy === 'recursive' ? 'recursive' : strategy,
                })
            )
        }
    })

    it('should extract metadata when requested', async () => {
        const mockChunks = [
            {
                text: 'Content',
                metadata: {
                    title: 'Extracted Title',
                    summary: 'Extracted Summary',
                    keywords: ['keyword1', 'keyword2'],
                    questions: ['What is this?', 'How does it work?'],
                },
            },
        ]

        const mockDocumentInstance = {
            chunk: vi.fn().mockResolvedValue(mockChunks),
        }

        mockMDocument.mockImplementation(() => mockDocumentInstance)

        const result = await mastraChunker.execute({
            context: {
                documentContent: 'Test content',
                documentMetadata: {},
                chunkingStrategy: 'recursive',
                chunkSize: 512,
                chunkOverlap: 50,
                chunkSeparator: '\n',
                extractTitle: true,
                extractSummary: true,
                extractKeywords: true,
                extractQuestions: true,
            },
            runtimeContext: {} as any,
            tracingContext: undefined,
        })

        expect(result.success).toBe(true)
        expect(mockDocumentInstance.chunk).toHaveBeenCalledWith(
            expect.objectContaining({
                extract: {
                    title: true,
                    summary: true,
                    keywords: true,
                    questions: true,
                },
            })
        )
    })

    it('should handle chunking errors gracefully', async () => {
        const mockDocumentInstance = {
            chunk: vi.fn().mockRejectedValue(new Error('Chunking failed')),
        }

        mockMDocument.mockImplementation(() => mockDocumentInstance)

        const result = await mastraChunker.execute({
            context: {
                documentContent: 'Test content',
                documentMetadata: {},
                chunkingStrategy: 'recursive',
                chunkSize: 512,
                chunkOverlap: 50,
                chunkSeparator: '\n',
                extractTitle: false,
                extractSummary: false,
                extractKeywords: false,
                extractQuestions: false,
            },
            runtimeContext: {} as any,
            tracingContext: {
                currentSpan: {
                    createChildSpan: vi.fn().mockReturnValue({
                        end: vi.fn(),
                        error: vi.fn(),
                    }),
                },
            } as any,
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe('Chunking failed')
        expect(result.chunkCount).toBe(0)
        expect(result.chunks).toHaveLength(0)
    })

    it('should handle tracing context without current span', async () => {
        const mockChunks = [{ text: 'Content', metadata: {} }]
        const mockDocumentInstance = {
            chunk: vi.fn().mockResolvedValue(mockChunks),
        }

        mockMDocument.mockImplementation(() => mockDocumentInstance)

        const result = await mastraChunker.execute({
            context: {
                documentContent: 'Test content',
                documentMetadata: {},
                chunkingStrategy: 'recursive',
                chunkSize: 512,
                chunkOverlap: 50,
                chunkSeparator: '\n',
                extractTitle: false,
                extractSummary: false,
                extractKeywords: false,
                extractQuestions: false,
            },
            runtimeContext: {} as any,
            tracingContext: {} as any,
        })

        expect(result.success).toBe(true)
    })
})
