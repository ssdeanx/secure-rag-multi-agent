'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import { ChevronRight, Home } from '@mui/icons-material'
import ModelSelector from '@/components/dashboard/settings/ModelSelector'
import NextLink from 'next/link'

/**
 * Model Selection Page
 *
 * Configure AI model preferences including default model selection,
 * fallback options, and model-specific parameters.
 */
export default function ModelsPage() {
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
                    href="/protected/dash/settings"
                    color="neutral"
                >
                    Settings
                </Link>
                <Typography>Models</Typography>
            </Breadcrumbs>

            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography level="h2" component="h1" sx={{ mb: 1 }}>
                    Model Selection
                </Typography>
                <Typography level="body-md" sx={{ color: 'text.secondary' }}>
                    Configure AI models and their parameters
                </Typography>
            </Box>

            {/* Model Selector */}
            <ModelSelector />
        </Box>
    )
}
