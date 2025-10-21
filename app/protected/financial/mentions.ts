import React from 'react'
import { useStateBasedMentionProvider, getCedarState } from 'cedar-os'
import { TrendingUp, DollarSign } from 'lucide-react'
import type { FinancialStateData } from './state'

/**
 * Financial Mentions Hook
 *
 * Enables @ mention support for financial symbols in chat.
 * Users can reference stocks/crypto by typing @AAPL, @BTC, etc.
 *
 * This provides autocomplete and structured references to financial data.
 *
 * Mention providers:
 * - Watchlist symbols: @symbol from user's watchlist
 * - Stock quotes: @SYMBOL for any tracked stock
 * - Crypto quotes: @SYMBOL for any tracked cryptocurrency
 */
export function useFinancialMentions() {
    const financialState = getCedarState('financialState') as
        | FinancialStateData
        | undefined

    // Watchlist mentions - symbols in user's watchlist
    useStateBasedMentionProvider({
        stateKey: 'financialState',
        trigger: '@',
        labelField: 'Watchlist symbols',
        description: 'Watchlist symbols',
        icon: React.createElement(TrendingUp, { size: 16 }),
        color: '#10B981', // Green
    })

    // Stock mentions - all tracked stocks
    if (financialState) {
        useStateBasedMentionProvider({
            stateKey: 'financialState',
            trigger: '@',
            labelField: 'Stock quotes',
            searchFields: ['symbol', 'name'],
            description: 'Stock quotes',
            icon: React.createElement(DollarSign, { size: 16 }),
            color: '#3B82F6', // Blue
        })

        // Crypto mentions - all tracked cryptocurrencies
        useStateBasedMentionProvider({
            stateKey: 'financialState',
            trigger: '@',
            labelField: 'Cryptocurrency quotes',
            searchFields: ['symbol', 'name'],
            description: 'Cryptocurrency quotes',
            icon: React.createElement(DollarSign, { size: 16 }),
            color: '#F59E0B', // Orange
        })
    }
}
