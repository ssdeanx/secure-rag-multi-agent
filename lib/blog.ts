import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BlogMeta } from '@/components/blog/ArticleCard.joy'

const BLOG_DIR = path.join(process.cwd(), 'blog')

export interface BlogPost extends BlogMeta {
    content: string
}

function readingTime(text: string): string {
    const words = text.split(/\s+/).filter(Boolean).length
    const minutes = Math.max(1, Math.round(words / 200))
    return `${minutes} min read`
}

function parseFrontmatter(raw: string) {
    // Use gray-matter to robustly parse frontmatter from MD/MDX files.
    try {
        const parsed = matter(raw)
        return { data: parsed.data as Record<string, unknown>, content: String(parsed.content) }
    } catch {
        return { data: {}, content: raw }
    }
}

async function loadFile(filePath: string): Promise<BlogPost | null> {
    try {
        const raw = await fs.readFile(filePath, 'utf8')
        const { data, content } = parseFrontmatter(raw)
        const slug = path.basename(filePath).replace(/\.(md|mdx)$/i, '')
        const tags = Array.isArray(data.tags)
            ? (data.tags as unknown[]).map(String)
            : typeof data.tags === 'string'
            ? String(data.tags).split(',').map((s) => s.trim())
            : []

        // Safely extract author name from frontmatter which may be a string or an object
        const authorEntry = (data)['author']
        let author: string | undefined = undefined
        if (typeof authorEntry === 'string') {
            author = authorEntry
        } else if (typeof authorEntry === 'object' && authorEntry !== null && 'name' in (authorEntry as Record<string, unknown>)) {
            const nameVal = (authorEntry as Record<string, unknown>)['name']
            if (typeof nameVal === 'string') { author = nameVal }
        }
        const meta: BlogPost = {
            slug,
            title: String(data.title ?? slug),
            date: String(data.date ?? new Date().toISOString()),
            excerpt: String(data.excerpt ?? content.slice(0, 160).trim()),
            tags,
            author,
            readingTime: readingTime(content),
            content,
        }
        return meta
    } catch {
        // log the error somewhere in future; for now, return null so callers can handle missing files
        return null
    }
}

export async function getAllPosts(): Promise<BlogPost[]> {
    let files: string[] = []
    try {
        files = await fs.readdir(BLOG_DIR)
    } catch {
        return []
    }
    const candidates = files.filter((f) => /\.(md|mdx)$/i.test(f))
    const loaded = await Promise.all(
        candidates.map((f) => loadFile(path.join(BLOG_DIR, f)))
    )
    return loaded
        .filter((p): p is BlogPost => p !== null)
        .sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPaginatedPosts(page: number, pageSize: number) {
    const all = await getAllPosts()
    const start = (page - 1) * pageSize
    const slice = all.slice(start, start + pageSize)
    const pageCount = Math.max(1, Math.ceil(all.length / pageSize))
    return { posts: slice, page, pageCount, total: all.length }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    const mdPath = path.join(BLOG_DIR, `${slug}.md`)
    const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`)
    const first = await loadFile(mdxPath)
    return first ?? (await loadFile(mdPath))
}
