"use client";
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface HeadingItem { id: string; text: string; level: number }

export function DocsTOC() {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
  const nodes = Array.from(document.querySelectorAll('.prose h2, .prose h3'));
    const collected: HeadingItem[] = nodes
      .filter(h => h.id)
      .map(h => ({ id: h.id, text: h.textContent || '', level: h.tagName === 'H2' ? 2 : 3 }));
    setHeadings(collected);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: [0, 1] }
    );
    collected.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) {
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) {
    return null;
  }
  return (
    <nav aria-label="Table of contents" className="text-sm space-y-2">
      <p className="font-semibold text-muted-foreground uppercase tracking-wide text-xs">On this page</p>
      <ul className="space-y-1">
        {headings.map(h => (
          <li key={h.id} className={cn('leading-snug', h.level === 3 && 'pl-3')}>
            <a
              href={`#${h.id}`}
              className={cn(
                'block py-1 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-sm transition-colors',
                active === h.id ? 'text-primary font-medium' : 'text-muted-foreground'
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
