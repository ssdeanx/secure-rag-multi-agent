'use client';

import type { JSX } from 'react';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <header className="sticky top-0 z-50 w-full h-14 border-b border-border/40 bg-background/95 backdrop-blur-sm flex items-center justify-between px-2 sm:px-4 shadow-sm flex-nowrap overflow-x-auto">  {/* flex-nowrap + overflow-x-auto: horizontal scroll on small, no stack */}
      {/* left: logo + optional search - fixed width, horizontal */}
      <div className="flex items-center gap-2 sm:gap-3 flex-none">  {/* Reduced gap mobile */}
        <Link href="/" className="flex items-center space-x-1 sm:space-x-2 hover:scale-105 transition-transform duration-200 flex-nowrap flex-shrink-0">
          <DeanMachinesLogo className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />  {/* Smaller on mobile */}
          <span className="text-base sm:text-lg font-semibold text-foreground whitespace-nowrap flex-shrink-0">Deanmachines</span>
        </Link>

        <Input className="hidden md:block w-40 sm:w-48 flex-shrink-0" placeholder="Search..." />  {/* Slightly shrunk; hidden <md */}
      </div>

      {/* center: nav always visible, horizontal only */}
      <nav className="flex flex-1 justify-center flex-nowrap px-1">  {/* Always shown; px-1 mobile squeeze */}
        <ul className="inline-flex items-center gap-1 sm:gap-4 flex-nowrap">  {/* Reduced gap mobile */}
          {navigationLinks.map((link) => (
            <li key={link.href} className="flex-shrink-0">
              <Button asChild variant="ghost" size="sm">
                <Link href={link.href} className={cn(pathname?.startsWith(link.href) ? 'text-primary' : 'text-foreground', 'whitespace-nowrap text-xs sm:text-sm px-1 sm:px-3')}>
                  {link.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* right: user area - fixed, horizontal */}
      <div className="flex items-center space-x-1 sm:space-x-3 flex-none">  {/* Reduced space mobile */}
        {typeof currentRole === 'string' && currentRole.trim() !== '' ? (
          <div className="flex-shrink-0">  {/* Wrap to apply className without prop error */}
            <UserMenu currentRole={currentRole} onSignOut={onSignOut} />
          </div>
        ) : (
          <Button asChild variant="ghost" size="sm" className="flex-shrink-0 h-8 px-1 sm:px-3">
            <Link href="/login" className="flex items-center whitespace-nowrap text-xs sm:text-sm">
              <LogIn className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="hidden xs:inline">Login</span>  {/* Hide text on ultra-small; show on xs+ */}
            </Link>
          </Button>
        )}

        <div className="flex-shrink-0">
          <ThemeToggle />
        </div>
        {children}
      </div>
    </header>
  );
}
