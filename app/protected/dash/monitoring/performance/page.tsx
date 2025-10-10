import * as React from 'react'
import Box from '@mui/joy/Box'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import Typography from '@mui/joy/Typography'
import Grid from '@mui/joy/Grid'
import Button from '@mui/joy/Button'
import { Home as HomeIcon, Insights as InsightsIcon, Refresh as RefreshIcon } from '@mui/icons-material'
import NextLink from 'next/link'
import PerformanceChart from '@/components/dashboard/monitoring/PerformanceChart'
import ErrorTimeline from '@/components/dashboard/monitoring/ErrorTimeline'

export default function PerformanceAnalyticsPage() {
    return (
        <Box>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumbs" sx={{ mb: 2 }}>
                <Link component={NextLink} href="/protected/dash" color="neutral">
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Dashboard
                </Link>
                <Link component={NextLink} href="/protected/dash/monitoring" color="neutral">
                    <InsightsIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Monitoring
                </Link>
                <Typography>Performance</Typography>
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
                        Performance Analytics
                    </Typography>
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                        Detailed metrics and resource usage
                    </Typography>
                </Box>
                <Button variant="outlined" color="neutral" startDecorator={<RefreshIcon />}>
                    Refresh
                </Button>
            </Box>

            {/* Charts */}
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <PerformanceChart
                        title="Response Time Trends"
                        metricType="response_time"
                        timeRange="24h"
                    />
                </Grid>

                <Grid xs={12} md={6}>
                    <PerformanceChart
                        title="Query Volume"
                        metricType="query_volume"
                        timeRange="24h"
                    />
                </Grid>

                <Grid xs={12} md={6}>
                    <PerformanceChart
                        title="Resource Usage"
                        metricType="resource_usage"
                        timeRange="24h"
                    />
                </Grid>

                <Grid xs={12}>
                    <ErrorTimeline />
                </Grid>
            </Grid>
        </Box>
    )
}
