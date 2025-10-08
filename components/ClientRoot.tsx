'use client'

import React from 'react'
import { ThemeProvider } from './ThemeProvider'
import { TopNavigation } from './TopNavigation'
import RouteAnnouncer from './demo-rag/RouteAnnouncer'

export default function ClientRoot({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="relative flex min-h-screen flex-col">
                <TopNavigation />
                <RouteAnnouncer />
                <main
                    id="main"
                    className="flex-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    role="main"
                >
                    {children}
                </main>
            </div>
        </ThemeProvider>
    )
}
