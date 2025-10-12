'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import { ChevronRight, Home, PersonAdd } from '@mui/icons-material'
import UserTable from '@/components/dashboard/users/UserTable'
import InviteUserModal from '@/components/dashboard/users/InviteUserModal'
import NextLink from 'next/link'

/**
 * Users List Page
 *
 * User management interface with search, filter, and invite functionality.
 */
export default function UsersPage() {
    const [inviteModalOpen, setInviteModalOpen] = React.useState(false)

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
                <Typography>Users</Typography>
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
                        User Management
                    </Typography>
                    <Typography
                        level="body-md"
                        sx={{ color: 'text.secondary' }}
                    >
                        Manage user accounts, roles, and permissions
                    </Typography>
                </Box>
                <Button
                    startDecorator={<PersonAdd />}
                    size="lg"
                    onClick={() => {
                        setInviteModalOpen(true)
                    }}
                >
                    Invite User
                </Button>
            </Box>

            {/* User Table */}
            <UserTable />

            {/* Invite Modal */}
            <InviteUserModal
                open={inviteModalOpen}
                onClose={() => {
                    setInviteModalOpen(false)
                }}
            />
        </Box>
    )
}
