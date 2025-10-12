'use client'

import * as React from 'react'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import Box from '@mui/joy/Box'
import Chip from '@mui/joy/Chip'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import {
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
} from '@mui/icons-material'

interface ErrorEvent {
    id: string
    type: 'error' | 'warning' | 'info'
    message: string
    source: string
    timestamp: string
}

const mockErrors: ErrorEvent[] = [
    {
        id: '1',
        type: 'error',
        message: 'Failed to retrieve document: timeout exceeded',
        source: 'retriever-agent',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: '2',
        type: 'warning',
        message: 'High latency detected in vector search',
        source: 'search-service',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
        id: '3',
        type: 'info',
        message: 'Query complexity analysis completed',
        source: 'query-analyzer',
        timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    },
    {
        id: '4',
        type: 'warning',
        message: 'Document classification confidence below threshold',
        source: 'classifier-agent',
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
    {
        id: '5',
        type: 'error',
        message: 'Failed to connect to vector database',
        source: 'database-connection',
        timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    },
]

export default function ErrorTimeline() {
    const [events] = React.useState<ErrorEvent[]>(mockErrors)

    const getEventColor = (type: ErrorEvent['type']) => {
        switch (type) {
            case 'error':
                return 'danger'
            case 'warning':
                return 'warning'
            case 'info':
                return 'primary'
            default:
                return 'neutral'
        }
    }

    const getEventIcon = (type: ErrorEvent['type']) => {
        switch (type) {
            case 'error':
                return <ErrorIcon />
            case 'warning':
                return <WarningIcon />
            case 'info':
                return <InfoIcon />
            default:
                return null
        }
    }

    return (
        <Card>
            <CardContent>
                <Typography level="title-md" sx={{ mb: 2 }}>
                    Event Timeline
                </Typography>

                <List sx={{ '--List-gap': '16px' }}>
                    {events.map((event) => (
                        <ListItem key={event.id}>
                            <ListItemDecorator>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 'sm',
                                        bgcolor: `${getEventColor(event.type)}.softBg`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: `${getEventColor(event.type)}.solidBg`,
                                    }}
                                >
                                    {getEventIcon(event.type)}
                                </Box>
                            </ListItemDecorator>
                            <Box sx={{ flex: 1 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        mb: 0.5,
                                    }}
                                >
                                    <Chip
                                        size="sm"
                                        variant="soft"
                                        color={getEventColor(event.type)}
                                    >
                                        {event.type}
                                    </Chip>
                                    <Typography
                                        level="body-xs"
                                        sx={{ color: 'text.tertiary' }}
                                    >
                                        {new Date(
                                            event.timestamp
                                        ).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Typography level="body-sm" sx={{ mb: 0.5 }}>
                                    {event.message}
                                </Typography>
                                <Typography
                                    level="body-xs"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Source: {event.source}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))}
                </List>

                {events.length === 0 && (
                    <Typography
                        level="body-sm"
                        sx={{
                            textAlign: 'center',
                            py: 4,
                            color: 'text.secondary',
                        }}
                    >
                        No events in the timeline
                    </Typography>
                )}
            </CardContent>
        </Card>
    )
}
