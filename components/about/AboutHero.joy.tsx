'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Box, Typography, Chip } from '@/components/ui/joy'

export function AboutHero() {
    const reduce = useReducedMotion()
    const base =
        reduce === true
            ? {}
            : {
                  initial: { opacity: 0, y: 40 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.8 },
              }

    return (
        <Box
            component="section"
            aria-labelledby="about-hero-heading"
            sx={{
                py: 12,
                textAlign: 'center',
                background: 'linear-gradient(to bottom, var(--joy-palette-background-surface) 0%, var(--joy-palette-background-surface) 50%, var(--joy-palette-primary-softBg) 100%)',
            }}
        >
            <motion.div {...base}>
                <Box sx={{ maxWidth: 896, mx: 'auto', px: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Chip variant="soft" color="neutral" size="lg" sx={{ alignSelf: 'center' }}>
                        Our Story
                    </Chip>
                    <Typography
                        level="h1"
                        sx={{
                            fontSize: { xs: '3xl', sm: '5xl' },
                            fontWeight: 700,
                        }}
                    >
                        Building Trustworthy Enterprise AI
                    </Typography>
                    <Typography
                        level="body-lg"
                        sx={{
                            fontSize: { xs: 'lg', sm: 'xl' },
                            color: 'text.secondary',
                            lineHeight: 1.6,
                        }}
                    >
                        We are on a mission to make Retrieval-Augmented Generation
                        safe for the enterprise—without sacrificing velocity,
                        creativity, or governance.
                    </Typography>
                </Box>
            </motion.div>
        </Box>
    )
}
