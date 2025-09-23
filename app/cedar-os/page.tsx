'use client';

import React, { useEffect } from 'react';

import { ChatModeSelector } from '../../cedar/ChatModeSelector';
import { CedarCaptionChat } from '@/cedar/components/chatComponents/CedarCaptionChat';
import { FloatingCedarChat } from '@/cedar/components/chatComponents/FloatingCedarChat';
import { SidePanelCedarChat } from '@/cedar/components/chatComponents/SidePanelCedarChat';
import { RoadmapCanvas } from '../../cedar/RoadmapCanvas';
import { createMastraClient } from '@/lib/mastra/mastra-client';

export const experimental_ppr = true

type ChatMode = 'floating' | 'sidepanel' | 'caption';

export default function HomePage() {
  const [client] = React.useState(() => createMastraClient());

  useEffect(() => {
    // Example: Send initial canvas state to Mastra for agent awareness
    const sendCanvasState = async () => {
      try {
        // mastra client may not implement `chat` in older client versions;
        // call only if available to avoid runtime errors in the frontend.
        // @ts-ignore - client.chat may be missing on older Mastra clients
        if (typeof client.chat === 'function') {
          // @ts-ignore
          await client.chat({ message: 'Initialize roadmap context', context: { type: 'roadmap_init' } });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize Mastra context:', error);
      }
    };
    sendCanvasState();
  }, [client]);

  // Cedar-OS chat components with mode selector
  // Choose between caption, floating, or side panel chat modes
  const [chatMode, setChatMode] = React.useState<ChatMode>('caption');

  const renderContent = () => (
    <div className="relative h-screen w-full flex">
      <div className="flex-1">
        <RoadmapCanvas />
      </div>
      <div className="w-80 border-l">
        <ChatModeSelector currentMode={chatMode} onModeChange={setChatMode} />

        {chatMode === 'caption' && <CedarCaptionChat />}

        {chatMode === 'floating' && (
          <FloatingCedarChat side="right" title="Cedarling Chat" collapsedLabel="Chat with Cedar" />
        )}
      </div>
    </div>
  );

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
    );
  }

  return renderContent();
}
