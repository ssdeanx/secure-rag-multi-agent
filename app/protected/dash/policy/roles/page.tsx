'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import Grid from '@mui/joy/Grid'
import { ChevronRight, Home } from '@mui/icons-material'
import RoleHierarchy from '@/components/dashboard/policy/RoleHierarchy'
import PermissionEditor from '@/components/dashboard/policy/PermissionEditor'
import NextLink from 'next/link'

/**
 * Role Configuration Page
 *
 * Role hierarchy and permission assignment interface.
 */
export default function RolesPage() {
    const [selectedRole, setSelectedRole] = React.useState<string>('employee')

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
                <Link
                    component={NextLink}
                    href="/protected/dash/policy"
                    color="neutral"
                >
                    Policy
                </Link>
                <Typography>Roles</Typography>
            </Breadcrumbs>

            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography level="h2" component="h1" sx={{ mb: 1 }}>
                    Role Configuration
                </Typography>
                <Typography level="body-md" sx={{ color: 'text.secondary' }}>
                    Manage role hierarchy and permissions
                </Typography>
            </Box>

            {/* Content */}
            <Grid container spacing={3}>
                <Grid xs={12} md={5}>
                    <RoleHierarchy
                        selectedRole={selectedRole}
                        onSelectRole={setSelectedRole}
                    />
                </Grid>
                <Grid xs={12} md={7}>
                    <PermissionEditor role={selectedRole} />
                </Grid>
            </Grid>
        </Box>
    )
}
