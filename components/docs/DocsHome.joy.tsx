'use client'

import React from 'react'
import {
    Box,
    Typography,
    Chip,
    Button,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    Alert,
    AlertDescription,
    Divider,
    Card,
    CardHeader,
    CardContent,
} from '@/components/ui/joy'
import {
    Security,
    Bolt,
    Groups,
    Storage,
    PlayArrow,
    GitHub,
    Info,
} from '@mui/icons-material'
import type { JSX } from 'react/jsx-runtime'

export function DocsHome(): JSX.Element {
    return (
        <Box
            component="section"
            sx={{ minHeight: '100vh', bgcolor: 'background.body', py: 6 }}
        >
            <Box
                sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}
            >
                {/* Hero */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2,
                            mb: 1,
                        }}
                    >
                        <Security color="primary" sx={{ fontSize: 56 }} />
                        <Typography level="h1" sx={{ fontWeight: 800 }}>
                            Governed RAG
                        </Typography>
                    </Box>
                    <Typography
                        level="title-md"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: 900,
                            mx: 'auto',
                            mb: 2,
                        }}
                    >
                        Enterprise-Grade Secure AI Documentation
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                            flexWrap: 'wrap',
                            mb: 3,
                        }}
                    >
                        <Chip
                            variant="soft"
                            color="neutral"
                            startDecorator={<Security sx={{ fontSize: 16 }} />}
                        >
                            Zero-Trust Security
                        </Chip>
                        <Chip
                            variant="soft"
                            color="neutral"
                            startDecorator={<Groups sx={{ fontSize: 16 }} />}
                        >
                            Role-Based Access
                        </Chip>
                        <Chip
                            variant="soft"
                            color="neutral"
                            startDecorator={<Bolt sx={{ fontSize: 16 }} />}
                        >
                            Multi-Agent AI
                        </Chip>
                        <Chip
                            variant="soft"
                            color="neutral"
                            startDecorator={<Storage sx={{ fontSize: 16 }} />}
                        >
                            Vector Storage
                        </Chip>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                        }}
                    >
                        <Button size="lg" startDecorator={<PlayArrow />}>
                            Get Started
                        </Button>
                        <Button
                            size="lg"
                            variant="outlined"
                            startDecorator={<GitHub />}
                        >
                            View Source
                        </Button>
                    </Box>
                </Box>

                {/* Status */}
                <Alert
                    variant="soft"
                    color="neutral"
                    sx={{ mb: 4 }}
                    startDecorator={<Info sx={{ fontSize: 18 }} />}
                >
                    <AlertDescription
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <Typography level="title-sm">
                            System Status: All Services Operational
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        bgcolor: 'success.500',
                                        borderRadius: '50%',
                                    }}
                                />
                                PostgreSQL + PgVector
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        bgcolor: 'success.500',
                                        borderRadius: '50%',
                                    }}
                                />
                                Mastra
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        bgcolor: 'success.500',
                                        borderRadius: '50%',
                                    }}
                                />
                                API
                            </Box>
                        </Box>
                    </AlertDescription>
                </Alert>

                {/* Tabs */}
                <Tabs defaultValue="overview">
                    <TabList>
                        <Tab value="overview">
                            <Typography level="body-sm">Overview</Typography>
                        </Tab>
                        <Tab value="quickstart">
                            <Typography level="body-sm">Quick Start</Typography>
                        </Tab>
                        <Tab value="security">
                            <Typography level="body-sm">Security</Typography>
                        </Tab>
                    </TabList>

                    <TabPanel value="overview" sx={{ pt: 3 }}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    md: '1fr 1fr',
                                },
                                gap: 3,
                            }}
                        >
                            <Card variant="outlined">
                                <CardHeader>
                                    <Typography level="title-md">
                                        Key Features
                                    </Typography>
                                </CardHeader>
                                <CardContent>
                                    <Typography level="body-sm">
                                        Zero-Trust Security, Multi-Agent
                                        Orchestration, Hierarchical RBAC,
                                        Document Classification
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card variant="outlined">
                                <CardHeader>
                                    <Typography level="title-md">
                                        Technical Stack
                                    </Typography>
                                </CardHeader>
                                <CardContent>
                                    <Typography level="body-sm">
                                        Next.js, TypeScript, Mastra, PostgreSQL,
                                        PgVector, Google Gemini, Joy UI
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </TabPanel>

                    <TabPanel value="quickstart" sx={{ pt: 3 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography level="body-sm">
                                    Clone repo, configure env, start services,
                                    index sample documents.
                                </Typography>
                            </CardContent>
                        </Card>
                    </TabPanel>

                    <TabPanel value="security" sx={{ pt: 3 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography level="body-sm">
                                    RBAC, policy agents, and classification
                                    filters applied end-to-end.
                                </Typography>
                            </CardContent>
                        </Card>
                    </TabPanel>
                </Tabs>

                <Divider sx={{ my: 5 }} />

                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography level="title-lg">
                        Built with ❤️ using Mastra AI Framework
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default DocsHome
