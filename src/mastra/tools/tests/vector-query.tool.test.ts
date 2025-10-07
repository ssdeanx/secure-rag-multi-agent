/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { vectorQueryTool } from '../vector-query.tool'
import { ValidationService } from '../../services/ValidationService'
import { VectorQueryService } from '../../services/VectorQueryService'

// Define mock types
interface MockVectorStore {
    // Mock vector store interface
}

interface MockMastra {
    getVector: (name: string) => MockVectorStore
}

// Mock dependencies
vi.mock('../../services/ValidationService')
vi.mock('../../services/VectorQueryService')
vi.mock('../../config/logger')

const mockValidationService = vi.mocked(ValidationService)
const mockVectorQueryService = vi.mocked(VectorQueryService)

describe('vectorQueryTool', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        // Setup default mocks
        mockValidationService.validateEnvironmentVariable.mockReturnValue(
            'test-value'
        )
        mockValidationService.validateMastraInstance.mockReturnValue({})
        mockValidationService.validateVectorStore.mockReturnValue({})
    })

    it('should successfully query vector database', async () => {
        const mockResults = [
            {
                text: 'Sample document text',
                docId: 'doc1',
                versionId: 'v1',
                source: 'test.pdf',
                score: 0.85,
                securityTags: ['public'],
                classification: 'public' as const,
            },
        ]

        const mockStore: MockVectorStore = {} as MockVectorStore
        const mockMastra: MockMastra = {
            getVector: vi.fn().mockReturnValue(mockStore),
        }

        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue({
                allowTags: ['public'],
                maxClassification: 'public' as const,
            }),
        } as any

        const mockTracingContext = {
            currentSpan: {
                createChildSpan: vi.fn().mockReturnValue({
                    end: vi.fn(),
                }),
            },
        } as any

        mockVectorQueryService.query.mockResolvedValue(mockResults)

        const result = await vectorQueryTool.execute({
            context: { question: 'What is the policy?', topK: 5 },
            runtimeContext: mockRuntimeContext,
            mastra: mockMastra as unknown as any,
            tracingContext: mockTracingContext,
        })

        expect(result).toEqual({ contexts: mockResults })
        expect(mockVectorQueryService.query).toHaveBeenCalledWith(
            {
                question: 'What is the policy?',
                allowTags: ['public'],
                maxClassification: 'public',
                topK: 5,
                minSimilarity: 0.4,
            },
            expect.any(Object),
            'governed_rag'
        )
    })

    it('should throw error when access filter not found', async () => {
        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue(undefined),
        } as any

        const mockTracingContext = {
            currentSpan: {
                createChildSpan: vi.fn().mockReturnValue({
                    error: vi.fn(),
                }),
            },
        } as any

        await expect(
            vectorQueryTool.execute({
                context: { question: 'Test question', topK: 3 },
                runtimeContext: mockRuntimeContext,
                mastra: {} as any,
                tracingContext: mockTracingContext,
            })
        ).rejects.toThrow('Access filter not found in runtime context')
    })

    it('should handle validation errors', async () => {
        mockValidationService.validateEnvironmentVariable.mockImplementation(
            () => {
                throw new Error('DATABASE_URL not set')
            }
        )

        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue({
                allowTags: ['public'],
                maxClassification: 'public' as const,
            }),
        } as any

        const mockTracingContext = {
            currentSpan: {
                createChildSpan: vi.fn().mockReturnValue({
                    error: vi.fn(),
                }),
            },
        } as any

        await expect(
            vectorQueryTool.execute({
                context: { question: 'Test question', topK: 3 },
                runtimeContext: mockRuntimeContext,
                mastra: {} as any,
                tracingContext: mockTracingContext,
            })
        ).rejects.toThrow('Vector query failed: DATABASE_URL not set')
    })

    it('should handle vector query service errors', async () => {
        const mockError = new Error('Vector search failed')

        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue({
                allowTags: ['public'],
                maxClassification: 'public' as const,
            }),
        } as any

        const mockTracingContext = {
            currentSpan: {
                createChildSpan: vi.fn().mockReturnValue({
                    error: vi.fn(),
                }),
            },
        } as any

        mockVectorQueryService.query.mockRejectedValue(mockError)

        await expect(
            vectorQueryTool.execute({
                context: { question: 'Test question', topK: 3 },
                runtimeContext: mockRuntimeContext,
                mastra: { getVector: vi.fn() } as any,
                tracingContext: mockTracingContext,
            })
        ).rejects.toThrow('Vector query failed: Vector search failed')
    })

    it('should use default topK when not provided', async () => {
        const mockResults: any[] = []
        const mockStore = {}

        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue({
                allowTags: ['internal'],
                maxClassification: 'internal' as const,
            }),
        } as any

        mockVectorQueryService.query.mockResolvedValue(mockResults)

        const mockGetVector = vi.fn().mockReturnValue(mockStore)

        await vectorQueryTool.execute({
            context: { question: 'Test question', topK: 8 }, // Provide default topK
            runtimeContext: mockRuntimeContext,
            mastra: { getVector: mockGetVector } as any,
            tracingContext: undefined,
        })

        expect(mockVectorQueryService.query).toHaveBeenCalledWith(
            expect.objectContaining({
                topK: 8, // Default value
            }),
            mockStore,
            'governed_rag'
        )
    })

    it('should use custom similarity threshold from environment', async () => {
        const originalEnv = process.env.VECTOR_SIMILARITY_THRESHOLD
        process.env.VECTOR_SIMILARITY_THRESHOLD = '0.7'

        const mockResults = [] as any
        const mockStore = {}

        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue({
                allowTags: ['confidential'],
                maxClassification: 'confidential' as const,
            }),
        } as any

        mockVectorQueryService.query.mockResolvedValue(mockResults)

        const mockGetVector = vi.fn().mockReturnValue(mockStore)

        await vectorQueryTool.execute({
            context: { question: 'Test question', topK: 3 },
            runtimeContext: mockRuntimeContext,
            mastra: { getVector: mockGetVector } as any,
            tracingContext: undefined,
        })

        expect(mockVectorQueryService.query).toHaveBeenCalledWith(
            expect.objectContaining({
                minSimilarity: 0.7,
            }),
            mockStore,
            'governed_rag'
        )

        // Restore original env
        process.env.VECTOR_SIMILARITY_THRESHOLD = originalEnv
    })

    it('should handle tracing context without current span', async () => {
        const mockResults = [] as any

        const mockRuntimeContext = {
            get: vi.fn().mockReturnValue({
                allowTags: ['public'],
                maxClassification: 'public' as const,
            }),
        } as any

        mockVectorQueryService.query.mockResolvedValue(mockResults)

        const result = await vectorQueryTool.execute({
            context: { question: 'Test question', topK: 3 },
            runtimeContext: mockRuntimeContext,
            mastra: { getVector: vi.fn() } as any,
            tracingContext: undefined,
        })

        expect(result).toEqual({ contexts: [] })
    })
})
