'use client'

import { useEffect } from 'react'
import mermaid from 'mermaid'
import { Box } from '@/components/ui/joy'

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

    const chartId = id ?? `mermaid-${Math.random().toString(36).substr(2, 9)}`

    return (
        <Box
            component="div"
            className="mermaid"
            sx={{
                '& svg': {
                    maxWidth: '100%',
                    height: 'auto'
                },
                my: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 'sm',
                bgcolor: 'background.surface'
            }}
            {...(chartId && { id: chartId })}
        >
            {chart}
        </Box>
    )
}
