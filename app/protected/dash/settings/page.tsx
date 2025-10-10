'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Grid from '@mui/joy/Grid'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemButton from '@mui/joy/ListItemButton'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import ListItemContent from '@mui/joy/ListItemContent'
import Divider from '@mui/joy/Divider'
import {
    AccountCircle,
    Palette,
    Key,
    Psychology,
} from '@mui/icons-material'
import Link from 'next/link'

interface SettingSection {
    title: string
    description: string
    icon: React.ReactElement
    href: string
}

const settingSections: SettingSection[] = [
    {
        title: 'Profile Settings',
        description: 'Manage your personal information and preferences',
        icon: <AccountCircle />,
        href: '/protected/dash/settings/profile',
    },
    {
        title: 'Theme Preferences',
        description: 'Customize the appearance and color scheme',
        icon: <Palette />,
        href: '/protected/dash/settings/theme',
    },
    {
        title: 'API Configuration',
        description: 'Manage API keys and external service connections',
        icon: <Key />,
        href: '/protected/dash/settings/api-keys',
    },
    {
        title: 'Model Selection',
        description: 'Configure AI models and their parameters',
        icon: <Psychology />,
        href: '/protected/dash/settings/models',
    },
]

/**
 * Settings Hub Page
 *
 * Central hub for all system configuration and user preferences.
 * Provides quick access to profile, theme, API, and model settings.
 */
export default function SettingsPage() {

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography level="h2" component="h1" sx={{ mb: 1 }}>
                    Settings
                </Typography>
                <Typography level="body-md" sx={{ color: 'text.secondary' }}>
                    Manage your account, preferences, and system configuration
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {settingSections.map((section) => (
                    <Grid key={section.href} xs={12} md={6}>
                        <Card
                            variant="outlined"
                            sx={{
                                height: '100%',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: 'primary.outlinedBorder',
                                    boxShadow: 'md',
                                },
                            }}
                        >
                            <CardContent>
                                <Link
                                    href={section.href}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 'sm',
                                                bgcolor: 'primary.softBg',
                                                color: 'primary.softColor',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {section.icon}
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography level="title-lg" sx={{ mb: 0.5 }}>
                                                {section.title}
                                            </Typography>
                                            <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
                                                {section.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Card variant="outlined">
                <CardContent>
                    <Typography level="title-lg" sx={{ mb: 2 }}>
                        Quick Settings
                    </Typography>
                    <List size="sm">
                        <ListItem>
                            <ListItemButton>
                                <ListItemDecorator>
                                    <AccountCircle />
                                </ListItemDecorator>
                                <ListItemContent>
                                    <Typography level="title-sm">Account Security</Typography>
                                    <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                                        Two-factor authentication, password changes
                                    </Typography>
                                </ListItemContent>
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton>
                                <ListItemDecorator>
                                    <Key />
                                </ListItemDecorator>
                                <ListItemContent>
                                    <Typography level="title-sm">Session Management</Typography>
                                    <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                                        Active sessions and login history
                                    </Typography>
                                </ListItemContent>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
        </Box>
    )
}
