'use client'
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

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
        <section
            aria-labelledby="about-hero-heading"
            className="py-24 text-center bg-gradient-to-b from-background via-background to-primary/5"
        >
            <motion.div {...base} className="max-w-4xl mx-auto px-4 space-y-6">
                <Badge variant="secondary" className="px-4 py-1 text-sm">
                    Our Story
                </Badge>
                <h1
                    id="about-hero-heading"
                    className="text-4xl sm:text-6xl font-bold tracking-tight"
                >
                    Building Trustworthy Enterprise AI
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                    We are on a mission to make Retrieval-Augmented Generation
                    safe for the enterprise—without sacrificing velocity,
                    creativity, or governance.
                </p>
            </motion.div>
        </section>
    )
}
