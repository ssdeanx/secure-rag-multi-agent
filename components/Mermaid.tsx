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
        // Initialize Mermaid with a dark, GitHub-like theme. We avoid per-diagram
        // color overrides so all charts are consistent across MDX files.
        mermaid.initialize({
            startOnLoad: true,
            securityLevel: 'loose',
            theme: 'dark',
            themeVariables: {
                primaryColor: '#0d1117',
                primaryTextColor: '#c9d1d9',
                primaryBorderColor: '#30363d',
                lineColor: '#8b949e',
                tertiaryColor: '#161b22',
                fontFamily:
                    'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
            },
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
                    height: 'auto',
                },
                my: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 'sm',
                bgcolor: 'background.surface',
            }}
            {...(chartId && { id: chartId })}
        >
            {chart}
        </Box>
    )
}
