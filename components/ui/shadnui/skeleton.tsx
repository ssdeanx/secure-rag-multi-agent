import { cn } from '@/lib/utils'
import React from 'react'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="skeleton"
            aria-busy="true"
            className={cn(
                'relative overflow-hidden rounded-md bg-muted/60 dark:bg-muted/40 animate-pulse',
                'motion-reduce:animate-none',
                className
            )}
            {...props}
        >
            <span className="sr-only">Loading</span>
        </div>
    )
}

export { Skeleton }
