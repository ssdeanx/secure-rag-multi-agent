import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { metadataFromFrontmatter } from '@/lib/metadata'
import { compileMDX } from 'next-mdx-remote/rsc'
import mdxPlugins from '@/lib/mdx-plugins'
import { getPostBySlug, getAllPosts } from '@/lib/blog'
import Link from 'next/link'
import { Box, Typography, Chip, Button } from '@/components/ui/joy'
import { ArrowBack } from '@mui/icons-material'

export async function generateStaticParams() {
    const posts = await getAllPosts()
    return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string }
}): Promise<Metadata> {
    const post = await getPostBySlug(params.slug)
    if (!post) {
        return metadataFromFrontmatter(
            { title: 'Post Not Found', description: 'Missing blog post' },
            '/blog'
        )
    }
    return metadataFromFrontmatter(
        {
            title: post.title,
            description: post.excerpt,
            tags: post.tags,
            date: post.date,
        },
        `/blog/${post.slug}`
    )
}

export default async function BlogPostPage({
    params,
}: {
    params: { slug: string }
}) {
    const post = await getPostBySlug(params.slug)
    if (!post) {
        notFound()
    }

    // simple frontmatter already parsed in lib/blog; we only compile body for components
    const { content } = await compileMDX({
        source: post.content,
        options: {
            mdxOptions: {
                remarkPlugins: mdxPlugins.remarkPlugins,
                rehypePlugins: mdxPlugins.rehypePlugins,
            },
        },
    })

    return (
        <Box
            component="main"
            sx={{ minHeight: '100vh', bgcolor: 'background.body', py: 8 }}
        >
            <Box sx={{ maxWidth: 880, mx: 'auto', px: 2 }}>
                <Box
                    sx={{
                        mb: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Link href="/blog" passHref>
                        <Button
                            component="a"
                            variant="plain"
                            color="neutral"
                            startDecorator={<ArrowBack />}
                        >
                            Back
                        </Button>
                    </Link>
                </Box>
                <Box component="article">
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            level="body-xs"
                            sx={{
                                textTransform: 'uppercase',
                                letterSpacing: 0.6,
                                color: 'text.tertiary',
                            }}
                        >
                            {new Date(post.date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}{' '}
                            • {post.readingTime}
                        </Typography>
                        <Typography level="h1" sx={{ fontWeight: 800 }}>
                            {post.title}
                        </Typography>
                        {post.author !== null && (
                            <Typography
                                level="body-sm"
                                sx={{ color: 'text.secondary', mt: 1 }}
                            >
                                By {post.author}
                            </Typography>
                        )}
                        {post.tags !== null && post.tags.length > 0 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1.5,
                                    pt: 2,
                                }}
                            >
                                {post.tags.map((tag: string) => (
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
                        )}
                    </Box>
                    <Box
                        sx={{
                            '& h1, & h2, & h3, & h4': {
                                scrollMarginTop: '80px',
                            },
                            '& p': { lineHeight: 1.75 },
                        }}
                    >
                        {content}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
