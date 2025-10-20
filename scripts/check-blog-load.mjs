#!/usr/bin/env node
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'blog')

async function readingTime(text) {
  const words = String(text).split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

async function check() {
  try {
    const files = await fs.readdir(BLOG_DIR)
    const posts = files.filter((f) => /\.(md|mdx)$/i.test(f))
    if (posts.length === 0) {
      console.log('No blog posts found in', BLOG_DIR)
      process.exit(0)
    }
    for (const file of posts) {
      const full = path.join(BLOG_DIR, file)
      const raw = await fs.readFile(full, 'utf8')
      const parsed = matter(raw)
      const slug = path.basename(file).replace(/\.(md|mdx)$/i, '')
      const title = parsed.data?.title ?? slug
      const date = parsed.data?.date ?? 'unknown'
      const excerpt = parsed.data?.excerpt ?? String(parsed.content).slice(0,160).trim()
      const rt = await readingTime(parsed.content)
      console.log(`- ${slug} — ${title} — ${date} — ${rt} — excerpt:${excerpt.length} chars`)
    }
    process.exit(0)
  } catch (err) {
    console.error('Error reading blog directory:', err)
    process.exit(2)
  }
}

check()
