'use client'

import * as React from 'react'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Checkbox from '@mui/joy/Checkbox'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import Box from '@mui/joy/Box'
import Alert from '@mui/joy/Alert'
import { Save } from '@mui/icons-material'

/**
 * Permission Editor Props
 */
interface PermissionEditorProps {
    role: string
}

/**
 * Permission Type
 */
interface Permission {
    resource: string
    actions: {
        read: boolean
        write: boolean
        delete: boolean
    }
}

/**
 * PermissionEditor Component
 *
 * UI for editing role permissions.
 */
export default function PermissionEditor({ role }: PermissionEditorProps) {
    const [permissions, setPermissions] = React.useState<Permission[]>([])
    const [loading, setLoading] = React.useState(false)
    const [message, setMessage] = React.useState<{
        type: 'success' | 'danger'
        text: string
    } | null>(null)

    React.useEffect(() => {
        // Initialize permissions based on role
        const defaultPermissions: Permission[] = [
            {
                resource: 'documents',
                actions: { read: false, write: false, delete: false },
            },
            {
                resource: 'users',
                actions: { read: false, write: false, delete: false },
            },
            {
                resource: 'policy',
                actions: { read: false, write: false, delete: false },
            },
            {
                resource: 'settings',
                actions: { read: false, write: false, delete: false },
            },
        ]

        // Apply role-specific defaults
        if (role === 'admin') {
            defaultPermissions.forEach((perm) => {
                perm.actions = { read: true, write: true, delete: true }
            })
        } else if (role === 'dept_admin') {
            defaultPermissions[0].actions = {
                read: true,
                write: true,
                delete: true,
            }
            defaultPermissions[1].actions = {
                read: true,
                write: true,
                delete: false,
            }
            defaultPermissions[2].actions = {
                read: true,
                write: false,
                delete: false,
            }
        } else if (role === 'dept_viewer') {
            defaultPermissions[0].actions = {
                read: true,
                write: false,
                delete: false,
            }
            defaultPermissions[1].actions = {
                read: true,
                write: false,
                delete: false,
            }
        } else if (role === 'employee') {
            defaultPermissions[0].actions = {
                read: true,
                write: false,
                delete: false,
            }
        }

        setPermissions(defaultPermissions)
    }, [role])

    const handleToggle = (
        resourceIndex: number,
        action: 'read' | 'write' | 'delete'
    ) => {
        setPermissions((prev) =>
            prev.map((perm, idx) =>
                idx === resourceIndex
                    ? {
                          ...perm,
                          actions: {
                              ...perm.actions,
                              [action]: !perm.actions[action],
                          },
                      }
                    : perm
            )
        )
    }

    const handleSave = async () => {
        setLoading(true)
        setMessage(null)

        try {
            const response = await fetch(
                `/api/policy/roles/${role}/permissions`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ permissions }),
                }
            )

            if (!response.ok) {
                throw new Error('Failed to save permissions')
            }

            setMessage({
                type: 'success',
                text: 'Permissions saved successfully',
            })
        } catch {
            setMessage({ type: 'danger', text: 'Failed to save permissions' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardContent>
                <Typography level="title-md" sx={{ mb: 2 }}>
                    Edit Permissions: {role.replace('_', ' ')}
                </Typography>

                {message !== null && (
                    <Alert variant="soft" color={message.type} sx={{ mb: 2 }}>
                        {message.text}
                    </Alert>
                )}

                <Stack spacing={3}>
                    {permissions.map((perm, idx) => (
                        <Box key={perm.resource}>
                            <FormLabel sx={{ mb: 1, fontWeight: 'lg' }}>
                                {perm.resource.charAt(0).toUpperCase() +
                                    perm.resource.slice(1)}
                            </FormLabel>
                            <Stack direction="row" spacing={2}>
                                <FormControl>
                                    <Checkbox
                                        label="Read"
                                        checked={perm.actions.read}
                                        onChange={() => {
                                            handleToggle(idx, 'read')
                                        }}
                                    />
                                </FormControl>
                                <FormControl>
                                    <Checkbox
                                        label="Write"
                                        checked={perm.actions.write}
                                        onChange={() => {
                                            handleToggle(idx, 'write')
                                        }}
                                    />
                                </FormControl>
                                <FormControl>
                                    <Checkbox
                                        label="Delete"
                                        checked={perm.actions.delete}
                                        onChange={() => {
                                            handleToggle(idx, 'delete')
                                        }}
                                    />
                                </FormControl>
                            </Stack>
                        </Box>
                    ))}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            startDecorator={<Save />}
                            loading={loading}
                            onClick={handleSave}
                        >
                            Save Permissions
                        </Button>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}
