import React from 'react'
import { useStateBasedMentionProvider } from 'cedar-os'
import { FileText, Shield } from 'lucide-react'
import type { Document, PolicyRule } from './state'

export function useRagMentions() {
    useStateBasedMentionProvider({
        stateKey: 'documents',
        trigger: '@',
        labelField: (doc: Document) => doc.title,
        searchFields: ['title', 'department', 'tags'],
        description: 'Documents in your RAG corpus',
        icon: React.createElement(FileText, { size: 16 }),
        color: '#3B82F6',
    })

    useStateBasedMentionProvider({
        stateKey: 'policies',
        trigger: '@',
        labelField: (policy: PolicyRule) => `${policy.role} policy`,
        searchFields: ['role', 'description'],
        description: 'Access control policies',
        icon: React.createElement(Shield, { size: 16 }),
        color: '#EF4444',
    })
}
