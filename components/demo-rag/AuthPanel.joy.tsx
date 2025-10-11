'use client'

import React, { useState } from 'react'
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Chip,
} from '@/components/ui/joy'
import { AdminPanelSettings, Business, Person } from '@mui/icons-material'

interface AuthPanelProps {
    onAuth: (token: string, role: string) => void
}

const roles = [
    {
        id: 'employee',
        name: 'Employee',
        description: 'Basic access to public information',
        icon: Person,
        color: 'neutral' as const,
        variant: 'outlined' as const,
    },
    {
        id: 'dept_viewer',
        name: 'Department Viewer',
        description: 'Access to department-specific information',
        icon: Business,
        color: 'primary' as const,
        variant: 'soft' as const,
    },
    {
        id: 'admin',
        name: 'Administrator',
        description: 'Full access including confidential data',
        icon: AdminPanelSettings,
        color: 'warning' as const,
        variant: 'solid' as const,
    },
]

export default function AuthPanel({ onAuth }: AuthPanelProps) {
    const [selectedRole, setSelectedRole] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleRoleSelect = async (roleId: string) => {
        setSelectedRole(roleId)
        setIsLoading(true)

        try {
            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Generate JWT token based on role (this would normally come from your auth API)
            const mockTokens = {
                employee:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImVtcGxveWVlIiwiaWF0IjoxNTE2MjM5MDIyfQ.mock_signature',
                dept_viewer:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgU21pdGgiLCJyb2xlIjoiZGVwdF92aWV3ZXIiLCJkZXB0IjoiZmluYW5jZSIsImlhdCI6MTUxNjIzOTAyMn0.mock_signature',
                admin: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkJvYiBKb2huc29uIiwicm9sZSI6ImFkbWluIiwiZGVwdCI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.mock_signature',
            }

            const token =
                mockTokens[roleId as keyof typeof mockTokens] ||
                mockTokens.employee
            onAuth(token, roleId)
        } catch (error) {
            console.error('Auth failed:', error)
        } finally {
            setIsLoading(false)
            setSelectedRole(null)
        }
    }

    return (
        <Card
            variant="outlined"
            sx={{
                maxWidth: 600,
                width: '100%',
                borderWidth: 2,
                borderColor: 'primary.200',
            }}
        >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography
                    level="h3"
                    sx={{
                        textAlign: 'center',
                        mb: 2,
                        fontWeight: 600,
                        color: 'text.primary',
                    }}
                >
                    Select Your Role
                </Typography>

                <Typography
                    level="body-sm"
                    sx={{
                        textAlign: 'center',
                        mb: 4,
                        color: 'text.secondary',
                    }}
                >
                    Choose a role to experience different levels of access and
                    security
                </Typography>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(3, 1fr)',
                        },
                        gap: 3,
                    }}
                >
                    {roles.map((role) => {
                        const Icon = role.icon
                        const isSelected = selectedRole === role.id
                        const isDisabled = isLoading && !isSelected

                        return (
                            <button
                                key={role.id}
                                onClick={() =>
                                    !isDisabled && handleRoleSelect(role.id)
                                }
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    cursor: isDisabled
                                        ? 'not-allowed'
                                        : 'pointer',
                                    borderRadius: '12px',
                                    opacity: isDisabled ? 0.6 : 1,
                                    transition: 'all 160ms ease',
                                }}
                                disabled={isDisabled}
                            >
                                <Card
                                    variant={role.variant}
                                    color={role.color}
                                    sx={{
                                        height: '100%',
                                        border: 'none',
                                        transition: 'all 160ms ease',
                                        boxShadow: isDisabled ? 'none' : 'sm',
                                        '&:hover': {
                                            boxShadow: isDisabled
                                                ? 'none'
                                                : 'md',
                                        },
                                    }}
                                >
                                    <CardContent
                                        sx={{ p: 3, textAlign: 'center' }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 'lg',
                                                    bgcolor:
                                                        'background.surface',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Icon
                                                    sx={{
                                                        fontSize: 32,
                                                        color: 'text.primary',
                                                    }}
                                                />
                                            </Box>

                                            <Box>
                                                <Typography
                                                    level="title-md"
                                                    sx={{
                                                        fontWeight: 600,
                                                        mb: 1,
                                                        color: 'text.primary',
                                                    }}
                                                >
                                                    {role.name}
                                                </Typography>
                                                <Typography
                                                    level="body-sm"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        lineHeight: 1.4,
                                                    }}
                                                >
                                                    {role.description}
                                                </Typography>
                                            </Box>

                                            {isSelected && (
                                                <Chip
                                                    size="sm"
                                                    color="success"
                                                    variant="solid"
                                                    sx={{ fontWeight: 600 }}
                                                >
                                                    Signing in...
                                                </Chip>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </button>
                        )
                    })}
                </Box>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                        This is a demo environment. In production,
                        authentication would be handled securely.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}
