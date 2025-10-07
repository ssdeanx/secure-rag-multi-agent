import React from 'react'
import Link from 'next/link'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface BlogMeta {
    slug: string
    title: string
    date: string // ISO
    excerpt: string
    tags?: string[]
    author?: string
    readingTime?: string
}

interface ArticleCardProps {
    meta: BlogMeta
}

export function ArticleCard({ meta }: ArticleCardProps) {
    return (
        <Card className="h-full flex flex-col hover-lift hover-glow transition-colors">
            <CardHeader className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-xs text-muted-foreground tracking-wide font-mono">
                        {new Date(meta.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </div>
                    {meta.readingTime !== undefined &&
                    meta.readingTime !== '' ? (
                        <span className="text-[10px] uppercase tracking-wide bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {meta.readingTime}
                        </span>
                    ) : null}
                </div>
                <CardTitle className="text-xl leading-snug">
                    <Link
                        href={`/blog/${meta.slug}`}
                        className="focus:outline-none focus:ring-2 focus:ring-primary/60 rounded-sm"
                    >
                        {meta.title}
                    </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                    {meta.excerpt}
                </CardDescription>
                {meta.tags && meta.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {meta.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs px-2 py-0.5"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
                {meta.author !== undefined && meta.author !== '' ? (
                    <p className="text-xs text-muted-foreground pt-1">
                        By {meta.author}
                    </p>
                ) : null}
            </CardHeader>
        </Card>
    )
}
