'use client'

import * as React from 'react'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import Table from '@mui/joy/Table'
import Chip from '@mui/joy/Chip'
import { Check, Close } from '@mui/icons-material'

/**
 * Access Matrix Component
 *
 * Visual matrix showing document access by role and classification.
 */
export default function AccessMatrix() {
    const roles = ['public', 'employee', 'dept_viewer', 'dept_admin', 'admin']
    const classifications = ['public', 'internal', 'confidential']

    const hasAccess = (role: string, classification: string): boolean => {
        const matrix: Record<string, string[]> = {
            public: ['public'],
            employee: ['public', 'internal'],
            dept_viewer: ['public', 'internal'],
            dept_admin: ['public', 'internal', 'confidential'],
            admin: ['public', 'internal', 'confidential'],
        }
        return matrix[role]?.includes(classification) ?? false
    }

    return (
        <Card>
            <CardContent>
                <Typography level="title-md" sx={{ mb: 2 }}>
                    Document Access Matrix
                </Typography>
                <Typography
                    level="body-sm"
                    sx={{ mb: 3, color: 'text.secondary' }}
                >
                    Shows which roles can access documents by security
                    classification
                </Typography>

                <Table size="sm">
                    <thead>
                        <tr>
                            <th>Role</th>
                            {classifications.map((classification) => (
                                <th key={classification}>
                                    <Chip
                                        size="sm"
                                        variant="soft"
                                        color={
                                            classification === 'public'
                                                ? 'success'
                                                : classification === 'internal'
                                                  ? 'warning'
                                                  : 'danger'
                                        }
                                    >
                                        {classification}
                                    </Chip>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr key={role}>
                                <td>
                                    <Typography level="body-sm" fontWeight="md">
                                        {role.replace('_', ' ')}
                                    </Typography>
                                </td>
                                {classifications.map((classification) => (
                                    <td key={classification}>
                                        {hasAccess(role, classification) ? (
                                            <Chip
                                                size="sm"
                                                variant="soft"
                                                color="success"
                                                startDecorator={<Check />}
                                            >
                                                Allowed
                                            </Chip>
                                        ) : (
                                            <Chip
                                                size="sm"
                                                variant="soft"
                                                color="neutral"
                                                startDecorator={<Close />}
                                            >
                                                Denied
                                            </Chip>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </CardContent>
        </Card>
    )
}
