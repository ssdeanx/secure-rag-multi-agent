'use client'

import * as React from 'react'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import Box from '@mui/joy/Box'
import Chip from '@mui/joy/Chip'
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
} from '@mui/icons-material'

interface MetricsCardProps {
    title: string
    value: string
    change: string
    trend: 'up' | 'down'
    icon: React.ReactElement
    color?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral'
}

export default function MetricsCard({
    title,
    value,
    change,
    trend,
    icon,
    color = 'primary',
}: MetricsCardProps) {
    return (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1,
                    }}
                >
                    <Typography
                        level="body-sm"
                        sx={{ color: 'text.secondary' }}
                    >
                        {title}
                    </Typography>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 'sm',
                            bgcolor: `${color}.softBg`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: `${color}.solidBg`,
                        }}
                    >
                        {icon}
                    </Box>
                </Box>

                <Typography level="h2" sx={{ mb: 1 }}>
                    {value}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Chip
                        size="sm"
                        variant="soft"
                        color={trend === 'up' ? 'success' : 'danger'}
                        startDecorator={
                            trend === 'up' ? (
                                <TrendingUpIcon fontSize="small" />
                            ) : (
                                <TrendingDownIcon fontSize="small" />
                            )
                        }
                    >
                        {change}
                    </Chip>
                    <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                        vs last period
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}
