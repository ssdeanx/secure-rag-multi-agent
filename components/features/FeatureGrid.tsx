import {
    Security,
    Speed,
    Analytics,
    SmartToy,
    Cloud,
    Lock,
    Search,
    Psychology,
    Assessment,
    GroupWork,
    AutoAwesome,
    Shield,
} from '@mui/icons-material'
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Stack,
} from '@/components/ui/joy'

const features = [
    {
        icon: Security,
        title: 'Enterprise Security',
        description:
            'Bank-grade encryption with role-based access control and comprehensive audit logging.',
        color: 'success' as const,
        category: 'Security',
    },
    {
        icon: Speed,
        title: 'Lightning Fast',
        description:
            'Sub-second response times with optimized vector search and intelligent caching.',
        color: 'warning' as const,
        category: 'Performance',
    },
    {
        icon: Analytics,
        title: 'Advanced Analytics',
        description:
            'Deep insights into document usage, user behavior, and system performance metrics.',
        color: 'neutral' as const,
        category: 'Intelligence',
    },
    {
        icon: SmartToy,
        title: 'AI-Powered Agents',
        description:
            '16+ specialized agents for document analysis, summarization, and intelligent querying.',
        color: 'primary' as const,
        category: 'AI',
    },
    {
        icon: Cloud,
        title: 'Cloud-Native',
        description:
            'Scalable architecture with multi-cloud support and automatic failover capabilities.',
        color: 'neutral' as const,
        category: 'Infrastructure',
    },
    {
        icon: Lock,
        title: 'Zero-Trust Security',
        description:
            'Every request validated with continuous authentication and authorization.',
        color: 'danger' as const,
        category: 'Security',
    },
    {
        icon: Search,
        title: 'Semantic Search',
        description:
            'Context-aware search with natural language understanding and relevance ranking.',
        color: 'primary' as const,
        category: 'Search',
    },
    {
        icon: Psychology,
        title: 'Cognitive Computing',
        description:
            'Advanced reasoning capabilities with multi-modal document processing.',
        color: 'neutral' as const,
        category: 'AI',
    },
    {
        icon: Assessment,
        title: 'Real-time Monitoring',
        description:
            'Live dashboards with performance metrics, error tracking, and usage analytics.',
        color: 'neutral' as const,
        category: 'Monitoring',
    },
    {
        icon: GroupWork,
        title: 'Multi-Agent Orchestration',
        description:
            'Coordinated agent workflows with dynamic routing and collaborative intelligence.',
        color: 'primary' as const,
        category: 'AI',
    },
    {
        icon: AutoAwesome,
        title: 'Automated Workflows',
        description:
            'Customizable pipelines for document ingestion, processing, and output generation.',
        color: 'warning' as const,
        category: 'Performance',
    },
    {
        icon: Shield,
        title: 'Compliance Ready',
        description:
            'Built-in support for GDPR, HIPAA, and other regulatory requirements.',
        color: 'danger' as const,
        category: 'Security',
    },
]

const categories = [
    'All',
    'Security',
    'AI',
    'Performance',
    'Search',
    'Monitoring',
    'Infrastructure',
    'Intelligence',
]

export function FeatureGrid() {
    return (
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.level1' }}>
            <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 4 } }}>
                <Stack spacing={6} sx={{ alignItems: 'center' }}>
                    {/* Section Header */}
                    <Stack
                        spacing={3}
                        sx={{ textAlign: 'center', maxWidth: 800 }}
                    >
                        <Typography
                            level="h2"
                            sx={{
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                fontWeight: 700,
                                background:
                                    'linear-gradient(135deg, var(--joy-palette-text-primary), var(--joy-palette-primary-600))',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Powerful Features for Modern Enterprises
                        </Typography>
                        <Typography
                            level="body-lg"
                            sx={{
                                color: 'text.secondary',
                                fontSize: '1.125rem',
                                lineHeight: 1.6,
                            }}
                        >
                            Discover the comprehensive suite of capabilities
                            that make our RAG system the most advanced document
                            intelligence platform available.
                        </Typography>
                    </Stack>

                    {/* Category Filter */}
                    <Stack
                        spacing={2}
                        sx={{
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            '& > *': { minWidth: 'fit-content' },
                            flexDirection: { xs: 'column', sm: 'row' },
                        }}
                    >
                        {categories.map((category) => (
                            <Chip
                                key={category}
                                variant={
                                    category === 'All' ? 'soft' : 'outlined'
                                }
                                color={
                                    category === 'All' ? 'primary' : 'neutral'
                                }
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'all 200ms ease',
                                    '&:hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: 'sm',
                                    },
                                }}
                            >
                                {category}
                            </Chip>
                        ))}
                    </Stack>

                    {/* Features Grid */}
                    <Grid
                        container
                        spacing={4}
                        sx={{
                            width: '100%',
                            '& > *': {
                                display: 'flex',
                            },
                        }}
                    >
                        {features.map((feature) => (
                            <Grid key={feature.title} xs={12} sm={6} md={4}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        transition: 'all 300ms ease',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: 'xl',
                                            borderColor: `${feature.color}.500`,
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 4,
                                            background: `linear-gradient(90deg, var(--joy-palette-${feature.color}-500), var(--joy-palette-${feature.color}-300))`,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 4, height: '100%' }}>
                                        <Stack
                                            spacing={3}
                                            sx={{ height: '100%' }}
                                        >
                                            {/* Icon */}
                                            <Box
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: 'xl',
                                                    bgcolor: `${feature.color}.softBg`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition:
                                                        'all 200ms ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.1)',
                                                        bgcolor: `${feature.color}.100`,
                                                    },
                                                }}
                                            >
                                                <feature.icon
                                                    sx={{
                                                        fontSize: 32,
                                                        color: `${feature.color}.500`,
                                                    }}
                                                />
                                            </Box>

                                            {/* Content */}
                                            <Stack spacing={2} sx={{ flex: 1 }}>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    sx={{
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Typography
                                                        level="h4"
                                                        sx={{
                                                            fontSize: '1.25rem',
                                                            fontWeight: 600,
                                                            m: 0,
                                                        }}
                                                    >
                                                        {feature.title}
                                                    </Typography>
                                                    <Chip
                                                        size="sm"
                                                        variant="soft"
                                                        color={feature.color}
                                                        sx={{ fontSize: 'xs' }}
                                                    >
                                                        {feature.category}
                                                    </Chip>
                                                </Stack>

                                                <Typography
                                                    level="body-md"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        lineHeight: 1.6,
                                                        flex: 1,
                                                    }}
                                                >
                                                    {feature.description}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
            </Box>
        </Box>
    )
}
