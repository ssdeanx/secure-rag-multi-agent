'use client'

import * as React from 'react'
import Container3D from '../containers/Container3D'
import './ResearchPanel.css'

interface ResearchPanelProps {
    researchState?: ResearchState
    title?: string
    onClose?: () => void
}

interface ResearchState {
    query: string
    progress: number
    status: 'idle' | 'searching' | 'analyzing' | 'synthesizing' | 'complete' | 'error'
    sources: Array<{ url: string; title: string; relevance: number }>
    findings: string[]
    report: string
    error?: string
}

export const ResearchPanel: React.FC<ResearchPanelProps> = ({
    researchState = {
        query: '',
        progress: 0,
        status: 'idle',
        sources: [],
        findings: [],
        report: '',
        error: undefined,
    },
    title = 'Deep Research',
    onClose,
}) => {
    // Set CSS custom property for progress
    React.useEffect(() => {
        document.documentElement.style.setProperty('--progress-width', `${researchState.progress}%`);
    }, [researchState.progress]);

    return (
        <Container3D className="w-full h-full p-4 max-w-4xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{title}</h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {/* Query */}
                <div>
                    <label className="block text-sm font-medium mb-2">Research Query</label>
                    <div className="p-3 bg-gray-50 rounded border">
                        {researchState.query || 'No query set'}
                    </div>
                </div>

                {/* Status and Progress */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm font-medium mb-1">Status</div>
                        <div className={`text-sm px-2 py-1 rounded ${
                            researchState.status === 'complete' ? 'bg-green-100 text-green-800' :
                            researchState.status === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                            {researchState.status.replace('_', ' ').toUpperCase()}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-medium mb-1">Progress</div>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" />
                        </div>
                        <div className="progress-percentage">
                            {researchState.progress}%
                        </div>
                    </div>
                </div>

                {researchState.error !== null && researchState.error !== '' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                        <div className="text-sm font-medium text-red-800">Error</div>
                        <div className="text-sm text-red-700 mt-1">{researchState.error}</div>
                    </div>
                )}

                {/* Sources */}
                <div>
                    <h3 className="font-medium mb-2">Sources ({researchState.sources.length})</h3>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                        {researchState.sources.length === 0 ? (
                            <div className="text-sm text-gray-500">No sources found yet</div>
                        ) : (
                            researchState.sources.map((source, i) => (
                                <div key={i} className="text-sm p-2 bg-gray-50 rounded border">
                                    <div className="font-medium truncate">{source.title}</div>
                                    <div className="text-gray-600 truncate text-xs">{source.url}</div>
                                    <div className="text-xs">Relevance: {(source.relevance * 100).toFixed(0)}%</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Findings */}
                <div>
                    <h3 className="font-medium mb-2">Key Findings</h3>
                    <div className="max-h-32 overflow-y-auto">
                        {researchState.findings.length === 0 ? (
                            <div className="text-sm text-gray-500">No findings yet</div>
                        ) : (
                            <ul className="space-y-1">
                                {researchState.findings.map((finding, i) => (
                                    <li key={i} className="text-sm flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>{finding}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Report */}
                {researchState.report && (
                    <div>
                        <h3 className="font-medium mb-2">Research Report</h3>
                        <div className="max-h-64 overflow-y-auto p-3 bg-gray-50 rounded border">
                            <p className="whitespace-pre-wrap">{researchState.report}</p>
                        </div>
                    </div>
                )}
            </div>
        </Container3D>
    )
}
