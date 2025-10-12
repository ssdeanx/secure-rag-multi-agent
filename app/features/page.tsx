'use client'

import React from 'react'
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Stack,
    Button,
    Divider,
    List,
    ListItem,
} from '@mui/joy'
import {
    Security,
    Psychology,
    Edit,
    Search,
    Timeline,
    DataObject,
    IntegrationInstructions,
    AutoAwesome,
    Shield,
    Article,
    Analytics,
    Build,
} from '@mui/icons-material'
import Link from 'next/link'

export default function FeaturesPage() {
    const coreCapabilities = [
        {
            icon: <Security sx={{ fontSize: 32 }} />,
            title: 'Zero-Trust Document Security',
            description:
                'Multi-agent security pipeline with hierarchical RBAC, document classification (public/internal/confidential), and audit-ready compliance validation.',
            features: [
                '6-stage security validation: Identity → Policy → Retrieve → Rerank → Answer → Verify',
                'Role inheritance: admin > dept_admin > dept_viewer > employee > public',
                'Tag-based access filtering with step-up authentication',
                'PostgreSQL + PgVector with security-aware vector search',
            ],
        },
        {
            icon: <Edit sx={{ fontSize: 32 }} />,
            title: 'AI-Powered Content Creation',
            description:
                'Expert content generation across multiple formats with quality assurance and iterative refinement.',
            features: [
                'Copywriter agent: Blog posts, marketing copy, social media, technical docs, business communications',
                'Editor agent: Content refinement and improvement with evaluation metrics',
                'Multi-format support: Markdown, HTML, structured data',
                'Quality feedback loop with evaluation scoring',
            ],
        },
        {
            icon: <Search sx={{ fontSize: 32 }} />,
            title: 'Advanced Research & Analysis',
            description:
                'Comprehensive research capabilities with web scraping, data synthesis, and automated report generation.',
            features: [
                '2-phase research process: Initial focused queries + follow-up analysis',
                'Web scraping with HTML-to-Markdown conversion',
                'Learning extraction and knowledge synthesis',
                'Automated report generation from research findings',
            ],
        },
        {
            icon: <Timeline sx={{ fontSize: 32 }} />,
            title: 'Product Roadmap Management',
            description:
                'Interactive product roadmap with feature tracking, voting, and collaborative planning.',
            features: [
                'Feature hierarchy with parent-child relationships',
                'Community voting and commenting system',
                'Status tracking: Backlog → Planned → In Progress → Done',
                'Graph database integration for complex relationships',
            ],
        },
        {
            icon: <DataObject sx={{ fontSize: 32 }} />,
            title: 'Enterprise Data Processing',
            description:
                'Robust data handling with chunking, vectorization, and secure storage capabilities.',
            features: [
                'Document chunking with Unicode normalization',
                'Batch processing pipelines',
                'Vector embeddings with access-controlled retrieval',
                'Multi-format data file management',
            ],
        },
        {
            icon: <IntegrationInstructions sx={{ fontSize: 32 }} />,
            title: 'External System Integration',
            description:
                'Seamless integration with external services and data sources for enhanced functionality.',
            features: [
                'Google Sheets integration for data import/export',
                'Weather data services for location-based insights',
                'Graph RAG queries for knowledge graph traversal',
                'Template review workflows for project assessment',
            ],
        },
    ]

    const orchestrationFeatures = [
        { label: '17+ Specialized Agents', icon: <Psychology /> },
        { label: '15+ Secure Tools', icon: <Build /> },
        { label: '11+ Orchestrated Workflows', icon: <AutoAwesome /> },
        { label: 'Multi-Agent Networks', icon: <IntegrationInstructions /> },
        { label: 'JWT Authentication', icon: <Shield /> },
        { label: 'Audit Logging', icon: <Article /> },
        { label: 'Performance Monitoring', icon: <Analytics /> },
        { label: 'Compliance Validation', icon: <Security /> },
    ]

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'neutral.softBg' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    py: { xs: 6, md: 10 },
                    px: { xs: 2, sm: 4 },
                }}
            >
                <Box
                    sx={{ maxWidth: '1200px', mx: 'auto', textAlign: 'center' }}
                >
                    <Typography
                        level="h1"
                        sx={{ mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
                    >
                        Enterprise AI Orchestration Platform
                    </Typography>
                    <Typography
                        level="h4"
                        sx={{
                            mb: 4,
                            opacity: 0.9,
                            maxWidth: '800px',
                            mx: 'auto',
                        }}
                    >
                        Mastra-powered security and AI capabilities for modern
                        enterprises. Multi-agent architecture with zero-trust
                        security, content creation, research automation, and
                        comprehensive workflow orchestration.
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Button
                            component={Link}
                            href="/login"
                            size="lg"
                            variant="soft"
                            color="primary"
                            sx={{ minWidth: 160 }}
                        >
                            Get Started
                        </Button>
                        <Button
                            component={Link}
                            href="/docs"
                            size="lg"
                            variant="outlined"
                            color="neutral"
                            sx={{ minWidth: 160 }}
                        >
                            View Documentation
                        </Button>
                    </Stack>
                </Box>
            </Box>

            {/* Core Capabilities */}
            <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 4 } }}>
                <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
                    <Typography level="h2" sx={{ textAlign: 'center', mb: 2 }}>
                        Core Capabilities
                    </Typography>
                    <Typography
                        level="body-lg"
                        sx={{
                            textAlign: 'center',
                            mb: 6,
                            maxWidth: '600px',
                            mx: 'auto',
                            color: 'neutral.600',
                        }}
                    >
                        Comprehensive AI orchestration with enterprise-grade
                        security, content creation, research automation, and
                        workflow management.
                    </Typography>

                    <Grid container spacing={4}>
                        {coreCapabilities.map((capability, index) => (
                            <Grid key={index} xs={12} md={6}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 'lg',
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Box sx={{ color: 'primary.main' }}>
                                                {capability.icon}
                                            </Box>
                                            <Typography
                                                level="h3"
                                                sx={{ fontSize: '1.25rem' }}
                                            >
                                                {capability.title}
                                            </Typography>
                                            <Typography
                                                level="body-sm"
                                                sx={{ color: 'neutral.600' }}
                                            >
                                                {capability.description}
                                            </Typography>
                                            <List
                                                sx={{
                                                    '--ListItem-paddingY':
                                                        '0.25rem',
                                                }}
                                            >
                                                {capability.features.map(
                                                    (feature, idx) => (
                                                        <ListItem
                                                            key={idx}
                                                            sx={{
                                                                alignItems:
                                                                    'flex-start',
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    width: 6,
                                                                    height: 6,
                                                                    borderRadius:
                                                                        '50%',
                                                                    bgcolor:
                                                                        'primary.main',
                                                                    mt: 1,
                                                                    mr: 1.5,
                                                                    flexShrink: 0,
                                                                }}
                                                            />
                                                            <Typography
                                                                level="body-sm"
                                                                sx={{
                                                                    fontSize:
                                                                        '0.875rem',
                                                                }}
                                                            >
                                                                {feature}
                                                            </Typography>
                                                        </ListItem>
                                                    )
                                                )}
                                            </List>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>

            {/* Orchestration Overview */}
            <Box
                sx={{
                    py: { xs: 6, md: 10 },
                    px: { xs: 2, sm: 4 },
                    bgcolor: 'neutral.50',
                }}
            >
                <Box
                    sx={{ maxWidth: '1200px', mx: 'auto', textAlign: 'center' }}
                >
                    <Typography level="h2" sx={{ mb: 3 }}>
                        AI Orchestration at Scale
                    </Typography>
                    <Typography
                        level="body-lg"
                        sx={{
                            mb: 6,
                            maxWidth: '800px',
                            mx: 'auto',
                            color: 'neutral.600',
                        }}
                    >
                        Built on Mastra's multi-agent architecture with
                        specialized agents, secure tools, and orchestrated
                        workflows for complex enterprise automation.
                    </Typography>

                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        {orchestrationFeatures.map((feature, index) => (
                            <Grid key={index} xs={6} sm={3}>
                                <Card
                                    variant="soft"
                                    sx={{ p: 2, textAlign: 'center' }}
                                >
                                    <Box sx={{ color: 'primary.main', mb: 1 }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography
                                        level="body-sm"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {feature.label}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={3}
                        sx={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Chip
                            size="lg"
                            variant="soft"
                            color="success"
                            startDecorator={<Security />}
                        >
                            Zero-Trust Security
                        </Chip>
                        <Chip
                            size="lg"
                            variant="soft"
                            color="primary"
                            startDecorator={<AutoAwesome />}
                        >
                            Multi-Agent Orchestration
                        </Chip>
                        <Chip
                            size="lg"
                            variant="soft"
                            color="warning"
                            startDecorator={<Analytics />}
                        >
                            Enterprise Compliance
                        </Chip>
                    </Stack>
                </Box>
            </Box>

            {/* CTA Section */}
            <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 4 } }}>
                <Box
                    sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center' }}
                >
                    <Typography level="h2" sx={{ mb: 3 }}>
                        Ready to Transform Your Enterprise?
                    </Typography>
                    <Typography
                        level="body-lg"
                        sx={{ mb: 4, color: 'neutral.600' }}
                    >
                        Experience the power of AI orchestration with
                        enterprise-grade security. Join organizations already
                        leveraging Mastra for secure, intelligent automation.
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Button
                            component={Link}
                            href="/login"
                            size="lg"
                            color="primary"
                            sx={{ minWidth: 160 }}
                        >
                            Start Free Trial
                        </Button>
                        <Button
                            component={Link}
                            href="/contact"
                            size="lg"
                            variant="outlined"
                            color="neutral"
                            sx={{ minWidth: 160 }}
                        >
                            Contact Sales
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}
