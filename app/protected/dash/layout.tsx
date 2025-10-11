'use client'

import React from 'react'
import { Box } from '@/components/ui/joy'
import DashboardHeader from '@/components/dashboard/layout/DashboardHeader'
import DashboardSidebar from '@/components/dashboard/layout/DashboardSidebar'

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = React.useState(false)

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                bgcolor: 'background.surface',
            }}
        >
            {/* Fixed Sidebar for Desktop */}
            <DashboardSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: { xs: 0, sm: '280px' },
                }}
            >
                {/* Header */}
                <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

                {/* Page Content */}
                <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>{children}</Box>
            </Box>
        </Box>
    )
}
