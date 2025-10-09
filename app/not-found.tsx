import React from 'react'
import { Button, Box, Typography } from '@/components/ui/joy'
import Link from 'next/link'

export default function NotFound() {
    return (
        <Box
            component="main"
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
                        level="h1"
                        sx={{
                            fontSize: '2rem',
                            fontWeight: 800,
                            color: 'warning.500',
                            letterSpacing: 1
                        }}
                    >
                        404
                    </Typography>
                </Box>
                <Typography level="h2" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 800 }}>
                    Page Not Found
                </Typography>
                <Typography
                    level="body-lg"
                    sx={{
                        color: 'text.secondary',
                        lineHeight: 1.6
                    }}
                >
                    We couldn't find the page you're looking for. It may have
                    been moved or removed.
                </Typography>
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
                        Security & Integrity
                    </Typography>
                    <Typography
                        level="body-xs"
                        sx={{
                            color: 'text.secondary',
                            mt: 0.5,
                            lineHeight: 1.4
                        }}
                    >
                        If you followed a link here, it might be outdated. We
                        log 404s to help improve navigation and detect
                        enumeration attempts.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
                    <Link href="/" passHref>
                        <Button
                            variant="solid"
                            color="primary"
                        >
                            Return Home
                        </Button>
                    </Link>
                    <Link href="/docs" passHref>
                        <Button
                            variant="outlined"
                            color="neutral"
                        >
                            View Docs
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Box>
    )
}
