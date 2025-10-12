'use client'

import * as React from 'react'
import Box from '@mui/joy/Box'
import Table from '@mui/joy/Table'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import Chip from '@mui/joy/Chip'
import IconButton from '@mui/joy/IconButton'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import { Edit, Delete, Add } from '@mui/icons-material'

/**
 * Policy Rule Type
 */
interface PolicyRule {
    id: string
    name: string
    resource: string
    actions: string[]
    roles: string[]
    effect: 'allow' | 'deny'
    priority: number
}

/**
 * PolicyTable Component
 *
 * Table of ACL policy rules.
 */
export default function PolicyTable() {
    const [rules, setRules] = React.useState<PolicyRule[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await fetch('/api/policy/rules')
                if (!response.ok) {
                    throw new Error('Failed to fetch rules')
                }

                const data = (await response.json()) as { rules: PolicyRule[] }
                setRules(data.rules)
            } catch {
                // Error handled silently
            } finally {
                setLoading(false)
            }
        }

        void fetchRules()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this policy rule?')) {
            return
        }

        try {
            const response = await fetch(`/api/policy/rules/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete rule')
            }

            setRules((prev) => prev.filter((rule) => rule.id !== id))
        } catch {
            alert('Failed to delete rule')
        }
    }

    return (
        <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button startDecorator={<Add />}>Add Rule</Button>
            </Box>

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
                            <th>Rule Name</th>
                            <th>Resource</th>
                            <th>Actions</th>
                            <th>Roles</th>
                            <th>Effect</th>
                            <th>Priority</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7}>
                                    <Typography
                                        level="body-sm"
                                        sx={{ textAlign: 'center', py: 4 }}
                                    >
                                        Loading rules...
                                    </Typography>
                                </td>
                            </tr>
                        ) : rules.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <Typography
                                        level="body-sm"
                                        sx={{ textAlign: 'center', py: 4 }}
                                    >
                                        No policy rules found
                                    </Typography>
                                </td>
                            </tr>
                        ) : (
                            rules.map((rule) => (
                                <tr key={rule.id}>
                                    <td>
                                        <Typography level="title-sm">
                                            {rule.name}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {rule.resource}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Stack
                                            direction="row"
                                            spacing={0.5}
                                            flexWrap="wrap"
                                        >
                                            {rule.actions.map((action) => (
                                                <Chip
                                                    key={action}
                                                    size="sm"
                                                    variant="outlined"
                                                >
                                                    {action}
                                                </Chip>
                                            ))}
                                        </Stack>
                                    </td>
                                    <td>
                                        <Stack
                                            direction="row"
                                            spacing={0.5}
                                            flexWrap="wrap"
                                        >
                                            {rule.roles.map((role) => (
                                                <Chip
                                                    key={role}
                                                    size="sm"
                                                    variant="soft"
                                                    color="primary"
                                                >
                                                    {role}
                                                </Chip>
                                            ))}
                                        </Stack>
                                    </td>
                                    <td>
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            color={
                                                rule.effect === 'allow'
                                                    ? 'success'
                                                    : 'danger'
                                            }
                                        >
                                            {rule.effect}
                                        </Chip>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {rule.priority}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Stack direction="row" spacing={1}>
                                            <IconButton
                                                size="sm"
                                                variant="plain"
                                                color="neutral"
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                size="sm"
                                                variant="plain"
                                                color="danger"
                                                onClick={() => {
                                                    void handleDelete(rule.id)
                                                }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Stack>
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
