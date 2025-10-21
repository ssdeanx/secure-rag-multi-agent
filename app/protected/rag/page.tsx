'use client'

import React, { useState } from 'react'
import { FloatingCedarChat } from '@/cedar/components/chatComponents/FloatingCedarChat'
import { useRagCedar } from './hooks'
import type { Document, PolicyRule, Retrieval } from './state'
import './globals.css'

export default function RagPage() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [policies, setPolicies] = useState<PolicyRule[]>([])
    const [retrievals, setRetrievals] = useState<Retrieval[]>([])

    useRagCedar(documents, setDocuments, policies, setPolicies, retrievals, setRetrievals)

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-2">
                    Governed RAG Dashboard
                </h1>
                <p className="text-slate-400 mb-8">
                    Secure knowledge access with role-based access control
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Documents Panel */}
                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-blue-500">📄</span> Indexed Documents
                        </h2>
                        {documents.length > 0 ? (
                            <div className="space-y-3">
                                {documents.slice(0, 5).map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                                    >
                                        <h3 className="text-white font-semibold mb-2">
                                            {doc.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className={`text-xs font-semibold px-2 py-1 rounded ${
                                                    doc.classification === 'confidential'
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : doc.classification === 'internal'
                                                          ? 'bg-yellow-500/20 text-yellow-400'
                                                          : 'bg-green-500/20 text-green-400'
                                                }`}
                                            >
                                                {doc.classification}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {doc.department}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {doc.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400">
                                No documents indexed. Upload documents to get started.
                            </p>
                        )}
                    </div>

                    {/* Policies Panel */}
                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-red-500">🛡️</span> Access Policies
                        </h2>
                        {policies.length > 0 ? (
                            <div className="space-y-3">
                                {policies.map((policy) => (
                                    <div
                                        key={policy.id}
                                        className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                                    >
                                        <h3 className="text-white font-semibold mb-2 uppercase">
                                            {policy.role}
                                        </h3>
                                        <p className="text-sm text-slate-400 mb-2">
                                            {policy.description}
                                        </p>
                                        <div className="text-xs text-slate-500">
                                            <div>
                                                Classifications:{' '}
                                                {policy.allowedClassifications.join(', ')}
                                            </div>
                                            <div>
                                                Departments:{' '}
                                                {policy.allowedDepartments.join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400">
                                No policies defined. Ask the agent to configure access rules.
                            </p>
                        )}
                    </div>

                    {/* Retrievals Panel */}
                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-green-500">🔍</span> Recent Queries
                        </h2>
                        {retrievals.length > 0 ? (
                            <div className="space-y-3">
                                {retrievals.slice(0, 5).map((retrieval) => (
                                    <div
                                        key={retrieval.id}
                                        className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                                    >
                                        <p className="text-white font-medium mb-2">
                                            {retrieval.query}
                                        </p>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400">
                                                {retrieval.documents.length} documents
                                            </span>
                                            <span className="text-slate-500">
                                                {retrieval.userRole}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400">
                                No queries yet. Ask the agent to retrieve documents.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <FloatingCedarChat />
        </div>
    )
}
