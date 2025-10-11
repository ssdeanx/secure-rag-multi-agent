'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import { ChevronRight, Home } from '@mui/icons-material'
import ProfileForm from '@/components/dashboard/settings/ProfileForm'
import NextLink from 'next/link'

/**
 * Profile Settings Page
 *
 * Allows users to manage their personal information including
 * display name, email, avatar, and password.
 */
export default function ProfileSettingsPage() {
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
                <Typography>Profile</Typography>
            </Breadcrumbs>

            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography level="h2" component="h1" sx={{ mb: 1 }}>
                    Profile Settings
                </Typography>
                <Typography level="body-md" sx={{ color: 'text.secondary' }}>
                    Manage your personal information and account preferences
                </Typography>
            </Box>

            {/* Profile Form */}
            <ProfileForm />
        </Box>
    )
}
