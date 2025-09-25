import { notFound } from 'next/navigation';
import type { Metadata } from 'next'
import { metadataFromFrontmatter } from '@/lib/metadata'
import { compileMDX } from 'next-mdx-remote/rsc';
import mdxPlugins from '@/lib/mdx-plugins';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) {
    return metadataFromFrontmatter({ title: 'Post Not Found', description: 'Missing blog post' }, '/blog')
  }
  return metadataFromFrontmatter({ title: post.title, description: post.excerpt, tags: post.tags, date: post.date }, `/blog/${post.slug}`)
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
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
  });

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 rounded-sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </div>
        <article>
          <header className="mb-8 space-y-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-mono">
              {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} • {post.readingTime}
            </p>
            <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
            {post.author !== undefined && post.author !== '' && post.author.length > 0 && (
              <p className="text-sm text-muted-foreground">By {post.author}</p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">{tag}</Badge>
                ))}
              </div>
            )}
          </header>
          <div className="prose dark:prose-invert max-w-none">
            {content}
          </div>
        </article>
      </div>
    </main>
  );
}
