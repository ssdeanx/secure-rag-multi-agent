'use client';

import type { JSX } from 'react';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

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

  const [open, setOpen] = useState(false);

  return (
  <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Skip to content</a>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <nav className="hidden md:flex flex-1 items-center space-x-4" aria-label="Main navigation">
          <Menubar className="w-full flex items-center justify-between space-x-6">
            {/* Logo as first trigger */}
            <MenubarMenu>
              <MenubarTrigger asChild className={cn(
                'btn-ghost hover-lift neon-glow-green font-bold no-underline',
                pathname === '/' ? 'text-primary bg-primary/5' : 'text-foreground/70'
              )}>
                <Link href="/" className="no-underline text-balance inline-flex items-center">
                  <span className="tracking-tight">Deanmachines</span>
                </Link>
              </MenubarTrigger>
            </MenubarMenu>
            {/* Nav links */}
            {navigationLinks.map((link) => {
              const active = pathname === link.href || pathname?.startsWith(link.href);
              return (
                <MenubarMenu key={link.href}>
                  <MenubarTrigger asChild className={cn(
                    'btn-ghost hover-lift neon-glow-green',
                    active ? 'text-primary bg-primary/5' : 'text-foreground/70'
                  )}>
                    <Link href={link.href} aria-current={active ? 'page' : undefined} className="no-underline px-2 py-1 rounded-md focus-visible:ring-2 focus-visible:ring-primary/50">
                      {link.label}
                    </Link>
                  </MenubarTrigger>
                </MenubarMenu>
              );
            })}
            {/* ThemeToggle as second-last */}
            <MenubarMenu>
              <MenubarTrigger asChild className="btn-ghost hover-lift neon-glow-green">
                <div className="px-1 py-1 rounded-md focus-visible:ring-2 focus-visible:ring-primary/50"><ThemeToggle /></div>
              </MenubarTrigger>
            </MenubarMenu>
            {/* Conditional Login as last */}
            {typeof currentRole !== 'string' || currentRole.trim() === '' ? (
              <MenubarMenu>
                <MenubarTrigger asChild className={cn(
                  'btn-ghost hover-lift neon-glow-green',
                  pathname?.startsWith('/login') ? 'text-primary bg-primary/5' : 'text-foreground/70'
                )}>
                  <Link href="/login" className="no-underline px-2 py-1 rounded-md focus-visible:ring-2 focus-visible:ring-primary/50">
                    Login
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>
            ) : null}
          </Menubar>
        </nav>
        {/* Mobile Menu */}
        <div className="md:hidden ml-auto flex items-center gap-3">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" aria-label="Open navigation menu" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64" aria-label="Mobile navigation">
              <nav className="flex flex-col gap-2 mt-6">
                {navigationLinks.map((link) => {
                  const active = pathname === link.href || pathname?.startsWith(link.href);
                  return (
                    <Button key={link.href} variant={active ? 'secondary' : 'ghost'} asChild className="justify-start">
                      <Link href={link.href} aria-current={active ? 'page' : undefined} onClick={() => setOpen(false)}>
                        {link.label}
                      </Link>
                    </Button>
                  );
                })}
                {(typeof currentRole !== 'string' || currentRole.trim() === '') && (
                  <Button variant={pathname?.startsWith('/login') ? 'secondary' : 'ghost'} asChild className="justify-start">
                    <Link href="/login" aria-current={pathname?.startsWith('/login') ? 'page' : undefined} onClick={() => setOpen(false)}>
                      Login
                    </Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        {children}
      </div>
    </header>
  );
}
