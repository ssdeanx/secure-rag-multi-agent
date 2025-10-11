'use client'

import React from 'react'
import {
    Card,
    CardContent,
    Badge,
    Alert,
    AlertDescription,
    Divider,
    Avatar,
    AvatarFallback,
    LinearProgress,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    Box,
    Typography,
} from '@/components/ui/joy'
import {
    Security,
    Warning,
    Error as ErrorIcon,
    Info,
} from '@mui/icons-material'

interface FeatureCardProps {
    title: string
    badgeVariant?: 'secondary' | 'destructive' | 'default'
    badgeText?: string
    icon?: React.ReactNode
    children?: React.ReactNode
    status?: 'success' | 'warning' | 'error' | 'info'
    statusMessage?: string
    progress?: number
    showAvatar?: boolean
    avatarFallback?: string
    tooltip?: string
    hoverContent?: React.ReactNode
}

export function FeatureCard({
    title,
    badgeVariant = 'secondary',
    badgeText,
    icon,
    children,
    status,
    statusMessage,
    progress,
    showAvatar,
    avatarFallback,
    tooltip,
    hoverContent,
}: FeatureCardProps) {
    const getStatusColor = (statusProp?: string) => {
        switch (statusProp) {
            case 'success':
                return 'success' as const
            case 'warning':
                return 'warning' as const
            case 'error':
                return 'danger' as const
            case 'info':
                return 'primary' as const
            default:
                return 'neutral' as const
        }
    }

    const getBadgeColor = (variant?: string) => {
        switch (variant) {
            case 'default':
                return 'primary' as const
            case 'secondary':
                return 'neutral' as const
            case 'destructive':
                return 'danger' as const
            default:
                return 'neutral' as const
        }
    }

    const cardContent = (
        <Card
            variant="outlined"
            sx={{
                position: 'relative',
                overflow: 'hidden',
                border: '4px solid',
                borderColor: 'primary.softBg',
                bgcolor: 'background.surface',
                boxShadow: 'xl',
                transition: 'all 0.3s ease',
                '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '2xl',
                },
            }}
        >
            {/* Background decorative elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.softBg',
                    borderRadius: '50%',
                    filter: 'blur(20px)',
                    opacity: 0,
                    transition: 'opacity 0.5s ease',
                    '&:hover': {
                        opacity: 1,
                    },
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 48,
                    height: 48,
                    bgcolor: 'warning.softBg',
                    borderRadius: '50%',
                    filter: 'blur(15px)',
                    opacity: 0,
                    transition: 'opacity 0.5s ease 0.1s',
                    '&:hover': {
                        opacity: 1,
                    },
                }}
            />

            <CardContent sx={{ p: 3, position: 'relative' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        mb: 3,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {showAvatar && (
                            <Avatar
                                size="lg"
                                sx={{
                                    border: '2px solid',
                                    borderColor: 'primary.outlinedBorder',
                                }}
                            >
                                <AvatarFallback>
                                    <Box
                                        sx={{
                                            bgcolor: 'primary.softBg',
                                            color: 'primary.main',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {avatarFallback ?? title.charAt(0)}
                                    </Box>
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 'xl',
                                bgcolor: 'primary.softBg',
                                border: '2px solid',
                                borderColor: 'primary.outlinedBorder',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: 'primary.softBg',
                                    borderColor: 'primary.main',
                                },
                            }}
                        >
                            {icon}
                        </Box>
                        <Box>
                            <Typography
                                level="title-lg"
                                sx={{ fontWeight: 'bold', mb: 0.5 }}
                            >
                                {title}
                            </Typography>
                            {badgeText && badgeText.trim().length > 0 && (
                                <Badge
                                    variant="soft"
                                    color={getBadgeColor(badgeVariant)}
                                    sx={{
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        fontSize: 'xs',
                                        letterSpacing: '0.1em',
                                    }}
                                >
                                    {badgeText}
                                </Badge>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Status Alert */}
                {status &&
                    statusMessage &&
                    statusMessage?.trim().length > 0 && (
                        <Alert
                            variant="soft"
                            color={getStatusColor(status)}
                            sx={{
                                mb: 2,
                                border: '2px solid',
                                borderColor: `${status}.outlinedBorder`,
                                bgcolor: `${status}.softBg`,
                            }}
                        >
                            {status === 'success' && <Security />}
                            {status === 'warning' && <Warning />}
                            {status === 'error' && <ErrorIcon />}
                            {status === 'info' && <Info />}
                            <AlertDescription sx={{ fontWeight: 'bold' }}>
                                {statusMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                {/* Progress Bar */}
                {progress !== undefined && (
                    <Box sx={{ mb: 2 }}>
                        <LinearProgress
                            value={progress}
                            color="primary"
                            size="sm"
                            sx={{ mb: 0.5 }}
                        />
                        <Typography
                            level="body-xs"
                            sx={{ color: 'text.tertiary' }}
                        >
                            {progress}% complete
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ mb: 2 }} />

                <Typography
                    level="body-sm"
                    sx={{ color: 'text.tertiary', lineHeight: 1.6 }}
                >
                    {children}
                </Typography>

                {/* Bottom accent line */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: 4,
                        bgcolor: 'primary.main',
                        width: 0,
                        transition: 'width 0.5s ease',
                        '&:hover': {
                            width: '100%',
                        },
                    }}
                />
            </CardContent>
        </Card>
    )

    if (tooltip || hoverContent) {
        return <div title={tooltip}>{cardContent}</div>
    }

    return cardContent
}

export default FeatureCard
