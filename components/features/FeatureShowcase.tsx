import {
    Box,
    Typography,
    Card,
    CardContent,
    Stack,
    Button,
    AspectRatio,
    Grid,
} from '@/components/ui/joy'
import { PlayArrow, Code, Analytics, Security } from '@mui/icons-material'

export function FeatureShowcase() {
    return (
        <Box sx={{ py: { xs: 8, md: 12 } }}>
            <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 4 } }}>
                <Stack spacing={8}>
                    {/* Section Header */}
                    <Stack
                        spacing={3}
                        sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}
                    >
                        <Typography
                            level="h2"
                            sx={{
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                fontWeight: 700,
                            }}
                        >
                            See It In Action
                        </Typography>
                        <Typography
                            level="body-lg"
                            sx={{
                                color: 'text.secondary',
                                fontSize: '1.125rem',
                                lineHeight: 1.6,
                            }}
                        >
                            Experience the power of our next-generation RAG
                            technology through interactive demos and real-world
                            use cases.
                        </Typography>
                    </Stack>

                    {/* Interactive Demo Cards */}
                    <Stack spacing={6}>
                        {/* Main Demo Card */}
                        <Card
                            variant="outlined"
                            sx={{
                                borderRadius: 'xl',
                                overflow: 'hidden',
                                boxShadow: 'lg',
                                position: 'relative',
                            }}
                        >
                            <AspectRatio
                                ratio="16/9"
                                sx={{ bgcolor: 'background.level2' }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'background.level1',
                                        borderRadius: 'lg',
                                        mx: 4,
                                        my: 6,
                                    }}
                                >
                                    <Stack
                                        spacing={3}
                                        sx={{ alignItems: 'center' }}
                                    >
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                bgcolor: 'primary.softBg',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <PlayArrow
                                                sx={{
                                                    fontSize: 40,
                                                    color: 'primary.500',
                                                }}
                                            />
                                        </Box>
                                        <Typography
                                            level="h4"
                                            sx={{ textAlign: 'center' }}
                                        >
                                            Interactive RAG Demo
                                        </Typography>
                                        <Typography
                                            level="body-md"
                                            sx={{
                                                textAlign: 'center',
                                                color: 'text.secondary',
                                                maxWidth: 400,
                                            }}
                                        >
                                            Experience real-time document
                                            querying with our advanced AI
                                            agents. Ask questions about
                                            enterprise documents and see
                                            instant, accurate responses.
                                        </Typography>
                                        <Button
                                            variant="solid"
                                            color="primary"
                                            size="lg"
                                            startDecorator={<PlayArrow />}
                                            sx={{
                                                borderRadius: 'xl',
                                                px: 4,
                                                py: 2,
                                            }}
                                        >
                                            Start Demo
                                        </Button>
                                    </Stack>
                                </Box>
                            </AspectRatio>
                        </Card>

                        {/* Feature Showcase Cards */}
                        <Grid container spacing={4}>
                            <Grid xs={12} md={6}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 'xl',
                                        height: '100%',
                                        transition: 'all 300ms ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 'lg',
                                            borderColor: 'primary.500',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Stack spacing={3}>
                                            <Box
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: 'xl',
                                                    bgcolor: 'info.softBg',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Analytics
                                                    sx={{
                                                        fontSize: 28,
                                                        color: 'info.500',
                                                    }}
                                                />
                                            </Box>
                                            <Stack spacing={2}>
                                                <Typography
                                                    level="h4"
                                                    sx={{ fontWeight: 600 }}
                                                >
                                                    Real-Time Analytics
                                                </Typography>
                                                <Typography
                                                    level="body-md"
                                                    sx={{
                                                        color: 'text.secondary',
                                                    }}
                                                >
                                                    Monitor system performance,
                                                    user interactions, and
                                                    document insights with
                                                    comprehensive dashboards and
                                                    real-time metrics.
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    color="neutral"
                                                    sx={{
                                                        alignSelf: 'flex-start',
                                                        borderRadius: 'xl',
                                                    }}
                                                >
                                                    View Analytics
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid xs={12} md={6}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 'xl',
                                        height: '100%',
                                        transition: 'all 300ms ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 'lg',
                                            borderColor: 'success.500',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Stack spacing={3}>
                                            <Box
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: 'xl',
                                                    bgcolor: 'success.softBg',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Security
                                                    sx={{
                                                        fontSize: 28,
                                                        color: 'success.500',
                                                    }}
                                                />
                                            </Box>
                                            <Stack spacing={2}>
                                                <Typography
                                                    level="h4"
                                                    sx={{ fontWeight: 600 }}
                                                >
                                                    Security Dashboard
                                                </Typography>
                                                <Typography
                                                    level="body-md"
                                                    sx={{
                                                        color: 'text.secondary',
                                                    }}
                                                >
                                                    Comprehensive security
                                                    monitoring with threat
                                                    detection, access control
                                                    visualization, and
                                                    compliance reporting.
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    color="success"
                                                    sx={{
                                                        alignSelf: 'flex-start',
                                                        borderRadius: 'xl',
                                                    }}
                                                >
                                                    Security Center
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Code Example Card */}
                        <Card
                            variant="soft"
                            color="neutral"
                            sx={{
                                borderRadius: 'xl',
                                bgcolor: 'background.level1',
                            }}
                        >
                            <CardContent sx={{ p: 6 }}>
                                <Stack spacing={4}>
                                    <Stack
                                        direction="row"
                                        spacing={3}
                                        sx={{ alignItems: 'center' }}
                                    >
                                        <Box
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: 'xl',
                                                bgcolor: 'primary.softBg',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Code
                                                sx={{
                                                    fontSize: 28,
                                                    color: 'primary.500',
                                                }}
                                            />
                                        </Box>
                                        <Stack spacing={1}>
                                            <Typography
                                                level="h4"
                                                sx={{ fontWeight: 600 }}
                                            >
                                                Developer Integration
                                            </Typography>
                                            <Typography
                                                level="body-md"
                                                sx={{ color: 'text.secondary' }}
                                            >
                                                Seamless API integration with
                                                comprehensive SDKs and
                                                documentation
                                            </Typography>
                                        </Stack>
                                    </Stack>

                                    <Box
                                        sx={{
                                            bgcolor: 'background.surface',
                                            borderRadius: 'lg',
                                            p: 4,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            fontFamily: 'code',
                                            fontSize: 'sm',
                                            overflow: 'auto',
                                            '& pre': {
                                                m: 0,
                                                whiteSpace: 'pre-wrap',
                                            },
                                        }}
                                    >
                                        <pre>
                                            {`// Query documents with AI-powered search
const response = await rag.query({
  question: "What are our expense policies?",
  securityLevel: "internal",
  userRole: "finance_manager"
});

// Get intelligent summaries
const summary = await rag.summarize({
  documentId: "policy-2024",
  length: "concise",
  focus: "key_points"
});`}
                                        </pre>
                                    </Box>

                                    <Stack
                                        spacing={3}
                                        sx={{
                                            flexDirection: {
                                                xs: 'column',
                                                sm: 'row',
                                            },
                                        }}
                                    >
                                        <Button
                                            variant="solid"
                                            color="primary"
                                            startDecorator={<Code />}
                                            sx={{ borderRadius: 'xl', flex: 1 }}
                                        >
                                            View API Docs
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="neutral"
                                            sx={{ borderRadius: 'xl', flex: 1 }}
                                        >
                                            SDK Downloads
                                        </Button>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    )
}
