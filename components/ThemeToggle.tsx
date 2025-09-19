'use client';

import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Monitor className="h-4 w-4" />
      </Button>
    );
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-4 w-4 transition-all duration-700 ease-out rotate-0 scale-100 hover:scale-115 hover:rotate-15 hover:drop-shadow-[0_0_8px_oklch(0.6_0.3_280)]" />;
      case 'light':
        return <Sun className="h-4 w-4 transition-all duration-700 ease-out rotate-0 scale-100 hover:scale-115 hover:rotate-180 hover:drop-shadow-[0_0_8px_oklch(0.7_0.3_240)]" />;
      case 'system':
        return <Monitor className="h-4 w-4 transition-all duration-700 ease-out rotate-0 scale-100 hover:scale-115 hover:drop-shadow-[0_0_8px_oklch(0.8_0.2_180)]" />;
      case undefined:
        return <Monitor className="h-4 w-4 transition-all duration-700 ease-out rotate-0 scale-100 hover:scale-115 hover:drop-shadow-[0_0_8px_oklch(0.8_0.2_180)]" />;
      default:
        return <Monitor className="h-4 w-4 transition-all duration-700 ease-out rotate-0 scale-100 hover:scale-115 hover:drop-shadow-[0_0_8px_oklch(0.8_0.2_180)]" />;
    }
  };

  return (
    <div className="app-container">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="hover-lift hover-glow hover:neon-glow-blue active:neon-glow-cyan transition-all duration-500 ease-out border-2 border-border/50 hover:border-primary/70 rounded-xl backdrop-blur-sm bg-card/80"
            aria-label="Toggle theme"
          >
          {getThemeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={4} className="backdrop-blur-enhanced glass-light border-border/50 rounded-xl">
        <DropdownMenuItem onClick={() => setTheme('system')} className="hover:bg-accent/80 hover:neon-glow-cyan transition-all duration-300 rounded-lg">
          <Monitor className="mr-2 h-4 w-4 transition-all duration-300 hover:scale-110 hover:rotate-6" />
          <span>System</span>
          {theme === 'system' && <span className="ml-auto text-xs opacity-60">•</span>}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme('light')} className="hover:bg-accent/80 hover:neon-glow-green transition-all duration-300 rounded-lg">
          <Sun className="mr-2 h-4 w-4 transition-all duration-300 hover:rotate-180 hover:scale-110" />
          <span>Light</span>
          {theme === 'light' && <span className="ml-auto text-xs opacity-60">•</span>}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme('dark')} className="hover:bg-accent/80 hover:neon-glow-purple transition-all duration-300 rounded-lg">
          <Moon className="mr-2 h-4 w-4 transition-all duration-300 hover:rotate-12 hover:scale-110" />
          <span>Dark</span>
          {theme === 'dark' && <span className="ml-auto text-xs opacity-60">•</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
}
