'use client';

import type { JSX } from 'react';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { DeanMachinesLogo } from './DeanMachinesLogo';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from './ThemeToggle';
import { LogIn } from 'lucide-react';

interface TopNavigationProps {
  children?: React.ReactNode;
  currentRole?: string;
  onSignOut?: () => void;
}

export function TopNavigation({ children, currentRole, onSignOut }: TopNavigationProps): JSX.Element {
  const pathname = usePathname();

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/demo-rag', label: 'Demo' },
    { href: '/docs', label: 'Documentation' },
    { href: '/cedar-os', label: 'Cedar' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-14 border-b border-border/40 bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 shadow-sm">
      {/* left: logo + optional search */}
      <div className="flex items-center gap-3 flex-none">
        <Link href="/" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
          <DeanMachinesLogo className="h-8 w-8" />
          <span className="text-lg font-semibold text-foreground">Deanmachines</span>
        </Link>

        <Input className="hidden sm:block w-64" placeholder="Search..." />
      </div>

      {/* center: inline nav on md+, hidden on small screens */}
      <nav className="hidden md:flex flex-1 justify-center">
        <ul className="inline-flex items-center gap-4">
          {navigationLinks.map((link) => (
            <li key={link.href}>
              <Button asChild variant="ghost" size="sm">
                <Link href={link.href} className={cn(pathname?.startsWith(link.href) ? 'text-primary' : 'text-foreground')}>
                  {link.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* mobile menu: visible on small screens */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {navigationLinks.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <Link href={link.href} className="block w-full">{link.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* right: user area */}
      <div className="flex items-center space-x-3 flex-none">
        {typeof currentRole === 'string' && currentRole.trim() !== '' ? (
          <UserMenu currentRole={currentRole} onSignOut={onSignOut} />
        ) : (
          <Button asChild variant="ghost" size="sm">
            <Link href="/login" className="flex items-center">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Link>
          </Button>
        )}

        <ThemeToggle />
        {children}
      </div>
    </header>
  );
}