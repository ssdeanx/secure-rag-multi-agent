export interface Principal {
    sub: string
    roles: string[]
    tenant?: string
    attrs?: Record<string, unknown> // e.g., { stepUp: true }
}

export interface AccessFilter {
    allowTags: string[] // ["role:finance.viewer", "tenant:acme"]
    maxClassification: 'public' | 'internal' | 'confidential'
}

export interface Document {
    docId: string
    versionId: string
    uri: string
    owner?: string
    labels?: string[]
    securityTags: string[] // denormalized ACL tags
    hash: string
    createdAt: string
}

export interface Chunk {
    chunkId: string
    docId: string
    versionId: string
    text: string
    span: { start: number; end: number }
    meta?: { page?: number; section?: string }
    securityTags: string[]
}
