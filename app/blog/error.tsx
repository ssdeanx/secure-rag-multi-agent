'use client'
import React from 'react'
import { Button } from '@/components/ui/shadnui/button'

export default function BlogError({ reset }: { reset: () => void }) {
    return (
        <div className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold">Blog Page Error</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't load this blog content. You can retry or return to
                the blog index.
            </p>
            <div className="flex gap-3 justify-center">
                <Button variant="secondary" onClick={() => reset()}>
                    Retry
                </Button>
                <Button asChild>
                    <a href="/blog">Back to Blog</a>
                </Button>
            </div>
        </div>
    )
}
