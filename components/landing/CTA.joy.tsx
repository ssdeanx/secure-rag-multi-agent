'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Link,
} from '@/components/ui/joy'
import { ArrowRight, PlayArrow } from '@mui/icons-material'

export function CTA() {
    const reduceMotion = useReducedMotion()
    const prefersReducedMotion = reduceMotion === true

    return (
        <Box
            component="section"
            aria-labelledby="cta-heading"
            sx={{
                py: { xs: 8, sm: 12 },
                bgcolor: 'background.surface',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background decoration */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.05,
                    backgroundImage:
                        'radial-gradient(circle at 50% 50%, var(--joy-palette-primary-500) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />

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
                        position: 'relative',
                        borderWidth: 2,
                        borderColor: 'primary.300',
                        background: (theme: any) =>
                            `linear-gradient(135deg, ${theme.vars.palette.primary.softBg} 0%, ${theme.vars.palette.background.level1} 50%, ${theme.vars.palette.success.softBg} 100%)`,
                        boxShadow: 'xl',
                        backdropFilter: 'blur(8px)',
                        transition: 'all 200ms ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 'xl',
                            borderColor: 'primary.400',
                        },
                    }}
                >
                    <CardContent
                        sx={{
                            textAlign: 'center',
                            p: { xs: 4, sm: 6 },
                        }}
                    >
                        <Typography
                            id="cta-heading"
                            level="h2"
                            sx={{
                                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                fontWeight: 700,
                                mb: 3,
                                lineHeight: 1.1,
                                color: 'text.primary',
                            }}
                        >
                            Experience Mastra Enterprise AI
                        </Typography>

                        <Typography
                            level="body-lg"
                            sx={{
                                mb: 4,
                                color: 'text.secondary',
                                maxWidth: 600,
                                mx: 'auto',
                                lineHeight: 1.6,
                            }}
                        >
                            Deploy enterprise-grade AI orchestration with
                            multi-agent security, content creation, research
                            automation, and complete compliance governance.
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
                            <Link href="/login">
                                <Button
                                    size="lg"
                                    color="primary"
                                    startDecorator={<PlayArrow />}
                                    sx={{
                                        px: 4,
                                        py: 2,
                                        fontWeight: 600,
                                        minWidth: 200,
                                        transition: 'all 160ms ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 'lg',
                                        },
                                        '&:focus-visible': {
                                            outline: 'none',
                                            boxShadow:
                                                '0 0 0 4px var(--joy-palette-focusVisible)',
                                        },
                                    }}
                                >
                                    Get Started
                                </Button>
                            </Link>

                            <Link href="/contact">
                                <Button
                                    variant="outlined"
                                    size="lg"
                                    color="neutral"
                                    endDecorator={<ArrowRight />}
                                    sx={{
                                        px: 4,
                                        py: 2,
                                        fontWeight: 600,
                                        minWidth: 200,
                                        borderWidth: 2,
                                        transition: 'all 160ms ease',
                                        '&:hover': {
                                            borderColor: 'primary.500',
                                            bgcolor: 'primary.softBg',
                                            transform: 'translateY(-2px)',
                                        },
                                        '&:focus-visible': {
                                            outline: 'none',
                                            boxShadow:
                                                '0 0 0 4px var(--joy-palette-focusVisible)',
                                        },
                                    }}
                                >
                                    Contact Sales
                                </Button>
                            </Link>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        </Box>
    )
}
