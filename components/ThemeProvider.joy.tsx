 'use client'

import React from 'react'
import { CssVarsProvider } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'
import joyTheme from '@/lib/theme/joy-theme'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider {...props}>
            <CssVarsProvider theme={joyTheme} defaultMode="system" modeStorageKey="joy-mode" attribute="class">
                <CssBaseline />
                {children}
            </CssVarsProvider>
        </NextThemesProvider>
    )
}
