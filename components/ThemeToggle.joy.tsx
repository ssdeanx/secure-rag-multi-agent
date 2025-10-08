 'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Switch from '@mui/joy/Switch'
import { Box } from '@/components/ui/joy'

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
        />
    )
}
