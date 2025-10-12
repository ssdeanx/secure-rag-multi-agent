import { Box, Typography, Button } from '@/components/ui/joy'
import { ArrowForward, ContactMail } from '@mui/icons-material'

export function PricingCTA() {
    return (
        <Box sx={{ py: { xs: 8, md: 12 } }}>
            <Box
                sx={{
                    maxWidth: '800px',
                    mx: 'auto',
                    px: { xs: 2, sm: 4 },
                    textAlign: 'center',
                }}
            >
                <Typography
                    level="h2"
                    sx={{
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        fontWeight: 700,
                        mb: 4,
                    }}
                >
                    Ready to Get Started?
                </Typography>

                <Typography
                    level="body-lg"
                    sx={{
                        color: 'text.secondary',
                        fontSize: '1.125rem',
                        lineHeight: 1.6,
                        mb: 6,
                        maxWidth: 600,
                        mx: 'auto',
                    }}
                >
                    Join thousands of companies already using our platform to
                    transform their document intelligence capabilities. Start
                    your free trial today.
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 3,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        size="lg"
                        variant="solid"
                        color="primary"
                        endDecorator={<ArrowForward />}
                        sx={{
                            px: 6,
                            py: 2,
                            fontSize: 'lg',
                            fontWeight: 600,
                            borderRadius: 'xl',
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
                            px: 6,
                            py: 2,
                            fontSize: 'lg',
                            fontWeight: 600,
                            borderRadius: 'xl',
                            transition: 'all 200ms ease',
                            '&:hover': {
                                bgcolor: 'neutral.softBg',
                                transform: 'translateY(-1px)',
                            },
                        }}
                    >
                        Contact Sales
                    </Button>
                </Box>

                <Typography
                    level="body-sm"
                    sx={{
                        color: 'text.tertiary',
                        mt: 4,
                        fontSize: 'sm',
                    }}
                >
                    No credit card required • 14-day free trial • Cancel anytime
                </Typography>
            </Box>
        </Box>
    )
}
