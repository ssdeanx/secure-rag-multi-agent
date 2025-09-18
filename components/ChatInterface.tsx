'use client';

import { Send, Loader2, Shield, FileText, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef, useCallback, useMemo, Dispatch, SetStateAction, RefObject } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Array<{ docId: string; source?: string }>;
  contexts?: Array<{
    docId: string;
    classification: string;
    score: number;
  }>;
  timestamp: Date;
}

interface ChatInterfaceProps {
  jwt: string;
  role: string;
}

export default function ChatInterface({ jwt, role }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{
      id: '0',
      role: 'system',
      content: `Welcome! You're authenticated as **${role}**. Ask me anything and I'll retrieve information based on your access level.`,
      timestamp: new Date()
    }]);
  }, [role]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) {return;}

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response: Response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jwt,
          question: input
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder: TextDecoder = new TextDecoder();
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {break;}

          const chunk: string = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.content) {
                  assistantMessage.content += data.content;
                  setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: assistantMessage.content }
                      : msg
                  ));
                }

                if (data.citations) {
                  assistantMessage.citations = data.citations;
                }

                if (data.contexts) {
                  assistantMessage.contexts = data.contexts;
                }

                if (data.done) {
                  setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessage.id
                      ? assistantMessage
                      : msg
                  ));
                }
              } catch (e) {
                console.error('Failed to parse SSE data:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        content: 'Failed to get response. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, jwt]);

  const sampleQuestions: string[] = useMemo(() => [
    "What is the expense reimbursement policy?",
    "What are the API response time requirements?",
    "What is the CEO's compensation?",
    "What is our git workflow?",
    "What are the budget approval thresholds?"
  ], []);

  return (
    <div className="glass-effect rounded-xl overflow-hidden flex flex-col h-[600px] shadow-2xl shadow-black/20">
      {/* Messages Container with Container Query Support */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 @container">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex animate-in slide-in-from-bottom-4 duration-500 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className={`group relative max-w-[85%] @lg:max-w-[75%] @xl:max-w-[70%] transition-all duration-300 ${
              message.role === 'user'
                ? 'bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-500/30 hover:border-blue-400/50'
                : message.role === 'system'
                ? 'bg-gradient-to-br from-purple-600/20 to-purple-700/10 border border-purple-500/30 hover:border-purple-400/50'
                : 'bg-gradient-to-br from-gray-800/60 to-gray-900/40 border border-gray-700/50 hover:border-gray-600/50'
            } rounded-xl p-5 hover:shadow-lg hover:shadow-black/10`}>

              {/* Context Tags with Enhanced Styling */}
              {message.role === 'assistant' && message.contexts && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {message.contexts.map((ctx, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-300
                        hover:scale-105 hover:shadow-md ${
                        ctx.classification === 'confidential' ? 'security-badge-confidential hover:shadow-red-500/20' :
                        ctx.classification === 'internal' ? 'security-badge-internal hover:shadow-yellow-500/20' :
                        'security-badge-public hover:shadow-green-500/20'
                      }`}
                    >
                      <FileText className="h-3 w-3 mr-1.5" />
                      <span className="break-all">{ctx.docId}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Enhanced Message Content with Better Typography */}
              <div className="prose prose-invert prose-sm max-w-none
                            prose-headings:text-gray-200 prose-p:text-gray-300 prose-p:leading-relaxed
                            prose-strong:text-white prose-code:text-blue-300 prose-code:bg-gray-800/50
                            prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                            prose-pre:bg-gray-900/50 prose-pre:border prose-pre:border-gray-700
                            prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-400">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-3 last:mb-0 break-words">{children}</p>,
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="break-all">{children}</code>
                      ) : (
                        <code className={className}>{children}</code>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {/* Enhanced Citations Section */}
              {message.citations && message.citations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <p className="text-xs font-medium text-gray-400 mb-3 flex items-center">
                    <Shield className="h-3 w-3 mr-1.5" />
                    Verified Sources:
                  </p>
                  <div className="space-y-2">
                    {message.citations.map((citation, idx) => (
                      <div key={idx} className="text-xs text-gray-500 flex items-start space-x-2 p-2 rounded-lg bg-gray-800/30">
                        <span className="text-blue-400 font-mono">•</span>
                        <span className="break-all">{citation.source ?? citation.docId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Timestamp */}
              <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
                <span>{message.timestamp.toLocaleTimeString()}</span>
                {message.role === 'assistant' && (
                  <span className="text-green-400 text-xs">✓ Verified</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Enhanced Loading State */}
        {loading && (
          <div className="flex justify-start animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 border border-gray-700/50 rounded-xl p-5 flex items-center space-x-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
              <span className="text-sm text-gray-400">Thinking...</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Sample Questions */}
      {messages.length === 1 && (
        <div className="px-6 pb-6 animate-in fade-in-50 duration-700">
          <p className="text-sm font-medium text-gray-400 mb-4 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Try asking:
          </p>
          <div className="flex flex-wrap gap-3">
            {sampleQuestions.map((question: string, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInput(question)}
                className="group text-sm px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/30
                         hover:from-gray-700/60 hover:to-gray-800/40 border border-gray-700/50 hover:border-gray-600/50
                         transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/10
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <span className="group-hover:text-blue-300 transition-colors duration-300">
                  {question}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Input Section */}
      <div className="border-t border-gray-800/50 p-6 bg-gradient-to-r from-gray-900/20 to-gray-800/20">
        <div className="flex space-x-4">
          <div className="flex-1 relative group">
            <input
              type="text"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask a question..."
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-5 py-4 text-base
                       focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                       group-hover:border-gray-600/50 transition-all duration-300 placeholder:text-gray-500
                       disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0
                          group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
          <button
            type="button"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-medium
                     hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
                     transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     flex items-center overflow-hidden"
          >
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full
                          group-hover:translate-x-full transition-transform duration-1000" />

            <div className="relative z-10">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Send className="h-6 w-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
