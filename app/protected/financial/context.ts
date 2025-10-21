import React from 'react'
import { useSubscribeStateToAgentContext } from 'cedar-os'
import { TrendingUp, DollarSign } from 'lucide-react'
import type { FinancialStateData } from './state'

/**
 * Financial Context Hook
 *
 * Subscribes financial state to agent input context using useSubscribeStateToAgentContext.
 * This makes financial data automatically available to agents during conversations.
 *
 * Context transformations:
 * - watchlistSymbols: Array of symbols in user's watchlist
 * - stockData: Current stock quotes and analysis
 * - cryptoData: Current cryptocurrency quotes and analysis
 *
 * Agents receive this context and can reference it in their responses.
 * Example: "Based on your watchlist, AAPL is up 2.5% today..."
 */
export function useFinancialContext() {
    // Subscribe watchlist to context
    useSubscribeStateToAgentContext(
        'financialState',
        (state: FinancialStateData) => ({
            watchlistSymbols: state.watchlist,
            watchlistCount: state.watchlist.length,
        }),
        {
            icon: React.createElement(TrendingUp, { size: 16 }),
            color: '#10B981', // Green for trending
        }
    )

    // Subscribe stock data to context
    useSubscribeStateToAgentContext(
        'financialState',
        (state: FinancialStateData) => ({
            stocks: Object.values(state.stocks).map((stock) => ({
                symbol: stock.symbol,
                name: stock.name,
                price: stock.price,
                change: stock.change,
                changePercent: stock.changePercent,
                volume: stock.volume,
                marketCap: stock.marketCap,
            })),
        }),
        {
            icon: React.createElement(DollarSign, { size: 16 }),
            color: '#3B82F6', // Blue for stocks
        }
    )

    // Subscribe crypto data to context
    useSubscribeStateToAgentContext(
        'financialState',
        (state: FinancialStateData) => ({
            crypto: Object.values(state.crypto).map((crypto) => ({
                symbol: crypto.symbol,
                name: crypto.name,
                price: crypto.price,
                change24h: crypto.change24h,
                changePercent24h: crypto.changePercent24h,
                volume24h: crypto.volume24h,
                rank: crypto.rank,
            })),
        }),
        {
            icon: React.createElement(DollarSign, { size: 16 }),
            color: '#F59E0B', // Orange for crypto
        }
    )
}
