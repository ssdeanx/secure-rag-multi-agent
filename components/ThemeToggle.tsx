'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/shadnui/switch'

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="h-6 w-10" aria-hidden="true" /> // Invisible sized placeholder
    }

    const isDark = theme === 'dark'

    return (
        <Switch
            checked={isDark}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            className="data-[state=checked]:bg-primary"
            aria-label="Toggle theme"
        />
    )
}
