'use client'

import * as React from 'react'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'

/**
 * RoleSelector Props
 */
interface RoleSelectorProps {
    userId: string
    currentRole: string
}

/**
 * RoleSelector Component
 *
 * Dropdown for changing user roles.
 */
export default function RoleSelector({ userId, currentRole }: RoleSelectorProps) {
    const [role, setRole] = React.useState(currentRole)
    const [loading, setLoading] = React.useState(false)

    const handleRoleChange = async (newRole: string) => {
        setLoading(true)
        try {
            const response = await fetch(`/api/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            })

            if (!response.ok) {
                throw new Error('Failed to update role')
            }

            setRole(newRole)
        } catch {
            alert('Failed to update role')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Select
            value={role}
            onChange={(_event, value) => {
                if (value !== null) {
                    void handleRoleChange(value)
                }
            }}
            disabled={loading}
            size="sm"
        >
            <Option value="public">Public</Option>
            <Option value="employee">Employee</Option>
            <Option value="dept_viewer">Department Viewer</Option>
            <Option value="dept_admin">Department Admin</Option>
            <Option value="admin">Admin</Option>
        </Select>
    )
}
