import type React from 'react'
import { useRegisterState } from 'cedar-os'

/**
 * Financial State Types
 *
 * Manages real-time financial data for stocks and cryptocurrencies.
 */
export interface StockData {
    id: string
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
    volume: number
    marketCap?: number
    updatedAt: string
}

export interface CryptoData {
    id: string
    symbol: string
    name: string
    price: number
    change24h: number
    changePercent24h: number
    volume24h: number
    marketCap?: number
    rank?: number
    updatedAt: string
}

export interface FinancialStateData {
    watchlist: string[]
    stocks: Record<string, StockData>
    crypto: Record<string, CryptoData>
}

/**
 * Financial State Hook
 *
 * Exposes financial state to Cedar agents via useRegisterState.
 * Agents can manipulate watchlist, stocks, and crypto data through custom setters.
 *
 * Available actions:
 * - addToWatchlist: Add symbol to watchlist
 * - removeFromWatchlist: Remove symbol from watchlist
 * - updateStock: Update or add stock data
 * - updateCrypto: Update or add crypto data
 * - clearWatchlist: Clear all watchlist items
 *
 * State visibility:
 * This state is automatically visible to agents when subscribed via useSubscribeStateToAgentContext.
 */
export function useFinancialState(
    financialState: FinancialStateData,
    setFinancialState: React.Dispatch<React.SetStateAction<FinancialStateData>>
) {
    useRegisterState({
        value: financialState,
        setValue: setFinancialState,
        key: 'financialState',
        description:
            'Financial market data including stock quotes, crypto prices, and user watchlist',
        stateSetters: {
            addToWatchlist: {
                name: 'addToWatchlist',
                description: 'Add a stock or crypto symbol to the watchlist',
                execute: (currentState, setValue, args: unknown) => {
                    const symbol = (args as { symbol?: string } | undefined)
                        ?.symbol
                    if (!symbol || symbol === '') {
                        return
                    }

                    setValue({
                        ...currentState,
                        watchlist: [...currentState.watchlist, symbol.toUpperCase()],
                    })
                },
            },

            removeFromWatchlist: {
                name: 'removeFromWatchlist',
                description: 'Remove a symbol from the watchlist',
                execute: (currentState, setValue, args: unknown) => {
                    const symbol = (args as { symbol?: string } | undefined)
                        ?.symbol
                    if (!symbol || symbol === '') {
                        return
                    }

                    setValue({
                        ...currentState,
                        watchlist: currentState.watchlist.filter(
                            (s) => s !== symbol.toUpperCase()
                        ),
                    })
                },
            },

            updateStock: {
                name: 'updateStock',
                description: 'Update or add stock data to the state',
                execute: (currentState, setValue, args: unknown) => {
                    const stockData = (
                        args as { stock?: StockData } | undefined
                    )?.stock
                    if (!stockData?.symbol) {
                        return
                    }

                    const symbol = stockData.symbol.toUpperCase()
                    setValue({
                        ...currentState,
                        stocks: {
                            ...currentState.stocks,
                            [symbol]: {
                                ...stockData,
                                symbol,
                                updatedAt: new Date().toISOString(),
                            },
                        },
                    })
                },
            },

            updateCrypto: {
                name: 'updateCrypto',
                description:
                    'Update or add cryptocurrency data to the state',
                execute: (currentState, setValue, args: unknown) => {
                    const cryptoData = (
                        args as { crypto?: CryptoData } | undefined
                    )?.crypto
                    if (!cryptoData?.symbol) {
                        return
                    }

                    const symbol = cryptoData.symbol.toUpperCase()
                    setValue({
                        ...currentState,
                        crypto: {
                            ...currentState.crypto,
                            [symbol]: {
                                ...cryptoData,
                                symbol,
                                updatedAt: new Date().toISOString(),
                            },
                        },
                    })
                },
            },

            clearWatchlist: {
                name: 'clearWatchlist',
                description: 'Clear all items from the watchlist',
                execute: (currentState, setValue) => {
                    setValue({
                        ...currentState,
                        watchlist: [],
                    })
                },
            },
        },
    })
}
