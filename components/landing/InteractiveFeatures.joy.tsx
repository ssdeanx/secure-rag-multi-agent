'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Grid,
    Stack,
} from '@/components/ui/joy'
import {
    Security,
    Psychology,
    Edit,
    Search,
    Assessment,
    Timeline,
    DataObject,
    IntegrationInstructions,
    AutoAwesome,
    Shield,
    Article,
    Analytics,
    Build,
} from '@mui/icons-material'

const coreCapabilities = [
    {
        icon: <Security sx={{ fontSize: 32 }} />,
        title: 'Zero-Trust Document Security',
        description:
            'Multi-agent security pipeline with hierarchical RBAC, document classification, and compliance validation.',
        highlights: [
            '6-stage validation pipeline',
            'Role inheritance system',
            'Audit-ready logging',
        ],
        color: 'success' as const,
    },
    {
        icon: <Edit sx={{ fontSize: 32 }} />,
        title: 'AI-Powered Content Creation',
        description:
            'Expert content generation across multiple formats with quality assurance and iterative refinement.',
        highlights: [
            'Multi-format content creation',
            'Quality evaluation system',
            'Iterative improvement',
        ],
        color: 'primary' as const,
    },
    {
        icon: <Search sx={{ fontSize: 32 }} />,
        title: 'Advanced Research & Analysis',
        description:
            'Comprehensive research capabilities with web scraping, data synthesis, and automated reporting.',
        highlights: [
            '2-phase research process',
            'Web data extraction',
            'Automated report generation',
        ],
        color: 'warning' as const,
    },
    {
        icon: <Timeline sx={{ fontSize: 32 }} />,
        title: 'Product Roadmap Management',
        description:
            'Interactive product roadmap with feature tracking, voting, and collaborative planning.',
        highlights: [
            'Feature hierarchy tracking',
            'Community voting system',
            'Status progression workflow',
        ],
        color: 'info' as const,
    },
    {
        icon: <DataObject sx={{ fontSize: 32 }} />,
        title: 'Enterprise Data Processing',
        description:
            'Robust data handling with chunking, vectorization, and secure storage capabilities.',
        highlights: [
            'Document chunking pipeline',
            'Vector embeddings',
            'Access-controlled retrieval',
        ],
        color: 'neutral' as const,
    },
    {
        icon: <IntegrationInstructions sx={{ fontSize: 32 }} />,
        title: 'External System Integration',
        description:
            'Seamless integration with external services and data sources for enhanced functionality.',
        highlights: [
            'Google Sheets integration',
            'Weather data services',
            'Graph RAG queries',
        ],
        color: 'primary' as const,
    },
]

const orchestrationStats = [
    { label: '17+ Specialized Agents', icon: <Psychology />, value: '17+' },
    { label: '15+ Secure Tools', icon: <Build />, value: '15+' },
    {
        label: '11+ Orchestrated Workflows',
        icon: <AutoAwesome />,
        value: '11+',
    },
    {
        label: 'Multi-Agent Networks',
        icon: <IntegrationInstructions />,
        value: '∞',
    },
]

export function InteractiveFeatures() {
    const reduceMotion = useReducedMotion()
    const prefersReducedMotion = reduceMotion === true

    return (
        <Box
            component="section"
            aria-labelledby="features-heading"
            sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.surface' }}
        >
            <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, sm: 4 } }}>
                {/* Header */}
                <motion.div
                    {...(prefersReducedMotion
                        ? {}
                        : {
                              initial: { opacity: 0, y: 50 },
                              whileInView: { opacity: 1, y: 0 },
                              transition: { duration: 0.8 },
                          })}
                    viewport={{ once: true }}
                >
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Chip
                            variant="soft"
                            color="primary"
                            size="lg"
                            sx={{ mb: 3 }}
                        >
                            Enterprise AI Orchestration Platform
                        </Chip>
                        <Typography
                            id="features-heading"
                            level="h2"
                            sx={{
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                fontWeight: 700,
                                mb: 3,
                                lineHeight: 1.2,
                            }}
                        >
                            Comprehensive AI Capabilities
                        </Typography>
                        <Typography
                            level="body-lg"
                            sx={{
                                color: 'text.secondary',
                                maxWidth: '600px',
                                mx: 'auto',
                                lineHeight: 1.6,
                            }}
                        >
                            Built on Mastra's multi-agent architecture with
                            specialized agents, secure tools, and orchestrated
                            workflows for complex enterprise automation.
                        </Typography>
                    </Box>
                </motion.div>

                {/* Orchestration Stats */}
                <motion.div
                    {...(prefersReducedMotion
                        ? {}
                        : {
                              initial: { opacity: 0, y: 30 },
                              whileInView: { opacity: 1, y: 0 },
                              transition: { duration: 0.6, delay: 0.2 },
                          })}
                    viewport={{ once: true }}
                >
                    <Grid container spacing={3} sx={{ mb: 8 }}>
                        {orchestrationStats.map((stat, index) => (
                            <Grid key={index} xs={6} sm={3}>
                                <Card
                                    variant="soft"
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        height: '100%',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 'md',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            color: 'primary.main',
                                            mb: 1,
                                            fontSize: '1.5rem',
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                    <Typography
                                        level="h3"
                                        sx={{
                                            fontSize: '1.5rem',
                                            fontWeight: 700,
                                            color: 'primary.main',
                                            mb: 0.5,
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Typography
                                        level="body-sm"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        {stat.label
                                            .split(' ')
                                            .slice(1)
                                            .join(' ')}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>

                {/* Core Capabilities Grid */}
                <Box
                    component="ul"
                    aria-label="Core platform capabilities"
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: 'repeat(2, 1fr)',
                            lg: 'repeat(3, 1fr)',
                        },
                        gap: 4,
                        listStyle: 'none',
                        p: 0,
                        mb: 6,
                    }}
                >
                    {coreCapabilities.map((capability, i) => (
                        <Box
                            component="li"
                            key={capability.title}
                            sx={{ height: '100%' }}
                        >
                            <motion.div
                                {...(prefersReducedMotion
                                    ? {}
                                    : {
                                          initial: { opacity: 0, y: 50 },
                                          whileInView: { opacity: 1, y: 0 },
                                          transition: {
                                              duration: 0.5,
                                              delay: i * 0.1,
                                          },
                                      })}
                                viewport={{ once: true }}
                                aria-label={`${capability.title} capability`}
                            >
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        transition: 'all 0.3s',
                                        borderWidth: 2,
                                        bgcolor: 'background.level1',
                                        backdropFilter: 'blur(8px)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: 'xl',
                                            borderColor: `${capability.color}.500`,
                                        },
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 3,
                                        }}
                                    >
                                        <Box
                                            aria-hidden="true"
                                            sx={{
                                                bgcolor: `${capability.color}.softBg`,
                                                borderRadius: '50%',
                                                p: 2,
                                                width: 'fit-content',
                                                color: `${capability.color}.500`,
                                                boxShadow: 'sm',
                                            }}
                                        >
                                            {capability.icon}
                                        </Box>

                                        <Box>
                                            <Typography
                                                level="h4"
                                                sx={{
                                                    fontWeight: 600,
                                                    mb: 2,
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {capability.title}
                                            </Typography>
                                            <Typography
                                                level="body-sm"
                                                sx={{
                                                    color: 'text.secondary',
                                                    mb: 2,
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {capability.description}
                                            </Typography>
                                        </Box>

                                        <Stack spacing={1}>
                                            {capability.highlights.map(
                                                (highlight, idx) => (
                                                    <Box
                                                        key={idx}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            gap: 1.5,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: 4,
                                                                height: 4,
                                                                borderRadius:
                                                                    '50%',
                                                                bgcolor: `${capability.color}.500`,
                                                                flexShrink: 0,
                                                            }}
                                                        />
                                                        <Typography
                                                            level="body-xs"
                                                            sx={{
                                                                color: 'text.tertiary',
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            {highlight}
                                                        </Typography>
                                                    </Box>
                                                )
                                            )}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Box>
                    ))}
                </Box>

                {/* Bottom CTA */}
                <motion.div
                    {...(prefersReducedMotion
                        ? {}
                        : {
                              initial: { opacity: 0, y: 30 },
                              whileInView: { opacity: 1, y: 0 },
                              transition: { duration: 0.6, delay: 0.4 },
                          })}
                    viewport={{ once: true }}
                >
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            level="h3"
                            sx={{
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                mb: 2,
                                color: 'text.secondary',
                            }}
                        >
                            Ready to Transform Your Enterprise?
                        </Typography>
                        <Typography
                            level="body-md"
                            sx={{
                                color: 'text.tertiary',
                                maxWidth: '500px',
                                mx: 'auto',
                                mb: 3,
                            }}
                        >
                            Join organizations leveraging Mastra for secure,
                            intelligent automation with complete governance and
                            compliance.
                        </Typography>
                    </Box>
                </motion.div>
            </Box>
        </Box>
    )
}
