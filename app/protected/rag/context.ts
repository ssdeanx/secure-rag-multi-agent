import React from 'react'
import { useSubscribeStateToAgentContext } from 'cedar-os'
import { FileText, Shield, Search } from 'lucide-react'
import type { Document, PolicyRule, Retrieval } from './state'

export function useRagContext() {
    useSubscribeStateToAgentContext(
        'documents',
        (documents: Document[]) => ({
            indexedDocuments: documents.map((d) => ({
                id: d.id,
                title: d.title,
                classification: d.classification,
                department: d.department,
                tags: d.tags,
            })),
        }),
        {
            icon: React.createElement(FileText, { size: 16 }),
            color: '#3B82F6',
        }
    )

    useSubscribeStateToAgentContext(
        'policies',
        (policies: PolicyRule[]) => ({
            accessPolicies: policies.map((p) => ({
                id: p.id,
                role: p.role,
                allowedClassifications: p.allowedClassifications,
                allowedDepartments: p.allowedDepartments,
            })),
        }),
        {
            icon: React.createElement(Shield, { size: 16 }),
            color: '#EF4444',
        }
    )

    useSubscribeStateToAgentContext(
        'retrievals',
        (retrievals: Retrieval[]) => ({
            retrievalHistory: retrievals.slice(0, 10).map((r) => ({
                id: r.id,
                query: r.query,
                documentCount: r.documents.length,
                timestamp: r.timestamp,
                userRole: r.userRole,
            })),
        }),
        {
            icon: React.createElement(Search, { size: 16 }),
            color: '#10B981',
        }
    )
}
