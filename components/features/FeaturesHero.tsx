import { Box, Typography, Button, Stack, Chip } from '@/components/ui/joy'
import {
    RocketLaunch,
    ArrowForward,
    Security,
    Speed,
    Analytics,
} from '@mui/icons-material'

export function FeaturesHero() {
    return (
        <Box
            sx={{
                py: { xs: 8, md: 12 },
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Animated background elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background:
                        'linear-gradient(45deg, rgba(62, 207, 142, 0.1), rgba(52, 183, 124, 0.05))',
                    filter: 'blur(40px)',
                    animation: 'float 6s ease-in-out infinite',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-20px)' },
                    },
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: '60%',
                    right: '15%',
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background:
                        'linear-gradient(45deg, rgba(20, 184, 166, 0.1), rgba(14, 165, 233, 0.05))',
                    filter: 'blur(30px)',
                    animation: 'float 8s ease-in-out infinite reverse',
                }}
            />

            <Box
                sx={{
                    maxWidth: '1400px',
                    mx: 'auto',
                    px: { xs: 2, sm: 4 },
                }}
            >
                <Stack
                    spacing={6}
                    sx={{
                        alignItems: 'center',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    {/* Badge */}
                    <Chip
                        variant="soft"
                        color="primary"
                        startDecorator={<RocketLaunch />}
                        sx={{
                            px: 3,
                            py: 1.5,
                            fontSize: 'sm',
                            fontWeight: 600,
                            borderRadius: 'xl',
                            boxShadow: 'sm',
                        }}
                    >
                        Cutting-Edge AI Features
                    </Chip>

                    {/* Main heading */}
                    <Typography
                        level="h1"
                        sx={{
                            fontSize: { xs: '2.5rem', md: '4rem' },
                            fontWeight: 800,
                            lineHeight: 1.1,
                            background:
                                'linear-gradient(135deg, var(--joy-palette-text-primary), var(--joy-palette-primary-600))',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2,
                        }}
                    >
                        Next-Generation
                        <br />
                        RAG Technology
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                        level="h4"
                        sx={{
                            fontSize: { xs: '1.125rem', md: '1.25rem' },
                            fontWeight: 400,
                            color: 'text.secondary',
                            maxWidth: 600,
                            lineHeight: 1.6,
                        }}
                    >
                        Experience the future of document intelligence with our
                        advanced Retrieval-Augmented Generation system. Built
                        for enterprise security, lightning-fast responses, and
                        unparalleled accuracy.
                    </Typography>

                    {/* Feature highlights */}
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 600,
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 3,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                            }}
                        >
                            <Security
                                sx={{ color: 'success.500', fontSize: 24 }}
                            />
                            <Typography
                                level="body-lg"
                                sx={{ fontWeight: 500 }}
                            >
                                Enterprise Security
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                            }}
                        >
                            <Speed
                                sx={{ color: 'warning.500', fontSize: 24 }}
                            />
                            <Typography
                                level="body-lg"
                                sx={{ fontWeight: 500 }}
                            >
                                Lightning Fast
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                            }}
                        >
                            <Analytics
                                sx={{ color: 'info.500', fontSize: 24 }}
                            />
                            <Typography
                                level="body-lg"
                                sx={{ fontWeight: 500 }}
                            >
                                Advanced Analytics
                            </Typography>
                        </Box>
                    </Box>

                    {/* CTA Buttons */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 3,
                            mt: 4,
                        }}
                    >
                        <Button
                            size="lg"
                            variant="solid"
                            color="primary"
                            endDecorator={<ArrowForward />}
                            sx={{
                                px: 4,
                                py: 2,
                                fontSize: 'lg',
                                fontWeight: 600,
                                borderRadius: 'xl',
                                minWidth: 200,
                                boxShadow: 'lg',
                                transition: 'all 200ms ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'xl',
                                },
                            }}
                        >
                            Explore Features
                        </Button>
                        <Button
                            size="lg"
                            variant="outlined"
                            color="neutral"
                            sx={{
                                px: 4,
                                py: 2,
                                fontSize: 'lg',
                                fontWeight: 600,
                                borderRadius: 'xl',
                                minWidth: 200,
                                transition: 'all 200ms ease',
                                '&:hover': {
                                    bgcolor: 'neutral.softBg',
                                    transform: 'translateY(-1px)',
                                },
                            }}
                        >
                            View Demo
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Box>
    )
}
