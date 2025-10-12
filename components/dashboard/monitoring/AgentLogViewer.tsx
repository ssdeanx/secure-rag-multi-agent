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
import {
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material'

interface AgentLog {
    id: string
    agentName: string
    operation: string
    status: 'success' | 'error' | 'running'
    duration: number
    timestamp: string
}

const mockLogs: AgentLog[] = [
    {
        id: '1',
        agentName: 'orchestrator',
        operation: 'Route query',
        status: 'success',
        duration: 234,
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: '2',
        agentName: 'security-analyzer',
        operation: 'Validate access',
        status: 'success',
        duration: 156,
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
        id: '3',
        agentName: 'query-router',
        operation: 'Determine intent',
        status: 'success',
        duration: 342,
        timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    },
    {
        id: '4',
        agentName: 'retriever',
        operation: 'Search documents',
        status: 'error',
        duration: 1203,
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
    {
        id: '5',
        agentName: 'verifier',
        operation: 'Check compliance',
        status: 'success',
        duration: 445,
        timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    },
]

export default function AgentLogViewer() {
    const [logs] = React.useState<AgentLog[]>(mockLogs)
    const [searchQuery, setSearchQuery] = React.useState('')
    const [statusFilter, setStatusFilter] = React.useState<string>('all')

    const filteredLogs = logs.filter((log) => {
        const matchesSearch =
            log.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.operation.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus =
            statusFilter === 'all' || log.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status: AgentLog['status']) => {
        switch (status) {
            case 'success':
                return 'success'
            case 'error':
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
                    placeholder="Search agent or operation..."
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
                    <Option value="success">Success</Option>
                    <Option value="error">Error</Option>
                    <Option value="running">Running</Option>
                </Select>
            </Box>

            {/* Logs Table */}
            <Sheet sx={{ overflow: 'auto' }}>
                <Table aria-label="agent logs table" stickyHeader>
                    <thead>
                        <tr>
                            <th>Agent</th>
                            <th>Operation</th>
                            <th>Status</th>
                            <th>Duration</th>
                            <th>Timestamp</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.length === 0 ? (
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
                                        No logs found
                                    </Typography>
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.map((log) => (
                                <tr key={log.id}>
                                    <td>
                                        <Typography
                                            level="body-sm"
                                            fontWeight="md"
                                        >
                                            {log.agentName}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {log.operation}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            color={getStatusColor(log.status)}
                                        >
                                            {log.status}
                                        </Chip>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {log.duration}ms
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-sm">
                                            {new Date(
                                                log.timestamp
                                            ).toLocaleString()}
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
