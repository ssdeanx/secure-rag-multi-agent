'use client'

import * as React from 'react'
import Card from '@mui/joy/Card'
import Table from '@mui/joy/Table'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import Chip from '@mui/joy/Chip'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import Input from '@mui/joy/Input'
import Box from '@mui/joy/Box'
import IconButton from '@mui/joy/IconButton'
import LinearProgress from '@mui/joy/LinearProgress'
import {
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material'

interface WorkflowTrace {
    id: string
    workflowName: string
    status: 'completed' | 'running' | 'failed'
    progress: number
    startTime: string
    duration?: number
}

const mockTraces: WorkflowTrace[] = [
    {
        id: '1',
        workflowName: 'governed-rag-query',
        status: 'completed',
        progress: 100,
        startTime: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        duration: 2345,
    },
    {
        id: '2',
        workflowName: 'governed-rag-index',
        status: 'running',
        progress: 67,
        startTime: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    },
    {
        id: '3',
        workflowName: 'governed-rag-query',
        status: 'completed',
        progress: 100,
        startTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        duration: 1876,
    },
    {
        id: '4',
        workflowName: 'governed-rag-query',
        status: 'failed',
        progress: 45,
        startTime: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
        duration: 5432,
    },
    {
        id: '5',
        workflowName: 'governed-rag-index',
        status: 'completed',
        progress: 100,
        startTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        duration: 45678,
    },
]

export default function WorkflowTraceViewer() {
    const [traces] = React.useState<WorkflowTrace[]>(mockTraces)
    const [searchQuery, setSearchQuery] = React.useState('')
    const [statusFilter, setStatusFilter] = React.useState<string>('all')

    const filteredTraces = traces.filter((trace) => {
        const matchesSearch = trace.workflowName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        const matchesStatus =
            statusFilter === 'all' || trace.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status: WorkflowTrace['status']) => {
        switch (status) {
            case 'completed':
                return 'success'
            case 'failed':
                return 'danger'
            case 'running':
                return 'primary'
            default:
                return 'neutral'
        }
    }

    return (
        <Card>
            {/* Filters */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                }}
            >
                <Input
                    placeholder="Search workflow..."
                    startDecorator={<SearchIcon />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ flexGrow: 1 }}
                />
                <Select
                    placeholder="Filter by status"
                    startDecorator={<FilterListIcon />}
                    value={statusFilter}
                    onChange={(_, value) => setStatusFilter(value as string)}
                    sx={{ minWidth: 200 }}
                >
                    <Option value="all">All Status</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="running">Running</Option>
                    <Option value="failed">Failed</Option>
                </Select>
            </Box>

            {/* Traces Table */}
            <Sheet sx={{ overflow: 'auto' }}>
                <Table aria-label="workflow traces table" stickyHeader>
                    <thead>
                        <tr>
                            <th>Workflow</th>
                            <th>Status</th>
                            <th>Progress</th>
                            <th>Start Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTraces.length === 0 ? (
                            <tr>
                                <td colSpan={6}>
                                    <Typography
                                        level="body-sm"
                                        sx={{
                                            textAlign: 'center',
                                            py: 4,
                                            color: 'text.secondary',
                                        }}
                                    >
                                        No workflow traces found
                                    </Typography>
                                </td>
                            </tr>
                        ) : (
                            filteredTraces.map((trace) => (
                                <tr key={trace.id}>
                                    <td>
                                        <Typography
                                            level="body-sm"
                                            fontWeight="md"
                                        >
                                            {trace.workflowName}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            color={getStatusColor(trace.status)}
                                        >
                                            {trace.status}
                                        </Chip>
                                    </td>
                                    <td>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <LinearProgress
                                                determinate
                                                value={trace.progress}
                                                size="sm"
                                                sx={{ flexGrow: 1 }}
                                                color={getStatusColor(
                                                    trace.status
                                                )}
                                            />
                                            <Typography level="body-xs">
                                                {trace.progress}%
                                            </Typography>
                                        </Box>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {new Date(
                                                trace.startTime
                                            ).toLocaleString()}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {typeof trace.duration ===
                                                'number' && trace.duration > 0
                                                ? `${(trace.duration / 1000).toFixed(1)}s`
                                                : '-'}
                                        </Typography>
                                    </td>
                                    <td>
                                        <IconButton
                                            size="sm"
                                            variant="plain"
                                            color="neutral"
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Sheet>
        </Card>
    )
}
