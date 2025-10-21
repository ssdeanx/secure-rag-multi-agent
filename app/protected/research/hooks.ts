import type React from 'react'
import { useResearchState } from './state'
import { useResearchContext } from './context'
import { useResearchMentions } from './mentions'
import type { Paper, ResearchSource, Learning } from './state'

export function useResearchCedar(
    papers: Paper[],
    setPapers: React.Dispatch<React.SetStateAction<Paper[]>>,
    sources: ResearchSource[],
    setSources: React.Dispatch<React.SetStateAction<ResearchSource[]>>,
    learnings: Learning[],
    setLearnings: React.Dispatch<React.SetStateAction<Learning[]>>
) {
    useResearchState(papers, setPapers, sources, setSources, learnings, setLearnings)
    useResearchContext()
    useResearchMentions()
}
