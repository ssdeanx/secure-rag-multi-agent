import type React from 'react'
import { useRegisterState } from 'cedar-os'

export interface Paper {
    id: string
    title: string
    authors: string[]
    abstract: string
    url: string
    publishedDate: string
    source: 'arxiv' | 'scholar' | 'web'
}

export interface ResearchSource {
    id: string
    title: string
    url: string
    content: string
    sourceType: 'web' | 'pdf' | 'article'
    addedAt: string
}

export interface Learning {
    id: string
    content: string
    source: string
    category: string
    importance: 'high' | 'medium' | 'low'
    addedAt: string
}

export function useResearchState(
    papers: Paper[],
    setPapers: React.Dispatch<React.SetStateAction<Paper[]>>,
    sources: ResearchSource[],
    setSources: React.Dispatch<React.SetStateAction<ResearchSource[]>>,
    learnings: Learning[],
    setLearnings: React.Dispatch<React.SetStateAction<Learning[]>>
) {
    useRegisterState({
        value: papers,
        setValue: setPapers,
        key: 'papers',
        description: 'Academic papers and research articles',
        stateSetters: {
            addPaper: {
                name: 'addPaper',
                description: 'Add new research paper',
                execute: (currentPapers, setValue, args: unknown) => {
                    const paper = args as Paper
                    if (!paper?.id || currentPapers.some((p) => p.id === paper.id)) {
                        return
                    }
                    setValue([...currentPapers, paper])
                },
            },
            removePaper: {
                name: 'removePaper',
                description: 'Remove research paper by ID',
                execute: (currentPapers, setValue, args: unknown) => {
                    const { paperId } = args as { paperId?: string }
                    if (typeof paperId !== 'string' || paperId === '') {
                        return
                    }
                    setValue(currentPapers.filter((p) => p.id !== paperId))
                },
            },
        },
    })

    useRegisterState({
        value: sources,
        setValue: setSources,
        key: 'sources',
        description: 'Research sources including web pages and PDFs',
        stateSetters: {
            addSource: {
                name: 'addSource',
                description: 'Add new research source',
                execute: (currentSources, setValue, args: unknown) => {
                    const source = args as ResearchSource
                    if (!source?.id || currentSources.some((s) => s.id === source.id)) {
                        return
                    }
                    setValue([...currentSources, source])
                },
            },
            removeSource: {
                name: 'removeSource',
                description: 'Remove research source by ID',
                execute: (currentSources, setValue, args: unknown) => {
                    const { sourceId } = args as { sourceId?: string }
                    if (typeof sourceId !== 'string' || sourceId === '') {
                        return
                    }
                    setValue(currentSources.filter((s) => s.id !== sourceId))
                },
            },
        },
    })

    useRegisterState({
        value: learnings,
        setValue: setLearnings,
        key: 'learnings',
        description: 'Extracted learnings and insights from research',
        stateSetters: {
            addLearning: {
                name: 'addLearning',
                description: 'Add new learning or insight',
                execute: (currentLearnings, setValue, args: unknown) => {
                    const learning = args as Learning
                    if (!learning?.id || currentLearnings.some((l) => l.id === learning.id)) {
                        return
                    }
                    setValue([...currentLearnings, learning])
                },
            },
            removeLearning: {
                name: 'removeLearning',
                description: 'Remove learning by ID',
                execute: (currentLearnings, setValue, args: unknown) => {
                    const { learningId } = args as { learningId?: string }
                    if (typeof learningId !== 'string' || learningId === '') {
                        return
                    }
                    setValue(currentLearnings.filter((l) => l.id !== learningId))
                },
            },
        },
    })
}
