import type React from 'react'
import { useRegisterState } from 'cedar-os'

export interface Document {
    id: string
    title: string
    content: string
    classification: 'public' | 'internal' | 'confidential'
    department: string
    tags: string[]
    addedAt: string
}

export interface PolicyRule {
    id: string
    role: string
    allowedClassifications: string[]
    allowedDepartments: string[]
    description: string
}

export interface Retrieval {
    id: string
    query: string
    documents: Document[]
    timestamp: string
    userRole: string
}

export function useRagState(
    documents: Document[],
    setDocuments: React.Dispatch<React.SetStateAction<Document[]>>,
    policies: PolicyRule[],
    setPolicies: React.Dispatch<React.SetStateAction<PolicyRule[]>>,
    retrievals: Retrieval[],
    setRetrievals: React.Dispatch<React.SetStateAction<Retrieval[]>>
) {
    useRegisterState({
        value: documents,
        setValue: setDocuments,
        key: 'documents',
        description: 'Indexed documents with classification and department tags',
        stateSetters: {
            addDocument: {
                name: 'addDocument',
                description: 'Add new document to corpus',
                execute: (currentDocs, setValue, args: unknown) => {
                    const doc = args as Document
                    if (!doc?.id || currentDocs.some((d) => d.id === doc.id)) {
                        return
                    }
                    setValue([...currentDocs, doc])
                },
            },
            removeDocument: {
                name: 'removeDocument',
                description: 'Remove document by ID',
                execute: (currentDocs, setValue, args: unknown) => {
                    const { docId } = args as { docId?: string }
                    if (typeof docId !== 'string' || docId === '') {
                        return
                    }
                    setValue(currentDocs.filter((d) => d.id !== docId))
                },
            },
        },
    })

    useRegisterState({
        value: policies,
        setValue: setPolicies,
        key: 'policies',
        description: 'Access control policies for RAG system',
        stateSetters: {
            addPolicy: {
                name: 'addPolicy',
                description: 'Add new access policy rule',
                execute: (currentPolicies, setValue, args: unknown) => {
                    const policy = args as PolicyRule
                    if (!policy?.id || currentPolicies.some((p) => p.id === policy.id)) {
                        return
                    }
                    setValue([...currentPolicies, policy])
                },
            },
            removePolicy: {
                name: 'removePolicy',
                description: 'Remove policy by ID',
                execute: (currentPolicies, setValue, args: unknown) => {
                    const { policyId } = args as { policyId?: string }
                    if (typeof policyId !== 'string' || policyId === '') {
                        return
                    }
                    setValue(currentPolicies.filter((p) => p.id !== policyId))
                },
            },
        },
    })

    useRegisterState({
        value: retrievals,
        setValue: setRetrievals,
        key: 'retrievals',
        description: 'History of document retrievals and queries',
        stateSetters: {
            addRetrieval: {
                name: 'addRetrieval',
                description: 'Log new document retrieval',
                execute: (currentRetrievals, setValue, args: unknown) => {
                    const retrieval = args as Retrieval
                    if (!retrieval?.id) {
                        return
                    }
                    setValue([retrieval, ...currentRetrievals].slice(0, 50))
                },
            },
        },
    })
}
