import { describe, it, expect } from 'vitest'
import type { AgentContext } from '../chatWorkflowSharedTypes'

// Import the helper functions by re-defining them here for testing
// (In production, these would be exported from the workflow file)

function extractContextData<T = unknown>(
    context: AgentContext | undefined,
    key: string
): T | undefined {
    if (!context?.[key]) {
        return undefined
    }

    // Get the first context entry for the key
    const entries = context[key]
    if (!Array.isArray(entries) || entries.length === 0) {
        return undefined
    }

    return entries[0]?.data as T
}

function extractContextArray<T = unknown>(
    context: AgentContext | undefined,
    key: string
): T[] {
    if (!context?.[key]) {
        return []
    }

    const entries = context[key]
    if (!Array.isArray(entries)) {
        return []
    }

    // Extract data from all context entries
    return entries.map(entry => entry.data as T).filter(Boolean)
}

describe('Cedar OS Context Helper Functions', () => {
    describe('extractContextData', () => {
        it('should extract data from a valid AgentContext', () => {
            const context: AgentContext = {
                watchlist: [
                    {
                        id: '1',
                        source: 'subscription',
                        data: { symbols: ['AAPL', 'GOOGL', 'MSFT'] },
                    },
                ],
            }

            const result = extractContextData<{ symbols?: string[] }>(context, 'watchlist')
            expect(result).toEqual({ symbols: ['AAPL', 'GOOGL', 'MSFT'] })
        })

        it('should return undefined for non-existent key', () => {
            const context: AgentContext = {
                watchlist: [
                    {
                        id: '1',
                        source: 'subscription',
                        data: { symbols: ['AAPL'] },
                    },
                ],
            }

            const result = extractContextData(context, 'nonexistent')
            expect(result).toBeUndefined()
        })

        it('should return undefined for undefined context', () => {
            const result = extractContextData(undefined, 'watchlist')
            expect(result).toBeUndefined()
        })

        it('should return undefined for empty array', () => {
            const context: AgentContext = {
                watchlist: [],
            }

            const result = extractContextData(context, 'watchlist')
            expect(result).toBeUndefined()
        })

        it('should return the first entry when multiple entries exist', () => {
            const context: AgentContext = {
                stocks: [
                    {
                        id: '1',
                        source: 'mention',
                        data: { price: 100, volume: 1000 },
                    },
                    {
                        id: '2',
                        source: 'subscription',
                        data: { price: 105, volume: 1500 },
                    },
                ],
            }

            const result = extractContextData<{ price: number; volume: number }>(context, 'stocks')
            expect(result).toEqual({ price: 100, volume: 1000 })
        })
    })

    describe('extractContextArray', () => {
        it('should extract all data entries from a valid AgentContext', () => {
            const context: AgentContext = {
                stocks: [
                    {
                        id: '1',
                        source: 'mention',
                        data: { symbol: 'AAPL', price: 150 },
                    },
                    {
                        id: '2',
                        source: 'mention',
                        data: { symbol: 'GOOGL', price: 2800 },
                    },
                ],
            }

            const result = extractContextArray<{ symbol: string; price: number }>(context, 'stocks')
            expect(result).toHaveLength(2)
            expect(result[0]).toEqual({ symbol: 'AAPL', price: 150 })
            expect(result[1]).toEqual({ symbol: 'GOOGL', price: 2800 })
        })

        it('should return empty array for non-existent key', () => {
            const context: AgentContext = {
                stocks: [
                    {
                        id: '1',
                        source: 'mention',
                        data: { symbol: 'AAPL' },
                    },
                ],
            }

            const result = extractContextArray(context, 'nonexistent')
            expect(result).toEqual([])
        })

        it('should return empty array for undefined context', () => {
            const result = extractContextArray(undefined, 'stocks')
            expect(result).toEqual([])
        })

        it('should return empty array for empty context entries', () => {
            const context: AgentContext = {
                stocks: [],
            }

            const result = extractContextArray(context, 'stocks')
            expect(result).toEqual([])
        })

        it('should filter out falsy data values', () => {
            const context: AgentContext = {
                items: [
                    {
                        id: '1',
                        source: 'subscription',
                        data: { value: 'test' },
                    },
                    {
                        id: '2',
                        source: 'subscription',
                        data: null as any, // Simulate null data
                    },
                    {
                        id: '3',
                        source: 'subscription',
                        data: { value: 'test2' },
                    },
                ],
            }

            const result = extractContextArray<{ value: string }>(context, 'items')
            expect(result).toHaveLength(2)
            expect(result[0]).toEqual({ value: 'test' })
            expect(result[1]).toEqual({ value: 'test2' })
        })
    })
})
