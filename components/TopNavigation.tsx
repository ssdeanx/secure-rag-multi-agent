'use client';

import type { JSX } from 'react';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';

interface TopNavigationProps {
  children?: React.ReactNode;
  currentRole?: string;
}

export function TopNavigation({ children, currentRole }: TopNavigationProps): JSX.Element {
  const pathname = usePathname();

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/demo-rag', label: 'Demo' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/docs', label: 'Documentation' },
    { href: '/cedar-os', label: 'Cedar' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center">
        <nav className="flex-1 flex items-center space-x-4">
          <Menubar className="w-full flex items-center justify-between space-x-6">
            {/* Logo as first trigger */}
            <MenubarMenu>
              <MenubarTrigger asChild className={cn(
                'btn-ghost hover-lift neon-glow-green font-bold no-underline',
                pathname === '/' ? 'text-primary bg-primary/5' : 'text-foreground/70'
              )}>
                <Link href="/" className="no-underline">
                  Deanmachines
                </Link>
              </MenubarTrigger>
            </MenubarMenu>
            {/* Nav links */}
            {navigationLinks.map((link) => (
              <MenubarMenu key={link.href}>
                <MenubarTrigger asChild className={cn(
                  'btn-ghost hover-lift neon-glow-green',
                  pathname?.startsWith(link.href)
                    ? 'text-primary bg-primary/5'
                    : 'text-foreground/70'
                )}>
                  <Link href={link.href} className="no-underline">
                    {link.label}
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>
            ))}
            {/* ThemeToggle as second-last */}
            <MenubarMenu>
              <MenubarTrigger asChild className="btn-ghost hover-lift neon-glow-green">
                <ThemeToggle />
              </MenubarTrigger>
            </MenubarMenu>
            {/* Conditional Login as last */}
            {typeof currentRole !== 'string' || currentRole.trim() === '' ? (
              <MenubarMenu>
                <MenubarTrigger asChild className={cn(
                  'btn-ghost hover-lift neon-glow-green',
                  pathname?.startsWith('/login') ? 'text-primary bg-primary/5' : 'text-foreground/70'
                )}>
                  <Link href="/login" className="no-underline">
                    Login
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>
            ) : null}
          </Menubar>
        </nav>
        {children}
      </div>
    </header>
  );
}
