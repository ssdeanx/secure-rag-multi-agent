'use client'

import React, { useCallback } from 'react'
import {
    Alert,
    AlertDescription,
    Badge,
    Avatar,
    AvatarFallback,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    Divider,
    Box,
    Typography,
} from '@/components/ui/joy'
import {
    Lock,
    Security,
    Visibility,
    AdminPanelSettings,
} from '@mui/icons-material'

interface SecurityIndicatorProps {
    role?: string
}

export default function SecurityIndicator({ role }: SecurityIndicatorProps) {
    if (role === null) {
        return (
            <Alert
                variant="soft"
                color="danger"
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    border: '2px solid',
                    borderColor: 'danger.outlinedBorder',
                    bgcolor: 'danger.50',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: 'lg',
                    },
                }}
            >
                <Lock />
                <AlertDescription>
                    <Box
                        sx={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Avatar
                            size="md"
                            sx={{
                                border: '2px solid',
                                borderColor: 'danger.outlinedBorder',
                            }}
                        >
                            <AvatarFallback>
                                <Lock />
                            </AvatarFallback>
                        </Avatar>
                        <Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Typography
                                    level="body-sm"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'danger.main',
                                    }}
                                >
                                    Not Authenticated
                                </Typography>
                                <Badge variant="soft" color="danger" size="sm">
                                    Access Required
                                </Badge>
                            </Box>
                            <Typography
                                level="body-xs"
                                sx={{
                                    color: 'text.tertiary',
                                    fontWeight: 'medium',
                                }}
                            >
                                Please sign in to continue
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            height: 4,
                            bgcolor: 'danger.main',
                            width: 0,
                            transition: 'width 0.5s ease',
                            '&:hover': {
                                width: '100%',
                            },
                        }}
                    />
                </AlertDescription>
            </Alert>
        )
    }

    const getSecurityLevel = useCallback(():
        | 'internal'
        | 'confidential'
        | 'internal-plus' => {
        if (role?.includes('HR Admin')) {
            return 'confidential'
        }
        if (role && (role.includes('Admin') || role.includes('Executive'))) {
            return 'internal-plus'
        }
        return 'internal'
    }, [role])

    const level = getSecurityLevel()

    const getLevelConfig = useCallback(() => {
        switch (level) {
            case 'confidential':
                return {
                    label: 'Confidential Access',
                    description:
                        'Full system access with step-up authentication',
                    color: 'danger' as const,
                    icon: AdminPanelSettings,
                }
            case 'internal-plus':
                return {
                    label: 'Enhanced Access',
                    description: 'Cross-department administrative privileges',
                    color: 'primary' as const,
                    icon: Security,
                }
            case 'internal':
                return {
                    label: 'Internal Access',
                    description: 'Department-level document access',
                    color: 'neutral' as const,
                    icon: Visibility,
                }
            default:
                return {
                    label: 'Internal Access',
                    description: 'Department-level document access',
                    color: 'neutral' as const,
                    icon: Visibility,
                }
        }
    }, [level])

    const config = getLevelConfig()
    const IconComponent = config.icon

    return (
        <TooltipProvider>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: { xs: 2, sm: 3 },
                }}
            >
                {/* Access Level Indicator */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography level="body-sm" sx={{ fontWeight: 'bold' }}>
                        Access Level:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {/* Public Level */}
                        <Tooltip>
                            <TooltipTrigger>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 16,
                                            width: 48,
                                            borderRadius: 'md',
                                            border: '2px solid',
                                            transition: 'all 0.3s ease',
                                            borderColor:
                                                level === 'confidential' ||
                                                level === 'internal-plus' ||
                                                level === 'internal'
                                                    ? 'neutral.outlinedBorder'
                                                    : 'neutral.main',
                                            bgcolor:
                                                level === 'confidential' ||
                                                level === 'internal-plus' ||
                                                level === 'internal'
                                                    ? 'neutral.50'
                                                    : 'background.surface',
                                        }}
                                    />
                                    {(level === 'confidential' ||
                                        level === 'internal-plus' ||
                                        level === 'internal') && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                borderRadius: 'md',
                                                bgcolor: 'neutral.50',
                                                opacity: 0.3,
                                                transition:
                                                    'background-color 0.3s ease',
                                            }}
                                        />
                                    )}
                                    <Typography
                                        level="body-xs"
                                        sx={{
                                            position: 'absolute',
                                            bottom: -20,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontWeight: 'bold',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                            '&:hover': {
                                                opacity: 1,
                                            },
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        Public
                                    </Typography>
                                </Box>
                            </TooltipTrigger>
                            <TooltipContent>
                                <Typography level="body-sm">
                                    Basic document access level
                                </Typography>
                            </TooltipContent>
                        </Tooltip>

                        {/* Internal Level */}
                        <Tooltip>
                            <TooltipTrigger>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 16,
                                            width: 48,
                                            borderRadius: 'md',
                                            border: '2px solid',
                                            transition: 'all 0.3s ease',
                                            borderColor:
                                                level === 'confidential' ||
                                                level === 'internal-plus'
                                                    ? 'primary.outlinedBorder'
                                                    : 'neutral.main',
                                            bgcolor:
                                                level === 'confidential' ||
                                                level === 'internal-plus'
                                                    ? 'primary.50'
                                                    : 'background.surface',
                                        }}
                                    />
                                    {(level === 'confidential' ||
                                        level === 'internal-plus') && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                borderRadius: 'md',
                                                bgcolor: 'primary.50',
                                                opacity: 0.3,
                                                transition:
                                                    'background-color 0.3s ease',
                                            }}
                                        />
                                    )}
                                    <Typography
                                        level="body-xs"
                                        sx={{
                                            position: 'absolute',
                                            bottom: -20,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontWeight: 'bold',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                            '&:hover': {
                                                opacity: 1,
                                            },
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        Internal
                                    </Typography>
                                </Box>
                            </TooltipTrigger>
                            <TooltipContent>
                                <Typography level="body-sm">
                                    Department-level access
                                </Typography>
                            </TooltipContent>
                        </Tooltip>

                        {/* Confidential Level */}
                        <Tooltip>
                            <TooltipTrigger>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 16,
                                            width: 48,
                                            borderRadius: 'md',
                                            border: '2px solid',
                                            transition: 'all 0.3s ease',
                                            borderColor:
                                                level === 'confidential'
                                                    ? 'danger.outlinedBorder'
                                                    : 'neutral.main',
                                            bgcolor:
                                                level === 'confidential'
                                                    ? 'danger.50'
                                                    : 'background.surface',
                                        }}
                                    />
                                    {level === 'confidential' && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                borderRadius: 'md',
                                                bgcolor: 'danger.50',
                                                opacity: 0.3,
                                                transition:
                                                    'background-color 0.3s ease',
                                            }}
                                        />
                                    )}
                                    <Typography
                                        level="body-xs"
                                        sx={{
                                            position: 'absolute',
                                            bottom: -20,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontWeight: 'bold',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                            '&:hover': {
                                                opacity: 1,
                                            },
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        Confidential
                                    </Typography>
                                </Box>
                            </TooltipTrigger>
                            <TooltipContent>
                                <Typography level="body-sm">
                                    Full system access with step-up
                                    authentication
                                </Typography>
                            </TooltipContent>
                        </Tooltip>
                    </Box>
                </Box>

                <Divider
                    orientation="vertical"
                    sx={{ height: 48, display: { xs: 'none', sm: 'block' } }}
                />

                {/* Security Badge */}
                <Alert
                    variant="soft"
                    color={config.color}
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        border: '2px solid',
                        borderColor: `${config.color}.outlinedBorder`,
                        bgcolor: `${config.color}.softBg`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: 'lg',
                            borderColor: `${config.color}.main`,
                        },
                        flex: 1,
                    }}
                >
                    <IconComponent
                        sx={{ fontSize: 20, color: `${config.color}.main` }}
                    />
                    <AlertDescription>
                        {/* Animated background shimmer */}
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                background:
                                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
                                transform: 'translateX(-100%)',
                                transition: 'transform 1s ease',
                                '.MuiAlert-root:hover &': {
                                    transform: 'translateX(100%)',
                                },
                            }}
                        />

                        <Box
                            sx={{
                                position: 'relative',
                                zIndex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Avatar
                                size="md"
                                sx={{
                                    border: '2px solid',
                                    borderColor: 'neutral.outlinedBorder',
                                }}
                            >
                                {config.label.charAt(0)}
                            </Avatar>

                            <Box sx={{ flex: 1 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        level="body-sm"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: `${config.color}.main`,
                                        }}
                                    >
                                        {config.label}
                                    </Typography>
                                    <Badge
                                        variant="soft"
                                        color="neutral"
                                        size="sm"
                                    >
                                        Active
                                    </Badge>
                                </Box>
                                <Typography
                                    level="body-xs"
                                    sx={{
                                        color: 'text.tertiary',
                                        fontWeight: 'medium',
                                    }}
                                >
                                    {config.description}
                                </Typography>
                            </Box>

                            {/* Role indicator */}
                            <Badge
                                variant="outlined"
                                color="neutral"
                                size="sm"
                                sx={{ fontFamily: 'monospace' }}
                            >
                                {role}
                            </Badge>
                        </Box>

                        {/* Bottom accent line */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                height: 4,
                                bgcolor: `${config.color}.main`,
                                width: 0,
                                transition: 'width 0.5s ease',
                                '&:hover': {
                                    width: '100%',
                                },
                            }}
                        />
                    </AlertDescription>
                </Alert>
            </Box>
        </TooltipProvider>
    )
}
