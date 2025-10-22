'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    Send as SendIcon,
    Shield as ShieldIcon,
    Description as FileTextIcon,
    SmartToy as BotIcon,
    Person as UserIcon,
} from '@mui/icons-material'
import {
    Button,
    Card,
    CardOverflow,
    Input,
    Avatar,
    AvatarFallback,
    Badge,
    Divider,
    Box,
    Typography,
    Alert,
    AlertDescription,
    AccordionGroup,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip,
    CircularProgress,
} from '@/components/ui/joy'

interface Message {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: Date
    contexts?: Array<{
        docId: string
        classification: string
        score: number
    }>
    citations?: Array<{
        docId: string
        source?: string
    }>
}

interface ChatInterfaceProps {
    jwt: string
    role: string
}

export default function ChatInterface({ jwt, role }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content:
                "Hello! I'm your secure AI assistant. I have access to your organization's knowledge base and will only provide information based on your access level. How can I help you today?",
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages, scrollToBottom])

    const handleSend = useCallback(async () => {
        if (!input.trim() || loading) {return}

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    message: input.trim(),
                    role,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to send message')
            }

            const data = await response.json()

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
                contexts: data.contexts,
                citations: data.citations,
            }

            setMessages((prev) => [...prev, assistantMessage])
        } catch (error) {
            console.error('Error sending message:', error)
            const errorMessage: Message = {
                id: (Date.now() + 2).toString(),
                role: 'system',
                content:
                    'Sorry, I encountered an error processing your request. Please try again.',
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setLoading(false)
        }
    }, [input, loading, jwt, role])

    return (
        <Card
            variant="outlined"
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '4px solid',
                borderColor: 'primary.outlinedBorder',
                bgcolor: 'background.surface',
                boxShadow: 'xl',
            }}
        >
            {/* Header */}
            <CardOverflow
                sx={{
                    borderBottom: '2px solid',
                    borderColor: 'primary.outlinedBorder',
                    bgcolor: 'background.level1',
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Avatar
                            size="lg"
                            sx={{
                                border: '2px solid',
                                borderColor: 'primary.outlinedBorder',
                            }}
                        >
                            <AvatarFallback>
                                <ShieldIcon />
                            </AvatarFallback>
                        </Avatar>
                        <Box>
                            <Typography
                                level="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'primary.main',
                                }}
                            >
                                Governed Chat
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mt: 1,
                                }}
                            >
                                <Badge variant="soft" color="primary">
                                    {role}
                                </Badge>
                                <Badge variant="outlined" color="primary">
                                    <ShieldIcon
                                        sx={{ fontSize: 14, mr: 0.5 }}
                                    />
                                    Secure
                                </Badge>
                            </Box>
                        </Box>
                    </Box>

                    {/* Security Alert */}
                    <Alert variant="soft" color="primary" sx={{ mt: 2 }}>
                        <ShieldIcon />
                        <AlertDescription>
                            All conversations are logged and monitored for
                            compliance with access policies.
                        </AlertDescription>
                    </Alert>
                </Box>
            </CardOverflow>

            {/* Messages Container */}
            <Box
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                {messages.map((message) => (
                    <Box
                        key={message.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 3,
                            justifyContent:
                                message.role === 'user'
                                    ? 'flex-end'
                                    : 'flex-start',
                        }}
                    >
                        {/* Avatar */}
                        <Avatar
                            size="md"
                            sx={{
                                border: '2px solid',
                                borderColor:
                                    message.role === 'user'
                                        ? 'primary.outlinedBorder'
                                        : 'neutral.outlinedBorder',
                            }}
                        >
                            <AvatarFallback>
                                {message.role === 'user' ? (
                                    <UserIcon />
                                ) : (
                                    <BotIcon />
                                )}
                            </AvatarFallback>
                        </Avatar>

                        {/* Message Bubble */}
                        <Box
                            sx={{
                                maxWidth: '85%',
                                p: 3,
                                borderRadius: 'lg',
                                border: '2px solid',
                                borderColor:
                                    message.role === 'user'
                                        ? 'primary.outlinedBorder'
                                        : 'neutral.outlinedBorder',
                                bgcolor:
                                    message.role === 'user'
                                        ? 'primary.softBg'
                                        : 'background.level1',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: 'md',
                                },
                            }}
                        >
                            {/* Message Header */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Badge
                                        variant={
                                            message.role === 'user'
                                                ? 'solid'
                                                : 'soft'
                                        }
                                        color={
                                            message.role === 'user'
                                                ? 'primary'
                                                : 'neutral'
                                        }
                                    >
                                        {message.role === 'user'
                                            ? 'You'
                                            : message.role === 'system'
                                              ? 'System'
                                              : 'Assistant'}
                                    </Badge>
                                    {message.role === 'assistant' && (
                                        <Badge
                                            variant="outlined"
                                            color="primary"
                                        >
                                            <ShieldIcon
                                                sx={{ fontSize: 12, mr: 0.5 }}
                                            />
                                            Verified
                                        </Badge>
                                    )}
                                </Box>
                                <Typography
                                    level="body-xs"
                                    sx={{
                                        color: 'text.tertiary',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {message.timestamp.toLocaleTimeString()}
                                </Typography>
                            </Box>

                            {/* Message Content */}
                            <Typography
                                level="body-sm"
                                sx={{ lineHeight: 1.6 }}
                            >
                                {message.content}
                            </Typography>

                            {/* Context Tags */}
                            {message.role === 'assistant' &&
                                message.contexts &&
                                message.contexts.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                mb: 1,
                                            }}
                                        >
                                            <FileTextIcon
                                                sx={{
                                                    fontSize: 16,
                                                    color: 'primary.main',
                                                }}
                                            />
                                            <Typography
                                                level="body-xs"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: 'text.tertiary',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em',
                                                }}
                                            >
                                                Knowledge Sources
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 1,
                                            }}
                                        >
                                            {message.contexts.map(
                                                (ctx, idx) => (
                                                    <Tooltip
                                                        key={idx}
                                                        title={
                                                            <Box sx={{ p: 1 }}>
                                                                <Typography
                                                                    level="body-sm"
                                                                    sx={{
                                                                        fontWeight:
                                                                            'bold',
                                                                    }}
                                                                >
                                                                    {ctx.docId}
                                                                </Typography>
                                                                <Box
                                                                    sx={{
                                                                        display:
                                                                            'flex',
                                                                        alignItems:
                                                                            'center',
                                                                        gap: 1,
                                                                        mt: 1,
                                                                    }}
                                                                >
                                                                    <Badge
                                                                        variant="soft"
                                                                        color={
                                                                            ctx.classification ===
                                                                            'confidential'
                                                                                ? 'danger'
                                                                                : 'primary'
                                                                        }
                                                                    >
                                                                        {
                                                                            ctx.classification
                                                                        }
                                                                    </Badge>
                                                                    <Typography
                                                                        level="body-xs"
                                                                        sx={{
                                                                            color: 'text.tertiary',
                                                                        }}
                                                                    >
                                                                        Relevance:{' '}
                                                                        {Math.round(
                                                                            ctx.score *
                                                                                100
                                                                        )}
                                                                        %
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        }
                                                    >
                                                        <Badge
                                                            variant="outlined"
                                                            color={
                                                                ctx.classification ===
                                                                'confidential'
                                                                    ? 'danger'
                                                                    : 'primary'
                                                            }
                                                            sx={{
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <FileTextIcon
                                                                sx={{
                                                                    fontSize: 12,
                                                                    mr: 0.5,
                                                                }}
                                                            />
                                                            {ctx.docId}
                                                        </Badge>
                                                    </Tooltip>
                                                )
                                            )}
                                        </Box>
                                    </Box>
                                )}

                            {/* Citations Section */}
                            {message.citations &&
                                message.citations.length > 0 && (
                                    <Box sx={{ mt: 3 }}>
                                        <Divider sx={{ mb: 2 }} />
                                        <AccordionGroup>
                                            <Accordion>
                                                <AccordionSummary>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            gap: 1,
                                                        }}
                                                    >
                                                        <ShieldIcon
                                                            sx={{
                                                                fontSize: 16,
                                                                color: 'primary.main',
                                                            }}
                                                        />
                                                        <Typography
                                                            level="body-xs"
                                                            sx={{
                                                                fontWeight:
                                                                    'bold',
                                                                color: 'text.tertiary',
                                                                textTransform:
                                                                    'uppercase',
                                                                letterSpacing:
                                                                    '0.1em',
                                                            }}
                                                        >
                                                            {
                                                                message
                                                                    .citations
                                                                    .length
                                                            }{' '}
                                                            Verified Source
                                                            {message.citations
                                                                .length > 1
                                                                ? 's'
                                                                : ''}
                                                        </Typography>
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                            gap: 1,
                                                        }}
                                                    >
                                                        {message.citations.map(
                                                            (citation, idx) => (
                                                                <Tooltip
                                                                    key={idx}
                                                                    title={
                                                                        <>
                                                                            <Typography
                                                                                level="body-sm"
                                                                                sx={{
                                                                                    fontWeight:
                                                                                        'bold',
                                                                                }}
                                                                            >
                                                                                {
                                                                                    citation.docId
                                                                                }
                                                                            </Typography>
                                                                            <Typography
                                                                                level="body-xs"
                                                                                sx={{
                                                                                    color: 'text.tertiary',
                                                                                    mt: 0.5,
                                                                                }}
                                                                            >
                                                                                Click
                                                                                to
                                                                                view
                                                                                source
                                                                                details
                                                                            </Typography>
                                                                        </>
                                                                    }
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            p: 2,
                                                                            borderRadius:
                                                                                'md',
                                                                            border: '1px solid',
                                                                            borderColor:
                                                                                'primary.outlinedBorder',
                                                                            bgcolor:
                                                                                'background.level1',
                                                                            cursor: 'pointer',
                                                                            transition:
                                                                                'all 0.3s ease',
                                                                            '&:hover':
                                                                                {
                                                                                    borderColor:
                                                                                        'primary.main',
                                                                                },
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            level="body-xs"
                                                                            sx={{
                                                                                fontWeight:
                                                                                    'medium',
                                                                            }}
                                                                        >
                                                                            {citation.source ??
                                                                                citation.docId}
                                                                        </Typography>
                                                                    </Box>
                                                                </Tooltip>
                                                            )
                                                        )}
                                                    </Box>
                                                </AccordionDetails>
                                            </Accordion>
                                        </AccordionGroup>
                                    </Box>
                                )}
                        </Box>
                    </Box>
                ))}

                {/* Loading State */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Box
                            sx={{
                                p: 3,
                                borderRadius: 'lg',
                                border: '2px solid',
                                borderColor: 'neutral.outlinedBorder',
                                bgcolor: 'background.level1',
                                maxWidth: '85%',
                                boxShadow: 'md',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <Avatar
                                    size="sm"
                                    sx={{
                                        border: '2px solid',
                                        borderColor: 'primary.outlinedBorder',
                                    }}
                                >
                                    <BotIcon />
                                </Avatar>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <CircularProgress size="sm" />
                                    <Typography
                                        level="body-sm"
                                        sx={{
                                            color: 'text.tertiary',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Thinking...
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Section */}
            <CardOverflow
                sx={{
                    borderTop: '2px solid',
                    borderColor: 'primary.outlinedBorder',
                    bgcolor: 'background.level1',
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === 'Enter' && !e.shiftKey && handleSend()
                            }
                            placeholder="Ask me anything about your organization's knowledge base..."
                            disabled={loading}
                            sx={{
                                flex: 1,
                                height: 56,
                                fontSize: 'lg',
                                border: '4px solid',
                                borderColor: 'primary.outlinedBorder',
                                bgcolor: 'background.surface',
                                '&:focus': {
                                    borderColor: 'primary.main',
                                },
                            }}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            size="lg"
                            variant="solid"
                            color="primary"
                            sx={{
                                minHeight: 56,
                                px: 3,
                            }}
                        >
                            {loading ? (
                                <CircularProgress size="sm" />
                            ) : (
                                <SendIcon />
                            )}
                        </Button>
                    </Box>
                </Box>
            </CardOverflow>
        </Card>
    )
}
