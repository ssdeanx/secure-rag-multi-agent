'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import { ChevronRight, Home } from '@mui/icons-material'
import DocumentUploader from '@/components/dashboard/documents/DocumentUploader'
import NextLink from 'next/link'

/**
 * Document Upload Page
 *
 * Interface for uploading new documents with classification selection.
 */
export default function UploadPage() {
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
                <Link
                    component={NextLink}
                    href="/protected/dash/documents"
                    color="neutral"
                >
                    Documents
                </Link>
                <Typography>Upload</Typography>
            </Breadcrumbs>

            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography level="h2" component="h1" sx={{ mb: 1 }}>
                    Upload Document
                </Typography>
                <Typography level="body-md" sx={{ color: 'text.secondary' }}>
                    Upload markdown files for indexing and classification
                </Typography>
            </Box>

            {/* Uploader */}
            <DocumentUploader />
        </Box>
    )
}
