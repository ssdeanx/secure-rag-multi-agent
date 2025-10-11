'use client'

import * as React from 'react'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import Box from '@mui/joy/Box'
import LinearProgress from '@mui/joy/LinearProgress'
import Chip from '@mui/joy/Chip'
import { CheckCircle, Warning, Error } from '@mui/icons-material'

interface SystemMetric {
    name: string
    value: number
    status: 'healthy' | 'warning' | 'error'
    description: string
}

const systemMetrics: SystemMetric[] = [
    {
        name: 'PostgreSQL + PgVector',
        value: 99.9,
        status: 'healthy',
        description: 'Database and vector storage',
    },
    {
        name: 'AI Agents',
        value: 100,
        status: 'healthy',
        description: '16 agents operational',
    },
    {
        name: 'Mastra Workflows',
        value: 97.5,
        status: 'healthy',
        description: 'Workflow orchestration',
    },
    {
        name: 'Storage Usage',
        value: 67.8,
        status: 'warning',
        description: '67.8% of capacity used',
    },
]

export default function SystemStatus() {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography level="title-lg" sx={{ mb: 2 }}>
                    System Status
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {systemMetrics.map((metric) => {
                        const statusColor =
                            metric.status === 'healthy'
                                ? 'success'
                                : metric.status === 'warning'
                                    ? 'warning'
                                    : 'danger'
                        const StatusIcon =
                            metric.status === 'healthy'
                                ? CheckCircle
                                : metric.status === 'warning'
                                    ? Warning
                                    : Error

                        return (
                            <Box key={metric.name}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 1,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography level="body-sm" fontWeight="lg">
                                            {metric.name}
                                        </Typography>
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            color={statusColor}
                                            startDecorator={<StatusIcon fontSize="small" />}
                                        >
                                            {metric.status}
                                        </Chip>
                                    </Box>
                                    <Typography level="body-sm" sx={{ color: `${statusColor}.solidBg` }}>
                                        {metric.value}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    determinate
                                    value={metric.value}
                                    color={statusColor}
                                    size="sm"
                                    sx={{ mb: 0.5 }}
                                />
                                <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                                    {metric.description}
                                </Typography>
                            </Box>
                        )
                    })}
                </Box>
            </CardContent>
        </Card>
    )
}
