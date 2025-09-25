import { promises as fs } from 'fs';
import path from 'path';
import type { BlogMeta } from '@/components/blog/ArticleCard';

const BLOG_DIR = path.join(process.cwd(), 'blog');

export interface BlogPost extends BlogMeta {
  content: string;
}

function readingTime(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function parseFrontmatter(raw: string) {
  if (!raw.startsWith('---')) {
    return { data: {}, content: raw } as { data: Record<string, unknown>; content: string };
  }
  const end = raw.indexOf('\n---');
  if (end === -1) {
    return { data: {}, content: raw };
  }
  const fmBlock = raw.slice(3, end).trim();
  const rest = raw.slice(end + 4).replace(/^\n+/, '');
  const data: Record<string, unknown> = {};
  for (const line of fmBlock.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) {
      continue;
    }
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).trim();
      data[key] = value.length === 0 ? [] : value.split(',').map(v => v.trim());
    } else {
      data[key] = value.replace(/^"|"$/g, '');
    }
  }
  return { data, content: rest };
}

async function loadFile(filePath: string): Promise<BlogPost | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const { data, content } = parseFrontmatter(raw);
    const slug = path.basename(filePath).replace(/\.(md|mdx)$/i, '');
    const meta: BlogPost = {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? new Date().toISOString()),
      excerpt: String(data.excerpt ?? content.slice(0, 160).trim()),
      tags: Array.isArray(data.tags) ? (data.tags as unknown[]).map(String) : [],
      author: typeof data.author === 'string' ? data.author : undefined,
      readingTime: readingTime(content),
      content,
    };
    return meta;
  } catch {
    return null;
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  let files: string[] = [];
  try {
    files = await fs.readdir(BLOG_DIR);
  } catch {
    return [];
  }
  const candidates = files.filter(f => /\.(md|mdx)$/i.test(f));
  const loaded = await Promise.all(candidates.map(f => loadFile(path.join(BLOG_DIR, f))));
  return loaded.filter((p): p is BlogPost => p !== null).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPaginatedPosts(page: number, pageSize: number) {
  const all = await getAllPosts();
  const start = (page - 1) * pageSize;
  const slice = all.slice(start, start + pageSize);
  const pageCount = Math.max(1, Math.ceil(all.length / pageSize));
  return { posts: slice, page, pageCount, total: all.length };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const first = await loadFile(mdxPath);
  return first ?? (await loadFile(mdPath));
}
