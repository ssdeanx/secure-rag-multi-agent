import type { ReactNode } from 'react'
import { CedarCopilot } from 'cedar-os'

/**
 * Cedar-OS Layout (Server Component)
 *
 * This layout configures Cedar to connect directly to the Mastra backend.
 * Mastra backend runs on port 4111 with routes defined in apiRegistry.ts:
 * - POST /chat (non-streaming fallback)
 * - POST /chat/stream (SSE streaming - preferred)
 *
 * Cedar automatically uses streaming by default and appends /stream to chatPath.
 *
 * Configuration:
 * - provider: 'mastra' - connects to Mastra backend
 * - baseURL: Mastra server URL (default: http://localhost:4111)
 * - apiKey: JWT token for authentication
 * - chatPath: '/chat' - base endpoint (Cedar auto-appends /stream for streaming)
 * - resumePath: '' - This is the path to resume
 * - voiceRoute: '' - Route for productRoadmapAgent voice.
 *
 * How it works:
 * 1. User sends message in any Cedar chat component (Caption/Floating/SidePanel)
 * 2. Cedar automatically calls: POST http://localhost:4111/chat/stream
 * 3. Mastra backend streams SSE events with text chunks and actions
 * 4. Cedar renders streaming text + handles setState/frontendTool actions
 *
 * Note: Layout is a SERVER component (can read server-only env vars like JWT_TOKEN)
 *       Child page.tsx is CLIENT component (needed for useState, chat interactions)
 */
export default function CedarLayout({ children }: { children: ReactNode }) {
    return (
        <CedarCopilot
            llmProvider={{
                provider: 'mastra',
                baseURL:
                    process.env.NEXT_PUBLIC_MASTRA_URL ??
                    'http://localhost:4111',
                // Removed apiKey since the chatWorkflow1 doesn't need JWT authentication
                // apiKey: process.env.NEXT_PUBLIC_JWT_TOKEN ?? '', // #FIXME - Not needed for this workflow
                chatPath: '/chat', // Cedar auto-appends /stream for streaming
                //              resumePath: '',
                //              voiceRoute: ''
                // Streaming is ENABLED BY DEFAULT
                // Cedar will call: POST {baseURL}/chat/stream
                // For non-streaming: POST {baseURL}/chat (fallback)
            }}
        >
            {children}
        </CedarCopilot>
    )
}
