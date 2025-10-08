'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Box, Typography, Card, CardContent } from '@/components/ui/joy'
import { Security, Bolt, BarChart } from '@mui/icons-material'

const features = [
    {
        icon: <Security sx={{ fontSize: 32 }} />,
        title: 'Governed Access',
        description:
            'Ensure compliance with role-based access control on all AI interactions.',
    },
    {
        icon: <Bolt sx={{ fontSize: 32 }} />,
        title: 'Real-time Insights',
        description:
            'Get instant, data-driven answers from your private knowledge base.',
    },
    {
        icon: <BarChart sx={{ fontSize: 32 }} />,
        title: 'Analytics & Audits',
        description:
            'Monitor usage and maintain a complete audit trail of all AI conversations.',
    },
]

export function InteractiveFeatures() {
    const reduceMotion = useReducedMotion()
    const prefersReducedMotion = reduceMotion === true

    return (
        <Box
            component="section"
            aria-labelledby="features-heading"
            sx={{ py: 10, bgcolor: 'background.surface' }}
        >
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
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        level="h2"
                        sx={{ fontSize: '2xl', fontWeight: 700, mb: 2 }}
                    >
                        Powerful Features, Simply Delivered
                    </Typography>
                    <Typography level="body-lg" sx={{ color: 'text.secondary' }}>
                        Explore the core capabilities that make Governed RAG the
                        leader in governed AI.
                    </Typography>
                </Box>
            </motion.div>

            <Box
                component="ul"
                aria-label="Key product features"
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    gap: 4,
                    maxWidth: 1152,
                    mx: 'auto',
                    px: 2,
                    listStyle: 'none',
                    p: 0,
                }}
            >
                {features.map((feature, i) => (
                    <Box component="li" key={feature.title} sx={{ height: '100%' }}>
                        <motion.div
                            {...(prefersReducedMotion
                                ? {}
                                : {
                                      initial: { opacity: 0, y: 50 },
                                      whileInView: { opacity: 1, y: 0 },
                                      transition: {
                                          duration: 0.5,
                                          delay: i * 0.15,
                                      },
                                  })}
                            viewport={{ once: true }}
                            aria-label={`${feature.title} feature`}
                        >
                            <Card
                                variant="outlined"
                                sx={{
                                    height: '100%',
                                    textAlign: 'center',
                                    transition: 'all 0.3s',
                                    borderWidth: 2,
                                    bgcolor: 'background.level1',
                                    backdropFilter: 'blur(8px)',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 'xl',
                                        borderColor: 'primary.500',
                                    },
                                }}
                            >
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        aria-hidden="true"
                                        sx={{
                                            bgcolor: 'primary.softBg',
                                            borderRadius: '50%',
                                            p: 2,
                                            width: 'fit-content',
                                            color: 'primary.500',
                                            boxShadow: 'sm',
                                        }}
                                    >
                                        {feature.icon}
                                    </Box>
                                    <Typography level="h4" sx={{ fontWeight: 600 }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography level="body-md" sx={{ color: 'text.secondary' }}>
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}
