import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number;
  pageCount: number;
  basePath?: string;
}

export function Pagination({ page, pageCount, basePath = '/blog' }: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }
  const prevDisabled = page <= 1;
  const nextDisabled = page >= pageCount;
  return (
    <nav aria-label="Blog pagination" className="flex items-center justify-center gap-4 mt-12">
      <Button asChild variant="outline" size="sm" disabled={prevDisabled} aria-disabled={prevDisabled}>
        <a href={`${basePath}?page=${page - 1}`} aria-label="Previous page">Previous</a>
      </Button>
      <p className="text-sm font-medium">Page {page} of {pageCount}</p>
      <Button asChild variant="outline" size="sm" disabled={nextDisabled} aria-disabled={nextDisabled}>
        <a href={`${basePath}?page=${page + 1}`} aria-label="Next page">Next</a>
      </Button>
    </nav>
  );
}
