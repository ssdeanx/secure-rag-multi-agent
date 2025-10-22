'use client'

import {
    Box,
    Typography,
    Divider,
    Chip,
    Link,
} from '@/components/ui/joy'
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
                mt: 'auto', // Push footer to bottom
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
                                    transition: 'all 200ms ease',
                                    '&:hover': {
                                        bgcolor: 'primary.600',
                                        transform: 'scale(1.05)',
                                    },
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
                                            transition: 'all 160ms ease',
                                            '&:hover': {
                                                bgcolor: 'primary.softBg',
                                                borderColor: 'primary.500',
                                                transform: 'translateY(-1px)',
                                            },
                                            '&:focus-visible': {
                                                outline: 'none',
                                                boxShadow:
                                                    '0 0 0 4px var(--joy-palette-focusVisible)',
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
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: 'text.primary',
                            }}
                        >
                            Product
                        </Typography>
                        <Box component="nav" aria-label="Product links">
                            <Box
                                component="ul"
                                sx={{ listStyle: 'none', m: 0, p: 0 }}
                            >
                                {footerLinks.product.map((link) => (
                                    <Box
                                        component="li"
                                        key={link.href}
                                        sx={{ mb: 1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            level="body-sm"
                                            underline="hover"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {link.label}
                                        </Link>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    {/* Company Column */}
                    <Box>
                        <Typography
                            level="body-sm"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: 'text.primary',
                            }}
                        >
                            Company
                        </Typography>
                        <Box component="nav" aria-label="Company links">
                            <Box
                                component="ul"
                                sx={{ listStyle: 'none', m: 0, p: 0 }}
                            >
                                {footerLinks.company.map((link) => (
                                    <Box
                                        component="li"
                                        key={link.href}
                                        sx={{ mb: 1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            level="body-sm"
                                            underline="hover"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {link.label}
                                        </Link>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    {/* Resources Column */}
                    <Box>
                        <Typography
                            level="body-sm"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: 'text.primary',
                            }}
                        >
                            Resources
                        </Typography>
                        <Box component="nav" aria-label="Resources links">
                            <Box
                                component="ul"
                                sx={{ listStyle: 'none', m: 0, p: 0 }}
                            >
                                {footerLinks.resources.map((link) => (
                                    <Box
                                        component="li"
                                        key={link.href}
                                        sx={{ mb: 1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            level="body-sm"
                                            underline="hover"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {link.label}
                                        </Link>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    {/* Legal Column */}
                    <Box>
                        <Typography
                            level="body-sm"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: 'text.primary',
                            }}
                        >
                            Legal
                        </Typography>
                        <Box component="nav" aria-label="Legal links">
                            <Box
                                component="ul"
                                sx={{ listStyle: 'none', m: 0, p: 0 }}
                            >
                                {footerLinks.legal.map((link) => (
                                    <Box
                                        component="li"
                                        key={link.href}
                                        sx={{ mb: 1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            level="body-sm"
                                            underline="hover"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {link.label}
                                        </Link>
                                    </Box>
                                ))}
                            </Box>
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
                            sx={{
                                fontWeight: 500,
                                '&:hover': {
                                    bgcolor: 'success.softHoverBg',
                                },
                            }}
                        >
                            Vector DB: PostgreSQL + PgVector
                        </Chip>
                        <Chip
                            variant="soft"
                            color="primary"
                            size="sm"
                            startDecorator={<Language sx={{ fontSize: 16 }} />}
                            sx={{
                                fontWeight: 500,
                                '&:hover': {
                                    bgcolor: 'primary.softHoverBg',
                                },
                            }}
                        >
                            Powered by Mastra
                        </Chip>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
