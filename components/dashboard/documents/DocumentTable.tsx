'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Table from '@mui/joy/Table'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import Input from '@mui/joy/Input'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import IconButton from '@mui/joy/IconButton'
import Chip from '@mui/joy/Chip'
import Link from '@mui/joy/Link'
import Stack from '@mui/joy/Stack'
import { Search, Visibility, Delete, FilterList } from '@mui/icons-material'
import ClassificationBadge from './ClassificationBadge'
import NextLink from 'next/link'

/**
 * Document Row Type
 */
interface Document {
    id: string
    title: string
    classification: 'public' | 'internal' | 'confidential'
    chunkCount: number
    uploadedAt: string
    uploadedBy: string
}

/**
 * DocumentTable Component
 *
 * Paginated table of indexed documents with search, filter, and actions.
 */
export default function DocumentTable() {
    const [searchQuery, setSearchQuery] = React.useState('')
    const [classificationFilter, setClassificationFilter] =
        React.useState<string>('all')
    const [documents, setDocuments] = React.useState<Document[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const params = new URLSearchParams()
                if (searchQuery !== '') {
                    params.set('search', searchQuery)
                }
                if (classificationFilter !== 'all') {
                    params.set('classification', classificationFilter)
                }

                const response = await fetch(
                    `/api/documents?${params.toString()}`
                )
                if (!response.ok) {
                    throw new Error('Failed to fetch documents')
                }

                const data = (await response.json()) as {
                    documents: Document[]
                }
                setDocuments(data.documents)
            } catch {
                // Error handled silently - show empty state
            } finally {
                setLoading(false)
            }
        }

        void fetchDocuments()
    }, [searchQuery, classificationFilter])

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this document?')) {
            return
        }

        try {
            const response = await fetch(`/api/documents/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete document')
            }

            setDocuments((prev) => prev.filter((doc) => doc.id !== id))
        } catch {
            alert('Failed to delete document')
        }
    }

    return (
        <Box>
            {/* Search & Filter Bar */}
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Input
                    placeholder="Search documents..."
                    startDecorator={<Search />}
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                    }}
                    sx={{ flexGrow: 1 }}
                />
                <Select
                    placeholder="Filter by classification"
                    value={classificationFilter}
                    onChange={(_event, value) => {
                        setClassificationFilter(value ?? 'all')
                    }}
                    startDecorator={<FilterList />}
                    sx={{ minWidth: 200 }}
                >
                    <Option value="all">All Classifications</Option>
                    <Option value="public">Public</Option>
                    <Option value="internal">Internal</Option>
                    <Option value="confidential">Confidential</Option>
                </Select>
            </Stack>

            {/* Table */}
            <Sheet
                variant="outlined"
                sx={{ borderRadius: 'sm', overflow: 'auto' }}
            >
                <Table
                    hoverRow
                    sx={{
                        '--TableCell-headBackground':
                            'var(--joy-palette-background-level1)',
                        '--Table-headerUnderlineThickness': '1px',
                        '--TableRow-hoverBackground':
                            'var(--joy-palette-background-level1)',
                    }}
                >
                    <thead>
                        <tr>
                            <th>Document</th>
                            <th>Classification</th>
                            <th>Chunks</th>
                            <th>Uploaded</th>
                            <th>By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6}>
                                    <Typography
                                        level="body-sm"
                                        sx={{ textAlign: 'center', py: 4 }}
                                    >
                                        Loading documents...
                                    </Typography>
                                </td>
                            </tr>
                        ) : documents.length === 0 ? (
                            <tr>
                                <td colSpan={6}>
                                    <Typography
                                        level="body-sm"
                                        sx={{ textAlign: 'center', py: 4 }}
                                    >
                                        No documents found
                                    </Typography>
                                </td>
                            </tr>
                        ) : (
                            documents.map((doc) => (
                                <tr key={doc.id}>
                                    <td>
                                        <Link
                                            component={NextLink}
                                            href={`/protected/dash/documents/${doc.id}`}
                                            level="title-sm"
                                            sx={{ display: 'block' }}
                                        >
                                            {doc.title}
                                        </Link>
                                    </td>
                                    <td>
                                        <ClassificationBadge
                                            classification={doc.classification}
                                        />
                                    </td>
                                    <td>
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            color="neutral"
                                        >
                                            {doc.chunkCount}
                                        </Chip>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {new Date(
                                                doc.uploadedAt
                                            ).toLocaleDateString()}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {doc.uploadedBy}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1,
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            <IconButton
                                                component={NextLink}
                                                href={`/protected/dash/documents/${doc.id}`}
                                                size="sm"
                                                variant="plain"
                                                color="neutral"
                                            >
                                                <Visibility />
                                            </IconButton>
                                            <IconButton
                                                size="sm"
                                                variant="plain"
                                                color="danger"
                                                onClick={() => {
                                                    void handleDelete(doc.id)
                                                }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Sheet>
        </Box>
    )
}
