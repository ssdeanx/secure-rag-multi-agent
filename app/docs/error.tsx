'use client'
import React from 'react'
import { Button, Box, Typography } from '@/components/ui/joy'
import Link from 'next/link'

export default function DocsError({ reset }: { reset: () => void }) {
    return (
        <Box
            component="div"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                p: 4,
                minHeight: '50vh',
                textAlign: 'center',
            }}
        >
            <Typography level="h2" sx={{ fontWeight: 800 }}>
                Documentation Unavailable
            </Typography>
            <Typography
                level="body-lg"
                sx={{
                    color: 'text.secondary',
                    maxWidth: 400,
                    mx: 'auto',
                    lineHeight: 1.6,
                }}
            >
                Something went wrong rendering this documentation page. The
                issue has been logged. You may retry or return to the docs home.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                <Button
                    variant="outlined"
                    color="neutral"
                    onClick={() => reset()}
                >
                    Retry
                </Button>
                <Link href="/docs" passHref>
                    <Button variant="solid" color="primary">
                        Back to Docs
                    </Button>
                </Link>
            </Box>
        </Box>
    )
}
