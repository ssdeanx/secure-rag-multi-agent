'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Box, Typography, Button, Card, CardContent } from '@/components/ui/joy'
import Link from 'next/link'

export function CTA() {
    const reduceMotion = useReducedMotion()
    const prefersReducedMotion = reduceMotion === true

    return (
        <Box
            component="section"
            aria-labelledby="cta-heading"
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
                <Card
                    variant="outlined"
                    sx={{
                        maxWidth: 768,
                        mx: 'auto',
                        borderWidth: 2,
                        borderColor: 'primary.300',
                        background: 'linear-gradient(135deg, var(--joy-palette-primary-softBg) 0%, var(--joy-palette-background-level1) 50%, var(--joy-palette-success-softBg) 100%)',
                        boxShadow: 'xl',
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    <CardContent sx={{ textAlign: 'center', p: { xs: 3, sm: 6 } }}>
                        <Typography
                            level="h2"
                            sx={{
                                fontSize: { xs: '2xl', sm: '3xl' },
                                fontWeight: 700,
                                mb: 3,
                            }}
                        >
                            Ready to Revolutionize Your Business?
                        </Typography>
                        <Typography
                            level="body-lg"
                            sx={{ color: 'text.secondary', mb: 4 }}
                        >
                            Explore the future of enterprise AI. Get started
                            with a demo or dive into our documentation.
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2,
                                justifyContent: 'center',
                            }}
                        >
                            <Link href="/demo-rag" passHref legacyBehavior>
                                <Button
                                    component="a"
                                    size="lg"
                                    sx={{ px: 4 }}
                                >
                                    Try the Demo
                                </Button>
                            </Link>
                            <Link href="/docs" passHref legacyBehavior>
                                <Button
                                    component="a"
                                    variant="outlined"
                                    size="lg"
                                    sx={{
                                        px: 4,
                                        borderWidth: 2,
                                        '&:hover': {
                                            borderColor: 'primary.500',
                                            bgcolor: 'primary.softBg',
                                        },
                                    }}
                                >
                                    Read the Docs
                                </Button>
                            </Link>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        </Box>
    )
}
