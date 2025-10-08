'use client';

import { useState } from 'react';
import { Box, Button, Typography, Drawer, List, ListItem, ListItemButton } from '@/components/ui/joy';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Menu as MenuIcon,
    Close,
    Home,
    Description,
    Info,
    ContactMail,
    Article,
    Login,
} from '@mui/icons-material';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu.joy';

interface TopNavigationProps {
    user?: {
        name: string;
        email: string;
        role: string;
        avatar?: string;
    };
}

const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/docs', label: 'Docs', icon: Description },
    { href: '/about', label: 'About', icon: Info },
    { href: '/blog', label: 'Blog', icon: Article },
    { href: '/contact', label: 'Contact', icon: ContactMail },
];

export function TopNavigation({ user }: TopNavigationProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === '/') {return pathname === href;}
        return pathname?.startsWith(href);
    };

    const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

    return (
        <>
            <Box
                component="nav"
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    bgcolor: 'background.surface',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backdropFilter: 'blur(8px)',
                }}
            >
                <Box
                    sx={{
                        maxWidth: '1400px',
                        mx: 'auto',
                        px: { xs: 2, sm: 4 },
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Logo */}
                    <Link href="/">
                        <Box
                            component="a"
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
                            <Typography
                                level="h4"
                                sx={{
                                    fontWeight: 700,
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            >
                                Governed RAG
                            </Typography>
                        </Box>
                    </Link>

                    {/* Desktop Navigation */}
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 1,
                        }}
                    >
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href}>
                                <Button
                                    component="a"
                                    variant={isActive(link.href) ? 'soft' : 'plain'}
                                    color={isActive(link.href) ? 'primary' : 'neutral'}
                                    sx={{
                                        fontWeight: isActive(link.href) ? 600 : 400,
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
                                    component="a"
                                    variant="solid"
                                    color="primary"
                                    startDecorator={<Login />}
                                    sx={{ display: { xs: 'none', sm: 'flex' } }}
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
                                        router.push(link.href);
                                        toggleMobileMenu();
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
                                        component="a"
                                        variant="solid"
                                        color="primary"
                                        fullWidth
                                        startDecorator={<Login />}
                                        onClick={toggleMobileMenu}
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
    );
}
