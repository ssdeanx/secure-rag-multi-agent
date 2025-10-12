'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import { ChevronRight, Home } from '@mui/icons-material'
import ThemeSelector from '@/components/dashboard/settings/ThemeSelector'
import NextLink from 'next/link'

/**
 * Theme Preferences Page
 *
 * Allows users to customize the application's appearance including
 * light/dark mode, color schemes, and UI preferences.
 */
export default function ThemePreferencesPage() {
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
                <Typography>Theme</Typography>
            </Breadcrumbs>

            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography level="h2" component="h1" sx={{ mb: 1 }}>
                    Theme Preferences
                </Typography>
                <Typography level="body-md" sx={{ color: 'text.secondary' }}>
                    Customize the look and feel of your dashboard
                </Typography>
            </Box>

            {/* Theme Selector */}
            <ThemeSelector />
        </Box>
    )
}
