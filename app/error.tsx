"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body className="min-h-screen bg-background flex items-center py-24">
        <div className="max-w-lg mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center justify-center rounded-full border border-border/60 w-24 h-24 mx-auto relative overflow-hidden animated-gradient-subtle motion-reduce:animate-none">
            <span className="text-3xl font-bold select-none">ERR</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Unexpected Error</h1>
          <p className="text-muted-foreground">An unexpected error occurred while rendering this page. The event has been recorded.</p>
          {error.digest !== undefined && error.digest !== '' && (
            <p className="text-xs text-muted-foreground">Ref: {error.digest}</p>
          )}
          <div className="rounded-md border border-border/60 p-4 text-left bg-muted/30 space-y-1">
            <p className="text-sm font-medium text-foreground">Security Notice</p>
            <p className="text-xs text-muted-foreground">We intentionally withhold internal error details to protect system integrity.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => reset()}>Retry</Button>
            <Button asChild variant="outline">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
