'use client';

import type { JSX } from 'react';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { DeanMachinesLogo } from './DeanMachinesLogo';
import { UserMenu } from './UserMenu';
import { LogIn } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  active: boolean;
}

interface TopNavigationProps {
  children?: React.ReactNode;
  currentRole?: string;
  onSignOut?: () => void;
}

export function TopNavigation({ children, currentRole, onSignOut }: TopNavigationProps): JSX.Element {
  const pathname = usePathname(); // asserted as non-null for type safety

  const navigationLinks: NavLink[] = [
    { href: '/', label: 'Home', active: pathname === '/' },
    { href: '/demo-rag', label: 'Demo', active: pathname === '/demo-rag' },
    { href: '/docs', label: 'Documentation', active: pathname.startsWith('/docs') },
    { href: '/cedar-os', label: 'Cedar', active: pathname === '/cedar-os' },
    { href: '/login', label: 'Login', active: pathname === '/login' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-10 border-b border-primary/20 bg-background flex items-center justify-between px-4 shadow-sm flex-nowrap">
      {/* Logo and Title - clickable to home, with hover */}
      <Link href="/" className="flex items-center space-x-2 flex-nowrap cursor-pointer hover:scale-105 transition-transform duration-200 flex-shrink-0">
        <DeanMachinesLogo className="h-6 w-6 text-primary flex-shrink-0" />
        <span className="text-base font-semibold text-foreground truncate flex-shrink-0">Deanmachines</span>
      </Link>

      {/* Navigation Menu - centered, no wrap */}
      <NavigationMenu className="flex flex-1 justify-center">
        <NavigationMenuList className="flex flex-nowrap space-x-1 min-w-max">
          {navigationLinks.map((link: NavLink) => (
            <NavigationMenuItem key={link.href}>
              <Button
                asChild
                variant={link.active ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "relative px-3 py-1.5 h-8 text-xs font-bold uppercase tracking-wider",
                  "transition-all duration-300 ease-spring",
                  "hover-lift hover-glow hover-scale",
                  link.active && "btn-brutalist bg-primary text-primary-foreground shadow-md",
                  !link.active && "btn-gradient hover:bg-accent/20"
                )}
              >
                <Link href={link.href} aria-current={link.active ? "page" : undefined}>
                  <span className={cn(
                    "relative z-10",
                    link.active && "text-shadow",
                    !link.active && "text-foreground"
                  )}>
                    {link.label}
                  </span>
                  {link.active && (
                    <>
                      <Badge variant="secondary" className="ml-1 bg-accent/20 text-accent text-xs">
                        Active
                      </Badge>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                    </>
                  )}
                  {!link.active && (
                    <div className="absolute inset-0 bg-gradient-accent opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-md" />
                  )}
                </Link>
              </Button>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right side controls: either UserMenu (when authenticated) or Login button; plus any children */}
      <div className="flex items-center space-x-3">
        {typeof currentRole === 'string' && currentRole.trim() !== '' ? (
          <UserMenu currentRole={currentRole} onSignOut={onSignOut} />
        ) : (
          <Button
            asChild
            variant="outline"
            size="sm"
            className={cn(
              "group relative h-8 px-3 gap-2",
              "border-2 border-primary/30 hover:border-accent/50",
              "bg-background",
              "hover-lift hover-glow hover-scale",
              "transition-all duration-300 ease-spring",
              "btn-brutalist shadow-md",
              "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            )}
            aria-label="Login"
          >
            <Link href="/login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
              <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider">
                Login
              </span>
            </Link>
          </Button>
        )}

        {/* render any additional right-side children */}
        {children}
      </div>
    </header>
  );
}
