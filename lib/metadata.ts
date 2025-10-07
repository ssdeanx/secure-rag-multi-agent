import type { Metadata } from 'next'

const SITE_NAME = 'Deanmachines'
const BASE_URL = 'https://deanmachines.dev'

export interface FrontmatterLike {
    title?: string
    description?: string
    tags?: string[]
    date?: string
    draft?: boolean
}

function sanitizeText(value: unknown, max = 160): string | undefined {
    if (typeof value !== 'string') {
        return undefined
    }
    const stripped = value.replace(/<[^>]+>/g, '').trim()
    if (!stripped) {
        return undefined
    }
    return stripped.slice(0, max)
}

export function buildBaseMetadata(partial: Partial<Metadata> = {}): Metadata {
    return {
        title: SITE_NAME,
        description:
            'Secure governed RAG system with hierarchical RBAC and zero-trust retrieval.',
        applicationName: SITE_NAME,
        openGraph: {
            title: SITE_NAME,
            siteName: SITE_NAME,
            type: 'website',
            url: BASE_URL,
            description:
                'Secure governed RAG system with hierarchical RBAC and zero-trust retrieval.',
        },
        twitter: {
            card: 'summary_large_image',
            title: SITE_NAME,
            description:
                'Secure governed RAG system with hierarchical RBAC and zero-trust retrieval.',
        },
        robots: {
            index: true,
            follow: true,
        },
        ...partial,
    }
}

export function metadataFromFrontmatter(
    fm: FrontmatterLike,
    slugPath: string
): Metadata {
    const candidateTitle = sanitizeText(fm.title, 70)
    const safeTitle = candidateTitle ?? 'Documentation'
    const candidateDesc = sanitizeText(fm.description, 160)
    const safeDesc = candidateDesc ?? 'Documentation page'
    const draft = fm.draft === true
    const url = `${BASE_URL}${slugPath.startsWith('/') ? slugPath : '/' + slugPath}`
    return buildBaseMetadata({
        title: safeTitle,
        description: safeDesc,
        openGraph: {
            title: safeTitle,
            description: safeDesc,
            url,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: safeTitle,
            description: safeDesc,
        },
        robots: draft
            ? { index: false, follow: false }
            : { index: true, follow: true },
    })
}
