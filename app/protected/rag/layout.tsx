import type { ReactNode } from 'react'
import { CedarCopilot } from 'cedar-os'

export default function RagLayout({ children }: { children: ReactNode }) {
    return (
        <CedarCopilot
            llmProvider={{
                provider: 'mastra',
                baseURL:
                    process.env.NEXT_PUBLIC_MASTRA_URL ??
                    'http://localhost:4111',
                chatPath: '/chat',
                resumePath: '/resume',
                voiceRoute: '',
            }}
        >
            {children}
        </CedarCopilot>
    )
}
