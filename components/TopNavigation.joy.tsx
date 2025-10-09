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
} from '@/components/ui/joy'
import Link from 'next/link'
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
                    backdropFilter: 'blur(8px)',
                    // premium gradient surface using Joy tokens
                    backgroundImage:
                        'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 100%), var(--joy-palette-background-surface)',
                    // subtle elevated feel
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
                    <Link href="/" aria-label="Deanmachines home">
                        <Box
                            component="span"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                textDecoration: 'none',
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
                                <RocketLaunch
                                    sx={{ color: 'white', fontSize: 22 }}
                                />
                            </Box>
                            <Typography
                                level="h4"
                                sx={{
                                    fontWeight: 700,
                                    display: { xs: 'none', sm: 'block' },
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
                                        '&:hover': {
                                            bgcolor: isActive(link.href)
                                                ? 'primary.softHoverBg'
                                                : 'neutral.softHoverBg',
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
                                            transition: 'all 160ms ease',
                                        },
                                        '&:hover::after': {
                                            bgcolor: isActive(link.href)
                                                ? 'var(--joy-palette-primary-500)'
                                                : 'var(--joy-palette-neutral-400)',
                                            opacity: 0.75,
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
                                    startDecorator={<Login />}
                                    sx={{
                                        display: { xs: 'none', sm: 'flex' },
                                        borderRadius: 'lg',
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
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                minWidth: 40,
                                p: 1,
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
                sx={{
                    display: { xs: 'block', md: 'none' },
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
                        <Typography level="h4" sx={{ fontWeight: 700 }}>
                            Menu
                        </Typography>
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={toggleMobileMenu}
                            sx={{ minWidth: 40, p: 1 }}
                        >
                            <Close />
                        </Button>
                    </Box>

                    <List>
                        {navLinks.map((link) => (
                            <ListItem key={link.href}>
                                <ListItemButton
                                    selected={isActive(link.href)}
                                    onClick={() => {
                                        router.push(link.href)
                                        toggleMobileMenu()
                                    }}
                                    sx={{
                                        borderRadius: 'md',
                                        '&.Mui-selected': {
                                            bgcolor: 'primary.softBg',
                                            color: 'primary.500',
                                        },
                                    }}
                                >
                                    <link.icon sx={{ mr: 2, fontSize: 20 }} />
                                    {link.label}
                                </ListItemButton>
                            </ListItem>
                        ))}

                        {!user && (
                            <ListItem sx={{ mt: 2 }}>
                                <Link href="/login">
                                    <Button
                                        component="span"
                                        variant="solid"
                                        color="primary"
                                        fullWidth
                                        startDecorator={<Login />}
                                        onClick={toggleMobileMenu}
                                        sx={{ borderRadius: 'lg' }}
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
