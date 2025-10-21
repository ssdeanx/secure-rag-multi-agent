import React from 'react'
import { useSubscribeStateToAgentContext } from 'cedar-os'
import { BookOpen, FileText, Lightbulb } from 'lucide-react'
import type { Paper, ResearchSource, Learning } from './state'

export function useResearchContext() {
    useSubscribeStateToAgentContext(
        'papers',
        (papers: Paper[]) => ({
            researchPapers: papers.map((p) => ({
                id: p.id,
                title: p.title,
                authors: p.authors.join(', '),
                source: p.source,
                publishedDate: p.publishedDate,
                url: p.url,
            })),
        }),
        {
            icon: React.createElement(BookOpen, { size: 16 }),
            color: '#3B82F6',
        }
    )

    useSubscribeStateToAgentContext(
        'sources',
        (sources: ResearchSource[]) => ({
            researchSources: sources.map((s) => ({
                id: s.id,
                title: s.title,
                url: s.url,
                sourceType: s.sourceType,
                addedAt: s.addedAt,
            })),
        }),
        {
            icon: React.createElement(FileText, { size: 16 }),
            color: '#10B981',
        }
    )

    useSubscribeStateToAgentContext(
        'learnings',
        (learnings: Learning[]) => ({
            extractedLearnings: learnings.map((l) => ({
                id: l.id,
                content: l.content,
                category: l.category,
                importance: l.importance,
                source: l.source,
            })),
        }),
        {
            icon: React.createElement(Lightbulb, { size: 16 }),
            color: '#F59E0B',
        }
    )
}
