"use client";
import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Github, Shield, Database, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterSection {
  heading: string;
  items: Array<{ label: string; href: string; external?: boolean }>;
}

const sections: FooterSection[] = [
  {
    heading: 'Platform',
    items: [
      { label: 'Docs', href: '/docs' },
      { label: 'Demo', href: '/demo-rag' },
      { label: 'Blog', href: '/blog' },
    ]
  },
  {
    heading: 'Security',
    items: [
      { label: 'Architecture', href: '/docs/architecture' },
      { label: 'Security Model', href: '/docs/security' },
      { label: 'RBAC Demo Roles', href: '/docs/demo-roles' },
    ]
  },
  {
    heading: 'External',
    items: [
      { label: 'Mastra', href: 'https://mastra.ai', external: true },
      { label: 'Qdrant', href: 'https://qdrant.tech', external: true },
      { label: 'GitHub', href: 'https://github.com/ssdeanx/governed-rag-ai', external: true },
    ]
  }
];

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn('mt-20 border-t border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-tight">Governed RAG</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Secure, role-aware Retrieval-Augmented Generation with multi-agent governance and enterprise-grade auditability.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline" className="text-xs">Tailwind v4</Badge>
              <Badge variant="outline" className="text-xs">Next.js 15</Badge>
              <Badge variant="outline" className="text-xs">React 19</Badge>
            </div>
          </div>

          {sections.map(section => (
            <div key={section.heading} className="space-y-4">
              <h4 className="text-sm font-semibold tracking-wide text-foreground/80 uppercase">{section.heading}</h4>
              <ul className="space-y-2 text-sm">
                {section.items.map(item => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      target={item.external === true ? '_blank' : undefined}
                      rel={item.external === true ? 'noopener noreferrer' : undefined}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                      {item.external === true ? <span className="sr-only"> (external link)</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link href="https://github.com/ssdeanx/governed-rag-ai" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository" className="hover:text-foreground inline-flex items-center gap-1">
              <Github className="h-4 w-4" /> GitHub
            </Link>
            <Link href="https://mastra.ai" target="_blank" rel="noopener noreferrer" aria-label="Mastra Website" className="hover:text-foreground inline-flex items-center gap-1">
              <Globe className="h-4 w-4" /> Mastra
            </Link>
            <Link href="https://qdrant.tech" target="_blank" rel="noopener noreferrer" aria-label="Qdrant Website" className="hover:text-foreground inline-flex items-center gap-1">
              <Database className="h-4 w-4" /> Qdrant
            </Link>
          </div>
          <p className="text-muted-foreground text-center md:text-right">© {new Date().getFullYear()} Governed RAG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
