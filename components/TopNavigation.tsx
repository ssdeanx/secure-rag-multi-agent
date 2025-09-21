'use client';

import type { JSX } from 'react';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { DeanMachinesLogo } from './DeanMachinesLogo';
import { UserMenu } from './UserMenu';
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
      <Link href="/" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
        <DeanMachinesLogo className="h-8 w-8" />
        <span className="text-lg font-semibold text-foreground">Deanmachines</span>
      </Link>

      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          {navigationLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              <Link href={link.href} legacyBehavior passHref>
                <NavigationMenuLink active={pathname.startsWith(link.href)} className={navigationMenuTriggerStyle()}>
                  {link.label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center space-x-3">
        {currentRole ? (
          <UserMenu currentRole={currentRole} onSignOut={onSignOut} />
        ) : (
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Link>
          </Button>
        )}
        {children}
      </div>
    </header>
  );
}