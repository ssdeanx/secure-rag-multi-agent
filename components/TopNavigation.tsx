'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { GovernedRAGLogo } from './GovernedRAGLogo';
import { UserMenu } from './UserMenu';
import { LogIn } from 'lucide-react';

interface TopNavigationProps {
  children?: React.ReactNode;
  currentRole?: string;
  onSignOut?: () => void;
}

export function TopNavigation({ children, currentRole, onSignOut }: TopNavigationProps) {
  const pathname = usePathname();

  const navigationLinks = [
    { href: '/', label: 'Home', active: pathname === '/' },
    { href: '/demo-rag', label: 'Demo', active: pathname === '/demo-rag' },
    { href: '/docs', label: 'Documentation', active: pathname.startsWith('/docs') },
    { href: '/login', label: 'Login', active: pathname === '/login' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-10 border-b border-primary/20 bg-background flex items-center justify-between px-4 shadow-sm">
      {/* Logo and Title */}
      <div className="flex items-center space-x-2">
        <GovernedRAGLogo className="h-6 w-6 text-primary" />
        <span className="text-base font-semibold text-foreground">Deamachines</span>
        <span className="text-xs text-muted-foreground">• AI Solutions</span>
      </div>
      {/* Navigation Menu */}
      <NavigationMenu className="flex">
        <NavigationMenuList>
          {navigationLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              <Link href={link.href} legacyBehavior>
                <Button
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
                </Button>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      {/* Right side content */}
      <div className="flex items-center space-x-2">
        {currentRole ? (
          <UserMenu currentRole={currentRole} onSignOut={onSignOut} />
        ) : (
          <Link href="/login" legacyBehavior>
            <Button
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
              <LogIn className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
              <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider">
                Login
              </span>
            </Button>
          </Link>
        )}
        {children}
      </div>
    </header>
  );
}
