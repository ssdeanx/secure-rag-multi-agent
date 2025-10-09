'use client';

import { Card, CardContent, Typography, Box, Chip, Avatar } from '@/components/ui/joy';
import styles from './ArticleCard.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarMonth, Person, AccessTime } from '@mui/icons-material';

interface ArticleCardProps {
    title: string;
    excerpt: string;
    date: string;
    author: {
        name: string;
        avatar?: string;
    };
    readingTime: string;
    tags: string[];
    slug: string;
    image?: string;
}

export function ArticleCard({
    title,
    excerpt,
    date,
    author,
    readingTime,
    tags,
    slug,
    image,
}: ArticleCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <Link href={`/blog/${slug}`}>
                <Card
                    variant="outlined"
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: 'lg',
                            borderColor: 'primary.500',
                        },
                    }}
                >
                    {typeof image === 'string' && image.trim() !== '' && (
                        <Box
                            sx={{
                                width: '100%',
                                height: 200,
                                overflow: 'hidden',
                                borderTopLeftRadius: 'sm',
                                borderTopRightRadius: 'sm',
                            }}
                        >
                            <img
                                src={image}
                                alt={title}
                                className={styles.articleImage}
                            />
                        </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {tags.slice(0, 3).map((tag) => (
                                <Chip
                                    key={tag}
                                    variant="soft"
                                    color="primary"
                                    size="sm"
                                >
                                    {tag}
                                </Chip>
                            ))}
                        </Box>

                        <Typography
                            level="h3"
                            sx={{
                                fontSize: 'xl',
                                fontWeight: 700,
                                lineHeight: 1.3,
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            level="body-md"
                            sx={{
                                color: 'text.secondary',
                                flexGrow: 1,
                                lineHeight: 1.6,
                            }}
                        >
                            {excerpt}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar
                                    src={author.avatar}
                                    alt={author.name}
                                    size="sm"
                                >
                                    {author.name?.trim()
                                        ? author.name.split(' ').map(n => n[0]).join('')
                                        : <Person sx={{ fontSize: 16 }} />}
                                </Avatar>
                                <Box>
                                    <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                                        {author.name}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CalendarMonth sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                                        {new Date(date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                                        {readingTime}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}
