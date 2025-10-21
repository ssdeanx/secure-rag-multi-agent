import React from 'react'
import { useStateBasedMentionProvider } from 'cedar-os'
import { BookOpen, FileText, Lightbulb } from 'lucide-react'
import type { Paper, ResearchSource, Learning } from './state'

export function useResearchMentions() {
    useStateBasedMentionProvider({
        stateKey: 'papers',
        trigger: '@',
        labelField: (paper: Paper) => paper.title,
        searchFields: ['title', 'authors'],
        description: 'Research papers in your library',
        icon: React.createElement(BookOpen, { size: 16 }),
        color: '#3B82F6',
    })

    useStateBasedMentionProvider({
        stateKey: 'sources',
        trigger: '@',
        labelField: (source: ResearchSource) => source.title,
        searchFields: ['title', 'url'],
        description: 'Research sources you\'ve collected',
        icon: React.createElement(FileText, { size: 16 }),
        color: '#10B981',
    })

    useStateBasedMentionProvider({
        stateKey: 'learnings',
        trigger: '@',
        labelField: (learning: Learning) => learning.content.substring(0, 50),
        searchFields: ['content', 'category'],
        description: 'Learnings extracted from research',
        icon: React.createElement(Lightbulb, { size: 16 }),
        color: '#F59E0B',
    })
}
