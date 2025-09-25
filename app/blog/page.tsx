import { ArticleCard } from '@/components/blog/ArticleCard';
import { Pagination } from '@/components/blog/Pagination';
import { getPaginatedPosts } from '@/lib/blog';

interface SearchParams { page?: string }

export default async function BlogIndex({ searchParams }: { searchParams?: SearchParams }) {
	const pageNum = Number(searchParams?.page ?? '1');
	const safePage = Number.isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
	const { posts, page, pageCount } = await getPaginatedPosts(safePage, 6);

	return (
		<main className="min-h-screen bg-background py-24">
			<div className="max-w-6xl mx-auto px-4">
				<header className="mb-12 text-center space-y-4">
					<h1 className="text-4xl font-bold tracking-tight">Blog</h1>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Updates, architecture insights, and governance best practices.
					</p>
				</header>
				{posts.length === 0 ? (
					<p className="text-center text-muted-foreground">No posts yet. Check back soon.</p>
				) : (
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{posts.map(p => <ArticleCard key={p.slug} meta={p} />)}
					</div>
				)}
				<Pagination page={page} pageCount={pageCount} />
			</div>
		</main>
	);
}
