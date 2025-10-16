;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;'use client' // REQUIRED: Cedar chat components use React hooks (useState, useEffect, etc.)

import React from 'react'

import { ChatModeSelector } from '../../../cedar/ChatModeSelector'
import { CedarCaptionChat } from '@/cedar/components/chatComponents/CedarCaptionChat'
import { FloatingCedarChat } from '@/cedar/components/chatComponents/FloatingCedarChat'
import { SidePanelCedarChat } from '@/cedar/components/chatComponents/SidePanelCedarChat'
import { RoadmapCanvas } from '../../../cedar/RoadmapCanvas'

export const experimental_ppr = true

type ChatMode = 'floating' | 'sidepanel' | 'caption'

/**
 * Cedar-OS Page Component (Client Component)
 *
 * WHY CLIENT COMPONENT?
 * - Uses React hooks (useState for chatMode)
 * - Cedar chat components require client-side interactivity
 * - Layout.tsx (parent) is server component that provides CedarCopilot context
 * - This pattern is CORRECT: server layout wraps client page
 *
 * CEDAR COMPONENTS AVAILABLE:
 * ============================
 *
 * 1. CHAT COMPONENTS (all auto-stream from Mastra backend):
 *    - CedarCaptionChat: Bottom-center overlay chat (current conversation only)
 *    - FloatingCedarChat: Resizable floating window (left/right positioning)
 *    - SidePanelCedarChat: Side panel that pushes content (dedicated space)
 *
 * 2. SPELLS (gesture-based interactions):
 *    - QuestioningSpell: Interactive cursor for AI questions on hover
 *    - RadialMenuSpell: Circular menu for multiple actions (hotkey activated)
 *    - TooltipMenuSpell: Context menu for text selections
 *    - SliderSpell: Adjustable sliders with hotkey control
 *    - RangeSliderSpell: Dual-handle range selection
 *
 *    Spells are keyboard/gesture-activated AI interactions. Examples:
 *    - Hold 'Q' + hover = ask AI about element
 *    - Hold 'R' + click = radial menu with AI actions
 *    - Select text + hold 'T' = tooltip menu with AI options
 *
 * 3. INPUT COMPONENTS:
 *    - ChatInput: Rich text editor with @mentions and context
 *    - FloatingChatInput: Floating version of chat input
 *    - TooltipMenu: Context menu for selections
 *
 * 4. MESSAGE RENDERERS:
 *    - ChatBubbles: Standard chat message bubbles
 *    - StreamingText: Animated streaming text display
 *    - MarkdownRenderer: Markdown with syntax highlighting
 *    - TodoList: Interactive todo list messages
 *    - MultipleChoice: AI-generated choice buttons
 *
 * 5. VOICE COMPONENTS:
 *    - VoiceIndicator: Visual feedback for voice input
 *
 * 6. DEBUGGER:
 *    - DebuggerPanel: View messages, network calls, state
 *
 * 7. 3D/VISUAL EFFECTS:
 *    - Container3D, Flat3dContainer, GlassyPaneContainer
 *    - GlowingMesh, GradientMesh, InsetGlow
 *    - ShimmerText, TypewriterText, PhantomText
 *
 * STREAMING:
 * Cedar automatically uses /chat/stream endpoint (SSE) for real-time responses.
 * Backend sends data-only SSE format with text chunks and action objects.
 *
 * ROADMAP INTEGRATION:
 * The RoadmapCanvas component exposes state to Cedar agents via cedarContext.
 * Agents can read/modify roadmap nodes through setState actions.
 */
export default function HomePage() {
    // Cedar-OS chat components with mode selector
    // Choose between caption, floating, or side panel chat modes
    const [chatMode, setChatMode] = React.useState<ChatMode>('caption')

    const renderContent = () => (
        <div className="relative h-screen w-full flex">
            <div className="flex-1">
                <RoadmapCanvas />
            </div>
            <div className="w-80 border-l">
                <ChatModeSelector
                    currentMode={chatMode}
                    onModeChange={setChatMode}
                />

                {chatMode === 'caption' && <CedarCaptionChat />}

                {chatMode === 'floating' && (
                    <FloatingCedarChat
                        side="right"
                        title="Cedarling Chat"
                        collapsedLabel="Chat with Cedar"
                    />
                )}
            </div>
        </div>
    )

    if (chatMode === 'sidepanel') {
        return (
            <SidePanelCedarChat
                side="right"
                title="Cedarling Chat"
                collapsedLabel="Chat with Cedar"
                showCollapsedButton={true}
            >
                {renderContent()}
            </SidePanelCedarChat>
        )
    }

    return renderContent()
}
