'use client' // REQUIRED: Cedar chat components use React hooks

import React from 'react'
import { FloatingCedarChat } from '@/cedar/components/chatComponents/FloatingCedarChat'
import { useCedarFinancial } from './hooks'
import type { FinancialStateData } from './state'

/**
 * Financial Domain Page (Client Component)
 *
 * WHY CLIENT COMPONENT?
 * - Uses React hooks (useState for financial state)
 * - Cedar chat components require client-side interactivity
 * - Layout.tsx (parent) is server component that provides CedarCopilot context
 * - This pattern is CORRECT: server layout wraps client page
 *
 * FINANCIAL CAPABILITIES:
 * =======================
 *
 * 1. AGENTS:
 *    - cryptoAnalysisAgent: Cryptocurrency market analysis
 *    - stockAnalysisAgent: Stock market technical/fundamental analysis
 *    - marketEducationAgent: Financial education and explanations
 *
 * 2. STATE MANAGEMENT:
 *    - Watchlist: User's tracked symbols
 *    - Stocks: Real-time stock quotes and analysis
 *    - Crypto: Real-time cryptocurrency quotes and analysis
 *
 * 3. AGENT ACTIONS:
 *    Agents can update state via setState actions:
 *    - addToWatchlist: Add symbol to tracking
 *    - removeFromWatchlist: Remove symbol
 *    - updateStock: Update stock quote data
 *    - updateCrypto: Update crypto quote data
 *    - clearWatchlist: Clear all tracked symbols
 *
 * 4. MENTIONS:
 *    Users can reference financial data with @mentions:
 *    - @AAPL: Reference Apple stock
 *    - @BTC: Reference Bitcoin
 *    - @{any tracked symbol}: Reference any symbol in state
 *
 * 5. STREAMING:
 *    Cedar automatically uses /chat/stream endpoint (SSE) for real-time analysis.
 *    Financial agents stream market data and insights with live updates.
 *
 * EXAMPLE INTERACTIONS:
 * - "Add AAPL to my watchlist and analyze its technicals"
 * - "Compare @BTC and @ETH performance over the last 24h"
 * - "What's the current market sentiment for @TSLA?"
 * - "Explain PE ratios and why they matter for @MSFT"
 */
export default function FinancialPage() {
    // Initialize financial state
    const [financialState, setFinancialState] =
        React.useState<FinancialStateData>({
            watchlist: [],
            stocks: {},
            crypto: {},
        })

    // Cedar-OS integration: state, context, mentions
    useCedarFinancial(financialState, setFinancialState)

    return (
        <div className="relative h-screen w-full bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Financial Dashboard */}
            <div className="flex h-full">
                {/* Main Content Area */}
                <div className="flex-1 p-8">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Financial Intelligence
                        </h1>
                        <p className="text-slate-300 mb-8">
                            Real-time market analysis powered by AI agents
                        </p>

                        {/* Watchlist Display */}
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Watchlist
                            </h2>
                            {financialState.watchlist.length === 0 ? (
                                <p className="text-slate-400">
                                    No symbols tracked. Ask the AI to add symbols to your watchlist.
                                </p>
                            ) : (
                                <div className="grid grid-cols-3 gap-4">
                                    {financialState.watchlist.map((symbol) => (
                                        <div
                                            key={symbol}
                                            className="bg-white/5 rounded p-4 text-white"
                                        >
                                            <div className="font-bold text-lg">
                                                {symbol}
                                            </div>
                                            {symbol in financialState.stocks && (
                                                <div className="mt-2">
                                                    <div className="text-2xl font-semibold">
                                                        $
                                                        {financialState.stocks[
                                                            symbol
                                                        ].price.toFixed(2)}
                                                    </div>
                                                    <div
                                                        className={`text-sm ${
                                                            financialState
                                                                .stocks[symbol]
                                                                .change >= 0
                                                                ? 'text-green-400'
                                                                : 'text-red-400'
                                                        }`}
                                                    >
                                                        {financialState.stocks[
                                                            symbol
                                                        ].change >= 0
                                                            ? '+'
                                                            : ''}
                                                        {financialState.stocks[
                                                            symbol
                                                        ].changePercent.toFixed(
                                                            2
                                                        )}
                                                        %
                                                    </div>
                                                </div>
                                            )}
                                            {symbol in financialState.crypto && (
                                                <div className="mt-2">
                                                    <div className="text-2xl font-semibold">
                                                        $
                                                        {financialState.crypto[
                                                            symbol
                                                        ].price.toFixed(2)}
                                                    </div>
                                                    <div
                                                        className={`text-sm ${
                                                            financialState
                                                                .crypto[symbol]
                                                                .change24h >= 0
                                                                ? 'text-green-400'
                                                                : 'text-red-400'
                                                        }`}
                                                    >
                                                        {financialState.crypto[
                                                            symbol
                                                        ].change24h >= 0
                                                            ? '+'
                                                            : ''}
                                                        {financialState.crypto[
                                                            symbol
                                                        ].changePercent24h.toFixed(
                                                            2
                                                        )}
                                                        %
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Instructions */}
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Get Started
                            </h2>
                            <div className="text-slate-300 space-y-2">
                                <p>
                                    💬 Chat with AI agents for financial analysis
                                </p>
                                <p>
                                    📊 Ask to add symbols to your watchlist
                                </p>
                                <p>
                                    📈 Get real-time stock and crypto analysis
                                </p>
                                <p>
                                    🎓 Learn about financial concepts and metrics
                                </p>
                                <p className="mt-4 text-sm text-slate-400">
                                    Example: &quot;Add AAPL to my watchlist and analyze its recent performance&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Cedar Chat */}
                <FloatingCedarChat
                    side="right"
                    title="Financial AI Assistant"
                    collapsedLabel="Chat with AI"
                />
            </div>
        </div>
    )
}
