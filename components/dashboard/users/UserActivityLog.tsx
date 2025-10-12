'use client'

import * as React from 'react'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'
import Chip from '@mui/joy/Chip'
import Box from '@mui/joy/Box'

/**
 * Activity Event Type
 */
interface ActivityEvent {
    id: string
    type: 'login' | 'logout' | 'query' | 'document_access' | 'role_change'
    description: string
    timestamp: string
    metadata?: Record<string, unknown>
}

/**
 * UserActivityLog Props
 */
interface UserActivityLogProps {
    userId: string
}

/**
 * UserActivityLog Component
 *
 * Timeline of user activity events.
 */
export default function UserActivityLog({ userId }: UserActivityLogProps) {
    const [events, setEvents] = React.useState<ActivityEvent[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await fetch(`/api/users/${userId}/activity`)
                if (!response.ok) {
                    throw new Error('Failed to fetch activity')
                }

                const data = (await response.json()) as {
                    events: ActivityEvent[]
                }
                setEvents(data.events)
            } catch {
                // Error handled silently
            } finally {
                setLoading(false)
            }
        }

        void fetchActivity()
    }, [userId])

    const getEventColor = (type: string) => {
        const colors: Record<
            string,
            'primary' | 'success' | 'warning' | 'neutral'
        > = {
            login: 'success',
            logout: 'neutral',
            query: 'primary',
            document_access: 'primary',
            role_change: 'warning',
        }
        return colors[type] ?? 'neutral'
    }

    return (
        <Card>
            <CardContent>
                <Typography level="title-md" sx={{ mb: 2 }}>
                    Activity Log
                </Typography>

                {loading ? (
                    <Typography
                        level="body-sm"
                        sx={{ py: 4, textAlign: 'center' }}
                    >
                        Loading activity...
                    </Typography>
                ) : events.length === 0 ? (
                    <Typography
                        level="body-sm"
                        sx={{ py: 4, textAlign: 'center' }}
                    >
                        No activity recorded
                    </Typography>
                ) : (
                    <Stack spacing={2}>
                        {events.map((event) => (
                            <Box
                                key={event.id}
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    p: 2,
                                    borderRadius: 'sm',
                                    bgcolor: 'background.level1',
                                }}
                            >
                                <Box sx={{ flexShrink: 0 }}>
                                    <Chip
                                        size="sm"
                                        variant="soft"
                                        color={getEventColor(event.type)}
                                    >
                                        {event.type.replace('_', ' ')}
                                    </Chip>
                                </Box>
                                <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                                    <Typography level="body-sm">
                                        {event.description}
                                    </Typography>
                                    <Typography
                                        level="body-xs"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        {new Date(
                                            event.timestamp
                                        ).toLocaleString()}
                                    </Typography>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    )
}
