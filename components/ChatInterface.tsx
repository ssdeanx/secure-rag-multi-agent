'use client';

import { Send, Loader2, Shield, FileText, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
      const assistantMessage: Message = {
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

                if (typeof data.content === 'string' && data.content) {
                  assistantMessage.content += data.content;
                  setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: assistantMessage.content }
                      : msg
                  ));
                }

                if (Array.isArray(data.citations)) {
                  assistantMessage.citations = data.citations;
                }

                if (Array.isArray(data.contexts)) {
                  assistantMessage.contexts = data.contexts;
                }

                if (data.done === true) {
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
    <Card className="overflow-hidden flex flex-col h-[600px] lg:h-[700px]">
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
                ? 'bg-primary/10 border border-primary/20 hover:border-primary/30'
                : message.role === 'system'
                ? 'bg-secondary border border-border hover:border-border/80'
                : 'bg-muted border border-border hover:border-border/80'
            } rounded-xl p-5 hover:shadow-lg`}>

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
              <div className="prose prose-sm max-w-none dark:prose-invert
                            prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed
                            prose-strong:text-foreground prose-code:text-primary prose-code:bg-muted
                            prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                            prose-pre:bg-muted prose-pre:border prose-pre:border-border
                            prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-3 last:mb-0 break-words">{children}</p>,
                    code: ({ children, className }) => {
                      const isInline = !className || className.length === 0;
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
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center">
                    <Shield className="h-3 w-3 mr-1.5" />
                    Verified Sources:
                  </p>
                  <div className="space-y-2">
                    {message.citations.map((citation, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground flex items-start space-x-2 p-2 rounded-lg bg-muted/50">
                        <span className="text-primary font-mono">•</span>
                        <span className="break-all">{citation.source ?? citation.docId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Timestamp */}
              <div className="mt-3 text-xs text-muted-foreground flex items-center justify-between">
                <span>{message.timestamp.toLocaleTimeString()}</span>
                {message.role === 'assistant' && (
                  <span className="text-green-500 text-xs">✓ Verified</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Enhanced Loading State */}
        {loading && (
          <div className="flex justify-start animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-muted border border-border rounded-xl p-5 flex items-center space-x-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0ms]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:150ms]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:300ms]"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Sample Questions */}
      {messages.length === 1 && (
        <div className="px-6 pb-6 animate-in fade-in-50 duration-700">
          <p className="text-sm font-medium text-muted-foreground mb-4 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Try asking:
          </p>
          <div className="flex flex-wrap gap-3">
            {sampleQuestions.map((question: string, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInput(question)}
                className="group text-sm px-4 py-2.5 rounded-xl bg-secondary border border-border
                         hover:bg-accent hover:text-accent-foreground
                         transition-all duration-300 hover:scale-105 hover:shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <span className="group-hover:text-primary transition-colors duration-300">
                  {question}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Input Section */}
      <div className="border-t border-border p-6 bg-muted/30">
        <div className="flex space-x-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask a question..."
            className="flex-1 text-base px-5 py-4 h-auto"
            disabled={loading}
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            size="lg"
            className="px-8 py-4 hover:scale-105 transition-all duration-300"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Send className="h-6 w-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
