'use client'

import * as React from 'react'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'
import Chip from '@mui/joy/Chip'
import Grid from '@mui/joy/Grid'
import ClassificationBadge from './ClassificationBadge'

/**
 * Document Metadata Type
 */
interface DocumentMetadataType {
    id: string
    title: string
    classification: 'public' | 'internal' | 'confidential'
    chunkCount: number
    uploadedAt: string
    uploadedBy: string
    fileSize: number
    wordCount: number
}

/**
 * DocumentMetadata Component Props
 */
interface DocumentMetadataProps {
    documentId: string
}

/**
 * DocumentMetadata Component
 *
 * Display document metadata in a card layout.
 */
export default function DocumentMetadata({
    documentId,
}: DocumentMetadataProps) {
    const [metadata, setMetadata] = React.useState<DocumentMetadataType | null>(
        null
    )
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const response = await fetch(`/api/documents/${documentId}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch metadata')
                }

                const data = (await response.json()) as DocumentMetadataType
                setMetadata(data)
            } catch {
                // Error handled silently
            } finally {
                setLoading(false)
            }
        }

        void fetchMetadata()
    }, [documentId])

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography>Loading metadata...</Typography>
                </CardContent>
            </Card>
        )
    }

    if (metadata === null) {
        return (
            <Card>
                <CardContent>
                    <Typography color="danger">
                        Failed to load document metadata
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent>
                <Typography level="title-md" sx={{ mb: 2 }}>
                    Document Information
                </Typography>

                <Grid container spacing={2}>
                    {/* Title */}
                    <Grid xs={12}>
                        <Stack spacing={0.5}>
                            <Typography
                                level="body-xs"
                                sx={{ color: 'text.secondary' }}
                            >
                                Title
                            </Typography>
                            <Typography level="title-sm">
                                {metadata.title}
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* Classification */}
                    <Grid xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <Typography
                                level="body-xs"
                                sx={{ color: 'text.secondary' }}
                            >
                                Classification
                            </Typography>
                            <ClassificationBadge
                                classification={metadata.classification}
                            />
                        </Stack>
                    </Grid>

                    {/* Chunks */}
                    <Grid xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <Typography
                                level="body-xs"
                                sx={{ color: 'text.secondary' }}
                            >
                                Indexed Chunks
                            </Typography>
                            <Chip size="sm" variant="soft" color="neutral">
                                {metadata.chunkCount} chunks
                            </Chip>
                        </Stack>
                    </Grid>

                    {/* Uploaded */}
                    <Grid xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <Typography
                                level="body-xs"
                                sx={{ color: 'text.secondary' }}
                            >
                                Uploaded
                            </Typography>
                            <Typography level="body-sm">
                                {new Date(metadata.uploadedAt).toLocaleString()}
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* Uploaded By */}
                    <Grid xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <Typography
                                level="body-xs"
                                sx={{ color: 'text.secondary' }}
                            >
                                Uploaded By
                            </Typography>
                            <Typography level="body-sm">
                                {metadata.uploadedBy}
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* File Size */}
                    <Grid xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <Typography
                                level="body-xs"
                                sx={{ color: 'text.secondary' }}
                            >
                                File Size
                            </Typography>
                            <Typography level="body-sm">
                                {(metadata.fileSize / 1024).toFixed(2)} KB
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* Word Count */}
                    <Grid xs={12} sm={6}>
                        <Stack spacing={0.5}>
                            <Typography
                                level="body-xs"
                                sx={{ color: 'text.secondary' }}
                            >
                                Word Count
                            </Typography>
                            <Typography level="body-sm">
                                {metadata.wordCount.toLocaleString()} words
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
