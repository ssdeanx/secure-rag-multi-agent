import * as React from 'react'
import Box from '@mui/joy/Box'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'
import {
    Home as HomeIcon,
    Insights as InsightsIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import NextLink from 'next/link'
import WorkflowTraceViewer from '@/components/dashboard/monitoring/WorkflowTraceViewer'

export default function WorkflowStatusPage() {
    return (
        <Box>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumbs" sx={{ mb: 2 }}>
                <Link
                    component={NextLink}
                    href="/protected/dash"
                    color="neutral"
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Dashboard
                </Link>
                <Link
                    component={NextLink}
                    href="/protected/dash/monitoring"
                    color="neutral"
                >
                    <InsightsIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Monitoring
                </Link>
                <Typography>Workflows</Typography>
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
                        Workflow Execution Traces
                    </Typography>
                    <Typography
                        level="body-sm"
                        sx={{ color: 'text.secondary' }}
                    >
                        Track workflow status and execution history
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    color="neutral"
                    startDecorator={<RefreshIcon />}
                >
                    Refresh
                </Button>
            </Box>

            {/* Workflow Trace Viewer */}
            <WorkflowTraceViewer />
        </Box>
    )
}
