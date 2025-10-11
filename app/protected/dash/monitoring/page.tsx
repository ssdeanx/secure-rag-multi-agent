import * as React from 'react'
import Box from '@mui/joy/Box'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import Typography from '@mui/joy/Typography'
import Grid from '@mui/joy/Grid'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Button from '@mui/joy/Button'
import Chip from '@mui/joy/Chip'
import {
    Home as HomeIcon,
    Refresh as RefreshIcon,
    TrendingUp as TrendingUpIcon,
    Speed as SpeedIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
} from '@mui/icons-material'
import NextLink from 'next/link'
import MetricsCard from '@/components/dashboard/monitoring/MetricsCard'

export default function MonitoringOverviewPage() {
    const [lastUpdate, setLastUpdate] = React.useState(new Date())

    const handleRefresh = () => {
        setLastUpdate(new Date())
    }

    return (
        <Box>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumbs" sx={{ mb: 2 }}>
                <Link component={NextLink} href="/protected/dash" color="neutral">
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Dashboard
                </Link>
                <Typography>Monitoring</Typography>
            </Breadcrumbs>

            {/* Page Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                }}
            >
                <Box>
                    <Typography level="h2" component="h1" sx={{ mb: 0.5 }}>
                        System Monitoring
                    </Typography>
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                        Real-time metrics and system health
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        color="neutral"
                        startDecorator={<RefreshIcon />}
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Last Update */}
            <Typography level="body-xs" sx={{ color: 'text.tertiary', mb: 2 }}>
                Last updated: {lastUpdate.toLocaleTimeString()}
            </Typography>

            {/* Metrics Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid xs={12} sm={6} md={3}>
                    <MetricsCard
                        title="Total Queries"
                        value="1,247"
                        change="+12%"
                        trend="up"
                        icon={<TrendingUpIcon />}
                        color="primary"
                    />
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                    <MetricsCard
                        title="Avg Response Time"
                        value="342ms"
                        change="-8%"
                        trend="down"
                        icon={<SpeedIcon />}
                        color="success"
                    />
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                    <MetricsCard
                        title="Success Rate"
                        value="98.4%"
                        change="+2%"
                        trend="up"
                        icon={<CheckCircleIcon />}
                        color="success"
                    />
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                    <MetricsCard
                        title="Error Count"
                        value="23"
                        change="-15%"
                        trend="down"
                        icon={<ErrorIcon />}
                        color="danger"
                    />
                </Grid>
            </Grid>

            {/* System Status Cards */}
            <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 2,
                                }}
                            >
                                <Typography level="title-md">Agent Status</Typography>
                                <Chip size="sm" color="success" variant="soft">
                                    All Operational
                                </Chip>
                            </Box>
                            <Typography level="body-sm" sx={{ mb: 2 }}>
                                16 agents running across the system
                            </Typography>
                            <Button
                                component={NextLink}
                                href="/protected/dash/monitoring/agents"
                                variant="outlined"
                                color="neutral"
                                size="sm"
                                fullWidth
                            >
                                View Agent Logs
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 2,
                                }}
                            >
                                <Typography level="title-md">Workflow Status</Typography>
                                <Chip size="sm" color="primary" variant="soft">
                                    Active
                                </Chip>
                            </Box>
                            <Typography level="body-sm" sx={{ mb: 2 }}>
                                3 workflows currently executing
                            </Typography>
                            <Button
                                component={NextLink}
                                href="/protected/dash/monitoring/workflows"
                                variant="outlined"
                                color="neutral"
                                size="sm"
                                fullWidth
                            >
                                View Workflow Traces
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={12}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 2,
                                }}
                            >
                                <Typography level="title-md">Performance Analytics</Typography>
                                <Chip size="sm" color="success" variant="soft">
                                    Healthy
                                </Chip>
                            </Box>
                            <Typography level="body-sm" sx={{ mb: 2 }}>
                                View detailed performance metrics and resource usage
                            </Typography>
                            <Button
                                component={NextLink}
                                href="/protected/dash/monitoring/performance"
                                variant="outlined"
                                color="neutral"
                                size="sm"
                            >
                                View Performance Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}
