'use client'

import * as React from 'react'
import Table from '@mui/joy/Table'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import Input from '@mui/joy/Input'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import IconButton from '@mui/joy/IconButton'
import Chip from '@mui/joy/Chip'
import Link from '@mui/joy/Link'
import Stack from '@mui/joy/Stack'
import Avatar from '@mui/joy/Avatar'
import { Search, Visibility, FilterList } from '@mui/icons-material'
import NextLink from 'next/link'

/**
 * User Row Type
 */
interface User {
    id: string
    email: string
    displayName: string
    role: string
    status: 'active' | 'suspended' | 'invited'
    lastLoginAt: string | null
}

/**
 * UserTable Component
 *
 * Paginated table of users with search and filter.
 */
export default function UserTable() {
    const [searchQuery, setSearchQuery] = React.useState('')
    const [roleFilter, setRoleFilter] = React.useState<string>('all')
    const [statusFilter, setStatusFilter] = React.useState<string>('all')
    const [users, setUsers] = React.useState<User[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                const params = new URLSearchParams()
                if (searchQuery !== '') {
                    params.set('search', searchQuery)
                }
                if (roleFilter !== 'all') {
                    params.set('role', roleFilter)
                }
                if (statusFilter !== 'all') {
                    params.set('status', statusFilter)
                }

                const response = await fetch(`/api/users?${params.toString()}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch users')
                }

                const data = (await response.json()) as { users: User[] }
                setUsers(data.users)
            } catch {
                // Error handled silently
            } finally {
                setLoading(false)
            }
        }

        void fetchUsers()
    }, [searchQuery, roleFilter, statusFilter])

    const getRoleColor = (role: string) => {
        const colors: Record<
            string,
            'primary' | 'success' | 'warning' | 'neutral'
        > = {
            admin: 'primary',
            dept_admin: 'success',
            dept_viewer: 'warning',
            employee: 'neutral',
        }
        return colors[role] ?? 'neutral'
    }

    return (
        <Stack spacing={2}>
            {/* Search & Filter Bar */}
            <Stack direction="row" spacing={2}>
                <Input
                    placeholder="Search users..."
                    startDecorator={<Search />}
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                    }}
                    sx={{ flexGrow: 1 }}
                />
                <Select
                    placeholder="Filter by role"
                    value={roleFilter}
                    onChange={(_event, value) => {
                        setRoleFilter(value ?? 'all')
                    }}
                    startDecorator={<FilterList />}
                    sx={{ minWidth: 150 }}
                >
                    <Option value="all">All Roles</Option>
                    <Option value="admin">Admin</Option>
                    <Option value="dept_admin">Dept Admin</Option>
                    <Option value="dept_viewer">Dept Viewer</Option>
                    <Option value="employee">Employee</Option>
                </Select>
                <Select
                    placeholder="Filter by status"
                    value={statusFilter}
                    onChange={(_event, value) => {
                        setStatusFilter(value ?? 'all')
                    }}
                    sx={{ minWidth: 150 }}
                >
                    <Option value="all">All Status</Option>
                    <Option value="active">Active</Option>
                    <Option value="suspended">Suspended</Option>
                    <Option value="invited">Invited</Option>
                </Select>
            </Stack>

            {/* Table */}
            <Sheet
                variant="outlined"
                sx={{ borderRadius: 'sm', overflow: 'auto' }}
            >
                <Table
                    hoverRow
                    sx={{
                        '--TableCell-headBackground':
                            'var(--joy-palette-background-level1)',
                        '--Table-headerUnderlineThickness': '1px',
                        '--TableRow-hoverBackground':
                            'var(--joy-palette-background-level1)',
                    }}
                >
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5}>
                                    <Typography
                                        level="body-sm"
                                        sx={{ textAlign: 'center', py: 4 }}
                                    >
                                        Loading users...
                                    </Typography>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5}>
                                    <Typography
                                        level="body-sm"
                                        sx={{ textAlign: 'center', py: 4 }}
                                    >
                                        No users found
                                    </Typography>
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems="center"
                                        >
                                            <Avatar size="sm">
                                                {user.displayName[0]?.toUpperCase()}
                                            </Avatar>
                                            <Stack spacing={0}>
                                                <Link
                                                    component={NextLink}
                                                    href={`/protected/dash/users/${user.id}`}
                                                    level="title-sm"
                                                >
                                                    {user.displayName}
                                                </Link>
                                                <Typography
                                                    level="body-xs"
                                                    sx={{
                                                        color: 'text.secondary',
                                                    }}
                                                >
                                                    {user.email}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </td>
                                    <td>
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            color={getRoleColor(user.role)}
                                        >
                                            {user.role.replace('_', ' ')}
                                        </Chip>
                                    </td>
                                    <td>
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            color={
                                                user.status === 'active'
                                                    ? 'success'
                                                    : user.status ===
                                                        'suspended'
                                                      ? 'danger'
                                                      : 'warning'
                                            }
                                        >
                                            {user.status}
                                        </Chip>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {user.lastLoginAt !== null
                                                ? new Date(
                                                      user.lastLoginAt
                                                  ).toLocaleDateString()
                                                : 'Never'}
                                        </Typography>
                                    </td>
                                    <td>
                                        <IconButton
                                            component={NextLink}
                                            href={`/protected/dash/users/${user.id}`}
                                            size="sm"
                                            variant="plain"
                                            color="neutral"
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Sheet>
        </Stack>
    )
}
