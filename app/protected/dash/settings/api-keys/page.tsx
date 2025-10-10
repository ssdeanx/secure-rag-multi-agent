'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import { ChevronRight, Home } from '@mui/icons-material'
import APIKeyManager from '@/components/dashboard/settings/APIKeyManager'
import NextLink from 'next/link'

/**
 * API Configuration Page
 *
 * Manages API keys and external service connections including
 * Google Gemini, OpenAI, and database credentials.
 */
export default function APIKeysPage() {
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
                <Link component={NextLink} href="/protected/dash/settings" color="neutral">
                    Settings
                </Link>
                <Typography>API Keys</Typography>
            </Breadcrumbs>

            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography level="h2" component="h1" sx={{ mb: 1 }}>
                    API Configuration
                </Typography>
                <Typography level="body-md" sx={{ color: 'text.secondary' }}>
                    Manage API keys and external service connections
                </Typography>
            </Box>

            {/* API Key Manager */}
            <APIKeyManager />
        </Box>
    )
}
