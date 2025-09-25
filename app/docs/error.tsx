'use client'
import React from 'react'
import { Button } from '@/components/ui/button'

export default function DocsError({ reset }: { reset: () => void }) {
  return (
    <div className="p-8 text-center space-y-4">
      <h2 className="text-2xl font-bold">Documentation Unavailable</h2>
      <p className="text-muted-foreground max-w-md mx-auto">Something went wrong rendering this documentation page. The issue has been logged. You may retry or return to the docs home.</p>
      <div className="flex gap-3 justify-center">
        <Button variant="secondary" onClick={() => reset()}>Retry</Button>
        <Button asChild>
          <a href="/docs">Back to Docs</a>
        </Button>
      </div>
    </div>
  )
}
