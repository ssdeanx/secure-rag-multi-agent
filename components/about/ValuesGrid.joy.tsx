'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Box, Typography, Card, CardContent } from '@/components/ui/joy'

interface ValueItem {
    title: string
    description: string
}

const values: ValueItem[] = [
    {
        title: 'Security First',
        description:
            'Zero-trust assumptions and continuous verification across every layer.',
    },
    {
        title: 'Transparency',
        description:
            'Clear audit trails, reproducible workflows, and explainable access decisions.',
    },
    {
        title: 'Velocity',
        description:
            'Tooling that accelerates safe experimentation without governance trade-offs.',
    },
    {
        title: 'Resilience',
        description:
            'Systems designed for graceful failure, observability, and recovery.',
    },
]

export function ValuesGrid() {
    const reduce = useReducedMotion()
    const prefReduce = reduce === true

    return (
        <Box
            component="section"
            aria-labelledby="values-heading"
            sx={{ py: 10 }}
        >
            <Box sx={{ maxWidth: 1152, mx: 'auto', px: 2 }}>
                <Box sx={{ mb: 5, textAlign: 'center' }}>
                    <Typography
                        level="h2"
                        sx={{ fontSize: '2xl', fontWeight: 700, mb: 1.5 }}
                    >
                        Our Core Values
                    </Typography>
                    <Typography
                        level="body-lg"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: 640,
                            mx: 'auto',
                        }}
                    >
                        Principles that guide every design decision—from API
                        surface to user onboarding.
                    </Typography>
                </Box>

                <Box
                    component="ul"
                    aria-label="Company values"
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            lg: 'repeat(4, 1fr)',
                        },
                        gap: 3,
                        listStyle: 'none',
                        p: 0,
                    }}
                >
                    {values.map((val, i) => (
                        <Box component="li" key={val.title}>
                            <motion.div
                                {...(prefReduce
                                    ? {}
                                    : {
                                          initial: { opacity: 0, y: 24 },
                                          whileInView: { opacity: 1, y: 0 },
                                          transition: {
                                              duration: 0.5,
                                              delay: i * 0.1,
                                          },
                                      })}
                                viewport={{ once: true }}
                            >
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        transition: 'all 0.3s',
                                        borderWidth: 2,
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 'lg',
                                            borderColor: 'primary.400',
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            level="h4"
                                            sx={{
                                                fontSize: 'lg',
                                                fontWeight: 600,
                                                mb: 1,
                                            }}
                                        >
                                            {val.title}
                                        </Typography>
                                        <Typography
                                            level="body-sm"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {val.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}
