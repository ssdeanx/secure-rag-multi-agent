'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  BookOpen,
  Play,
  Shield,
  Code,
  Layers,
  Users,
  Home,
  ChevronRight,
  Github,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'

interface DocsLayoutProps {
  children: React.ReactNode
}

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Overview', href: '/docs', icon: Home },
      { title: 'Quick Start', href: '/docs/quick-start', icon: Play },
    ]
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'Security Model', href: '/docs/security', icon: Shield },
      { title: 'Architecture', href: '/docs/architecture', icon: Layers },
      { title: 'API Reference', href: '/docs/api-reference', icon: Code },
    ]
  },
  {
    title: 'Examples & Guides',
    items: [
      { title: 'Demo Roles', href: '/docs/demo-roles', icon: Users },
      { title: 'Advanced Usage', href: '/docs/advanced', icon: BookOpen },
    ]
  }
]

export function DocsLayout({ children }: DocsLayoutProps) {
  const pathname = usePathname()
  const currentSlug = pathname?.split('/')?.[2] ?? ''
  const currentTitle = currentSlug ? decodeURIComponent(currentSlug).replace(/[-_]/g, ' ') : 'Overview'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <HoverCard>
              <HoverCardTrigger>
                <Link href="/docs" className="flex items-center space-x-4 group">
                  <div className="relative">
                    <Shield className="h-12 w-12 text-primary animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-ping" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Governed RAG Docs
                    </h1>
                    <p className="text-muted-foreground">Enterprise-grade AI with zero-trust security</p>
                  </div>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="w-64">
                <div className="text-sm text-muted-foreground">Guides, API reference, and examples for Governed RAG.</div>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Breadcrumb (shadcn) */}
          <div className="mb-6">
            <Breadcrumb aria-label="Breadcrumb">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="px-3 py-1 bg-accent/10 text-accent">
              <Shield className="h-3 w-3 mr-1" />
              Zero-Trust
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 bg-accent/10 text-accent">
              <Users className="h-3 w-3 mr-1" />
              Role-Based
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 bg-accent/10 text-accent">
              <Layers className="h-3 w-3 mr-1" />
              Multi-Agent
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation (shadcn Sidebar) */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Documentation</CardTitle>
                <CardDescription>Navigate through our guides</CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <ScrollArea>
                  <div className="space-y-4">
                    {navigation.map((section) => (
                      <div key={section.title} className="p-1">
                        <Collapsible defaultOpen>
                          <CollapsibleTrigger className="w-full text-sm font-semibold text-muted-foreground text-left uppercase tracking-wider mb-2">{section.title}</CollapsibleTrigger>
                          <CollapsibleContent className="mt-2">
                            <div className="flex flex-col gap-1">
                              {section.items.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href
                                return (
                                  <Button asChild key={item.href} variant={isActive ? 'secondary' : 'ghost'} className={cn('w-full justify-start h-9 px-3 text-sm', isActive && 'bg-primary/10 text-primary font-medium')}>
                                    <Link href={item.href} className="flex items-center w-full">
                                      <Icon className="h-4 w-4 mr-2" />
                                      <span className="flex-1 text-left">{item.title}</span>
                                      {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                                    </Link>
                                  </Button>
                                )
                              })}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                        <Separator className="mt-2" />
                      </div>
                    ))}

                    <div className="pt-2">
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Resources</div>
                      <div className="flex flex-col gap-1">
                        <Button asChild variant="ghost" className="w-full justify-start h-9 px-3 text-sm">
                          <Link href="https://github.com/ssdeanx/governed-rag-ai" target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                            <ExternalLink className="h-3 w-3 ml-auto" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full justify-start h-9 px-3 text-sm">
                          <Link href="https://mastra.ai" target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                            <Shield className="h-4 w-4 mr-2" />
                            Mastra.ai
                            <ExternalLink className="h-3 w-3 ml-auto" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="min-h-[600px]">
              <CardContent className="p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  {children}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
