'use client'

import * as React from 'react'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'
import Chip from '@mui/joy/Chip'
import Box from '@mui/joy/Box'
import Accordion from '@mui/joy/Accordion'
import AccordionSummary from '@mui/joy/AccordionSummary'
import AccordionDetails from '@mui/joy/AccordionDetails'

/**
 * Chunk Type
 */
interface Chunk {
    id: string
    content: string
    index: number
    embeddingModel: string
    metadata: Record<string, unknown>
}

/**
 * ChunkViewer Component Props
 */
interface ChunkViewerProps {
    documentId: string
}

/**
 * ChunkViewer Component
 *
 * Display indexed document chunks in an accordion layout.
 */
export default function ChunkViewer({ documentId }: ChunkViewerProps) {
    const [chunks, setChunks] = React.useState<Chunk[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchChunks = async () => {
            try {
                const response = await fetch(`/api/documents/${documentId}/chunks`)
                if (!response.ok) {
                    throw new Error('Failed to fetch chunks')
                }

                const data = await response.json() as { chunks: Chunk[] }
                setChunks(data.chunks)
            } catch {
                // Error handled silently
            } finally {
                setLoading(false)
            }
        }

        void fetchChunks()
    }, [documentId])

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography>Loading chunks...</Typography>
                </CardContent>
            </Card>
        )
    }

    if (chunks.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography color="warning">No chunks found for this document</Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography level="title-md">Indexed Chunks</Typography>
                        <Chip size="sm" variant="soft" color="neutral">
                            {chunks.length} chunks
                        </Chip>
                    </Box>

                    {chunks.map((chunk) => (
                        <Accordion key={chunk.id}>
                            <AccordionSummary>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Chip size="sm" variant="soft" color="primary">
                                        Chunk {chunk.index + 1}
                                    </Chip>
                                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                                        {chunk.content.substring(0, 100)}...
                                    </Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack spacing={2}>
                                    {/* Content */}
                                    <Box>
                                        <Typography level="body-xs" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                            Content
                                        </Typography>
                                        <Typography
                                            level="body-sm"
                                            sx={{
                                                whiteSpace: 'pre-wrap',
                                                fontFamily: 'monospace',
                                                bgcolor: 'background.level1',
                                                p: 2,
                                                borderRadius: 'sm'
                                            }}
                                        >
                                            {chunk.content}
                                        </Typography>
                                    </Box>

                                    {/* Metadata */}
                                    <Box>
                                        <Typography level="body-xs" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                            Metadata
                                        </Typography>
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            <Chip size="sm" variant="outlined">
                                                Model: {chunk.embeddingModel}
                                            </Chip>
                                            {Object.entries(chunk.metadata).map(([key, value]) => (
                                                <Chip key={key} size="sm" variant="outlined">
                                                    {key}: {String(value)}
                                                </Chip>
                                            ))}
                                        </Stack>
                                    </Box>
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    )
}
