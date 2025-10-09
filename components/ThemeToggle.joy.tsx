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
                        bgcolor: isDark ? 'primary.softBg' : 'background.level2',
                    },
                },
                thumb: {
                    sx: {
                        transition: 'all 120ms ease',
                    },
                },
            }}
        />
    )
}
