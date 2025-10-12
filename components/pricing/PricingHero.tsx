import { Box, Typography, Chip } from '@/components/ui/joy'
import { MonetizationOn } from '@mui/icons-material'

export function PricingHero() {
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
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Badge */}
                <Chip
                    variant="soft"
                    color="primary"
                    startDecorator={<MonetizationOn />}
                    sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: 'sm',
                        fontWeight: 600,
                        borderRadius: 'xl',
                        boxShadow: 'sm',
                        mb: 4,
                    }}
                >
                    Transparent Pricing
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
                        mb: 4,
                    }}
                >
                    Choose Your Plan
                </Typography>

                {/* Subtitle */}
                <Typography
                    level="h4"
                    sx={{
                        fontSize: { xs: '1.125rem', md: '1.25rem' },
                        fontWeight: 400,
                        color: 'text.secondary',
                        maxWidth: 600,
                        mx: 'auto',
                        lineHeight: 1.6,
                    }}
                >
                    Start free and scale as you grow. All plans include
                    enterprise-grade security, 24/7 support, and unlimited
                    document processing.
                </Typography>
            </Box>
        </Box>
    )
}
