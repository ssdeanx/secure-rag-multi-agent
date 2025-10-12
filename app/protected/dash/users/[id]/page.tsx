'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import Grid from '@mui/joy/Grid'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Chip from '@mui/joy/Chip'
import Avatar from '@mui/joy/Avatar'
import { ChevronRight, Home, Block, Delete, Edit } from '@mui/icons-material'
import RoleSelector from '@/components/dashboard/users/RoleSelector'
import PermissionMatrix from '@/components/dashboard/users/PermissionMatrix'
import UserActivityLog from '@/components/dashboard/users/UserActivityLog'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

/**
 * User Type
 */
interface User {
    id: string
    email: string
    displayName: string
    role: string
    status: 'active' | 'suspended' | 'invited'
    createdAt: string
    lastLoginAt: string | null
}

/**
 * User Details Page
 *
 * View and manage individual user account.
 */
export default function UserDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const router = useRouter()
    const [userId, setUserId] = React.useState<string | null>(null)
    const [user, setUser] = React.useState<User | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        void params.then((resolvedParams) => {
            setUserId(resolvedParams.id)
        })
    }, [params])

    React.useEffect(() => {
        if (userId === null) {
            return
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/users/${userId}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch user')
                }

                const data = (await response.json()) as User
                setUser(data)
            } catch {
                // Error handled silently
            } finally {
                setLoading(false)
            }
        }

        void fetchUser()
    }, [userId])

    const handleSuspend = async () => {
        if (userId === null || user === null) {
            return
        }

        const action = user.status === 'active' ? 'suspend' : 'activate'
        if (!confirm(`Are you sure you want to ${action} this user?`)) {
            return
        }

        try {
            const response = await fetch(`/api/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: action === 'suspend' ? 'suspended' : 'active',
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to update user status')
            }

            setUser((prev) =>
                prev !== null
                    ? {
                          ...prev,
                          status: action === 'suspend' ? 'suspended' : 'active',
                      }
                    : null
            )
        } catch {
            alert('Failed to update user status')
        }
    }

    const handleDelete = async () => {
        if (userId === null) {
            return
        }

        if (
            !confirm(
                'Are you sure you want to delete this user? This action cannot be undone.'
            )
        ) {
            return
        }

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete user')
            }

            router.push('/protected/dash/users')
        } catch {
            alert('Failed to delete user')
        }
    }

    if (loading || user === null) {
        return (
            <Box>
                <Typography>Loading...</Typography>
            </Box>
        )
    }

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
                    href="/protected/dash/users"
                    color="neutral"
                >
                    Users
                </Link>
                <Typography>{user.displayName}</Typography>
            </Breadcrumbs>

            {/* Page Header */}
            <Box
                sx={{
                    mb: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                }}
            >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar size="lg">
                        {user.displayName[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography level="h2" component="h1">
                            {user.displayName}
                        </Typography>
                        <Typography
                            level="body-sm"
                            sx={{ color: 'text.secondary' }}
                        >
                            {user.email}
                        </Typography>
                    </Box>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        color="neutral"
                        startDecorator={<Edit />}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="warning"
                        startDecorator={<Block />}
                        onClick={() => {
                            void handleSuspend()
                        }}
                    >
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="danger"
                        startDecorator={<Delete />}
                        onClick={() => {
                            void handleDelete()
                        }}
                    >
                        Delete
                    </Button>
                </Stack>
            </Box>

            {/* Content */}
            <Grid container spacing={3}>
                {/* User Information */}
                <Grid xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography level="title-md" sx={{ mb: 2 }}>
                                User Information
                            </Typography>
                            <Stack spacing={2}>
                                <Box>
                                    <Typography
                                        level="body-xs"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Status
                                    </Typography>
                                    <Chip
                                        size="sm"
                                        variant="soft"
                                        color={
                                            user.status === 'active'
                                                ? 'success'
                                                : user.status === 'suspended'
                                                  ? 'danger'
                                                  : 'warning'
                                        }
                                    >
                                        {user.status}
                                    </Chip>
                                </Box>
                                <Box>
                                    <Typography
                                        level="body-xs"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Role
                                    </Typography>
                                    <RoleSelector
                                        userId={userId ?? ''}
                                        currentRole={user.role}
                                    />
                                </Box>
                                <Box>
                                    <Typography
                                        level="body-xs"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Created
                                    </Typography>
                                    <Typography level="body-sm">
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        level="body-xs"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Last Login
                                    </Typography>
                                    <Typography level="body-sm">
                                        {user.lastLoginAt !== null
                                            ? new Date(
                                                  user.lastLoginAt
                                              ).toLocaleString()
                                            : 'Never'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Permission Matrix */}
                <Grid xs={12} md={6}>
                    <PermissionMatrix role={user.role} />
                </Grid>

                {/* Activity Log */}
                <Grid xs={12}>
                    <UserActivityLog userId={userId ?? ''} />
                </Grid>
            </Grid>
        </Box>
    )
}
