import React from 'react'
import { useState, useCallback } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    Badge,
    Alert,
    AlertDescription,
    LinearProgress,
    Divider,
    Avatar,
    AvatarFallback,
    Tooltip,
    AccordionGroup,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Typography,
    Button,
} from '@/components/ui/joy'
import {
    Dataset as DatabaseIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Warning as WarningIcon,
    Description,
    Security,
} from '@mui/icons-material'
import { CircularProgress } from '@mui/material'

interface IndexingPanelProps {
    jwt: string
}

interface IndexingResult {
    success: boolean
    indexed: number
    failed: number
    totalDocuments?: number
    progress?: number
    documents: Array<{
        docId: string
        status: string
        chunks?: number
        error?: string
        classification?: string
        size?: number
    }>
}

export default function IndexingPanel({ jwt }: IndexingPanelProps) {
    const [isIndexing, setIsIndexing] = useState(false)
    const [result, setResult] = useState<IndexingResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set()
    )

    const handleIndex = useCallback(async () => {
        setIsIndexing(true)
        setResult(null)
        setError(null)
        setProgress(0)

        try {
            const response: Response = await fetch('/api/index', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jwt }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to start indexing')
            }

            // Simulate progress updates
            const progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return 90
                    }
                    return prev + Math.random() * 15
                })
            }, 500)

            // Complete progress when done
            setTimeout(() => {
                setProgress(100)
                clearInterval(progressInterval)
            }, 2000)

            setResult(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            setProgress(0)
        } finally {
            setIsIndexing(false)
        }
    }, [jwt])

    const toggleSection = useCallback((section: string) => {
        setExpandedSections((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(section)) {
                newSet.delete(section)
            } else {
                newSet.add(section)
            }
            return newSet
        })
    }, [])

    return (
        <Card
                variant="outlined"
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    border: '4px solid',
                    borderColor: 'primary.softBg',
                    bgcolor: 'background.surface',
                    boxShadow: 'xl',
                }}
            >
                {/* Background decorative elements */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 96,
                        height: 96,
                        bgcolor: 'primary.softBg',
                        borderRadius: '50%',
                        filter: 'blur(30px)',
                        animation: 'pulse 2s ease-in-out infinite',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: 64,
                        height: 64,
                        bgcolor: 'warning.softBg',
                        borderRadius: '50%',
                        filter: 'blur(25px)',
                        animation: 'pulse 2s ease-in-out infinite',
                    }}
                />

                <CardHeader sx={{ pb: 3 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
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
                                size="lg"
                                sx={{
                                    border: '2px solid',
                                    borderColor: 'primary.outlinedBorder',
                                }}
                            >
                                <AvatarFallback>
                                    <DatabaseIcon />
                                </AvatarFallback>
                            </Avatar>
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 'xl',
                                    bgcolor: 'primary.softBg',
                                    border: '2px solid',
                                    borderColor: 'primary.outlinedBorder',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: 'primary.softBg',
                                        borderColor: 'primary.main',
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                <DatabaseIcon
                                    sx={{ fontSize: 28, color: 'primary.main' }}
                                />
                            </Box>
                            <Box>
                                <Typography
                                    level="title-lg"
                                    sx={{ fontWeight: 'bold', mb: 0.5 }}
                                >
                                    Document Indexing
                                </Typography>
                                <Typography
                                    level="body-md"
                                    sx={{ color: 'text.tertiary' }}
                                >
                                    Index corpus documents for RAG
                                </Typography>
                            </Box>
                        </Box>

                        <Tooltip
                            title={
                                <Typography level="body-sm">
                                    Index all documents in the corpus with
                                    security classifications
                                </Typography>
                            }
                        >
                            <Box>
                                <Button
                                    onClick={handleIndex}
                                    disabled={isIndexing}
                                    size="lg"
                                    startDecorator={
                                        isIndexing ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            <DatabaseIcon
                                                sx={{ fontSize: 20 }}
                                            />
                                        )
                                    }
                                    sx={{
                                        minHeight: 48,
                                        px: 3,
                                        border: '2px solid',
                                        borderColor:
                                            'primary.outlinedBorder',
                                        bgcolor: 'background.surface',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            transform: 'translateY(-1px)',
                                            boxShadow: 'lg',
                                        },
                                        '&:disabled': {
                                            opacity: 0.5,
                                            cursor: 'not-allowed',
                                        },
                                    }}
                                >
                                    {isIndexing
                                        ? 'Indexing...'
                                        : 'Start Indexing'}
                                </Button>
                            </Box>
                        </Tooltip>
                    </Box>

                    {/* Progress Bar */}
                    {(isIndexing || progress > 0) && (
                        <Box sx={{ mt: 2 }}>
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
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'text.tertiary',
                                    }}
                                >
                                    Indexing Progress
                                </Typography>
                                <Badge variant="soft" color="neutral">
                                    {Math.round(progress)}%
                                </Badge>
                            </Box>
                            <LinearProgress
                                value={progress}
                                color="primary"
                                size="lg"
                            />
                        </Box>
                    )}
                </CardHeader>

                <CardContent>
                    {/* Error State */}
                    {error && (
                        <Alert
                            variant="soft"
                            color="danger"
                            sx={{
                                mb: 3,
                                border: '2px solid',
                                borderColor: 'danger.outlinedBorder',
                                bgcolor: 'danger.softBg',
                            }}
                        >
                            <CancelIcon />
                            <AlertDescription>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        Error: {error}
                                    </Typography>
                                    <Badge variant="soft" color="danger">
                                        Failed
                                    </Badge>
                                </Box>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Success Result */}
                    {result && (
                        <Box sx={{ mb: 3 }}>
                            <Alert
                                variant="soft"
                                color="success"
                                sx={{
                                    border: '2px solid',
                                    borderColor: 'success.outlinedBorder',
                                    bgcolor: 'success.softBg',
                                }}
                            >
                                <CheckCircleIcon />
                                <AlertDescription>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            Indexing completed successfully
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <Badge
                                                variant="soft"
                                                color="success"
                                            >
                                                {result.indexed} indexed
                                            </Badge>
                                            {result.failed > 0 && (
                                                <Badge
                                                    variant="soft"
                                                    color="danger"
                                                >
                                                    {result.failed} failed
                                                </Badge>
                                            )}
                                        </Box>
                                    </Box>
                                </AlertDescription>
                            </Alert>

                            {/* Document Results */}
                            {result.documents.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Divider sx={{ my: 2 }} />
                                    <AccordionGroup>
                                        <Accordion
                                            expanded={expandedSections.has(
                                                'documents'
                                            )}
                                            onChange={() =>
                                                toggleSection('documents')
                                            }
                                        >
                                            <AccordionSummary>
                                                <Typography
                                                    level="title-md"
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    Document Results (
                                                    {result.documents.length})
                                                </Typography>
                                                <Badge
                                                    variant="outlined"
                                                    color="neutral"
                                                >
                                                    {expandedSections.has(
                                                        'documents'
                                                    )
                                                        ? 'Collapse'
                                                        : 'Expand'}
                                                </Badge>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Box
                                                    sx={{
                                                        maxHeight: 240,
                                                        overflow: 'auto',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 1,
                                                    }}
                                                >
                                                    {result.documents.map(
                                                        (doc, index) => (
                                                            <Tooltip
                                                                key={index}
                                                                title={
                                                                    <Box
                                                                        sx={{
                                                                            maxWidth: 320,
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            level="title-sm"
                                                                            sx={{
                                                                                fontWeight:
                                                                                    'bold',
                                                                                mb: 1,
                                                                            }}
                                                                        >
                                                                            {
                                                                                doc.docId
                                                                            }
                                                                        </Typography>
                                                                        <Box
                                                                            sx={{
                                                                                display:
                                                                                    'flex',
                                                                                alignItems:
                                                                                    'center',
                                                                                gap: 1,
                                                                                mb: 1,
                                                                            }}
                                                                        >
                                                                            <Badge
                                                                                variant="soft"
                                                                                color={
                                                                                    doc.status ===
                                                                                    'success'
                                                                                        ? 'success'
                                                                                        : 'danger'
                                                                                }
                                                                            >
                                                                                {
                                                                                    doc.status
                                                                                }
                                                                            </Badge>
                                                                            {doc.classification && (
                                                                                <Badge
                                                                                    variant="soft"
                                                                                    color={
                                                                                        doc.classification ===
                                                                                        'confidential'
                                                                                            ? 'danger'
                                                                                            : 'neutral'
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        doc.classification
                                                                                    }
                                                                                </Badge>
                                                                            )}
                                                                        </Box>
                                                                        {doc.chunks && (
                                                                            <Typography
                                                                                level="body-sm"
                                                                                sx={{
                                                                                    color: 'text.tertiary',
                                                                                    mb: 1,
                                                                                }}
                                                                            >
                                                                                Indexed
                                                                                into{' '}
                                                                                {
                                                                                    doc.chunks
                                                                                }{' '}
                                                                                chunks
                                                                            </Typography>
                                                                        )}
                                                                        {doc.error && (
                                                                            <Typography
                                                                                level="body-sm"
                                                                                sx={{
                                                                                    color: 'danger.main',
                                                                                    mb: 1,
                                                                                }}
                                                                            >
                                                                                Error:{' '}
                                                                                {
                                                                                    doc.error
                                                                                }
                                                                            </Typography>
                                                                        )}
                                                                        {doc.size && (
                                                                            <Typography
                                                                                level="body-sm"
                                                                                sx={{
                                                                                    color: 'text.tertiary',
                                                                                }}
                                                                            >
                                                                                Size:{' '}
                                                                                {
                                                                                    doc.size
                                                                                }{' '}
                                                                                KB
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                }
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display:
                                                                            'flex',
                                                                        alignItems:
                                                                            'center',
                                                                        justifyContent:
                                                                            'space-between',
                                                                        p: 2,
                                                                        border: '2px solid',
                                                                        borderRadius:
                                                                            'md',
                                                                        cursor: 'pointer',
                                                                        transition:
                                                                            'all 0.3s ease',
                                                                        borderColor:
                                                                            doc.status ===
                                                                            'success'
                                                                                ? 'success.outlinedBorder'
                                                                                : 'danger.outlinedBorder',
                                                                        bgcolor:
                                                                            doc.status ===
                                                                            'success'
                                                                                ? 'success.softBg'
                                                                                : 'danger.softBg',
                                                                        '&:hover':
                                                                            {
                                                                                borderColor:
                                                                                    doc.status ===
                                                                                    'success'
                                                                                        ? 'success.main'
                                                                                        : 'danger.main',
                                                                                transform:
                                                                                    'translateY(-1px)',
                                                                            },
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            display:
                                                                                'flex',
                                                                            alignItems:
                                                                                'center',
                                                                            gap: 1.5,
                                                                        }}
                                                                    >
                                                                        <Avatar size="sm">
                                                                            <AvatarFallback>
                                                                                {doc.status ===
                                                                                'success' ? (
                                                                                    <CheckCircleIcon />
                                                                                ) : (
                                                                                    <CancelIcon />
                                                                                )}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <Box>
                                                                            <Typography
                                                                                level="body-sm"
                                                                                sx={{
                                                                                    fontWeight:
                                                                                        'bold',
                                                                                    mb: 0.5,
                                                                                }}
                                                                            >
                                                                                {
                                                                                    doc.docId
                                                                                }
                                                                            </Typography>
                                                                            {doc.classification && (
                                                                                <Badge
                                                                                    variant="soft"
                                                                                    color={
                                                                                        doc.classification ===
                                                                                        'confidential'
                                                                                            ? 'danger'
                                                                                            : 'neutral'
                                                                                    }
                                                                                    size="sm"
                                                                                >
                                                                                    {
                                                                                        doc.classification
                                                                                    }
                                                                                </Badge>
                                                                            )}
                                                                        </Box>
                                                                    </Box>
                                                                    <Box
                                                                        sx={{
                                                                            textAlign:
                                                                                'right',
                                                                        }}
                                                                    >
                                                                        {doc.status ===
                                                                            'success' &&
                                                                        doc.chunks ? (
                                                                            <Box
                                                                                sx={{
                                                                                    display:
                                                                                        'flex',
                                                                                    alignItems:
                                                                                        'center',
                                                                                    gap: 0.5,
                                                                                    color: 'success.main',
                                                                                }}
                                                                            >
                                                                                <Description />
                                                                                <Typography
                                                                                    level="body-sm"
                                                                                    sx={{
                                                                                        fontWeight:
                                                                                            'bold',
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        doc.chunks
                                                                                    }{' '}
                                                                                    chunks
                                                                                </Typography>
                                                                            </Box>
                                                                        ) : doc.error ? (
                                                                            <Typography
                                                                                level="body-xs"
                                                                                sx={{
                                                                                    fontWeight:
                                                                                        'bold',
                                                                                    color: 'danger.main',
                                                                                }}
                                                                            >
                                                                                Failed
                                                                            </Typography>
                                                                        ) : (
                                                                            <Badge
                                                                                variant="outlined"
                                                                                size="sm"
                                                                            >
                                                                                {
                                                                                    doc.status
                                                                                }
                                                                            </Badge>
                                                                        )}
                                                                        {doc.size && (
                                                                            <Typography
                                                                                level="body-xs"
                                                                                sx={{
                                                                                    color: 'text.tertiary',
                                                                                    mt: 0.5,
                                                                                }}
                                                                            >
                                                                                {
                                                                                    doc.size
                                                                                }{' '}
                                                                                KB
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
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
                    )}

                    {/* Information Section */}
                    <Divider sx={{ my: 3 }} />
                    <AccordionGroup>
                        <Accordion
                            expanded={expandedSections.has('info')}
                            onChange={() => toggleSection('info')}
                        >
                            <AccordionSummary>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                    }}
                                >
                                    <WarningIcon
                                        sx={{
                                            fontSize: 20,
                                            color: 'warning.main',
                                        }}
                                    />
                                    <Typography
                                        level="body-md"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Security Information
                                    </Typography>
                                </Box>
                                <Badge variant="outlined" color="neutral">
                                    {expandedSections.has('info')
                                        ? 'Hide'
                                        : 'Show'}
                                </Badge>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Alert
                                    variant="soft"
                                    color="primary"
                                    sx={{
                                        border: '2px solid',
                                        borderColor: 'primary.outlinedBorder',
                                        bgcolor: 'primary.softBg',
                                    }}
                                >
                                    <Security />
                                    <AlertDescription>
                                        <Typography
                                            level="body-md"
                                            sx={{ fontWeight: 'bold', mb: 2 }}
                                        >
                                            This will index all documents in the
                                            corpus folder with appropriate
                                            security classifications:
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    p: 1.5,
                                                    borderRadius: 'md',
                                                    bgcolor: 'danger.softBg',
                                                    border: '1px solid',
                                                    borderColor:
                                                        'danger.outlinedBorder',
                                                }}
                                            >
                                                <Security
                                                    sx={{
                                                        fontSize: 16,
                                                        color: 'danger.main',
                                                    }}
                                                />
                                                <Box>
                                                    <Badge
                                                        variant="soft"
                                                        color="danger"
                                                        sx={{ mb: 0.5 }}
                                                    >
                                                        HR/Confidential files
                                                    </Badge>
                                                    <Typography
                                                        level="body-xs"
                                                        sx={{
                                                            color: 'text.tertiary',
                                                        }}
                                                    >
                                                        Admin access only
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    p: 1.5,
                                                    borderRadius: 'md',
                                                    bgcolor: 'primary.softBg',
                                                    border: '1px solid',
                                                    borderColor:
                                                        'primary.outlinedBorder',
                                                }}
                                            >
                                                <Security
                                                    sx={{
                                                        fontSize: 16,
                                                        color: 'primary.main',
                                                    }}
                                                />
                                                <Box>
                                                    <Badge
                                                        variant="soft"
                                                        color="primary"
                                                        sx={{ mb: 0.5 }}
                                                    >
                                                        Finance/Policy files
                                                    </Badge>
                                                    <Typography
                                                        level="body-xs"
                                                        sx={{
                                                            color: 'text.tertiary',
                                                        }}
                                                    >
                                                        Manager+ access
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    p: 1.5,
                                                    borderRadius: 'md',
                                                    bgcolor: 'neutral.softBg',
                                                    border: '1px solid',
                                                    borderColor:
                                                        'neutral.outlinedBorder',
                                                }}
                                            >
                                                <Security
                                                    sx={{
                                                        fontSize: 16,
                                                        color: 'neutral.main',
                                                    }}
                                                />
                                                <Box>
                                                    <Badge
                                                        variant="outlined"
                                                        color="neutral"
                                                        sx={{ mb: 0.5 }}
                                                    >
                                                        Other files
                                                    </Badge>
                                                    <Typography
                                                        level="body-xs"
                                                        sx={{
                                                            color: 'text.tertiary',
                                                        }}
                                                    >
                                                        All employee access
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </AlertDescription>
                                </Alert>
                            </AccordionDetails>
                        </Accordion>
                    </AccordionGroup>

                    {/* Decorative bottom elements */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            left: 32,
                            width: 24,
                            height: 24,
                            bgcolor: 'primary.softBg',
                            borderRadius: '50%',
                            filter: 'blur(15px)',
                            animation: 'pulse 2s ease-in-out infinite',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            right: 32,
                            width: 16,
                            height: 16,
                            bgcolor: 'warning.softBg',
                            borderRadius: '50%',
                            filter: 'blur(10px)',
                            animation: 'pulse 2s ease-in-out infinite',
                        }}
                    />
                </CardContent>
            </Card>
    )
}
