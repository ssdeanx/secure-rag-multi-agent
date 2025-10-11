'use client'

import * as React from 'react'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import Box from '@mui/joy/Box'
import Chip from '@mui/joy/Chip'
import Stack from '@mui/joy/Stack'

/**
 * Role Hierarchy Props
 */
interface RoleHierarchyProps {
    selectedRole: string
    onSelectRole: (roleId: string) => void
}

/**
 * Role Node Type
 */
interface RoleNode {
    id: string
    name: string
    level: number
    inheritsFrom: string | null
    description: string
}

/**
 * RoleHierarchy Component
 *
 * Visual tree of role hierarchy with inheritance.
 */
export default function RoleHierarchy({ selectedRole, onSelectRole }: RoleHierarchyProps) {
    const roles: RoleNode[] = [
        {
            id: 'admin',
            name: 'Admin',
            level: 0,
            inheritsFrom: null,
            description: 'Full system access'
        },
        {
            id: 'dept_admin',
            name: 'Department Admin',
            level: 1,
            inheritsFrom: 'admin',
            description: 'Manage department resources'
        },
        {
            id: 'dept_viewer',
            name: 'Department Viewer',
            level: 2,
            inheritsFrom: 'dept_admin',
            description: 'View department resources'
        },
        {
            id: 'employee',
            name: 'Employee',
            level: 3,
            inheritsFrom: 'dept_viewer',
            description: 'Basic employee access'
        },
        {
            id: 'public',
            name: 'Public',
            level: 4,
            inheritsFrom: 'employee',
            description: 'Public access only'
        }
    ]

    return (
        <Card>
            <CardContent>
                <Typography level="title-md" sx={{ mb: 2 }}>
                    Role Hierarchy
                </Typography>
                <Typography level="body-sm" sx={{ mb: 3, color: 'text.secondary' }}>
                    Roles inherit permissions from their parent roles
                </Typography>

                <Stack spacing={2}>
                    {roles.map((role) => (
                        <Box
                            key={role.id}
                            onClick={() => {
                                onSelectRole(role.id)
                            }}
                            sx={{
                                pl: role.level * 3,
                                p: 2,
                                borderRadius: 'sm',
                                bgcolor: selectedRole === role.id ? 'primary.softBg' : 'background.level1',
                                borderLeft: '3px solid',
                                borderColor: selectedRole === role.id ? 'primary.solidBg' : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    bgcolor: selectedRole === role.id ? 'primary.softBg' : 'background.level2'
                                }
                            }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                <Typography level="title-sm">{role.name}</Typography>
                                <Chip size="sm" variant="soft" color="neutral">
                                    Level {role.level}
                                </Chip>
                            </Stack>
                            <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                {role.description}
                            </Typography>
                            {role.inheritsFrom !== null && (
                                <Typography level="body-xs" sx={{ color: 'text.tertiary', mt: 0.5 }}>
                                    Inherits from: {roles.find((r) => r.id === role.inheritsFrom)?.name}
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    )
}
