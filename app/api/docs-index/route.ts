import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'remark-frontmatter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'

// Cache in-memory during runtime
interface HeadingMeta { id: string; text: string; level: number }
interface DocEntry { slug: string; title: string; headings: HeadingMeta[] }
let cache: { timestamp: number; data: DocEntry[] } | null = null
const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

async function collectDocs(): Promise<DocEntry[]> {
  const docsDir = path.join(process.cwd(), 'docs')
  const files = await fs.readdir(docsDir, { recursive: true })
  const mdFiles = files.filter((f: string) => f.endsWith('.md') || f.endsWith('.mdx'))
  const slugMap = new Map<string, DocEntry>()

  for (const file of mdFiles) {
    const abs = path.join(docsDir, file)
    const raw = await fs.readFile(abs, 'utf8')

    // Parse frontmatter + headings
    let title = ''
  const headings: HeadingMeta[] = []

    const tree = unified()
      .use(remarkParse)
      .use(matter, ['yaml'])
      .parse(raw)

    // Narrow visitor nodes to heading-like content (pragmatic typing due to MDX union complexity)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree as unknown as Root, (node: unknown) => {
      const n = node as { type?: string; depth?: number; children?: Array<{ value?: string }> }
      if (n.type === 'heading' && (n.depth === 2 || n.depth === 3)) {
        const text = (n.children ?? []).map((c) => c.value ?? '').join('') ?? ''
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
        headings.push({ id, text, level: n.depth ?? 2 })
        if (!title && n.depth === 2) {
          title = text
        }
      }
    })

    if (!title) {
      // Fallback: derive from filename
      title = path.basename(file).replace(/\.(md|mdx)$/,'').replace(/[-_]/g,' ')
    }

    let slug = file.replace(/\.(md|mdx)$/,'')
    if (slug.endsWith('/index')) {
      slug = slug.slice(0, -6)
    }

    slugMap.set(slug, { slug, title, headings })
  }

  return Array.from(slugMap.values()).sort((a: DocEntry, b: DocEntry) => a.slug.localeCompare(b.slug))
}

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data)
  }
  const data = await collectDocs()
  cache = { timestamp: Date.now(), data }
  return NextResponse.json(data)
}
