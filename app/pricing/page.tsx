'use client'

import { Box, Typography, Button, Card, Chip, Slider, Switch } from '@/components/ui/joy'
import { Check, ArrowForward } from '@mui/icons-material'
import { useState } from 'react'
import Link from 'next/link'

export default function PricingPage() {
    const [annual, setAnnual] = useState(false)
    const [docCount, setDocCount] = useState(10000)

    const calculatePrice = (basePrice: number) => {
        const price = annual ? basePrice * 10 : basePrice
        return annual ? `$${price}/year` : `$${price}/month`
    }

    const tiers = [
        {
            name: 'Free',
            price: '$0',
            desc: 'Perfect for testing and small projects',
            features: ['1,000 documents', '100 API requests/day', '5 users', 'Community support', 'Basic security'],
            cta: 'Start Free',
            href: '/login',
            highlight: false,
        },
        {
            name: 'Pro',
            price: calculatePrice(49),
            desc: 'For growing teams and production apps',
            features: ['50,000 documents', '10,000 API requests/day', 'Unlimited users', 'Priority email support', 'Enterprise security', 'Advanced analytics', 'Custom integrations'],
            cta: 'Start Trial',
            href: '/login',
            highlight: true,
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            desc: 'For large organizations with custom needs',
            features: ['Unlimited documents', 'Unlimited API requests', 'Unlimited users', '24/7 phone support', 'Bank-grade security', 'Real-time dashboard', 'White-label', 'On-premise deployment'],
            cta: 'Contact Sales',
            href: '/contact',
            highlight: false,
        },
    ]

    return (
        <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.surface', py: { xs: 8, md: 12 }, px: { xs: 2, sm: 4 } }}>
            <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography level="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800, mb: 2 }}>Simple, Transparent Pricing</Typography>
                    <Typography level="h4" sx={{ color: 'text.secondary', mb: 4 }}>Start free, scale as you grow. No hidden fees.</Typography>

                    {/* Billing Toggle */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                        <Typography level="body-lg" sx={{ fontWeight: annual ? 400 : 600 }}>Monthly</Typography>
                        <Switch checked={annual} onChange={(e) => setAnnual(e.target.checked)} />
                        <Typography level="body-lg" sx={{ fontWeight: annual ? 600 : 400 }}>Annual <Chip size="sm" color="success" variant="soft">Save 20%</Chip></Typography>
                    </Box>
                </Box>

                {/* Pricing Cards */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, mb: 8 }}>
                    {tiers.map((tier, i) => (
                        <Card
                            key={i}
                            variant={tier.highlight ? 'solid' : 'outlined'}
                            color={tier.highlight ? 'primary' : 'neutral'}
                            sx={{
                                p: 4,
                                borderRadius: 'xl',
                                transform: tier.highlight ? 'scale(1.05)' : 'scale(1)',
                                transition: 'all 0.2s',
                                '&:hover': { transform: tier.highlight ? 'scale(1.08)' : 'scale(1.02)', boxShadow: 'xl' },
                            }}
                        >
                            {tier.highlight && <Chip size="sm" variant="soft" sx={{ position: 'absolute', top: 16, right: 16 }}>Popular</Chip>}
                            <Typography level="h4" sx={{ mb: 1, fontWeight: 700 }}>{tier.name}</Typography>
                            <Typography level="h2" sx={{ mb: 1, fontSize: '2.5rem', fontWeight: 800 }}>{tier.price}</Typography>
                            <Typography level="body-sm" sx={{ mb: 3, opacity: 0.8 }}>{tier.desc}</Typography>
                            <Link href={tier.href} passHref style={{ textDecoration: 'none' }}>
                                <Button fullWidth variant={tier.highlight ? 'solid' : 'outlined'} size="lg" sx={{ mb: 3 }} endDecorator={<ArrowForward />}>
                                    {tier.cta}
                                </Button>
                            </Link>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {tier.features.map((feature, j) => (
                                    <Box key={j} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Check sx={{ fontSize: 18, color: tier.highlight ? 'inherit' : 'success.500' }} />
                                        <Typography level="body-sm">{feature}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Card>
                    ))}
                </Box>

                {/* Interactive Calculator */}
                <Card variant="outlined" sx={{ p: 6, borderRadius: 'xl', maxWidth: '800px', mx: 'auto', mb: 8 }}>
                    <Typography level="h3" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>Estimate Your Costs</Typography>
                    <Box sx={{ mb: 4 }}>
                        <Typography level="body-md" sx={{ mb: 2 }}>Number of documents: <strong>{docCount.toLocaleString()}</strong></Typography>
                        <Slider
                            value={docCount}
                            onChange={(_, value) => setDocCount(value as number)}
                            min={1000}
                            max={100000}
                            step={1000}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                    <Box sx={{ p: 4, borderRadius: 'lg', bgcolor: 'background.level1', textAlign: 'center' }}>
                        <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 1 }}>Recommended Plan</Typography>
                        <Typography level="h2" sx={{ fontSize: '2rem', fontWeight: 800, mb: 1 }}>
                            {docCount <= 1000 ? 'Free' : docCount <= 50000 ? 'Pro' : 'Enterprise'}
                        </Typography>
                        <Typography level="h3" sx={{ color: 'primary.500', mb: 2 }}>
                            {docCount <= 1000 ? '$0' : docCount <= 50000 ? calculatePrice(49) : 'Custom pricing'}
                        </Typography>
                        <Link href="/login" passHref style={{ textDecoration: 'none' }}>
                            <Button size="lg" endDecorator={<ArrowForward />}>Get Started</Button>
                        </Link>
                    </Box>
                </Card>

                {/* FAQ */}
                <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center' }}>
                    <Typography level="h3" sx={{ mb: 4, fontWeight: 700 }}>Questions?</Typography>
                    <Typography level="body-lg" sx={{ color: 'text.secondary', mb: 3 }}>
                        All plans include 14-day free trial, no credit card required. Cancel anytime.
                    </Typography>
                    <Link href="/contact" passHref style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" size="lg">Contact Sales</Button>
                    </Link>
                </Box>
            </Box>
        </Box>
    )
}


