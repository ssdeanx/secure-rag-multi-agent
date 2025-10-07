import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function DocsLoading() {
    return (
        <div className="p-8 grid grid-cols-1 xl:grid-cols-5 gap-8">
            <div className="xl:col-span-1 space-y-3">
                <Skeleton className="h-6 w-40" />
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-32" />
                ))}
            </div>
            <div className="xl:col-span-4 space-y-4">
                <Skeleton className="h-8 w-72" />
                {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                ))}
            </div>
        </div>
    )
}
