import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RuntimeContext } from '@mastra/core/runtime-context'
import type { TracingContext } from '@mastra/core/ai-tracing'
import { googleSearchTool, googleAiOverviewTool } from '../serpapi-search.tool'

// Mock the serpapi package
vi.mock('serpapi', () => ({
  default: {
    getJson: vi.fn(),
  },
}))

// Mock the logger
vi.mock('../config/logger', () => ({
  log: vi.fn(),
}))

// Import after mocks
import * as serpapi from 'serpapi'

// Helper function to create mock tracing context
const createMockTracingContext = (): TracingContext => {
  const mockSpan: any = {
    createChildSpan: vi.fn().mockReturnValue({
      end: vi.fn(),
    }),
    end: vi.fn(),
    error: vi.fn(),
    addEvent: vi.fn(),
    recordException: vi.fn(),
    setStatus: vi.fn(),
  }

  return { currentSpan: mockSpan } as unknown as TracingContext
}

describe('SerpAPI Search Tools', () => {
  let mockGetJson: ReturnType<typeof vi.mocked<typeof serpapi.getJson>>

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetJson = vi.mocked(serpapi.getJson)
    process.env.SERPAPI_API_KEY = 'test-api-key'
  })

  describe('googleSearchTool', () => {
    it('should successfully perform a Google search', async () => {
      const mockResponse = {
        search_metadata: {
          status: 'Success',
        },
        organic_results: [
          {
            title: 'Test Result 1',
            link: 'https://example.com',
            snippet: 'This is a test snippet',
            position: 1,
          },
          {
            title: 'Test Result 2',
            link: 'https://example2.com',
            snippet: 'Another test snippet',
            position: 2,
          },
        ],
        knowledge_graph: {
          title: 'Test Knowledge',
          type: 'Person',
          description: 'A test person',
          source: {
            name: 'Wikipedia',
            link: 'https://wikipedia.org',
          },
          image: 'https://example.com/image.jpg',
          attributes: {
            Born: 'January 1, 2000',
            Nationality: 'Test',
          },
          facts: ['Fact 1', 'Fact 2'],
        },
        related_searches: [
          {
            query: 'Related query 1',
            link: 'https://example.com/related1',
          },
          {
            query: 'Related query 2',
            link: 'https://example.com/related2',
          },
        ],
      }

      mockGetJson.mockResolvedValueOnce(mockResponse)

      const result = await googleSearchTool.execute({
        context: { query: 'test query', numResults: 10 },
        runtimeContext: new RuntimeContext(),
        tracingContext: createMockTracingContext(),
      })

      expect(mockGetJson).toHaveBeenCalledWith({
        engine: 'google',
        q: 'test query',
        num: 10,
        hl: 'en',
        gl: 'us',
      })

      expect(result).toEqual({
        organicResults: [
          {
            title: 'Test Result 1',
            url: 'https://example.com',
            snippet: 'This is a test snippet',
            position: 1,
          },
          {
            title: 'Test Result 2',
            url: 'https://example2.com',
            snippet: 'Another test snippet',
            position: 2,
          },
        ],
        knowledgeGraph: {
          title: 'Test Knowledge',
          type: 'Person',
          description: 'A test person',
          source: {
            name: 'Wikipedia',
            link: 'https://wikipedia.org',
          },
          image: 'https://example.com/image.jpg',
          attributes: {
            Born: 'January 1, 2000',
            Nationality: 'Test',
          },
          facts: ['Fact 1', 'Fact 2'],
        },
        relatedSearches: [
          {
            query: 'Related query 1',
            link: 'https://example.com/related1',
          },
          {
            query: 'Related query 2',
            link: 'https://example.com/related2',
          },
        ],
        totalResults: 2,
      })
    })

    it('should handle search with custom parameters', async () => {
      const mockResponse = {
        search_metadata: { status: 'Success' },
        organic_results: [
          {
            title: 'Custom Result',
            link: 'https://custom.com',
            snippet: 'Custom snippet',
            position: 1,
          },
        ],
      }

      mockGetJson.mockResolvedValueOnce(mockResponse)

      const result = await googleSearchTool.execute({
        context: {
          query: 'custom query',
          numResults: 5,
          location: 'New York, NY',
        },
        runtimeContext: new RuntimeContext(),
        tracingContext: createMockTracingContext(),
      })

      expect(mockGetJson).toHaveBeenCalledWith({
        engine: 'google',
        q: 'custom query',
        num: 5,
        location: 'New York, NY',
        hl: 'en',
        gl: 'us',
      })

      expect(result.organicResults).toHaveLength(1)
    })

    it('should handle search without knowledge graph', async () => {
      const mockResponse = {
        search_metadata: { status: 'Success' },
        organic_results: [
          {
            title: 'Result',
            link: 'https://example.com',
            snippet: 'Snippet',
            position: 1,
          },
        ],
      }

      mockGetJson.mockResolvedValueOnce(mockResponse)

      const result = await googleSearchTool.execute({
        context: { query: 'test', numResults: 10 },
        runtimeContext: new RuntimeContext(),
        tracingContext: createMockTracingContext(),
      })

      expect(result.knowledgeGraph).toBeUndefined()
      expect(result.organicResults).toHaveLength(1)
    })

    it('should handle API errors', async () => {
      mockGetJson.mockRejectedValueOnce(new Error('API error'))

      await expect(
        googleSearchTool.execute({
          context: { query: 'test', numResults: 10 },
          runtimeContext: new RuntimeContext(),
          tracingContext: createMockTracingContext(),
        })
      ).rejects.toThrow('API error')
    })

    it('should handle missing API key', async () => {
      delete process.env.SERPAPI_API_KEY

      await expect(
        googleSearchTool.execute({
          context: { query: 'test', numResults: 10 },
          runtimeContext: new RuntimeContext(),
          tracingContext: createMockTracingContext(),
        })
      ).rejects.toThrow('SERPAPI_API_KEY environment variable is not set')
    })

    it('should handle empty search results', async () => {
      const mockResponse = {
        search_metadata: { status: 'Success' },
        organic_results: [],
      }

      mockGetJson.mockResolvedValueOnce(mockResponse)

      const result = await googleSearchTool.execute({
        context: { query: 'nonexistent query', numResults: 10 },
        runtimeContext: new RuntimeContext(),
        tracingContext: createMockTracingContext(),
      })

      expect(result.organicResults).toEqual([])
    })
  })

  describe('googleAiOverviewTool', () => {
    it('should successfully retrieve AI overview', async () => {
      const mockResponse = {
        search_metadata: { status: 'Success' },
        ai_overview: {
          overview: 'This is an AI-generated overview',
          sources: [
            {
              title: 'Source 1',
              link: 'https://source1.com',
              snippet: 'Snippet from source 1',
            },
            {
              title: 'Source 2',
              link: 'https://source2.com',
              snippet: 'Snippet from source 2',
            },
          ],
        },
        organic_results: [
          {
            title: 'Result',
            link: 'https://example.com',
            snippet: 'Snippet',
            position: 1,
          },
        ],
      }

      mockGetJson.mockResolvedValueOnce(mockResponse)

      const result = await googleAiOverviewTool.execute({
        context: { query: 'ai overview test', includeScrapedContent: false },
        runtimeContext: new RuntimeContext(),
        tracingContext: createMockTracingContext(),
      })

      expect(mockGetJson).toHaveBeenCalledWith({
        engine: 'google',
        q: 'ai overview test',
        gl: 'us',
        hl: 'en',
      })

      expect(result).toEqual({
        aiOverview: 'This is an AI-generated overview',
        sources: [
          {
            title: 'Source 1',
            link: 'https://source1.com',
            snippet: 'Snippet from source 1',
          },
          {
            title: 'Source 2',
            link: 'https://source2.com',
            snippet: 'Snippet from source 2',
          },
        ],
        scrapedContent: [
          {
            title: 'Result',
            url: 'https://example.com',
            snippet: 'Snippet',
            position: 1,
          },
        ],
      })
    })

    it('should handle AI overview with custom location', async () => {
      const mockResponse = {
        search_metadata: { status: 'Success' },
        ai_overview: {
          overview: 'Location-specific overview',
          sources: [],
        },
      }

      mockGetJson.mockResolvedValueOnce(mockResponse)

      const result = await googleAiOverviewTool.execute({
        context: {
          query: 'location test',
          location: 'San Francisco, CA',
          includeScrapedContent: false,
        },
        runtimeContext: new RuntimeContext(),
        tracingContext: createMockTracingContext(),
      })

      expect(mockGetJson).toHaveBeenCalledWith({
        engine: 'google',
        q: 'location test',
        location: 'San Francisco, CA',
        gl: 'us',
        hl: 'en',
      })

      expect(result.aiOverview).toBe('Location-specific overview')
    })

    it('should handle missing AI overview in response', async () => {
      const mockResponse = {
        search_metadata: { status: 'Success' },
        organic_results: [],
      }

      mockGetJson.mockResolvedValueOnce(mockResponse)

      const result = await googleAiOverviewTool.execute({
        context: { query: 'no ai overview', includeScrapedContent: false },
        runtimeContext: new RuntimeContext(),
        tracingContext: createMockTracingContext(),
      })

      expect(result.aiOverview).toBeUndefined()
      expect(result.sources).toEqual([])
    })

    it('should handle API errors gracefully', async () => {
      mockGetJson.mockRejectedValueOnce(new Error('Network error'))

      await expect(
        googleAiOverviewTool.execute({
          context: { query: 'test', includeScrapedContent: false },
          runtimeContext: new RuntimeContext(),
          tracingContext: createMockTracingContext(),
        })
      ).rejects.toThrow('Network error')
    })

    it('should work without tracing context', async () => {
      const mockResponse = {
        search_metadata: { status: 'Success' },
        ai_overview: {
          overview: 'Test overview',
          sources: [],
        },
      }

      mockGetJson.mockResolvedValueOnce(mockResponse)

      const result = await googleAiOverviewTool.execute({
        context: { query: 'test', includeScrapedContent: false },
        runtimeContext: new RuntimeContext(),
        tracingContext: undefined,
      })

      expect(result.aiOverview).toBe('Test overview')
    })
  })
})
