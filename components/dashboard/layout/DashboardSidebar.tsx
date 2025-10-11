'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemButton from '@mui/joy/ListItemButton'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import ListItemContent from '@mui/joy/ListItemContent'
import Typography from '@mui/joy/Typography'
import Divider from '@mui/joy/Divider'
import Sheet from '@mui/joy/Sheet'
import IconButton from '@mui/joy/IconButton'
import Drawer from '@mui/joy/Drawer'
import {
    Dashboard as DashboardIcon,
    Settings as SettingsIcon,
    Description as DocumentIcon,
    People as PeopleIcon,
    Insights as InsightsIcon,
    Security as SecurityIcon,
    Close as CloseIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationItem {
    label: string
    href: string
    icon: React.ReactElement
    description?: string
}

const navigationSections: Array<{ title: string; items: NavigationItem[] }> = [
    {
        title: 'Main',
        items: [
            {
                label: 'Overview',
                href: '/protected/dash',
                icon: <DashboardIcon />,
                description: 'System dashboard',
            },
            {
                label: 'Monitoring',
                href: '/protected/dash/monitoring',
                icon: <InsightsIcon />,
                description: 'Agent and workflow status',
            },
        ],
    },
    {
        title: 'Management',
        items: [
            {
                label: 'Documents',
                href: '/protected/dash/documents',
                icon: <DocumentIcon />,
                description: 'Manage indexed documents',
            },
            {
                label: 'Users',
                href: '/protected/dash/users',
                icon: <PeopleIcon />,
                description: 'User administration',
            },
            {
                label: 'Policy',
                href: '/protected/dash/policy',
                icon: <SecurityIcon />,
                description: 'Access control rules',
            },
        ],
    },
    {
        title: 'Configuration',
        items: [
            {
                label: 'Settings',
                href: '/protected/dash/settings',
                icon: <SettingsIcon />,
                description: 'System configuration',
            },
        ],
    },
]

interface DashboardSidebarProps {
    open: boolean
    onClose: () => void
}

export default function DashboardSidebar({
    open,
    onClose,
}: DashboardSidebarProps) {
    const pathname = usePathname()

    const sidebarContent = (
        <Sheet
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.surface',
            }}
        >
            {/* Logo/Brand */}
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: 'primary.solidBg',
                            borderRadius: 'sm',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            level="title-lg"
                            sx={{ color: 'primary.solidColor' }}
                        >
                            D
                        </Typography>
                    </Box>
                    <Typography level="title-lg" fontWeight="lg">
                        Dashboard
                    </Typography>
                </Box>
                <IconButton
                    variant="plain"
                    color="neutral"
                    onClick={onClose}
                    sx={{ display: { sm: 'none' } }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Navigation */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {navigationSections.map((section, sectionIdx) => (
                    <Box key={section.title}>
                        {sectionIdx > 0 && <Divider sx={{ my: 2 }} />}
                        <Typography
                            level="body-xs"
                            fontWeight="lg"
                            textTransform="uppercase"
                            sx={{ mb: 1, ml: 1, color: 'text.tertiary' }}
                        >
                            {section.title}
                        </Typography>
                        <List size="sm" sx={{ '--List-gap': '4px' }}>
                            {section.items.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <ListItem key={item.href}>
                                        <Link
                                            href={item.href}
                                            style={{
                                                textDecoration: 'none',
                                                width: '100%',
                                            }}
                                            onClick={onClose}
                                        >
                                            <ListItemButton
                                                selected={isActive}
                                                sx={{
                                                    borderRadius: 'sm',
                                                }}
                                            >
                                                <ListItemDecorator
                                                    sx={{
                                                        color: isActive
                                                            ? 'primary.solidBg'
                                                            : 'text.secondary',
                                                    }}
                                                >
                                                    {item.icon}
                                                </ListItemDecorator>
                                                <ListItemContent>
                                                    <Typography level="title-sm">
                                                        {item.label}
                                                    </Typography>
                                                    {item.description && (
                                                        <Typography
                                                            level="body-xs"
                                                            sx={{
                                                                color: 'text.tertiary',
                                                            }}
                                                        >
                                                            {item.description}
                                                        </Typography>
                                                    )}
                                                </ListItemContent>
                                            </ListItemButton>
                                        </Link>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Box>
                ))}
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                }}
            >
                <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                    Governed RAG Dashboard v1.0.0
                </Typography>
            </Box>
        </Sheet>
    )

    return (
        <>
            {/* Desktop Permanent Sidebar */}
            <Box
                sx={{
                    width: 280,
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 1000,
                    display: { xs: 'none', sm: 'block' },
                    borderRight: '1px solid var(--joy-palette-divider)',
                    backgroundColor: 'var(--joy-palette-background-surface)',
                }}
            >
                {sidebarContent}
            </Box>

            {/* Mobile Drawer */}
            <Drawer
                open={open}
                onClose={onClose}
                anchor="left"
                sx={{ display: { xs: 'block', sm: 'none' } }}
            >
                <Box sx={{ width: 280 }}>{sidebarContent}</Box>
            </Drawer>
        </>
    )
}
