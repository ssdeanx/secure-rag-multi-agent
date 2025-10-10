'use client'

import * as React from 'react'
import Modal from '@mui/joy/Modal'
import ModalDialog from '@mui/joy/ModalDialog'
import ModalClose from '@mui/joy/ModalClose'
import Typography from '@mui/joy/Typography'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import Alert from '@mui/joy/Alert'
import { Send } from '@mui/icons-material'

/**
 * InviteUserModal Props
 */
interface InviteUserModalProps {
    open: boolean
    onClose: () => void
}

/**
 * InviteUserModal Component
 *
 * Modal for inviting new users with email and role selection.
 */
export default function InviteUserModal({ open, onClose }: InviteUserModalProps) {
    const [email, setEmail] = React.useState('')
    const [role, setRole] = React.useState('employee')
    const [loading, setLoading] = React.useState(false)
    const [message, setMessage] = React.useState<{ type: 'success' | 'danger'; text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const response = await fetch('/api/users/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, role })
            })

            if (!response.ok) {
                throw new Error('Failed to send invitation')
            }

            setMessage({ type: 'success', text: 'Invitation sent successfully' })
            setEmail('')
            setRole('employee')
            setTimeout(() => {
                onClose()
                setMessage(null)
            }, 2000)
        } catch {
            setMessage({ type: 'danger', text: 'Failed to send invitation' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog>
                <ModalClose />
                <Typography level="h4" component="h2">
                    Invite User
                </Typography>
                <Typography level="body-sm" sx={{ mb: 2 }}>
                    Send an invitation email to a new user
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        {message !== null && (
                            <Alert variant="soft" color={message.type}>
                                {message.text}
                            </Alert>
                        )}

                        <FormControl required>
                            <FormLabel>Email Address</FormLabel>
                            <Input
                                type="email"
                                placeholder="user@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                                disabled={loading}
                            />
                        </FormControl>

                        <FormControl required>
                            <FormLabel>Role</FormLabel>
                            <Select
                                value={role}
                                onChange={(_event, value) => {
                                    if (value !== null) {
                                        setRole(value)
                                    }
                                }}
                                disabled={loading}
                            >
                                <Option value="employee">Employee - Basic access</Option>
                                <Option value="dept_viewer">Department Viewer - Read department data</Option>
                                <Option value="dept_admin">Department Admin - Manage department</Option>
                                <Option value="admin">Admin - Full system access</Option>
                            </Select>
                        </FormControl>

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" color="neutral" onClick={onClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" startDecorator={<Send />} loading={loading}>
                                Send Invitation
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    )
}
