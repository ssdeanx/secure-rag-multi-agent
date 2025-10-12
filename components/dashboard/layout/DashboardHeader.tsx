'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'
import Avatar from '@mui/joy/Avatar'
import Dropdown from '@mui/joy/Dropdown'
import Menu from '@mui/joy/Menu'
import MenuButton from '@mui/joy/MenuButton'
import MenuItem from '@mui/joy/MenuItem'
import Divider from '@mui/joy/Divider'
import {
    Menu as MenuIcon,
    AccountCircle,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    DarkMode,
    LightMode,
} from '@mui/icons-material'
import { useColorScheme } from '@mui/joy/styles'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DashboardHeaderProps {
    onMenuClick: () => void
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    const { mode, setMode } = useColorScheme()
    const router = useRouter()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch for theme toggle
    React.useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/login')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const toggleTheme = () => {
        setMode(mode === 'dark' ? 'light' : 'dark')
    }

    return (
        <Box
            component="header"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1.5,
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.surface',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
            }}
        >
            {/* Left: Menu Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                    variant="outlined"
                    color="neutral"
                    size="sm"
                    onClick={onMenuClick}
                    sx={{ display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    level="title-md"
                    sx={{ display: { xs: 'none', md: 'block' } }}
                >
                    Administration Dashboard
                </Typography>
            </Box>

            {/* Right: Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Theme Toggle */}
                {mounted && (
                    <IconButton
                        variant="outlined"
                        color="neutral"
                        size="sm"
                        onClick={toggleTheme}
                        title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {mode === 'dark' ? <LightMode /> : <DarkMode />}
                    </IconButton>
                )}

                {/* User Menu */}
                <Dropdown>
                    <MenuButton
                        slots={{ root: IconButton }}
                        slotProps={{
                            root: {
                                variant: 'outlined',
                                color: 'neutral',
                                size: 'sm',
                            },
                        }}
                    >
                        <Avatar size="sm">
                            <AccountCircle />
                        </Avatar>
                    </MenuButton>
                    <Menu placement="bottom-end" size="sm">
                        <MenuItem>
                            <Box>
                                <Typography level="title-sm">
                                    User Account
                                </Typography>
                                <Typography
                                    level="body-xs"
                                    sx={{ color: 'text.tertiary' }}
                                >
                                    user@example.com
                                </Typography>
                            </Box>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            component={Link}
                            href="/protected/dash/settings"
                        >
                            <SettingsIcon fontSize="small" />
                            Settings
                        </MenuItem>
                        <MenuItem onClick={handleLogout} color="danger">
                            <LogoutIcon fontSize="small" />
                            Sign Out
                        </MenuItem>
                    </Menu>
                </Dropdown>
            </Box>
        </Box>
    )
}
