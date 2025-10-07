'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CTA() {
    const reduceMotion = useReducedMotion()
    const prefersReducedMotion = reduceMotion === true
    return (
        <section
            aria-labelledby="cta-heading"
            className="py-20 bg-background text-foreground"
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
                <Card className="max-w-3xl mx-auto border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/10 shadow-2xl shadow-primary/10 backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <CardTitle
                            id="cta-heading"
                            className="text-3xl sm:text-4xl font-bold cta-heading-shadow"
                        >
                            Ready to Revolutionize Your Business?
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground/90 text-lg mb-8 text-center">
                            Explore the future of enterprise AI. Get started
                            with a demo or dive into our documentation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90 transition-colors"
                                asChild
                            >
                                <a href="/demo-rag">Try the Demo</a>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-foreground/20 hover:border-primary hover:bg-primary/5 transition-colors"
                                asChild
                            >
                                <a href="/docs">Read the Docs</a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </section>
    )
}
