'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { FloatingCedarChat } from '@/cedar/components/chatComponents/FloatingCedarChat'
import { ResearchPanel } from '@/cedar/components/research/ResearchPanel'
import { ResearchResults } from '@/cedar/components/research/ResearchResults'
import ResearchSpell from '@/cedar/components/spells/ResearchSpell'
import SourceAddSpell from '@/cedar/components/spells/SourceAddSpell'
import { CommandBar } from '@/cedar/components/CommandBar/CommandBar'
import { DebuggerPanel } from '@/cedar/components/debugger/DebuggerPanel'
import { VoiceIndicator } from '@/cedar/components/voice/VoiceIndicator'
import { useSubscribeStateToAgentContext, useStateBasedMentionProvider, useRegisterState } from 'cedar-os'
import type { CommandBarContents } from '@/cedar/components/CommandBar/CommandBar'
import { Settings, Download, Trash2, FileText, Search, Mic, Brain, X } from 'lucide-react'

interface ResearchState {
    query: string
    progress: number
    status: 'idle' | 'searching' | 'analyzing' | 'synthesizing' | 'complete' | 'error'
    sources: Array<{ id: string; url: string; title: string; relevance: number }>
    findings: Array<{ id: string; text: string; sourceId?: string }>
    report: string
    error?: string
    depth: number // Research depth 1-10
    sessions: Array<{ id: string; query: string; timestamp: number }>
    isVoiceActive: boolean
}

export default function ResearchPage() {
    // Local state management
    const [researchState, setResearchState] = useState<ResearchState>({
        query: '',
        progress: 0,
        status: 'idle',
        sources: [],
        findings: [],
        report: '',
        depth: 5,
        sessions: [],
        isVoiceActive: false
    })

    // Register state in Cedar store
    useRegisterState({
        key: 'researchState',
        value: researchState,
        setValue: setResearchState,
        description: 'Deep research assistant state with multi-session support'
    })

    // Subscribe research state to agent context
    useSubscribeStateToAgentContext(
        'researchState',
        (state: ResearchState) => ({
            'current-research': state.query ? [{
                id: 'current-query',
                query: state.query,
                status: state.status,
                progress: state.progress,
                depth: state.depth
            }] : [],
            'research-sources': state.sources.map(source => ({
                id: source.id,
                title: source.title,
                url: source.url,
                relevance: source.relevance
            })),
            'research-findings': state.findings.map(finding => ({
                id: finding.id,
                text: finding.text
            }))
        }),
        {
            icon: <Brain size={16} />,
            color: '#8b5cf6',
            labelField: (item: { query?: string; title?: string; text?: string }) => item.query ?? item.title ?? item.text?.slice(0, 50) ?? 'Untitled',
            order: 5,
            showInChat: true
        }
    )

    // Register mention providers for sources and findings
    useStateBasedMentionProvider({
        stateKey: 'researchState',
        trigger: '@source',
        labelField: 'title',
        searchFields: ['title', 'url'],
        description: 'Research Sources',
        icon: <FileText size={14} />,
        color: '#3b82f6',
        order: 10
    })

    useStateBasedMentionProvider({
        stateKey: 'researchState',
        trigger: '@finding',
        labelField: (finding: { text: string }) => finding.text.slice(0, 50) + '...',
        searchFields: ['text'],
        description: 'Research Findings',
        icon: <Search size={14} />,
        color: '#10b981',
        order: 11
    })

    // Local UI state
    const [commandBarOpen, setCommandBarOpen] = useState(false)
    const [debuggerOpen, setDebuggerOpen] = useState(false)

    const handleResearch = useCallback(async (selectedText: string) => {
        const sessionId = `session-${Date.now()}`
        
        setResearchState(prev => ({
            ...prev,
            query: selectedText,
            progress: 0,
            status: 'searching',
            findings: [],
            report: '',
            error: undefined,
            sessions: [...prev.sessions, { id: sessionId, query: selectedText, timestamp: Date.now() }]
        }))

        try {
            // Call Mastra research workflow directly
            const response = await fetch('/api/chat/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{
                        role: 'user',
                        content: `Please research this topic: ${selectedText}. Provide findings and sources.`
                    }],
                    workflow: 'governed-rag-index'
                })
            })

            if (!response.ok) {
                throw new Error('Research request failed')
            }

            // Handle streaming response
            const reader = response.body?.getReader()
            if (!reader) {
                return
            }

            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) {
                    break
                }

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n')

                for (let i = 0; i < lines.length - 1; i++) {
                    const line = lines[i].trim()
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6))

                            if (data.type === 'text') {
                                setResearchState(prev => ({
                                    ...prev,
                                    findings: [...prev.findings, { id: `finding-${Date.now()}`, text: data.content }],
                                    progress: Math.min(prev.progress + 10, 90),
                                    status: 'analyzing'
                                }))
                            } else if (data.type === 'tool_call') {
                                setResearchState(prev => ({
                                    ...prev,
                                    status: 'searching',
                                    progress: Math.min(prev.progress + 5, 80)
                                }))
                            } else if (data.type === 'source') {
                                setResearchState(prev => ({
                                    ...prev,
                                    sources: [...prev.sources, { id: `source-${Date.now()}`, ...data.source, relevance: data.relevance ?? 0.8 }]
                                }))
                            }
                        } catch {
                            // Ignore parse errors
                        }
                    }
                }

                buffer = lines[lines.length - 1]
            }

            // Complete research
            setResearchState(prev => ({
                ...prev,
                progress: 100,
                status: 'complete',
                report: prev.findings.join('\n\n')
            }))

        } catch (error) {
            setResearchState(prev => ({
                ...prev,
                status: 'error',
                progress: 0,
                error: error instanceof Error ? error.message : 'Unknown error'
            }))
        }
    }, [])

    const handleSourceAdd = useCallback((source: { url: string; title: string }) => {
        setResearchState(prev => ({
            ...prev,
            sources: [...prev.sources, { id: `source-${Date.now()}`, ...source, relevance: 0.8 }]
        }))
    }, [])

    const handleDepthChange = useCallback((depth: number) => {
        setResearchState(prev => ({
            ...prev,
            depth
        }))
    }, [])

    const handleVoiceToggle = useCallback(() => {
        setResearchState((prev: ResearchState) => ({
            ...prev,
            isVoiceActive: !prev.isVoiceActive
        }))
    }, [])

    const handleClear = useCallback(() => {
        setResearchState({
            query: '',
            progress: 0,
            status: 'idle',
            sources: [],
            findings: [],
            report: '',
            depth: 5,
            sessions: [],
            isVoiceActive: false
        })
    }, [])

    const handleExport = useCallback(() => {
        const content = `Research Report: ${researchState.query}\n\nFindings:\n${researchState.findings.join('\n')}\n\nReport:\n${researchState.report}`
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'research-report.txt'
        a.click()
        URL.revokeObjectURL(url)
    }, [researchState])

    // CommandBar configuration
    const commandBarContents: CommandBarContents = {
        groups: [
            {
                id: 'research-actions',
                heading: 'Research Actions',
                items: [
                    {
                        id: 'new-research',
                        label: 'New Research',
                        description: 'Start a new research query',
                        icon: <Search size={16} />,
                        onSelect: () => {
                            const selection = window.getSelection()?.toString()?.trim() ?? ''
                            if (selection.length > 0) {
                                handleResearch(selection)
                            } else {
                                const query = prompt('Enter research query:')
                                if (query !== null && query.trim().length > 0) {
                                    handleResearch(query)
                                }
                            }
                        },
                        activationEvent: 'cmd+r',
                        color: 'blue'
                    },
                    {
                        id: 'voice-research',
                        label: 'Voice Research',
                        description: 'Start voice-powered research',
                        icon: <Mic size={16} />,
                        onSelect: handleVoiceToggle,
                        activationEvent: 'cmd+shift+v',
                        color: 'purple'
                    },
                    {
                        id: 'add-source',
                        label: 'Add Source',
                        description: 'Add a custom research source',
                        icon: <FileText size={16} />,
                        onSelect: () => {},
                        activationEvent: 'cmd+shift+s',
                        color: 'green'
                    }
                ]
            },
            {
                id: 'research-management',
                heading: 'Management',
                items: [
                    {
                        id: 'export',
                        label: 'Export Report',
                        description: 'Export research findings and report',
                        icon: <Download size={16} />,
                        onSelect: handleExport,
                        activationEvent: 'cmd+e',
                        color: 'amber',
                        disabled: researchState.status !== 'complete'
                    },
                    {
                        id: 'clear',
                        label: 'Clear Research',
                        description: 'Clear current research session',
                        icon: <Trash2 size={16} />,
                        onSelect: handleClear,
                        activationEvent: 'cmd+shift+c',
                        color: 'red'
                    },
                    {
                        id: 'debugger',
                        label: 'Toggle Debugger',
                        description: 'Open/close debugger panel',
                        icon: <Settings size={16} />,
                        onSelect: () => setDebuggerOpen(!debuggerOpen),
                        activationEvent: 'cmd+d',
                        color: 'indigo'
                    }
                ]
            }
        ],
        fixedBottomGroup: {
            id: 'quick-actions',
            items: [
                {
                    id: 'quick-research',
                    label: 'Research',
                    icon: '🔍',
                    onSelect: () => {
                        const selection = window.getSelection()?.toString()?.trim() ?? ''
                        if (selection.length > 0) {
                            handleResearch(selection)
                        }
                    },
                    activationEvent: 'r',
                    color: 'blue'
                },
                {
                    id: 'quick-voice',
                    label: 'Voice',
                    icon: '🎤',
                    onSelect: handleVoiceToggle,
                    activationEvent: 'v',
                    color: 'purple'
                },
                {
                    id: 'quick-export',
                    label: 'Export',
                    icon: '💾',
                    onSelect: handleExport,
                    activationEvent: 'e',
                    color: 'green',
                    disabled: researchState.status !== 'complete'
                }
            ]
        }
    }

    // Register command bar spell
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setCommandBarOpen(prev => !prev)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* CommandBar */}
            <CommandBar
                open={commandBarOpen}
                contents={commandBarContents}
                placeholder="Search commands or start research... (⌘K)"
                onClose={() => setCommandBarOpen(false)}
                showLatestMessage={true}
                stream={true}
            />

            {/* Debugger Panel */}
            {debuggerOpen && (
                <div className="fixed top-4 right-4 z-50 w-96">
                    <DebuggerPanel />
                    <button
                        onClick={() => setDebuggerOpen(false)}
                        className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Close debugger"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Voice Indicator */}
            {researchState.isVoiceActive && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
                    <VoiceIndicator
                        voiceState={{
                            isListening: researchState.isVoiceActive,
                            isSpeaking: false,
                            voiceError: null,
                            voicePermissionStatus: 'granted'
                        }}
                    />
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <header className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                            Deep Research Assistant
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                            Select text + ⌘R, use voice with ⌘⇧V, or press ⌘K for commands
                        </p>
                        <div className="flex justify-center gap-2 mb-4">
                            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                                ⌘K Commands
                            </div>
                            <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                                ⌘R Research
                            </div>
                            <div className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                                Hold D for Depth
                            </div>
                            <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-xs font-medium">
                                ⌘E Export
                            </div>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-500">
                            Research depth: {researchState.depth}/10 | Sessions: {researchState.sessions.length}
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Research Panel */}
                        <div className="lg:col-span-2">
                            <ResearchPanel
                                researchState={{
                                    ...researchState,
                                    findings: researchState.findings.map((f: { text: string }) => f.text)
                                }}
                                onClose={handleClear}
                            />
                        </div>

                        {/* Research Results */}
                        <div className="lg:col-span-1">
                            <ResearchResults
                                findings={researchState.findings.map((f: { text: string }) => f.text)}
                                report={researchState.report}
                                onExport={handleExport}
                            />
                        </div>
                    </div>

                    {/* Floating Chat */}
                    <div className="fixed bottom-6 right-6 z-50">
                        <FloatingCedarChat
                            side="right"
                            title="Research Assistant"
                            collapsedLabel="Chat about research"
                        />
                    </div>

                    {/* Enhanced Spells */}
                    <ResearchSpell onResearch={handleResearch} />
                    
                    <div className="fixed bottom-6 left-6 z-50">
                        <SourceAddSpell onSourceAdd={handleSourceAdd} />
                    </div>

                    {/* Depth Control - Simple UI */}
                    <div className="fixed bottom-6 right-80 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border">
                            <label className="block text-sm font-medium mb-2">
                                Research Depth: {researchState.depth}/10
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={researchState.depth}
                                onChange={(e) => handleDepthChange(parseInt(e.target.value))}
                                className="w-full"
                                aria-label="Research depth slider"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
