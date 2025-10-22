'use client'

import { useState } from 'react'
import {
    Box,
    Button,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    Link,
} from '@/components/ui/joy'
import type { Theme } from '@mui/joy/styles'
import { usePathname, useRouter } from 'next/navigation'
import {
    Menu as MenuIcon,
    Close,
    Home,
    Description,
    Info,
    ContactMail,
    Article,
    Login,
    RocketLaunch,
    Star,
    Payment,
} from '@mui/icons-material'
import { ThemeToggle } from './ThemeToggle.joy'
import { UserMenu } from './UserMenu.joy'

interface TopNavigationProps {
    user?: {
        name: string
        email: string
        role: string
        avatar?: string
    }
}

const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/features', label: 'Features', icon: Star },
    { href: '/pricing', label: 'Pricing', icon: Payment },
    { href: '/docs', label: 'Docs', icon: Description },
    { href: '/about', label: 'About', icon: Info },
    { href: '/blog', label: 'Blog', icon: Article },
    { href: '/contact', label: 'Contact', icon: ContactMail },
]

export function TopNavigation({ user }: TopNavigationProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === href
        }
        return pathname?.startsWith(href)
    }

    const toggleMobileMenu = () => setMobileOpen(!mobileOpen)

    return (
        <>
            <Box
                component="nav"
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    bgcolor: 'transparent',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    // Enhanced gradient surface using Joy tokens
                    backgroundImage: (theme: Theme) =>
                        `linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 100%), ${theme.vars.palette.background.surface}`,
                    // Subtle elevated feel with theme shadows
                    boxShadow: { xs: 'none', md: 'sm' },
                }}
            >
                <Box
                    sx={{
                        maxWidth: '1400px',
                        mx: 'auto',
                        px: { xs: 2, sm: 4 },
                        py: { xs: 1.5, md: 2 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        aria-label="Deanmachines home"
                        sx={{ textDecoration: 'none' }}
                    >
                        <Box
                            component="span"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                textDecoration: 'none',
                                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: 'scale(1)',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    filter: 'drop-shadow(0 4px 12px rgba(62, 207, 142, 0.3))',
                                },
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
                                    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: 'rotate(0deg)',
                                    '&:hover': {
                                        bgcolor: 'primary.600',
                                        transform: 'rotate(5deg) scale(1.05)',
                                        boxShadow: '0 8px 25px rgba(62, 207, 142, 0.4)',
                                    },
                                }}
                            >
                                <RocketLaunch
                                    sx={{
                                        color: 'white',
                                        fontSize: 22,
                                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        transform: 'translateY(0px)',
                                        '&:hover': {
                                            transform: 'translateY(-2px) scale(1.1)',
                                        },
                                    }}
                                />
                            </Box>
                            <Typography
                                level="h4"
                                sx={{
                                    fontWeight: 700,
                                    display: { xs: 'none', sm: 'block' },
                                    color: 'text.primary',
                                    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                    textShadow: '0 0 0 transparent',
                                    '&:hover': {
                                        color: 'primary.500',
                                        textShadow: '0 0 20px rgba(62, 207, 142, 0.3)',
                                    },
                                }}
                            >
                                Deanmachines
                            </Typography>
                        </Box>
                    </Link>

                    {/* Desktop Navigation */}
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 0.5,
                        }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={
                                    isActive(link.href) ? 'page' : undefined
                                }
                            >
                                <Button
                                    component="span"
                                    variant={
                                        isActive(link.href) ? 'soft' : 'plain'
                                    }
                                    color={
                                        isActive(link.href)
                                            ? 'primary'
                                            : 'neutral'
                                    }
                                    sx={{
                                        position: 'relative',
                                        fontWeight: isActive(link.href)
                                            ? 700
                                            : 500,
                                        borderRadius: 'lg',
                                        px: 1.75,
                                        py: 0.75,
                                        minWidth: 44,
                                        minHeight: 40,
                                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        transform: 'translateY(0px)',
                                        '&:hover': {
                                            bgcolor: isActive(link.href)
                                                ? 'primary.softHoverBg'
                                                : 'neutral.softHoverBg',
                                            transform: 'translateY(-2px)',
                                            boxShadow: isActive(link.href)
                                                ? '0 6px 20px rgba(62, 207, 142, 0.25)'
                                                : '0 4px 15px rgba(0, 0, 0, 0.1)',
                                        },
                                        '&:focus-visible': {
                                            outline: 'none',
                                            boxShadow:
                                                '0 0 0 4px var(--joy-palette-focusVisible)',
                                            transform: 'translateY(-1px)',
                                        },
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            left: 12,
                                            right: 12,
                                            bottom: -6,
                                            height: 2,
                                            borderRadius: 2,
                                            bgcolor: isActive(link.href)
                                                ? 'var(--joy-palette-primary-500)'
                                                : 'transparent',
                                            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                            transform: 'scaleX(1)',
                                        },
                                        '&:hover::after': {
                                            bgcolor: isActive(link.href)
                                                ? 'var(--joy-palette-primary-500)'
                                                : 'var(--joy-palette-neutral-400)',
                                            opacity: 0.75,
                                            transform: 'scaleX(1.1)',
                                        },
                                    }}
                                >
                                    {link.label}
                                </Button>
                            </Link>
                        ))}
                    </Box>

                    {/* Right Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ThemeToggle />

                        {user ? (
                            <UserMenu user={user} />
                        ) : (
                            <Link href="/login">
                                <Button
                                    component="span"
                                    variant="solid"
                                    color="primary"
                                    aria-label="Sign in"
                                    startDecorator={<Login />}
                                    sx={{
                                        display: { xs: 'none', sm: 'flex' },
                                        borderRadius: 'lg',
                                        minWidth: 44,
                                        minHeight: 40,
                                        fontWeight: 600,
                                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        transform: 'translateY(0px)',
                                        boxShadow: '0 2px 8px rgba(62, 207, 142, 0.2)',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(62, 207, 142, 0.4)',
                                            bgcolor: 'primary.600',
                                        },
                                        '&:focus-visible': {
                                            outline: 'none',
                                            boxShadow:
                                                '0 0 0 4px var(--joy-palette-focusVisible)',
                                            transform: 'translateY(-1px)',
                                        },
                                        '&:active': {
                                            transform: 'translateY(0px)',
                                            boxShadow: '0 2px 8px rgba(62, 207, 142, 0.2)',
                                        },
                                    }}
                                >
                                    Sign In
                                </Button>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={toggleMobileMenu}
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-menu"
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                minWidth: 40,
                                p: 1,
                                borderRadius: 'md',
                                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: 'scale(1)',
                                '&:hover': {
                                    bgcolor: 'neutral.softHoverBg',
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                },
                                '&:focus-visible': {
                                    outline: 'none',
                                    boxShadow:
                                        '0 0 0 4px var(--joy-palette-focusVisible)',
                                    transform: 'scale(1.02)',
                                },
                                '&:active': {
                                    transform: 'scale(0.98)',
                                },
                            }}
                        >
                            {mobileOpen ? <Close /> : <MenuIcon />}
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Mobile Drawer */}
            <Drawer
                open={mobileOpen}
                onClose={toggleMobileMenu}
                anchor="right"
                aria-labelledby="mobile-menu-heading"
                size="sm"
                sx={{
                    display: { xs: 'block', md: 'none' },
                    // Enhanced drawer styling with animations
                    '& .MuiDrawer-content': {
                        borderTopLeftRadius: 'lg',
                        borderBottomLeftRadius: 'lg',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        backdropFilter: 'blur(20px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid',
                        borderColor: 'divider',
                    },
                }}
            >
                <Box sx={{ width: 280, p: 3 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                        }}
                    >
                        <Box
                            id="mobile-menu-heading"
                            component="div"
                            sx={{ m: 0, fontWeight: 700, fontSize: '1.125rem' }}
                        >
                            <Typography level="title-md">Menu</Typography>
                        </Box>
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={toggleMobileMenu}
                            aria-label="Close menu"
                            sx={{
                                minWidth: 40,
                                p: 1,
                                borderRadius: 'md',
                                '&:focus-visible': {
                                    outline: 'none',
                                    boxShadow:
                                        '0 0 0 4px var(--joy-palette-focusVisible)',
                                },
                            }}
                        >
                            <Close />
                        </Button>
                    </Box>

                    <List sx={{ gap: 1 }}>
                        {navLinks.map((link) => (
                            <ListItem key={link.href} sx={{ p: 0 }}>
                                <ListItemButton
                                    selected={isActive(link.href)}
                                    onClick={() => {
                                        router.push(link.href)
                                        toggleMobileMenu()
                                    }}
                                    sx={{
                                        borderRadius: 'md',
                                        minHeight: 48,
                                        px: 2,
                                        py: 1.5,
                                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        transform: 'translateX(0px)',
                                        '&.Mui-selected': {
                                            bgcolor: 'primary.softBg',
                                            color: 'primary.500',
                                            fontWeight: 600,
                                            boxShadow: '0 2px 8px rgba(62, 207, 142, 0.2)',
                                        },
                                        '&:hover': {
                                            bgcolor: 'primary.softHoverBg',
                                            transform: 'translateX(4px)',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        },
                                        '&:focus-visible': {
                                            outline: 'none',
                                            boxShadow:
                                                '0 0 0 4px var(--joy-palette-focusVisible)',
                                            transform: 'translateX(2px)',
                                        },
                                        '&:active': {
                                            transform: 'translateX(0px) scale(0.98)',
                                        },
                                    }}
                                >
                                    <link.icon sx={{ mr: 2, fontSize: 20 }} />
                                    <Typography level="body-lg">
                                        {link.label}
                                    </Typography>
                                </ListItemButton>
                            </ListItem>
                        ))}

                        {!user && (
                            <ListItem sx={{ mt: 2, p: 0 }}>
                                <Link
                                    href="/login"
                                    sx={{ width: '100%', display: 'block' }}
                                >
                                    <Button
                                        component="span"
                                        variant="solid"
                                        color="primary"
                                        fullWidth
                                        startDecorator={<Login />}
                                        onClick={toggleMobileMenu}
                                        aria-label="Sign in"
                                        sx={{
                                            borderRadius: 'lg',
                                            minHeight: 48,
                                            fontWeight: 600,
                                            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                            transform: 'translateY(0px)',
                                            boxShadow: '0 2px 8px rgba(62, 207, 142, 0.2)',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 25px rgba(62, 207, 142, 0.4)',
                                                bgcolor: 'primary.600',
                                            },
                                            '&:focus-visible': {
                                                outline: 'none',
                                                boxShadow:
                                                    '0 0 0 4px var(--joy-palette-focusVisible)',
                                                transform: 'translateY(-1px)',
                                            },
                                            '&:active': {
                                                transform: 'translateY(0px)',
                                                boxShadow: '0 2px 8px rgba(62, 207, 142, 0.2)',
                                            },
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>
        </>
    )
}
