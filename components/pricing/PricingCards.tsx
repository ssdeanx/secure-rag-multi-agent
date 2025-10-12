import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Grid,
} from '@/components/ui/joy'
import { Check, Star, Business, RocketLaunch } from '@mui/icons-material'

const pricingTiers = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for getting started with RAG technology',
        features: [
            'Up to 1,000 documents',
            'Basic AI agents',
            'Community support',
            'Standard security',
            'API access (100 req/day)',
            'Basic analytics',
        ],
        limitations: [
            'Limited to 5 users',
            'No custom integrations',
            'Standard SLA',
        ],
        cta: 'Get Started Free',
        popular: false,
        icon: Star,
        color: 'neutral' as const,
    },
    {
        name: 'Pro',
        price: '$49',
        period: 'per month',
        description: 'Advanced features for growing teams and businesses',
        features: [
            'Up to 50,000 documents',
            'Advanced AI agents (16+)',
            'Priority email support',
            'Enterprise security',
            'API access (10,000 req/day)',
            'Advanced analytics & reporting',
            'Custom integrations',
            'Role-based access control',
            'Audit logs',
            '99.5% uptime SLA',
        ],
        limitations: [],
        cta: 'Start Pro Trial',
        popular: true,
        icon: RocketLaunch,
        color: 'primary' as const,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: 'pricing',
        description:
            'Full-scale deployment with dedicated support and customization',
        features: [
            'Unlimited documents',
            'All AI agents + custom development',
            '24/7 phone & email support',
            'Bank-grade security & compliance',
            'Unlimited API access',
            'Real-time analytics dashboard',
            'White-label solution',
            'Dedicated infrastructure',
            'Custom integrations',
            '99.9% uptime SLA',
            'On-premise deployment option',
            'Advanced compliance (GDPR, HIPAA, SOC 2)',
        ],
        limitations: [],
        cta: 'Contact Sales',
        popular: false,
        icon: Business,
        color: 'success' as const,
    },
]

export function PricingCards() {
    return (
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.level1' }}>
            <Box
                sx={{
                    maxWidth: '1400px',
                    mx: 'auto',
                    px: { xs: 2, sm: 4 },
                }}
            >
                <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
                    {pricingTiers.map((tier) => (
                        <Grid key={tier.name} xs={12} md={4}>
                            <Card
                                variant={tier.popular ? 'outlined' : 'soft'}
                                color={tier.color}
                                sx={{
                                    height: '100%',
                                    position: 'relative',
                                    borderRadius: 'xl',
                                    transition: 'all 300ms ease',
                                    overflow: 'visible',
                                    ...(tier.popular && {
                                        borderColor: 'primary.500',
                                        borderWidth: 2,
                                        boxShadow: 'lg',
                                        transform: 'scale(1.05)',
                                    }),
                                    '&:hover': {
                                        transform: tier.popular
                                            ? 'scale(1.08)'
                                            : 'translateY(-8px)',
                                        boxShadow: 'xl',
                                    },
                                }}
                            >
                                {/* Popular badge */}
                                {tier.popular && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -12,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            zIndex: 2,
                                        }}
                                    >
                                        <Chip
                                            variant="solid"
                                            color="primary"
                                            startDecorator={<Star />}
                                            sx={{
                                                px: 2,
                                                py: 0.5,
                                                fontSize: 'xs',
                                                fontWeight: 700,
                                                borderRadius: 'xl',
                                                boxShadow: 'sm',
                                            }}
                                        >
                                            Most Popular
                                        </Chip>
                                    </Box>
                                )}

                                <CardContent
                                    sx={{
                                        p: 6,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    {/* Header */}
                                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                                        <Box
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                borderRadius: 'xl',
                                                bgcolor: `${tier.color}.softBg`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 3,
                                            }}
                                        >
                                            <tier.icon
                                                sx={{
                                                    fontSize: 32,
                                                    color: `${tier.color}.500`,
                                                }}
                                            />
                                        </Box>

                                        <Typography
                                            level="h3"
                                            sx={{
                                                fontSize: '1.5rem',
                                                fontWeight: 700,
                                                mb: 1,
                                            }}
                                        >
                                            {tier.name}
                                        </Typography>

                                        <Typography
                                            level="body-md"
                                            sx={{
                                                color: 'text.secondary',
                                                mb: 3,
                                                minHeight: 40,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {tier.description}
                                        </Typography>

                                        {/* Pricing */}
                                        <Box sx={{ mb: 4 }}>
                                            <Typography
                                                level="h2"
                                                sx={{
                                                    fontSize: '3rem',
                                                    fontWeight: 800,
                                                    lineHeight: 1,
                                                    color:
                                                        tier.price === 'Custom'
                                                            ? 'text.primary'
                                                            : 'primary.500',
                                                }}
                                            >
                                                {tier.price}
                                            </Typography>
                                            <Typography
                                                level="body-sm"
                                                sx={{
                                                    color: 'text.secondary',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 1,
                                                    fontSize: 'xs',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {tier.period}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Features */}
                                    <Box sx={{ flex: 1, mb: 6 }}>
                                        <Typography
                                            level="title-sm"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 3,
                                                color: 'text.primary',
                                            }}
                                        >
                                            What's included:
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2,
                                            }}
                                        >
                                            {tier.features.map(
                                                (feature, featureIndex) => (
                                                    <Box
                                                        key={featureIndex}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'flex-start',
                                                            gap: 2,
                                                        }}
                                                    >
                                                        <Check
                                                            sx={{
                                                                fontSize: 20,
                                                                color: 'success.500',
                                                                mt: 0.25,
                                                                flexShrink: 0,
                                                            }}
                                                        />
                                                        <Typography
                                                            level="body-sm"
                                                            sx={{
                                                                color: 'text.secondary',
                                                                lineHeight: 1.4,
                                                            }}
                                                        >
                                                            {feature}
                                                        </Typography>
                                                    </Box>
                                                )
                                            )}
                                        </Box>

                                        {/* Limitations */}
                                        {tier.limitations.length > 0 && (
                                            <Box sx={{ mt: 4 }}>
                                                <Typography
                                                    level="title-sm"
                                                    sx={{
                                                        fontWeight: 600,
                                                        mb: 2,
                                                        color: 'warning.600',
                                                    }}
                                                >
                                                    Limitations:
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 1,
                                                    }}
                                                >
                                                    {tier.limitations.map(
                                                        (
                                                            limitation,
                                                            limitIndex
                                                        ) => (
                                                            <Typography
                                                                key={limitIndex}
                                                                level="body-xs"
                                                                sx={{
                                                                    color: 'warning.500',
                                                                    fontStyle:
                                                                        'italic',
                                                                }}
                                                            >
                                                                • {limitation}
                                                            </Typography>
                                                        )
                                                    )}
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>

                                    {/* CTA Button */}
                                    <Button
                                        variant={
                                            tier.popular ? 'solid' : 'outlined'
                                        }
                                        color={tier.color}
                                        size="lg"
                                        fullWidth
                                        sx={{
                                            borderRadius: 'xl',
                                            py: 2,
                                            fontSize: 'lg',
                                            fontWeight: 600,
                                            mt: 'auto',
                                        }}
                                    >
                                        {tier.cta}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    )
}
