'use client';

import { useState } from 'react';
import { Box, Input, Typography, List, ListItem, ListItemButton, Chip } from '@/components/ui/joy';
import { IconButton } from '@mui/joy';
import { Search, Close, Article, Code } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface SearchResult {
    title: string;
    href: string;
    category: string;
    excerpt?: string;
}

interface DocsSearchProps {
    results?: SearchResult[];
    onSearch?: (query: string) => void;
}

const mockResults: SearchResult[] = [
    {
        title: 'Quick Start',
        href: '/docs/quick-start',
        category: 'Getting Started',
        excerpt: 'Get up and running with Governed RAG in minutes',
    },
    {
        title: 'Architecture Overview',
        href: '/docs/architecture',
        category: 'Concepts',
        excerpt: 'Learn about the multi-agent architecture',
    },
    {
        title: 'API Reference',
        href: '/docs/api-reference',
        category: 'API',
        excerpt: 'Complete API documentation for agents and workflows',
    },
    {
        title: 'Security Model',
        href: '/docs/security',
        category: 'Security',
        excerpt: 'Role-based access control and data classification',
    },
];

export function DocsSearch({ results = mockResults, onSearch }: DocsSearchProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const filteredResults = query
        ? results.filter(
              (r) =>
                  (r.title.toLowerCase().includes(query.toLowerCase()) ||
                  (r.excerpt?.toLowerCase().includes(query.toLowerCase()))) ?? false,
          )
        : [];

    const handleSelect = (href: string) => {
        router.push(href);
        setQuery('');
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setIsOpen(value.length > 0);
        if (onSearch) {
            onSearch(value);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setIsOpen(false);
    };

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            <Input
                placeholder="Search documentation..."
                value={query}
                onChange={handleInputChange}
                onFocus={() => query.length > 0 && setIsOpen(true)}
                startDecorator={<Search sx={{ fontSize: 20, color: 'text.secondary' }} />}
                endDecorator={
                    query && (
                        <IconButton
                            onClick={clearSearch}
                            sx={{
                                border: 'none',
                                bgcolor: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                p: 0.5,
                                borderRadius: 'sm',
                                '&:hover': { bgcolor: 'neutral.softHoverBg' },
                            }}
                        >
                            <Close sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </IconButton>
                    )
                }
                sx={{ width: '100%' }}
            />

            {isOpen && filteredResults.length > 0 && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        mt: 1,
                        bgcolor: 'background.surface',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 'md',
                        boxShadow: 'lg',
                        maxHeight: 400,
                        overflowY: 'auto',
                        zIndex: 1000,
                    }}
                >
                    <List>
                        {filteredResults.map((result) => (
                            <ListItem key={result.href}>
                                <ListItemButton
                                    onClick={() => handleSelect(result.href)}
                                    sx={{
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        gap: 0.5,
                                        py: 1.5,
                                        borderRadius: 'sm',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                        {result.category === 'API' ? (
                                            <Code sx={{ fontSize: 16, color: 'primary.500' }} />
                                        ) : (
                                            <Article sx={{ fontSize: 16, color: 'primary.500' }} />
                                        )}
                                        <Typography level="body-sm" sx={{ fontWeight: 600, flex: 1 }}>
                                            {result.title}
                                        </Typography>
                                        <Chip variant="soft" color="neutral" size="sm">
                                            {result.category}
                                        </Chip>
                                    </Box>
                                    {result.excerpt && (
                                        <Typography
                                            level="body-xs"
                                            sx={{
                                                color: 'text.secondary',
                                                pl: 3,
                                            }}
                                        >
                                            {result.excerpt}
                                        </Typography>
                                    )}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {isOpen && filteredResults.length === 0 && query.length > 0 && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        mt: 1,
                        bgcolor: 'background.surface',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 'md',
                        boxShadow: 'lg',
                        p: 3,
                        textAlign: 'center',
                        zIndex: 1000,
                    }}
                >
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                        No results found for "{query}"
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
