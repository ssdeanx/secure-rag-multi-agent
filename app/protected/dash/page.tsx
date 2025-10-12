import React from 'react'
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    LinearProgress,
    Chip,
    Button,
} from '@/components/ui/joy'
import {
    People,
    Description,
    Chat,
    Security,
    PlayArrow,
    Refresh,
} from '@mui/icons-material'

export default function DashboardPage() {
    const stats = [
        {
            title: 'Total Documents',
            value: '1,247',
            change: '+12%',
            icon: <Description color="primary" />,
            color: 'primary' as const,
        },
        {
            title: 'Active Users',
            value: '89',
            change: '+5%',
            icon: <People color="success" />,
            color: 'success' as const,
        },
        {
            title: 'AI Queries',
            value: '3,456',
            change: '+23%',
            icon: <Chat color="primary" />,
            color: 'neutral' as const,
        },
        {
            title: 'Security Score',
            value: '98%',
            change: '+2%',
            icon: <Security color="warning" />,
            color: 'warning' as const,
        },
    ]

    const recentActivity = [
        {
            type: 'document',
            title: 'New policy document indexed',
            time: '2 minutes ago',
            status: 'success',
        },
        {
            type: 'user',
            title: 'New user registration',
            time: '15 minutes ago',
            status: 'info',
        },
        {
            type: 'security',
            title: 'Security scan completed',
            time: '1 hour ago',
            status: 'success',
        },
    ]

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography level="h2" sx={{ mb: 1 }}>
                    Dashboard Overview
                </Typography>
                <Typography level="body-md" sx={{ color: 'text.tertiary' }}>
                    Welcome back! Here's what's happening with your AI system.
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid key={index} xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        mb: 2,
                                    }}
                                >
                                    {stat.icon}
                                    <Chip
                                        size="sm"
                                        variant="soft"
                                        color={stat.color}
                                        sx={{ fontWeight: 'medium' }}
                                    >
                                        {stat.change}
                                    </Chip>
                                </Box>
                                <Typography level="h3" sx={{ mb: 0.5 }}>
                                    {stat.value}
                                </Typography>
                                <Typography
                                    level="body-sm"
                                    sx={{ color: 'text.tertiary' }}
                                >
                                    {stat.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* System Status */}
                <Grid xs={12} md={8}>
                    <Card variant="outlined">
                        <CardHeader>
                            <Typography level="title-md">
                                System Status
                            </Typography>
                        </CardHeader>
                        <CardContent>
                            <Box sx={{ mb: 3 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 1,
                                    }}
                                >
                                    <Typography level="body-sm">
                                        Database Health
                                    </Typography>
                                    <Typography
                                        level="body-sm"
                                        sx={{ color: 'success.main' }}
                                    >
                                        99.9%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    value={99.9}
                                    color="success"
                                    size="sm"
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 1,
                                    }}
                                >
                                    <Typography level="body-sm">
                                        AI Model Performance
                                    </Typography>
                                    <Typography
                                        level="body-sm"
                                        sx={{ color: 'primary.main' }}
                                    >
                                        97.2%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    value={97.2}
                                    color="primary"
                                    size="sm"
                                />
                            </Box>

                            <Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 1,
                                    }}
                                >
                                    <Typography level="body-sm">
                                        Storage Usage
                                    </Typography>
                                    <Typography
                                        level="body-sm"
                                        sx={{ color: 'warning.main' }}
                                    >
                                        67.8%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    value={67.8}
                                    color="warning"
                                    size="sm"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Activity */}
                <Grid xs={12} md={4}>
                    <Card variant="outlined">
                        <CardHeader>
                            <Typography level="title-md">
                                Recent Activity
                            </Typography>
                        </CardHeader>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}
                            >
                                {recentActivity.map((activity, index) => (
                                    <Box
                                        key={index}
                                        sx={{ display: 'flex', gap: 2 }}
                                    >
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: 'primary.main',
                                                mt: 0.5,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography level="body-sm">
                                                {activity.title}
                                            </Typography>
                                            <Typography
                                                level="body-xs"
                                                sx={{ color: 'text.tertiary' }}
                                            >
                                                {activity.time}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Quick Actions */}
            <Card variant="outlined" sx={{ mt: 3 }}>
                <CardContent>
                    <Typography level="title-md" sx={{ mb: 2 }}>
                        Quick Actions
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            startDecorator={<PlayArrow />}
                            variant="solid"
                            color="primary"
                        >
                            Start New Chat
                        </Button>
                        <Button
                            startDecorator={<Description />}
                            variant="outlined"
                            color="neutral"
                        >
                            Upload Documents
                        </Button>
                        <Button
                            startDecorator={<Refresh />}
                            variant="outlined"
                            color="neutral"
                        >
                            Refresh Data
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}
