import { promises as fs } from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import mdxPlugins from '@/lib/mdx-plugins'
import { DocsLayout } from '@/components/docs/DocsLayout'
import { Mermaid } from '@/components/Mermaid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Shield,
  Zap,
  Users,
  Code,
  Layers,
  BookOpen,
  Play,
  Github,
  ExternalLink,
  CheckCircle,
  Star,
  ArrowRight,
  Database,
  Lock,
  Brain,
  Eye,
  EyeOff,
  AlertTriangle,
  XCircle,
  Terminal,
  FileText,
  Settings,
  Key,
  ChevronRight,
  Home
} from 'lucide-react'

export async function generateStaticParams() {
  const docsDirectory = path.join(process.cwd(), 'docs')
  const files = await fs.readdir(docsDirectory, { recursive: true })

  const slugSet = new Set<string>()
  files
    .filter((file: string) => file.endsWith('.md') || file.endsWith('.mdx'))
    .forEach((file: string) => {
      let slugPath = file.replace(/\.(md|mdx)$/, '').split('/')
      // Shorten if last segment is 'index'
      if (slugPath.length > 0 && slugPath[slugPath.length - 1] === 'index') {
        slugPath = slugPath.slice(0, -1)
      }
      slugSet.add(JSON.stringify(slugPath))
    })

  return Array.from(slugSet).map((slugJson: string) => ({
    slug: JSON.parse(slugJson)
  }))
}

const components = {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Separator,
  Mermaid,
  Shield,
  Zap,
  Users,
  Code,
  Layers,
  BookOpen,
  Play,
  Github,
  ExternalLink,
  CheckCircle,
  Star,
  ArrowRight,
  Database,
  Lock,
  Brain,
  Eye,
  EyeOff,
  AlertTriangle,
  XCircle,
  Terminal,
  FileText,
  Settings,
  Key,
  ChevronRight,
  Home
}

export default async function DocsPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug?.join('/') || 'index'
  let mdPath: string
  let mdxPath: string
  let source = ''

  if (params.slug?.length === 0) {
    // Root: load index
    mdxPath = path.join(process.cwd(), 'docs', 'index.mdx')
    mdPath = path.join(process.cwd(), 'docs', 'index.md')

    // Try MDX first, fallback to MD
    try {
      source = await fs.readFile(mdxPath, 'utf8')
    } catch {
      try {
        source = await fs.readFile(mdPath, 'utf8')
      } catch {
        notFound()
      }
    }
  } else {
    // Non-root: prefer index path, fallback to direct path
    const indexSlug = [...params.slug, 'index'].join('/')
    mdxPath = path.join(process.cwd(), 'docs', `${indexSlug}.mdx`)
    const indexMdPath = path.join(process.cwd(), 'docs', `${indexSlug}.md`)
    const directMdxPath = path.join(process.cwd(), 'docs', `${slug}.mdx`)
    const directMdPath = path.join(process.cwd(), 'docs', `${slug}.md`)

    try {
      source = await fs.readFile(mdxPath, 'utf8')
    } catch {
      try {
        source = await fs.readFile(indexMdPath, 'utf8')
      } catch {
        try {
          source = await fs.readFile(directMdxPath, 'utf8')
        } catch {
          try {
            source = await fs.readFile(directMdPath, 'utf8')
          } catch {
            notFound()
          }
        }
      }
    }
  }

  try {
    const { content } = await compileMDX({
      source,
      components,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: mdxPlugins.remarkPlugins,
          rehypePlugins: mdxPlugins.rehypePlugins,
        },
      },
    })

    return (
      <DocsLayout>
        {content}
      </DocsLayout>
    )
  } catch {
    notFound()
  }
}


