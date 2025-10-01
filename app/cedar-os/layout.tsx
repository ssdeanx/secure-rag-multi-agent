import type { ReactNode } from 'react';

/**
 * Cedar-OS Layout
 * 
 * This layout wraps all Cedar-OS routes.
 * 
 * NOTE: Cedar provider configuration is currently handled at the component level
 * due to version compatibility. When Cedar-OS is updated, configure CedarCopilot
 * provider here with:
 * 
 * <CedarCopilot providerConfig={{
 *   provider: 'mastra',
 *   baseURL: process.env.NEXT_PUBLIC_MASTRA_URL,
 *   chatPath: '/api/chat',
 *   resumePath: '/api/chat/resume',
 * }}>
 *   {children}
 * </CedarCopilot>
 */
export default function CedarLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
