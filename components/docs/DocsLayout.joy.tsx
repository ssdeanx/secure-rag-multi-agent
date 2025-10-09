'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    Drawer,
    Button,
    Divider,
    Breadcrumbs,
    Link as JoyLink,
} from '@/components/ui/joy';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Menu as MenuIcon,
    Close,
    Code,
    Architecture,
    RocketLaunch,
    ChevronRight,
    Home,
} from '@mui/icons-material';
import { DocsSearch } from './DocsSearch.joy';
import { DocsTOC } from './DocsTOC.joy';

interface DocsSidebarItem {
    title: string;
    href: string;
    icon?: React.ElementType;
    items?: DocsSidebarItem[];
}

interface DocsLayoutProps {
    children: React.ReactNode;
    tableOfContents?: Array<{ id: string; title: string; level: number }>;
}

const sidebarNav: DocsSidebarItem[] = [
    {
        title: 'Getting Started',
        href: '/docs',
        icon: RocketLaunch,
        items: [
            { title: 'Introduction', href: '/docs' },
            { title: 'Quick Start', href: '/docs/quick-start' },
            { title: 'Demo Roles', href: '/docs/demo-roles' },
        ],
    },
    {
        title: 'Concepts',
        href: '/docs/architecture',
        icon: Architecture,
        items: [
            { title: 'Architecture', href: '/docs/architecture' },
            { title: 'Security Model', href: '/docs/security' },
            { title: 'Mastra Integration', href: '/docs/mastra' },
        ],
    },
    {
        title: 'API Reference',
        href: '/docs/api-reference',
        icon: Code,
        items: [
            { title: 'API Overview', href: '/docs/api-reference' },
            { title: 'Authentication', href: '/docs/api-reference#authentication' },
            { title: 'Endpoints', href: '/docs/api-reference#endpoints' },
        ],
    },
];

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
    const pathname = usePathname();
    const [expandedSections, setExpandedSections] = useState<string[]>(['/docs']);

    const isActive = (href: string) => pathname === href;

    const toggleSection = (href: string) => {
        setExpandedSections((prev) =>
            prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href],
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 3 }}>
            <Box sx={{ mb: 3 }}>
                <DocsSearch />
            </Box>

            <Divider sx={{ mb: 3 }} />

            <List sx={{ '--List-padding': '0px', '--List-gap': '4px' }}>
                {sidebarNav.map((section) => {
                    // small typed wrapper to render icon components safely in JSX
                    const IconComp = section.icon;
                    const isExpanded = expandedSections.includes(section.href);

                    return (
                        <Box key={section.href}>
                            <ListItem sx={{ '--ListItem-paddingY': '0px' }}>
                                <ListItemButton
                                    onClick={() => toggleSection(section.href)}
                                    sx={{
                                        py: 1,
                                        borderRadius: 'sm',
                                        fontWeight: 600,
                                        '&:hover': { bgcolor: 'neutral.softHoverBg' },
                                    }}
                                >
                                    {(IconComp !== null && IconComp !== undefined && (typeof IconComp === 'function' || typeof IconComp === 'object')) ? (
                                        <IconComp sx={{ fontSize: 20, mr: 1.5 }} />
                                    ) : null}
                                    <Typography level="body-sm" sx={{ flex: 1 }}>
                                        {section.title}
                                    </Typography>
                                    <ChevronRight
                                        sx={{
                                            fontSize: 16,
                                            transform: isExpanded ? 'rotate(90deg)' : 'none',
                                            transition: 'transform 0.2s',
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>

                            {isExpanded && section.items && (
                                <List sx={{ pl: 3, mt: 0.5, mb: 1 }}>
                                    {section.items.map((item) => (
                                        <ListItem key={item.href} sx={{ '--ListItem-paddingY': '0px' }}>
                                            <Link href={item.href} passHref>
                                                <ListItemButton
                                                    selected={isActive(item.href)}
                                                    onClick={onLinkClick}
                                                    sx={{
                                                        py: 0.75,
                                                        borderRadius: 'sm',
                                                        fontSize: 'sm',
                                                        '&.Mui-selected': {
                                                            bgcolor: 'primary.softBg',
                                                            color: 'primary.500',
                                                            fontWeight: 600,
                                                        },
                                                    }}
                                                >
                                                    {item.title}
                                                </ListItemButton>
                                            </Link>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Box>
                    );
                })}
            </List>
        </Box>
    );
}

export function DocsLayout({ children, tableOfContents = [] }: DocsLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

    const breadcrumbs = pathname
        ?.split('/')
        .filter(Boolean)
        .map((segment, index, array) => ({
            label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
            href: '/' + array.slice(0, index + 1).join('/'),
        }));

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.body' }}>
            {/* Desktop Sidebar */}
            <Box
                component="aside"
                sx={{
                    display: { xs: 'none', lg: 'block' },
                    width: 280,
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    position: 'sticky',
                    top: 64,
                    height: 'calc(100vh - 64px)',
                    overflowY: 'auto',
                    bgcolor: 'background.surface',
                }}
            >
                <SidebarContent />
            </Box>

            {/* Mobile Drawer */}
            <Drawer open={mobileOpen} onClose={toggleMobileSidebar} anchor="left">
                <Box sx={{ width: 280 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 0 }}>
                        <Typography level="h4" sx={{ fontWeight: 700 }}>
                            Documentation
                        </Typography>
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={toggleMobileSidebar}
                            sx={{ minWidth: 40, p: 1 }}
                        >
                            <Close />
                        </Button>
                    </Box>
                    <SidebarContent onLinkClick={toggleMobileSidebar} />
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Mobile Menu Button & Breadcrumbs */}
                <Box
                    sx={{
                        position: 'sticky',
                        top: 64,
                        zIndex: 100,
                        bgcolor: 'background.surface',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        px: { xs: 2, sm: 4 },
                        py: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Button
                            variant="outlined"
                            color="neutral"
                            onClick={toggleMobileSidebar}
                            sx={{
                                display: { xs: 'flex', lg: 'none' },
                                minWidth: 40,
                                p: 1,
                            }}
                        >
                            <MenuIcon />
                        </Button>

                        <Breadcrumbs separator={<ChevronRight sx={{ fontSize: 16 }} />}>
                            <JoyLink
                                href="/"
                                color="neutral"
                                level="body-sm"
                                underline="hover"
                                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                            >
                                <Home sx={{ fontSize: 16 }} />
                                Home
                            </JoyLink>
                            {breadcrumbs?.map((crumb, index) => (
                                <JoyLink
                                    key={crumb.href}
                                    href={crumb.href}
                                    color={index === breadcrumbs.length - 1 ? 'primary' : 'neutral'}
                                    level="body-sm"
                                    underline="hover"
                                >
                                    {crumb.label}
                                </JoyLink>
                            ))}
                        </Breadcrumbs>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flex: 1 }}>
                    {/* Article Content */}
                    <Box
                        sx={{
                            flex: 1,
                            maxWidth: tableOfContents.length > 0 ? 'calc(100% - 280px)' : '900px',
                            mx: 'auto',
                            px: { xs: 3, sm: 4, lg: 6 },
                            py: 6,
                        }}
                    >
                        {children}
                    </Box>

                    {/* Table of Contents */}
                    {tableOfContents.length > 0 && (
                        <Box
                            sx={{
                                display: { xs: 'none', xl: 'block' },
                                width: 280,
                                flexShrink: 0,
                                pl: 4,
                                pr: 6,
                                py: 6,
                            }}
                        >
                            <DocsTOC items={tableOfContents} />
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
