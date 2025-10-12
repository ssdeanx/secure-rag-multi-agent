'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import { ChevronRight, Home, Upload } from '@mui/icons-material'
import DocumentTable from '@/components/dashboard/documents/DocumentTable'
import NextLink from 'next/link'

/**
 * Documents List Page
 *
 * Main document management interface with search, filter, and upload.
 */
export default function DocumentsPage() {
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
                <Typography>Documents</Typography>
            </Breadcrumbs>

            {/* Page Header */}
            <Box
                sx={{
                    mb: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Box>
                    <Typography level="h2" component="h1" sx={{ mb: 1 }}>
                        Documents
                    </Typography>
                    <Typography
                        level="body-md"
                        sx={{ color: 'text.secondary' }}
                    >
                        Manage indexed documents and upload new content
                    </Typography>
                </Box>
                <Button
                    component={NextLink}
                    href="/protected/dash/documents/upload"
                    startDecorator={<Upload />}
                    size="lg"
                >
                    Upload Document
                </Button>
            </Box>

            {/* Document Table */}
            <DocumentTable />
        </Box>
    )
}
