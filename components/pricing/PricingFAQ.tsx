import {
    Box,
    Typography,
    AccordionGroup,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@/components/ui/joy'
import { Help } from '@mui/icons-material'

const faqs = [
    {
        question: 'Can I change plans at any time?',
        answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.",
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and wire transfers for Enterprise customers.',
    },
    {
        question: 'Is there a free trial for paid plans?',
        answer: 'Yes! Pro plans include a 14-day free trial. Enterprise plans can be customized with extended trial periods.',
    },
    {
        question: 'What happens if I exceed my document or API limits?',
        answer: "We'll notify you when you approach your limits. You can upgrade your plan or purchase additional capacity as needed.",
    },
    {
        question:
            'Do you offer discounts for non-profits or educational institutions?',
        answer: 'Yes, we offer special pricing for qualified non-profit organizations and educational institutions. Contact our sales team for details.',
    },
    {
        question: 'Is my data secure?',
        answer: 'Absolutely. All plans include enterprise-grade security with end-to-end encryption, regular security audits, and compliance with GDPR, HIPAA, and SOC 2 standards.',
    },
    {
        question: 'Can I cancel my subscription anytime?',
        answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
    },
    {
        question: 'Do you offer on-premise deployment?',
        answer: 'Yes, Enterprise plans include on-premise deployment options for customers with strict data residency requirements.',
    },
]

export function PricingFAQ() {
    return (
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.level1' }}>
            <Box
                sx={{
                    maxWidth: '800px',
                    mx: 'auto',
                    px: { xs: 2, sm: 4 },
                }}
            >
                {/* Section Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 'xl',
                            bgcolor: 'info.softBg',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3,
                        }}
                    >
                        <Help sx={{ fontSize: 32, color: 'info.500' }} />
                    </Box>
                    <Typography
                        level="h2"
                        sx={{
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            fontWeight: 700,
                            mb: 3,
                        }}
                    >
                        Frequently Asked Questions
                    </Typography>
                    <Typography
                        level="body-lg"
                        sx={{
                            color: 'text.secondary',
                            fontSize: '1.125rem',
                        }}
                    >
                        Everything you need to know about our pricing and plans.
                    </Typography>
                </Box>

                {/* FAQ Accordion */}
                <AccordionGroup
                    variant="outlined"
                    sx={{
                        borderRadius: 'xl',
                        overflow: 'hidden',
                        '& .MuiAccordion-root': {
                            borderRadius: 0,
                            '&:first-of-type': {
                                borderTopLeftRadius: '12px',
                                borderTopRightRadius: '12px',
                            },
                            '&:last-of-type': {
                                borderBottomLeftRadius: '12px',
                                borderBottomRightRadius: '12px',
                            },
                        },
                    }}
                >
                    {faqs.map((faq, index) => (
                        <Accordion key={index}>
                            <AccordionSummary
                                sx={{
                                    fontWeight: 600,
                                    py: 3,
                                    '&:hover': {
                                        bgcolor: 'background.level2',
                                    },
                                }}
                            >
                                <Typography level="title-md">
                                    {faq.question}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    pb: 3,
                                    color: 'text.secondary',
                                    lineHeight: 1.6,
                                }}
                            >
                                <Typography level="body-md">
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </AccordionGroup>
            </Box>
        </Box>
    )
}
