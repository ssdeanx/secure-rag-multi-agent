'use client'

import { useEffect } from 'react'
import mermaid from 'mermaid'

interface MermaidProps {
    chart: string
    id?: string
}

export function Mermaid({ chart, id }: MermaidProps) {
    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
        })
        mermaid.contentLoaded()
    }, [])

    const chartId = id || `mermaid-${Math.random().toString(36).substr(2, 9)}`

    return (
        <div className="mermaid" id={chartId}>
            {chart}
        </div>
    )
}
