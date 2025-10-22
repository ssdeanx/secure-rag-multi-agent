'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Switch from '@mui/joy/Switch'
import { Box } from '@/components/ui/joy'
import { DarkMode, LightMode } from '@mui/icons-material'

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <Box sx={{ height: 3, width: 10 }} aria-hidden="true" />
    }

    const isDark = theme === 'dark'

    return (
        <Switch
            checked={isDark}
            onChange={(e) => {
                const target = e.target as HTMLInputElement
                setTheme(target.checked ? 'dark' : 'light')
            }}
            aria-label="Toggle theme"
            size="md"
            variant="soft"
            color={isDark ? 'primary' : 'neutral'}
            startDecorator={<LightMode fontSize="small" />}
            endDecorator={<DarkMode fontSize="small" />}
            slotProps={{
                track: {
                    sx: {
                        boxShadow: 'sm',
                        bgcolor: isDark
                            ? 'primary.softBg'
                            : 'background.level2',
                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            boxShadow: 'md',
                            transform: 'scale(1.02)',
                        },
                    },
                },
                thumb: {
                    sx: {
                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isDark ? 'translateX(20px)' : 'translateX(2px)',
                        '&:hover': {
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        },
                    },
                },
                input: {
                    sx: {
                        '&:focus-visible + .MuiSwitch-track': {
                            outline: '2px solid var(--joy-palette-focusVisible)',
                            outlineOffset: 2,
                        },
                    },
                },
            }}
            sx={{
                '--joy-focus-outlineWidth': '2px',
                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'scale(1.05)',
                },
                '&:focus-visible': {
                    outline: 'none',
                    boxShadow: '0 0 0 4px var(--joy-palette-focusVisible)',
                },
            }}
        />
    )
}
