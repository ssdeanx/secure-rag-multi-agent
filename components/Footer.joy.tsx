'use client'

import { Box, Typography, Divider, Chip } from '@/components/ui/joy'
import Link from 'next/link'
import {
    GitHub,
    Language,
    Storage,
    Twitter,
    LinkedIn,
} from '@mui/icons-material'

const footerLinks = {
    product: [
        { label: 'Features', href: '/#features' },
        { label: 'Documentation', href: '/docs' },
        { label: 'API Reference', href: '/docs/api-reference' },
        { label: 'Changelog', href: '/blog' },
    ],
    company: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
        { label: 'Careers', href: '/careers' },
    ],
    resources: [
        { label: 'Quick Start', href: '/docs/quick-start' },
        { label: 'Architecture', href: '/docs/architecture' },
        { label: 'Security', href: '/docs/security' },
        { label: 'Demo Roles', href: '/docs/demo-roles' },
    ],
    legal: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'License', href: '/license' },
    ],
}

const socialLinks = [
    { icon: GitHub, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: LinkedIn, href: 'https://linkedin.com', label: 'LinkedIn' },
]

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'background.surface',
                borderTop: '1px solid',
                borderColor: 'divider',
                pt: { xs: 6, sm: 8 },
                pb: 4,
            }}
        >
            <Box
                sx={{
                    maxWidth: '1400px',
                    mx: 'auto',
                    px: { xs: 3, sm: 4 },
                }}
            >
                {/* Main Footer Content */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1fr 1fr',
                            md: 'repeat(5, 1fr)',
                        },
                        gap: { xs: 4, md: 6 },
                        mb: 6,
                    }}
                >
                    {/* Brand Column */}
                    <Box sx={{ gridColumn: { xs: '1', md: 'span 1' } }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                mb: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 'md',
                                    bgcolor: 'primary.500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography
                                    level="h4"
                                    sx={{
                                        color: 'white',
                                        fontWeight: 700,
                                    }}
                                >
                                    G
                                </Typography>
                            </Box>
                            <Typography level="h4" sx={{ fontWeight: 700 }}>
                                Deanmachines
                            </Typography>
                        </Box>
                        <Typography
                            level="body-sm"
                            sx={{
                                color: 'text.secondary',
                                mb: 3,
                                lineHeight: 1.6,
                            }}
                        >
                            Secure, enterprise-grade RAG with role-based access
                            control and multi-agent orchestration.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                >
                                    <Box
                                        component="span"
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minWidth: 40,
                                            p: 1,
                                            borderRadius: 'sm',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            textDecoration: 'none',
                                            '&:hover': {
                                                bgcolor: 'primary.softBg',
                                                borderColor: 'primary.500',
                                            },
                                        }}
                                    >
                                        <social.icon fontSize="small" />
                                    </Box>
                                </Link>
                            ))}
                        </Box>
                    </Box>

                    {/* Product Column */}
                    <Box>
                        <Typography
                            level="body-sm"
                            sx={{ fontWeight: 700, mb: 2 }}
                        >
                            Product
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.5,
                            }}
                        >
                            {footerLinks.product.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    <Typography
                                        component="span"
                                        level="body-sm"
                                        sx={{
                                            color: 'text.secondary',
                                            textDecoration: 'none',
                                            '&:hover': {
                                                color: 'primary.500',
                                            },
                                        }}
                                    >
                                        {link.label}
                                    </Typography>
                                </Link>
                            ))}
                        </Box>
                    </Box>

                    {/* Company Column */}
                    <Box>
                        <Typography
                            level="body-sm"
                            sx={{ fontWeight: 700, mb: 2 }}
                        >
                            Company
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.5,
                            }}
                        >
                            {footerLinks.company.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    <Typography
                                        component="span"
                                        level="body-sm"
                                        sx={{
                                            color: 'text.secondary',
                                            textDecoration: 'none',
                                            '&:hover': {
                                                color: 'primary.500',
                                            },
                                        }}
                                    >
                                        {link.label}
                                    </Typography>
                                </Link>
                            ))}
                        </Box>
                    </Box>

                    {/* Resources Column */}
                    <Box>
                        <Typography
                            level="body-sm"
                            sx={{ fontWeight: 700, mb: 2 }}
                        >
                            Resources
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.5,
                            }}
                        >
                            {footerLinks.resources.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    <Typography
                                        component="span"
                                        level="body-sm"
                                        sx={{
                                            color: 'text.secondary',
                                            textDecoration: 'none',
                                            '&:hover': {
                                                color: 'primary.500',
                                            },
                                        }}
                                    >
                                        {link.label}
                                    </Typography>
                                </Link>
                            ))}
                        </Box>
                    </Box>

                    {/* Legal Column */}
                    <Box>
                        <Typography
                            level="body-sm"
                            sx={{ fontWeight: 700, mb: 2 }}
                        >
                            Legal
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.5,
                            }}
                        >
                            {footerLinks.legal.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    <Typography
                                        component="span"
                                        level="body-sm"
                                        sx={{
                                            color: 'text.secondary',
                                            textDecoration: 'none',
                                            '&:hover': {
                                                color: 'primary.500',
                                            },
                                        }}
                                    >
                                        {link.label}
                                    </Typography>
                                </Link>
                            ))}
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Bottom Bar */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 2,
                    }}
                >
                    <Typography
                        level="body-sm"
                        sx={{ color: 'text.secondary' }}
                    >
                        © {currentYear} Deanmachines. All rights reserved.
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Chip
                            variant="soft"
                            color="success"
                            size="sm"
                            startDecorator={<Storage sx={{ fontSize: 16 }} />}
                        >
                            Vector DB: PostgreSQL + PgVector
                        </Chip>
                        <Chip
                            variant="soft"
                            color="primary"
                            size="sm"
                            startDecorator={<Language sx={{ fontSize: 16 }} />}
                        >
                            Powered by Mastra
                        </Chip>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
