'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { GovernedRAGLogo } from './GovernedRAGLogo';
import { UserMenu } from './UserMenu';
import { LogIn, User, Menu, ChevronDown } from 'lucide-react';

interface TopNavigationProps {
  children?: React.ReactNode;
  currentRole?: string;
  onSignOut?: () => void;
}

export function TopNavigation({ children, currentRole, onSignOut }: TopNavigationProps) {
  const navigationLinks = [
    { href: '#chat', label: 'Chat', active: true },
    { href: '#indexing', label: 'Indexing', active: false },
    { href: '/docs', label: 'Documentation', active: true },
  ];

  const handleNavigation = (href: string) => {
    if (href.startsWith('/')) {
      window.location.href = href;
    } else if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <TooltipProvider>
      {/* Single layer navbar */}
      <header className="sticky top-0 z-50 w-full h-12 border-b-2 border-primary/20 bg-gradient-mocha backdrop-blur-xl flex items-center justify-between px-4 shadow-lg">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <GovernedRAGLogo className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground">Deamachines</span>
            <span className="text-xs text-muted-foreground -mt-1">AI Solutions</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigationLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Button
                    variant={link.active ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleNavigation(link.href)}
                    className={cn(
                      "relative px-3 py-2 h-8 text-xs font-bold uppercase tracking-wider",
                      "transition-all duration-300 ease-spring",
                      "hover-lift hover-glow hover-scale",
                      link.active && "btn-brutalist bg-primary text-primary-foreground shadow-xl",
                      !link.active && "btn-gradient hover:bg-accent/20"
                    )}
                  >
                    <span className={cn(
                      "relative z-10",
                      link.active && "text-shadow-lg",
                      !link.active && "text-foreground"
                    )}>
                      {link.label}
                    </span>
                    {link.active && (
                      <>
                        <Badge variant="secondary" className="ml-2 bg-accent/20 text-accent text-xs">
                          Active
                        </Badge>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-accent rounded-full animate-pulse" />
                      </>
                    )}
                    {!link.active && (
                      <div className="absolute inset-0 bg-gradient-accent opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-md" />
                    )}
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side content */}
        <div className="flex items-center space-x-3">
          {currentRole ? (
            <UserMenu currentRole={currentRole} onSignOut={onSignOut} />
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "group relative h-8 px-3 gap-2",
                    "border-2 border-primary/30 hover:border-accent/50",
                    "bg-gradient-mocha backdrop-blur-sm",
                    "hover-lift hover-glow hover-scale",
                    "transition-all duration-300 ease-spring",
                    "btn-brutalist shadow-lg",
                    "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  )}
                  aria-label="Login"
                >
                  <LogIn className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                  <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider">
                    Login
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign in to access the system</p>
              </TooltipContent>
            </Tooltip>
          )}
          {children}
        </div>
      </header>
    </TooltipProvider>
  );
}
