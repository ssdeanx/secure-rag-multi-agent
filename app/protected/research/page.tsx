'use client'

import React, { useState } from 'react'
import { FloatingCedarChat } from '@/cedar/components/chatComponents/FloatingCedarChat'
import { useResearchCedar } from './hooks'
import type { Paper, ResearchSource, Learning } from './state'
import './globals.css'

export default function ResearchPage() {
    const [papers, setPapers] = useState<Paper[]>([])
    const [sources, setSources] = useState<ResearchSource[]>([])
    const [learnings, setLearnings] = useState<Learning[]>([])

    useResearchCedar(papers, setPapers, sources, setSources, learnings, setLearnings)

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-2">
                    Research Intelligence Dashboard
                </h1>
                <p className="text-slate-400 mb-8">
                    Multi-source academic and web research powered by AI
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Papers Panel */}
                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-blue-500">📚</span> Research Papers
                        </h2>
                        {papers.length > 0 ? (
                            <div className="space-y-3">
                                {papers.map((paper) => (
                                    <div
                                        key={paper.id}
                                        className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                                    >
                                        <h3 className="text-white font-semibold mb-2">
                                            {paper.title}
                                        </h3>
                                        <p className="text-sm text-slate-400 mb-2">
                                            {paper.authors.join(', ')}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500 uppercase">
                                                {paper.source}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {paper.publishedDate}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400">
                                No papers yet. Ask the agent to search arXiv or Google Scholar.
                            </p>
                        )}
                    </div>

                    {/* Sources Panel */}
                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-green-500">📄</span> Research Sources
                        </h2>
                        {sources.length > 0 ? (
                            <div className="space-y-3">
                                {sources.map((source) => (
                                    <div
                                        key={source.id}
                                        className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                                    >
                                        <h3 className="text-white font-semibold mb-2">
                                            {source.title}
                                        </h3>
                                        <a
                                            href={source.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-400 hover:underline mb-2 block"
                                        >
                                            {source.url}
                                        </a>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500 uppercase">
                                                {source.sourceType}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {new Date(source.addedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400">
                                No sources yet. Ask the agent to scrape web pages or analyze PDFs.
                            </p>
                        )}
                    </div>

                    {/* Learnings Panel */}
                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-orange-500">💡</span> Key Learnings
                        </h2>
                        {learnings.length > 0 ? (
                            <div className="space-y-3">
                                {learnings.map((learning) => (
                                    <div
                                        key={learning.id}
                                        className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                                    >
                                        <p className="text-white mb-2">{learning.content}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500 uppercase">
                                                {learning.category}
                                            </span>
                                            <span
                                                className={`text-xs font-semibold ${
                                                    learning.importance === 'high'
                                                        ? 'text-red-400'
                                                        : learning.importance === 'medium'
                                                          ? 'text-yellow-400'
                                                          : 'text-green-400'
                                                }`}
                                            >
                                                {learning.importance}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400">
                                No learnings extracted. Ask the agent to analyze research content.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <FloatingCedarChat />
        </div>
    )
}
