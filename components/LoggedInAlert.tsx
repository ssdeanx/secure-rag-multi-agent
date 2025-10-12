'use client'

import React from 'react'
import {
    CheckCircle as CheckCircleIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Security as SecurityIcon,
} from '@mui/icons-material'
import {
    Button,
    Alert,
    Chip,
    Avatar,
    Tooltip,
    Divider,
} from '@/components/ui/joy'
import { Box, Typography } from '@mui/joy'

interface LoggedInAlertProps {
    currentRole: string
    onSignOut: () => void
}

export function LoggedInAlert({ currentRole, onSignOut }: LoggedInAlertProps) {
    return (
        <Alert
            variant="soft"
            color="primary"
            startDecorator={<CheckCircleIcon />}
            sx={{
                position: 'relative',
                border: '2px solid',
                borderColor: 'primary.softColor',
                borderRadius: 'md',
                background:
                    'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-2px) scale(1.02)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                },
            }}
        >
            {/* Background decorative elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'primary.softColor',
                    opacity: 0.1,
                    animation: 'pulse 2s infinite',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    opacity: 0.1,
                    animation: 'pulse 2s infinite',
                }}
            />

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Avatar size="lg" variant="soft" color="primary">
                        <PersonIcon />
                    </Avatar>

                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 1,
                            }}
                        >
                            <Typography
                                level="body-sm"
                                sx={{ fontWeight: 'bold' }}
                            >
                                Logged in as
                            </Typography>
                            <Chip
                                variant="soft"
                                color="primary"
                                size="sm"
                                startDecorator={
                                    <PersonIcon sx={{ fontSize: 16 }} />
                                }
                            >
                                {currentRole}
                            </Chip>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <SecurityIcon sx={{ fontSize: 12 }} />
                            <Typography
                                level="body-xs"
                                sx={{ color: 'text.tertiary' }}
                            >
                                Authenticated Session
                            </Typography>
                            <Chip variant="outlined" color="success" size="sm">
                                Active
                            </Chip>
                        </Box>
                    </Box>
                </Box>

                <Tooltip title="End your current session" placement="top">
                    <Button
                        onClick={onSignOut}
                        variant="outlined"
                        color="danger"
                        size="sm"
                        startDecorator={<LogoutIcon sx={{ fontSize: 16 }} />}
                        sx={{
                            border: '2px solid',
                            borderColor: 'danger.softColor',
                            backgroundColor: 'danger.softColor',
                            color: 'danger.main',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                borderColor: 'danger.main',
                                backgroundColor: 'danger.main',
                                color: 'common.white',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                            },
                        }}
                    >
                        <Typography sx={{ fontWeight: 'bold' }}>
                            Sign Out
                        </Typography>
                    </Button>
                </Tooltip>
            </Box>

            {/* Bottom accent line */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '4px',
                    background:
                        'linear-gradient(90deg, transparent 0%, currentColor 50%, transparent 100%)',
                    width: 0,
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    '.MuiAlert-root:hover &': {
                        width: '100%',
                    },
                }}
            />
        </Alert>
    )
}

export default LoggedInAlert
