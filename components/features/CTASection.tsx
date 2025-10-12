import {
    Box,
    Typography,
    Button,
    Stack,
    Card,
    CardContent,
} from '@/components/ui/joy'
import { ArrowForward, ContactMail, PlayArrow } from '@mui/icons-material'

export function CTASection() {
    return (
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.level1' }}>
            <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 4 } }}>
                <Stack spacing={6} sx={{ alignItems: 'center' }}>
                    {/* Main CTA Card */}
                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: 'xl',
                            p: { xs: 4, md: 6 },
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            maxWidth: 800,
                            width: '100%',
                            background:
                                'linear-gradient(135deg, rgba(62, 207, 142, 0.05), rgba(255, 255, 255, 0.05))',
                        }}
                    >
                        {/* Background decoration */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -100,
                                right: -100,
                                width: 200,
                                height: 200,
                                borderRadius: '50%',
                                bgcolor: 'primary.softBg',
                                opacity: 0.3,
                                filter: 'blur(40px)',
                            }}
                        />

                        <CardContent
                            sx={{ p: 0, position: 'relative', zIndex: 1 }}
                        >
                            <Stack spacing={4} sx={{ alignItems: 'center' }}>
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
                                    Ready to Transform Your Document
                                    Intelligence?
                                </Typography>

                                <Typography
                                    level="body-lg"
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '1.125rem',
                                        lineHeight: 1.6,
                                        maxWidth: 600,
                                    }}
                                >
                                    Join leading enterprises using our
                                    cutting-edge RAG technology. Start your free
                                    trial today and experience the future of
                                    AI-powered document processing.
                                </Typography>

                                <Stack
                                    spacing={3}
                                    sx={{
                                        width: '100%',
                                        maxWidth: 500,
                                        flexDirection: {
                                            xs: 'column',
                                            sm: 'row',
                                        },
                                    }}
                                >
                                    <Button
                                        size="lg"
                                        variant="solid"
                                        color="primary"
                                        endDecorator={<ArrowForward />}
                                        sx={{
                                            flex: 1,
                                            borderRadius: 'xl',
                                            py: 2,
                                            fontSize: 'lg',
                                            fontWeight: 600,
                                            boxShadow: 'lg',
                                            transition: 'all 200ms ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: 'xl',
                                            },
                                        }}
                                    >
                                        Start Free Trial
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outlined"
                                        color="neutral"
                                        startDecorator={<ContactMail />}
                                        sx={{
                                            flex: 1,
                                            borderRadius: 'xl',
                                            py: 2,
                                            fontSize: 'lg',
                                            fontWeight: 600,
                                            transition: 'all 200ms ease',
                                            '&:hover': {
                                                bgcolor: 'neutral.softBg',
                                                transform: 'translateY(-1px)',
                                            },
                                        }}
                                    >
                                        Contact Sales
                                    </Button>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Additional Actions */}
                    <Stack
                        spacing={4}
                        sx={{
                            width: '100%',
                            maxWidth: 600,
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: 'center',
                        }}
                    >
                        <Button
                            variant="plain"
                            color="neutral"
                            startDecorator={<PlayArrow />}
                            sx={{
                                fontSize: 'lg',
                                fontWeight: 500,
                                px: 3,
                                py: 2,
                                borderRadius: 'xl',
                                transition: 'all 200ms ease',
                                '&:hover': {
                                    bgcolor: 'neutral.softBg',
                                    transform: 'translateY(-1px)',
                                },
                            }}
                        >
                            Watch Product Demo
                        </Button>

                        <Typography
                            level="body-md"
                            sx={{
                                color: 'text.tertiary',
                                textAlign: 'center',
                            }}
                        >
                            No credit card required • 14-day free trial • Cancel
                            anytime
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    )
}
