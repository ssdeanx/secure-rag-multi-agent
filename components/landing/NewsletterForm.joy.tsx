'use client'

import * as React from 'react'
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Box, Typography, Input, Button, Alert } from '@/components/ui/joy'

export function NewsletterForm() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const reduceMotion = useReducedMotion()
    const prefersReducedMotion = reduceMotion === true

    // add helper to bypass BoxProps typing for attributes like role
    const statusProps = {
        role: 'status',
    } as React.HTMLAttributes<HTMLDivElement>

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        const trimmed = email.trim()
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setError('Please enter a valid email')
            return
        }

        try {
            setLoading(true)
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: trimmed }),
            })

            if (!res.ok) {
                const data = await res
                    .json()
                    .catch(() => ({}) as { error?: string })
                throw new Error(data?.error ?? 'Subscription failed')
            }

            setSubmitted(true)
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            setError(message ?? 'An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box component="section" sx={{ py: 10, bgcolor: 'background.surface' }}>
            <Box sx={{ maxWidth: 768, mx: 'auto', px: 2, textAlign: 'center' }}>
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
                    <Typography
                        level="h2"
                        sx={{ fontSize: '2xl', fontWeight: 700, mb: 2 }}
                    >
                        Stay Ahead of the Curve
                    </Typography>
                    <Typography
                        level="body-lg"
                        sx={{ color: 'text.secondary', mb: 4 }}
                    >
                        Subscribe to our newsletter for the latest on AI,
                        security, and enterprise tech.
                    </Typography>

                    <Box
                        aria-live="polite"
                        aria-atomic="true"
                        {...statusProps}
                        sx={{ minHeight: '2rem', mb: 2 }}
                    >
                        {submitted && (
                            <Alert color="success" variant="soft">
                                Thanks! You're subscribed.
                            </Alert>
                        )}
                    </Box>

                    {!submitted && (
                        <Box
                            component="form"
                            {...({
                                onSubmit: handleSubmit,
                                noValidate: true,
                            } as React.FormHTMLAttributes<HTMLFormElement>)}
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2,
                                maxWidth: 448,
                                mx: 'auto',
                            }}
                        >
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                aria-label="Email for newsletter"
                                aria-invalid={!!error}
                                aria-describedby={
                                    error ? 'newsletter-error' : undefined
                                }
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                                sx={{ flexGrow: 1 }}
                            />
                            <Button
                                type="submit"
                                size="lg"
                                disabled={loading}
                                loading={loading}
                                sx={{ flexShrink: 0 }}
                            >
                                {loading ? 'Submitting…' : 'Subscribe'}
                            </Button>
                        </Box>
                    )}

                    {error && !submitted && (
                        <Box
                            {...({
                                id: 'newsletter-error',
                                role: 'alert',
                            } as React.HTMLAttributes<HTMLDivElement>)}
                            sx={{ mt: 2 }}
                        >
                            <Typography
                                level="body-sm"
                                sx={{ color: 'danger.500' }}
                            >
                                {error}
                            </Typography>
                        </Box>
                    )}
                </motion.div>
            </Box>
        </Box>
    )
}
