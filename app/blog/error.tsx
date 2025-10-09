'use client'
import React from 'react'
import { Button, Box, Typography } from '@/components/ui/joy'
import Link from 'next/link'

export default function BlogError({ reset }: { reset: () => void }) {
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
                Blog Page Error
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
                We couldn't load this blog content. You can retry or return to
                the blog index.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                <Button
                    variant="outlined"
                    color="neutral"
                    onClick={() => reset()}
                >
                    Retry
                </Button>
                <Link href="/blog" passHref>
                    <Button variant="solid" color="primary">
                        Back to Blog
                    </Button>
                </Link>
            </Box>
        </Box>
    )
}
