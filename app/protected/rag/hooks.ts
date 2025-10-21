import type React from 'react'
import { useRagState } from './state'
import { useRagContext } from './context'
import { useRagMentions } from './mentions'
import type { Document, PolicyRule, Retrieval } from './state'

export function useRagCedar(
    documents: Document[],
    setDocuments: React.Dispatch<React.SetStateAction<Document[]>>,
    policies: PolicyRule[],
    setPolicies: React.Dispatch<React.SetStateAction<PolicyRule[]>>,
    retrievals: Retrieval[],
    setRetrievals: React.Dispatch<React.SetStateAction<Retrieval[]>>
) {
    useRagState(documents, setDocuments, policies, setPolicies, retrievals, setRetrievals)
    useRagContext()
    useRagMentions()
}
