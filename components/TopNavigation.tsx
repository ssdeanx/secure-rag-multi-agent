'use client';

import React from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface TopNavigationProps {
  children?: React.ReactNode;
  currentRole?: string;
  onSignOut?: () => void;
}

export function TopNavigation({ children }: TopNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationLinks = [
    { href: '#chat', label: 'Chat', active: true },
    { href: '#indexing', label: 'Indexing', active: false },
    { href: '/docs', label: 'Documentation', active: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background">
  <div className="app-container nav-grid h-14">


  {/* Logo and Title */}
  <div className="hidden md:flex justify-self-start">
          <div className="flex-center space-x-2">
            <Shield className="h-6 w-6 text-primary size-fit" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary">
                Governed RAG
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                Secure AI with Mastra
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Logo */}
        <div className="flex md:hidden">
           <div className="flex-center space-x-2">
             <Shield className="h-6 w-6 text-primary size-fit" />
             <span className="text-base font-bold text-primary">
               Governed RAG
             </span>
           </div>
         </div>

  {/* Desktop Navigation */}
  <nav className="hidden md:flex items-center space-x-6 text-sm font-medium justify-self-center">
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                 "hover:text-foreground relative",
                 link.active ? "text-foreground" : "text-foreground/60"
               )}
            >
              {link.label}
              {link.active && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </a>
          ))}
        </nav>

  {/* Right side content */}
  <div className="flex items-center space-x-2 justify-self-end">
          {children}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-base font-bold">Governed RAG</span>
              </div>

              <nav className="flex flex-col space-y-3">
                {navigationLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      link.active
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground/60"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
