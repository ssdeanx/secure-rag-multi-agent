'use client'

import * as React from 'react'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import Table from '@mui/joy/Table'
import Chip from '@mui/joy/Chip'
import { Check, Close } from '@mui/icons-material'

/**
 * Permission Matrix Props
 */
interface PermissionMatrixProps {
    role: string
}

/**
 * Permission Type
 */
interface Permission {
    resource: string
    read: boolean
    write: boolean
    delete: boolean
}

/**
 * PermissionMatrix Component
 *
 * Visual display of role permissions.
 */
export default function PermissionMatrix({ role }: PermissionMatrixProps) {
    const permissions: Permission[] = React.useMemo(() => {
        const matrix: Record<string, Permission[]> = {
            admin: [
                { resource: 'Documents (All)', read: true, write: true, delete: true },
                { resource: 'Users', read: true, write: true, delete: true },
                { resource: 'Policy', read: true, write: true, delete: true },
                { resource: 'System Settings', read: true, write: true, delete: true }
            ],
            dept_admin: [
                { resource: 'Documents (Dept)', read: true, write: true, delete: true },
                { resource: 'Users (Dept)', read: true, write: true, delete: false },
                { resource: 'Policy', read: true, write: false, delete: false },
                { resource: 'System Settings', read: false, write: false, delete: false }
            ],
            dept_viewer: [
                { resource: 'Documents (Dept)', read: true, write: false, delete: false },
                { resource: 'Users (Dept)', read: true, write: false, delete: false },
                { resource: 'Policy', read: false, write: false, delete: false },
                { resource: 'System Settings', read: false, write: false, delete: false }
            ],
            employee: [
                { resource: 'Documents (Public)', read: true, write: false, delete: false },
                { resource: 'Users', read: false, write: false, delete: false },
                { resource: 'Policy', read: false, write: false, delete: false },
                { resource: 'System Settings', read: false, write: false, delete: false }
            ]
        }
        return matrix[role] ?? matrix.employee
    }, [role])

    return (
        <Card>
            <CardContent>
                <Typography level="title-md" sx={{ mb: 2 }}>
                    Permissions
                </Typography>
                <Table size="sm">
                    <thead>
                        <tr>
                            <th>Resource</th>
                            <th>Read</th>
                            <th>Write</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {permissions.map((perm) => (
                            <tr key={perm.resource}>
                                <td>
                                    <Typography level="body-sm">{perm.resource}</Typography>
                                </td>
                                <td>
                                    {perm.read ? (
                                        <Chip size="sm" variant="soft" color="success" startDecorator={<Check />}>
                                            Yes
                                        </Chip>
                                    ) : (
                                        <Chip size="sm" variant="soft" color="neutral" startDecorator={<Close />}>
                                            No
                                        </Chip>
                                    )}
                                </td>
                                <td>
                                    {perm.write ? (
                                        <Chip size="sm" variant="soft" color="success" startDecorator={<Check />}>
                                            Yes
                                        </Chip>
                                    ) : (
                                        <Chip size="sm" variant="soft" color="neutral" startDecorator={<Close />}>
                                            No
                                        </Chip>
                                    )}
                                </td>
                                <td>
                                    {perm.delete ? (
                                        <Chip size="sm" variant="soft" color="success" startDecorator={<Check />}>
                                            Yes
                                        </Chip>
                                    ) : (
                                        <Chip size="sm" variant="soft" color="neutral" startDecorator={<Close />}>
                                            No
                                        </Chip>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </CardContent>
        </Card>
    )
}
