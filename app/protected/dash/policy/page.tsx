'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import Tabs from '@mui/joy/Tabs'
import TabList from '@mui/joy/TabList'
import Tab from '@mui/joy/Tab'
import TabPanel from '@mui/joy/TabPanel'
import { ChevronRight, Home, Add } from '@mui/icons-material'
import PolicyTable from '@/components/dashboard/policy/PolicyTable'
import AccessMatrix from '@/components/dashboard/policy/AccessMatrix'
import NextLink from 'next/link'

/**
 * Policy Overview Page
 *
 * ACL management with policy rules and access visualization.
 */
export default function PolicyPage() {
    return (
        <Box>
            {/* Breadcrumbs */}
            <Breadcrumbs
                size="sm"
                separator={<ChevronRight fontSize="small" />}
                sx={{ mb: 2 }}
            >
                <Link
                    component={NextLink}
                    href="/protected/dash"
                    color="neutral"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                    <Home fontSize="small" />
                    Dashboard
                </Link>
                <Typography>Policy</Typography>
            </Breadcrumbs>

            {/* Page Header */}
            <Box
                sx={{
                    mb: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Box>
                    <Typography level="h2" component="h1" sx={{ mb: 1 }}>
                        Access Control Policy
                    </Typography>
                    <Typography
                        level="body-md"
                        sx={{ color: 'text.secondary' }}
                    >
                        Manage ACL rules and permissions
                    </Typography>
                </Box>
                <Button
                    component={NextLink}
                    href="/protected/dash/policy/roles"
                    startDecorator={<Add />}
                    size="lg"
                >
                    Manage Roles
                </Button>
            </Box>

            {/* Tabs */}
            <Tabs defaultValue={0}>
                <TabList>
                    <Tab>Policy Rules</Tab>
                    <Tab>Access Matrix</Tab>
                </TabList>
                <TabPanel value={0} sx={{ p: 3 }}>
                    <PolicyTable />
                </TabPanel>
                <TabPanel value={1} sx={{ p: 3 }}>
                    <AccessMatrix />
                </TabPanel>
            </Tabs>
        </Box>
    )
}
