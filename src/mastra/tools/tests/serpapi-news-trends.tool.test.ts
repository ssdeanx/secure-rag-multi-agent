import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RuntimeContext } from '@mastra/core/runtime-context'
import type { TracingContext } from '@mastra/core/ai-tracing'
import {
  googleNewsTool,
  googleNewsLiteTool,
  googleTrendsTool,
  googleAutocompleteTool,
} from '../serpapi-news-trends.tool'

// Mock the serpapi package
vi.mock('serpapi', () => ({
  getJson: vi.fn(),
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
  }

  return { currentSpan: mockSpan } as unknown as TracingContext
}

describe('SerpAPI News and Trends Tools', () => {
  let mockGetJson: ReturnType<typeof vi.mocked<typeof serpapi.getJson>>

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetJson = vi.mocked(serpapi.getJson)
    process.env.SERPAPI_API_KEY = 'test-api-key'
  })

  describe('googleNewsTool', () => {
    it('should successfully retrieve news articles', async () => {
      const mockResponse = {
        news_results: [
          {
            title: 'Breaking News 1',
            link: 'https://news1.com',
            snippet: 'News snippet 1',
            source: 'News Source 1',
            date: '2024-01-01',
            thumbnail: 'https://news1.com/thumb.jpg',
          },
        ],
      }

      mockGetJson.mockResolvedValueOnce(mockResponse)

      const result = await googleNewsTool.execute({
        context: { query: 'technology news', sortBy: 'relevance', numResults: 10 },
        runtimeContext: new RuntimeContext(),
        tracingContext: createMockTracingContext(),
      })

      expect(result.newsArticles).toHaveLength(1)
      expect(result.newsArticles[0].title).toBe('Breaking News 1')
    })

    it('should handle API errors', async () => {
      mockGetJson.mockRejectedValueOnce(new Error('News API error'))

      await expect(
        googleNewsTool.execute({
          context: { query: 'test', sortBy: 'date', numResults: 10 },
          runtimeContext: new RuntimeContext(),
          tracingContext: createMockTracingContext(),
        })
      ).rejects.toThrow('News API error')
    })
  })

  describe('googleNewsLiteTool', () => {
    it('should successfully retrieve lite news results', async () => {
      const mockResponse = {
        news_results: [
          {
            title: 'Quick News 1',
            link: 'https://quick1.com',
            source: 'Quick Source',
          },
        ],
      }

      mockGetJson.mockResolvedValueOnce(mockResponse)

      const result = await googleNewsLiteTool.execute({
        context: { query: 'breaking news', numResults: 5 },
        runtimeContext: new RuntimeContext(),
        tracingContext: createMockTracingContext(),
      })

      expect(result.newsArticles).toHaveLength(1)
      expect(result.newsArticles[0].title).toBe('Quick News 1')
    })
  })

  describe('googleTrendsTool', () => {
    it('should successfully retrieve trend data', async () => {
      const mockResponse = {
        interest_over_time: {
          timeline_data: [
            {
              timestamp: '2024-01-01',
              values: [{ value: 85 }],
            },
          ],
        },
        related_queries: ['query1', 'query2'],
      }

      mockGetJson.mockResolvedValueOnce(mockResponse)

      const result = await googleTrendsTool.execute({
        context: { query: 'AI trends', location: 'US', timeRange: 'now-7-d' },
        runtimeContext: new RuntimeContext(),
        tracingContext: createMockTracingContext(),
      })

      expect(result.interestOverTime).toHaveLength(1)
      expect(result.interestOverTime[0].value).toBe(85)
    })

    it('should handle missing API key', async () => {
      delete process.env.SERPAPI_API_KEY

      await expect(
        googleTrendsTool.execute({
          context: { query: 'test', location: 'US', timeRange: 'now-7-d' },
          runtimeContext: new RuntimeContext(),
          tracingContext: createMockTracingContext(),
        })
      ).rejects.toThrow('SERPAPI_API_KEY environment variable is not set')
    })
  })

  describe('googleAutocompleteTool', () => {
    it('should successfully retrieve autocomplete suggestions', async () => {
      const mockResponse = {
        suggestions: [
          { value: 'artificial intelligence trends' },
          { value: 'artificial intelligence tools' },
        ],
      }

      mockGetJson.mockResolvedValueOnce(mockResponse)

      const result = await googleAutocompleteTool.execute({
        context: { query: 'artificial intelligence' },
        runtimeContext: new RuntimeContext(),
        tracingContext: createMockTracingContext(),
      })

      expect(result.suggestions).toEqual([
        'artificial intelligence trends',
        'artificial intelligence tools',
      ])
      expect(result.suggestions).toHaveLength(2)
    })

    it('should handle API errors', async () => {
      mockGetJson.mockRejectedValueOnce(new Error('Autocomplete error'))

      await expect(
        googleAutocompleteTool.execute({
          context: { query: 'test' },
          runtimeContext: new RuntimeContext(),
          tracingContext: createMockTracingContext(),
        })
      ).rejects.toThrow('Autocomplete error')
    })
  })
})
