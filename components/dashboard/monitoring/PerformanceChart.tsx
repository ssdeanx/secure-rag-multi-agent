'use client'

import * as React from 'react'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import Box from '@mui/joy/Box'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'

interface PerformanceChartProps {
    title: string
    metricType: 'response_time' | 'query_volume' | 'resource_usage'
    timeRange: '1h' | '24h' | '7d' | '30d'
}

type TimeRangeValue = '1h' | '24h' | '7d' | '30d'

export default function PerformanceChart({
    title,
    timeRange: initialTimeRange,
}: PerformanceChartProps) {
    const [timeRange, setTimeRange] =
        React.useState<TimeRangeValue>(initialTimeRange)

    // Mock data - in real app, this would come from API
    const chartData = React.useMemo(() => {
        const dataPoints = 24
        return Array.from({ length: dataPoints }, (_, i) => ({
            time: new Date(
                Date.now() - (dataPoints - i) * 3600000
            ).toLocaleTimeString(),
            value: Math.floor(Math.random() * 100) + 200,
        }))
    }, [timeRange])

    const maxValue = Math.max(...chartData.map((d) => d.value))

    return (
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
                    <Typography level="title-md">{title}</Typography>
                    <Select
                        value={timeRange}
                        onChange={(_, value) =>
                            value && setTimeRange(value as TimeRangeValue)
                        }
                        size="sm"
                    >
                        <Option value="1h">Last Hour</Option>
                        <Option value="24h">Last 24 Hours</Option>
                        <Option value="7d">Last 7 Days</Option>
                        <Option value="30d">Last 30 Days</Option>
                    </Select>
                </Box>

                {/* Simple Bar Chart */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 0.5,
                        height: 200,
                        px: 1,
                    }}
                >
                    {chartData.map((data, i) => (
                        <Box
                            key={i}
                            sx={{
                                flex: 1,
                                bgcolor: 'primary.softBg',
                                borderRadius: 'xs',
                                height: `${(data.value / maxValue) * 100}%`,
                                minHeight: 4,
                                '&:hover': {
                                    bgcolor: 'primary.solidBg',
                                    cursor: 'pointer',
                                },
                            }}
                            title={`${data.time}: ${data.value}ms`}
                        />
                    ))}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 1,
                        px: 1,
                    }}
                >
                    <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                        {chartData[0]?.time}
                    </Typography>
                    <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                        {chartData[chartData.length - 1]?.time}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}
