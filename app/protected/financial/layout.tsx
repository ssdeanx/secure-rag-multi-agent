import type { ReactNode } from 'react'
import { CedarCopilot } from 'cedar-os'

/**
 * Financial Domain Layout (Server Component)
 *
 * This layout configures Cedar to connect directly to the Mastra backend
 * for financial intelligence interactions (crypto & stock analysis, market education).
 *
 * Mastra backend runs on port 4111 with routes defined in apiRegistry.ts:
 * - POST /chat (non-streaming fallback)
 * - POST /chat/stream (SSE streaming - preferred)
 *
 * Cedar automatically uses streaming by default and appends /stream to chatPath.
 *
 * Configuration:
 * - provider: 'mastra' - connects to Mastra backend
 * - baseURL: Mastra server URL (default: http://localhost:4111)
 * - chatPath: '/chat' - base endpoint (Cedar auto-appends /stream for streaming)
 *
 * How it works:
 * 1. User sends message in any Cedar chat component
 * 2. Cedar automatically calls: POST http://localhost:4111/chat/stream
 * 3. Mastra backend routes to financial agents (cryptoAnalysis, stockAnalysis, marketEducation)
 * 4. Agents stream analysis with setState actions to update financial state
 * 5. Cedar renders streaming text + handles setState/frontendTool actions
 *
 * State integration:
 * - Financial state (watchlist, stocks, crypto) exposed to agents via useSubscribeStateToAgentContext
 * - Agents can update state via setState actions (e.g., addToWatchlist, updateStock)
 * - State changes trigger UI updates in real-time
 *
 * Note: Layout is a SERVER component (can read server-only env vars)
 *       Child page.tsx is CLIENT component (needed for useState, chat interactions)
 */
export default function FinancialLayout({ children }: { children: ReactNode }) {
    return (
        <CedarCopilot
            llmProvider={{
                provider: 'mastra',
                baseURL:
                    process.env.NEXT_PUBLIC_MASTRA_URL ??
                    'http://localhost:4111',
                chatPath: '/chat', // Cedar auto-appends /stream for streaming
                resumePath: '/resume',
                voiceRoute: ''
                // Streaming is ENABLED BY DEFAULT
                // Cedar will call: POST {baseURL}/chat/stream
                // For non-streaming: POST {baseURL}/chat (fallback)
            }}
        >
            {children}
        </CedarCopilot>
    )
}
