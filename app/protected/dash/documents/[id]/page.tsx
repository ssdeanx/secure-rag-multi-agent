'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import { ChevronRight, Home, Delete, Download } from '@mui/icons-material'
import DocumentMetadata from '@/components/dashboard/documents/DocumentMetadata'
import ChunkViewer from '@/components/dashboard/documents/ChunkViewer'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

/**
 * Document Details Page
 *
 * View document metadata, chunks, and perform actions.
 */
export default function DocumentDetailsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const router = useRouter()
    const [documentId, setDocumentId] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        void params.then((resolvedParams) => {
            setDocumentId(resolvedParams.id)
            setLoading(false)
        })
    }, [params])

    const handleDelete = async () => {
        if (documentId === null) {
            return
        }

        if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
            return
        }

        try {
            const response = await fetch(`/api/documents/${documentId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete document')
            }

            router.push('/protected/dash/documents')
        } catch {
            alert('Failed to delete document')
        }
    }

    const handleDownload = async () => {
        if (documentId === null) {
            return
        }

        try {
            const response = await fetch(`/api/documents/${documentId}/download`)

            if (!response.ok) {
                throw new Error('Failed to download document')
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `document-${documentId}.md`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch {
            alert('Failed to download document')
        }
    }

    if (loading || documentId === null) {
        return (
            <Box>
                <Typography>Loading...</Typography>
            </Box>
        )
    }

    return (
        <Box>
            {/* Breadcrumbs */}
            <Breadcrumbs
                size="sm"
                separator={<ChevronRight fontSize="small" />}
                sx={{ mb: 2 }}
            >
                <Link
                    component={NextLink}
                    href="/protected/dash"
                    color="neutral"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                    <Home fontSize="small" />
                    Dashboard
                </Link>
                <Link component={NextLink} href="/protected/dash/documents" color="neutral">
                    Documents
                </Link>
                <Typography>Details</Typography>
            </Breadcrumbs>

            {/* Page Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography level="h2" component="h1" sx={{ mb: 1 }}>
                        Document Details
                    </Typography>
                    <Typography level="body-md" sx={{ color: 'text.secondary' }}>
                        View metadata and indexed chunks
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        color="neutral"
                        startDecorator={<Download />}
                        onClick={() => {
                            void handleDownload()
                        }}
                    >
                        Download
                    </Button>
                    <Button
                        variant="outlined"
                        color="danger"
                        startDecorator={<Delete />}
                        onClick={() => {
                            void handleDelete()
                        }}
                    >
                        Delete
                    </Button>
                </Stack>
            </Box>

            {/* Content */}
            <Stack spacing={3}>
                <DocumentMetadata documentId={documentId} />
                <ChunkViewer documentId={documentId} />
            </Stack>
        </Box>
    )
}
