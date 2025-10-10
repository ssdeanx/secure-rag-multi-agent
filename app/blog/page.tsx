import { ArticleCard } from '@/components/blog/ArticleCard.joy'
import Link from 'next/link'
import { Box, Button, Typography } from '@/components/ui/joy'
import { getPaginatedPosts } from '@/lib/blog'

interface SearchParams {
    page?: string
}
export default async function BlogIndex({
    searchParams,
}: {
    searchParams?: SearchParams
}) {
    const pageNum = Number(searchParams?.page ?? '1')
    const safePage = Number.isNaN(pageNum) || pageNum < 1 ? 1 : pageNum
    const { posts, page, pageCount } = await getPaginatedPosts(safePage, 6)

    const cards = posts.map((p) => {
        const authorName: string =
            p.author && p.author.trim().length > 0 ? p.author : 'Unknown'
        const tags: string[] = Array.isArray(p.tags) ? p.tags : []
        return { ...p, authorName, tags }
    })

    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.body',
                py: { xs: 6, md: 8 },
            }}
        >
            <Box
                sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}
            >
                <Box
                    component="header"
                    sx={{
                        mb: 6,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Typography
                        level="h1"
                        sx={{
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            fontWeight: 800,
                        }}
                    >
                        Blog
                    </Typography>
                    <Typography
                        level="body-lg"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: 600,
                            mx: 'auto',
                            lineHeight: 1.6,
                        }}
                    >
                        Updates, architecture insights, and governance best
                        practices.
                    </Typography>
                </Box>
                {posts.length === 0 ? (
                    <Typography
                        level="body-lg"
                        sx={{
                            textAlign: 'center',
                            color: 'text.secondary',
                            py: 8,
                        }}
                    >
                        No posts yet. Check back soon.
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gap: 3,
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                lg: 'repeat(3, 1fr)',
                            },
                        }}
                    >
                        {cards.map((p) => (
                            <ArticleCard
                                key={p.slug}
                                title={p.title}
                                excerpt={p.excerpt}
                                date={p.date}
                                author={{ name: p.authorName }}
                                readingTime={p.readingTime}
                                tags={p.tags}
                                slug={p.slug}
                            />
                        ))}
                    </Box>
                )}
                {/* Joy-based server-friendly pagination */}
                {pageCount > 1 && (
                    <Box
                        component="nav"
                        aria-label="Blog pagination"
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 1,
                            mt: 8,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Link
                            href={`/blog?page=${page - 1}`}
                            aria-label="Previous page"
                            passHref
                        >
                            <Button
                                component="a"
                                variant="outlined"
                                color="neutral"
                                disabled={page <= 1}
                                sx={{ minWidth: 100 }}
                            >
                                Previous
                            </Button>
                        </Link>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                mx: 2,
                                flexWrap: 'wrap',
                            }}
                        >
                            {Array.from({ length: pageCount }, (_, i) => i + 1)
                                .filter(
                                    (p) =>
                                        p === 1 ||
                                        p === pageCount ||
                                        (p >= page - 1 && p <= page + 1)
                                )
                                .map((p, idx, arr) => (
                                    <Box
                                        key={p}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        {idx > 0 && p - arr[idx - 1] > 1 && (
                                            <Typography
                                                level="body-md"
                                                sx={{
                                                    px: 1,
                                                    color: 'text.secondary',
                                                }}
                                            >
                                                …
                                            </Typography>
                                        )}
                                        <Link
                                            href={`/blog?page=${p}`}
                                            aria-current={
                                                p === page ? 'page' : undefined
                                            }
                                            passHref
                                        >
                                            <Button
                                                component="a"
                                                variant={
                                                    p === page
                                                        ? 'solid'
                                                        : 'outlined'
                                                }
                                                color={
                                                    p === page
                                                        ? 'primary'
                                                        : 'neutral'
                                                }
                                                sx={{ minWidth: 40, px: 2 }}
                                            >
                                                {p}
                                            </Button>
                                        </Link>
                                    </Box>
                                ))}
                        </Box>
                        <Link
                            href={`/blog?page=${page + 1}`}
                            aria-label="Next page"
                            passHref
                        >
                            <Button
                                component="a"
                                variant="outlined"
                                color="neutral"
                                disabled={page >= pageCount}
                                sx={{ minWidth: 100 }}
                            >
                                Next
                            </Button>
                        </Link>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
