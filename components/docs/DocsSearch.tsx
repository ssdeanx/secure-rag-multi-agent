'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/shadnui/input'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/shadnui/command'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface DocIndexEntry {
    slug: string
    title: string
    headings: Array<{ id: string; text: string; level: number }>
}

function fuseScore(query: string, text: string): number {
    if (!query) {
        return 0
    }
    const q = query.toLowerCase()
    const t = text.toLowerCase()
    if (t.includes(q)) {
        return q.length / t.length
    }
    // Basic subsequence match scoring
    let qi = 0
    let score = 0
    for (let i = 0; i < t.length && qi < q.length; i++) {
        if (t[i] === q[qi]) {
            qi++
            score += 1
        }
    }
    return qi === q.length ? score / t.length : 0
}

export function DocsSearch() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<DocIndexEntry[]>([])
    const [allDocs, setAllDocs] = useState<DocIndexEntry[]>([])
    const router = useRouter()

    useEffect(() => {
        let cancelled = false
        fetch('/api/docs-index')
            .then((r) => r.json())
            .then((data: DocIndexEntry[]) => {
                if (!cancelled) {
                    setAllDocs(data)
                }
            })
            .catch(() => {})
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        if (!query) {
            setResults([])
            return
        }
        const scored = allDocs
            .map((d) => {
                const titleScore = fuseScore(query, d.title) * 2 // weight title higher
                const headingScore = Math.max(
                    0,
                    ...d.headings.map((h) => fuseScore(query, h.text))
                )
                return { doc: d, score: Math.max(titleScore, headingScore) }
            })
            .filter((s) => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map((s) => s.doc)
        setResults(scored)
    }, [query, allDocs])

    const onSelect = (slug: string) => {
        setQuery('')
        setResults([])
        router.push(slug.startsWith('/docs') ? slug : `/docs/${slug}`)
    }

    return (
        <div className="space-y-2">
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search docs..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search documentation"
                    className="pl-8 h-9 text-sm"
                />
            </div>
            {query && (
                <Command className="rounded-md border bg-background">
                    <CommandList>
                        <CommandEmpty>No results</CommandEmpty>
                        <CommandGroup heading="Results">
                            {results.map((r) => (
                                <CommandItem
                                    key={r.slug}
                                    onSelect={() => onSelect(`/docs/${r.slug}`)}
                                    value={r.slug}
                                    className="cursor-pointer"
                                >
                                    <span className="truncate">{r.title}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            )}
        </div>
    )
}
