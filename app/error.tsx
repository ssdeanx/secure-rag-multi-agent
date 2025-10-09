'use client'
import React from 'react'
import { Button, Box, Typography } from '@/components/ui/joy'
import Link from 'next/link'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="en">
            <body>
                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        bgcolor: 'background.body',
                        py: { xs: 6, md: 8 }
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: 512,
                            mx: 'auto',
                            px: { xs: 2, sm: 3, md: 4 },
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3
                        }}
                    >
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                border: '1px solid',
                                borderColor: 'divider',
                                width: 96,
                                height: 96,
                                mx: 'auto',
                                position: 'relative',
                                overflow: 'hidden',
                                bgcolor: 'background.level1'
                            }}
                        >
                            <Typography
                                level="h2"
                                sx={{
                                    fontSize: '1.5rem',
                                    fontWeight: 800,
                                    color: 'danger.500',
                                    letterSpacing: 1
                                }}
                            >
                                ERR
                            </Typography>
                        </Box>
                        <Typography level="h1" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 800 }}>
                            Unexpected Error
                        </Typography>
                        <Typography
                            level="body-lg"
                            sx={{
                                color: 'text.secondary',
                                lineHeight: 1.6
                            }}
                        >
                            An unexpected error occurred while rendering this page.
                            The event has been recorded.
                        </Typography>
                        {error.digest !== undefined && error.digest !== '' && (
                            <Typography
                                level="body-sm"
                                sx={{
                                    color: 'text.tertiary',
                                    fontSize: '0.75rem'
                                }}
                            >
                                Ref: {error.digest}
                            </Typography>
                        )}
                        <Box
                            sx={{
                                borderRadius: 'md',
                                border: '1px solid',
                                borderColor: 'divider',
                                p: 2,
                                textAlign: 'left',
                                bgcolor: 'background.level1'
                            }}
                        >
                            <Typography level="body-sm" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                Security Notice
                            </Typography>
                            <Typography
                                level="body-xs"
                                sx={{
                                    color: 'text.secondary',
                                    mt: 0.5,
                                    lineHeight: 1.4
                                }}
                            >
                                We intentionally withhold internal error details to
                                protect system integrity.
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
                            <Button onClick={() => reset()} variant="solid" color="primary">
                                Retry
                            </Button>
                            <Link href="/" passHref>
                                <Button
                                    variant="outlined"
                                    color="neutral"
                                >
                                    Go Home
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </body>
        </html>
    )
}
