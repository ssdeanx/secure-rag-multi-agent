import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center py-24">
      <div className="max-w-lg mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center justify-center rounded-full border border-border/60 w-24 h-24 mx-auto relative overflow-hidden animated-gradient-subtle motion-reduce:animate-none">
          <span className="text-4xl font-bold select-none">404</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
        <p className="text-lg text-muted-foreground">We couldn't find the page you're looking for. It may have been moved or removed.</p>
        <div className="rounded-md border border-border/60 p-4 text-left bg-muted/30 space-y-2">
          <p className="text-sm text-foreground font-medium">Security & Integrity</p>
          <p className="text-xs text-muted-foreground">If you followed a link here, it might be outdated. We log 404s to help improve navigation and detect enumeration attempts.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs">View Docs</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
