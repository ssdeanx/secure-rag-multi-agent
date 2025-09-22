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

  return files
    .filter((file: string) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file: string) => {
      const slug = file.replace(/\.(md|mdx)$/, '').split('/')
      return { slug }
    });
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
  const mdPath = path.join(process.cwd(), 'docs', `${slug}.md`)
  const mdxPath = path.join(process.cwd(), 'docs', `${slug}.mdx`)
  
  let filePath = mdPath
  let source = ''
  
  try {
    // Try MDX first
    source = await fs.readFile(mdxPath, 'utf8')
    filePath = mdxPath
  } catch {
    // Fall back to MD
    try {
      source = await fs.readFile(mdPath, 'utf8')
      filePath = mdPath
    } catch {
      notFound()
    }
  }

    try {
    const { content } = await compileMDX({
      source,
      components,
      // compileMDX types don't include arbitrary mdx plugin props here so
      // cast the options to any to pass through remark/rehype plugins.
      options: ({
        parseFrontmatter: true,
        remarkPlugins: mdxPlugins.remarkPlugins,
        rehypePlugins: mdxPlugins.rehypePlugins,
      } as any),
    })

    return (
      <DocsLayout>
        {content}
      </DocsLayout>
    )
  } catch (error) {
    console.error('MDX compilation error:', error)
    notFound()
  }
}